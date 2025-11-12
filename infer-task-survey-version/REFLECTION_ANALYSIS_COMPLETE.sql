-- =====================================================
-- COMPREHENSIVE REFLECTION ANALYSIS - ONE BIG SHEET
-- =====================================================
-- This exports ALL reflection data in a single flat table
-- Includes: text, submission number, timing, percentages, feedback
-- Perfect for Excel/CSV analysis
-- =====================================================

WITH reflection_timing AS (
    SELECT 
        session_id,
        participant_name,
        video_id,
        task_id,
        language,
        id as reflection_id,
        revision_number,
        parent_reflection_id,
        created_at,
        reflection_text,
        analysis_percentages,
        weakest_component,
        feedback_extended,
        feedback_short,
        -- Calculate timing using window functions in CTE
        FIRST_VALUE(created_at) OVER (PARTITION BY session_id, video_id, task_id ORDER BY revision_number) as first_submission_time,
        LAG(created_at) OVER (PARTITION BY session_id, video_id, task_id ORDER BY revision_number) as previous_revision_time,
        COUNT(*) OVER (PARTITION BY session_id, video_id, task_id) as total_revisions
    FROM reflections
    WHERE created_at >= '2025-01-01'  -- CHANGE THIS DATE for new data only
),
event_counts AS (
    SELECT 
        rt.reflection_id,
        COUNT(CASE WHEN ue.event_type = 'view_feedback_end' THEN 1 END) as reading_sessions,
        SUM(CASE WHEN ue.event_type = 'view_feedback_end' 
            THEN (ue.event_data->>'duration_seconds')::NUMERIC 
            ELSE 0 
        END) as total_reading_seconds,
        COUNT(CASE WHEN ue.event_type = 'select_feedback_style' THEN 1 END) as tab_switches,
        COUNT(CASE WHEN ue.event_type = 'revision_warning_shown' THEN 1 END) as warnings,
        COUNT(CASE WHEN ue.event_type = 'learn_concepts_interaction' THEN 1 END) as concept_clicks,
        COUNT(CASE WHEN ue.event_type = 'copy_feedback' THEN 1 END) as copy_actions
    FROM reflection_timing rt
    LEFT JOIN user_events ue ON rt.session_id = ue.session_id
        AND ue.timestamp_utc BETWEEN COALESCE(rt.previous_revision_time, rt.first_submission_time) AND rt.created_at
    GROUP BY rt.reflection_id
)
SELECT 
    -- Participant Information
    rt.session_id,
    rt.participant_name as participant_id,
    rt.video_id,
    rt.task_id,
    rt.language,
    
    -- Reflection Metadata
    rt.reflection_id,
    rt.revision_number,
    rt.parent_reflection_id,
    rt.total_revisions,
    
    -- Timing
    rt.created_at as submission_timestamp,
    TO_CHAR(rt.created_at, 'YYYY-MM-DD HH24:MI:SS') as submission_time_formatted,
    EXTRACT(EPOCH FROM (rt.created_at - rt.first_submission_time)) / 60 as minutes_since_first_submission,
    EXTRACT(EPOCH FROM (rt.created_at - rt.previous_revision_time)) / 60 as minutes_since_previous_revision,
    
    -- Reflection Content
    rt.reflection_text,
    LENGTH(rt.reflection_text) as text_length_characters,
    array_length(string_to_array(rt.reflection_text, ' '), 1) as text_length_words,
    
    -- Analysis Results (RAW - shown to students)
    (rt.analysis_percentages->'raw'->>'description')::NUMERIC as description_pct_raw,
    (rt.analysis_percentages->'raw'->>'explanation')::NUMERIC as explanation_pct_raw,
    (rt.analysis_percentages->'raw'->>'prediction')::NUMERIC as prediction_pct_raw,
    (rt.analysis_percentages->'raw'->>'professional_vision')::NUMERIC as pv_total_pct_raw,
    
    -- Analysis Results (PRIORITY - for research)
    (rt.analysis_percentages->'priority'->>'description')::NUMERIC as description_pct_priority,
    (rt.analysis_percentages->'priority'->>'explanation')::NUMERIC as explanation_pct_priority,
    (rt.analysis_percentages->'priority'->>'prediction')::NUMERIC as prediction_pct_priority,
    (rt.analysis_percentages->'priority'->>'other')::NUMERIC as other_pct_priority,
    (rt.analysis_percentages->'priority'->>'professional_vision')::NUMERIC as pv_total_pct_priority,
    
    -- Weakest Component
    rt.weakest_component,
    
    -- Generated Feedback (full text)
    rt.feedback_extended,
    rt.feedback_short,
    LENGTH(rt.feedback_extended) as feedback_extended_length,
    LENGTH(rt.feedback_short) as feedback_short_length,
    
    -- User Behavior Before This Revision
    ec.reading_sessions as reading_sessions_before_this_revision,
    ec.total_reading_seconds as total_reading_seconds_before_this_revision,
    ROUND(ec.total_reading_seconds / 60, 2) as total_reading_minutes_before_this_revision,
    ec.tab_switches as tab_switches_before_this_revision,
    ec.warnings as warnings_before_this_revision,
    ec.concept_clicks as concept_clicks_before_this_revision,
    ec.copy_actions as copy_actions_before_this_revision

