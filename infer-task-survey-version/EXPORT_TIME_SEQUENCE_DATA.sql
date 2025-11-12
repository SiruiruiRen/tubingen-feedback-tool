-- =====================================================
-- EXPORT TIME-SEQUENCE DATA FOR NEW USER TESTING
-- =====================================================
-- This script exports detailed time-sequence data from Supabase
-- Use filters to get only NEW data (not old version data)
-- =====================================================

-- TABLE SCHEMAS:
-- =====================================================
-- user_events: id, session_id, reflection_id, event_type, 
--              event_data (JSONB), user_agent, language, 
--              timestamp_utc
-- Note: participant_name NOT in this table - join with reflections to get it
--
-- reflections: id, session_id, participant_name, video_id, 
--              language, task_id, reflection_text, 
--              analysis_percentages (JSONB), weakest_component,
--              feedback_extended, feedback_short, revision_number,
--              parent_reflection_id, created_at
-- Note: participant_name IS the participant ID (e.g., A0895)
--
-- binary_classifications: id, session_id, reflection_id, 
--                         task_id, participant_name, video_id,
--                         language, window_id, window_text,
--                         description_score, explanation_score,
--                         prediction_score, created_at
-- Note: participant_name IS the participant ID (e.g., A0895)
-- =====================================================

-- =====================================================
-- OPTION 1: ALL USER EVENTS (Complete Time Sequence)
-- =====================================================
-- Export: session_id, event_type, timestamp, event_data
-- Useful for: Complete timeline analysis, sequence patterns

SELECT 
    ue.session_id,
    r.participant_name,
    ue.event_type,
    ue.timestamp_utc,
    ue.event_data,
    ue.user_agent,
    ue.language,
    ue.reflection_id
FROM user_events ue
LEFT JOIN reflections r ON ue.reflection_id = r.id
WHERE ue.timestamp_utc >= '2025-01-01'  -- CHANGE THIS DATE to filter for new data only
ORDER BY ue.session_id, ue.timestamp_utc;

-- =====================================================
-- OPTION 2: SESSION-LEVEL SUMMARY WITH SEQUENCE
-- =====================================================
-- Export: Participant summary with ordered event sequence
-- Useful for: Understanding each user's complete journey

SELECT 
    ue.session_id,
    MAX(r.participant_name) as participant_name,
    ue.language,
    COUNT(DISTINCT ue.reflection_id) as total_reflections,
    COUNT(*) as total_events,
    MIN(ue.timestamp_utc) as session_start,
    MAX(ue.timestamp_utc) as session_end,
    EXTRACT(EPOCH FROM (MAX(ue.timestamp_utc) - MIN(ue.timestamp_utc))) as session_duration_seconds,
    -- Get ordered event sequence
    array_agg(ue.event_type ORDER BY ue.timestamp_utc) as event_sequence,
    array_agg(ue.event_data ORDER BY ue.timestamp_utc) as event_data_sequence,
    array_agg(ue.timestamp_utc ORDER BY ue.timestamp_utc) as timestamp_sequence
FROM user_events ue
LEFT JOIN reflections r ON ue.reflection_id = r.id
WHERE ue.timestamp_utc >= '2025-01-01'  -- CHANGE THIS DATE
GROUP BY ue.session_id, ue.language
ORDER BY session_start;

-- =====================================================
-- OPTION 3: FEEDBACK READING PATTERNS
-- =====================================================
-- Export: Reading duration, tab switches, copy actions
-- Useful for: Engagement analysis, feedback effectiveness

SELECT 
    ue.session_id,
    MAX(r.participant_name) as participant_name,
    ue.reflection_id,
    COUNT(CASE WHEN ue.event_type = 'view_feedback_start' THEN 1 END) as reading_sessions,
    COUNT(CASE WHEN ue.event_type = 'select_feedback_style' THEN 1 END) as tab_switches,
    COUNT(CASE WHEN ue.event_type = 'copy_feedback' THEN 1 END) as copy_actions,
    MIN(CASE WHEN ue.event_type = 'view_feedback_start' THEN ue.timestamp_utc END) as first_read_start,
    MAX(CASE WHEN ue.event_type = 'view_feedback_end' THEN ue.timestamp_utc END) as last_read_end,
    MAX(CASE WHEN ue.event_type = 'view_feedback_end' THEN (ue.event_data->>'duration_seconds')::NUMERIC END) as total_reading_seconds
