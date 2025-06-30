-- Debug Revision Patterns - Find out why the view is empty

-- Query 1: Check basic revision data
SELECT 
    'Basic revision data' as check_type,
    COUNT(*) as total_reflections,
    COUNT(CASE WHEN revision_number = 1 THEN 1 END) as original_count,
    COUNT(CASE WHEN revision_number > 1 THEN 1 END) as revision_count,
    COUNT(CASE WHEN parent_reflection_id IS NOT NULL THEN 1 END) as has_parent_count
FROM reflections;

-- Query 2: Check for actual parent-child relationships
SELECT 
    'Parent-child relationships' as check_type,
    r1.session_id,
    r1.id as original_id,
    r1.revision_number as original_revision,
    r2.id as revision_id,
    r2.revision_number as revision_revision,
    r2.parent_reflection_id
FROM reflections r1
JOIN reflections r2 ON r1.id = r2.parent_reflection_id
LIMIT 10;

-- Query 3: Check user_events for click_revise events
SELECT 
    'Revise click events' as check_type,
    COUNT(*) as total_revise_clicks,
    COUNT(DISTINCT session_id) as unique_sessions_with_revise
FROM user_events 
WHERE event_type = 'click_revise';

-- Query 4: Check the revision_events CTE from the view
WITH revision_events AS (
    SELECT 
        session_id,
        reflection_id,
        timestamp_utc as revision_clicked_at,
        event_data->>'from_style' as clicked_from_style,
        ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY timestamp_utc) as revision_attempt
    FROM user_events 
    WHERE event_type = 'click_revise'
)
SELECT 
    'Revision events CTE' as check_type,
    COUNT(*) as total_events,
    COUNT(DISTINCT session_id) as unique_sessions
FROM revision_events;

-- Query 5: Check the revision_analysis CTE from the view
WITH revision_analysis AS (
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
    'Revision analysis CTE' as check_type,
    COUNT(*) as total_revision_pairs,
    COUNT(DISTINCT session_id) as unique_sessions
FROM revision_analysis;

-- Query 6: Simple check for sessions with multiple reflections
SELECT 
    'Sessions with multiple reflections' as check_type,
    session_id,
    COUNT(*) as reflection_count,
    MIN(created_at) as first_reflection,
    MAX(created_at) as last_reflection
FROM reflections 
GROUP BY session_id 
HAVING COUNT(*) > 1
ORDER BY reflection_count DESC
LIMIT 10;

-- Query 7: Check if revision_patterns view exists and has proper structure
SELECT 
    'View structure check' as check_type,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'revision_patterns'
ORDER BY ordinal_position; 