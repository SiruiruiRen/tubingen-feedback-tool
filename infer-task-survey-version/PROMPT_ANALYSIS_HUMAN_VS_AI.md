# Prompt Analysis: Human Coding vs AI Classification
## Comprehensive Review and Recommendations

---

## 🔍 Key Findings from Human Coding Research

### Inter-Coder Reliability (Cohen's Kappa)

| Component | Kappa Range | Interpretation |
|-----------|-------------|----------------|
| **Description** | 0.63-0.75 | **Substantial** - Humans mostly agree |
| **Explanation** | 0.36-0.48 | **Fair to Moderate** - Significant disagreement |
| **Prediction** | 0.51 | **Moderate** - Some disagreement |
| **Others** | 0.16 | **Poor** - Major disagreement |

**Critical Insight:** Explanation has the LOWEST reliability among PV components, indicating the definition itself is unclear or too subjective.

---

## 🎯 Current Prompt Issues

### Issue 1: TOO INCLUSIVE for Explanation

**Current Prompt (Relaxed Version):**
```
Be INCLUSIVE - Accept these as explanations:
* Simple cause-effect statements about classroom dynamics
* Common-sense pedagogical reasoning without technical terms
* Basic explanations of learning processes
* When uncertain, lean toward inclusion (code as "1")
```

**Problem:** This leads to **MASSIVE overestimation**
- Classifies common-sense reasoning as Explanation
- Doesn't require educational theory connection
- "Unclear instructions confused students" → Coded as Explanation (should be Description or Others)

### Issue 2: Cannot Identify "Others" Content

**Research Finding:**
- Human coders: **89.1% of segments are "Others"**
- AI prompts: Often classify as 0% or very low Others
- **Result:** 60-100% overestimation of PV scores

**Examples Misclassified:**
```
"The teacher is male and middle-aged" → AI: Description (should be: Others)
"The classroom is noisy" → AI: Description (should be: Others)  
"Two newspaper articles hang on the board" → AI: Description (should be: Others)
```

### Issue 3: Weak Boundary Between Description and Explanation

**Ambiguous cases:**
```
"The teacher's open questions give students room for their own thoughts"
→ Human: Could be Description OR Explanation
→ Current prompt: Explanation (because it mentions WHY - "give room")
→ Problem: This is common-sense, not educational theory
```

---

## 📋 Comparison: Current Prompts vs Human Coding Rules

### Description

| Aspect | Current AI Prompt | Human Coding Practice |
|--------|-------------------|----------------------|
| **Core** | Observable teaching events | Observable events without evaluation |
| **Strictness** | Moderate | **STRICTER** - must be neutral observation |
| **Examples** | "The teacher explains" | "The teacher writes on board" |
| **Exclusions** | Evaluations, interpretations | Same + speculations |
| **Issue** | ❌ Classifies setup/demographics as Description | ✅ Humans code these as Others |

**Recommendation:** **STRICTER** - Add explicit exclusion of:
- Classroom physical descriptions
- Teacher/student demographics  
- Non-teaching related observations

### Explanation

| Aspect | Current AI Prompt | Human Coding Practice |
|--------|-------------------|----------------------|
| **Core** | Connect events to theories | Connect to educational theories |
| **Strictness** | **TOO LOOSE** | **STRICTER** required |
| **Theory requirement** | "Educational knowledge" (vague) | **Must reference learning theories** |
| **Common-sense** | ✅ Accepted ("give students room") | ❌ Not sufficient |
| **Issue** | ❌ "Be INCLUSIVE" instruction | ✅ Requires explicit theory connection |

**Recommendation:** **MUCH STRICTER** - Require:
- Explicit mention of educational theories/research
- Clear connection to pedagogical principles
- NOT just common-sense reasoning

### Prediction

| Aspect | Current AI Prompt | Human Coding Practice |
|--------|-------------------|----------------------|
| **Core** | Effects on student learning | Consequences for students |
| **Strictness** | Moderate | Moderate |
| **Basis requirement** | "Based on learning theories" | **Explicitly theory-based** |
| **Issue** | ❌ Accepts speculation without theory | ✅ Requires learning theory connection |

**Recommendation:** **STRICTER** - Emphasize:
- Must be grounded in learning theory
- Not just speculation or guessing
- Clear consequence for student learning

---

## 🔬 Concrete Examples: What Should Change

### Example 1: Common-Sense Reasoning

**Text:** "The unclear instructions confused the students"

| Current Classification | Should Be | Reasoning |
|------------------------|-----------|-----------|
| **Explanation** (WHY reasoning) | **Description** or **Others** | No educational theory cited, just common sense |

