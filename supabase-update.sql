-- Update script for Tübingen Teacher Feedback Tool database
-- This adds new columns for the updated features

-- Add video_id column to track which video was watched
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS video_id VARCHAR(10);

-- Add feedback_text_short column to store the short version of feedback
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS feedback_text_short TEXT;

-- Add analysis_percentages column to store the percentage distribution analysis
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS analysis_percentages JSONB;

-- Add interaction tracking columns
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS interaction_data JSONB;

-- Add revision tracking columns
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS revision_initiated_from VARCHAR(20);

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS pre_revision_interaction JSONB;

-- Add UMUX-Lite rating columns
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS capabilities_rating INTEGER CHECK (capabilities_rating >= 1 AND capabilities_rating <= 5);

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS ease_rating INTEGER CHECK (ease_rating >= 1 AND ease_rating <= 5);

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS umux_score DECIMAL(5,2);

-- Add rated_at column to track when ratings were submitted
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS rated_at TIMESTAMP WITH TIME ZONE;

-- Add language and style columns if they don't exist
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en';

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS style VARCHAR(20) DEFAULT 'academic';

-- Add session_id column for tracking user sessions
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS session_id VARCHAR(50);

-- Add index on video_id for better query performance
CREATE INDEX IF NOT EXISTS idx_reflections_video_id ON reflections(video_id);

-- Add index on revision_initiated_from for analysis queries
CREATE INDEX IF NOT EXISTS idx_reflections_revision_from ON reflections(revision_initiated_from);

-- Add index on UMUX score for analysis
CREATE INDEX IF NOT EXISTS idx_reflections_umux_score ON reflections(umux_score);

-- Add index on session_id for session tracking
CREATE INDEX IF NOT EXISTS idx_reflections_session_id ON reflections(session_id);

-- Update existing rows to have default values (optional)
-- UPDATE reflections 
-- SET analysis_percentages = '{"description": 33, "explanation": 33, "prediction": 34}'::jsonb
-- WHERE analysis_percentages IS NULL; 