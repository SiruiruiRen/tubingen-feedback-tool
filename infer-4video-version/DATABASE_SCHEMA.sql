-- =====================================================
-- DATABASE SCHEMA FOR 4-VIDEO EXPERIMENT
-- =====================================================
-- Run this in Supabase SQL Editor before deploying
-- =====================================================

-- Table 1: Participant Progress Tracking
CREATE TABLE IF NOT EXISTS participant_progress (
    id BIGSERIAL PRIMARY KEY,
    participant_name TEXT UNIQUE NOT NULL,
    assigned_condition TEXT CHECK (assigned_condition IN ('control', 'experimental')),
    videos_completed TEXT[] DEFAULT '{}',
    pre_survey_completed BOOLEAN DEFAULT FALSE,
    post_survey_completed BOOLEAN DEFAULT FALSE,
    video_surveys JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for participant_progress
CREATE INDEX IF NOT EXISTS idx_progress_participant ON participant_progress(participant_name);
CREATE INDEX IF NOT EXISTS idx_progress_condition ON participant_progress(assigned_condition);

-- Table 2: Reflections (already exists, but ensure it has video_id)
-- No changes needed - already has video_id, task_id, etc.

-- Table 3: User Events (already exists)
-- No changes needed - already tracks all events

-- Table 4: Binary Classifications (already exists)
-- No changes needed - already links to reflections

-- Enable Row Level Security
ALTER TABLE participant_progress ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on participant_progress" 
ON participant_progress FOR ALL USING (true) WITH CHECK (true);

-- Verify tables created
SELECT 'Database schema ready for 4-video experiment!' as status;

-- =====================================================
-- HELPER QUERIES
-- =====================================================

-- Check a participant's progress
SELECT * FROM participant_progress WHERE participant_name = 'A0895';

-- Get all participants with their progress
SELECT 
    participant_name,
    assigned_condition,
    array_length(videos_completed, 1) as videos_done,
    pre_survey_completed,
    post_survey_completed,
    last_active_at
FROM participant_progress
ORDER BY last_active_at DESC;

-- Get participants who haven't completed all videos
SELECT 
    participant_name,
    assigned_condition,
    videos_completed,
    4 - array_length(COALESCE(videos_completed, '{}'), 1) as videos_remaining
FROM participant_progress
WHERE array_length(COALESCE(videos_completed, '{}'), 1) < 4
ORDER BY last_active_at DESC;

