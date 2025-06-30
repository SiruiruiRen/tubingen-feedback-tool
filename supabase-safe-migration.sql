-- Safe Migration Script for Tübingen Teacher Feedback Tool
-- This script safely migrates existing data to the new schema

-- ===========================
-- 1. BACKUP EXISTING DATA (if any)
-- ===========================

-- Create temporary backup of existing reflections data
CREATE TABLE IF NOT EXISTS reflections_backup AS 
SELECT * FROM reflections WHERE 1=0; -- Create empty backup table with same structure

-- Only backup if reflections table exists and has data
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reflections') THEN
        INSERT INTO reflections_backup SELECT * FROM reflections;
        RAISE NOTICE 'Backed up % rows from reflections table', (SELECT COUNT(*) FROM reflections_backup);
    END IF;
END $$;

-- ===========================
-- 2. DROP EXISTING TABLES SAFELY
-- ===========================

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS reading_patterns CASCADE;
DROP VIEW IF EXISTS revision_patterns CASCADE;
DROP VIEW IF EXISTS participant_summary CASCADE;

-- Drop tables in correct order (handle foreign key dependencies)
DROP TABLE IF EXISTS user_events CASCADE;
DROP TABLE IF EXISTS reflections CASCADE;

-- ===========================
-- 3. CREATE NEW REFLECTIONS TABLE
-- ===========================
CREATE TABLE reflections (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    participant_name VARCHAR(100) NOT NULL,
    video_id VARCHAR(10) NOT NULL,
    language VARCHAR(2) NOT NULL CHECK (language IN ('en', 'de')),
    
    -- Original reflection and analysis
    reflection_text TEXT NOT NULL,
    analysis_percentages JSONB NOT NULL,
    weakest_component VARCHAR(20) NOT NULL,
    
    -- Generated feedback
    feedback_extended TEXT NOT NULL,
    feedback_short TEXT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Revision tracking
    revision_number INTEGER DEFAULT 1,
    parent_reflection_id INTEGER REFERENCES reflections(id),
    
    -- Rating data
    capabilities_rating INTEGER CHECK (capabilities_rating >= 1 AND capabilities_rating <= 5),
    ease_rating INTEGER CHECK (ease_rating >= 1 AND ease_rating <= 5),
    umux_score DECIMAL(5,2),
    rated_at TIMESTAMP WITH TIME ZONE
);

-- ===========================
-- 4. CREATE USER EVENTS TABLE
-- ===========================
CREATE TABLE user_events (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    reflection_id INTEGER REFERENCES reflections(id),
    
    -- Event details
    event_type VARCHAR(30) NOT NULL,
    timestamp_utc TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Event-specific data
    event_data JSONB,
    
    -- User context
    user_agent TEXT,
    language VARCHAR(2),
    
    CONSTRAINT valid_event_types CHECK (
        event_type IN (
            'submit_reflection',
            'resubmit_reflection',
            'resubmit_same_text',
            'select_feedback_style',
            'view_feedback_start',
            'view_feedback_end',
            'click_revise',
            'submit_rating',
            'learn_concepts_interaction',
            'copy_feedback',
            'session_start',
            'session_end'
        )
    )
);

-- ===========================
-- 5. MIGRATE EXISTING DATA (if any)
-- ===========================

