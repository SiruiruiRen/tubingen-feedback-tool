# Database Migration Instructions

## Issue
The application is failing because it's trying to use the new database schema, but your Supabase database still has the old structure.

**Error:** `Could not find the 'feedback_text' column of 'reflections' in the schema cache`

## Solution: Update Your Supabase Database

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Navigate to your project: `immrkllzjvhdnzesmaat`

2. **Open SQL Editor:**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Execute the Safe Migration:**
   - Copy the entire content from `supabase-safe-migration.sql` (recommended)
   - OR use `supabase-update.sql` if you want the original version
   - Paste it into the SQL Editor
   - Click "Run" to execute

### Method 2: Using Supabase CLI (Alternative)

If you have Supabase CLI installed:

```bash
# Navigate to your project directory
cd /Users/sirui/Desktop/tubigen

# Run the migration
supabase db reset --db-url "your-database-url"
# OR
supabase db push
```

### Method 3: Manual Table Updates (If needed)

If you prefer to update manually, execute these key commands in your Supabase SQL Editor:

```sql
-- 1. Drop and recreate the reflections table with new schema
DROP TABLE IF EXISTS reflections CASCADE;

-- 2. Create the new reflections table
CREATE TABLE reflections (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    participant_name VARCHAR(100) NOT NULL,
    video_id VARCHAR(10) NOT NULL,
    language VARCHAR(2) NOT NULL CHECK (language IN ('en', 'de')),
    
    -- Original reflection and analysis
    reflection_text TEXT NOT NULL,
    analysis_percentages JSONB NOT NULL,
    weakest_component VARCHAR(20) NOT NULL,
    
    -- Generated feedback
    feedback_extended TEXT NOT NULL,
    feedback_short TEXT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Revision tracking
    revision_number INTEGER DEFAULT 1,
    parent_reflection_id INTEGER REFERENCES reflections(id),
    
    -- Rating data
    capabilities_rating INTEGER CHECK (capabilities_rating >= 1 AND capabilities_rating <= 5),
    ease_rating INTEGER CHECK (ease_rating >= 1 AND ease_rating <= 5),
    umux_score DECIMAL(5,2),
    rated_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create the user_events table
CREATE TABLE user_events (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    reflection_id INTEGER REFERENCES reflections(id),
    
    -- Event details
    event_type VARCHAR(30) NOT NULL,
    timestamp_utc TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Event-specific data
    event_data JSONB,
    
    -- User context
    user_agent TEXT,
    language VARCHAR(2),
    
    CONSTRAINT valid_event_types CHECK (
        event_type IN (
            'submit_reflection',
            'resubmit_reflection', 
            'select_feedback_style',
            'view_feedback_start',
            'view_feedback_end',
            'click_revise',
            'submit_rating',
            'expand_definitions',
            'copy_feedback',
            'session_start',
            'session_end'
        )
    )
);

-- 4. Create indexes
CREATE INDEX idx_reflections_session_id ON reflections(session_id);
CREATE INDEX idx_reflections_revision ON reflections(revision_number);
CREATE INDEX idx_reflections_parent ON reflections(parent_reflection_id);
CREATE INDEX idx_user_events_session ON user_events(session_id);
CREATE INDEX idx_user_events_type ON user_events(event_type);
CREATE INDEX idx_user_events_timestamp ON user_events(timestamp_utc);
CREATE INDEX idx_user_events_reflection ON user_events(reflection_id);
```

## After Migration

1. **Test the Application:**
   - Try generating feedback again
   - The error should be resolved

2. **Verify New Features:**
   - Event logging should now work
   - Revision tracking should function properly
   - New analysis views should be available

## Rollback (If Needed)

If you need to rollback to the old schema:

```sql
-- Recreate old table structure (basic version)
DROP TABLE IF EXISTS reflections CASCADE;
CREATE TABLE reflections (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(100),
    video_id VARCHAR(10),
    reflection_text TEXT,
    feedback_text TEXT,
    feedback_text_short TEXT,
    analysis_percentages JSONB,
    language VARCHAR(5),
    style VARCHAR(20),
    session_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    capabilities_rating INTEGER,
    ease_rating INTEGER,
    umux_score DECIMAL(5,2),
    rated_at TIMESTAMP WITH TIME ZONE
);
```

## Important Notes

⚠️ **Data Loss Warning:** The migration will drop the existing table and recreate it. Any existing data will be lost.

✅ **Backup First:** If you have important data, export it before running the migration.

🔄 **Testing:** Test the application thoroughly after migration to ensure everything works correctly.

## Next Steps

After successful migration:
1. Test feedback generation
2. Test revision functionality  
3. Test event logging
4. Review the new analysis capabilities in `EVENT_LOGGING_GUIDE.md` 