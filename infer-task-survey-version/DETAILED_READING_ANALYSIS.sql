-- =====================================================
-- DETAILED READING ANALYSIS FOR NEW USER TESTING
-- =====================================================
-- This provides granular reading session data:
-- - First feedback choice (extended/short)
-- - Duration of each reading session
-- - Number of tab switches
-- - Duration per switch
-- =====================================================

-- =====================================================
-- QUERY 1: READING SESSION DETAILS
-- =====================================================
-- Shows each individual reading session with duration

WITH reading_sessions AS (
    SELECT 
        ue.session_id,
        r.participant_name,
        r.task_id,
        ue.reflection_id,
        ue.event_data->>'style' as feedback_style,
        ue.event_data->>'duration_seconds' as duration_seconds,
        ue.timestamp_utc,
        ROW_NUMBER() OVER (PARTITION BY ue.session_id, r.task_id ORDER BY ue.timestamp_utc) as reading_session_number
    FROM user_events ue
    LEFT JOIN reflections r ON ue.reflection_id = r.id
    WHERE ue.event_type = 'view_feedback_end'
      AND ue.timestamp_utc >= '2025-01-01'  -- CHANGE THIS DATE
      AND ue.event_data->>'duration_seconds' IS NOT NULL
)
SELECT 
    session_id,
    participant_name,
    task_id,
    reflection_id,
    reading_session_number,
    feedback_style,
    duration_seconds::NUMERIC as duration_seconds,
    timestamp_utc as session_end_time
FROM reading_sessions
ORDER BY session_id, task_id, reading_session_number;

-- =====================================================
-- QUERY 2: FIRST FEEDBACK CHOICE PER SESSION
-- =====================================================
-- Shows what feedback style users chose first

WITH first_choice AS (
    SELECT 
        ue.session_id,
        r.participant_name,
        r.task_id,
        ue.event_data->>'preferred_style' as first_choice,
        ue.timestamp_utc as choice_time,
        ROW_NUMBER() OVER (PARTITION BY ue.session_id, r.task_id ORDER BY ue.timestamp_utc) as choice_order
    FROM user_events ue
    LEFT JOIN reflections r ON ue.reflection_id = r.id
    WHERE ue.event_type = 'feedback_style_preference'
      AND ue.timestamp_utc >= '2025-01-01'  -- CHANGE THIS DATE
)
SELECT 
    session_id,
    participant_name,
    task_id,
    first_choice,
    choice_time
FROM first_choice
WHERE choice_order = 1
ORDER BY session_id, task_id;

-- =====================================================
-- QUERY 3: TAB SWITCH SUMMARY
-- =====================================================
-- Shows number of switches and timing

WITH switches AS (
    SELECT 
        ue.session_id,
        r.participant_name,
        r.task_id,
        ue.reflection_id,
        ue.event_data->>'preferred_style' as switched_to,
        ue.timestamp_utc,
        ROW_NUMBER() OVER (PARTITION BY ue.session_id, r.task_id, ue.reflection_id ORDER BY ue.timestamp_utc) as switch_number
    FROM user_events ue
    LEFT JOIN reflections r ON ue.reflection_id = r.id
    WHERE ue.event_type = 'select_feedback_style'
      AND ue.timestamp_utc >= '2025-01-01'  -- CHANGE THIS DATE
)
SELECT 
    session_id,
    participant_name,
    task_id,
    reflection_id,
    COUNT(*) as total_switches,
    array_agg(switched_to ORDER BY timestamp_utc) as switch_sequence,
    array_agg(timestamp_utc ORDER BY timestamp_utc) as switch_times
FROM switches
GROUP BY session_id, participant_name, task_id, reflection_id
ORDER BY session_id, task_id, reflection_id;

-- =====================================================
-- QUERY 4: COMPLETE READING ANALYSIS PER USER
-- =====================================================
-- Combines first choice, switches, and durations