-- Migrate data from backup if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reflections_backup') 
       AND (SELECT COUNT(*) FROM reflections_backup) > 0 THEN
        
        -- Insert migrated data with new schema
        INSERT INTO reflections (
            session_id,
            participant_name,
            video_id,
            language,
            reflection_text,
            analysis_percentages,
            weakest_component,
            feedback_extended,
            feedback_short,
            created_at,
            revision_number,
            parent_reflection_id,
            capabilities_rating,
            ease_rating,
            umux_score,
            rated_at
        )
        SELECT 
            COALESCE(session_id, 'migrated_' || id::text) as session_id,
            COALESCE(student_name, participant_name, 'Unknown') as participant_name,
            COALESCE(video_id, 'unknown') as video_id,
            CASE 
                WHEN language = 'en' OR language = 'de' THEN language::varchar(2)
                ELSE 'en'
            END as language,
            reflection_text,
            COALESCE(analysis_percentages, '{"description": 33, "explanation": 33, "prediction": 34, "other": 0}'::jsonb) as analysis_percentages,
            'Prediction' as weakest_component, -- Default value
            COALESCE(feedback_text, 'Migrated feedback') as feedback_extended,
            COALESCE(feedback_text_short, 'Migrated short feedback') as feedback_short,
            COALESCE(created_at, NOW()) as created_at,
            1 as revision_number, -- All existing are original submissions
            NULL as parent_reflection_id,
            capabilities_rating,
            ease_rating,
            umux_score,
            rated_at
        FROM reflections_backup;
        
        RAISE NOTICE 'Migrated % rows to new reflections table', (SELECT COUNT(*) FROM reflections);
    END IF;
END $$;

-- ===========================
-- 6. CREATE ANALYSIS VIEWS
-- ===========================

-- Reading patterns view
CREATE OR REPLACE VIEW reading_patterns AS
WITH feedback_sessions AS (
    SELECT 
        session_id,
        reflection_id,
        event_data->>'style' as feedback_style,
        event_data->>'language' as feedback_language,
        MIN(CASE WHEN event_type = 'view_feedback_start' THEN timestamp_utc END) as start_time,
        MAX(CASE WHEN event_type = 'view_feedback_end' THEN timestamp_utc END) as end_time
    FROM user_events 
    WHERE event_type IN ('view_feedback_start', 'view_feedback_end')
    GROUP BY session_id, reflection_id, event_data->>'style', event_data->>'language'
),
reading_durations AS (
    SELECT 
        session_id,
        reflection_id,
        feedback_style,
        feedback_language,
        EXTRACT(EPOCH FROM (end_time - start_time)) as reading_duration_seconds
    FROM feedback_sessions
    WHERE start_time IS NOT NULL AND end_time IS NOT NULL
)
SELECT 
    rd.session_id,
    rd.reflection_id,
    r.participant_name,
    r.revision_number,
    rd.feedback_style,
    rd.feedback_language,
    rd.reading_duration_seconds,
    CASE 
        WHEN rd.reading_duration_seconds < 30 THEN 'quick_scan'
        WHEN rd.reading_duration_seconds < 120 THEN 'normal_read'
        ELSE 'deep_read'
    END as reading_pattern
FROM reading_durations rd
JOIN reflections r ON rd.reflection_id = r.id;

-- Revision patterns view
CREATE OR REPLACE VIEW revision_patterns AS
WITH revision_events AS (
    SELECT 
        session_id,
        reflection_id,
        timestamp_utc as revision_clicked_at,
        event_data->>'from_style' as clicked_from_style,
        ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY timestamp_utc) as revision_attempt
    FROM user_events 
    WHERE event_type = 'click_revise'
),
revision_analysis AS (
    SELECT 
        r1.session_id,
        r1.participant_name,
        r1.id as original_reflection_id,
        r1.reflection_text as original_text,
        r1.analysis_percentages as original_analysis,
        r2.id as revised_reflection_id,
        r2.reflection_text as revised_text,
        r2.analysis_percentages as revised_analysis,
        r2.revision_number,
        r2.created_at as revised_at
    FROM reflections r1
    JOIN reflections r2 ON r1.id = r2.parent_reflection_id
)
SELECT 
    ra.session_id,
    ra.participant_name,
    ra.original_reflection_id,
    ra.revised_reflection_id,
    ra.revision_number,
    re.clicked_from_style,
    ra.revised_at,
    
    -- Text analysis
    LENGTH(ra.original_text) as original_length,
    LENGTH(ra.revised_text) as revised_length,
    LENGTH(ra.revised_text) - LENGTH(ra.original_text) as length_change,
    
    -- Analysis changes
    ra.original_analysis,
    ra.revised_analysis,
    
    -- Calculate percentage changes
    (ra.revised_analysis->>'description')::int - (ra.original_analysis->>'description')::int as description_change,
    (ra.revised_analysis->>'explanation')::int - (ra.original_analysis->>'explanation')::int as explanation_change,
    (ra.revised_analysis->>'prediction')::int - (ra.original_analysis->>'prediction')::int as prediction_change
    
