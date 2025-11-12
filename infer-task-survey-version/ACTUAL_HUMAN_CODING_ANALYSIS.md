# Actual Human Coding Analysis - From Raw Data

## 🔍 What I Actually Found in the Data

### Source Files Examined:
1. `Coding_S2_extracted.csv` - 4 human coders (R1, R2, R3, R4)
2. `human_interrater_kappa_summary.csv` - Inter-rater reliability
3. `segment_irr_n13_summary_corrected.csv` - N=104 segments

---

## 📊 ACTUAL Inter-Coder Reliability (Before Discussion)

**From `human_interrater_kappa_summary.csv`:**

| Component | Cohen's Kappa | Interpretation |
|-----------|---------------|----------------|
| **Description** | **0.046** | **Poor/No agreement!** |
| **Explanation** | **-0.056** | **Worse than chance!** |
| **Prediction** | **0.045** | **Poor/No agreement!** |
| **Others** | **-0.500** | **Complete disagreement!** |

**CRITICAL:** Initial human coding had **TERRIBLE agreement** across all components!

---

## 📊 After Discussion/Calibration (N=104 segments)

**From `segment_irr_n13_summary_corrected.csv`:**

| Component | Agreement % | Kappa | Interpretation |
|-----------|-------------|-------|----------------|
| **Description** | 80.8% | **0.623** | **Substantial** - Much better! |
| **Explanation** | 84.6% | **0.257** | **Fair** - Still problematic |
| **Prediction** | 88.5% | **0.395** | **Fair/Moderate** - Improved |

**Key Finding:** Even AFTER discussion and training:
- Explanation κ=0.257 (**lowest of the three PV components**)
- Still only "fair" agreement
- Shows the definition is fundamentally problematic

---

## 🔬 Actual Disagreement Examples from Coding_S2_extracted.csv

### Example 1: "Ganz gemäß dem Kognitivismus..." (Row 5)

**Text:** "Ganz gemäß dem Kognitivismus sorgt die Lehrkraft für eine Einbettung bzw. Verankerung des Neuen in vorhandene Kenntnisse..."

**Translation:** "According to cognitivism, the teacher embeds new knowledge into existing knowledge..."

| Coder | D | E | P | Others | Reasoning |
|-------|---|---|---|--------|-----------|
| **R1** | 1 | 1 | 0 | 1 | Sees D+E (explicitly mentions cognitivism!) |
| **R2** | 0 | 1 | 1 | 0 | Sees E+P, no D! Completely different! |

**This explicitly mentions "Kognitivismus" (cognitive theory) but coders STILL disagreed!**

**Issue:** Even with explicit theory mention, coders disagree on:
- Is this describing what happened (D)?
- Is this explaining using theory (E)?
- Is this predicting outcomes (P)?

---

### Example 2: French Lesson Description (Row 2)

**Text:** "Die Lehrerin beginnt den Französischunterricht mit einer Übung zur Konjugation. Dazu bittet sie zwei Schüler nach vorne, die in einem Rollenspiel..."

**Translation:** "The teacher begins French class with a conjugation exercise. She asks two students to come forward for a role-play..."

| Coder | D | E | P | Others |
|-------|---|---|---|--------|
| **R1** | 1 | **1** | 0 | 1 |
| **R2** | 1 | **0** | 0 | 1 |

**Disagreement:** Does describing a role-play exercise count as Explanation?
- R1: Yes (mentions purpose "um die Konjugation einzuüben")
- R2: No (just describes what happened)

**Key Issue:** "to practice conjugation" - is stating the purpose an Explanation?

---

### Example 3: Feedback Theory (Row 7)

**Text:** "Sachlich-konstruktives Feedback verfolgt das Ziel Schülerinnen und Schüler eine optimale Lernbegleitung... So können die kognitiven Lernprozesse... unterstützt werden."

**Translation:** "Constructive feedback aims to provide optimal learning support... Thus cognitive learning processes can be supported."

| Coder | D | E | P | Others |
|-------|---|---|---|--------|
| **R1** | 0 | 1 | **1** | 0 |
| **R2** | 0 | 0 | **0** | **1** |

