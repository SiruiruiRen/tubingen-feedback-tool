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

Das Lernen wird von der Lehrkraft hier als Prozess verstanden. Die Schülerinnen und Schüler, sollen durch ausprobieren und durch das Verbessern und Wiederholen der Lehrkraft und der Mitschüler, die Phrasen besser verinnerlichen. Die Lehrkraft reagiert zwar mit "no" auf Fehler, trotzdem herrscht eine gute Fehlerkultur, in der die Schülerinnen und Schüler sich trauen zu äußern. Die Atmosphäre und der Umgangston sind trotz der nicht immer konstruktiv gewählten Worte wertschätzen und respektvoll und die Schülerinnen und Schüler erhalten eine konstruktiv gemeinte Unterstützung. Die Schülerinnen und Schüler sind aufmerksam, obwohl der Fokus stark auf zwei Personen liegt, wahrscheinlich vor allem weil die Übung abwechslungsreich scheint im Vergleich zu normalem Frontalunterricht.

Die meisten Schülerinnen und Schüler werden von der wiederholenden Herangehensweise profitieren, da sich so der Stoff besser festigen kann. Ob sich diejenigen die mit "no" ´abgefertigt´ wurden letztlich negativ beeinflusst sehen in ihrer Beziehung zur Lehrkraft und ihrer Motivation zum Fach, hängt von der Persönlichkeit der Schülerinnen und Schüler ab. Gerade schüchternere Kinder könnten sich durch diese augenscheinlich ungewollt rüde Art beeindrucken lassen und sich nicht mehr so viel (zu-)trauen.
```

---

## CONTROL GROUP: Simple Prompts (No Theory Alignment)

### Control Prompt 1: Basic Teaching Feedback
**Prompt:** "I am writing a response to analyze a video about teaching. Give me feedback."

**Model:** GPT-4o-mini (Chat Completions API, temperature: 0)

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

### Control Prompt 2: Professional Vision Mentioned
**Prompt:** "I am writing a response to analyze a video about teaching based on professional vision. Give me feedback."

**Model:** GPT-4o-mini (Chat Completions API, temperature: 0)

**GPT-5-mini Response:**
```
[No response generated - model may have timed out or failed]
```

### Control Prompt 3: Student-Level Feedback Request
**Prompt:** "I watched a teaching video and wrote my thoughts. Can you give me feedback on my analysis?"

**Model:** GPT-4o-mini (Chat Completions API, temperature: 0)

**GPT-5-mini Response:**
```
Gern — das ist eine solide, aufmerksame Analyse. Unten habe ich Rückmeldung in drei Teilen: (1) Stärken deiner Analyse, (2) inhaltliche und methodische Hinweise zur Vertiefung, (3) konkrete sprachliche Korrekturen und ein Vorschlag für eine knappere, überarbeitete Fassung eines Abschnitts. Wenn du willst, überarbeite ich den ganzen Text anschließend.

