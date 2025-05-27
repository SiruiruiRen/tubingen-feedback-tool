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

-- Add index on video_id for better query performance
CREATE INDEX IF NOT EXISTS idx_reflections_video_id ON reflections(video_id);

-- Update existing rows to have default values (optional)
-- UPDATE reflections 
-- SET analysis_percentages = '{"description": 33, "explanation": 33, "prediction": 34}'::jsonb
-- WHERE analysis_percentages IS NULL; 