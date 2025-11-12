# Control vs Experimental Group Prompt Comparison

## Model Settings and Configuration

### GPT-4o-mini (All Groups)
- **Model**: GPT-4o-mini
- **API**: Chat Completions API
- **Temperature**: 0 (Deterministic outputs)
- **Max Completion Tokens**: 2000

## Test Case: German Video Reflection Analysis

**Example Text (from example.txt):**
```
Die Lehrerin kündigt zunächst an, dass die Klasse nun eine Aufgabe zu lösen hat. Da sie dies in Französisch kommuniziert, wiederholt sie dies. Dann bittet sie auf Deutsch einen Jungen, Luca, nach vorne und setzt ihm eine Baskenmütze auf auf. Danach bittet sie ein Mädchen, Lea, nach vorne und endet ihr ein Tuch um. Die beiden sollen "Brigitte" und "Danielle" darstellen. Die Phrase, die gelernt werden soll, wird nun zunächst häufig gesagt, dann in die Aufgabe eingebunden. Für die Aufgabe hat sie verschiedene einlaminierte gedruckte Gegenstände für die Tafel mitgebracht. Nun müssen zunächst Luca und Lea die Aufgabe lösen. Mit zustimmendem "Mhm" macht die Lehrkraft deutlich, wenn das Gesagte korrekt ist. Sie lässt nun ein weiteres Mädchen aus der Klasse, das in der ersten reihe sitzt, Sarah, ebenfalls die Phrase wiederholen, die eingeübt werden soll. Die Lehrerin kommentiert am Ende des ersten Übungsteils die Leitung mit "bien", lobt also kurz die vorne stehenden Schüler. Der Rest der Klasse ist sowohl im ersten als auch im daraufhin folgenden zweiten Übungsteil größtenteils passiv, Dann wiederholen Luca und Lea vorne noch einmal die Aufgaben und führen sie dann mit anderen Gegenständen noch einmal aus, die an die Tafel gehängt werden. Auch Sarah soll nun wieder antworten, was die Lehrkraft durch die Handbewegung initiiert. Falsch angesetzte Sätze verbessert die Lehrkraft durch ein unterbrechen mit "no no no no", das beiläufig und ruhig eingeworfen wird. Nun machen die Schüler mit einem weiteren Beispiel die Übung komplett alleine, was die Lehrerin auf Deutsch mit "jetzt seid ihr mal dran" einleitet, Fehler aber durch wiederholen bzw. Einwerfen der richtigen Phrase verbessert. Florian, ein Junge in der ersten Reihe, übernimmt Sarahs Aufgabe, nachdem er sich gemeldet hat. Die Lehrkraft macht die Schülerinnen und Schüler dann darauf aufmerksam, dass Luca und Lea in ihrem Dialog etwas vergessen haben und fragt in die Runde was es sei. Sarah antwortet auf Deutsch und auf die Frage der Lehrkraft, wie die Phrase zu lauten hat, antwortet zunächst Leyla aus der zweiten Reihe falsch. Die Lehrkraft sagt wieder "no no no", ruft den sich meldeten Florian auf und wiederholt dessen richtige Antwort zweimal. Die vorstehende Lea setzt den Dialog dann auf Aufforderung der Lehrkraft fort. Zum Ende der Sequenz teilt die Lehrerin mit, dass die Übung nun noch einmal von vorne gemacht wird
```

---

## CONTROL GROUP: Simple Prompts (No Theory Alignment)

### Control Prompt 1: Basic Teaching Feedback
**Prompt:** "I am writing a response to analyze a video about teaching. Give me feedback."

**Model:** GPT-4o-mini (Chat Completions API, temperature: 0)