1) Stärken
- Detaillierte, beobachtungsnahe Beschreibung: Du beschreibst genaue Handlungen (Wer? Was? Reihenfolge?), die Materialien (einlaminierte Gegenstände) und typische Äußerungen der Lehrkraft („no no no", „bien", „jetzt seid ihr mal dran"). Das ist eine gute Basis für analytische Schlussfolgerungen.
- Gute Wahrnehmung der Interaktion: Du erwähnst Feedbacksignale (Mhm, bien), die Benutzung einer L1 (Deutsch) und L2 (Französisch), sowie die Rollenverteilung (zwei Schülende als Fokus, Rest eher passiv).
- Reflektierter Blick auf Fehlerkultur und affektive Seite: Du stellst nicht nur fest, dass Fehler markiert werden, sondern fragst auch nach möglichen Auswirkungen auf Motivation und schüchterne Schüler*innen.

2) Vorschläge zur inhaltlichen Vertiefung und Präzisierung
- Theoretischer Rahmen: Um Aussagen zu stützen, kannst du auf Konzepte verweisen, z. B. IRF/IRE-Struktur (initiation–response–feedback), Scaffolding (Vygotsky), Interaktionstheorie/Interaction Hypothesis (Long), Fehlerkorrekturtypen (recast vs. explicit correction), Krashens Affective Filter. Das macht deine Interpretationen belastbarer.
- Präzisiere Feedbacktypen: Du beschreibst „no no no" als Korrektur — das ist eine explizite, negative Korrektur (verbal deutliche Unterbrechung). „Bien" ist positives, kurzes Lob. Unterscheide zwischen Recast (implizite Reformulierung) und expliziter Korrektur; nenne außerdem „uptake" bzw. ob Schüler die Korrektur aufgenommen haben.
- Beteiligungsverteilung quantifizieren/konkretisieren: „Der Rest ist größtenteils passiv" ist plausibel — noch besser wäre eine kurze Angabe (z. B. 3 aktiv, 20 passiv) oder Zeit-/Sequenzbezug (wie lange liegt der Fokus auf zwei Personen?). Das untermauert die Aussage.
- Belege für Wirkungen: Wenn du Auswirkungen auf Motivation und Selbstvertrauen diskutierst, nenne evidenzbasierte Gründe oder beobachtbare Hinweise aus der Szene (z. B. Mimik, Zurückhaltung bei Meldungen, veränderte Meldereihenfolge). Sonst kennzeichne solche Meinungen deutlicher als Hypothesen.
- Vorschläge zur Praxis: Ergänze konkrete Alternativen für die Lehrkraft, z. B. mehr Paararbeit, erhöhte Wartezeit (wait time), random calling, positive Reformulierung statt nur „no no no", oder Peer-Feedback. Das macht deine Analyse auch handlungsorientiert.

3) Sprachliche/Kleine inhaltliche Korrekturen und ein überarbeiteter Abschnitt
Hinweise zu Formulierungen/Fehlern:
- „setzt ihm eine Baskenmütze auf auf" → doppelt „auf"; besser: „setzt ihm eine Baskenmütze auf".
- „endet ihr ein Tuch um" → vermutlich „bindet ihr ein Tuch um" oder „legt ihr ein Tuch um".
- „Leitung" → vermutlich „Leistung".
- Groß- und Kleinschreibung: „erste reihe" → „erste Reihe".
- „die mit no ´abgefertigt´ wurden" → etwas wertend/umgangssprachlich. Besser: „die mit ‚no' korrigiert wurden" oder „die kurz mit ‚no' abgewiesen wurden".
- Stil: Einige Wiederholungen (z. B. „wiederholen"/„noch einmal") kannst du straffen.

Überarbeiteter, knapper Absatz (als Beispiel — hier das Ende deiner Analyse sprachlich gefasst und präzisiert):

Die Lehrkraft versteht Lernen hier als einen prozesshaften Vorgang: Ausprobieren, korrigieren und wiederholen dienen dem Verinnerlichen der Phrasen. Fehler werden zwar offen markiert („no no no"), die Gesamtatmosphäre wirkt jedoch respektvoll; kurzes Lob („bien") und unterstützende Eingriffe sorgen für eine positive Lernumgebung. Die didaktische Methode ist stark lehrergesteuert und fokussiert zunächst auf zwei Schülerinnen und Schüler, was die übrigen Lernenden eher in eine passive Rolle bringt. Die wiederholende, drillartige Übungsform begünstigt die Festigung neuer Formeln, kann aber für schüchterne Kinder demotivierend wirken, wenn Korrekturen zu direkt oder wenig konstruktiv erfolgen. Empfehlenswert wären ergänzende Maßnahmen wie Partnerübungen, erhöhte Wartezeit und eine sanftere Fehlerkorrektur, um Partizipation und Selbstvertrauen breiter zu fördern.

Wenn du möchtest, kann ich:
- deinen ganzen Text stilistisch überarbeiten und sprachlich glätten,
- deine Beobachtungen in ein kurzes Analysemodell (z. B. IRF + Feedbacktypen + Empfehlungen) überführen,
- oder Quellen/Studien nennen, die deine Interpretationen stützen (z. B. über corrective feedback, affective filter, scaffolding).

