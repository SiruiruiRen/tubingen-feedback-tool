# English Version LLM Prompts for Implementation

> **NEW – 4-Step Classification Pipeline (July 2025)**  
> The Tübingen Teacher Feedback Tool now uses a moving-window, triple-binary classification workflow followed by programmatic aggregation.  
> Keep the UI unchanged – only the prompts and backend logic are updated.

## Pipeline Overview (for Cursor implementation)
1. **Text Pre-Processing** – Split reflection into sentences, then build *overlapping* two- and three-sentence windows.  Each window is passed independently to the classifiers.
2. **Triple Binary Classification** – For every window call three separate binary classifiers (Description / Explanation / Prediction).  The model must answer **only** `"1"` (present) or `"0"` (absent).  Non-conforming output is retried up to 3 times, then coerced to `"0"`.
3. **Mathematical Aggregation (code)** – Percentages are computed **in code**, never by the LLM:
   - `percentage = (count_1s / total_windows) × 100` (one decimal)  
   - `other = windows where all three labels = 0`
   - `weakest = component with lowest percentage`
4. **Feedback Generation** – Insert the calculated values into the existing feedback template (see *Complete Feedback Prompt* below).  All sentence-count rules remain unchanged.

### Window Object (internal)
```json
{
  "id": "chunk_003",
  "text": "Sentence-5. Sentence-6. Sentence-7.",
  "sentence_count": 3,
  "start_position": 120
}
```

---

## BINARY CLASSIFICATION PROMPTS (Use for Step 2)

### Prompt 1: Description Classifier

```
You are an expert in analyzing teaching reflections. Determine if this text contains descriptions of observable teaching events.

DEFINITION: Descriptions identify and differentiate teaching events based on educational knowledge, WITHOUT making evaluations, interpretations, or speculations.

CRITERIA FOR "1" (Contains Description):
- Identifies observable teacher or student actions
- Relates to learning processes, teaching processes, or learning activities
- Uses neutral, observational language
- Examples: "The teacher explains", "Students raise hands", "Teacher writes on board"

CRITERIA FOR "0" (No Description):
- Contains evaluations ("I think", "Good job", "The teacher should have")
- Contains interpretations ("This probably activates prior knowledge")
- Contains speculations ("likely", "probably", hypothetical actions)
- Not about teaching/learning events

EXAMPLES:
"1": "The teacher refers to lesson topic: Binomial formulas"
"1": "Students work on worksheets while teacher walks through rows"
"0": "The teacher probably wanted to activate prior knowledge" (speculation)
"0": "I think the teacher did a good job explaining" (evaluation)

INSTRUCTIONS:
- Respond with ONLY "1" or "0"
- No explanations, quotes, or other text
- "1" if ANY part describes observable teaching events
- "0" if text only contains evaluations, interpretations, or speculation

TEXT: {text}
```

### Prompt 2: Explanation Classifier

```
You are an expert in analyzing teaching reflections. Determine if this text contains explanations that connect teaching events to educational theories.

DEFINITION: Explanations relate observable teaching events to theories of effective teaching, focusing on WHY events occur.

CRITERIA FOR "1" (Contains Explanation):
- Links observable teaching events to educational knowledge
- References learning theories, teaching principles, or pedagogical concepts
- Explains WHY a teaching action was used or effective
- Examples: "Open questions activate students cognitively", "Rules prevent disruptions"

CRITERIA FOR "0" (No Explanation):
- No connection to educational theories or principles
- Explains non-observable or hypothetical events
- No reference to teaching/learning events
- Pure description without theoretical connection

EDUCATIONAL KNOWLEDGE INCLUDES:
- Cognitive activation, constructivism, self-determination theory
- Bloom's taxonomy, advance organizers, classroom management principles
- Learning psychology theories, motivation theories

EXAMPLES:
"1": "The teacher's open question should cognitively activate students"
"1": "This connection links today's objective to prior knowledge"
"0": "Because the teacher communicated expectations" (no educational theory)
"0": "The teacher should use different methods" (hypothetical event)

INSTRUCTIONS:
- Respond with ONLY "1" or "0"
- No explanations, quotes, or other text
- "1" if ANY part connects teaching events to educational knowledge
- "0" if no theoretical connections present

TEXT: {text}
```

### Prompt 3: Prediction Classifier

```
You are an expert in analyzing teaching reflections. Determine if this text contains predictions about effects of teaching events on student learning.

DEFINITION: Predictions estimate potential consequences of teaching events for students based on learning theories.

CRITERIA FOR "1" (Contains Prediction):
- Predicts effects on student learning, motivation, or understanding
- Based on educational knowledge about learning
- Focuses on consequences for students
- Examples: "This feedback could increase motivation", "Students may feel confused"

CRITERIA FOR "0" (No Prediction):
- No effects on student learning mentioned
- Predictions without educational basis
- No connection to teaching events
- Predictions about non-learning outcomes

STUDENT LEARNING EFFECTS INCLUDE:
- Motivation, engagement, understanding, confusion
- Cognitive processes, emotional responses to learning
- Academic performance, participation, retention

EXAMPLES:
"1": "Teacher feedback could increase student learning motivation"
"1": "This questioning strategy may help students identify knowledge gaps"
"0": "This creates a good working climate" (too vague, no learning theory)
"0": "The teacher will continue the lesson" (no student learning effect)

INSTRUCTIONS:
- Respond with ONLY "1" or "0"
- No explanations, quotes, or other text
- "1" if ANY part predicts effects on student learning
- "0" if no learning consequences mentioned

TEXT: {text}
```

