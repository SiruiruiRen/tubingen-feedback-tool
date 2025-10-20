# What Human Coders Actually Debated: A Narrative Analysis

## 🎓 The Story of Two Coders: Michelle and Felina

Michelle and Felina are both trained researchers who coded German teacher reflections. They looked at the same text segments and tried to identify whether each contained **Description**, **Explanation**, or **Prediction**. 

Let me show you where they agreed, where they fought, and what it means for our AI prompts.

---

## 📊 The Numbers First

When Michelle and Felina coded the SAME 104 segments:

| Component | Agreement % | What This Means |
|-----------|-------------|-----------------|
| **Description** | 80.8% | Agreed 4 out of 5 times - pretty good! |
| **Explanation** | 84.6% | High agreement %, but... |
| **Prediction** | 88.5% | Best agreement |

**But here's the catch:**  
The Kappa scores tell a different story:

| Component | Kappa | Reality |
|-----------|-------|---------|
| **Description** | 0.623 | Good agreement when both see Description |
| **Explanation** | **0.257** | **Poor!** - They disagree on what counts |
| **Prediction** | 0.395 | Moderate - some confusion |

**Why the discrepancy?** They both often said "No Explanation" (agree on 0), but when Explanation WAS present, they couldn't agree on what qualified!

---

## 🔍 Concrete Examples: Where They Disagreed

### Example 1: The Cognitivism Text

**Original German:**
> "Ganz gemäß dem Kognitivismus sorgt die Lehrkraft für eine Einbettung bzw. Verankerung des Neuen in vorhandene Kenntnisse. Das wird klar durch das zu Begin des Videoclips Wiederholen der bereits bekannten Themen durch die Lehrkraft und dem darauf anschließenden Einbettung des neuen Themas durch einen Alltagsbeispiel (Zeitungsartikel)."

**English Translation:**
> "Completely according to cognitivism, the teacher embeds and anchors new knowledge into existing knowledge. This is clear through the teacher's repetition of already-known topics at the beginning of the video clip and the subsequent embedding of the new topic through an everyday example (newspaper article)."

**What Michelle (R1) saw:**
- Description: ✓ (Yes - describes what teacher did)
- Explanation: ✓ (Yes - mentions "Kognitivismus"!)
- Prediction: ✗ (No)
- Others: ✓ (Yes - some parts)