WITH first_choice AS (
    SELECT 
        ue.session_id,
        r.participant_name,
        r.task_id,
        ue.event_data->>'preferred_style' as first_choice,
        ROW_NUMBER() OVER (PARTITION BY ue.session_id, r.task_id ORDER BY ue.timestamp_utc) as choice_order
    FROM user_events ue
    LEFT JOIN reflections r ON ue.reflection_id = r.id
    WHERE ue.event_type = 'feedback_style_preference'
      AND ue.timestamp_utc >= '2025-01-01'
),
reading_stats AS (
    SELECT 
        ue.session_id,
        r.participant_name,
        r.task_id,
        COUNT(DISTINCT CASE WHEN ue.event_type = 'view_feedback_end' THEN ue.id END) as total_reading_sessions,
        COUNT(DISTINCT CASE WHEN ue.event_type = 'select_feedback_style' THEN ue.id END) as total_switches,
        SUM(CASE WHEN ue.event_type = 'view_feedback_end' THEN (ue.event_data->>'duration_seconds')::NUMERIC ELSE 0 END) as total_reading_seconds,
        array_agg(DISTINCT ue.event_data->>'style' ORDER BY ue.event_data->>'style') FILTER (WHERE ue.event_type = 'view_feedback_end') as styles_read
    FROM user_events ue
    LEFT JOIN reflections r ON ue.reflection_id = r.id
    WHERE (ue.event_type IN ('view_feedback_end', 'select_feedback_style'))
      AND ue.timestamp_utc >= '2025-01-01'
    GROUP BY ue.session_id, r.participant_name, r.task_id
)
SELECT 
    rs.session_id,
    rs.participant_name,
    rs.task_id,
    fc.first_choice,
    rs.total_reading_sessions,
    rs.total_switches,
    rs.total_reading_seconds,
    rs.styles_read
FROM reading_stats rs
LEFT JOIN first_choice fc ON rs.session_id = fc.session_id 
    AND rs.task_id = fc.task_id 
    AND fc.choice_order = 1
ORDER BY rs.session_id, rs.task_id;

-- =====================================================
-- QUERY 5: EACH READING SESSION WITH SWITCH CONTEXT
-- =====================================================
-- Shows each reading session with what happened before/after

WITH reading_events AS (
    SELECT 
        ue.session_id,
        r.participant_name,
        r.task_id,
        ue.reflection_id,
        ue.event_type,
        ue.event_data->>'style' as feedback_style,
        ue.event_data->>'duration_seconds' as duration_seconds,
        ue.timestamp_utc,
        ROW_NUMBER() OVER (PARTITION BY ue.session_id, r.task_id ORDER BY ue.timestamp_utc) as event_number,
        LAG(ue.event_type) OVER (PARTITION BY ue.session_id, r.task_id ORDER BY ue.timestamp_utc) as previous_event,
        LAG(ue.event_data->>'style') OVER (PARTITION BY ue.session_id, r.task_id ORDER BY ue.timestamp_utc) as previous_style
    FROM user_events ue
    LEFT JOIN reflections r ON ue.reflection_id = r.id
    WHERE ue.event_type IN ('view_feedback_start', 'view_feedback_end', 'select_feedback_style', 'feedback_style_preference')
      AND ue.timestamp_utc >= '2025-01-01'  -- CHANGE THIS DATE
)
SELECT 
    session_id,
    participant_name,
    task_id,
    reflection_id,
    event_number,
    event_type,
    feedback_style,
    duration_seconds::NUMERIC,
    previous_event,
    previous_style,
    timestamp_utc,
    CASE 
        WHEN event_type = 'feedback_style_preference' THEN 'Initial choice'
        WHEN event_type = 'select_feedback_style' AND previous_style IS NOT NULL AND previous_style != feedback_style THEN 'Tab switch'
        WHEN event_type = 'view_feedback_start' THEN 'Started reading'
        WHEN event_type = 'view_feedback_end' THEN 'Finished reading'
        ELSE 'Other'
    END as event_description
FROM reading_events
ORDER BY session_id, task_id, event_number;

