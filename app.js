// Constants and configuration
// Determine API URL based on environment
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const CORS_PROXY_URL = isProduction 
    ? 'https://tubingen-feedback-cors-proxy.onrender.com'
    : 'http://localhost:3000';
const OPENAI_API_URL = `${CORS_PROXY_URL}/api/openai/v1/chat/completions`;
const model = 'gpt-4o';

// Supabase configuration
const SUPABASE_URL = 'https://immrkllzjvhdnzesmaat.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbXJrbGx6anZoZG56ZXNtYWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzk2MzgsImV4cCI6MjA2Mjc1NTYzOH0.glhn-u4mNpKHsH6qiwdecXyYOWhdxDrTVDIvNivKVf8';

// No need for API key in client code when using the proxy
// We'll set up the proxy to handle this securely

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const reviseReflectionBtn = document.getElementById('revise-reflection-btn');
    const reflectionText = document.getElementById('reflection-text');
    const feedback = document.getElementById('feedback');
    const nameInput = document.getElementById('student-name');
    const feedbackRating = document.getElementById('feedback-rating');
    const usefulnessRating = document.getElementById('usefulness-rating');
    const submitRatingBtn = document.getElementById('submit-rating-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const qualityRatingButtonsContainer = document.getElementById('quality-rating-buttons');
    const usefulnessRatingButtonsContainer = document.getElementById('usefulness-rating-buttons');
    const qualityRatingHoverLabel = document.getElementById('quality-rating-hover-label');
    const usefulnessRatingHoverLabel = document.getElementById('usefulness-rating-hover-label');
    
    // Language and style selections
    const langEn = document.getElementById('lang-en');
    const langDe = document.getElementById('lang-de');
    const styleSelector = document.getElementById('style');

    let currentQualityRating = null;
    let currentUsefulnessRating = null;

    const qualityLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    const usefulnessLabels = ['', 'Not useful', 'Slightly useful', 'Moderately useful', 'Very useful', 'Extremely useful'];

    // Event listeners
    generateBtn.addEventListener('click', generateFeedback);
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyFeedback);
    reviseReflectionBtn.addEventListener('click', handleReviseReflectionClick);
    submitRatingBtn.addEventListener('click', submitRating);

    // Initialize Supabase client
    const supabase = initSupabase();
    
    // Verify Supabase connection
    if (supabase) {
        verifySupabaseConnection(supabase);
    }

    // Function to get or create a session ID
    function getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('appSessionId');
        if (!sessionId) {
            sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
            sessionStorage.setItem('appSessionId', sessionId);
            console.log('New session ID generated:', sessionId);
        }
        return sessionId;
    }

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Function to create rating buttons
    function createRatingButtons(container, count, groupName) {
        container.innerHTML = ''; // Clear existing buttons
        const labels = groupName === 'quality' ? qualityLabels : usefulnessLabels;
        const hoverLabelElement = groupName === 'quality' ? qualityRatingHoverLabel : usefulnessRatingHoverLabel;

        for (let i = 1; i <= count; i++) {
            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('btn', 'btn-outline-secondary', 'btn-rating-star');
            button.innerHTML = '☆'; // Default to empty star
            button.dataset.value = i;
            button.addEventListener('click', function() {
                handleRatingButtonClick(this, groupName, labels[i]);
            });
            button.addEventListener('mouseover', function() {
                hoverLabelElement.textContent = labels[i];
                // Temporarily fill stars up to the hovered one
                const buttonsInGroup = container.querySelectorAll('.btn-rating-star');
                buttonsInGroup.forEach((btn, index) => {
                    btn.innerHTML = index < i ? '★' : '☆';
                    btn.classList.toggle('filled', index < i);
                });
            });
            button.addEventListener('mouseout', function() {
                const currentRating = groupName === 'quality' ? currentQualityRating : currentUsefulnessRating;
                if (currentRating !== null) {
                    hoverLabelElement.textContent = labels[currentRating];
                } else {
                    hoverLabelElement.textContent = '';
                }
                // Restore stars based on actual current rating
                const buttonsInGroup = container.querySelectorAll('.btn-rating-star');
                buttonsInGroup.forEach((btn, index) => {
                    const isFilled = currentRating !== null && index < currentRating;
                    btn.innerHTML = isFilled ? '★' : '☆';
                    btn.classList.toggle('filled', isFilled);
                });
            });
            container.appendChild(button);
        }
    }

    // Handle rating button click
    function handleRatingButtonClick(button, groupName, labelText) {
        const value = parseInt(button.dataset.value);
        const buttonsInGroup = button.parentElement.querySelectorAll('.btn-rating-star');
        const hoverLabelElement = groupName === 'quality' ? qualityRatingHoverLabel : usefulnessRatingHoverLabel;
        
        buttonsInGroup.forEach((btn, index) => {
            const isFilled = index < value;
            btn.innerHTML = isFilled ? '★' : '☆'; // Update star symbols
            btn.classList.toggle('filled', isFilled);
        });
        
        if (groupName === 'quality') {
            currentQualityRating = value;
        } else if (groupName === 'usefulness') {
            currentUsefulnessRating = value;
        }
        hoverLabelElement.textContent = labelText; // Keep selected label visible
    }

    // Initialize rating buttons
    createRatingButtons(qualityRatingButtonsContainer, 5, 'quality');
    createRatingButtons(usefulnessRatingButtonsContainer, 5, 'usefulness');

    // Feedback generation
    async function generateFeedback() {
        const studentName = nameInput.value.trim();
        if (!studentName) {
            showAlert('Please enter your name before generating feedback.', 'warning');
            nameInput.focus(); // Set focus to name input
            return;
        }

        if (!reflectionText.value.trim()) {
            showAlert('Please enter a reflection text first.', 'warning');
            reflectionText.focus(); // Set focus to reflection text area
            return;
        }

        // Determine language based on the radio button selection
        const language = langEn.checked ? 'en' : 'de';
        const style = styleSelector.value;
        const currentSessionId = getOrCreateSessionId(); // Get or create session ID
        
        // Show loading spinner
        toggleLoading(true);
        
        try {
            const generatedFeedbackText = await callOpenAI(reflectionText.value, language, style);
            console.log('Generated feedback:', generatedFeedbackText);
            
            const formattedResponse = formatFeedback(generatedFeedbackText);
            feedback.innerHTML = formattedResponse;

            // Always insert a new record
            console.log('Saving new reflection and feedback to database (always new record)...');
            const { data, error } = await supabase
                .from('reflections')
                .insert([
                    { 
                        student_name: studentName, 
                        reflection_text: reflectionText.value, 
                        feedback_text: generatedFeedbackText, 
                        language: language,
                        style: style,
                        session_id: currentSessionId, 
                        created_at: new Date().toISOString(),
                        // Ratings will be null by default on new insert, so no need to specify them here
                    }
                ])
                .select();

            if (error) {
                console.error('Error saving new reflection to Supabase:', error);
                throw new Error(`Failed to save new reflection: ${error.message}`);
            }
            
            console.log('Save response (new record):', data);
            let newRecordId = null;
            if (data && data.length > 0) {
                newRecordId = data[0].id.toString();
                // Store this ID specifically for potential rating of THIS feedback instance
                sessionStorage.setItem('lastGeneratedReflectionIdForRating', newRecordId);
                console.log('New reflection saved. ID for rating purposes:', newRecordId);
            }
            
            const alertMessage = 'Feedback generated and saved as a new entry!';
            
            sessionStorage.setItem('reflection', reflectionText.value); // Still useful for pre-fill if desired elsewhere
            sessionStorage.setItem('feedback', generatedFeedbackText); // Still useful for display
            sessionStorage.setItem('currentLanguage', language);
            sessionStorage.setItem('currentStyle', style);
            
            showAlert(alertMessage, 'success');
            
            // Show revise button if a reflection was successfully generated and stored
            if (sessionStorage.getItem('reflection')) {
                reviseReflectionBtn.style.display = 'inline-block'; 
            }

            // Reset UI for ratings, as this is new feedback
            currentQualityRating = null;
            currentUsefulnessRating = null;
            createRatingButtons(qualityRatingButtonsContainer, 5, 'quality');
            createRatingButtons(usefulnessRatingButtonsContainer, 5, 'usefulness');
            qualityRatingHoverLabel.textContent = '';
            usefulnessRatingHoverLabel.textContent = '';
            
        } catch (error) {
            console.error('Error in generateFeedback process:', error);
            showAlert(`Error: ${error.message}. Please check console for details.`, 'danger');
            feedback.innerHTML = '<p class="text-danger">Failed to generate or save feedback. Please try again or check the console.</p>';
            // Keep revise button hidden or hide it if it was an error on the very first try
            reviseReflectionBtn.style.display = 'none'; 
        } finally {
            toggleLoading(false);
        }
    }

    // Format feedback text with proper HTML
    function formatFeedback(text) {
        if (!text) return '';
        
        // Consolidate heading processing
        text = text.replace(/####\s+([^\n]+)/g, (match, p1) => `<h4 class="feedback-heading">${p1.trim()}</h4>`);
        
        // Format bold text (Strengths:, Suggestions for Improvement:, Why?:, etc.)
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Format list items starting with - or *
        // Ensure lists are only created if list items are present
        text = text.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
        
        // Wrap consecutive list items in ul tags more robustly
        text = text.replace(/(<li>.*?<\/li>\s*)+/g, (match) => `<ul>${match.trim()}</ul>`);
        
        // Add structure for sections. This is tricky with dynamic content.
        // Let's assume headings define sections. We want space *between* full sections.
        // Wrap content after h4 in a div, until the next h4 or end of string.
        let sections = text.split(/(?=<h4)/);
        text = sections.map(section => {
            if (section.startsWith('<h4')) {
                // Find the end of the h4 tag
                const h4EndIndex = section.indexOf('</h4>') + 5;
                const heading = section.substring(0, h4EndIndex);
                const content = section.substring(h4EndIndex);
                // Wrap content in a div for better styling and separation
                return `${heading}<div class="section-content">${content.trim()}</div>`;
            }
            return section; // Should not happen if split correctly
        }).join('');
        
        // Replace newlines with <br> INSIDE list items or general text, but not excessively.
        // Be careful not to add <br> inside <ul> or after <h4> directly.
        // This is complex; a simpler approach is often better.
        // The current CSS with `white-space: pre-wrap` for feedback might handle newlines well.
        // However, explicit <br> can be needed if `pre-wrap` isn't sufficient or for specific formatting.
        // For now, let's be more conservative with <br> replacement if CSS handles it.
        // The main issue is that Markdown newlines are not always HTML newlines.
        // Let's apply <br> more selectively.
        // The previous global replace was: text = text.replace(/\n/g, '<br>');
        // This might be too aggressive if CSS `white-space: pre-wrap` is used on the container.
        // If `pre-wrap` is active, we might only need <br> for explicit line breaks not part of Markdown's usual block formatting.
        // For now, I will keep the original global newline replacement as it was there before,
        // but it's an area for potential refinement if formatting issues arise.
        text = text.replace(/\n/g, '<br>');
        // Clean up potential empty <br> tags from multiple newlines or at start/end of blocks
        text = text.replace(/<br>\s*<br>/g, '<br>'); // Collapse multiple breaks
        text = text.replace(/^<br>|<br>$/g, ''); // Trim leading/trailing breaks
        
        return text;
    }

    // Call OpenAI API
    async function callOpenAI(reflection, language, style) {
        console.log(`Using language: ${language}, style: ${style}`);
        const promptType = `${style} ${language === 'en' ? 'English' : 'German'}`;
        const systemPrompt = getSystemPrompt(promptType);
        
        console.log('Calling OpenAI API with system prompt:', promptType);
        
        // Add explicit instruction about output language at beginning of prompt
        const languageInstruction = language === 'en' 
            ? "IMPORTANT: Regardless of the input language, you MUST respond in English. The entire feedback MUST be in English only."
            : "WICHTIG: Unabhängig von der Eingabesprache MUSS deine Antwort auf Deutsch sein. Das gesamte Feedback MUSS ausschließlich auf Deutsch sein.";
        
        const enhancedPrompt = languageInstruction + "\n\n" + systemPrompt;
        
        const requestData = {
            model: model,
            messages: [
                {
                    role: "system",
                    content: enhancedPrompt
                },
                {
                    role: "user",
                    content: reflection
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        };
        
        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('OpenAI API error:', errorData);
                throw new Error(errorData.error?.message || 'Error calling OpenAI API');
            }
            
            const result = await response.json();
            console.log('OpenAI API response:', result);
            
            // Verify language of response
            const responseContent = result.choices[0].message.content;
            const hasCorrectLanguage = verifyLanguage(responseContent, language);
            
            if (!hasCorrectLanguage) {
                console.warn('Language mismatch detected in response');
                const fixMessage = language === 'en'
                    ? "The AI generated response in the wrong language. Please try again."
                    : "Die KI hat eine Antwort in der falschen Sprache generiert. Bitte versuchen Sie es erneut.";
                showAlert(fixMessage, 'warning');
            }
            
            return responseContent;
        } catch (error) {
            console.error('Error in OpenAI API call:', error);
            throw error;
        }
    }
    
    // Helper function to verify language of response
    function verifyLanguage(text, expectedLanguage) {
        if (!text) return true;
        
        // Simple language detection based on common words
        const englishWords = ['the', 'and', 'your', 'you', 'for', 'that', 'with'];
        const germanWords = ['der', 'die', 'das', 'und', 'für', 'mit', 'ist'];
        
        const lowercaseText = text.toLowerCase();
        let englishMatches = 0;
        let germanMatches = 0;
        
        englishWords.forEach(word => {
            if (lowercaseText.includes(` ${word} `)) englishMatches++;
        });
        
        germanWords.forEach(word => {
            if (lowercaseText.includes(` ${word} `)) germanMatches++;
        });
        
        const seemsEnglish = englishMatches > germanMatches;
        return (expectedLanguage === 'en' && seemsEnglish) || (expectedLanguage === 'de' && !seemsEnglish);
    }

    // Get the appropriate system prompt based on style and language
    function getSystemPrompt(promptType) {
        const prompts = {
            'academic English': `I will analyze student teacher reflections on teaching videos. My task is to generate high-quality feedback as a supportive yet rigorous teaching mentor. The feedback must fulfill four quality dimensions:

1.  **Specificity**: Refer to particular statements and passages in the student's text (e.g., by quoting if possible), avoiding vague phrases.
2.  **Constructive suggestions**: Provide realistic, actionable suggestions for improvement (e.g., "To improve further, you could..."), not just critique.
3.  **Explanations/Justifications**: Ground feedback in educational psychology concepts or research (e.g., concepts like wait time, cognitive activation, scaffolding, feedback quality; or citing relevant authors if applicable from provided context) whenever possible to explain why suggestions matter.
4.  **Clarity**: Ensure your feedback uses clear, structured language appropriate for early-stage education students.

My target audience is student teachers developing their professional vision. "Analysis" means professional vision:
- **Description**: Accurately noting what happened.
- **Explanation**: Interpreting events using educational theory.
- **Prediction**: Forecasting effects on student learning.

FORMATTING REQUIREMENTS FOR YOUR RESPONSE:
Address the student directly (e.g., "Your analysis...").
The following four main sections MUST be included: "#### Description", "#### Explanation", "#### Prediction", and "#### Overall Assessment and Next Steps".

For EACH of these four main sections, you MUST structure your response using these exact labels:
1.  **Strength:** [Followed by 1-2 sentences of positive observations relevant to that main section.]
2.  **Suggestions:** - [Followed by 1-2 actionable bullet points (each 1-2 sentences) relevant to that main section.]
3.  **Why?:** [Followed by an explanation (1-2 sentences, or more if explaining multiple suggestions) linking the suggestion(s) to educational concepts or impact.]

Use clear headings for the main sections. Ensure well-structured English. Avoid emoticons/informal language.`,
            
            'user-friendly English': `I will analyze student teacher reflections on teaching videos. My task is to generate high-quality feedback as a supportive yet rigorous teaching mentor. The feedback must fulfill four quality dimensions:

1.  **Specificity**: Refer to particular statements and passages in the student's text (e.g., by quoting if possible), avoiding vague phrases. (For your output, be specific but very brief).
2.  **Constructive suggestions**: Provide realistic, actionable suggestions for improvement (e.g., "To improve further, you could..."), not just critique. (For your output, make suggestions practical and very brief).
3.  **Explanations/Justifications**: Ground feedback in educational psychology concepts or research (e.g., concepts like wait time, cognitive activation, scaffolding, feedback quality) whenever possible to explain why suggestions matter. (For your output, keep explanations very brief and simple).
4.  **Clarity**: Ensure your feedback to the student uses extremely clear, simple, and structured language appropriate for early-stage education students. This is key for the user-friendly style.

My target audience is student teachers developing their professional vision. "Analysis" means professional vision:
- **Description**: Accurately noting what happened.
- **Explanation**: Interpreting events using educational theory.
- **Prediction**: Forecasting effects on student learning.

USER-FRIENDLY OUTPUT FORMATTING REQUIREMENTS (VERY IMPORTANT: Your entire response to the student must be extremely brief and easy to understand):
Address the student directly (e.g., "Your reflection...").
For EACH section ("#### Description", "#### Explanation", "#### Prediction", "#### Overall Assessment and Next Steps"):
1.  **Good:** [One very short sentence about what was good.]
2.  **Tip:** - [One very short bullet point idea to improve.]
3.  **Why?:** [One very short sentence explaining why the tip helps.]
Use these exact headings. Respond only in English. Avoid emoticons and overly casual language. Ensure the language used in the feedback is exceptionally simple and direct for student teachers.`,

            'academic German': `Ich werde als unterstützender, aber dennoch kritischer Mentor Reflexionen von Lehramtsstudierenden zu Unterrichtsvideos analysieren. Meine Aufgabe ist es, qualitativ hochwertiges Feedback zu generieren, das vier Qualitätsdimensionen erfüllt:

1.  **Spezifität**: Ich beziehe mich auf konkrete Aussagen/Textpassagen (z.B. durch Zitate, wenn möglich), vermeide vage Formulierungen.
2.  **Konstruktive Vorschläge**: Ich gebe realistische, umsetzbare Verbesserungsvorschläge (z.B. "Um dies weiter zu verbessern, könnten Sie..."), nicht nur Kritik.
3.  **Erklärungen/Begründungen**: Ich begründe mein Feedback möglichst mit Konzepten oder Forschungsergebnissen der Pädagogischen Psychologie (z.B. Konzepten wie Wartezeit, kognitive Aktivierung, Scaffolding, Feedbackqualität; oder Nennung relevanter Autoren, falls zutreffend aus dem bereitgestellten Kontext), um die Bedeutung der Vorschläge zu erläutern.
4.  **Verständlichkeit**: Stellen Sie sicher, dass Ihr Feedback eine klare, strukturierte Sprache verwendet, die für Studierende in den ersten Studienjahren angemessen ist.

Meine Zielgruppe sind Lehramtsstudierende, die ihre professionelle Unterrichtswahrnehmung entwickeln. "Analyse" bedeutet professionelle Unterrichtswahrnehmung:
- **Beschreibung**: Genaues Beobachten des Geschehens.
- **Erklärung**: Interpretation von Ereignissen mittels pädagogischer Theorien.
- **Vorhersage**: Prognose der Auswirkungen auf das Lernen der Schüler:innen.

FORMATIERUNGSANFORDERUNGEN FÜR IHRE ANTWORT:
Sprechen Sie die Studierenden direkt an (z.B. "Ihre Analyse...").
Die folgenden vier Hauptabschnitte MÜSSEN enthalten sein: "#### Beschreibung", "#### Erklärung", "#### Vorhersage", und "#### Gesamtbewertung und nächste Schritte".

Für JEDEN dieser vier Hauptabschnitte MÜSSEN Sie Ihre Antwort unter Verwendung dieser genauen Bezeichnungen wie folgt strukturieren:
1.  **Stärke:** [Gefolgt von 1-2 Sätzen positiver Beobachtungen, die für diesen Hauptabschnitt relevant sind.]
2.  **Verbesserungsvorschläge:** - [Gefolgt von 1-2 umsetzbaren Stichpunkten (jeweils 1-2 Sätze), die für diesen Hauptabschnitt relevant sind.]
3.  **Warum?:** [Gefolgt von einer Erklärung (1-2 Sätze oder mehr, falls mehrere Vorschläge erklärt werden), die den/die Vorschlag/Vorschläge mit pädagogischen Konzepten oder Auswirkungen in Verbindung bringt.]

Verwenden Sie klare Überschriften für die Hauptabschnitte. Achten Sie auf gut strukturiertes Deutsch. Vermeiden Sie Emoticons/Umgangssprache.`,

            'user-friendly German': `Ich werde als unterstützender, aber dennoch kritischer Mentor Reflexionen von Lehramtsstudierenden zu Unterrichtsvideos analysieren. Meine Aufgabe ist es, qualitativ hochwertiges Feedback zu generieren, das vier Qualitätsdimensionen erfüllt:

1.  **Spezifität**: Ich beziehe mich auf konkrete Aussagen/Textpassagen (z.B. durch Zitate, wenn möglich), vermeide vage Formulierungen. (Für Ihre Antwort: Seien Sie spezifisch, aber sehr kurz.)
2.  **Konstruktive Vorschläge**: Ich gebe realistische, umsetzbare Verbesserungsvorschläge (z.B. "Um dies weiter zu verbessern, könnten Sie..."), nicht nur Kritik. (Für Ihre Antwort: Machen Sie praktische und sehr kurze Vorschläge.)
3.  **Erklärungen/Begründungen**: Ich begründe mein Feedback möglichst mit Konzepten oder Forschungsergebnissen der Pädagogischen Psychologie (z.B. Konzepten wie Wartezeit, kognitive Aktivierung, Scaffolding, Feedbackqualität), um die Bedeutung der Vorschläge zu erläutern. (Für Ihre Antwort: Halten Sie Erklärungen sehr kurz und einfach.)
4.  **Verständlichkeit**: Stellen Sie sicher, dass Ihr Feedback an die Studierenden eine extrem klare, einfache und strukturierte Sprache verwendet, die für Studierende in den ersten Studienjahren angemessen ist. Dies ist entscheidend für den nutzerfreundlichen Stil.

Meine Zielgruppe sind Lehramtsstudierende, die ihre professionelle Unterrichtswahrnehmung entwickeln. "Analyse" bedeutet professionelle Unterrichtswahrnehmung:
- **Beschreibung**: Genaues Beobachten des Geschehens.
- **Erklärung**: Interpretation von Ereignissen mittels pädagogischer Theorien.
- **Vorhersage**: Prognose der Auswirkungen auf das Lernen der Schüler:innen.

NUTZERFREUNDLICHE AUSGABEFORMATIERUNGSANFORDERUNGEN (SEHR WICHTIG: Ihre gesamte Antwort an die Studierenden muss extrem kurz und leicht verständlich sein):
Sprechen Sie die Studierenden direkt an (z.B. "Deine Reflexion...").
Für JEDEN Abschnitt ("#### Beschreibung", "#### Erklärung", "#### Vorhersage", "#### Gesamtbewertung und nächste Schritte"):
1.  **Gut:** [Ein sehr kurzer Satz, was gut war.]
2.  **Tipp:** - [Eine sehr kurze Stichpunkt-Idee zur Verbesserung.]
3.  **Warum?:** [Ein sehr kurzer Satz, der erklärt, warum der Tipp hilft.]
Nutzen Sie diese exakten Überschriften. Antworten Sie nur auf Deutsch. Vermeiden Sie Emoticons und zu lockere Sprache. Stellen Sie sicher, dass die im Feedback verwendete Sprache außergewöhnlich einfach und direkt für Lehramtsstudierende ist.`
        };
        
        return prompts[promptType] || prompts['user-friendly English'];
    }

    // Get the currently selected style
    function getSelectedStyle() {
        return styleSelector.value; // 'academic' or 'user-friendly'
    }

    // Clear text area
    function clearText() {
        reflectionText.value = '';
        feedback.innerHTML = '<p class="text-muted">Feedback will appear here after generation...</p>';
        sessionStorage.removeItem('lastGeneratedReflectionIdForRating'); // Clear this as well
        sessionStorage.removeItem('reflection');
        sessionStorage.removeItem('feedback');
        reviseReflectionBtn.style.display = 'none';
        currentQualityRating = null;
        currentUsefulnessRating = null;
        createRatingButtons(qualityRatingButtonsContainer, 5, 'quality');
        createRatingButtons(usefulnessRatingButtonsContainer, 5, 'usefulness');
        qualityRatingHoverLabel.textContent = '';
        usefulnessRatingHoverLabel.textContent = '';
    }

    // Copy feedback to clipboard
    function copyFeedback() {
        const textToCopy = feedback.innerText || feedback.textContent;
        navigator.clipboard.writeText(textToCopy)
            .then(() => showAlert('Feedback copied to clipboard!', 'success'))
            .catch(err => {
                console.error('Could not copy text: ', err);
                showAlert('Could not copy text. Please try again.', 'danger');
            });
    }

    // Submit rating for feedback
    async function submitRating() {
        const reflectionId = sessionStorage.getItem('lastGeneratedReflectionIdForRating'); // Use the correct ID for rating
        console.log('Rating for reflection ID:', reflectionId);
        
        if (!reflectionId) {
            showAlert('Please generate feedback first before rating.', 'warning');
             if (!generateBtn.disabled) {
                generateBtn.classList.add('btn-pulse');
                setTimeout(() => generateBtn.classList.remove('btn-pulse'), 2000);
            }
            return;
        }
        
        const feedbackRatingValue = currentQualityRating;
        const usefulnessRatingValue = currentUsefulnessRating;
        
        if (feedbackRatingValue === null || usefulnessRatingValue === null) {
            showAlert('Please select ratings for both quality and usefulness before submitting.', 'warning');
            return;
        }
        
        try {
            console.log('Submitting ratings:', { feedbackRatingValue, usefulnessRatingValue });
            
            const { data, error } = await supabase
                .from('reflections')
                .update({ 
                    feedback_rating: feedbackRatingValue,
                    usefulness_rating: usefulnessRatingValue,
                    rated_at: new Date().toISOString()
                })
                .eq('id', reflectionId)
                .select();

            if (error) throw error;
            
            console.log('Rating update response:', data);
            showAlert('Thank you for your feedback!', 'success');
            
        } catch (error) {
            console.error('Error submitting rating:', error);
            showAlert('Error submitting rating. Please try again.', 'danger');
        }
    }

    // Handle click for the Revise Reflection button
    function handleReviseReflectionClick() {
        const previousReflection = sessionStorage.getItem('reflection');
        if (previousReflection) {
            reflectionText.value = previousReflection;
            showAlert('Your previous reflection has been loaded. Edit it here and click \"Generate Feedback\" for new feedback. This will be saved as a new entry.', 'info');
        } else {
            showAlert('No previous reflection found in this session to load.', 'warning');
        }
        reflectionText.scrollIntoView({ behavior: 'smooth' });
        reflectionText.focus();
    }

    // Initialize Supabase client
    function initSupabase() {
        if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
            console.warn('Supabase credentials not set. Database features will not work.');
            return null;
        }
        
        try {
            console.log('Initializing Supabase client with URL:', SUPABASE_URL);
            // Use the global helper function to create the client
            if (typeof window.supabaseCreateClient !== 'function') {
                throw new Error('Supabase client not properly loaded. Please check your internet connection.');
            }
            return window.supabaseCreateClient(SUPABASE_URL, SUPABASE_KEY);
        } catch (error) {
            console.error('Error initializing Supabase client:', error);
            showAlert('Failed to connect to database. Some features may not work.', 'danger');
            return null;
        }
    }

    // Verify Supabase connection
    async function verifySupabaseConnection(client) {
        try {
            console.log('Verifying Supabase connection...');
            const { data, error } = await client.from('reflections').select('id').limit(1);
            
            if (error) {
                throw error;
            }
            
            console.log('Successfully connected to Supabase database');
            showAlert('Connected to database', 'success');
        } catch (error) {
            console.error('Supabase connection verification failed:', error);
            showAlert('Database connection issue: ' + error.message, 'danger');
        }
    }

    // Helper function to show alerts
    function showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alert-container');
        
        // Icon based on alert type
        let icon = '';
        switch(type) {
            case 'success':
                icon = '<i class="bi bi-check-circle-fill me-2"></i>';
                break;
            case 'warning':
                icon = '<i class="bi bi-exclamation-triangle-fill me-2"></i>';
                break;
            case 'danger':
                icon = '<i class="bi bi-x-circle-fill me-2"></i>';
                break;
            case 'info':
            default:
                icon = '<i class="bi bi-info-circle-fill me-2"></i>';
        }
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.role = 'alert';
        alert.innerHTML = `
            ${icon}${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertContainer.appendChild(alert);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    }

    // Toggle loading spinner
    function toggleLoading(isLoading) {
        if (isLoading) {
            loadingSpinner.style.display = 'flex';
            generateBtn.disabled = true;
        } else {
            loadingSpinner.style.display = 'none';
            generateBtn.disabled = false;
        }
    }

    
}); 