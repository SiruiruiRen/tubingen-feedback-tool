# Create New Supabase Database - Step by Step

## 🎯 Goal
Create a **separate** Supabase database for the simplified INFER version with complete data collection.

---

## 📝 STEP 1: Create New Supabase Project

### 1.1 Go to Supabase
Open this link: **https://supabase.com/dashboard**

### 1.2 Create New Project
- Click the **green "New Project"** button
- If prompted, select your organization

### 1.3 Fill in Project Details

**Project Name:**
```
infer-task-survey
```

**Database Password:**
Create a strong password, for example:
```
InferTask2025!Secure
```
⚠️ **SAVE THIS PASSWORD!** You'll need it to access the database directly.

**Region:**
Choose the closest to your users:
- 🇪🇺 Europe → `Europe (Frankfurt)` or `Europe (London)`
- 🇺🇸 US → `US East (Ohio)` or `US West (Oregon)`

**Plan:**
- Select: **Free** (no credit card needed)

### 1.4 Create
- Click **"Create new project"**
- ⏳ Wait 2-3 minutes (makes a coffee!)

---

## 📋 STEP 2: Copy Your Credentials

Once the project is ready:

### 2.1 Go to Settings → API
- Left sidebar: Click **"Settings"** (gear icon)
- Click **"API"**

### 2.2 Copy These TWO Values

**A. Project URL:**
You'll see something like:
```
URL
https://abcdefghijklmnop.supabase.co
```
📋 **Copy this entire URL**

**B. anon public key:**
Scroll down to find:
```
Project API keys
anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
📋 **Copy this entire long key** (it's very long - make sure you get it all!)

### 2.3 Send Me These Values

**Reply with:**
```
Project URL: https://xxxxx.supabase.co
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Once you give me these, I'll:
1. Update your app.js automatically
2. Create the database tables
3. Redeploy to Netlify
4. Verify everything works

---

## 🔄 What Happens Next (I'll Handle This)

After you give me credentials, I will:

1. ✅ Update `app.js` with new credentials
2. ✅ Create all database tables via SQL
3. ✅ Set up proper indexes
4. ✅ Configure security policies
5. ✅ Test the connection
6. ✅ Deploy to Netlify
7. ✅ Verify data is being stored

---

## 🎯 What Will Be Stored (Complete!)

### Table 1: `reflections`
**Every feedback generation creates one row:**
- Session ID
- Participant name
- Video ID
- Full reflection text
- **Final aggregated percentages** (Description: 35%, Explanation: 40%, Prediction: 20%)
- Weakest component identified
- Generated feedback (both extended and short versions)
- Revision number (1, 2, 3...)
- Parent reflection ID (for tracking revisions)
- Timestamp

### Table 2: `binary_classifications` ⭐ NEW!
**Every window analyzed creates one row with binary scores:**
- Session ID
- Reflection ID (links to reflections table)
- Window ID (chunk_001, chunk_002, etc.)
- **Window text** (the actual 3 sentences classified)
- **description_score** (0 or 1)
- **explanation_score** (0 or 1)  
- **prediction_score** (0 or 1)
- Timestamp

**Example:** If reflection has 8 windows → 8 rows inserted!

### Table 3: `user_events`
**Every click/interaction creates one row:**
- Session ID
- Event type (click_revise, copy_feedback, page_view, etc.)
- Event data (task, participant name, etc.)
- User agent (browser info)
- Language
- Timestamp

---

## 📊 Example: What Gets Stored for One Participant

### Participant completes Task 1 with 2 revisions:

**`reflections` table:** 3 rows
```
Row 1: Initial submission (revision_number=1)
Row 2: First revision (revision_number=2, parent_reflection_id=Row 1's ID)
Row 3: Second revision (revision_number=3, parent_reflection_id=Row 1's ID)
```

**`binary_classifications` table:** ~24 rows
```
Initial: 8 windows × 3 scores each = 8 rows
Revision 1: 8 windows = 8 rows
Revision 2: 8 windows = 8 rows
Total: 24 rows with all binary classifications!
```

**`user_events` table:** ~15-20 rows
```
- page_view (video-intro)
- video_watched_confirmation
- page_view (task1)
- submit_reflection (initial)
- copy_feedback
- click_revise (revision 1)
- submit_reflection (revision 1)
- click_revise (revision 2)
- submit_reflection (revision 2)
- final_submission
- page_view (survey1)
- ... and more
```

---

## 🔍 Clear SQL Queries (I'll Provide More After Setup)

### Get all data for one participant:
```sql
-- All reflections
SELECT * FROM reflections 
WHERE participant_name = 'Student A'
ORDER BY task_id, revision_number;

-- All binary classifications
SELECT * FROM binary_classifications
WHERE participant_name = 'Student A'
ORDER BY task_id, reflection_id, window_id;

-- Complete interaction log
SELECT * FROM user_events
WHERE session_id IN (
    SELECT DISTINCT session_id FROM reflections 
    WHERE participant_name = 'Student A'
)
ORDER BY timestamp_utc;
```

### Get binary scores for specific reflection:
```sql
SELECT 
    window_id,
    window_text,
    description_score,
    explanation_score,
    prediction_score
FROM binary_classifications
WHERE reflection_id = 123
ORDER BY window_id;
```

---

## ⚡ Quick Start - Do This Now:

1. **Open Supabase:** https://supabase.com/dashboard
2. **Click "New Project"**
3. **Fill in:** Name = `infer-task-survey`, Password = (your choice), Region = (your choice)
4. **Wait 2-3 minutes**
5. **Go to Settings → API**
6. **Copy both:** Project URL and anon key
7. **Reply here with those two values**

Then I'll automatically:
- ✅ Update your code with new credentials
- ✅ Create all tables with proper structure
- ✅ Add clear query examples
- ✅ Deploy and test
- ✅ Verify data storage works

---

**Ready? Start Step 1 and let me know when you have your credentials!** 🚀
