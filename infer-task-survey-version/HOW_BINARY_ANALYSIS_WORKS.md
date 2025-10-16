# How Binary Analysis Works - Step by Step

## 🎯 Complete Analysis Process (Exactly as Original)

### Step 1: Create Non-Overlapping Windows

**Input:** Full reflection text

**Process:**
```
Reflection: "Sentence 1. Sentence 2. Sentence 3. Sentence 4. Sentence 5. Sentence 6. Sentence 7."

Split into 3-sentence NON-OVERLAPPING windows:
├─ Window 1 (chunk_001): "Sentence 1. Sentence 2. Sentence 3."
├─ Window 2 (chunk_002): "Sentence 4. Sentence 5. Sentence 6."
└─ Window 3 (chunk_003): "Sentence 7."  (only 1 sentence left)
```

**Total:** 3 windows (not moving/sliding!)

---

### Step 2: Binary Classify Each Window (3 Questions per Window)

**For EACH window, ask 3 separate binary questions:**

**Window 1: "Sentence 1. Sentence 2. Sentence 3."**
- ❓ Does it contain Description? → 1 or 0
- ❓ Does it contain Explanation? → 1 or 0
- ❓ Does it contain Prediction? → 1 or 0

**Result for Window 1:** `{description: 1, explanation: 1, prediction: 0}`

**Window 2: "Sentence 4. Sentence 5. Sentence 6."**
- ❓ Does it contain Description? → 1 or 0
- ❓ Does it contain Explanation? → 1 or 0
- ❓ Does it contain Prediction? → 1 or 0

**Result for Window 2:** `{description: 0, explanation: 0, prediction: 1}`

**Window 3: "Sentence 7."**
- ❓ Does it contain Description? → 1 or 0
- ❓ Does it contain Explanation? → 1 or 0
- ❓ Does it contain Prediction? → 1 or 0

**Result for Window 3:** `{description: 1, explanation: 0, prediction: 0}`

**Important:** Each window can have:
- Multiple 1s (e.g., both description AND explanation)
- All 0s (doesn't fit any category)
- Only one 1

---

### Step 3: Assign Each Window to ONE Category (Priority System)

**Classification Results:**
```javascript
[
  {window_id: "chunk_001", description: 1, explanation: 1, prediction: 0},
  {window_id: "chunk_002", description: 0, explanation: 0, prediction: 1},
  {window_id: "chunk_003", description: 1, explanation: 0, prediction: 0}
]
```

**Apply Priority Rule:** Description > Explanation > Prediction > Other

```
Window 1: description=1, explanation=1, prediction=0
  → Has BOTH description and explanation
  → Priority: Description wins
  → Assigned to: DESCRIPTION ✓

Window 2: description=0, explanation=0, prediction=1
  → Only has prediction
  → Assigned to: PREDICTION ✓

Window 3: description=1, explanation=0, prediction=0
  → Only has description
  → Assigned to: DESCRIPTION ✓
```

**Counts:**
- Description: 2 windows
- Explanation: 0 windows (even though window 1 had explanation=1, it was assigned to description due to priority)
- Prediction: 1 window
- Other: 0 windows

---

### Step 4: Calculate Percentages (Must Add to 100%)

**Total windows:** 3

**Calculate:**
```
Description % = (2 / 3) × 100 = 66.666...
Explanation % = (0 / 3) × 100 = 0
Prediction %  = (1 / 3) × 100 = 33.333...
Other %       = (0 / 3) × 100 = 0
```

**Round to 1 decimal place:**
```
Description: 66.7%
Explanation: 0.0%
Prediction:  33.3%
Other:       0.0%
```

**Professional Vision = D + E + P:**
```
Professional Vision: 66.7% + 0.0% + 33.3% = 100.0%
```

**Final Result:**
```javascript
{
  percentages: {
    description: 66.7,
    explanation: 0.0,
    prediction: 33.3,
    other: 0.0,
    professional_vision: 100.0
  },
  weakest_component: "Explanation"  // Lowest among D, E, P
}
```

---

## 📊 What Gets Stored in Database

### In `binary_classifications` table:

**ALL binary scores stored** (before priority assignment):

```sql
| window_id  | window_text                      | description | explanation | prediction |
|------------|----------------------------------|-------------|-------------|------------|
| chunk_001  | "Sentence 1. Sentence 2..."      | 1           | 1           | 0          |
| chunk_002  | "Sentence 4. Sentence 5..."      | 0           | 0           | 1          |
| chunk_003  | "Sentence 7."                    | 1           | 0           | 0          |
```

**Note:** Window 1 shows BOTH description=1 and explanation=1!

### In `reflections` table:

**Final calculated percentages** (after priority assignment):

```json
{
  "analysis_percentages": {
    "description": 66.7,
    "explanation": 0.0,
    "prediction": 33.3,
    "other": 0.0,
    "professional_vision": 100.0
  },
  "weakest_component": "Explanation"
}
```

---

## 🔍 Why You're Seeing All 0s

If the console shows all 0s like:
```
description: 0, explanation: 0, prediction: 0
```

**Possible causes:**
1. ❌ Binary classifier API calls are failing
2. ❌ CORS proxy is sleeping/slow
3. ❌ Network timeout
4. ❌ max_tokens too small (was 5, should be 10)
5. ❌ No retry logic

**I just fixed:**
- ✅ max_tokens: 5 → 10
- ✅ Added 3-attempt retry loop
- ✅ Better error handling
- ✅ Validation logic

---

## ✅ Correct Logic Summary

1. **Create windows:** Non-overlapping 3-sentence chunks
2. **Binary classify:** Each window gets 3 binary scores (D, E, P)
3. **Store ALL binary scores:** In `binary_classifications` table
4. **Apply priority:** Assign each window to ONE category
5. **Calculate percentages:** Based on category assignments
6. **Result:** Percentages that add to 100%

**Key Point:** Binary scores (0/1) are stored for each window, but percentage calculation uses priority system to avoid double-counting!

---

## 🧪 Test Example

**Reflection (10 sentences):**

**Windows created:** 4 windows
- chunk_001: Sentences 1-3
- chunk_002: Sentences 4-6
- chunk_003: Sentences 7-9
- chunk_004: Sentence 10

**Binary classifications (stored):**
```
chunk_001: D=1, E=1, P=0  → Priority: Description
chunk_002: D=0, E=1, P=1  → Priority: Explanation
chunk_003: D=0, E=0, P=1  → Priority: Prediction
chunk_004: D=0, E=0, P=0  → Priority: Other
```

**Final percentages:**
- Description: 25% (1 of 4 windows)
- Explanation: 25% (1 of 4 windows)
- Prediction: 25% (1 of 4 windows)
- Other: 25% (1 of 4 windows)
- Professional Vision: 75%

**Stored in database:**
- `binary_classifications`: 4 rows (ALL binary scores: D=1/E=1/P=0, D=0/E=1/P=1, etc.)
- `reflections`: 1 row (final percentages: 25%, 25%, 25%, 25%)

---

## 🚀 Next Test

After redeploying (just did!), try again:

1. Open: https://infer-task-survey.netlify.app
2. Enter test reflection
3. Generate feedback
4. Check console - should now see proper binary scores (mix of 0s and 1s)
5. Should see analysis: "Your reflection contains X% description, Y% explanation, Z% prediction"

The fix is now deployed! 🎉

