# RAW vs Priority-Based Percentages - Explained

## 🎯 Dual Calculation System

The system now calculates **TWO sets** of percentages for each reflection:

1. **RAW percentages** (shown to students)
2. **Priority-based percentages** (used for feedback and later analysis)

---

## 📊 RAW Percentages (Displayed to Students)

### How It's Calculated:
- Count how many windows have **each component** (0 or 1)
- Calculate percentage for each independently
- **Can exceed 100%** because windows can have multiple components

### Example:
```
Total windows: 10

Windows with description=1: 7 windows → 70%
Windows with explanation=1: 6 windows → 60%
Windows with prediction=1: 3 windows → 30%

RAW Display:
Description: 70%
Explanation: 60%
Prediction: 30%
Total: 160% (exceeds 100% ✓)
```

### What Students See:
> "Your reflection contains 70% description, 60% explanation, and 30% prediction."

**Note:** Does NOT mention "weakest component" or total adding to 100%

---

## 🔢 Priority-Based Percentages (Used Internally)

### How It's Calculated:
- Assign each window to **exactly ONE category**
- Priority rule: Description > Explanation > Prediction > Other
- Percentages **always add to 100%**

### Same Example:
```
Total windows: 10

Window 1: D=1, E=1, P=0 → Assigned to DESCRIPTION (priority)
Window 2: D=1, E=1, P=0 → Assigned to DESCRIPTION (priority)
Window 3: D=1, E=1, P=0 → Assigned to DESCRIPTION (priority)
Window 4: D=1, E=1, P=0 → Assigned to DESCRIPTION (priority)
Window 5: D=1, E=1, P=1 → Assigned to DESCRIPTION (priority)
Window 6: D=0, E=1, P=1 → Assigned to EXPLANATION (priority)
Window 7: D=0, E=1, P=1 → Assigned to EXPLANATION (priority)
Window 8: D=1, E=0, P=1 → Assigned to DESCRIPTION (priority)
Window 9: D=1, E=0, P=0 → Assigned to DESCRIPTION (priority)
Window 10: D=0, E=0, P=1 → Assigned to PREDICTION (priority)

Priority Distribution:
Description: 7 windows → 70%
Explanation: 2 windows → 20%
Prediction: 1 window → 10%
Other: 0 windows → 0%
Total: 100% (exact ✓)
```

### Used For:
- Determining **weakest component** for feedback focus
- Generating feedback prompts (LLM gets priority percentages)
- Later data analysis (comparing students, calculating PV gains)

---

## 💾 What Gets Stored in Database

### In `reflections` table:
```json
{
  "analysis_percentages": {
    "raw": {
      "description": 70.0,
      "explanation": 60.0,
      "prediction": 30.0,
      "professional_vision": 160.0  // Can exceed 100%
    },
    "priority": {
      "description": 70.0,
      "explanation": 20.0,
      "prediction": 10.0,
      "other": 0.0,
      "professional_vision": 100.0  // Always 100% max
    },
    "displayed_to_student": {
      "description": 70.0,
      "explanation": 60.0,
      "prediction": 30.0
    }
  },
  "weakest_component": "Prediction"  // Based on priority
}
```

**Both are stored** so you can analyze either way later!

---

## 🔍 Why This Approach?

### For Students (Raw):
✅ **More intuitive:** "My reflection has description AND explanation"  
✅ **Accurate representation:** Reflects what they actually wrote  
✅ **Encouraging:** Shows they included multiple components  
✅ **Transparent:** No hidden priority rules they don't understand  

### For Feedback (Priority):
✅ **Focused feedback:** LLM focuses on truly weakest area  
✅ **Consistent:** Percentages always add to 100%  
✅ **Comparable:** Can compare across students  
✅ **Research standard:** Matches academic conventions  

---

## 📈 Example Scenarios

### Scenario 1: Well-Rounded Reflection
```
RAW (shown to student):
- Description: 80%
- Explanation: 70%
- Prediction: 60%
- Total: 210%

PRIORITY (used internally):
- Description: 50%
- Explanation: 30%
- Prediction: 20%
- Other: 0%
- Weakest: Prediction
```

### Scenario 2: Description-Heavy Reflection
```
RAW (shown to student):
- Description: 90%
- Explanation: 20%
- Prediction: 10%
- Total: 120%

PRIORITY (used internally):
- Description: 70%
- Explanation: 15%
- Prediction: 10%
- Other: 5%
- Weakest: Prediction
```

### Scenario 3: Non-Meaningful Input ("blah blah")
```
RAW (shown to student):
- Description: 0%
- Explanation: 0%
- Prediction: 0%
- Total: 0%

PRIORITY (used internally):
- Description: 0%
- Explanation: 0%
- Prediction: 0%
- Other: 100%
- Weakest: Prediction

→ Shows simple message: "Please write about professional vision"
```

---

## 🗄️ Database Queries

### Get RAW percentages (what students saw):
```sql
SELECT 
    participant_name,
    task_id,
    analysis_percentages->'raw'->>'description' as desc_raw,
    analysis_percentages->'raw'->>'explanation' as expl_raw,
    analysis_percentages->'raw'->>'prediction' as pred_raw,
    analysis_percentages->'raw'->>'professional_vision' as pv_raw
FROM reflections
WHERE created_at >= CURRENT_DATE;
```

### Get priority percentages (for analysis):
```sql
SELECT 
    participant_name,
    task_id,
    analysis_percentages->'priority'->>'description' as desc_priority,
    analysis_percentages->'priority'->>'explanation' as expl_priority,
    analysis_percentages->'priority'->>'prediction' as pred_priority,
    analysis_percentages->'priority'->>'other' as other_priority
FROM reflections
WHERE created_at >= CURRENT_DATE;
```

### Compare both:
```sql
SELECT 
    participant_name,
    task_id,
    analysis_percentages->'raw'->>'description' as desc_raw,
    analysis_percentages->'priority'->>'description' as desc_priority,
    analysis_percentages->'raw'->>'explanation' as expl_raw,
    analysis_percentages->'priority'->>'explanation' as expl_priority,
    analysis_percentages->'raw'->>'prediction' as pred_raw,
    analysis_percentages->'priority'->>'prediction' as pred_priority
FROM reflections;
```

---

## ✅ Summary

| Aspect | RAW | Priority |
|--------|-----|----------|
| **Can exceed 100%** | ✅ Yes | ❌ No (always = 100%) |
| **Shown to students** | ✅ Yes | ❌ No |
| **Used for feedback** | ❌ No | ✅ Yes |
| **Stored in database** | ✅ Yes | ✅ Yes |
| **Determines weakest** | ❌ No | ✅ Yes |
| **Includes "Other"** | ❌ No | ✅ Yes |

**Best of both worlds!** Students see accurate raw data, researchers get standardized analysis data! 🎉

