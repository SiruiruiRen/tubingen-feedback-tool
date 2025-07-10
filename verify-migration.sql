-- =============================================================================
-- MIGRATION VERIFICATION SCRIPT
-- Run this to confirm the multi-page migration worked correctly
-- =============================================================================

-- 1. Check if task_id column was added to reflections table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'reflections' 
AND column_name = 'task_id';

-- 2. Check if study_progress table was created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'study_progress'
ORDER BY ordinal_position;

-- 3. Check constraint on reflections table
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'reflections'
AND constraint_name = 'check_task_id';

-- 4. Check event types constraint on user_events table
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'user_events'
AND constraint_name = 'valid_event_types';

-- 5. Check if new views were created
SELECT 
    table_name,
    view_definition
FROM information_schema.views 
WHERE table_name IN ('participant_summary_enhanced', 'task_analysis');

-- 6. Check if new indexes were created
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('reflections', 'study_progress', 'user_events')
AND indexname LIKE 'idx_%';

-- 7. Test inserting a sample record to verify task_id works
-- (This will show an error if the constraint isn't working)
INSERT INTO reflections (
    session_id, 
    participant_name, 
    video_id, 
    language, 
    task_id,
    reflection_text,
    analysis_percentages,
    weakest_component,
    feedback_extended,
    feedback_short,
    revision_number
) VALUES (
    'test_session_' || EXTRACT(EPOCH FROM NOW()),
    'Migration Test User',
    'test_video',
    'en',
    'task1',
    'This is a test reflection to verify the migration worked.',
    '{"description": 25, "explanation": 35, "prediction": 40}',
    'description',
    'Extended test feedback',
    'Short test feedback',
    1
);

-- 8. Verify the test record was inserted with task_id
SELECT 
    session_id,
    participant_name,
    task_id,
    video_id,
    language,
    LENGTH(reflection_text) as reflection_length,
    created_at
FROM reflections 
WHERE participant_name = 'Migration Test User'
ORDER BY created_at DESC 
LIMIT 1;

-- 9. Test study_progress table functionality
INSERT INTO study_progress (
    session_id,
    participant_name,
    presurvey_completed,
    task1_completed,
    language_used
) VALUES (
    'test_progress_' || EXTRACT(EPOCH FROM NOW()),
    'Progress Test User',
    TRUE,
    TRUE,
    'en'
);

-- 10. Verify study_progress record
SELECT 
    session_id,
    participant_name,
    presurvey_completed,
    task1_completed,
    study_started_at,
    language_used
FROM study_progress 
WHERE participant_name = 'Progress Test User'
ORDER BY study_started_at DESC 
LIMIT 1;

-- 11. Test the enhanced views work
SELECT 
    session_id,
    participant_name,
    tasks_attempted,
    task1_submissions,
    total_submissions,
    preferred_feedback_style
FROM participant_summary_enhanced 
WHERE participant_name IN ('Migration Test User', 'Progress Test User')
LIMIT 5;

-- 12. Clean up test data
DELETE FROM reflections WHERE participant_name = 'Migration Test User';
DELETE FROM study_progress WHERE participant_name = 'Progress Test User';

-- =============================================================================
-- SUMMARY CHECK
-- =============================================================================

DO $$
DECLARE
    task_id_exists BOOLEAN;
    progress_table_exists BOOLEAN;
    enhanced_view_exists BOOLEAN;
    constraint_exists BOOLEAN;
BEGIN
    -- Check if task_id column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reflections' 
        AND column_name = 'task_id'
    ) INTO task_id_exists;
    
    -- Check if study_progress table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'study_progress'
    ) INTO progress_table_exists;
    
    -- Check if enhanced view exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.views 
        WHERE table_name = 'participant_summary_enhanced'
    ) INTO enhanced_view_exists;
    
    -- Check if constraint exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'reflections' 
        AND constraint_name = 'check_task_id'
    ) INTO constraint_exists;
    
    RAISE NOTICE '';
    RAISE NOTICE '=== MIGRATION VERIFICATION RESULTS ===';
    RAISE NOTICE 'Task ID column added: %', CASE WHEN task_id_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Study progress table created: %', CASE WHEN progress_table_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Enhanced views created: %', CASE WHEN enhanced_view_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Task ID constraint added: %', CASE WHEN constraint_exists THEN '✅ YES' ELSE '❌ NO' END;
    
    IF task_id_exists AND progress_table_exists AND enhanced_view_exists AND constraint_exists THEN
        RAISE NOTICE '';
        RAISE NOTICE '🎉 MIGRATION SUCCESSFUL! 🎉';
        RAISE NOTICE 'Your database is ready for the multi-page study.';
        RAISE NOTICE 'You can now use the enhanced research queries.';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  MIGRATION INCOMPLETE';
        RAISE NOTICE 'Some components may not have been created properly.';
    END IF;
    
    RAISE NOTICE '';
END $$; 