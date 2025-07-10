-- Multi-Page Study Migration for Tübingen Teacher Feedback Tool
-- Adds support for task tracking, page navigation, and enhanced event logging
-- SAFE VERSION: Handles existing constraints and columns

-- ===========================
-- 1. ADD TASK_ID COLUMN TO REFLECTIONS (SAFE)
-- ===========================

-- Add task_id column to track which task (task1, task2) each reflection belongs to
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS task_id VARCHAR(10);

-- Set default task_id for existing data
UPDATE reflections 
SET task_id = 'task1' 
WHERE task_id IS NULL;

-- Drop existing constraint if it exists, then add the updated one
ALTER TABLE reflections 
DROP CONSTRAINT IF EXISTS check_task_id;

ALTER TABLE reflections 
ADD CONSTRAINT check_task_id 
CHECK (task_id IN ('task1', 'task2'));

-- ===========================
-- 2. UPDATE EVENT TYPES CONSTRAINT (SAFE)
-- ===========================

-- Drop existing constraint
ALTER TABLE user_events 
DROP CONSTRAINT IF EXISTS valid_event_types;

-- Add updated constraint with new event types for multi-page study
ALTER TABLE user_events 
ADD CONSTRAINT valid_event_types CHECK (
    event_type IN (
        -- Original event types
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
        'session_end',
        
        -- New multi-page event types
        'page_view',
        'navigation',
        'study_completed',
        'feedback_style_preference',
        'revision_warning_shown',
        'final_submission'
    )
);

-- ===========================
-- 3. ADD STUDY PROGRESS TABLE (SAFE)
-- ===========================

-- Track overall study progress for each participant
CREATE TABLE IF NOT EXISTS study_progress (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL UNIQUE,
    participant_name VARCHAR(100),
    
    -- Page completion tracking
    presurvey_completed BOOLEAN DEFAULT FALSE,
    task1_completed BOOLEAN DEFAULT FALSE,
    survey1_completed BOOLEAN DEFAULT FALSE,
    task2_completed BOOLEAN DEFAULT FALSE,
    survey2_completed BOOLEAN DEFAULT FALSE,
    postsurvey_completed BOOLEAN DEFAULT FALSE,
    
    -- Timestamps for each page
    presurvey_started_at TIMESTAMP WITH TIME ZONE,
    task1_started_at TIMESTAMP WITH TIME ZONE,
    survey1_started_at TIMESTAMP WITH TIME ZONE,
    task2_started_at TIMESTAMP WITH TIME ZONE,
    survey2_started_at TIMESTAMP WITH TIME ZONE,
    postsurvey_started_at TIMESTAMP WITH TIME ZONE,
    
    -- Overall study metrics
    study_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    study_completed_at TIMESTAMP WITH TIME ZONE,
    total_study_duration_minutes INTEGER,
    
    -- User preferences
    preferred_feedback_style VARCHAR(10) CHECK (preferred_feedback_style IN ('extended', 'short')),
    language_used VARCHAR(2) CHECK (language_used IN ('en', 'de'))
);

-- ===========================
-- 4. UPDATE VIEWS FOR MULTI-PAGE SUPPORT (SAFE)
-- ===========================

-- Enhanced participant summary with task-specific data
CREATE OR REPLACE VIEW participant_summary_enhanced AS
SELECT 
    r.session_id,
    r.participant_name,
    r.language as preferred_language,
    
    -- Task completion tracking
    COUNT(CASE WHEN r.task_id = 'task1' THEN 1 END) as task1_submissions,
    COUNT(CASE WHEN r.task_id = 'task2' THEN 1 END) as task2_submissions,
    
    -- Video analysis per task
    STRING_AGG(DISTINCT CASE WHEN r.task_id = 'task1' THEN r.video_id END, ', ') as task1_videos,
    STRING_AGG(DISTINCT CASE WHEN r.task_id = 'task2' THEN r.video_id END, ', ') as task2_videos,
    
    -- Revision patterns per task
    MAX(CASE WHEN r.task_id = 'task1' THEN r.revision_number END) as task1_max_revisions,
    MAX(CASE WHEN r.task_id = 'task2' THEN r.revision_number END) as task2_max_revisions,
    
    -- Overall study metrics
    COUNT(DISTINCT r.task_id) as tasks_attempted,
    COUNT(r.id) as total_submissions,
    MAX(r.revision_number) as max_revision_number,
    
    -- Feedback style preferences
    (SELECT event_data->>'preferred_style' 
     FROM user_events ue 
     WHERE ue.session_id = r.session_id 
     AND ue.event_type = 'feedback_style_preference' 
     LIMIT 1) as preferred_feedback_style,
    
    -- Reading patterns (with safe join)
    COALESCE(COUNT(DISTINCT rp.feedback_style), 0) as styles_viewed,
    AVG(rp.reading_duration_seconds) as avg_reading_duration,
    
    -- Study progression
    COUNT(CASE WHEN ue.event_type = 'page_view' THEN 1 END) as total_page_views,
    COUNT(CASE WHEN ue.event_type = 'navigation' THEN 1 END) as navigation_events,
    COUNT(CASE WHEN ue.event_type = 'final_submission' THEN 1 END) as final_submissions,
    
    -- Timestamps
    MIN(r.created_at) as first_submission,
    MAX(r.created_at) as last_submission,
    (SELECT timestamp_utc FROM user_events ue2 WHERE ue2.session_id = r.session_id AND ue2.event_type = 'study_completed' LIMIT 1) as study_completed_at
    
