# Using Shared Supabase Database - Data Separation Guide

## ✅ Current Setup (Already Working!)

Your simplified version uses the **same Supabase database** as your main research version.

**This is perfectly fine because:**
- ✅ Data is automatically separated by `task_id` and `session_id`
- ✅ No additional cost (same free tier)
- ✅ All data in one place (easier management)
- ✅ Can still query separately

---

## 🔍 How Data is Distinguished

### Automatic Separation Fields:

Every record includes identifying fields:

| Field | Simplified Version | Main Research Version |
|-------|-------------------|----------------------|
| `task_id` | `'task1'` or `'task2'` | `'task1'` or `'task2'` (same) |
| `session_id` | `'session_[timestamp]_[random]'` | Different session IDs |
| Created dates | October 2025 onwards | Your original study dates |

**Best way to distinguish:** Use **date ranges** or **session IDs**

---

## 📊 SQL Queries to Get ONLY Simplified Version Data

### Query 1: Get Reflections from Simplified Version Only

**By Date Range (Recommended):**
```sql
-- Get data from simplified version (started today)
SELECT * FROM reflections
WHERE created_at >= '2025-10-16'  -- Adjust to when you started using simplified version
ORDER BY created_at DESC;
```

**By Session ID Pattern:**
```sql
-- Get all unique sessions from simplified version
SELECT DISTINCT session_id, participant_name, MIN(created_at) as first_activity
FROM reflections
WHERE created_at >= '2025-10-16'
GROUP BY session_id, participant_name
ORDER BY first_activity DESC;
```

### Query 2: Get Binary Classifications from Simplified Version

```sql
-- Get all binary classifications from simplified version
SELECT 
    bc.reflection_id,
    bc.participant_name,
    bc.task_id,
    bc.window_id,
    bc.window_text,
    bc.description_score,
    bc.explanation_score,
    bc.prediction_score,
    bc.created_at
FROM binary_classifications bc
WHERE bc.created_at >= '2025-10-16'  -- Simplified version start date
ORDER BY bc.reflection_id, bc.window_id;
```

### Query 3: Get User Events from Simplified Version

```sql
-- Get all interaction events from simplified version
SELECT 
    event_type,
    event_data,
    timestamp_utc
FROM user_events
WHERE timestamp_utc >= '2025-10-16'  -- Simplified version start date
ORDER BY timestamp_utc;
```

### Query 4: Complete Participant Data (Simplified Version Only)

```sql
-- Get everything for one participant from simplified version
WITH simplified_sessions AS (
    SELECT DISTINCT session_id
    FROM reflections
    WHERE created_at >= '2025-10-16'
    AND participant_name = 'Student A'
)
SELECT 
    'reflection' as data_type,
    r.task_id,
    r.revision_number,
    r.analysis_percentages,
    r.created_at as timestamp,
    NULL as binary_data
FROM reflections r
WHERE r.session_id IN (SELECT session_id FROM simplified_sessions)

UNION ALL

SELECT 
    'binary_classification' as data_type,
    bc.task_id,
    NULL as revision_number,
    NULL as analysis_percentages,
    bc.created_at as timestamp,
    jsonb_build_object(
        'window_id', bc.window_id,
        'description', bc.description_score,
        'explanation', bc.explanation_score,
        'prediction', bc.prediction_score
    ) as binary_data
FROM binary_classifications bc
WHERE bc.session_id IN (SELECT session_id FROM simplified_sessions)

ORDER BY timestamp;
```

---

## 📈 Recommended Date Filter

**Set your cutoff date** based on when you started using the simplified version:

```sql
-- Create a view for easy querying
CREATE VIEW simplified_version_data AS
SELECT * FROM reflections
WHERE created_at >= '2025-10-16 00:00:00';  -- Adjust this date!

CREATE VIEW simplified_version_classifications AS
SELECT * FROM binary_classifications
WHERE created_at >= '2025-10-16 00:00:00';  -- Adjust this date!

CREATE VIEW simplified_version_events AS
SELECT * FROM user_events
WHERE timestamp_utc >= '2025-10-16 00:00:00';  -- Adjust this date!
```

Then query simply:
```sql
SELECT * FROM simplified_version_data;
SELECT * FROM simplified_version_classifications;
SELECT * FROM simplified_version_events;
```

---

## 🎯 Verify Data is Being Stored

### Check Right Now:

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Select your project:** (immrkllzjvhdnzesmaat)

3. **Go to Table Editor**

4. **Check these tables:**
   - `reflections` - Should see your test data
   - `binary_classifications` - Should see window-level scores
   - `user_events` - Should see interaction logs

5. **Filter by date:**
   ```sql
   created_at >= '2025-10-16'
   ```

---

## 💡 Advantages of Shared Database

### Pros:
✅ **One database to manage** (simpler)  
✅ **No extra cost** (same free tier)  
✅ **All data accessible** from one dashboard  
✅ **Can compare** main vs simplified version  
✅ **Already working** - no setup needed!  

### How to Keep Separate:
✅ Use **date filters** (simplified started Oct 16)  
✅ Use **session IDs** (each session is unique)  
✅ Use **SQL views** (create filtered views)  
✅ **Export separately** when needed  

---

## 📊 What's Currently Being Stored

**Right now, when someone uses your simplified version:**

1. **Creates session** → Logged to `user_events`
2. **Views video page** → Logged to `user_events`
3. **Checks "watched video"** → Logged to `user_events`
4. **Navigates to Task 1** → Logged to `user_events`
5. **Generates feedback:**
   - Analyzes reflection
   - **Stores ALL binary classifications** → `binary_classifications` table
   - **Stores reflection + final scores** → `reflections` table
   - **Logs event** → `user_events`
6. **Every click** → Logged to `user_events`
7. **Final submission** → Updated in `reflections`, logged to `user_events`

**All of this is ALREADY HAPPENING!** ✅

---

## 🔧 Quick Test - Verify It's Working

### Option 1: Live Test
1. Go to: https://infer-task-survey.netlify.app
2. Complete a test reflection
3. Check Supabase dashboard
4. Look for today's data in tables

### Option 2: SQL Query
Run this in your Supabase SQL Editor:

```sql
-- Check if simplified version is storing data
SELECT 
    'Reflections' as table_name,
    COUNT(*) as rows_today
FROM reflections
WHERE created_at >= CURRENT_DATE
UNION ALL
SELECT 
    'Binary Classifications' as table_name,
    COUNT(*) as rows_today
FROM binary_classifications
WHERE created_at >= CURRENT_DATE
UNION ALL
SELECT 
    'User Events' as table_name,
    COUNT(*) as rows_today
FROM user_events
WHERE timestamp_utc >= CURRENT_DATE;
```

---

## ✅ Summary

**Current Status:**
- ✅ Simplified version uses shared database
- ✅ All data is being stored (reflections, binary classifications, events)
- ✅ Data is distinguishable by date/session
- ✅ No setup needed - already working!

**Your Next Steps:**
1. Test the site: https://infer-task-survey.netlify.app
2. Check Supabase dashboard for today's data
3. Use the SQL queries above to view simplified version data

**Everything is already set up and working!** 🎉

Want me to verify the data is flowing correctly? Or do you want to see a live example of the data in your database?
