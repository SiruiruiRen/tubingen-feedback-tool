# Complete Data Collection Summary - INFER Simplified Version

## ✅ YES - All Data is Stored in Supabase!

This version collects and stores **exactly the same data** as the original research version.

## 📊 What Gets Stored in Supabase

### 1. **Reflections Table** (`reflections`)

Every time feedback is generated, stores:

```json
{
  "session_id": "session_1729097234567_abc123",
  "participant_name": "Student A",
  "video_id": "spider",
  "language": "en",
  "task_id": "task1",
  "reflection_text": "The teacher used questioning strategies...",
  "analysis_percentages": {
    "description": 35,
    "explanation": 40,
    "prediction": 20,
    "other": 5,
    "professional_vision": 95
  },
  "weakest_component": "Prediction",
  "feedback_extended": "#### Description\nStrength:...",
  "feedback_short": "#### Description\nGood:...",
  "revision_number": 1,
  "parent_reflection_id": null,
  "created_at": "2025-10-16T16:30:00.000Z"
}
```

**What this captures:**
- ✅ Full reflection text
- ✅ Aggregated percentages (final scores)
- ✅ Generated feedback (both extended and short)
- ✅ Revision tracking (1st submission vs revisions)
- ✅ Parent-child relationships for revisions

### 2. **Binary Classifications Table** (`binary_classifications`)

For **each window** analyzed, stores individual binary scores:

```json
{
  "session_id": "session_1729097234567_abc123",
  "reflection_id": 12345,
  "task_id": "task1",
  "participant_name": "Student A",
  "video_id": "spider",
  "language": "en",
  "window_id": "chunk_001",
  "window_text": "The teacher asked open questions to activate prior knowledge.",
  "description_score": 1,
  "explanation_score": 1,
  "prediction_score": 0,
  "created_at": "2025-10-16T16:30:00.000Z"
}
```

**For a reflection with 8 windows → 8 rows inserted**

**What this captures:**
- ✅ Each 3-sentence window analyzed
- ✅ Binary classification results (0 or 1) for:
  - Description score
  - Explanation score
  - Prediction score
- ✅ Actual window text (what was classified)
- ✅ Links to reflection via `reflection_id`

### 3. **User Events Table** (`user_events`)

Logs **every interaction**:

```json
{
  "session_id": "session_1729097234567_abc123",
  "reflection_id": 12345,
  "event_type": "click_revise",
  "event_data": {
    "task": "task1",
    "participant_name": "Student A",
    "video_id": "spider",
    "revision_number": 2
  },
  "user_agent": "Mozilla/5.0...",
  "language": "en",
  "timestamp_utc": "2025-10-16T16:30:15.000Z"
}
```

**All Events Logged:**

| Event Type | When It Happens | Data Captured |
|------------|-----------------|---------------|
| `session_start` | Page loads | Screen size, user agent |
| `page_view` | Navigate to any page | Page ID, from/to, progress % |
| `video_watched_confirmation` | Check "I watched video" | Checkbox state |
| `navigation` | Click any navigation button | From page, to page |
| `feedback_style_preference` | Choose Extended/Short | Preferred style |
| `submit_reflection` | Generate feedback | Reflection length, analysis percentages |
| `click_revise` | Click "Revise Reflection" | Task, revision number |
| `copy_feedback` | Copy feedback to clipboard | Feedback type (extended/short) |
| `final_submission` | Submit final reflection | Total revisions, final text length |
| `study_completed` | Complete entire study | Session ID, timestamp |

## 🔢 Data Volume Example

**One participant completing both tasks:**

### Reflections Table:
- Task 1: 1 row (initial submission)
- Task 1 revision 1: 1 row
- Task 1 revision 2: 1 row
- Task 2: 1 row
- Task 2 revision 1: 1 row
- **Total: ~3-5 rows per participant**

### Binary Classifications Table:
- Task 1 initial (8 windows): 8 rows
- Task 1 revision 1 (8 windows): 8 rows
- Task 1 revision 2 (8 windows): 8 rows
- Task 2 initial (7 windows): 7 rows
- Task 2 revision 1 (7 windows): 7 rows
- **Total: ~30-50 rows per participant**

### User Events Table:
- Session start: 1 event
- Page views: ~6 events
- Video confirmation: 1 event
- Feedback style: 2 events
- Generate feedback: ~5 events
- Copy/revise: ~5-10 events
- Final submissions: 2 events
- Navigation: ~5 events
- **Total: ~25-35 events per participant**

## 🔗 Data Relationships

```
reflections (main table)
    ↓
    ├── binary_classifications (many)
    │   └── One row per window analyzed
    │
    └── user_events (many)
        └── All interactions for this reflection
```