Welche Unterstützung hättest du gern als nächstes?
```

---


---

## EXPERIMENTAL GROUP: Current Chain Prompt (Theory-Aligned)

### Experimental Prompt: Current INFER Chain System
**Prompt:** (Using the current website's chain prompt system with binary classification and weighted feedback)

**Model:** GPT-5 (Responses API, reasoning.effort: medium)

**Step 1: Binary Classification Analysis**
```
Analysis Result:
- Description: 70% (7/10 windows)
- Explanation: 40% (4/10 windows) 
- Prediction: 20% (2/10 windows)
- Other: 0%

Weakest Component: Prediction
```

**Step 2: Weighted Feedback Generation**

#### Academic English Feedback
**System Prompt:** (From our current INFER website)
```
You are a supportive yet rigorous teaching mentor providing feedback in a scholarly tone. Your feedback MUST be detailed, academic, and comprehensive, deeply integrating theory.

**Knowledge Base Integration:**
You MUST base your feedback on the theoretical framework of empirical teaching quality research. Specifically, use the process-oriented teaching-learning model (Seidel & Shavelson, 2007) or the three basic dimensions of teaching quality (Klieme, 2006) for feedback on description and explanation. For prediction, use self-determination theory (Deci & Ryan, 1993) or theories of cognitive and constructive learning (Atkinson & Shiffrin, 1968; Craik & Lockhart, 1972).

**CRITICAL: You MUST explicitly cite these theories using the (Author, Year) format. Do NOT cite any other theories.**

**MANDATORY WEIGHTED FEEDBACK STRUCTURE:**
1. **Weakest Area Focus**: Write 6-8 detailed, academic sentences ONLY for the weakest component (Explanation), integrating multiple specific suggestions and deeply connecting them to theory.
2. **Stronger Areas**: For the two stronger components, write EXACTLY 3-4 detailed sentences each (1 Strength, 1 Suggestion, 1 'Why' that explicitly connects to theory).
3. **Conclusion**: Write 2-3 sentences summarizing the key area for development.

**FORMATTING:**
- Sections: "#### Description", "#### Explanation", "#### Prediction", "#### Conclusion"
- Sub-headings: "Strength:", "Suggestions:", "Why:"
```

**User Message:**
```
Based on the analysis showing 70% description, 40% explanation, 20% prediction (Professional Vision: 130%) + Other: 0% = 100%, provide feedback for this reflection:

[Example text here]
```

**GPT-5 Response:**
```
#### Description
Strength: You provide a precise chronological account with concrete actors, verbatim quotations ("bien", "no no no"), language switches (FR/DE), and clear turn-taking, which yields a rich event trace for subsequent analysis. 
Suggestions: To strengthen objectivity, replace evaluative terms ("gute Fehlerkultur," "aufmerksam," "abwechslungsreich") with low-inference indicators such as time stamps, frequencies (e.g., teacher vs. student utterances; counts of "no no no"; number of student responses per individual), participation distribution (named vs. unnamed speakers), and duration estimates of whole-class passivity or activity; avoid causal claims (e.g., why students were attentive) unless supported by data. 
Why: The process-oriented model requires a clean separation between observed processes and inferred outcomes to support valid causal reasoning (Seidel & Shavelson, 2007), and mapping to the three basic dimensions depends on specific, observable indicators of supportive climate, classroom management, and cognitive activation (Klieme, 2006). 

#### Explanation
Strength: You begin to connect features (repetition, brief praise, public correction) to learning processes and participation, tentatively considering how feedback might influence students' willingness to speak. 
Suggestions: Organize your account explicitly along Klieme's dimensions—supportive climate (tone and content of feedback), classroom management (distribution of opportunities to respond), and cognitive activation (depth of processing in the phrase practice)—and articulate mechanism-based links from the indicators you described to hypothesized learning or motivational consequences; also articulate plausible alternative explanations and the additional evidence that would adjudicate among them. 
Why: Explanations gain explanatory power when they specify how concrete process features instantiate the quality dimensions that predict learning (Klieme, 2006) and when they trace a coherent process–outcome chain from observed variables to learner states and performance (Seidel & Shavelson, 2007). 