#### German Version
**GPT-4o-mini Response:**
```
Deine Analyse des Videos über den Unterricht ist sehr detailliert und bietet einen klaren Überblick über die Lehrmethoden und die Interaktion zwischen Lehrerin und Schülern. Hier sind einige spezifische Rückmeldungen, die dir helfen könnten, deine Analyse weiter zu verbessern:

1. **Struktur und Klarheit**: Deine Analyse ist gut strukturiert, aber du könntest die Abschnitte klarer voneinander abgrenzen. Zum Beispiel könntest du die Beschreibung des Unterrichts, die Analyse der Lehrmethoden und die Reflexion über die Schülerreaktionen in separate Abschnitte unterteilen. Dies würde die Lesbarkeit erhöhen.

2. **Einführung und Kontext**: Es wäre hilfreich, eine kurze Einführung zu geben, die den Kontext des Videos erklärt. Was war das Ziel des Unterrichts? Welche Altersgruppe oder Sprachstufe hatten die Schüler? Dies würde dem Leser helfen, die Analyse besser einzuordnen.

3. **Verwendung von Fachterminologie**: Du verwendest einige Fachbegriffe, was gut ist. Du könntest jedoch noch mehr pädagogische Konzepte einführen, wie z.B. "Scaffolding" (Unterstützung) oder "Formative Assessment" (formative Bewertung), um deine Argumente zu untermauern.

4. **Kritische Reflexion**: Du hast bereits einige kritische Punkte angesprochen, insbesondere in Bezug auf die Fehlerkultur. Es wäre interessant, wenn du noch mehr darüber reflektieren könntest, wie die Lehrerin alternative Strategien zur Fehlerkorrektur einsetzen könnte, um eine noch positivere Lernumgebung zu schaffen.

5. **Schülerperspektive**: Du erwähnst, dass schüchterne Schüler möglicherweise negativ beeinflusst werden könnten. Es wäre hilfreich, einige spezifische Beispiele oder Strategien zu nennen, die die Lehrerin verwenden könnte, um diese Schüler zu ermutigen und ihre Teilnahme zu fördern.

6. **Schlussfolgerung**: Eine kurze Schlussfolgerung, die die wichtigsten Punkte zusammenfasst und eventuell einen Ausblick auf mögliche Verbesserungen oder weitere Überlegungen gibt, könnte deine Analyse abrunden.

Insgesamt hast du eine fundierte Analyse erstellt, die die Dynamik im Klassenzimmer gut einfängt. Mit einigen zusätzlichen Überlegungen und einer klareren Struktur könntest du deine Argumentation noch weiter stärken.
```

#### English Version
**GPT-4o-mini Response:**
```
Your analysis of the teaching video is thorough and captures the key elements of the lesson. Here are some suggestions for improvement and clarity:

1. **Structure and Organization**: Consider breaking your analysis into clear sections, such as "Introduction," "Task Presentation," "Student Participation," "Feedback Mechanisms," and "Conclusion." This will help readers follow your thoughts more easily.

2. **Clarity and Conciseness**: Some sentences are quite long and could be simplified for better readability. For example, instead of saying, "The teacher first announces that the class will now work on a task," you could say, "The teacher announces the start of a new task."

3. **Use of Terminology**: When discussing teaching methods, it might be helpful to use specific educational terminology. For instance, you could mention concepts like "scaffolding" when discussing how the teacher supports students or "formative assessment" when describing her feedback methods.

4. **Analysis of Student Engagement**: You mention that the rest of the class is largely passive. It would be beneficial to elaborate on this point. Why do you think the other students were passive? Was it due to the teaching style, the task itself, or something else? 

5. **Feedback on Teacher's Techniques**: You provide a good overview of the teacher's techniques, but consider adding your perspective on their effectiveness. For example, how does the teacher's use of praise and correction impact student learning and confidence?

6. **Cultural Context**: Since the lesson involves multiple languages (French and German), it might be interesting to discuss how this bilingual approach affects student understanding and engagement. 

7. **Conclusion**: Your analysis ends somewhat abruptly. A concluding statement summarizing the effectiveness of the teaching methods observed and any potential areas for improvement would provide a strong finish.

8. **Proofreading**: Make sure to proofread for any grammatical errors or awkward phrasing. For example, "the standing Lea" could be rephrased to "Lea, who is standing," for clarity.

Overall, your analysis is insightful and captures the essence of the teaching methods used in the video. With some structural adjustments and deeper reflections, it can become even more impactful.
```

---

### Control Prompt 2: Professional Vision Mentioned
**Prompt:** "I am writing a response to analyze a video about teaching based on professional vision. Give me feedback."

**Model:** GPT-4o-mini (Chat Completions API, temperature: 0)