**Foreign Keys:**
- `binary_classifications.reflection_id` → `reflections.id`
- `user_events.reflection_id` → `reflections.id`
- `user_events.session_id` = `reflections.session_id`

## 📈 What You Can Analyze

### From `reflections`:
- Final aggregated scores (percentages)
- Weakest components identified
- Revision patterns
- Language preferences
- Generated feedback content

### From `binary_classifications`:
- Window-level classification decisions
- Fine-grained analysis of reflection components
- Which specific sentences contain which elements
- LLM classification consistency

### From `user_events`:
- Complete digital trace of user behavior
- Time spent on each page
- Interaction patterns
- Revision strategies
- Navigation flow
- Feature usage (copy, revise, etc.)

## 🔍 Example Queries

### Get all binary classifications for a participant:
```sql
SELECT * FROM binary_classifications
WHERE participant_name = 'Student A'
ORDER BY created_at, window_id;
```

### Get complete journey for one session:
```sql
SELECT * FROM user_events
WHERE session_id = 'session_1729097234567_abc123'
ORDER BY timestamp_utc;
```

### See revisions over time:
```sql
SELECT 
  task_id,
  revision_number,
  analysis_percentages,
  LENGTH(reflection_text) as text_length
FROM reflections
WHERE participant_name = 'Student A'
ORDER BY task_id, revision_number;
```

### Analyze classification results:
```sql
SELECT 
  window_id,
  description_score,
  explanation_score,
  prediction_score,
  window_text
FROM binary_classifications
WHERE reflection_id = 12345
ORDER BY window_id;
```

## 🎯 Key Features

### Chain Prompting (Exact Same as Original):
1. **Step 1:** Create 3-sentence windows
2. **Step 2:** Binary classify each window (3 parallel calls)
3. **Step 3:** Calculate percentages from binary results
4. **Step 4:** Generate weighted feedback based on weakest component

### Data Collection:
✅ **Binary classifications** - Individual window scores (0/1)  
✅ **Aggregated percentages** - Final analysis (0-100%)  
✅ **Reflection text** - Full text at each revision  
✅ **Feedback generated** - Both extended and short  
✅ **All clicks** - Every button, checkbox, navigation  
✅ **All interactions** - Complete digital trace  
✅ **Session tracking** - Unique session IDs  
✅ **Revision history** - Parent-child relationships  

### Storage Locations:
1. **Primary:** Supabase (cloud database)
2. **Backup:** localStorage (browser storage)
3. **Console:** Logged for real-time debugging

## 🔐 Database Schema

### Tables Used:
| Table | Purpose | Records Per Participant |
|-------|---------|-------------------------|
| `reflections` | Main reflection data | 3-5 |
| `binary_classifications` | Window-level scores | 30-50 |
| `user_events` | All interactions | 25-35 |

### Connection:
- Same Supabase project as original version
- Same database structure
- Same foreign key relationships
- Data from both versions in one database

## ✅ What You Asked For - Confirmed!

**Q: Will we store all the data including the scores in each step and the final scores?**
✅ **YES!**
- ✅ Binary scores for each window (each step)
- ✅ Final aggregated percentages (final scores)
- ✅ Both stored in Supabase `binary_classifications` and `reflections` tables

**Q: Will we store all the click data, all the digital trace?**
✅ **YES!**
- ✅ Every button click logged to `user_events`
- ✅ Every page view logged
- ✅ Every navigation logged
- ✅ Every interaction logged
- ✅ Complete digital trace in Supabase

**Q: Are we using the exact same prompts as the original?**
✅ **YES!**
- ✅ Same 4 prompts (academic/user-friendly × English/German)
- ✅ Same chain prompting process
- ✅ Same temperature settings (0.0 for classification, 0.3 for feedback)
- ✅ Same theoretical frameworks cited
- ✅ Same LLM model (GPT-4o)

## 🎉 Summary

You now have:
- ✅ Clean, wide video intro page
- ✅ Full Supabase integration
- ✅ All binary classification results stored
- ✅ All aggregated scores stored
- ✅ All click/interaction data logged
- ✅ Complete digital trace
- ✅ Same prompts as original
- ✅ Analysis distribution shown to users
- ✅ localStorage backup

**Everything works exactly like the original research version!**

## 🔧 Access Your Data

### Via Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Table Editor
4. View: `reflections`, `binary_classifications`, `user_events`

### Via SQL Editor:
Run custom queries to analyze your data

### Export:
Download CSVs or JSON from Supabase dashboard

Perfect for research data collection! 🎓

