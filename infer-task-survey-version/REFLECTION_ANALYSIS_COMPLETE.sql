-- =====================================================
-- COMPREHENSIVE REFLECTION ANALYSIS - ONE BIG SHEET
-- =====================================================
-- This exports ALL reflection data in a single flat table
-- Includes: text, submission number, timing, percentages, feedback
-- Perfect for Excel/CSV analysis
-- =====================================================

SELECT 
    -- Participant Information
    r.session_id,
    r.participant_name as participant_id,
    r.video_id,
    r.task_id,
    r.language,
    
    -- Reflection Metadata
    r.id as reflection_id,
    r.revision_number,
    r.parent_reflection_id,
    
    -- Timing Information
    r.created_at as submission_timestamp,
    TO_CHAR(r.created_at, 'YYYY-MM-DD HH24:MI:SS') as submission_time_formatted,
    
    -- Time since first submission for this session-video-task
    EXTRACT(EPOCH FROM (
        r.created_at - FIRST_VALUE(r.created_at) OVER (
            PARTITION BY r.session_id, r.video_id, r.task_id 
            ORDER BY r.revision_number
        )
    )) / 60 as minutes_since_first_submission,
    
    -- Time since previous revision
    EXTRACT(EPOCH FROM (
        r.created_at - LAG(r.created_at) OVER (
            PARTITION BY r.session_id, r.video_id, r.task_id 
            ORDER BY r.revision_number
        )
    )) / 60 as minutes_since_previous_revision,
    
    -- Total revisions for this session-video-task
    COUNT(*) OVER (PARTITION BY r.session_id, r.video_id, r.task_id) as total_revisions,
    
    -- Reflection Content
    r.reflection_text,
    LENGTH(r.reflection_text) as text_length_characters,
    array_length(string_to_array(r.reflection_text, ' '), 1) as text_length_words,
    
    -- Analysis Results (RAW - shown to students)
    r.analysis_percentages->'raw'->>'description' as description_pct_raw,
    r.analysis_percentages->'raw'->>'explanation' as explanation_pct_raw,
    r.analysis_percentages->'raw'->>'prediction' as prediction_pct_raw,
    r.analysis_percentages->'raw'->>'professional_vision' as pv_total_pct_raw,
    
    -- Analysis Results (PRIORITY - for research)
    r.analysis_percentages->'priority'->>'description' as description_pct_priority,
    r.analysis_percentages->'priority'->>'explanation' as explanation_pct_priority,
    r.analysis_percentages->'priority'->>'prediction' as prediction_pct_priority,
    r.analysis_percentages->'priority'->>'other' as other_pct_priority,
    r.analysis_percentages->'priority'->>'professional_vision' as pv_total_pct_priority,
    
    -- Weakest Component
    r.weakest_component,
    
    -- Generated Feedback (truncated for readability)
    LEFT(r.feedback_extended, 500) as feedback_extended_preview,
    LEFT(r.feedback_short, 500) as feedback_short_preview,
    LENGTH(r.feedback_extended) as feedback_extended_length,
    LENGTH(r.feedback_short) as feedback_short_length,
    
    -- Reading Behavior During This Revision
    (SELECT COUNT(*) 
     FROM user_events ue 
     WHERE ue.session_id = r.session_id 
       AND ue.event_type = 'view_feedback_end'
       AND ue.timestamp_utc BETWEEN 
           LAG(r.created_at, 1, r.created_at) OVER (PARTITION BY r.session_id, r.video_id, r.task_id ORDER BY r.revision_number)
           AND r.created_at
    ) as reading_sessions_before_this_revision,
    
    (SELECT SUM((ue.event_data->>'duration_seconds')::NUMERIC)
     FROM user_events ue 
     WHERE ue.session_id = r.session_id 
       AND ue.event_type = 'view_feedback_end'
       AND ue.timestamp_utc BETWEEN 
           LAG(r.created_at, 1, r.created_at) OVER (PARTITION BY r.session_id, r.video_id, r.task_id ORDER BY r.revision_number)
           AND r.created_at
    ) as total_reading_seconds_before_this_revision,
    
    (SELECT COUNT(*) 
     FROM user_events ue 
     WHERE ue.session_id = r.session_id 
       AND ue.event_type = 'select_feedback_style'
       AND ue.timestamp_utc BETWEEN 
           LAG(r.created_at, 1, r.created_at) OVER (PARTITION BY r.session_id, r.video_id, r.task_id ORDER BY r.revision_number)
           AND r.created_at
    ) as tab_switches_before_this_revision,
    
    -- Warnings
    (SELECT COUNT(*) 
     FROM user_events ue 
     WHERE ue.session_id = r.session_id 
       AND ue.event_type = 'revision_warning_shown'
       AND ue.timestamp_utc BETWEEN 
           LAG(r.created_at, 1, r.created_at) OVER (PARTITION BY r.session_id, r.video_id, r.task_id ORDER BY r.revision_number)
           AND r.created_at
    ) as warnings_before_this_revision,
    
    -- Concept Interactions
    (SELECT COUNT(*) 
     FROM user_events ue 
     WHERE ue.session_id = r.session_id 
       AND ue.event_type = 'learn_concepts_interaction'
       AND ue.timestamp_utc BETWEEN 
           LAG(r.created_at, 1, r.created_at) OVER (PARTITION BY r.session_id, r.video_id, r.task_id ORDER BY r.revision_number)
           AND r.created_at
    ) as concept_clicks_before_this_revision,
    
    -- Copy Actions
    (SELECT COUNT(*) 
     FROM user_events ue 
     WHERE ue.session_id = r.session_id 
       AND ue.event_type = 'copy_feedback'
       AND ue.timestamp_utc BETWEEN 
           LAG(r.created_at, 1, r.created_at) OVER (PARTITION BY r.session_id, r.video_id, r.task_id ORDER BY r.revision_number)
           AND r.created_at
    ) as copy_actions_before_this_revision

FROM reflections r
WHERE r.created_at >= '2025-01-01'  -- CHANGE THIS DATE for new data only
ORDER BY r.session_id, r.video_id, r.task_id, r.revision_number;


-- =====================================================
-- SIMPLIFIED VERSION (if above is too slow)
-- =====================================================
-- Same data but without the subqueries for events

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
    
    -- Analysis Results (RAW - shown to students)
    analysis_percentages->'raw'->>'description' as description_pct_raw,
    analysis_percentages->'raw'->>'explanation' as explanation_pct_raw,
    analysis_percentages->'raw'->>'prediction' as prediction_pct_raw,
    analysis_percentages->'raw'->>'professional_vision' as pv_total_pct_raw,
    
    -- Analysis Results (PRIORITY - for research)
    analysis_percentages->'priority'->>'description' as description_pct_priority,
    analysis_percentages->'priority'->>'explanation' as explanation_pct_priority,
    analysis_percentages->'priority'->>'prediction' as prediction_pct_priority,
    analysis_percentages->'priority'->>'other' as other_pct_priority,
    analysis_percentages->'priority'->>'professional_vision' as pv_total_pct_priority,
    
    -- Weakest Component
    weakest_component,
    
    -- Feedback (truncated)
    LEFT(feedback_extended, 300) as feedback_extended_preview,
    LEFT(feedback_short, 300) as feedback_short_preview

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