FROM reflection_timing rt
LEFT JOIN event_counts ec ON rt.reflection_id = ec.reflection_id
ORDER BY rt.session_id, rt.video_id, rt.task_id, rt.revision_number;


-- =====================================================
-- SIMPLIFIED VERSION (Fast - No Event Data)
-- =====================================================
-- Just reflection data without user event calculations

SELECT 
    -- Participant Information
    session_id,
    participant_name as participant_id,
    video_id,
    task_id,
    language,
    
    -- Reflection Metadata
    id as reflection_id,
    revision_number,
    parent_reflection_id,
    
    -- Timing
    created_at as submission_timestamp,
    TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as submission_time_formatted,
    
    -- Reflection Content
    reflection_text,
    LENGTH(reflection_text) as text_length_characters,
    array_length(string_to_array(reflection_text, ' '), 1) as text_length_words,
    
    -- Analysis Results (RAW - shown to students) - CAST to NUMERIC
    (analysis_percentages->'raw'->>'description')::NUMERIC as description_pct_raw,
    (analysis_percentages->'raw'->>'explanation')::NUMERIC as explanation_pct_raw,
    (analysis_percentages->'raw'->>'prediction')::NUMERIC as prediction_pct_raw,
    (analysis_percentages->'raw'->>'professional_vision')::NUMERIC as pv_total_pct_raw,
    
    -- Analysis Results (PRIORITY - for research) - CAST to NUMERIC
    (analysis_percentages->'priority'->>'description')::NUMERIC as description_pct_priority,
    (analysis_percentages->'priority'->>'explanation')::NUMERIC as explanation_pct_priority,
    (analysis_percentages->'priority'->>'prediction')::NUMERIC as prediction_pct_priority,
    (analysis_percentages->'priority'->>'other')::NUMERIC as other_pct_priority,
    (analysis_percentages->'priority'->>'professional_vision')::NUMERIC as pv_total_pct_priority,
    
    -- Weakest Component
    weakest_component,
    
    -- Generated Feedback (FULL TEXT)
    feedback_extended,
    feedback_short,
    LENGTH(feedback_extended) as feedback_extended_length,
    LENGTH(feedback_short) as feedback_short_length

FROM reflections
WHERE created_at >= '2025-01-01'  -- CHANGE THIS DATE
ORDER BY session_id, video_id, task_id, revision_number;

-- =====================================================
-- HOW TO USE:
-- =====================================================
-- 1. Copy one of the queries above into Supabase SQL Editor
-- 2. Update the date filter: WHERE created_at >= '2025-01-01'
-- 3. Click "Run"
-- 4. Click "Download CSV"
-- 5. Open in Excel for analysis
-- =====================================================

-- Recommended: Start with SIMPLIFIED VERSION first
-- If you need event data, use the COMPLETE VERSION
-- =====================================================