**Fix:** Require explicit theory connection for Explanation.

---

### Example 2: Observable Event

**Text:** "The teacher writes the topic on the board"

| Current Classification | Should Be | Reasoning |
|------------------------|-----------|-----------|
| **Description** | **Description** ✓ | Correct - observable teaching event |

**No change needed** - this is correct.

---

### Example 3: Pedagogical Reasoning with Theory

**Text:** "Through repetition, students can better remember the conjugations according to cognitive load theory"

| Current Classification | Should Be | Reasoning |
|------------------------|-----------|-----------|
| **Explanation** | **Explanation** ✓ | Correct - explicit theory connection |

**No change needed** - this is correct.

---

### Example 4: Setup/Demographics

**Text:** "The classroom has 25 students and is well-lit"

| Current Classification | Should Be | Reasoning |
|------------------------|-----------|-----------|
| **Description** | **Others** | Not a teaching/learning event |

**Fix:** Explicitly exclude physical descriptions, demographics from Description.

---

### Example 5: Speculation without Theory

**Text:** "This approach will likely increase student motivation"

| Current Classification | Should Be | Reasoning |
|------------------------|-----------|-----------|
| **Prediction** | **Others** or **Prediction with caveat** | Says "likely" but no theory cited |

**Fix:** Require theory basis, not just speculation.

---

## 🎯 Recommended Prompt Modifications

### 1. Description Prompt - ADD STRICTER EXCLUSIONS

**Current:**
```
CRITERIA FOR "0":
- Contains evaluations
- Contains interpretations  
- Contains speculations
- Not about teaching/learning events
```

**Recommended - ADD:**
```
STRICT EXCLUSIONS (Code as "0"):
- Classroom physical setup ("well-lit classroom", "desks in rows")
- Teacher/student demographics ("25 students", "teacher is experienced")
- Non-teaching context ("This is a math class", "School is in Munich")
- Equipment/materials without teaching action ("Worksheets on desk", "Smartboard available")
- Student appearance without learning behavior ("Students wear uniforms", "Student looks tired")

ONLY Code as "1" when:
- Specific TEACHING actions observed ("teacher asks questions", "gives feedback")
- Specific LEARNING behaviors observed ("students raise hands", "students discuss in pairs")
- Observable instructional events ("teacher writes on board DURING explanation")
```

---

### 2. Explanation Prompt - REQUIRE THEORY (MUCH STRICTER)

**Current (TOO LOOSE):**
```
Be INCLUSIVE - Accept these as explanations:
* Simple cause-effect statements
* Common-sense pedagogical reasoning
* When uncertain, lean toward inclusion
```

**Recommended - STRICT THEORY REQUIREMENT:**
```
STRICT CRITERIA FOR "1" (Explanation):
Requires ALL THREE elements:
1. Observable teaching/learning event mentioned
2. WHY reasoning provided
3. **EXPLICIT connection to educational theory, research, or pedagogical principle**

Accepted theoretical frameworks:
- Cognitive load theory
- Constructivism
- Self-determination theory
- Scaffolding principles
- Wait time research
- Bloom's taxonomy
- Zone of proximal development
- Active learning research

Examples that COUNT as "1":
* "Open questions activate prior knowledge according to constructivist theory"
* "Wait time increases thinking based on research (Rowe, 1986)"
* "Scaffolding helps students reach their ZPD per Vygotsky"
* "This aligns with cognitive load theory principles"

Examples that DON'T count as "1" (Common-sense reasoning):
* "Open questions give students room to think" (NO theory cited)
* "Repetition helps memory" (NO specific theory cited)
* "Unclear instructions confused students" (NO theory - just obvious cause-effect)
* "Students engaged because activity was hands-on" (NO theory framework)

Code as "0" when:
* Only common-sense reasoning without theory
* No explicit theory/research mentioned
* General pedagogical language without specific framework
* WHY reasoning present BUT no theoretical grounding
```

---

### 3. Prediction Prompt - REQUIRE THEORY BASIS

**Current:**
```
CRITERIA FOR "1":
- Predicts effects on student learning
- Based on educational knowledge
- Focuses on consequences for students
```