#### Prediction
Translate your explanations into conditional, testable hypotheses that specify mechanisms, measures, and time frames: for example, predict that students who repeatedly articulate the target phrase within the lesson will outperform peers on an immediate exit ticket due to rehearsal benefits, but will not show proportionate gains on a 48-hour delayed test unless practice also involved semantic elaboration or varied retrieval contexts (Atkinson & Shiffrin, 1968; Craik & Lockhart, 1972). Derive differential predictions by participation profile: students who engaged in the role-play turns (e.g., Luca, Lea, Sarah, Florian) should exhibit higher cued recall and transfer to novel objects than largely passive peers because they underwent more retrieval and deeper processing operations, a claim you can test by disaggregating performance by speaker status (Craik & Lockhart, 1972). Formulate motivational predictions from self-determination theory: publicly controlling corrective moves (e.g., repeated "no no no") will depress perceived autonomy and competence and reduce spontaneous participation next lesson, whereas brief informational acknowledgment ("bien") will increase these needs and subsequent autonomous engagement (Deci & Ryan, 1993). Operationalize these predictions with concrete indicators—e.g., a brief need-satisfaction mini-scale post-lesson, counts of unprompted hands raised in the subsequent session, and a task-choice measure between a French-related and a neutral activity to index autonomous motivation (Deci & Ryan, 1993). Specify mediation hypotheses linking motivation and cognition, such as: informational feedback raises perceived competence, which increases willingness to attempt self-initiated retrieval, thereby deepening processing and improving delayed retention (Deci & Ryan, 1993; Craik & Lockhart, 1972). State boundary conditions: if practice remains largely verbatim and teacher-led, expect strong immediate gains but weak far transfer; if students generate their own examples and connect phrases to meaningful contexts, expect deeper encoding and better delayed performance (Atkinson & Shiffrin, 1968; Craik & Lockhart, 1972). Make your predictions falsifiable by fixing effect directions and minimal detectable differences (e.g., ≥20% delayed-recall advantage for active vs. passive participants) and by preregistering how your observational codes (frequency of corrective vs. informational feedback) will map onto autonomy- and competence-related outcomes (Deci & Ryan, 1993). 

#### Conclusion
Your key development need is to convert interpretations into precise, theory-based, and falsifiable predictions with clear measures, time frames, and boundary conditions grounded in self-determination and cognitive processing accounts. Continue refining the description for low-inference objectivity and align explanations explicitly to Klieme's dimensions to support stronger, testable process–outcome claims.
```

#### User-friendly English Feedback
**System Prompt:** (From our current INFER website)
```
You are a friendly teaching mentor providing feedback for a busy teacher who wants quick, practical tips.

**Style Guide - MUST BE FOLLOWED:**
- **Language**: Use simple, direct language. Avoid academic jargon completely.
- **Citations**: Do NOT include any in-text citations like (Author, Year).
- **Focus**: Give actionable advice. Do NOT explain the theory behind the advice.

**MANDATORY CONCISE FEEDBACK STRUCTURE:**
1. **Weakest Area Focus**: For the weakest component (Explanation), provide a "Good:" section with 1-2 sentences, and a "Tip:" section with a bulleted list of 2-3 clear, practical tips.
2. **Stronger Areas**: For the two stronger components, write a "Good:" section with one sentence and a "Tip:" section with one practical tip.
3. **No Conclusion**: Do not include a "Conclusion" section.

**FORMATTING:**
- Sections: "#### Description", "#### Explanation", "#### Prediction"
- Sub-headings: "Good:", "Tip:"
```

**GPT-5-mini Response:**
```
#### Description
Good:
Die Beschreibung ist sehr detailreich und gibt die Abfolge der Aktivitäten klar wieder.
Tip:
Fasse die Sequenz in 4–6 Stichpunkten zusammen (Einstieg, Modellieren, Übung A, Übung B, Eigenarbeit, Abschluss), dann ist sie schneller lesbar und nutzbar.