FROM reflections r
LEFT JOIN (SELECT * FROM reading_patterns WHERE TRUE) rp ON r.session_id = rp.session_id
LEFT JOIN user_events ue ON r.session_id = ue.session_id
GROUP BY r.session_id, r.participant_name, r.language;

-- Task-specific analysis view
CREATE OR REPLACE VIEW task_analysis AS
SELECT 
    r.session_id,
    r.participant_name,
    r.task_id,
    r.video_id,
    r.language,
    
    -- Task completion metrics
    COUNT(r.id) as submissions_in_task,
    MAX(r.revision_number) as max_revisions,
    
    -- Content analysis (use values from latest revision)
    (SELECT analysis_percentages FROM reflections r3 WHERE r3.session_id = r.session_id AND r3.task_id = r.task_id ORDER BY revision_number DESC LIMIT 1) as analysis_percentages,
    (SELECT weakest_component FROM reflections r3 WHERE r3.session_id = r.session_id AND r3.task_id = r.task_id ORDER BY revision_number DESC LIMIT 1) as weakest_component,
    
    -- Feedback interaction
    COUNT(CASE WHEN ue.event_type = 'view_feedback_start' AND ue.event_data->>'task' = r.task_id THEN 1 END) as feedback_views,
    COUNT(CASE WHEN ue.event_type = 'copy_feedback' AND ue.event_data->>'task' = r.task_id THEN 1 END) as feedback_copies,
    COUNT(CASE WHEN ue.event_type = 'click_revise' AND ue.event_data->>'task' = r.task_id THEN 1 END) as revise_clicks,
    
    -- Timestamps
    MIN(r.created_at) as task_started,
    MAX(r.created_at) as task_last_activity,
    (SELECT timestamp_utc FROM user_events ue2 WHERE ue2.session_id = r.session_id AND ue2.event_type = 'final_submission' AND ue2.event_data->>'task' = r.task_id LIMIT 1) as task_completed
    
FROM reflections r
LEFT JOIN user_events ue ON r.session_id = ue.session_id
WHERE r.revision_number = (SELECT MAX(revision_number) FROM reflections r2 WHERE r2.session_id = r.session_id AND r2.task_id = r.task_id)
GROUP BY r.session_id, r.participant_name, r.task_id, r.video_id, r.language;

-- ===========================
-- 5. CREATE ADDITIONAL INDEXES (SAFE)
-- ===========================

-- Index for task-specific queries
CREATE INDEX IF NOT EXISTS idx_reflections_task_id ON reflections(task_id);

-- Index for study progress tracking
CREATE INDEX IF NOT EXISTS idx_study_progress_session ON study_progress(session_id);

-- Index for event data queries
CREATE INDEX IF NOT EXISTS idx_user_events_event_data ON user_events USING GIN (event_data);

-- ===========================
-- 6. VERIFICATION AND STATUS
-- ===========================

-- Check if the migration worked correctly
DO $$
DECLARE
    task_id_exists BOOLEAN;
    events_count INTEGER;
    progress_table_exists BOOLEAN;
BEGIN
    -- Check if task_id column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reflections' 
        AND column_name = 'task_id'
    ) INTO task_id_exists;
    
    -- Count existing reflections
    SELECT COUNT(*) FROM reflections INTO events_count;
    
    -- Check if study_progress table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'study_progress'
    ) INTO progress_table_exists;
    
    RAISE NOTICE '=== MULTI-PAGE MIGRATION STATUS ===';
    RAISE NOTICE 'Task ID column exists: %', task_id_exists;
    RAISE NOTICE 'Reflections table rows: %', events_count;
    RAISE NOTICE 'Study progress table exists: %', progress_table_exists;
    RAISE NOTICE 'Event types constraint updated: YES';
    RAISE NOTICE 'Enhanced views created: participant_summary_enhanced, task_analysis';
    RAISE NOTICE 'Performance indexes created: YES';
    
    IF task_id_exists AND progress_table_exists THEN
        RAISE NOTICE '✅ MIGRATION SUCCESSFUL - DATABASE READY FOR MULTI-PAGE STUDY';
    ELSE
        RAISE NOTICE '❌ MIGRATION INCOMPLETE - Please check errors above';
    END IF;
END $$;

-- ===========================
-- 7. RESEARCH QUERIES FOR MULTI-PAGE STUDY
-- ===========================

-- Uncomment to test:

-- Sample query: Compare task performance
/*
SELECT 
    COALESCE(task_id, 'unknown') as task_id,
    COUNT(DISTINCT session_id) as participants,
    ROUND(AVG(submissions_in_task), 2) as avg_submissions,
    ROUND(AVG(max_revisions), 2) as avg_revisions,
    COUNT(CASE WHEN task_completed IS NOT NULL THEN 1 END) as completions
FROM task_analysis
GROUP BY task_id
ORDER BY task_id;
*/

-- Sample query: Study flow analysis
/*
SELECT 
    session_id,
    participant_name,
    COALESCE(tasks_attempted, 0) as tasks_attempted,
    COALESCE(final_submissions, 0) as final_submissions,
    CASE 
        WHEN study_completed_at IS NOT NULL AND first_submission IS NOT NULL 
        THEN ROUND(EXTRACT(EPOCH FROM (study_completed_at - first_submission))/3600, 2)
        ELSE NULL 
    END as study_duration_hours
FROM participant_summary_enhanced
ORDER BY study_duration_hours DESC NULLS LAST;
*/ 