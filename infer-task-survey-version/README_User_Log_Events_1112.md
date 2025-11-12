# User Log Events Dataset - November 12, 2025

## 📊 Dataset Overview

**File:** `User Log Events_1112.csv`  
**Source:** INFER Simplified Version (Supabase `user_events` table)  
**Export Date:** November 12, 2025  
**Total Records:** 1,507 events  
**Data Type:** Complete user interaction logs (clicks, page views, reading sessions)

---

## 📁 Dataset Description

This CSV contains **every user interaction** from the INFER system's simplified version. Each row represents one event (click, page view, feedback reading session, etc.) with complete timestamp and metadata.

**Purpose:** Time-sequence analysis, process mining, user behavior analysis, BUPAR analysis

---

## 📋 Column Structure

| Column | Description | Example Values |
|--------|-------------|----------------|
| **session_id** | Unique session identifier | `session_1760954391401_ezn1edw3x` |
| **participant_name** | Participant ID (pseudonymization code) | `ST1982`, `A0921` |
| **event_type** | Type of interaction/event | `submit_reflection`, `view_feedback_end`, `click_revise` |
| **timestamp_utc** | Event timestamp (UTC) | `2025-10-20 10:04:41.813+00` |
| **event_data** | JSON with detailed event information | See Event Data Structure below |
| **user_agent** | Browser/device information | `Mozilla/5.0...` |
| **language** | Interface language | `de` (German), `en` (English) |
| **reflection_id** | Linked reflection ID | `214`, `219`, `220` |

---

## 🔍 Event Types Included

| Event Type | What It Represents | Count/Frequency |
|------------|-------------------|-----------------|
| **submit_reflection** | User generated feedback for reflection | ~Every feedback generation |
| **view_feedback_start** | User started reading feedback | ~2-4 per reflection |
| **view_feedback_end** | User finished reading feedback (includes duration) | ~2-4 per reflection |
| **copy_feedback** | User copied feedback to clipboard | ~0-1 per reflection |
| **click_revise** | User clicked "Revise Reflection" button | ~0-3 per reflection |
| **select_feedback_style** | User switched between Extended/Short tabs | ~0-5 per reflection |
| **final_submission** | User submitted final reflection (moved to survey) | 1 per task |
| **page_view** | User navigated to different page | ~3-5 per session |
| **navigation** | User clicked navigation button | ~2-3 per session |
| **consent_interaction** | User interacted with consent checkboxes | ~1-2 per session |
| **learn_concepts_interaction** | User clicked key concepts card | ~0-2 per session |

---

## 📊 Event Data Structure (JSON)

The `event_data` column contains JSON with event-specific details:

### submit_reflection
```json
{
  "task": "task1",
  "language": "de",
  "video_id": "spider",
  "reflection_id": 214,
  "participant_name": "ST1982",
  "reflection_length": 3010,
  "weakest_component": "Explanation",
  "analysis_percentages_raw": {
    "description": 45.5,
    "explanation": 0,
    "prediction": 18.2,
    "professional_vision": 63.6
  },
  "analysis_percentages_priority": {
    "description": 45.5,
    "explanation": 0,
    "prediction": 18.2,
    "other": 36.4,
    "professional_vision": 63.6
  }
}
```

### view_feedback_end
```json
{
  "task": "task1",
  "style": "extended",  // or "short"
  "language": "de",
  "reflection_id": 220,
  "duration_seconds": 104.967
}
```

### click_revise
```json
{
  "task": "task1",
  "video_id": "spider",
  "reflection_id": 220,
  "revision_number": 1,
  "participant_name": "A0921",
  "timestamp": "2025-10-20T21:45:28.985Z"
}
```

---

## 👥 Participants Included

**Sample Participant IDs:**
- ST1982
- A0921
- (and more...)

**Participant ID Format:** 
- Generated using: First letter of mother's name + birth month (2 digits) + birth year (2 digits)
- Example: Mother Anna, born August 1995 = **A0895**

---

## 📈 Key Metrics Available

### **Reading Behavior:**
- Reading duration for each feedback style (extended/short)
- First choice (which feedback style chosen first)
- Tab switches (how many times switched between styles)
- Total reading time per user

### **Revision Patterns:**
- Number of revisions per user
- Time between revisions
- Warning counts (duplicate submission warnings)
- Final submission timing