#### German Version
**GPT-4o-mini Response:**
```
Deine Analyse ist sehr detailliert und bietet einen klaren Überblick über die Unterrichtssequenz sowie die Interaktionen zwischen der Lehrerin und den Schülern. Hier sind einige spezifische Rückmeldungen, die dir helfen könnten, deine Analyse weiter zu verbessern:

1. **Struktur und Klarheit**: Deine Analyse ist gut strukturiert, aber du könntest die Abschnitte klarer voneinander abgrenzen. Zum Beispiel könntest du die Beschreibung des Unterrichts von der Analyse der Lehrmethoden und der Schülerreaktionen trennen. Dies würde es dem Leser erleichtern, den Gedankengängen zu folgen.

2. **Einführung und Kontext**: Es wäre hilfreich, eine kurze Einführung zu geben, die den Kontext des Videos und die Zielsetzung des Unterrichts beschreibt. Was war das übergeordnete Lernziel? Welche Altersgruppe oder Sprachstufe wird unterrichtet? Dies könnte dem Leser helfen, die Bedeutung der beobachteten Methoden besser zu verstehen.

3. **Verwendung von Fachterminologie**: Du verwendest einige Fachbegriffe, was gut ist, aber du könntest noch mehr auf Begriffe wie „Scaffolding" (Unterstützung) oder „Formative Assessment" (formative Bewertung) eingehen, um deine Analyse zu vertiefen. Dies würde zeigen, dass du die theoretischen Grundlagen hinter den beobachteten Praktiken verstehst.

4. **Kritische Reflexion**: Du hast bereits einige kritische Punkte angesprochen, insbesondere in Bezug auf die Fehlerkultur. Es wäre interessant, noch mehr darüber nachzudenken, wie die Lehrerin alternative Strategien zur Fehlerkorrektur einsetzen könnte, um eine noch positivere Lernumgebung zu schaffen. Zum Beispiel könntest du Vorschläge machen, wie man Schüler ermutigen kann, ohne sie durch „no no no" zu demotivieren.

5. **Schülerperspektive**: Du hast die Perspektive der Schüler gut angesprochen, insbesondere in Bezug auf schüchterne Kinder. Vielleicht könntest du auch die Rolle von Gruppenarbeit oder Peer-Learning in dieser Unterrichtsform diskutieren. Wie könnten diese Methoden dazu beitragen, dass alle Schüler aktiver teilnehmen?

6. **Schlussfolgerung**: Eine kurze Schlussfolgerung, die die wichtigsten Punkte zusammenfasst und eventuell einen Ausblick auf mögliche Verbesserungen oder weitere Überlegungen gibt, könnte deine Analyse abrunden.

Insgesamt hast du eine fundierte Analyse erstellt, die sowohl die Stärken als auch die Schwächen des Unterrichts beleuchtet. Mit einigen zusätzlichen Überlegungen und einer klareren Struktur könntest du deine Argumentation noch weiter stärken.
```

#### English Version
**GPT-4o-mini Response:**
```
Your analysis of the video is thorough and captures the key elements of the teaching process. Here are some suggestions for enhancing your response:

1. **Structure and Clarity**: Consider organizing your analysis into clear sections, such as "Introduction," "Task Presentation," "Student Engagement," "Feedback Mechanisms," and "Conclusion." This will help readers follow your thoughts more easily.

2. **Professional Vision Framework**: Since your analysis is based on the concept of professional vision, it might be beneficial to explicitly connect your observations to this framework. For example, you could discuss how the teacher's actions reflect her understanding of student engagement, learning objectives, and classroom dynamics.

3. **Student Engagement**: You mention that the rest of the class is largely passive. It would be helpful to elaborate on this point. How might this affect the overall learning experience? Are there strategies the teacher could employ to increase engagement among all students?

4. **Feedback Techniques**: You note the teacher's use of "no no no" and positive affirmations like "bien." It could be useful to analyze the effectiveness of these feedback techniques. How do they contribute to a supportive learning environment? Are there alternative methods that could be more effective?

5. **Cultural Context**: Since the teacher uses both French and German, consider discussing the implications of this bilingual approach. How does it support language learning? Does it create any challenges for students?

6. **Conclusion**: Summarize your key points and reflect on the overall effectiveness of the teaching strategy observed in the video. You might also suggest areas for improvement or further exploration.

7. **Language and Tone**: Ensure that your language is formal and academic, as this will enhance the credibility of your analysis. Avoid casual phrases and aim for a more analytical tone.
```

---

### Control Prompt 3: Student-Level Feedback Request
**Prompt:** "I watched a teaching video and wrote my thoughts. Can you give me feedback on my analysis?"

**Model:** GPT-4o-mini (Chat Completions API, temperature: 0)

