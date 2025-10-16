-- Create binary_classifications table for the simplified version
-- Run this in your Supabase SQL Editor

-- Table 2: Binary Classifications (window-level scores)
CREATE TABLE IF NOT EXISTS binary_classifications (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    reflection_id BIGINT REFERENCES reflections(id),
    task_id TEXT,
    participant_name TEXT,
    video_id TEXT,
    language TEXT,
    window_id TEXT NOT NULL,
    window_text TEXT,
    description_score INTEGER CHECK (description_score IN (0, 1)),
    explanation_score INTEGER CHECK (explanation_score IN (0, 1)),
    prediction_score INTEGER CHECK (prediction_score IN (0, 1)),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_classifications_reflection ON binary_classifications(reflection_id);
CREATE INDEX IF NOT EXISTS idx_classifications_session ON binary_classifications(session_id);
CREATE INDEX IF NOT EXISTS idx_classifications_task ON binary_classifications(task_id);

-- Enable Row Level Security (RLS) but allow all operations for now
ALTER TABLE binary_classifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts and reads
CREATE POLICY "Allow all operations on binary_classifications" ON binary_classifications FOR ALL USING (true) WITH CHECK (true);

-- Verify table was created
SELECT 'binary_classifications table created successfully!' as status;