FROM revision_analysis ra
LEFT JOIN revision_events re ON ra.session_id = re.session_id 
    AND re.revision_attempt = ra.revision_number;

-- Participant summary view
CREATE OR REPLACE VIEW participant_summary AS
SELECT 
    r.session_id,
    r.participant_name,
    r.language as preferred_language,
    r.video_id,
    
    -- Submission patterns
    COUNT(r.id) as total_submissions,
    COUNT(CASE WHEN r.revision_number = 1 THEN 1 END) as original_submissions,
    COUNT(CASE WHEN r.revision_number > 1 THEN 1 END) as revisions,
    MAX(r.revision_number) as max_revision_number,
    
    -- Reading patterns
    COUNT(DISTINCT rp.feedback_style) as styles_viewed,
    COUNT(DISTINCT rp.feedback_language) as languages_viewed,
    AVG(rp.reading_duration_seconds) as avg_reading_duration,
    
    -- Interaction patterns  
    COUNT(CASE WHEN ue.event_type = 'expand_definitions' THEN 1 END) as definitions_expanded,
    COUNT(CASE WHEN ue.event_type = 'copy_feedback' THEN 1 END) as feedback_copied,
    
    -- Rating data (from the latest submission)
    (SELECT capabilities_rating FROM reflections r2 WHERE r2.session_id = r.session_id ORDER BY revision_number DESC LIMIT 1) as capabilities_rating,
    (SELECT ease_rating FROM reflections r2 WHERE r2.session_id = r.session_id ORDER BY revision_number DESC LIMIT 1) as ease_rating,
    (SELECT umux_score FROM reflections r2 WHERE r2.session_id = r.session_id ORDER BY revision_number DESC LIMIT 1) as umux_score,
    
    -- Timestamps
    MIN(r.created_at) as first_submission,
    MAX(r.created_at) as last_submission,
    (SELECT rated_at FROM reflections r2 WHERE r2.session_id = r.session_id AND rated_at IS NOT NULL ORDER BY rated_at DESC LIMIT 1) as rated_at
    
FROM reflections r
LEFT JOIN reading_patterns rp ON r.session_id = rp.session_id
LEFT JOIN user_events ue ON r.session_id = ue.session_id
GROUP BY r.session_id, r.participant_name, r.language, r.video_id;

-- ===========================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- ===========================
CREATE INDEX idx_reflections_session_id ON reflections(session_id);
CREATE INDEX idx_reflections_revision ON reflections(revision_number);
CREATE INDEX idx_reflections_parent ON reflections(parent_reflection_id);
CREATE INDEX idx_user_events_session ON user_events(session_id);
CREATE INDEX idx_user_events_type ON user_events(event_type);
CREATE INDEX idx_user_events_timestamp ON user_events(timestamp_utc);
CREATE INDEX idx_user_events_reflection ON user_events(reflection_id);

-- ===========================
-- 8. CLEANUP
-- ===========================

-- Drop backup table (comment out if you want to keep it)
-- DROP TABLE IF EXISTS reflections_backup;

-- ===========================
-- 9. VERIFICATION
-- ===========================

-- Show migration results
DO $$
BEGIN
    RAISE NOTICE '=== MIGRATION COMPLETE ===';
    RAISE NOTICE 'Reflections table: % rows', (SELECT COUNT(*) FROM reflections);
    RAISE NOTICE 'User events table: % rows', (SELECT COUNT(*) FROM user_events);
    RAISE NOTICE 'Views created: reading_patterns, revision_patterns, participant_summary';
    RAISE NOTICE 'Indexes created: 7 performance indexes';
    RAISE NOTICE '=== READY FOR USE ===';
END $$; 