#### Explanation
Good:
Du erklärst klar, welche Absicht die Lehrkraft verfolgt und wie die Atmosphäre wirkt.
Tip:
Nenne 1–2 genau beobachtbare Signale (z. B. Handbewegung, verbales Feedback) und wie oft sie auftreten, damit die Erklärung leichter überprüfbar ist.

#### Prediction
Good:
Die Vermutung, dass das sture „no" schüchterne Schüler abschrecken könnte, ist sinnvoll, steht aber noch ohne konkrete Belege.
Tip:
- Miss kurz nach: Zähle Meldungen/Teilnahmen von schüchternen Schülern in 1–2 Stunden vorher und nachher, um Veränderung zu sehen.
- Hol direktes Feedback: Eine schnelle anonyme Frage nach der Stunde (z. B. „Fühlst du dich ermutigt mitzumachen?") gibt praxisnahe Hinweise.
- Teste eine kleine Änderung: Ersetze für 3 Unterrichtsstunden „no" durch ein kurzes konstruktives Modell (z. B. „Versuch nochmal so: …") und vergleiche Beteiligung.
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
- Surface-level suggestions for improvement
- No systematic analysis of teaching components

**Experimental Group Characteristics:**
- Theory-aligned feedback based on professional vision framework
- Systematic component analysis (D, E, P)
- Targeted development suggestions for specific weaknesses
- Connection to pedagogical principles
- Structured approach to professional vision development

### Implications for Research Design:

1. **Control Group** tests whether simple, non-theoretical feedback can develop professional vision
2. **Experimental Group** tests whether theory-aligned, systematic feedback is more effective
3. **Multiple Control Versions** allow comparison of different levels of simplicity
4. **Same Content, Different Prompts** ensures fair comparison of feedback approaches

### Research Questions:
- Does theory-aligned feedback lead to better professional vision development?
- How much does prompt sophistication matter for feedback quality?
- What is the minimum level of theoretical guidance needed for effective feedback?
- How do students respond to different feedback styles?

---

## IMPLEMENTATION RECOMMENDATIONS

### For Control Group Setup:
1. **Random Assignment:** Randomly assign students to control vs experimental groups
2. **Multiple Control Versions:** Use different simple prompts to test various levels of simplicity
3. **Same Interface:** Keep the same website interface, only change the backend prompt
4. **Data Collection:** Track the same metrics for both groups (time spent, revisions, etc.)

### For Experimental Group:
1. **Current System:** Use the existing chain prompt with binary classification
2. **Consistent Application:** Apply the same prompt structure across all participants
3. **Data Tracking:** Continue collecting detailed interaction data

### For Comparison Analysis:
1. **Pre/Post Assessment:** Measure professional vision development before and after
2. **Qualitative Analysis:** Compare the quality and depth of student reflections
3. **Behavioral Metrics:** Analyze engagement patterns and revision behaviors
4. **Long-term Effects:** Track retention and application of professional vision skills

## IMPLEMENTATION NOTES

### To Generate Real GPT-4o Outputs:

1. **Control Group**: Use the simple prompts above with OpenAI API calls
2. **Experimental Group**: Use the actual chain prompt system from the website:
   - Step 1: Binary classification using the prompts in `app.js` (classifyDescription, classifyExplanation, classifyPrediction)
   - Step 2: Weighted feedback generation using `getFeedbackPrompt` function with analysis results

### Current Website Chain Process:
1. **Text Windowing**: Split reflection into 3-sentence non-overlapping windows
2. **Binary Classification**: Each window gets classified for D, E, P (0 or 1)
3. **Percentage Calculation**: Both raw (can exceed 100%) and priority-based (sums to 100%)
4. **Weakest Component Identification**: Find the component with lowest percentage
5. **Weighted Feedback**: Generate feedback focusing on weakest component with theory integration

### Research Design:
- **Control Group**: Simple, non-theoretical feedback prompts
- **Experimental Group**: Current sophisticated chain prompt system
- **Same Content**: Use identical reflection text for fair comparison
- **Same Model**: GPT-4o for both groups
- **Different Prompts**: Only the prompt structure differs

This framework provides a robust foundation for comparing simple, student-level prompts against sophisticated, theory-aligned feedback systems.