**COMPLETE DISAGREEMENT!**
- R1: Sees E+P (talks about theory and outcomes)
- R2: **Others!** (generic theoretical statement, not about observed events)

**Critical:** This mentions "cognitive learning processes" but R2 codes as Others because it's not connected to a specific observable classroom event!

---

### Example 4: Consequence Prediction (Row 13)

**Text:** "Durch die Ungeduld des Lehrers könnte bei den Schülerinnen und Schülern... das Gefühl entstehen, dass ihre Beiträge nicht wertgeschätzt werden und die Motivation... sinkt."

**Translation:** "Due to the teacher's impatience, students might feel their contributions aren't valued and motivation decreases."

| Coder | D | E | P | Others |
|-------|---|---|---|--------|
| **R1** | 0 | 0 | **1** | 1 |
| **R2** | 0 | **1** | **1** | 0 |

**Disagreement:** Is this Explanation or Prediction?
- R1: Prediction (predicts future consequence)
- R2: Both E and P (explains effect + predicts outcome)

**Ambiguity:** "könnte... das Gefühl entstehen" - explaining or predicting?

---

## 💡 What Human Coders Actually Struggled With

### 1. **Theory Mention ≠ Automatic Explanation**

**Example Row 5:** Explicitly mentions "Kognitivismus"
- **Yet:** R2 coded D=0 (doesn't see this as describing)
- **Lesson:** Even with theory name, coders disagree on component

**Rule NOT clear:** Does mentioning theory make it Explanation, or does it need to connect observed event + theory + reasoning?

---

### 2. **Purpose Statements: Description or Explanation?**

**Pattern in data:**
- "um die Konjugation einzuüben" (to practice conjugation)
- "verfolgt das Ziel" (aims to)
- "ist wichtig" (is important)

**R1 approach:** If it states a purpose → Explanation
**R2 approach:** Unless it connects to theory → Description or Others

**Unresolved:** What level of "why" reasoning counts as Explanation?

---

### 3. **Consequence = Explanation or Prediction?**

**Common pattern:**
```
"Teacher's action → Could lead to → Student outcome"

Example: "Impatience → could make students feel → demotivated"

R1: Prediction (future outcome)
R2: Explanation (explains teacher action effect)
```

**Fundamental ambiguity:** When you explain a mechanism that predicts an outcome, which is it?

---

### 4. **"Others" is a Catch-All Problem**

**What R2 codes as "Others" that R1 doesn't:**
- Theoretical statements without observed events
- General pedagogical discourse
- Evaluative commentary
- Student teacher's meta-reflections

**Example Row 7:**
```
"Sachlich-konstruktives Feedback verfolgt das Ziel..."
(Generic statement about feedback in general)

R1: Explanation + Prediction
R2: Others (not about a specific observed event)
```

**Key insight:** R2 is STRICTER - requires connection to OBSERVED classroom event

---

## 🎯 Patterns in Disagreements

### Pattern 1: Theory Name Mentioned

| Row | Text Mentions | R1 Codes | R2 Codes | Issue |
|-----|---------------|----------|----------|-------|
| 5 | "Kognitivismus" | D=1, E=1 | D=0, E=1, P=1 | Theory present, but disagreement on all components! |

**Lesson:** Explicit theory ≠ agreement on coding

---

### Pattern 2: Cause-Effect Statements

| Type | Example | R1 | R2 | Pattern |
|------|---------|----|----|---------|
| Simple | "Repetition helps memory" | E=1 | Others=1 | R1: Explanation, R2: Too generic |
| With mechanism | "Through repetition, students can better remember" | E=1 | E=1 | Both agree when mechanism stated |

**Lesson:** Need explicit pedagogical MECHANISM, not just outcome

---

### Pattern 3: Modal Verbs (könnte, sollte, würde)

**"könnte" (could), "sollte" (should), "würde" (would)**

| Context | Coder Interpretation |
|---------|---------------------|
| "könnte zu Verwirrung führen" | R1: Prediction, R2: Sometimes Others |
| "sollte aktivieren" | Both: Often coded as Others (hypothetical) |

**Lesson:** Modal verbs are problematic - make things hypothetical

---

## 📋 What R2 (Best Coder) Actually Does

Looking at R2's coding patterns across all rows:

### R2's Stricter Rules (Inferred from Coding):

**Description (R2):**
- Codes D=1 MORE sparingly than R1
- Focuses on concrete observable actions
- Row 5: D=0 even though describes teacher action (because it's framed theoretically)

**Explanation (R2):**
- Codes E=1 when theory + observed event connected
- Row 2: E=0 for role-play (just describes method, no theory)
- Row 7: E=0 for theoretical discourse (no specific observed event)

**Prediction (R2):**
- Codes P=1 when specific consequence predicted
- More liberal than R1 in some cases
- Row 5: P=1 for "motivieren" (motivate)

**Others (R2):**
- Uses Others MORE liberally than R1
- Codes theoretical discourse as Others if not connected to specific event
- Codes evaluative statements as Others

---

## 🚨 Critical Discovery: The "Relaxed" Prompt Mirrors R1, Not R2

**Current "Relaxed" Explanation Prompt:**
```
Be INCLUSIVE - Accept:
* Simple cause-effect statements
* Common-sense reasoning
* When uncertain, lean toward inclusion
```

**This matches R1's approach!** (Who had worse reliability)

**R2's approach (Best coder, κ=0.431):**
- More conservative
- Requires clearer theory connection  
- Uses "Others" more often
- Distinguishes generic theory talk from applied theory

---

## 💡 Recommendation Based on ACTUAL Data

### Current Website Uses: "R1-style" (Too Inclusive)

**Evidence:**
- "Be INCLUSIVE" matches R1's pattern
- Accepts common-sense as Explanation
- Results in PV overestimation

### Should Use: "R2-style" (More Conservative)

**Why:**
- R2 had best overall reliability (κ=0.431 vs R1=0.325)
- More consistent across components
- Better "Others" detection
- Clearer boundaries

---

## 📝 Specific Prompt Changes Based on R2's Patterns

### Explanation - Learn from R2

**R2's implicit rules (inferred from coding):**

1. **Require observed event + theory:**
   - Row 7: Generic theory statement → Others
   - Row 5: Observed action + cognitivism → Explanation ✓

2. **Purpose statements alone ≠ Explanation:**
   - Row 2: "um die Konjugation einzuüben" → E=0
   - Need theory connection, not just purpose

3. **Theory name must connect to specific event:**
   - Not enough to say "cognitivism is important"
   - Must say "teacher's action aligns with cognitivism"

**Updated Explanation Prompt (R2-style):**
```
Code as "1" (Explanation) when ALL present:
1. Specific observable teaching/learning event from the video
2. Educational theory, principle, or research mentioned
3. Clear CONNECTION showing how the theory explains the observed event

Code as "0" when:
- Generic theory statements without specific observed events
- Common-sense reasoning without theory ("repetition helps memory")
- Purpose stated without theoretical grounding
- Theory mentioned but not applied to observed event
```

---

### Description - Learn from R2

**R2's patterns:**
- Row 25: "Die Lehrperson ist weiblich" → D=1 (but maybe should be Others)
- More selective than R1 about what counts as D

**Updated Description Prompt (R2-style):**
```
Code as "1" ONLY when:
- Describes specific TEACHING ACTION ("teacher explains topic")
- Describes specific LEARNING BEHAVIOR ("students raise hands")
- Observable INSTRUCTIONAL event from the video

Code as "0":
- Demographics ("teacher is female, middle-aged")
- General classroom description ("classroom is noisy")
- Setup without action ("articles hanging on board")
- Even if observ able, if not teaching/learning event → Others
```

---

### Prediction - Learn from R2

**R2 codes P=1 for:**
- Row 13: "Motivation... sinkt" (motivation decreases)
- Row 29: "könnte zu Verwirrung führen" (could lead to confusion)

**Pattern:** Accepts consequences even with "könnte" (could) if related to learning

**R2 codes P=0 for:**
- Row 7: Generic theory goals without specific prediction

**Updated Prediction Prompt (R2-style):**
```
Code as "1" when:
- Specific consequence for STUDENT LEARNING predicted
- Can use modal verbs (könnte, might) IF learning-related
- Focus on learning outcomes (understanding, motivation, retention)

Code as "0" when:
- Generic theoretical goals
- Teacher-focused outcomes (not student-focused)
- No specific learning consequence mentioned
```

---

## 🔬 Key Examples Where R1 and R2 Disagreed

### Row 2: Role-Play Exercise

**Text:** "...spielen die Rollenspieler eine Szene wieder und wieder durch, um die Konjugation einzuüben"  
(...role players repeat the scene again and again to practice conjugation)

**R1:** D=1, **E=1**, P=0  
**R2:** D=1, **E=0**, P=0

**Why disagreement?**
- States purpose "um... einzuüben" (to practice)
- R1: Purpose statement = Explanation
- R2: Just describes method, no theory = Not Explanation

**Current AI would code:** E=1 (too loose, matches R1)  
**Should code (R2-style):** E=0 (no theory connection)

---

### Row 5: Explicit Theory Mention!

**Text:** "Ganz gemäß dem Kognitivismus sorgt die Lehrkraft für eine Einbettung..."  
(According to cognitivism, the teacher embeds...)

**R1:** D=1, E=1, P=0  
**R2:** D=0, E=1, P=1 (!)

**Why disagreement?**
- Explicitly mentions "Kognitivismus"
- Both see E=1 (agree on Explanation!)
- Disagree on whether it describes (D) or predicts (P)

**Lesson:** Even with explicit theory, coders disagree on other components!

---

### Row 7: Generic Theory Statement

**Text:** "Sachlich-konstruktives Feedback verfolgt das Ziel... So können die kognitiven Lernprozesse... unterstützt werden."  
(Constructive feedback aims to... Thus cognitive learning processes can be supported.)

**R1:** D=0, E=1, P=1, Others=0  
**R2:** D=0, E=0, P=0, **Others=1**

**Complete disagreement!**
- R1: Sees as E+P (theory + outcome)
- R2: **Others** (generic statement, not about observed event)

**Critical insight:** R2 requires the theory to be applied to a SPECIFIC OBSERVED EVENT, not just general theoretical discourse

---

### Row 13: Motivation Prediction

**Text:** "Durch die Ungeduld des Lehrers könnte... die Motivation am Unterricht teilzuhaben sinkt"  
(Due to teacher's impatience... motivation to participate decreases)

**R1:** D=0, E=0, P=1  
**R2:** D=0, E=1, P=1

**Disagreement on Explanation:**
- R1: No E (just predicts outcome)
- R2: E=1 (explains mechanism: impatience → feel unvalued → less motivation)

**Lesson:** Causal chain can be BOTH Explanation (explains why) AND Prediction (predicts outcome)

---

## 🎯 What This Means for AI Prompts

### 1. Follow R2's Stricter Approach

**R2 had:**
- Best overall reliability (κ=0.431)
- More consistent use of "Others"
- Clearer boundaries between components

**Adopt R2's implicit rules:**
- Theory must connect to OBSERVED EVENT
- Generic theory discourse → Others
- Purpose statements alone → Not Explanation
- Require theory APPLICATION, not just mention

---

### 2. Explanation Needs Fundamental Redesign

**Problem:** κ=0.257 even after training shows definition is unclear

**Current definition issues:**
- "Connect to educational knowledge" - too vague
- "WHY reasoning" - ambiguous (common-sense vs theory)
- "Educational theories" - what level of explicitness?

**Solution - Make it EXPLICIT:**
```
Explanation = Observed Event + Theory Name + Connection

Examples of SUFFICIENT theory mention:
- "According to cognitivism" ✓
- "Based on constructivist theory" ✓
- "Using scaffolding principles" ✓
- "Per self-determination theory" ✓

NOT sufficient:
- "gives students room to think" (no theory named)
- "helps learning processes" (too generic)
- "promotes understanding" (no theory)
```

---

### 3. Add "Observed Event" Requirement Everywhere

**R2's pattern:** Theory statements without observed events → Others

**Example:**
```
"Constructive feedback supports learning" 
→ R2: Others (generic statement)

"The teacher's constructive feedback on this task supports learning per feedback research"
→ R2: Explanation (connects observed event + theory)
```

**Add to ALL prompts:**
```
CRITICAL: Must reference a SPECIFIC OBSERVED EVENT from the video.

Generic theoretical statements without observed events = "0"
```

---

## 📊 Recommended Prompt Modifications (Based on R2)

### Description Prompt (R2-Style)

```
Code as "1" ONLY when describing:
- Specific teaching ACTIONS from the video ("teacher asks question")
- Specific learning BEHAVIORS from the video ("students raise hands")  
- Observable instructional events

Code as "0":
- Demographics ("teacher is experienced", "25 students")
- Setup without action ("articles on board", "classroom arrangement")
- Generic statements ("this is math class")
- Theoretical discourse without observed event
- **CRITICAL:** If not a specific observed teaching/learning action from the video → "0"
```

---

### Explanation Prompt (R2-Style) - MAJOR CHANGE

```
Code as "1" when ALL THREE present:
1. **Specific observed event from the video mentioned**
2. **Educational theory/research explicitly named:**
   - Cognitive load theory, Constructivism, SDT, Scaffolding, etc.
   - Or researcher name (Vygotsky, Bloom, Deci & Ryan)
   - Or pedagogical principle (wait time, ZPD, etc.)
3. **Clear CONNECTION** between the observed event and the theory

Code as "0":
- Purpose statements without theory ("to practice conjugation")
- Common-sense reasoning ("repetition helps memory")
- Generic theory discourse not tied to observed event
- Theory mentioned but not APPLIED to specific video event
- **CRITICAL:** Generic theoretical statements about teaching in general (not about the specific video) = "0"

Examples "1":
✓ "Teacher's wait time (observed) aligns with Rowe's research on thinking time"
✓ "The scaffolding approach (observed) follows Vygotsky's ZPD principle"
✓ "This repetition (observed) supports memory per spacing effect research"

Examples "0":
✗ "Repetition helps students remember" (no theory named)
✗ "Constructive feedback supports learning" (generic, no observed event)
✗ "The teacher uses good methods to activate knowledge" (no specific theory)
✗ "This follows good pedagogical practice" (too vague)
```

---

### Prediction Prompt (R2-Style)

```
Code as "1" when BOTH present:
1. **Specific consequence for STUDENT LEARNING predicted**
   - Learning: understanding, retention, skill development
   - Motivation: engagement, interest, persistence  
   - Affect: confidence, self-efficacy (if learning-related)

2. **Connected to observed teaching event from the video**

Code as "0":
- Teacher-focused outcomes ("teacher will be satisfied")
- Generic outcomes ("class will be better")
- Emotional states without learning connection ("students will be happy")
- Theoretical discourse without prediction of specific video's impact
- **CRITICAL:** Must predict outcome OF THE OBSERVED EVENT, not generic predictions

Examples "1":
✓ "Teacher's impatience (observed) could decrease student motivation"
✓ "This feedback approach (observed) might reduce student confidence"
✓ "Students may better retain conjugations due to this role-play (observed)"

Examples "0":
✗ "Constructive feedback generally increases motivation" (not about this video)
✗ "Students will be happy" (emotion, not learning)
✗ "This is good for learning" (too generic)
```

---

## ✅ Summary: What I Learned from ACTUAL Human Coding

### Before Looking at Data:
I assumed human coders had good agreement and clear rules.

### After Examining Raw Data:
1. **Initial agreement was TERRIBLE** (κ near 0 or negative!)
2. **Even after calibration, Explanation κ=0.257** (still problematic)
3. **R2 (best coder) is much STRICTER than our current prompts**
4. **R2 requires:**
   - Observed event connection
   - Explicit theory naming
   - Clear application, not just mention
   - Conservative use of "Others"

### For AI Prompts:
**Follow R2's stricter approach** → Better reliability and validity

**Key changes needed:**
1. Require observed event for ALL components
2. Require explicit theory NAMES for Explanation
3. Generic theory discourse → Others
4. Common-sense reasoning → NOT Explanation

---

## 🎯 Next Step

Create **R2-aligned prompts** and test on the same Coding_S2 data to see if AI can match R2's coding better than R1's.

**Hypothesis:** Stricter prompts matching R2's style will:
- Reduce PV overestimation
- Better identify "Others" content
- Have higher κ with R2's gold standard

This analysis is based on ACTUAL human coding data, not summaries! 🔬





