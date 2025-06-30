-- Fix Revision Relationships for Existing Data
-- This script updates existing reflections to have proper parent-child relationships

-- Step 1: Update revision numbers for existing data
-- Set revision_number = 1 for all reflections that don't have a revision number set
UPDATE reflections 
SET revision_number = 1 
WHERE revision_number IS NULL;

-- Step 2: Identify and fix revision relationships based on session_id and created_at
-- For each session, find reflections and set up proper parent-child relationships

WITH session_reflections AS (
    SELECT 
        id,
        session_id,
        created_at,
        ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY created_at) as sequence_number
    FROM reflections
    ORDER BY session_id, created_at
),
first_reflections AS (
    SELECT 
        session_id,
        id as first_reflection_id
    FROM session_reflections 
    WHERE sequence_number = 1
)
UPDATE reflections r
SET 
    revision_number = sr.sequence_number,
    parent_reflection_id = CASE 
        WHEN sr.sequence_number = 1 THEN NULL
        ELSE fr.first_reflection_id
    END
FROM session_reflections sr
JOIN first_reflections fr ON sr.session_id = fr.session_id
WHERE r.id = sr.id;

-- Step 3: Verify the updates
SELECT 
    session_id,
    id,
    revision_number,
    parent_reflection_id,
    created_at,
    CASE 
        WHEN revision_number = 1 AND parent_reflection_id IS NULL THEN 'Original'
        WHEN revision_number > 1 AND parent_reflection_id IS NOT NULL THEN 'Revision'
        ELSE 'Needs Fix'
    END as status
FROM reflections 
ORDER BY session_id, revision_number;

-- Step 4: Show summary statistics
SELECT 
    COUNT(*) as total_reflections,
    COUNT(CASE WHEN revision_number = 1 THEN 1 END) as original_reflections,
    COUNT(CASE WHEN revision_number > 1 THEN 1 END) as revisions,
    COUNT(CASE WHEN parent_reflection_id IS NOT NULL THEN 1 END) as reflections_with_parent
FROM reflections;

-- Step 5: Test the revision_patterns view
SELECT * FROM revision_patterns LIMIT 5; 