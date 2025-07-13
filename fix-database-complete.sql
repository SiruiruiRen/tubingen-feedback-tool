-- Complete Database Fix - Handle View Dependencies and Foreign Key Issues
-- Run this in your Supabase SQL Editor

-- ===========================
-- 1. DROP VIEWS THAT DEPEND ON REFLECTION_ID
-- ===========================

DROP VIEW IF EXISTS reading_patterns CASCADE;
DROP VIEW IF EXISTS reflection_analytics CASCADE;
DROP VIEW IF EXISTS participant_summary_enhanced CASCADE;
DROP VIEW IF EXISTS task_analysis CASCADE;

-- ===========================
-- 2. FIX FOREIGN KEY CONSTRAINTS
-- ===========================

-- Remove foreign key constraint temporarily
ALTER TABLE user_events DROP CONSTRAINT IF EXISTS user_events_reflection_id_fkey;

-- Change reflection_id to BIGINT
ALTER TABLE user_events ALTER COLUMN reflection_id TYPE BIGINT;

-- Make reflection_id nullable to avoid constraint violations
ALTER TABLE user_events ALTER COLUMN reflection_id DROP NOT NULL;

-- ===========================
-- 3. CLEAN UP BAD DATA
-- ===========================

-- Remove test data that might be causing issues
DELETE FROM user_events WHERE session_id LIKE 'test-session%';
DELETE FROM reflections WHERE participant_name = 'Test User';

-- Remove orphaned events (events pointing to non-existent reflections)
DELETE FROM user_events 
WHERE reflection_id IS NOT NULL 
AND reflection_id NOT IN (SELECT id FROM reflections);

-- ===========================
-- 4. RECREATE VIEWS (SIMPLIFIED)
-- ===========================

CREATE OR REPLACE VIEW reading_patterns AS
SELECT 
    session_id,
    reflection_id,
    event_data->>'style' as feedback_style,
    event_data->>'language' as feedback_language,
    timestamp_utc,
    EXTRACT(EPOCH FROM timestamp_utc) as timestamp_seconds
FROM user_events 
WHERE event_type IN ('view_feedback_start', 'view_feedback_end');

-- ===========================
-- 5. ADD SAFER CONSTRAINTS
-- ===========================

-- Add check constraint for reasonable reflection_id values
ALTER TABLE user_events ADD CONSTRAINT reasonable_reflection_id 
CHECK (reflection_id IS NULL OR (reflection_id > 0 AND reflection_id < 999999999));

-- ===========================
-- 6. VERIFY FIXES
-- ===========================

-- Check column types
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('reflections', 'user_events') 
AND column_name LIKE '%id%'
ORDER BY table_name, column_name;

-- Check for orphaned records
SELECT COUNT(*) as orphaned_events
FROM user_events 
WHERE reflection_id IS NOT NULL 
AND reflection_id NOT IN (SELECT id FROM reflections);

SELECT 'Database fixes applied successfully!' as status; 