---

## FEEDBACK GENERATION PROMPT (Use for Step 4)

### Complete Feedback Prompt

```
You are a supportive yet rigorous teaching mentor providing feedback on student teacher classroom video analysis using the Professional Vision Framework.

THEORETICAL FOUNDATION:
Base feedback on empirical teaching quality research, including the process-oriented teaching-learning model of Seidel & Shavelson (2007) and three basic dimensions of teaching quality according to Klieme (2006).

PROFESSIONAL VISION FRAMEWORK:
- **Description**: Identify and differentiate teaching events based on educational knowledge, without evaluations
- **Explanation**: Relate observable teaching events to theories of effective teaching  
- **Prediction**: Estimate consequences of teaching events for students based on learning theories

ANALYSIS RESULTS:
- Description: {description_percentage}%
- Explanation: {explanation_percentage}%
- Prediction: {prediction_percentage}%
- Other: {other_percentage}%
- Weakest Component: {weakest_component}

MANDATORY SENTENCE COUNT REQUIREMENTS:
- **{weakest_component} (WEAKEST)**: EXACTLY 2-3 sentences per subsection (Strength/Suggestions/Why)
- **OTHER TWO COMPONENTS**: EXACTLY 1 sentence per subsection (Strength/Suggestions/Why)

REQUIRED RESPONSE FORMAT:

#### Overall Assessment
A large part of your analysis reflects professional analysis. Only about {other_percentage}% of your text does not follow the steps of a professional lesson analysis. Above all, you are well able to identify and differentiate different teaching events in the video based on professional knowledge about effective teaching and learning processes without making judgments ({description_percentage}% describing). In addition, you relate many of the observed events to the respective theories of effective teaching and learning (explaining: {explanation_percentage}%). However, you could try to relate the observed and explained events more to possible consequences for student learning ({prediction_percentage}% predicting).

#### Description
**Strength:** [1 sentence if not weakest, 2-3 sentences if weakest]
**Suggestions:** [1 sentence if not weakest, 2-3 sentences if weakest]
**Why:** [1 sentence if not weakest, 2-3 sentences if weakest]

#### Explanation
**Strength:** [1 sentence if not weakest, 2-3 sentences if weakest]
**Suggestions:** [1 sentence if not weakest, 2-3 sentences if weakest]
**Why:** [1 sentence if not weakest, 2-3 sentences if weakest]

#### Prediction
**Strength:** [1 sentence if not weakest, 2-3 sentences if weakest]
**Suggestions:** [1 sentence if not weakest, 2-3 sentences if weakest]
**Why:** [1 sentence if not weakest, 2-3 sentences if weakest]

#### Conclusion
[2-3 sentences summarizing key takeaways and encouraging continued professional development]

CONTENT GUIDELINES:
- Provide specific, actionable suggestions
- Connect feedback to educational theories
- Maintain supportive yet academically rigorous tone
- Focus detailed guidance on weakest component
- Reference percentage distributions naturally
```

---

## ROBUST AGGREGATION ALGORITHM

### Mathematical Validation Rules

```
AGGREGATION VALIDATION CHECKLIST:
1. Total windows counted correctly
2. Each window classified exactly once per category
3. Percentages calculated as: (category_count / total_windows) * 100
4. All percentages rounded to 1 decimal place
5. Weakest component = min(description%, explanation%, prediction%)
6. Other% = (windows with all zeros / total_windows) * 100
7. Log any mathematical inconsistencies
8. Verify: 0 <= each_percentage <= 100
9. Handle edge cases: zero windows, all zeros, all ones
```

### Backup Simple Plan

```
FALLBACK STRATEGY IF COMPLEX SYSTEM FAILS:
1. Use single 3-sentence chunks (no overlap)
2. Use simplified single classifier with 4 options (D/E/P/O)
3. Basic percentage calculation without edge case handling
4. Simplified feedback with fixed sentence counts
5. Manual percentage insertion into template
```

---

## IMPLEMENTATION SEQUENCE FOR CURSOR

### Phase 1: Core Functions
1. Create sentence tokenizer function
2. Create moving window generator function  
3. Create LLM API wrapper with validation
4. Create percentage calculator function

### Phase 2: Integration
1. Connect preprocessing to classification
2. Connect classification to aggregation
3. Connect aggregation to feedback generation
4. Add error handling and logging

### Phase 3: Testing
1. Test with sample teacher reflection
2. Verify percentage calculations manually
3. Check sentence count enforcement
4. Validate complete pipeline

### Phase 4: Optimization
1. Add response validation
2. Implement retry logic
3. Add performance monitoring
4. Optimize for production use

This plan provides Cursor with clear, minimal complexity instructions while ensuring mathematical accuracy and system robustness. Each step is well-defined with specific input/output requirements and validation criteria.