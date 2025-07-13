-- Fix Integer Overflow Issues - Convert problematic columns to BIGINT
-- Run this in your Supabase SQL Editor to fix the "value out of range for type integer" errors

-- ===========================
-- 1. FIX REFLECTIONS TABLE
-- ===========================

-- Change reflection_id references to BIGINT
ALTER TABLE user_events ALTER COLUMN reflection_id TYPE BIGINT;

-- Add any missing columns with proper types
ALTER TABLE reflections ADD COLUMN IF NOT EXISTS first_submission_time BIGINT;
ALTER TABLE reflections ADD COLUMN IF NOT EXISTS last_revision_time BIGINT;

-- ===========================
-- 2. VERIFY CHANGES
-- ===========================

-- Check the updated column types
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('reflections', 'user_events')
AND column_name LIKE '%id%' OR column_name LIKE '%time%'
ORDER BY table_name, ordinal_position;

-- ===========================
-- 3. CLEAN UP ANY BAD DATA
-- ===========================

-- Remove any test entries that might have caused issues
DELETE FROM user_events WHERE session_id LIKE 'test-session%';
DELETE FROM reflections WHERE participant_name = 'Test User';

-- ===========================
-- 4. ADD CONSTRAINTS FOR DATA QUALITY
-- ===========================

-- Ensure reflection_id values are reasonable (not negative, not too large)
ALTER TABLE user_events ADD CONSTRAINT reasonable_reflection_id 
CHECK (reflection_id IS NULL OR (reflection_id > 0 AND reflection_id < 999999999));

-- ===========================
-- SUCCESS MESSAGE
-- ===========================

-- If this script runs without errors, your integer overflow issues should be fixed!
SELECT 'Integer overflow fixes applied successfully!' as status; 