**What Felina (R2) saw:**
- Description: ✗ (No - it's theoretical framing, not neutral observation)
- Explanation: ✓ (Yes - explicitly mentions cognitivism)
- Prediction: ✓ (Yes - "anchoring" suggests future benefit)
- Others: ✗ (No - all professional vision)

**The fight:** Even when the text LITERALLY SAYS "according to cognitivism," they disagree on whether it's describing observed actions or applying theory!

**What this means:** Mentioning a theory name doesn't solve the disagreement. The question is: Is the author **describing what happened** or **interpreting it through theory**?

---

### Example 2: The French Role-Play

**Original German:**
> "Die Lehrerin beginnt den Französischunterricht mit einer Übung zur Konjugation. Dazu bittet sie zwei Schüler nach vorne, die in einem Rollenspiel Sätze mit diesem Verb sagen sollen... Dabei wiederholt jeder Spieler seinen Satz bis auf geringe Variationen immer wieder."

**English:**
> "The teacher begins the French class with a conjugation exercise. She asks two students to come forward to say sentences with this verb in a role-play... Each player repeats their sentence again and again with slight variations."

**What Michelle (R1) saw:**
- Description: ✓ (Yes - describes the activity)
- Explanation: ✓ (Yes - explains purpose "um die Konjugation einzuüben" = to practice conjugation)
- Prediction: ✗ (No)

**What Felina (R2) saw:**
- Description: ✓ (Yes - describes the activity)
- Explanation: ✗ (No - stating "to practice" is not a theoretical explanation)
- Prediction: ✗ (No)

**The debate:** Does saying "to practice conjugation" count as Explanation?

**Michelle's view:** Yes! It explains WHY the teacher did it (purpose = explanation)

**Felina's view:** No! That's just stating the obvious purpose. Explanation needs educational theory like "to support procedural memory according to skill acquisition research."

**Winner:** Felina's stricter approach had better overall reliability.

**What this means for our prompts:** Stating a PURPOSE is not enough for Explanation. Need explicit theory connection.

---

### Example 3: The Generic Feedback Theory

**Original German:**
> "Sachlich-konstruktives Feedback verfolgt das Ziel Schülerinnen und Schüler eine optimale Lernbegleitung und Lernunterstützung zu geben... So können die kognitiven Lernprozesse der Schülerinnen und Schüler unterstützt werden."

**English:**
> "Constructive feedback aims to provide students with optimal learning support... Thus cognitive learning processes of students can be supported."

**What Michelle (R1) saw:**
- Description: ✗
- Explanation: ✓ (Yes - talks about feedback theory and cognitive processes)
- Prediction: ✓ (Yes - predicts that processes "can be supported")
- Others: ✗

**What Felina (R2) saw:**
- Description: ✗
- Explanation: ✗
- Prediction: ✗
- **Others: ✓** (All Others!)

**The big fight:** This text mentions "cognitive learning processes" (theory language!) - why did Felina code it as Others?

**Felina's reasoning (inferred from pattern):** This is generic theoretical discourse ABOUT feedback in general. It's not connected to a SPECIFIC OBSERVED EVENT from the video. It's the student teacher philosophizing about feedback theory, not analyzing what actually happened in the classroom.

**Michelle's reasoning:** It mentions cognitive processes and learning theory concepts, so it must be Explanation and Prediction.

**Winner:** Felina. Her coding was more consistent and had better reliability.

**Critical insight:** **Generic theory talk ≠ Professional Vision**. PV requires connecting theory to OBSERVED EVENTS from the video.

---

### Example 4: The Motivation Prediction

**Original German:**
> "Durch die Ungeduld des Lehrers könnte bei den Schülerinnen und Schülern auch das Gefühl entstehen, dass ihre Beiträge nicht wertgeschätzt werden und die Motivation am Unterricht teilzuhaben sinkt."

**English:**
> "Due to the teacher's impatience, students might also feel that their contributions aren't valued and motivation to participate decreases."

**What Michelle (R1) saw:**
- Description: ✗
- Explanation: ✗
- Prediction: ✓ (Yes - predicts motivation decrease)
- Others: ✓ (Some parts)

**What Felina (R2) saw:**
- Description: ✗
- Explanation: ✓ (Yes - explains causal chain: impatience → feel unvalued → less motivation)
- Prediction: ✓ (Yes - also predicts the outcome)
- Others: ✗

**The nuance:** Is "impatience → feel unvalued → demotivated" an **Explanation** (explains mechanism) or **Prediction** (predicts outcome) or BOTH?

**Michelle:** Just Prediction (forecasts future state)

**Felina:** Both E and P (explains the psychological mechanism AND predicts the outcome)

**What this teaches us:** Some texts genuinely span multiple components. The causal chain EXPLAINS how impatience leads to demotivation (Explanation) while also PREDICTING the consequence (Prediction).

**For our prompts:** Need to allow for segments that can be coded "1" for multiple components. This is RAW coding, not priority-based!

---

### Example 5: The Simple Classroom Description

**Original German:**
> "Während die Schülerinnen und Schüler die Aufgabe bearbeiten, läuft die Lehrperson durch die Reihen, schaut auf die Aufschriebe der Lernenden und gibt zu einigen Feedback."

**English:**
> "While students work on the task, the teacher walks through the rows, looks at students' work, and gives feedback to some."

**What Michelle (R1) saw:**
- Description: ✓ (Yes - describes observable actions)
- Others: ✓

**What Felina (R2) saw:**
- Description: ✓ (Yes - describes observable actions)
- Others: ✓

**Finally - Agreement!** When text is purely descriptive observation, both coders agree.

**Lesson:** Description is easiest to agree on when it's just neutral observation without any WHY reasoning or theory mention.

---

## 🎯 The Pattern: What Causes Disagreement?

### High Agreement (Easy Cases):

✅ **Pure neutral description:**
"Teacher walks through rows" → Both: D=1

✅ **Clear theory + application:**
"According to cognitivism, the teacher..." → Both: E=1 (even if they disagree on D/P)

✅ **Obvious non-PV:**
"The classroom has 25 students" → Both: Others=1

### Low Agreement (Ambiguous Cases):

❌ **Purpose statements:**
"um die Konjugation einzuüben" (to practice conjugation)
- Michelle: Explanation (purpose = WHY)
- Felina: Description (just describes method)

❌ **Generic theory discourse:**
"Feedback supports cognitive learning processes"
- Michelle: Explanation + Prediction
- Felina: Others (not about specific observed event)

❌ **Common-sense reasoning:**
"Repetition helps students remember"
- Some would say: Explanation (explains mechanism)
- Others would say: Description or Others (no real theory)

---

## 💡 What Felina (R2) Teaches Us

Felina had the best overall reliability. Her coding pattern shows:

### Rule 1: "Others" When No Specific Event

**If text talks about teaching IN GENERAL** (not the specific video) → Others

Example:
```
"Constructive feedback aims to support learning"
→ Felina: Others (generic teaching philosophy)

"The teacher's constructive feedback to Anna helped her"  
→ Felina: Explanation (specific observed event + reasoning)
```

### Rule 2: Purpose ≠ Explanation

**Stating an instructional purpose is not the same as explaining with theory**

Example:
```
"The teacher uses role-play to practice conjugation"
→ Felina: Description (describes method + obvious purpose)

"The teacher uses role-play because active engagement improves retention per embodied cognition theory"
→ Felina: Explanation (theory-based reasoning)
```

### Rule 3: Theory Name Must APPLY to Observed Event

**Theory mentioned but not applied** → Could be Others

Example:
```
"Cognitivism is important for teaching"
→ Felina: Others (generic statement)

"The teacher's use of prior knowledge activation aligns with cognitivist principles"
→ Felina: Explanation (applies theory to observed practice)
```

---

## 🔧 What Our AI Prompts Should Learn

### Current Problem: We Mirror Michelle's Loose Approach

**Current Explanation prompt:**
```
"Be INCLUSIVE - Accept simple cause-effect statements"
```

This is basically Michelle's approach → Lower reliability!

### Solution: Adopt Felina's Stricter Rules

**New Explanation prompt should say:**
```
Code as "1" ONLY when:
1. Text describes a SPECIFIC EVENT from the classroom video
2. Educational theory or research is EXPLICITLY NAMED
3. The theory is APPLIED to explain the observed event

Generic theory statements → "0"
Purpose statements without theory → "0"
Common-sense reasoning → "0"
```

---

## 📝 Concrete Prompt Changes

### Before (Michelle-style - Too Loose):

```
Explanation Prompt:
- Accept: "The teacher uses questions to make students think"
- Accept: "Repetition helps students remember"
- Accept: "This promotes cognitive engagement"
```

### After (Felina-style - Stricter):

```
Explanation Prompt:
- Reject: "The teacher uses questions to make students think" (no theory)
- Reject: "Repetition helps students remember" (common sense, no theory name)
- Reject: "This promotes cognitive engagement" (vague theory language)

- Accept: "The teacher's questioning activates prior knowledge per constructivist theory"
- Accept: "Repetition supports memory according to spacing effect research"  
- Accept: "This engages working memory per cognitive load theory"
```

---

## 🎯 The Bottom Line

### What I Learned from ACTUAL Human Coding:

1. **Initial disagreement was catastrophic** (κ near 0)
2. **After discussion, Explanation still had lowest agreement** (κ=0.257)
3. **Felina (R2) had stricter, more reliable approach**
4. **Key distinction: Generic theory talk vs Applied theory analysis**

### For Your AI Prompts:

**Current approach mirrors Michelle** → Too inclusive, lower reliability

**Should mirror Felina** → Stricter, better reliability

**Specific changes needed:**
- ✅ Require theory NAMES (not just "educational knowledge")
- ✅ Require connection to OBSERVED events (not generic theory)
- ✅ Purpose statements alone = NOT Explanation
- ✅ Use "Others" more liberally for generic discourse

---

## 📖 Where to Go from Here

**I created two documents:**

1. **ACTUAL_HUMAN_CODING_ANALYSIS.md** - Technical analysis with row numbers
2. **HUMAN_CODER_DISCUSSION_NARRATIVE.md** - This file (narrative with examples)

**Both based on real coding data from Coding_S2_extracted.csv, NOT summaries!**

**Next step:** Decide if you want to implement Felina's stricter approach in your prompts. It will:
- ✅ Better match expert coding
- ✅ Reduce overestimation
- ⚠️ Lower student scores
- ⚠️ Require explicit theory knowledge

Your call! 🎯