**Recommended - ADD THEORY REQUIREMENT:**
```
STRICT CRITERIA FOR "1" (Prediction):
Requires BOTH:
1. Predicts specific effect on student learning/motivation/understanding
2. **Grounded in learning theory or research** (not just speculation)

Examples that COUNT as "1":
* "This feedback could increase motivation per self-determination theory"
* "Students may develop deeper understanding through constructive alignment"
* "Based on retrieval practice research, this will aid retention"
* "Cognitive load theory suggests this may overwhelm students"

Examples that DON'T count (Speculation without theory):
* "This will likely increase motivation" (NO theory - just guess)
* "Students may feel confused" (Possible, but no learning theory basis)
* "This could improve understanding" (NO specific theory cited)
* "Students will probably enjoy this" (Enjoyment ≠ learning outcome)

Code as "0" when:
* Pure speculation without theory
* Emotional predictions without learning basis ("feel happy")
* General outcome guesses ("will be better")
* No connection to learning theories
```

---

## 🔍 Edge Cases: Human Coder Disagreements

### Case 1: "Teacher asks open questions to activate prior knowledge"

| Coder | Classification | Reasoning |
|-------|----------------|-----------|
| **R1** | Explanation | "activate prior knowledge" suggests constructivism |
| **R2** | Description | Just describes what teacher did, "activate" could be intent not theory |
| **R3** | Explanation | Mentions pedagogical purpose |
| **Current AI** | Explanation | Sees WHY reasoning |

**Resolution:** With STRICTER prompt:
- Code as "1" (Explanation) ONLY if explicitly states: "activate prior knowledge **according to constructivist theory**"
- Code as "0" without explicit theory mention
- **Why:** "Activate prior knowledge" is education jargon but not necessarily theory application

---

### Case 2: "Students work in pairs because collaboration improves learning"

| Coder | Classification | Reasoning |
|-------|----------------|-----------|
| **R1** | Explanation | States WHY (collaboration) |
| **R2** | Description | Generic statement, no specific theory |
| **R4** | Others | Too vague, no real theory |
| **Current AI** | Explanation | Sees cause-effect |

**Resolution:** With STRICTER prompt:
- Code as "1" ONLY if: "Students work in pairs based on **cooperative learning research** (Johnson & Johnson)" or "per **social constructivism**"
- Code as "0" for "collaboration improves learning" alone (too generic)

---

### Case 3: "The negative feedback could discourage participation"

| Coder | Classification | Reasoning |
|-------|----------------|-----------|
| **R1** | Prediction | Predicts student response |
| **R2** | Explanation | Explains effect of feedback |
| **R3** | Prediction | Future consequence |
| **Current AI** | Prediction or Explanation | Ambiguous |

**Resolution:** With STRICTER prompt:
- Code as "1" (Prediction) if: "could discourage participation **per self-determination theory**" or "**based on motivation research**"
- Code as "1" (Explanation) if: "The negative feedback discouraged participation **because it threatened autonomy (SDT)**"
- Code as "0" without theory - just speculation

---

## 📊 Proposed New Prompts (STRICTER VERSION)

### Description - STRICTER

```
You are an expert in analyzing teaching reflections. Determine if this text contains NEUTRAL DESCRIPTIONS of observable teaching or learning events.

DEFINITION: Descriptions identify specific, observable teaching or learning actions WITHOUT interpretation, evaluation, or reasoning about WHY/consequences.

STRICT CRITERIA FOR "1":
✓ Specific teacher instructional action ("asks question", "writes on board", "gives feedback")
✓ Specific student learning behavior ("raises hand", "works on worksheet", "discusses in pairs")
✓ Observable classroom interaction ("teacher calls on student", "students present solutions")
✓ NEUTRAL language - no "because", "should", "will", "likely"

STRICT CRITERIA FOR "0":
✗ Classroom physical setup ("desks in rows", "well-lit room")
✗ Demographics ("25 students", "experienced teacher", "5th grade class")
✗ Non-teaching context ("This is math class", "Video from Germany")
✗ Materials/equipment alone ("Worksheets available", "Smartboard present")
✗ Appearance ("students look tired", "teacher wears glasses")
✗ ANY reasoning about WHY or consequences
✗ Evaluations ("good question", "effective method")
✗ Interpretations ("This activates...", "This helps...")
✗ Speculation ("likely", "probably", "seems to")

CRITICAL: Only observable TEACHING/LEARNING ACTIONS, not context or setup!

Examples "1":
* "The teacher asks an open question"
* "Students raise their hands"
* "Teacher writes the topic on the board"
* "Students work in small groups"
* "Teacher provides individual feedback to students"

Examples "0":
* "The classroom has 25 students" (demographics)
* "Worksheets are on the desks" (materials alone)
* "This is a physics lesson" (context)
* "The teacher seems experienced" (evaluation)
* "Students appear engaged" (interpretation)

TEXT: {text}
```

---

### Explanation - MUCH STRICTER (Require Theory)

