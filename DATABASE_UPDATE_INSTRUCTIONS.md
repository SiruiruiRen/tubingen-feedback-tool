# Database Update Instructions

The rating system requires additional columns in your Supabase database. Since the automatic update might not work due to security restrictions, please follow these manual steps:

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to your project: `immrkllzjvhdnzesmaat`
3. Go to the "SQL Editor" tab
4. Copy and paste the following SQL commands:

```sql
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

-- Add other missing columns if they don't exist
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS video_id VARCHAR(10);

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS feedback_text_short TEXT;

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS analysis_percentages JSONB;

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS interaction_data JSONB;

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS revision_initiated_from VARCHAR(20);

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS pre_revision_interaction JSONB;

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en';

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS style VARCHAR(20) DEFAULT 'academic';

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS session_id VARCHAR(50);
```

5. Click "Run" to execute the SQL
6. You should see success messages for each column addition

## Option 2: Using the Update Tool

1. Open `update-database.html` in your browser
2. Click "Run Database Update"
3. Check the log for any errors

## Verification

After running the update, you can verify it worked by:

1. Going back to the main app (`index.html`)
2. Generating some feedback
3. Trying to submit a rating - it should work without errors

## Troubleshooting

If you still get errors:

1. Check the browser console for specific error messages
2. Verify the columns exist in your Supabase dashboard under "Table Editor" > "reflections"
3. Make sure your Supabase project has the correct permissions

The most important columns for the rating system are:
- `capabilities_rating`
- `ease_rating` 
- `umux_score`
- `rated_at` 