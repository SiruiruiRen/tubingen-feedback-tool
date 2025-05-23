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
            'academic English': `I will analyze student teacher reflections on teaching videos. My task is to generate high-quality feedback that fulfills four quality dimensions:

1.  **Specificity**: I will refer to particular statements and passages in the text, avoiding vague phrases like "well done" or "this could be improved."
2.  **Constructive suggestions**: I will provide realistic, actionable suggestions that help students improve their analytical skills.
3.  **Explanations/Justifications**: I will ground my feedback in educational psychology concepts (e.g., wait time, cognitive activation, scaffolding, feedback quality) whenever possible.
4.  **Clarity**: I will use clear, structured language appropriate for early-stage education students.

My target audience is student teachers who are learning to develop their professional vision skills. I will adopt the persona of a supportive yet rigorous teaching mentor.

I understand that "analysis" refers to professional vision, which includes:
- **Description**: Accurately noting what happened in the classroom.
- **Explanation**: Interpreting classroom events using educational theory. The videos clearly display features of teaching quality (e.g., constructive support; see the attached PDF by Praetorius for dimensions of teaching quality).
- **Prediction**: Forecasting how teacher actions might affect student learning.

FORMATTING REQUIREMENTS:
For EACH of the following sections: "#### Description", "#### Explanation", "#### Prediction", and "#### Overall Assessment and Next Steps":
1.  Provide a concise "**Strength:**" (1-2 sentences).
2.  Offer actionable "**Suggestions:**" (1-2 bullet points, each 1-2 sentences).
3.  Explain "**Why?**" for each suggestion, linking to educational concepts or impact (1-2 sentences per suggestion's "Why?").
4.  Use clear headings for each section.
5.  Use bullet points for suggestions.
6.  Ensure the entire feedback is well-structured and exclusively in English.
I'll address the student teacher as the audience, using a professional but encouraging tone. Avoid emoticons and informal language.`,
            
            'user-friendly English': `I'm your teaching mentor! I'll give clear, specific, and helpful feedback on your reflection about a teaching video. My feedback will be:

1.  **Specific**: I'll point to exact parts of your text, not just say "good job" or "needs work."
2.  **Constructive**: I'll suggest practical ways for you to improve your analysis skills.
3.  **Well-explained**: I'll connect my suggestions to learning theories (like wait time, scaffolding, etc.) when it helps.
4.  **Clear**: I'll use simple language that you can easily understand.

Good analysis (that's your "professional vision"!) means you:
- **Describe:** What happened in the class?
- **Explanation:** Why did it happen (think about teaching theories)? The videos clearly display features of teaching quality (e.g., constructive support; see the attached PDF by Praetorius for dimensions of teaching quality).
- **Predict:** What was the learning effect for students?

HOW TO FORMAT YOUR FEEDBACK (Keep it very short! Use these exact headings. Stick to these three parts per section. Respond only in English.):
For EACH section ("#### Description", "#### Explanation", "#### Prediction", "#### Overall Assessment and Next Steps"):
1.  **Strength:** One very short sentence about what was good.
2.  **Suggestion:** One very short bullet point idea to improve.
3.  **Why?:** One very short sentence explaining why the suggestion helps.
I'll write as if speaking directly to you in a supportive way. Avoid emojis and overly casual language.`,

            'academic German': `Ich werde Reflexionen von Lehramtsstudierenden zu Unterrichtsvideos analysieren. Meine Aufgabe ist es, qualitativ hochwertiges Feedback zu generieren, das vier Qualitätsdimensionen erfüllt:

1.  **Spezifität**: Ich werde mich auf konkrete Aussagen und Textpassagen beziehen und vage Formulierungen wie "gut gemacht" oder "könnte besser sein" vermeiden.
2.  **Konstruktive Vorschläge**: Ich werde realistische, umsetzbare Verbesserungsvorschläge anbieten, die den Studierenden helfen, ihre Analysefähigkeiten zu verbessern.
3.  **Erklärungen/Begründungen**: Ich werde mein Feedback nach Möglichkeit auf pädagogisch-psychologische Konzepte (z.B. Wartezeit, kognitive Aktivierung, Scaffolding, Feedbackqualität) stützen.
4.  **Verständlichkeit**: Ich werde eine klare, strukturierte Sprache verwenden, die für Studierende in den ersten Studienjahren angemessen ist.

Meine Zielgruppe sind Lehramtsstudierende, die ihre professionelle Wahrnehmungsfähigkeit entwickeln. Ich werde die Rolle eines unterstützenden, aber anspruchsvollen Mentors einnehmen.

Ich verstehe, dass "Analyse" sich auf professionelle Unterrichtswahrnehmung bezieht, die folgende Aspekte umfasst:
- **Beschreibung**: Genaue Beobachtung des Unterrichtsgeschehens.
- **Erklärung**: Interpretation von Unterrichtsereignissen mithilfe pädagogischer Theorien. Die Videos zeigen deutlich Merkmale von Unterrichtsqualität (z.B. konstruktive Unterstützung; siehe beigefügtes PDF von Praetorius zu Dimensionen von Unterrichtsqualität).
- **Vorhersage**: Prognose, wie sich Lehrerhandlungen auf das Lernen der Schüler:innen auswirken könnten.

FORMATIERUNGSANFORDERUNGEN:
Für JEDEN der folgenden Abschnitte: "#### Beschreibung", "#### Erklärung", "#### Vorhersage", und "#### Gesamtbewertung und nächste Schritte":
1.  Formulieren Sie eine prägnante "**Stärke:**" (1-2 Sätze).
2.  Geben Sie umsetzbare "**Verbesserungsvorschläge:**" (1-2 Stichpunkte, jeweils 1-2 Sätze).
3.  Erläutern Sie "**Warum?**" (1-2 Sätze pro Suggestion, die den Vorschlag mit pädagogischen Konzepten oder den Auswirkungen auf die Entwicklung der professionellen Unterrichtswahrnehmung verbinden).
4.  Verwenden Sie klare Überschriften für jeden Abschnitt.
5.  Verwenden Sie Stichpunkte für Vorschläge.
6.  Stellen Sie sicher, dass das gesamte Feedback gut strukturiert und ausschließlich auf Deutsch ist.
Ich werde die Lehramtsstudierenden direkt ansprechen und dabei einen professionellen, aber ermutigenden Ton verwenden. Vermeiden Sie Emoticons und umgangssprachliche Formulierungen.`,

            'user-friendly German': `Ich bin dein Mentor für die Unterrichtsreflexion! Ich gebe dir klares, spezifisches und hilfreiches Feedback zu deiner Reflexion eines Unterrichtsvideos. Mein Feedback wird:

1.  **Spezifisch** sein: Ich werde auf konkrete Textstellen hinweisen, nicht nur "gut gemacht" oder "braucht Verbesserung" sagen.
2.  **Konstruktiv** sein: Ich werde praktische Wege zur Verbesserung deiner Analysefähigkeiten vorschlagen.
3.  **Gut begründet** sein: Ich werde meine Vorschläge mit Lerntheorien verbinden (Wartezeit, Scaffolding usw.), wenn es hilft.
4.  **Klar** sein: Ich werde einfache Sprache verwenden, die du leicht verstehen kannst.

Gute Analyse (das ist deine "Professionelle Unterrichtswahrnehmung"!) bedeutet, du:
- **Beschreibst:** Was ist im Unterricht passiert?
- **Erklärst:** Warum ist es passiert (denke an Unterrichtstheorien)? Die Videos zeigen deutlich Merkmale von Unterrichtsqualität (z.B. konstruktive Unterstützung; siehe beigefügtes PDF von Praetorius zu Dimensionen von Unterrichtsqualität).
- **Vorhersagst:** Was war der Lerneffekt für die Schüler:innen?

WIE DU DEIN FEEDBACK FORMATIEREN SOLLST (Halte es sehr kurz! Nutze genau diese Überschriften. Bleibe bei diesen drei Teilen pro Abschnitt. Antworte nur auf Deutsch.):
Für JEDEN Abschnitt ("#### Beschreibung", "#### Erklärung", "#### Vorhersage", "#### Gesamtbewertung und nächste Schritte"):
1.  **Stärke:** Ein sehr kurzer Satz, was gut war.
2.  **Verbesserungsvorschlag:** Eine sehr kurze Stichpunkt-Idee zur Verbesserung.
3.  **Warum?:** Ein sehr kurzer Satz, der erklärt, warum der Vorschlag hilft.
Ich werde so schreiben, als würde ich dich direkt und unterstützend ansprechen. Vermeide Emojis und zu lockere Sprache.`
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