# Student Testing Guide - INFER Simplified Version

## 🎓 For Classroom Use

**URL:** https://infer-task-survey.netlify.app

---

## 📝 What Students Will Do

### Step 1: Welcome Page

1. **Choose language:** English or Deutsch (top of page)
2. **Read welcome message**
3. **Click "Open Teaching Video"** button
4. **Enter password:** M52025
5. **Watch the video** (opens in new tab)
6. **Return to page and check:** "I have watched the video"
7. **Data consent:** Select "I agree to the use of data for scientific purposes"
8. **Click:** "Continue to Task"

---

### Step 2: Task 1

1. **Enter Participant Code:**
   - Create a code using: Mother's first name (first letter) + Birth month (2 digits) + Birth year (2 digits)
   - Example: Mother named Anna, born August 1995 → **A0895**

2. **Select video:** Choose the video they watched

3. **Choose language:** English or Deutsch

4. **Write reflection** in the text area

5. **Click "Generate Feedback"**

6. **Choose feedback style:** Extended or Short

7. **Read feedback**
   - Can switch between Extended/Short
   - Can copy feedback
   - Can click "Learn Key Concepts" for help

8. **Revise if needed:**
   - Click "Revise Reflection"
   - Edit text
   - Generate new feedback

9. **When satisfied, click "Submit Final Reflection"**

---

### Step 3: Survey

1. **Complete the Qualtrics survey** (embedded on page)

2. **Click "Complete Study"**

---

### Step 4: Done!

Thank you page with citation information.

---

## 🔑 Participant Code Examples

| Mother's Name | Birth Month | Birth Year | Code |
|---------------|-------------|------------|------|
| Anna | August (08) | 1995 (95) | **A0895** |
| Maria | January (01) | 2000 (00) | **M0100** |
| Sophie | December (12) | 1998 (98) | **S1298** |
| Barbara | March (03) | 2001 (01) | **B0301** |

**Important:** Students must remember their code! They need it if they return to the system.

---

## ⏱️ Expected Time

- **Welcome + Video:** ~5-10 minutes
- **Task 1:** ~15-30 minutes (depending on revisions)
- **Survey:** ~3-5 minutes
- **Total:** ~25-45 minutes

---

## 🎯 For Teachers/Instructors

### Before Class:
1. ✅ Test the site yourself
2. ✅ Write down the video password: **M52025**
3. ✅ Prepare example participant code (e.g., A0895)
4. ✅ Check Supabase is working (see below)

### During Class:
1. ✅ Project the URL: https://infer-task-survey.netlify.app
2. ✅ Explain participant code generation
3. ✅ Provide video password: M52025
4. ✅ Walk through the consent process
5. ✅ Let students work independently

### After Class:
1. ✅ Check Supabase dashboard for data
2. ✅ Export data using SQL queries
3. ✅ Analyze results

---

## 🗄️ Create Database Table (One-Time Setup)

**IMPORTANT:** Run this SQL in Supabase before students test!

Go to: https://supabase.com/dashboard → Your project → SQL Editor

Copy and paste:

```sql
-- Create binary_classifications table
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_classifications_reflection ON binary_classifications(reflection_id);
CREATE INDEX IF NOT EXISTS idx_classifications_session ON binary_classifications(session_id);
CREATE INDEX IF NOT EXISTS idx_classifications_task ON binary_classifications(task_id);

-- Security
ALTER TABLE binary_classifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON binary_classifications FOR ALL USING (true) WITH CHECK (true);

SELECT 'binary_classifications table created!' as status;
```

---

## ✅ Quality Checks

### Test Checklist:

- [ ] Language switcher works (English ↔ Deutsch)
- [ ] Video link opens in new tab
- [ ] Password copy button works
- [ ] Video watched checkbox enables continue
- [ ] Consent "Agree" enables continue
- [ ] Consent "Disagree" disables continue + shows message
- [ ] Continue button goes to Task 1
- [ ] Participant code input works
- [ ] Feedback generation works
- [ ] Analysis distribution shows
- [ ] Extended/Short tabs work
- [ ] Reading duration logged
- [ ] Revise button works
- [ ] Warning bubble shows for duplicates
- [ ] Final submission works
- [ ] Survey loads
- [ ] Complete study button works
- [ ] Thank you page shows

---

## 📊 Data to Check in Supabase

After student testing, verify:

### Table: `reflections`
```sql
SELECT 
    participant_name,  -- Should be codes like A0895, not names
    task_id,
    analysis_percentages,
    created_at
FROM reflections
WHERE created_at >= CURRENT_DATE
ORDER BY created_at DESC;
```

### Table: `binary_classifications`
```sql
SELECT 
    participant_name,  -- Should be codes
    window_id,
    description_score,
    explanation_score,
    prediction_score
FROM binary_classifications
WHERE created_at >= CURRENT_DATE
ORDER BY created_at DESC;
```

### Table: `user_events`
```sql
SELECT 
    event_type,
    event_data->>'participant_name' as code,  -- Should be codes
    timestamp_utc
FROM user_events
WHERE timestamp_utc >= CURRENT_DATE
ORDER BY timestamp_utc DESC
LIMIT 50;
```

---

## 🎉 You're Ready!

The system is now:
- ✅ Professional looking
- ✅ Privacy compliant
- ✅ Data protection approved
- ✅ Easy for students to use
- ✅ Fully tracked for research
- ✅ Ready for classroom testing

**Just create the `binary_classifications` table and test!**