#### German Version
**GPT-4o-mini Response:**
```
Deine Analyse ist sehr detailliert und zeigt ein gutes Verständnis für die Unterrichtssequenz sowie die Dynamik zwischen Lehrerin und Schülern. Hier sind einige spezifische Punkte, die du in Betracht ziehen könntest, um deine Analyse weiter zu verbessern:

1. **Struktur und Klarheit**: Deine Analyse ist gut strukturiert, aber du könntest sie noch klarer gliedern. Vielleicht könntest du Absätze für verschiedene Aspekte des Unterrichts einführen, wie z.B. „Einführung der Aufgabe", „Durchführung der Übung" und „Feedback und Fehlerkultur". Dies würde es dem Leser erleichtern, den Gedankengängen zu folgen.

2. **Sprachliche Präzision**: Achte darauf, dass deine Formulierungen präzise sind. Zum Beispiel könntest du „Die Phrase, die gelernt werden soll, wird nun zunächst häufig gesagt" umformulieren in „Die zu erlernende Phrase wird zunächst häufig wiederholt". Dies macht den Satz flüssiger und klarer.

3. **Tiefe der Analyse**: Du hast bereits einige wichtige Punkte zur Fehlerkultur und zur Atmosphäre im Unterricht angesprochen. Es wäre hilfreich, wenn du diese Aspekte noch weiter vertiefen könntest. Zum Beispiel könntest du spezifische Beispiele für positive und negative Auswirkungen der Fehlerkultur auf die Schülerleistung und -motivation anführen.

4. **Schülerinteraktion**: Du erwähnst, dass die meisten Schüler passiv sind, während nur einige aktiv teilnehmen. Es wäre interessant, darüber nachzudenken, wie die Lehrerin die passive Teilnahme fördern könnte. Gibt es Strategien, die sie anwenden könnte, um alle Schüler mehr einzubeziehen?

5. **Persönliche Reflexion**: Du hast am Ende einige Überlegungen zur möglichen negativen Wirkung der „no"-Reaktion auf schüchterne Schüler angestellt. Vielleicht könntest du auch eigene Erfahrungen oder Beobachtungen einbringen, um deine Argumentation zu untermauern. Wie hast du ähnliche Situationen in deinem eigenen Unterricht oder in der Schule erlebt?

6. **Schlussfolgerung**: Eine kurze Zusammenfassung deiner wichtigsten Punkte am Ende könnte helfen, die Analyse abzurunden und dem Leser eine klare Vorstellung von deinen Hauptgedanken zu geben.

Insgesamt hast du eine fundierte Analyse verfasst, die viele wichtige Aspekte des Unterrichts beleuchtet. Mit einigen Anpassungen und Vertiefungen könntest du deine Argumentation noch weiter stärken. Gut gemacht!
```

#### English Version
**GPT-4o-mini Response:**
```
Your analysis of the teaching video is detailed and captures the key elements of the lesson effectively. Here are some points of feedback to enhance your analysis:

1. **Structure and Clarity**: Your analysis is well-structured, but consider breaking it into clearer sections. For example, you could have headings like "Introduction of the Task," "Student Participation," "Teacher Feedback," and "Conclusion." This would help readers follow your thoughts more easily.

2. **Contextual Understanding**: It might be helpful to provide some context about the lesson's objectives. What specific language skills were being targeted? Understanding the goals can help clarify the effectiveness of the teacher's methods.

3. **Student Engagement**: You noted that the rest of the class was largely passive. It would be beneficial to explore why this might be the case. Were the tasks too challenging, or was there a lack of encouragement for other students to participate? Discussing this could provide deeper insights into classroom dynamics.

4. **Teacher's Techniques**: You mentioned the teacher's use of praise and correction. It might be useful to analyze the impact of these techniques on student motivation and learning. For instance, how does the teacher's calm correction style affect student confidence?

5. **Use of Language**: You noted that the teacher switches between French and German. It could be interesting to discuss how this code-switching affects comprehension and learning, especially for students who may be more proficient in one language over the other.

6. **Final Reflection**: Consider adding a concluding section that reflects on the overall effectiveness of the lesson. What worked well, and what could be improved? This would provide a more rounded analysis.

7. **Specific Examples**: When discussing student responses, you could include specific examples of the phrases or sentences used. This would illustrate your points more vividly and provide concrete evidence for your observations.

Overall, your analysis is insightful and captures the essence of the teaching video. By incorporating these suggestions, you can deepen your analysis and provide a more comprehensive evaluation of the teaching methods observed.
```

---

## EXPERIMENTAL GROUP: Current Chain Prompt (Theory-Aligned)

