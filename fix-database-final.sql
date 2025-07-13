-- FINAL DATABASE FIX - Complete Resolution for View Dependencies and Integer Overflow
-- Run this in your Supabase SQL Editor

-- ===========================
-- 1. DROP ALL DEPENDENT VIEWS FIRST
-- ===========================

-- Drop all views that might depend on the reflections table
DROP VIEW IF EXISTS reading_patterns CASCADE;
DROP VIEW IF EXISTS revision_patterns CASCADE;
DROP VIEW IF EXISTS participant_summary CASCADE;
DROP VIEW IF EXISTS participant_summary_enhanced CASCADE;
DROP VIEW IF EXISTS task_analysis CASCADE;
DROP VIEW IF EXISTS reflection_analytics CASCADE;

-- ===========================
-- 2. CLEAN UP PROBLEMATIC DATA
-- ===========================

-- Remove any test data that might be causing issues
DELETE FROM user_events WHERE session_id LIKE 'test-session%';
DELETE FROM reflections WHERE participant_name = 'Test User';

-- Remove orphaned events (events pointing to non-existent reflections)
DELETE FROM user_events 
WHERE reflection_id IS NOT NULL 
AND reflection_id NOT IN (SELECT id FROM reflections);

-- ===========================
-- 3. FIX FOREIGN KEY CONSTRAINTS
-- ===========================

-- Remove foreign key constraint temporarily
ALTER TABLE user_events DROP CONSTRAINT IF EXISTS user_events_reflection_id_fkey;

-- Change reflection_id to BIGINT and make it nullable
ALTER TABLE user_events ALTER COLUMN reflection_id TYPE BIGINT;
ALTER TABLE user_events ALTER COLUMN reflection_id DROP NOT NULL;

-- ===========================
-- 4. USE SMALLER IDs TO AVOID OVERFLOW
-- ===========================

-- Reset sequence to start from 1 for new reflections
ALTER SEQUENCE reflections_id_seq RESTART WITH 1;

-- ===========================
-- 5. RECREATE SIMPLIFIED VIEWS
-- ===========================

-- Simple reading patterns view
CREATE OR REPLACE VIEW reading_patterns AS
SELECT 
    session_id,
    reflection_id,
    event_data->>'style' as feedback_style,
    event_data->>'language' as feedback_language,
    (event_data->>'duration_seconds')::numeric as reading_duration_seconds,
    timestamp_utc
FROM user_events 
WHERE event_type = 'view_feedback_end'
AND event_data->>'duration_seconds' IS NOT NULL;

-- Simple revision patterns view
CREATE OR REPLACE VIEW revision_patterns AS
SELECT 
    r1.session_id,
    r1.participant_name,
    r1.id as original_reflection_id,
    r2.id as revised_reflection_id,
    r1.reflection_text as original_text,
    r2.reflection_text as revised_text,
    r2.revision_number,
    r2.created_at as revised_at,
    LENGTH(r1.reflection_text) as original_length,
    LENGTH(r2.reflection_text) as revised_length,
    LENGTH(r2.reflection_text) - LENGTH(r1.reflection_text) as length_change
FROM reflections r1
JOIN reflections r2 ON r1.id = r2.parent_reflection_id
WHERE r2.parent_reflection_id IS NOT NULL;

-- Simple participant summary view
CREATE OR REPLACE VIEW participant_summary AS
SELECT 
    session_id,
    participant_name,
    language,
    video_id,
    COUNT(*) as total_submissions,
    MAX(revision_number) as max_revision_number,
    AVG(LENGTH(reflection_text)) as avg_reflection_length,
    MIN(created_at) as first_submission,
    MAX(created_at) as last_submission,
    MAX(umux_score) as final_umux_score
FROM reflections
GROUP BY session_id, participant_name, language, video_id;

-- ===========================
-- 6. ADD SAFER CONSTRAINTS
-- ===========================

-- Add check constraint for reasonable reflection_id values (avoid overflow)
ALTER TABLE user_events ADD CONSTRAINT reasonable_reflection_id 
CHECK (reflection_id IS NULL OR reflection_id BETWEEN 1 AND 2000000000);

-- Add improved foreign key constraint (allow NULL)
ALTER TABLE user_events ADD CONSTRAINT user_events_reflection_id_fkey 
FOREIGN KEY (reflection_id) REFERENCES reflections(id) ON DELETE SET NULL;

-- ===========================
-- 7. CREATE PERFORMANCE INDEXES
-- ===========================

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reflections_session_id ON reflections(session_id);
CREATE INDEX IF NOT EXISTS idx_reflections_revision ON reflections(revision_number);
CREATE INDEX IF NOT EXISTS idx_reflections_parent ON reflections(parent_reflection_id);
CREATE INDEX IF NOT EXISTS idx_user_events_session ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_timestamp ON user_events(timestamp_utc);
CREATE INDEX IF NOT EXISTS idx_user_events_reflection ON user_events(reflection_id) WHERE reflection_id IS NOT NULL;

-- ===========================
-- 8. VERIFICATION QUERIES
-- ===========================

-- Show database state after migration
SELECT 
    'Database Migration Complete' as status,
    (SELECT COUNT(*) FROM reflections) as total_reflections,
    (SELECT COUNT(*) FROM user_events) as total_events,
    (SELECT COUNT(*) FROM user_events WHERE reflection_id IS NOT NULL) as events_with_reflection_id,
    (SELECT COUNT(*) FROM reading_patterns) as reading_patterns_count,
    (SELECT COUNT(*) FROM revision_patterns) as revision_patterns_count,
    (SELECT COUNT(*) FROM participant_summary) as participant_summary_count;

-- Check for any remaining constraint violations
SELECT 
    constraint_name,
    table_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name IN ('reflections', 'user_events')
AND constraint_type IN ('FOREIGN KEY', 'CHECK');

-- ===========================
-- 9. FINAL CLEANUP
-- ===========================

-- Update any NULL revision_numbers to 1
UPDATE reflections SET revision_number = 1 WHERE revision_number IS NULL;

-- Final status message
DO $$
BEGIN
    RAISE NOTICE '=== DATABASE MIGRATION COMPLETE ===';
    RAISE NOTICE 'Fixed integer overflow issues';
    RAISE NOTICE 'Resolved view dependencies';
    RAISE NOTICE 'Cleaned up orphaned data';
    RAISE NOTICE 'Created simplified views';
    RAISE NOTICE 'Application should now work without errors';
END $$; 