```
You are an expert in analyzing teaching reflections. Determine if this text EXPLICITLY connects teaching events to EDUCATIONAL THEORIES or RESEARCH.

DEFINITION: Explanations relate observable teaching events to established educational theories, learning science, or pedagogical research. Must explain WHY using theoretical frameworks.

STRICT CRITERIA FOR "1" - Requires ALL:
✓ Observable teaching/learning event mentioned
✓ WHY reasoning provided  
✓ **EXPLICIT mention of educational theory, research, or pedagogical principle**

Accepted theoretical references (examples):
* "Cognitive load theory"
* "Constructivism" / "Constructivist approach"
* "Self-determination theory" / "Motivation theory"  
* "Scaffolding" (Vygotsky)
* "Zone of proximal development" / "ZPD"
* "Wait time research" / "Think time (Rowe)"
* "Bloom's taxonomy"
* "Active learning principles"
* "Retrieval practice" / "Spacing effect"
* Specific researcher names (Piaget, Vygotsky, Deci & Ryan, etc.)

STRICT CRITERIA FOR "0" - Common-sense reasoning WITHOUT theory:
✗ "Open questions give students room to think" (No theory - common sense)
✗ "Repetition helps memory" (No specific theory cited)
✗ "Unclear instructions confused students" (Obvious cause-effect, no theory)
✗ "Students engaged because activity was hands-on" (No theory framework)
✗ "Teacher uses pairs to promote collaboration" (No theory basis stated)
✗ "Feedback helps students improve" (Generic, no theory)
✗ Any WHY reasoning without explicit theory mention

Examples "1" (EXPLICIT theory required):
* "Open questions activate prior knowledge according to constructivist theory"
* "Wait time increases student thinking as shown by Rowe's research"
* "This scaffolding approach aligns with Vygotsky's ZPD concept"
* "Per cognitive load theory, this reduces extraneous load"
* "Self-determination theory suggests this supports autonomy"

Examples "0" (No theory = not explanation):
* "Open questions make students think more" (No theory)
* "Hands-on activities increase engagement" (No theory)
* "Clear instructions reduce confusion" (Obvious, no theory)
* "Group work promotes collaboration" (No theory cited)
* "Positive feedback motivates students" (Common sense, no SDT reference)

CRITICAL: If NO educational theory/research explicitly mentioned → Code as "0"

TEXT: {text}
```

---

### Prediction - STRICTER (Require Theory)

```
You are an expert in analyzing teaching reflections. Determine if this text contains THEORY-BASED predictions about effects on student learning.

DEFINITION: Predictions estimate specific consequences of teaching events for student learning, motivation, or understanding, GROUNDED in learning theories.

STRICT CRITERIA FOR "1" - Requires BOTH:
✓ Specific predicted effect on students (learning/motivation/understanding)
✓ **Grounded in educational theory or research** (not just speculation)

Learning outcome predictions (if theory-based):
* Deep understanding / Surface learning
* Motivation / Engagement / Interest
* Retention / Memory / Recall
* Transfer of knowledge
* Cognitive development
* Self-efficacy / Confidence

STRICT CRITERIA FOR "0":
✗ Speculation without theory ("will likely", "may possibly")
✗ Emotional predictions alone ("feel happy", "get frustrated") without learning connection
✗ General outcome guesses ("will be better", "could improve")
✗ Predictions about teacher behavior (not student learning)
✗ No grounding in learning theory or research

Examples "1" (Theory-based prediction):
* "This feedback could increase intrinsic motivation per self-determination theory"
* "Students may develop deeper understanding through constructivist learning"
* "Based on retrieval practice research, this will improve long-term retention"
* "Cognitive load theory suggests students may experience overwhelm"
* "This scaffolding should support learning in their ZPD (Vygotsky)"

Examples "0" (Speculation without theory):
* "This will likely increase motivation" (No SDT reference)
* "Students may feel confused" (Emotion, not learning outcome)
* "This could help them understand better" (Generic, no theory)
* "They will probably enjoy this activity" (Enjoyment ≠ learning)
* "Students might remember this longer" (No retrieval practice reference)

CRITICAL: Prediction about learning + Theory basis = "1"; Speculation alone = "0"

TEXT: {text}
```

---

## 📊 Expected Impact of STRICTER Prompts

### Current (Loose) Results:
```
"blah blah" input:
→ D: 0%, E: 0%, P: 0% (correctly identifies non-PV)
→ But: Generic text often gets 60-90% PV (overestimation)
```

### With STRICTER Prompts:
```
Generic/Common-sense reflection:
→ D: 40%, E: 5%, P: 5% (much lower E and P)
→ Others: 50% (correctly identifies non-PV content)

Theory-rich reflection:
→ D: 50%, E: 30%, P: 20%  
→ More accurate representation
```