### **Engagement Metrics:**
- Copy actions (feedback copied)
- Concept interactions (clicked key concepts)
- Page views and navigation

### **Analysis Results:**
- **RAW percentages** (shown to students, can exceed 100%)
- **Priority percentages** (for research, sums to 100%)
- Weakest component identification
- Professional vision scores

---

## 🔬 Analysis Suggestions

### **1. Reading Pattern Analysis**
```
- Filter: event_type = 'view_feedback_end'
- Extract: duration_seconds from event_data
- Group by: participant_name, feedback style
- Analyze: Average reading time per style
```

### **2. Revision Behavior**
```
- Filter: event_type = 'submit_reflection'
- Group by: participant_name, task
- Count: Number of submissions per participant
- Analyze: Revision patterns, improvement over time
```

### **3. Tab Switching Behavior**
```
- Filter: event_type = 'select_feedback_style'
- Extract: preferred_style from event_data
- Analyze: Switching patterns, preference changes
```

### **4. Complete User Journey**
```
- Sort by: session_id, timestamp_utc
- Analyze: Complete event sequence per user
- Create: Process maps, sequence diagrams
```

---

## 📅 Data Period

**Collection Period:** October 20, 2025 (and ongoing)  
**System Version:** INFER Simplified Version  
**Study Flow:** Welcome → Task 1 → Survey → Complete  

---

## 🛠️ Tools for Analysis

### **Excel/Sheets:**
- Pivot tables for event counts
- VLOOKUP for participant lookups
- Charts for reading duration distributions

### **R (bupaR):**
```R
library(bupaR)
library(jsonlite)

# Load data
events <- read.csv("User Log Events_1112.csv")

# Parse JSON event_data
events$event_data_parsed <- lapply(events$event_data, fromJSON)

# Create event log
eventlog <- simple_eventlog(
  events,
  case_id = "session_id",
  activity_id = "event_type",
  activity_instance_id = "id",
  timestamp = "timestamp_utc"
)

# Process mining analysis
process_map(eventlog)
```

### **Python (Pandas):**
```python
import pandas as pd
import json

# Load data
df = pd.read_csv("User Log Events_1112.csv")

# Parse JSON
df['event_data_dict'] = df['event_data'].apply(json.loads)

# Extract specific fields
df['duration'] = df['event_data_dict'].apply(
    lambda x: x.get('duration_seconds', None)
)
```

---

## 📊 Quick Statistics

- **Total Events:** 1,507
- **Unique Sessions:** ~20-30 (estimate)
- **Unique Participants:** ~15-25 (estimate)
- **Event Types:** 11 different types
- **Language:** Primarily German (de)
- **Video:** Primarily "spider" task

---

## ⚠️ Data Notes

1. **Participant Privacy:** Participant IDs are pseudonymized codes (no personal names)
2. **Timestamps:** All in UTC timezone
3. **JSON Fields:** event_data requires JSON parsing for detailed analysis
4. **Duplicate Events:** Some events may appear duplicated (e.g., view_feedback_start) - this is expected behavior
5. **Language:** Interface language (de/en), not necessarily reflection language

---

## 🎯 Research Questions This Data Can Answer

1. **How long do students read each feedback style?**
2. **What feedback style do students prefer initially?**
3. **How many times do students revise their reflections?**
4. **What is the typical user journey through the system?**
5. **Do students engage with key concepts?**
6. **How does reading duration relate to revision behavior?**
7. **What is the time between feedback generation and revision?**

---

## 📖 Related Documentation

- `DETAILED_READING_ANALYSIS.sql` - SQL queries for reading pattern analysis
- `REFLECTION_ANALYSIS_COMPLETE.sql` - Comprehensive reflection data export
- `HOW_TO_EXPORT_DATA.md` - Guide for exporting additional data
- `CLICK_TRACKING_SUMMARY.md` - Complete list of tracked events

---

## 🆘 Need More Data?

**For reflection text and feedback:**
- Use `REFLECTION_ANALYSIS_COMPLETE.sql` in Supabase

**For binary classifications:**
- Use Option 6 in `EXPORT_TIME_SEQUENCE_DATA.sql`

**For session summaries:**
- Use Option 2 in `EXPORT_TIME_SEQUENCE_DATA.sql`

---

**This dataset provides complete time-sequence data for process mining and user behavior analysis! 🎓**

