# Setting Up a New Supabase Database for Simplified Version

## Why Separate Database?

- ✅ Keep simplified version data separate from research study data
- ✅ No conflicts or data mixing
- ✅ Independent data management
- ✅ Can experiment without affecting main study

## Step-by-Step Setup

### 1. Create New Supabase Project

1. **Go to Supabase:**
   - Visit: https://supabase.com/dashboard

2. **Create New Project:**
   - Click "New Project"
   - Organization: Select your organization
   - Name: `infer-task-survey` (or any name you prefer)
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to your users
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get Your Credentials:**
   - Go to: Settings → API
   - Copy these two values:
     - **Project URL:** `https://xxxxx.supabase.co`
     - **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Create Database Tables

Go to: SQL Editor → New Query

Copy and paste this SQL script:

```sql
-- ============================================================================
-- INFER Simplified Version - Database Schema
-- ============================================================================

-- Table 1: Reflections (main table)
CREATE TABLE IF NOT EXISTS reflections (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    participant_name TEXT,
    video_id TEXT,
    language TEXT,
    task_id TEXT,
    reflection_text TEXT NOT NULL,
    analysis_percentages JSONB,
    weakest_component TEXT,
    feedback_extended TEXT,
    feedback_short TEXT,
    revision_number INTEGER DEFAULT 1,
    parent_reflection_id BIGINT REFERENCES reflections(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Table 3: User Events (interaction logs)
CREATE TABLE IF NOT EXISTS user_events (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    reflection_id BIGINT REFERENCES reflections(id),
    event_type TEXT NOT NULL,
    event_data JSONB,
    user_agent TEXT,
    language TEXT,
    timestamp_utc TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reflections_session ON reflections(session_id);
CREATE INDEX IF NOT EXISTS idx_reflections_task ON reflections(task_id);
CREATE INDEX IF NOT EXISTS idx_reflections_participant ON reflections(participant_name);

CREATE INDEX IF NOT EXISTS idx_classifications_reflection ON binary_classifications(reflection_id);
CREATE INDEX IF NOT EXISTS idx_classifications_session ON binary_classifications(session_id);
CREATE INDEX IF NOT EXISTS idx_classifications_task ON binary_classifications(task_id);

CREATE INDEX IF NOT EXISTS idx_events_session ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_reflection ON user_events(reflection_id);

-- Enable Row Level Security (RLS) but allow all operations for now
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE binary_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- Create policies to allow inserts and reads
CREATE POLICY "Allow all operations on reflections" ON reflections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on binary_classifications" ON binary_classifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on user_events" ON user_events FOR ALL USING (true) WITH CHECK (true);

-- Success message
SELECT 'Database schema created successfully!' as status;
```

Click **"Run"** to create all tables.

### 3. Update Your App Credentials

**Option A: I'll do it for you**
Just provide me with:
- New Project URL
- New anon/public key

**Option B: Do it yourself**
Edit `/Users/sirui/Desktop/tubigen/infer-task-survey-version/app.js`:

Find lines 19-21:
```javascript
// Supabase configuration
const SUPABASE_URL = 'https://immrkllzjvhdnzesmaat.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

Replace with your new credentials:
```javascript
// Supabase configuration - SIMPLIFIED VERSION (separate from main study)
const SUPABASE_URL = 'https://YOUR-NEW-PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR-NEW-ANON-KEY';
```

### 4. Deploy

```bash
cd /Users/sirui/Desktop/tubigen
git add infer-task-survey-version/app.js
git commit -m "Update to use new separate Supabase database"
git push origin clean-branch:main

# Deploy to Netlify
cd infer-task-survey-version
netlify deploy --prod --dir=.
```

## Verify It Works

1. **Open the site:** https://infer-task-survey.netlify.app
2. **Check browser console:** Should see "✅ Supabase client initialized successfully"
3. **Generate feedback:** Test with sample reflection
4. **Check Supabase dashboard:**
   - Go to Table Editor
   - View `reflections` table
   - Should see new row!
   - View `binary_classifications` table
   - Should see multiple rows (one per window)
   - View `user_events` table
   - Should see interaction logs

## Your Two Databases

| Database | Used By | Purpose |
|----------|---------|---------|
| **Original Supabase** | Main research version | Your formal study data |
| **New Supabase** | Simplified version | Task-survey flow data |

**Benefits:**
- ✅ Data never mixes
- ✅ Can experiment freely
- ✅ Independent backups
- ✅ Separate analytics
- ✅ Clear data separation

## Free Tier Limits

Supabase free tier (per project):
- Database: 500 MB
- Bandwidth: 5 GB
- API Requests: Unlimited
- **Should handle 200-300 participants easily**

You can have **multiple free projects**!

## Need Help?

Let me know your new Supabase credentials and I'll update the code for you! Just provide:
1. New Project URL
2. New anon/public key

Or follow the steps above to do it yourself.