---

## 🎯 Recommendation Summary

| Component | Current Approach | Recommended Change | Priority |
|-----------|------------------|-------------------|----------|
| **Description** | Moderate | **Add strict exclusions** (demographics, setup) | Medium |
| **Explanation** | Too loose | **REQUIRE explicit theory** - biggest change | **HIGH** |
| **Prediction** | Moderate-loose | **Require theory grounding** | Medium |

---

## 📝 Implementation Plan

### Phase 1: STRICTER Explanation Prompt (Highest Priority)
**Why first:** Lowest human reliability, biggest overestimation issue
**Change:** Remove "Be INCLUSIVE", add "Require explicit theory mention"
**Test:** Run on 50 samples, compare with human R2 coding
**Expected:** E% drops significantly, better matches human coding

### Phase 2: Refine Description Exclusions
**Why:** Reduce false positives on "Others" content
**Change:** Add explicit exclusion list for non-teaching descriptions
**Test:** Check if "Others" detection improves
**Expected:** Better identification of non-PV content

### Phase 3: Stricter Prediction Requirements
**Why:** Reduce speculation without theory
**Change:** Emphasize theory grounding
**Test:** Compare predictions with/without theory mentions
**Expected:** More conservative prediction coding

---

## 🔬 Validation Approach

### Step 1: Create Test Set
- Use 100 segments from human coding (mix of D, E, P, Others)
- Include edge cases where human coders disagreed
- Cover full range: pure description, theory-rich, common-sense, non-PV

### Step 2: Test STRICTER Prompts
- Run new prompts on test set
- Compare with human R2 (best coder)
- Calculate Cohen's kappa
- Target: κ > 0.60 for each component

### Step 3: Analyze Disagreements
- Cases where AI="1" but Human="0" → Too loose still
- Cases where AI="0" but Human="1" → Too strict
- Iterate until balanced

### Step 4: A/B Test with Students
- Half get current (loose) prompts
- Half get new (strict) prompts
- Compare:
  - PV score distributions
  - Student perceptions
  - Feedback quality
  - Revision patterns

---

## ⚠️ Trade-offs to Consider

### Stricter Prompts:

**Pros:**
✅ Better matches human coding
✅ Reduces overestimation
✅ More accurate Others detection
✅ Higher inter-rater reliability with humans
✅ Forces students to use theory explicitly

**Cons:**
❌ May discourage students (lower scores)
❌ Could miss implicit theory knowledge
❌ Requires students to know theory names
❌ May penalize non-native speakers
❌ Less formative (more summative)

### Current Loose Prompts:

**Pros:**
✅ Encouraging for students (higher scores)
✅ Recognizes implicit understanding
✅ More formative feedback
✅ Accessible to beginners
✅ Rewards effort even without theory names

**Cons:**
❌ Overestimates PV significantly
❌ Poor alignment with expert judgment
❌ Inflates scores artificially
❌ Doesn't push students to use theory
❌ Research validity concerns

---

## 💡 My Recommendation

### **Use STRICTER Prompts for Explanation**

**Reasoning:**
1. Explanation has **lowest human reliability** (κ=0.36-0.48)
2. Current "Be INCLUSIVE" instruction is the **root cause**
3. **Biggest impact** on reducing overestimation
4. **Educational benefit:** Pushes students to learn and use theory names
5. **Research validity:** Better alignment with expert coding

### **Keep Moderate for Description and Prediction**

**Reasoning:**
1. Description already has good reliability (κ=0.63-0.75)
2. Too strict might discourage students unnecessarily
3. Balance research validity with formative support

---

## 📋 Next Steps

1. **Implement STRICTER Explanation prompt** in test environment
2. **Run validation study** on 100 samples (compare with human R2)
3. **Calculate new inter-rater reliability** (AI vs Human)
4. **If κ > 0.60:** Deploy to production
5. **If κ < 0.60:** Iterate on prompt wording
6. **Monitor student reactions** after deployment
7. **Compare PV distributions** before/after prompt change

---

## 🎓 Conclusion

**The current "relaxed" Explanation prompt is TOO LOOSE** and causes:
- Low inter-rater reliability with humans
- Massive PV overestimation
- Accepts common-sense as theory application

**Recommendation: Shift to STRICTER, theory-requiring prompts**, especially for Explanation.

**Trade-off:** May lower student scores but improves research validity and pushes better learning.

**Decision point:** Formative support vs Research accuracy - You must choose based on your study goals.





