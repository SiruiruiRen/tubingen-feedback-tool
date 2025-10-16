# SQL Queries Reference - INFER Data Analysis

## 📊 Quick Reference for Analyzing Your Data

All queries assume you're in Supabase SQL Editor or using a SQL client connected to your database.

---

## 🎯 Most Common Queries

### 1. View All Participants
```sql
SELECT DISTINCT 
    participant_name,
    COUNT(DISTINCT session_id) as sessions,
    COUNT(*) as total_reflections
FROM reflections
GROUP BY participant_name
ORDER BY participant_name;
```

### 2. Get Complete Data for One Participant
```sql
-- Replace 'Student A' with actual participant name
SELECT 
    r.id,
    r.task_id,
    r.revision_number,
    r.analysis_percentages,
    r.weakest_component,
    r.created_at
FROM reflections r
WHERE r.participant_name = 'Student A'
ORDER BY r.task_id, r.revision_number;
```

### 3. View Binary Classifications for One Reflection
```sql
-- Replace 123 with actual reflection ID
SELECT 
    window_id,
    LEFT(window_text, 100) as window_preview,
    description_score,
    explanation_score,
    prediction_score,
    (description_score + explanation_score + prediction_score) as total_score
FROM binary_classifications
WHERE reflection_id = 123
ORDER BY window_id;
```

### 4. See All Events for One Session
```sql
-- Replace with actual session_id
SELECT 
    event_type,
    event_data,
    timestamp_utc
FROM user_events
WHERE session_id = 'session_1729097234567_abc123'
ORDER BY timestamp_utc;
```

---

## 📈 Analysis Queries

### Task Progression Analysis
```sql
SELECT 
    task_id,
    AVG((analysis_percentages->>'description')::float) as avg_description,
    AVG((analysis_percentages->>'explanation')::float) as avg_explanation,
    AVG((analysis_percentages->>'prediction')::float) as avg_prediction,
    COUNT(*) as total_submissions
FROM reflections
WHERE revision_number = 1  -- Only initial submissions
GROUP BY task_id;
```

### Revision Patterns
```sql
SELECT 
    participant_name,
    task_id,
    COUNT(*) as number_of_revisions,
    MAX(created_at) - MIN(created_at) as time_spent
FROM reflections
GROUP BY participant_name, task_id
ORDER BY participant_name, task_id;
```

### Binary Classification Summary
```sql
SELECT 
    task_id,
    COUNT(*) as total_windows,
    SUM(description_score) as windows_with_description,
    SUM(explanation_score) as windows_with_explanation,
    SUM(prediction_score) as windows_with_prediction,
    ROUND(AVG(description_score) * 100, 1) as pct_description,
    ROUND(AVG(explanation_score) * 100, 1) as pct_explanation,
    ROUND(AVG(prediction_score) * 100, 1) as pct_prediction
FROM binary_classifications
GROUP BY task_id;
```

### User Interaction Frequency
```sql
SELECT 
    event_type,
    COUNT(*) as frequency,
    COUNT(DISTINCT session_id) as unique_users
FROM user_events
GROUP BY event_type
ORDER BY frequency DESC;
```

---

## 🔬 Detailed Research Queries

### Complete Participant Journey
```sql
WITH participant_data AS (
    SELECT DISTINCT session_id, participant_name
    FROM reflections
    WHERE participant_name = 'Student A'
)
SELECT 
    'Reflections' as data_type,
    r.task_id,
    r.revision_number,
    r.analysis_percentages,
    r.created_at as timestamp
FROM reflections r
JOIN participant_data p ON r.session_id = p.session_id
UNION ALL
SELECT 
    'Event' as data_type,
    e.event_data->>'task' as task_id,
    NULL as revision_number,
    jsonb_build_object('event_type', e.event_type) as data,
    e.timestamp_utc as timestamp
FROM user_events e
JOIN participant_data p ON e.session_id = p.session_id
ORDER BY timestamp;
```

### Window-Level Analysis with Percentages
```sql
SELECT 
    r.participant_name,
    r.task_id,
    r.revision_number,
    bc.window_id,
    bc.window_text,
    bc.description_score,
    bc.explanation_score,
    bc.prediction_score,
    r.analysis_percentages->>'description' as final_desc_pct,
    r.analysis_percentages->>'explanation' as final_expl_pct,
    r.analysis_percentages->>'prediction' as final_pred_pct
FROM binary_classifications bc
JOIN reflections r ON bc.reflection_id = r.id
WHERE r.participant_name = 'Student A'
ORDER BY r.task_id, r.revision_number, bc.window_id;
```

### Improvement Over Revisions
```sql
SELECT 
    participant_name,
    task_id,
    revision_number,
    analysis_percentages->>'description' as description_pct,
    analysis_percentages->>'explanation' as explanation_pct,
    analysis_percentages->>'prediction' as prediction_pct,
    analysis_percentages->>'professional_vision' as pv_total,
    weakest_component,
    LENGTH(reflection_text) as text_length
FROM reflections
WHERE participant_name = 'Student A'
ORDER BY task_id, revision_number;
```

