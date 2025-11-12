# How to Export Time-Sequence Data from Supabase

## 🎯 Quick Steps

1. **Access Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor

2. **Choose Export Type**
   - Open `EXPORT_TIME_SEQUENCE_DATA.sql`
   - Select one of the 6 export options based on your needs

3. **Set Date Filter**
   - Replace `'2025-01-01'` with your cut-off date for NEW data only
   - Examples:
     - Last 7 days: `WHERE created_at >= NOW() - INTERVAL '7 days'`
     - Last 30 days: `WHERE created_at >= NOW() - INTERVAL '30 days'`
     - Specific date: `WHERE created_at >= '2025-02-01'`

4. **Run Query**
   - Click "Run" in SQL Editor
   - Results will appear below

5. **Export Data**
   - Click "Download CSV" button
   - Save the file for analysis

---

## 📊 Export Options Overview

### **Option 1: All User Events** ✅ Most Complete
**Best for:** Complete timeline analysis, sequence patterns

**What you get:**
- Every click, page view, and interaction
- Ordered by session and timestamp
- Full event data and metadata

**Use when:** You need to understand the complete user journey

---

### **Option 2: Session-Level Summary** ✅ Overview
**Best for:** Participant summaries with event sequences

**What you get:**
- Session-level aggregates
- Ordered event sequence arrays
- Duration calculations
- Total reflections and events per session

**Use when:** You want to compare sessions at a high level

---

### **Option 3: Feedback Reading Patterns** ✅ Engagement Analysis
**Best for:** Understanding how users engage with feedback

**What you get:**
- Reading session counts
- Tab switch counts
- Copy action counts
- Total reading time

**Use when:** Analyzing feedback effectiveness and engagement

---

### **Option 4: Revision Patterns** ✅ Iteration Analysis
**Best for:** Understanding revision behavior and timing

**What you get:**
- Each revision with full text
- Time between revisions
- Component percentages
- Weakest component identification

**Use when:** Studying how users iterate and improve

---

### **Option 5: CSV-Ready Export** ✅ Data Analysis
**Best for:** Quick analysis, Excel/R import

**What you get:**
- Flat table format
- All events linked to reflections
- Includes percentages and components
- Ready for statistical analysis

**Use when:** You need to import into Excel, R, Python, etc.

---

### **Option 6: Window-Level Classifications** ✅ Component Analysis
**Best for:** Detailed D/E/P analysis at sentence level

**What you get:**
- Binary scores for each window (chunk)
- Window text (actual classified sentences)
- Links to full reflection
- Revision tracking

**Use when:** Analyzing component identification accuracy

---

## 🔍 What Data Tables Are Available?

### **Main Tables:**

1. **`reflections`** - User reflections and feedback
   - Reflection text
   - Analysis percentages (raw & priority)
   - Generated feedback
   - Revision tracking

2. **`user_events`** - All user interactions
   - Click events
   - Page views
   - Reading durations
   - Tab switches

3. **`binary_classifications`** - Window-level scores
   - Description, Explanation, Prediction scores (0/1)
   - Window text
   - Links to reflections

---

## ⚠️ Important Filtering Options

### **Filter for NEW Testing Only:**

```sql
-- Only data after a specific date
WHERE created_at >= '2025-02-01'

-- Only last week
WHERE created_at >= NOW() - INTERVAL '7 days'

-- Specific date range
WHERE created_at >= '2025-01-15' 
  AND created_at < '2025-02-01'
```

### **Filter by Specific Users:**

```sql
-- One participant
WHERE participant_name = 'A0895'

-- Multiple participants
WHERE participant_name IN ('A0895', 'B0694', 'C1298')
```

### **Filter by Task:**

```sql
-- Only Task 1
WHERE task_id = 'task1'

-- Only Task 2
WHERE task_id = 'task2'
```

### **Filter by Language:**

```sql
-- Only English
WHERE language = 'en'

-- Only German
WHERE language = 'de'
```

---

## 📈 Recommended Analysis Workflow

### **Step 1: Overview**
Use **Option 2** to get session summaries

### **Step 2: Engagement**
Use **Option 3** to analyze reading patterns

### **Step 3: Iteration**
Use **Option 4** to understand revision behavior

### **Step 4: Detail**
Use **Option 6** for component-level analysis

### **Step 5: Full Analysis**
Use **Option 5** for complete dataset export

---

## 💡 Tips

- **Always set a date filter** to exclude old testing data
- **Export to CSV** for easy analysis in Excel/R/Python
- **Use Option 5** if you're unsure which data you need
- **Combine queries** by copying parts you need
- **Save queries** in Supabase for future use

---

## 🆘 Troubleshooting

**"No results found"**
- Check your date filter - you might be filtering too strictly
- Try removing the date filter to see all data first

**"Query timeout"**
- Too much data - add more restrictive filters
- Try filtering by specific sessions or dates

**"Column does not exist"**
- The database might need to be updated
- Check that all tables are created correctly

---

## 📝 Example: Export Last Week's Data

```sql
-- Get all events from last 7 days
SELECT 
    session_id,
    event_type,
    timestamp_utc,
    event_data
FROM user_events
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY session_id, timestamp_utc;
```

---

Need help? Check the SQL file comments for detailed explanations!