-- =====================================================
-- QUERY 6: REVISION TIMING PER USER PER VIDEO
-- =====================================================
-- Fixed: Shows correct revision timing for each user in each video/task

WITH reflection_sequence AS (
    SELECT 
        session_id,
        participant_name,
        video_id,
        task_id,
        id as reflection_id,
        revision_number,
        parent_reflection_id,
        created_at,
        LENGTH(reflection_text) as reflection_length,
        analysis_percentages,
        weakest_component,
        -- Time since previous revision (for same user, same video, same task)
        LAG(created_at) OVER (PARTITION BY session_id, video_id, task_id ORDER BY revision_number) as previous_revision_time,
        EXTRACT(EPOCH FROM (
            created_at - LAG(created_at) OVER (PARTITION BY session_id, video_id, task_id ORDER BY revision_number)
        )) as seconds_since_previous_revision
    FROM reflections
    WHERE created_at >= '2025-01-01'  -- CHANGE THIS DATE
)
SELECT 
    session_id,
    participant_name,
    video_id,
    task_id,
    reflection_id,
    revision_number,
    created_at as revision_timestamp,
    reflection_length,
    analysis_percentages->>'raw' as raw_percentages,
    analysis_percentages->>'priority' as priority_percentages,
    weakest_component,
    previous_revision_time,
    seconds_since_previous_revision,
    ROUND(seconds_since_previous_revision / 60, 2) as minutes_since_previous_revision
FROM reflection_sequence
ORDER BY session_id, video_id, task_id, revision_number;

-- =====================================================
-- QUERY 7: READING PATTERNS BETWEEN REVISIONS
-- =====================================================
-- Shows feedback reading behavior between each revision

WITH reflections_with_timing AS (
    SELECT 
        id,
        session_id,
        participant_name,
        task_id,
        revision_number,
        created_at,
        LAG(created_at) OVER (PARTITION BY session_id, task_id ORDER BY revision_number) as previous_revision_time
    FROM reflections
    WHERE created_at >= '2025-01-01'
),
reading_between_revisions AS (
    SELECT 
        r.session_id,
        r.participant_name,
        r.task_id,
        r.revision_number,
        r.created_at as current_revision_time,
        r.previous_revision_time,
        -- Count reading sessions between revisions
        COUNT(CASE WHEN ue.event_type = 'view_feedback_end' THEN 1 END) as reading_sessions,
        -- Count tab switches
        COUNT(CASE WHEN ue.event_type = 'select_feedback_style' THEN 1 END) as tab_switches,
        -- Total reading time
        SUM(CASE WHEN ue.event_type = 'view_feedback_end' 
            THEN (ue.event_data->>'duration_seconds')::NUMERIC 
            ELSE 0 
        END) as total_reading_seconds,
        -- First style chosen after previous revision
        MIN(CASE WHEN ue.event_type = 'view_feedback_start' 
            THEN ue.event_data->>'style' 
        END) as first_style_read,
        -- Last style read before this revision
        MAX(CASE WHEN ue.event_type = 'view_feedback_end' 
            THEN ue.event_data->>'style' 
        END) as last_style_read
    FROM reflections_with_timing r
    LEFT JOIN user_events ue ON r.session_id = ue.session_id
        AND ue.timestamp_utc BETWEEN COALESCE(r.previous_revision_time, r.current_revision_time - INTERVAL '1 day') 
                                AND r.current_revision_time
    WHERE ue.timestamp_utc >= '2025-01-01'
    GROUP BY r.session_id, r.participant_name, r.task_id, r.revision_number, 
             r.current_revision_time, r.previous_revision_time
)
SELECT 
    session_id,
    participant_name,
    task_id,
    revision_number,
    current_revision_time,
    previous_revision_time,
    EXTRACT(EPOCH FROM (current_revision_time - previous_revision_time)) / 60 as minutes_between_revisions,
    reading_sessions,
    tab_switches,
    total_reading_seconds,
    ROUND(total_reading_seconds / 60, 2) as total_reading_minutes,
    first_style_read,
    last_style_read
