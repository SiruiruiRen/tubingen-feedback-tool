-- Clean Database Schema for Tübingen Teacher Feedback Tool
-- Event-driven logging system for user behavior analysis

-- ===========================
-- 1. MAIN REFLECTIONS TABLE (Clean)
-- ===========================
DROP TABLE IF EXISTS reflections CASCADE;
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
-- 2. USER INTERACTION EVENTS TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS user_events (
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
-- 3. READING PATTERNS VIEW
-- ===========================
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

-- ===========================
-- 4. REVISION PATTERNS VIEW  
-- ===========================
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
revision_submissions AS (
    SELECT 
        session_id,
        reflection_id,
        timestamp_utc as resubmitted_at,
        ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY timestamp_utc) as resubmission_number
    FROM user_events 
    WHERE event_type = 'resubmit_reflection'
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

-- ===========================
-- 5. PARTICIPANT SUMMARY VIEW
-- ===========================
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
    
    -- Rating data
    r.capabilities_rating,
    r.ease_rating,
    r.umux_score,
    
    -- Timestamps
    MIN(r.created_at) as first_submission,
    MAX(r.created_at) as last_submission,
    MAX(r.rated_at) as rated_at
    
FROM reflections r
LEFT JOIN reading_patterns rp ON r.session_id = rp.session_id
LEFT JOIN user_events ue ON r.session_id = ue.session_id
WHERE r.revision_number = (SELECT MAX(revision_number) FROM reflections r2 WHERE r2.session_id = r.session_id)
GROUP BY r.session_id, r.participant_name, r.language, r.video_id, 
         r.capabilities_rating, r.ease_rating, r.umux_score;

-- ===========================
-- 6. INDEXES FOR PERFORMANCE
-- ===========================
CREATE INDEX idx_reflections_session_id ON reflections(session_id);
CREATE INDEX idx_reflections_revision ON reflections(revision_number);
CREATE INDEX idx_reflections_parent ON reflections(parent_reflection_id);
CREATE INDEX idx_user_events_session ON user_events(session_id);
CREATE INDEX idx_user_events_type ON user_events(event_type);
CREATE INDEX idx_user_events_timestamp ON user_events(timestamp_utc);
CREATE INDEX idx_user_events_reflection ON user_events(reflection_id);

-- ===========================
-- 7. SAMPLE EVENT TRACKING QUERIES
-- ===========================

-- Query 1: How long do users spend reading different feedback styles?
/*
SELECT 
    feedback_style,
    feedback_language,
    AVG(reading_duration_seconds) as avg_duration,
    COUNT(*) as total_views
FROM reading_patterns 
GROUP BY feedback_style, feedback_language
ORDER BY avg_duration DESC;
*/

-- Query 2: What triggers users to revise their reflections?
/*
SELECT 
    clicked_from_style,
    COUNT(*) as revision_count,
    AVG(length_change) as avg_text_change
FROM revision_patterns 
GROUP BY clicked_from_style;
*/

-- Query 3: How do reading patterns change after revision?
/*
WITH pre_revision AS (
    SELECT session_id, AVG(reading_duration_seconds) as pre_duration
    FROM reading_patterns 
    WHERE revision_number = 1
    GROUP BY session_id
),
post_revision AS (
    SELECT session_id, AVG(reading_duration_seconds) as post_duration
    FROM reading_patterns 
    WHERE revision_number > 1
    GROUP BY session_id
)
SELECT 
    AVG(post_duration - pre_duration) as avg_duration_change
FROM pre_revision pr
JOIN post_revision po ON pr.session_id = po.session_id;
*/

-- Query 4: User engagement patterns
/*
SELECT 
    participant_name,
    total_submissions,
    revisions,
    styles_viewed,
    avg_reading_duration,
    umux_score
FROM participant_summary
ORDER BY umux_score DESC NULLS LAST;
*/ 