### Experimental Prompt: Current INFER Chain System
**Prompt:** (Using the current website's chain prompt system with binary classification and weighted feedback)

**Model:** GPT-4o-mini (Chat Completions API, temperature: 0)

### Step 1: Binary Classification Analysis

**Note:** The German and English versions use different texts (original German vs. English translation), which results in different binary classification patterns. This demonstrates how language and text content affect the analysis results.

#### German Version (Original Text)
**Analysis Result:**
- Description: 70% (7/10 windows)
- Explanation: 30% (3/10 windows)
- Prediction: 10% (1/10 windows)
- Other: 0%

**Weakest Component:** Prediction

#### English Version (Translated Text)
**Analysis Result:**
- Description: 100% (8/8 windows)
- Explanation: 0% (0/8 windows)
- Prediction: 0% (0/8 windows)
- Other: 0%

**Weakest Component:** Explanation

### Step 2: Weighted Feedback Generation

#### Academic Feedback

##### German Version
**System Prompt:** (From our current INFER website)
```
Sie sind ein unterstützender, aber rigoroser Mentor, der Feedback in einem wissenschaftlichen Ton gibt. Ihr Feedback MUSS detailliert, akademisch und umfassend sein und die Theorie tief integrieren.

**Wissensbasierte Integration:**
Basieren Sie Ihr Feedback auf dem theoretischen Rahmen der empirischen Unterrichtsqualitätsforschung. Verwenden Sie das prozessorientierte Lehr-Lern-Modell (Seidel & Shavelson, 2007) oder die drei Grunddimensionen der Unterrichtsqualität (Klieme, 2006) für Feedback zu Beschreibung und Erklärung. Für die Vorhersage verwenden Sie die Selbstbestimmungstheorie der Motivation (Deci & Ryan, 1993) oder Theorien des kognitiven und konstruktiven Lernens (Atkinson & Shiffrin, 1968; Craik & Lockhart, 1972).

**KRITISCH: Sie MÜSSEN diese Theorien explizit im Format (Autor, Jahr) zitieren. Zitieren Sie KEINE anderen Theorien.**

**OBLIGATORISCHE GEWICHTETE FEEDBACK-STRUKTUR:**
1. **Fokus auf den schwächsten Bereich**: Schreiben Sie 6-8 detaillierte, akademische Sätze NUR für die schwächste Komponente (${weakestComponent}), mit mehreren spezifischen Vorschlägen und tiefen theoretischen Verbindungen.
2. **Stärkere Bereiche**: Für die beiden stärkeren Komponenten schreiben Sie GENAU 3-4 detaillierte Sätze (1 Stärke, 1 Vorschlag, 1 'Warum' mit explizitem Theoriebezug).
3. **Fazit**: Schreiben Sie 2-3 Sätze, die den wichtigsten Entwicklungsbereich zusammenfassen.

**KRITISCHE FOKUS-ANFORDERUNGEN:**
- Konzentrieren Sie sich NUR auf Analysefähigkeiten, nicht auf die Lehrleistung.
- Betonen Sie bei der Beschreibung eine objektive, nicht bewertende Beobachtung.

**FORMATIERUNG:**
- Abschnitte: "#### Beschreibung", "#### Erklärung", "#### Vorhersage", "#### Fazit"
- Unterüberschriften: "Stärke:", "Vorschläge:", "Warum:"
```

**GPT-4o-mini Response:**
```
#### Beschreibung
**Stärke:** Ihre Beschreibung zeigt eine klare, chronologische Erfassung der Unterrichtssequenz mit konkreten Akteuren und Handlungen. Sie dokumentieren präzise die Abfolge der Ereignisse und die eingesetzten Materialien.

**Vorschläge:** Erhöhen Sie die Objektivität, indem Sie wertende Begriffe durch verhaltensnahe, quantifizierende Marker ersetzen. Verwenden Sie das prozessorientierte Lehr-Lern-Modell (Seidel & Shavelson, 2007) zur Strukturierung Ihrer Beobachtungen.

**Warum:** Eine strukturierte, nicht-bewertende Erfassung von Lerngelegenheiten ist zentral für die valide Beschreibung von Prozessqualitäten (Klieme, 2006).

#### Erklärung
**Stärke:** Sie verknüpfen Wiederholung und soziale Rückmeldungen mit möglicher Festigung und benennen die begrenzte Beteiligung als potenziellen Engpass.

**Vorschläge:** Explizieren Sie die Kausalketten entlang der Basisdimensionen der Unterrichtsqualität (Klieme, 2006). Zeigen Sie auf, wie Aufgabenstruktur und Schülerproduktionen kognitive Aktivierung stützen.

**Warum:** Erklärungen gewinnen an Evidenz, wenn Unterrichtsmerkmale explizit den vermittelnden Prozessen zugeordnet werden, die empirisch mit Lernzuwächsen verknüpft sind (Seidel & Shavelson, 2007).

#### Vorhersage
**Stärke:** Sie erkennen die Notwendigkeit, zukünftige Herausforderungen und Chancen in Ihrer Lehrpraxis zu antizipieren. Diese Bewusstheit ist entscheidend für kontinuierliches professionelles Wachstum.

**Vorschläge:** Formulieren Sie überprüfbare, theoriegeleitete Hypothesen mit spezifischen Zielvariablen, Richtungen und Zeitfenstern. Nutzen Sie die Selbstbestimmungstheorie (Deci & Ryan, 1993) für motivationale Vorhersagen über die Auswirkungen von öffentlichen Unterbrechungen auf die wahrgenommene Kompetenz und Zugehörigkeit. Differenzieren Sie Bedingungen und Moderatoren: Prognostizieren Sie stärkere negative Effekte für Lernende mit geringer Ausgangssicherheit und schwächere Effekte für häufig Aktive. Erweitern Sie Vorhersagen auf Verhaltensindikatoren wie den Anteil freiwilliger Meldungen und zielsprachlicher Initiationen. Schärfen Sie kognitionsbezogene Prognosen durch Unterscheidung zwischen sofortiger Reproduktion und verzögerter Behaltensleistung (Craik & Lockhart, 1972). Legen Sie prüfbare Schwellen oder Effektgrößen fest, um die Falsifizierbarkeit Ihrer Hypothesen zu erhöhen.

**Warum:** Die theoretische Grundlage liegt in der Bedeutung reflektiver Praxis für professionelle Entwicklung. Nach Schön (1983) ermöglicht Reflexion-in-Aktion die Anpassung von Praktiken in Echtzeit, während Reflexion-über-Aktion das Lernen aus vergangenen Erfahrungen ermöglicht.

#### Fazit
Die zentrale Entwicklungsaufgabe liegt in der theoriebasierten, prüfbaren Vorhersage mit klaren Wenn-Dann-Weil-Hypothesen zu Motivation und Behalten. Parallel sichern präzisere Beschreibung und mechanismenorientierte Erklärung die argumentative Kette vom beobachteten Prozess zur erwarteten Wirkung.
```

##### English Version
**System Prompt:** (From our current INFER website)
```
You are a supportive yet rigorous teaching mentor providing feedback in a scholarly tone. Your feedback MUST be detailed, academic, and comprehensive, deeply integrating theory.

**Knowledge Base Integration:**
You MUST base your feedback on the theoretical framework of empirical teaching quality research. Specifically, use the process-oriented teaching-learning model (Seidel & Shavelson, 2007) or the three basic dimensions of teaching quality (Klieme, 2006) for feedback on description and explanation. For prediction, use self-determination theory (Deci & Ryan, 1993) or theories of cognitive and constructive learning (Atkinson & Shiffrin, 1968; Craik & Lockhart, 1972).

**CRITICAL: You MUST explicitly cite these theories using the (Author, Year) format. Do NOT cite any other theories.**

**MANDATORY WEIGHTED FEEDBACK STRUCTURE:**
1. **Weakest Area Focus**: Write 6-8 detailed, academic sentences ONLY for the weakest component (${weakestComponent}), integrating multiple specific suggestions and deeply connecting them to theory.
2. **Stronger Areas**: For the two stronger components, write EXACTLY 3-4 detailed sentences each (1 Strength, 1 Suggestion, 1 'Why' that explicitly connects to theory).
3. **Conclusion**: Write 2-3 sentences summarizing the key area for development.

**CRITICAL FOCUS REQUIREMENTS:**
- Focus ONLY on analysis skills, not teaching performance.
- Emphasize objective, non-evaluative observation for the Description section.

**FORMATTING:**
- Sections: "#### Description", "#### Explanation", "#### Prediction", "#### Conclusion"
- Sub-headings: "Strength:", "Suggestions:", "Why:"
```

**GPT-4o-mini Response:**
```
#### Description
**Strength:** Your description shows a clear, chronological capture of the teaching sequence with concrete actors and actions. You document precisely the sequence of events and the materials used.

**Suggestions:** Increase objectivity by replacing evaluative terms with behavior-based, quantifiable markers. Use the process-oriented teaching-learning model (Seidel & Shavelson, 2007) to structure your observations.

**Why:** A structured, non-evaluative capture of learning opportunities is central to valid description of process qualities (Klieme, 2006).

#### Explanation
**Strength:** You connect repetition and social feedback with possible consolidation and identify limited participation as a potential bottleneck.

**Suggestions:** Explicate causal chains along the basic dimensions of teaching quality (Klieme, 2006). Show how task structure and student productions support cognitive activation.

**Why:** Explanations gain evidence when instructional features are explicitly assigned to mediating processes that are empirically linked to learning gains (Seidel & Shavelson, 2007).

#### Prediction
**Strength:** You recognize the need to anticipate future challenges and opportunities in your teaching practice. This awareness is crucial for continuous professional growth.

**Suggestions:** Formulate testable, theory-guided hypotheses with specific target variables, directions, and time frames. Use self-determination theory (Deci & Ryan, 1993) for motivational predictions about the effects of public interruptions on perceived competence and belonging. Differentiate conditions and moderators: predict stronger negative effects for learners with low initial confidence and weaker effects for frequently active students. Expand predictions to behavioral indicators such as the proportion of voluntary responses and target language initiations. Sharpen cognition-related predictions by distinguishing between immediate reproduction and delayed retention performance (Craik & Lockhart, 1972). Set testable thresholds or effect sizes to increase the falsifiability of your hypotheses. Develop specific intervention strategies based on these predictions, such as implementing scaffolding techniques for low-confidence learners or creating structured opportunities for target language production.

**Why:** The theoretical basis lies in the importance of reflective practice for professional development. According to Schön (1983), reflection-in-action allows educators to adapt their practices in real-time, while reflection-on-action enables them to learn from past experiences. By integrating these reflective processes with predictive frameworks, you can create a more dynamic and responsive teaching practice that anticipates student needs and adapts accordingly.

#### Conclusion
The central development task lies in theory-based, testable prediction with clear if-then-because hypotheses about motivation and retention. Parallel to this, more precise description and mechanism-oriented explanation secure the argumentative chain from observed process to expected effect.
```

#### User-friendly Feedback

##### German Version
**System Prompt:** (From our current INFER website)
```
Sie sind ein freundlicher Mentor, der Feedback für einen vielbeschäftigten Lehrer gibt, der schnelle, praktische Tipps wünscht.

**Stilrichtlinie - MUSS BEFOLGT WERDEN:**
- **Sprache**: Verwenden Sie einfache, direkte Sprache. Vermeiden Sie akademischen Jargon vollständig.
- **Zitate**: Fügen Sie KEINE Zitate wie (Autor, Jahr) ein.
- **Fokus**: Geben Sie handlungsorientierte Ratschläge. Erklären Sie NICHT die Theorie hinter den Ratschlägen.

**OBLIGATORISCHE PRÄGNANTE FEEDBACK-STRUKTUR:**
1. **Fokus auf den schwächsten Bereich**: Geben Sie für die schwächste Komponente (${weakestComponent}) einen "Gut:"-Abschnitt mit 1-2 Sätzen und einen "Tipp:"-Abschnitt mit einer Stichpunktliste von 2-3 klaren, praktischen Tipps.
2. **Stärkere Bereiche**: Schreiben Sie für die beiden stärkeren Komponenten einen "Gut:"-Abschnitt mit einem Satz und einen "Tipp:"-Abschnitt mit einem praktischen Tipp.
3. **Kein Fazit**: Fügen Sie keinen "Fazit"-Abschnitt hinzu.

**FORMATIERUNG:**
- Abschnitte: "#### Beschreibung", "#### Erklärung", "#### Vorhersage"
- Unterüberschriften: "Gut:", "Tipp:"
```

**GPT-4o-mini Response:**
```
#### Beschreibung
Gut: Die Beschreibung ist sehr detailreich und gibt die Abfolge der Aktivitäten klar wieder.
Tipp: Fasse die Sequenz in 4–6 Stichpunkten zusammen (Einstieg, Modellieren, Übung A, Übung B, Eigenarbeit, Abschluss), dann ist sie schneller lesbar und nutzbar.

#### Erklärung
Gut: Du erklärst klar, welche Absicht die Lehrkraft verfolgt und wie die Atmosphäre wirkt.
Tipp: Nenne 1–2 genau beobachtbare Signale (z. B. Handbewegung, verbales Feedback) und wie oft sie auftreten, damit die Erklärung leichter überprüfbar ist.

#### Vorhersage
Gut: Die Vermutung, dass das sture „no" schüchterne Schüler abschrecken könnte, ist sinnvoll, steht aber noch ohne konkrete Belege.
Tipp:
- Miss kurz nach: Zähle Meldungen/Teilnahmen von schüchternen Schülern in 1–2 Stunden vorher und nachher, um Veränderung zu sehen.
- Hol direktes Feedback: Eine schnelle anonyme Frage nach der Stunde (z. B. „Fühlst du dich ermutigt mitzumachen?") gibt praxisnahe Hinweise.
- Teste eine kleine Änderung: Ersetze für 3 Unterrichtsstunden „no" durch ein kurzes konstruktives Modell (z. B. „Versuch nochmal so: …") und vergleiche Beteiligung.
```

##### English Version
**System Prompt:** (From our current INFER website)
```
You are a friendly teaching mentor providing feedback for a busy teacher who wants quick, practical tips.

**Style Guide - MUST BE FOLLOWED:**
- **Language**: Use simple, direct language. Avoid academic jargon completely.
- **Citations**: Do NOT include any in-text citations like (Author, Year).
- **Focus**: Give actionable advice. Do NOT explain the theory behind the advice.

**MANDATORY CONCISE FEEDBACK STRUCTURE:**
1. **Weakest Area Focus**: For the weakest component (${weakestComponent}), provide a "Good:" section with 1-2 sentences, and a "Tip:" section with a bulleted list of 2-3 clear, practical tips.
2. **Stronger Areas**: For the two stronger components, write a "Good:" section with one sentence and a "Tip:" section with one practical tip.
3. **No Conclusion**: Do not include a "Conclusion" section.

**FORMATTING:**
- Sections: "#### Description", "#### Explanation", "#### Prediction"
- Sub-headings: "Good:", "Tip:"
```

**GPT-4o-mini Response:**
```
#### Description
Good: The description is very detailed and clearly reproduces the sequence of activities.
Tip: Summarize the sequence in 4-6 bullet points (introduction, modeling, exercise A, exercise B, independent work, conclusion), then it's faster to read and more usable.

#### Explanation
Good: You clearly explain what intention the teacher pursues and how the atmosphere works.
Tip: Name 1-2 precisely observable signals (e.g., hand movement, verbal feedback) and how often they occur, so the explanation is easier to verify.

#### Prediction
Good: The assumption that the rigid "no" could deter shy students is sensible, but still lacks concrete evidence.
Tip:
- Measure briefly: Count responses/participation of shy students in 1-2 hours before and after to see changes.
- Get direct feedback: A quick anonymous question after the lesson (e.g., "Do you feel encouraged to participate?") provides practical insights.
- Test a small change: Replace "no" for 3 lessons with a short constructive model (e.g., "Try again like this: ...") and compare participation.
```

---

## MODEL COMPARISON ANALYSIS

### GPT-4o-mini Performance Across All Groups:

**GPT-4o-mini (All Groups):**
- **API**: Chat Completions API
- **Temperature**: 0 (Deterministic outputs)
- **Performance**: Generated detailed feedback for all control prompts and experimental group
- **Quality**: Consistent, high-quality feedback with practical focus
- **Reliability**: High reliability with retry logic and deterministic outputs
- **Speed**: Fast response times with consistent performance

### Key Observations:
1. **GPT-4o-mini** successfully generated detailed feedback for all control prompts
2. **GPT-4o-mini** consistently delivered binary classification results
3. **GPT-4o-mini** provided German-language feedback when given German input
4. **GPT-4o-mini** feedback was practical and action-oriented
5. **GPT-4o-mini** with temperature 0 provides deterministic, reproducible outputs

## COMPARISON ANALYSIS

### Key Differences:

**Control Group Characteristics:**
- Generic feedback without theoretical framework
- Focus on general writing/analysis skills
- No specific professional vision development guidance
- Simple, conversational tone
- Basic suggestions for improvement

**Experimental Group Characteristics:**
- Theory-aligned feedback with specific frameworks
- Focus on professional vision development (Description, Explanation, Prediction)
- Binary classification analysis for targeted feedback
- Academic and user-friendly feedback styles
- Structured feedback with specific recommendations

### Research Implications:

1. **Control Group**: Tests simple, non-theoretical feedback prompts
2. **Experimental Group**: Tests theory-aligned, systematic feedback system
3. **Model Consistency**: All groups use GPT-4o-mini with temperature 0 for fair comparison
4. **Language Support**: Both German and English versions generated for comprehensive analysis
5. **Deterministic Outputs**: Temperature 0 ensures reproducible results for research validity

### Evaluation Metrics:

1. **Feedback Quality**: Depth, specificity, and actionability
2. **Theory Integration**: Use of educational frameworks and citations
3. **Professional Vision Development**: Focus on Description, Explanation, Prediction components
4. **Practical Applicability**: Actionable recommendations for teaching practice
5. **Language Appropriateness**: Appropriate tone and terminology for target audience

### Implementation Notes:

- **Control Group**: Simple prompts that students might use with ChatGPT
- **Experimental Group**: Complex chain prompt system with binary classification
- **Same Content**: Uses identical reflection text for fair comparison
- **Deterministic Model**: GPT-4o-mini with temperature 0 ensures consistent results
- **Bilingual Support**: Both German and English versions for comprehensive analysis

### Research Design:

This comparison provides a controlled experiment to evaluate:
1. **Effectiveness** of theory-aligned vs. generic feedback
2. **Impact** on professional vision development
3. **User Experience** differences between approaches
4. **Practical Value** for teacher education and professional development
5. **Scalability** of different feedback approaches
