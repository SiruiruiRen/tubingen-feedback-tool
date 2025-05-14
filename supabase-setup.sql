-- Create a reflections table
CREATE TABLE IF NOT EXISTS reflections (
    id SERIAL PRIMARY KEY,
    student_name TEXT NOT NULL,
    reflection_text TEXT NOT NULL,
    feedback_text TEXT NOT NULL,
    revised_text TEXT,
    feedback_rating INT,
    usefulness_rating INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    rated_at TIMESTAMP WITH TIME ZONE
);

-- Create an index on student_name for quick lookups
CREATE INDEX IF NOT EXISTS idx_reflections_student_name ON reflections(student_name);

-- Enable Row Level Security (RLS)
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anonymous access for demo purposes
-- For a production application, you would want to restrict this further
DO $$
BEGIN
    -- Check if policy exists first
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reflections' 
        AND policyname = 'Allow anonymous access'
    ) THEN
        EXECUTE 'CREATE POLICY "Allow anonymous access" ON reflections
                FOR ALL
                TO anon
                USING (true)';
    END IF;
END
$$;

-- Drop the view if it exists and recreate it
DROP VIEW IF EXISTS reflection_analytics;

-- Create a view for getting feedback analytics
CREATE VIEW reflection_analytics AS
SELECT
    student_name,
    COUNT(*) as total_reflections,
    AVG(feedback_rating) as avg_feedback_rating,
    AVG(usefulness_rating) as avg_usefulness_rating,
    COUNT(revised_text) as revision_count
FROM
    reflections
GROUP BY
    student_name;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS get_student_reflections(TEXT);

-- Function to get reflections for a specific student
CREATE FUNCTION get_student_reflections(student_name_param TEXT)
RETURNS TABLE (
    id INTEGER,
    reflection_text TEXT,
    feedback_text TEXT,
    revised_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.reflection_text,
        r.feedback_text,
        r.revised_text,
        r.created_at
    FROM
        reflections r
    WHERE
        r.student_name = student_name_param
    ORDER BY
        r.created_at DESC;
END;
$$ LANGUAGE plpgsql; 