FROM reading_between_revisions
ORDER BY session_id, task_id, revision_number;

-- =====================================================
-- QUERY 8: DETAILED SWITCH-BY-SWITCH ANALYSIS
-- =====================================================
-- Shows each individual tab switch with timing

WITH tab_switches AS (
    SELECT 
        ue.session_id,
        r.participant_name,
        r.task_id,
        ue.reflection_id,
        ue.event_data->>'preferred_style' as switched_to,
        ue.timestamp_utc as switch_time,
        ROW_NUMBER() OVER (PARTITION BY ue.session_id, r.task_id, ue.reflection_id ORDER BY ue.timestamp_utc) as switch_number,
        LAG(ue.event_data->>'preferred_style') OVER (PARTITION BY ue.session_id, r.task_id, ue.reflection_id ORDER BY ue.timestamp_utc) as switched_from,
        LAG(ue.timestamp_utc) OVER (PARTITION BY ue.session_id, r.task_id, ue.reflection_id ORDER BY ue.timestamp_utc) as previous_switch_time
    FROM user_events ue
    LEFT JOIN reflections r ON ue.reflection_id = r.id
    WHERE ue.event_type = 'select_feedback_style'
      AND ue.timestamp_utc >= '2025-01-01'  -- CHANGE THIS DATE
),
reading_after_switch AS (
    SELECT 
        ts.*,
        ue.event_data->>'duration_seconds' as reading_duration,
        ue.timestamp_utc as reading_end_time
    FROM tab_switches ts
    LEFT JOIN user_events ue ON ts.session_id = ue.session_id
        AND ue.event_type = 'view_feedback_end'
        AND ue.event_data->>'style' = ts.switched_to
        AND ue.timestamp_utc > ts.switch_time
        AND ue.timestamp_utc = (
            SELECT MIN(ue2.timestamp_utc)
            FROM user_events ue2
            WHERE ue2.session_id = ts.session_id
              AND ue2.event_type = 'view_feedback_end'
              AND ue2.event_data->>'style' = ts.switched_to
              AND ue2.timestamp_utc > ts.switch_time
        )
)
SELECT 
    session_id,
    participant_name,
    task_id,
    reflection_id,
    switch_number,
    switched_from,
    switched_to,
    switch_time,
    reading_duration::NUMERIC as duration_after_switch_seconds,
    ROUND(reading_duration::NUMERIC / 60, 2) as duration_after_switch_minutes,
    reading_end_time,
    EXTRACT(EPOCH FROM (reading_end_time - switch_time)) as total_time_on_switched_tab_seconds
FROM reading_after_switch
ORDER BY session_id, task_id, reflection_id, switch_number;

-- =====================================================
-- QUERY 9: COMPLETE READING BEHAVIOR SUMMARY
-- =====================================================
-- One row per user per task with all reading metrics