### Time Analysis
```sql
SELECT 
    r.participant_name,
    r.task_id,
    r.created_at as submission_time,
    LAG(r.created_at) OVER (PARTITION BY r.participant_name, r.task_id ORDER BY r.revision_number) as previous_submission,
    EXTRACT(EPOCH FROM (r.created_at - LAG(r.created_at) OVER (PARTITION BY r.participant_name, r.task_id ORDER BY r.revision_number))) as seconds_between_revisions
FROM reflections r
ORDER BY r.participant_name, r.task_id, r.revision_number;
```

---

## 📥 Export Data as CSV

### Export All Reflections
```sql
COPY (
    SELECT 
        id,
        session_id,
        participant_name,
        video_id,
        task_id,
        language,
        analysis_percentages->>'description' as description_pct,
        analysis_percentages->>'explanation' as explanation_pct,
        analysis_percentages->>'prediction' as prediction_pct,
        weakest_component,
        revision_number,
        LENGTH(reflection_text) as text_length,
        created_at
    FROM reflections
    ORDER BY participant_name, task_id, revision_number
) TO '/tmp/reflections_export.csv' WITH CSV HEADER;
```

Or use Supabase Dashboard:
- Table Editor → Select table
- Click "Export" button
- Choose CSV format

### Export Binary Classifications
```sql
SELECT 
    bc.id,
    bc.session_id,
    bc.reflection_id,
    bc.task_id,
    bc.participant_name,
    bc.window_id,
    bc.description_score,
    bc.explanation_score,
    bc.prediction_score,
    bc.created_at
FROM binary_classifications bc
ORDER BY bc.reflection_id, bc.window_id;
```

---

## 🔍 Data Validation Queries

### Check for Missing Binary Classifications
```sql
-- Reflections that might be missing binary classifications
SELECT 
    r.id as reflection_id,
    r.participant_name,
    r.task_id,
    r.revision_number,
    COUNT(bc.id) as num_classifications
FROM reflections r
LEFT JOIN binary_classifications bc ON r.id = bc.reflection_id
GROUP BY r.id, r.participant_name, r.task_id, r.revision_number
HAVING COUNT(bc.id) = 0
ORDER BY r.created_at DESC;
```

### Verify Data Completeness
```sql
SELECT 
    'reflections' as table_name,
    COUNT(*) as total_rows,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT participant_name) as unique_participants,
    MIN(created_at) as earliest,
    MAX(created_at) as latest
FROM reflections
UNION ALL
SELECT 
    'binary_classifications' as table_name,
    COUNT(*) as total_rows,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT participant_name) as unique_participants,
    MIN(created_at) as earliest,
    MAX(created_at) as latest
FROM binary_classifications
UNION ALL
SELECT 
    'user_events' as table_name,
    COUNT(*) as total_rows,
    COUNT(DISTINCT session_id) as unique_sessions,
    NULL as unique_participants,
    MIN(timestamp_utc) as earliest,
    MAX(timestamp_utc) as latest
FROM user_events;
```

---

## 📊 Aggregated Statistics

### Overall Study Statistics
```sql
SELECT 
    COUNT(DISTINCT participant_name) as total_participants,
    COUNT(DISTINCT session_id) as total_sessions,
    COUNT(*) as total_reflections,
    SUM(CASE WHEN task_id = 'task1' THEN 1 ELSE 0 END) as task1_count,
    SUM(CASE WHEN task_id = 'task2' THEN 1 ELSE 0 END) as task2_count,
    AVG(revision_number) as avg_revisions_per_task,
    SUM(CASE WHEN revision_number > 1 THEN 1 ELSE 0 END) as total_revisions
FROM reflections;
```

### Binary Classification Aggregates by Component
```sql
SELECT 
    participant_name,
    task_id,
    COUNT(*) as total_windows,
    ROUND(AVG(description_score) * 100, 1) as avg_description_pct,
    ROUND(AVG(explanation_score) * 100, 1) as avg_explanation_pct,
    ROUND(AVG(prediction_score) * 100, 1) as avg_prediction_pct
FROM binary_classifications
GROUP BY participant_name, task_id
ORDER BY participant_name, task_id;
```

---

## 💾 Backup Your Data

### Full Database Backup
In Supabase Dashboard:
1. Settings → Database
2. Click "Database Backups"
3. Download backup

### Export All Tables as JSON
```sql
-- In SQL Editor, run each separately and save results:

-- Reflections
SELECT json_agg(row_to_json(reflections)) FROM reflections;

-- Binary Classifications  
SELECT json_agg(row_to_json(binary_classifications)) FROM binary_classifications;

-- Events
SELECT json_agg(row_to_json(user_events)) FROM user_events;
```

---

## 🎓 After I Set Up Your Database

I will provide you with:
1. ✅ Verification queries (to confirm data is being stored)
2. ✅ Export scripts (Python/R examples)
3. ✅ Analysis templates (ready-to-use SQL)
4. ✅ Data dictionary (what each field means)

---

## 🚀 Next Step

**Go create your Supabase project now!**

1. Visit: https://supabase.com/dashboard
2. Create project (name: `infer-task-survey`)
3. Copy Project URL and anon key
4. Share them with me

I'll handle the rest! 🎯