FROM user_events ue
LEFT JOIN reflections r ON ue.reflection_id = r.id
WHERE ue.timestamp_utc >= '2025-01-01'  -- CHANGE THIS DATE
GROUP BY ue.session_id, ue.reflection_id
ORDER BY ue.session_id, ue.reflection_id;

-- =====================================================
-- OPTION 4: REVISION PATTERNS WITH TIMING
-- =====================================================
-- Export: Revision counts, timing between revisions
-- Useful for: Iteration analysis, improvement patterns

SELECT 
    r.session_id,
    r.participant_name,
    r.task_id,
    r.reflection_text,
    r.revision_number,
    r.parent_reflection_id,
    r.created_at as reflection_timestamp,
    r.analysis_percentages->>'raw' as raw_percentages,
    r.analysis_percentages->>'priority' as priority_percentages,
    r.weakest_component,
    -- Calculate time since previous revision
    LAG(r.created_at) OVER (PARTITION BY r.session_id, r.task_id ORDER BY r.created_at) as previous_revision_time,
    EXTRACT(EPOCH FROM (r.created_at - LAG(r.created_at) OVER (PARTITION BY r.session_id, r.task_id ORDER BY r.created_at))) as seconds_since_previous_revision
FROM reflections r
WHERE r.created_at >= '2025-01-01'  -- CHANGE THIS DATE
ORDER BY r.session_id, r.task_id, r.revision_number;

-- =====================================================
-- OPTION 5: CSV-READY EXPORT (Copy-Paste to CSV)
-- =====================================================
-- Export: Flat table format ready for Excel/R analysis
-- Useful for: Quick analysis, data import

SELECT 
    ue.session_id,
    r.participant_name,
    r.video_id,
    r.task_id,
    ue.language,
    ue.event_type,
    ue.timestamp_utc,
    ue.event_data::text as event_data_json,
    ue.user_agent,
    r.reflection_text,
    r.revision_number,
    r.analysis_percentages->>'raw' as raw_percentages,
    r.analysis_percentages->>'priority' as priority_percentages,
    r.weakest_component
FROM user_events ue
LEFT JOIN reflections r ON ue.reflection_id = r.id
WHERE ue.timestamp_utc >= '2025-01-01'  -- CHANGE THIS DATE
ORDER BY ue.session_id, ue.timestamp_utc;

-- =====================================================
-- OPTION 6: WINDOW-LEVEL CLASSIFICATION DATA
-- =====================================================
-- Export: Binary classifications for each window
-- Useful for: Detailed component analysis

SELECT 
    bc.session_id,
    bc.reflection_id,
    bc.participant_name,
    bc.task_id,
    bc.window_id,
    bc.window_text,
    bc.description_score,
    bc.explanation_score,
    bc.prediction_score,
    bc.created_at,
    r.revision_number,
    r.reflection_text
FROM binary_classifications bc
LEFT JOIN reflections r ON bc.reflection_id = r.id
WHERE bc.created_at >= '2025-01-01'  -- CHANGE THIS DATE
ORDER BY bc.session_id, bc.reflection_id, bc.window_id;

-- =====================================================
-- HOW TO USE:
-- =====================================================
-- 1. Open Supabase Dashboard
-- 2. Go to SQL Editor
-- 3. Choose one of the queries above
-- 4. Update the date filter (replace '2025-01-01' with your cut-off date)
-- 5. Click "Run" to execute
-- 6. Click "Download CSV" to export results
-- =====================================================

-- =====================================================
-- QUICK TIME FILTER EXAMPLES:
-- =====================================================
-- For user_events table (use timestamp_utc):
-- WHERE timestamp_utc >= NOW() - INTERVAL '7 days'
-- WHERE timestamp_utc >= '2025-02-01'

-- For reflections table (use created_at):
-- WHERE created_at >= NOW() - INTERVAL '7 days'
-- WHERE created_at >= '2025-02-01'

-- For binary_classifications table (use created_at):
-- WHERE created_at >= NOW() - INTERVAL '7 days'
-- WHERE created_at >= '2025-02-01'

-- Last 7 days:
-- WHERE timestamp_utc >= NOW() - INTERVAL '7 days'

-- Last 30 days:
-- WHERE timestamp_utc >= NOW() - INTERVAL '30 days'

-- Specific date range:
-- WHERE timestamp_utc >= '2025-01-15' AND timestamp_utc < '2025-02-01'

-- Only new testing period (e.g., after Feb 1, 2025):
-- WHERE timestamp_utc >= '2025-02-01'
-- =====================================================