WITH first_choice AS (
    SELECT 
        ue.session_id,
        r.task_id,
        ue.event_data->>'preferred_style' as first_choice,
        ROW_NUMBER() OVER (PARTITION BY ue.session_id, r.task_id ORDER BY ue.timestamp_utc) as rn
    FROM user_events ue
    LEFT JOIN reflections r ON ue.reflection_id = r.id
    WHERE ue.event_type = 'feedback_style_preference'
      AND ue.timestamp_utc >= '2025-01-01'
),
reading_by_style AS (
    SELECT 
        ue.session_id,
        r.participant_name,
        r.task_id,
        ue.event_data->>'style' as feedback_style,
        COUNT(*) as sessions_count,
        SUM((ue.event_data->>'duration_seconds')::NUMERIC) as total_seconds,
        AVG((ue.event_data->>'duration_seconds')::NUMERIC) as avg_seconds,
        MIN(ue.timestamp_utc) as first_read,
        MAX(ue.timestamp_utc) as last_read
    FROM user_events ue
    LEFT JOIN reflections r ON ue.reflection_id = r.id
    WHERE ue.event_type = 'view_feedback_end'
      AND ue.timestamp_utc >= '2025-01-01'
      AND ue.event_data->>'duration_seconds' IS NOT NULL
    GROUP BY ue.session_id, r.participant_name, r.task_id, ue.event_data->>'style'
),
switch_counts AS (
    SELECT 
        ue.session_id,
        r.task_id,
        COUNT(*) as total_switches
    FROM user_events ue
    LEFT JOIN reflections r ON ue.reflection_id = r.id
    WHERE ue.event_type = 'select_feedback_style'
      AND ue.timestamp_utc >= '2025-01-01'
    GROUP BY ue.session_id, r.task_id
)
SELECT 
    COALESCE(rbs.session_id, fc.session_id) as session_id,
    rbs.participant_name,
    COALESCE(rbs.task_id, fc.task_id) as task_id,
    fc.first_choice,
    sc.total_switches,
    -- Extended feedback stats
    MAX(CASE WHEN rbs.feedback_style = 'extended' THEN rbs.sessions_count ELSE 0 END) as extended_sessions,
    MAX(CASE WHEN rbs.feedback_style = 'extended' THEN rbs.total_seconds ELSE 0 END) as extended_total_seconds,
    MAX(CASE WHEN rbs.feedback_style = 'extended' THEN ROUND(rbs.total_seconds / 60, 2) ELSE 0 END) as extended_total_minutes,
    -- Short feedback stats
    MAX(CASE WHEN rbs.feedback_style = 'short' THEN rbs.sessions_count ELSE 0 END) as short_sessions,
    MAX(CASE WHEN rbs.feedback_style = 'short' THEN rbs.total_seconds ELSE 0 END) as short_total_seconds,
    MAX(CASE WHEN rbs.feedback_style = 'short' THEN ROUND(rbs.total_seconds / 60, 2) ELSE 0 END) as short_total_minutes
FROM reading_by_style rbs
FULL OUTER JOIN first_choice fc ON rbs.session_id = fc.session_id 
    AND rbs.task_id = fc.task_id 
    AND fc.rn = 1
LEFT JOIN switch_counts sc ON COALESCE(rbs.session_id, fc.session_id) = sc.session_id 
    AND COALESCE(rbs.task_id, fc.task_id) = sc.task_id
GROUP BY COALESCE(rbs.session_id, fc.session_id), rbs.participant_name, 
         COALESCE(rbs.task_id, fc.task_id), fc.first_choice, sc.total_switches
ORDER BY session_id, task_id;

-- =====================================================
-- QUERY 10: CORRECTED REVISION TIMING
-- =====================================================
-- Shows revision timing per user per video per task

SELECT 
    session_id,
    participant_name,
    video_id,
    task_id,
    revision_number,
    created_at as revision_time,
    LENGTH(reflection_text) as text_length,
    analysis_percentages->>'raw' as raw_percentages,
    weakest_component,
    -- Time since start of this session-video-task combination
    created_at - FIRST_VALUE(created_at) OVER (PARTITION BY session_id, video_id, task_id ORDER BY revision_number) as time_since_first_submission,
    -- Time since previous revision for this specific session-video-task
    created_at - LAG(created_at) OVER (PARTITION BY session_id, video_id, task_id ORDER BY revision_number) as time_since_previous_revision,
    -- Revision count for this session-video-task
    COUNT(*) OVER (PARTITION BY session_id, video_id, task_id) as total_revisions_for_this_video
FROM reflections
WHERE created_at >= '2025-01-01'  -- CHANGE THIS DATE
ORDER BY session_id, video_id, task_id, revision_number;

-- =====================================================
-- HOW TO USE:
-- =====================================================
-- 1. Choose the query that answers your question
-- 2. Copy and paste into Supabase SQL Editor
-- 3. Update the date filter (WHERE ... >= '2025-01-01')
-- 4. Click "Run"
-- 5. Download CSV
-- =====================================================

