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
    const saveBtn = document.getElementById('save-btn');
    const editBtn = document.getElementById('edit-btn');
    const reflectionText = document.getElementById('reflection-text');
    const feedback = document.getElementById('feedback');
    const revisionSection = document.getElementById('revision-section');
    const revisedText = document.getElementById('revised-text');
    const saveRevisionBtn = document.getElementById('save-revision-btn');
    const compareBtn = document.getElementById('compare-btn');
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
    saveBtn.addEventListener('click', saveFeedback);
    editBtn.addEventListener('click', showRevisionPanel);
    saveRevisionBtn.addEventListener('click', saveRevision);
    compareBtn.addEventListener('click', compareReflections);
    submitRatingBtn.addEventListener('click', submitRating);

    // Initialize Supabase client
    const supabase = initSupabase();
    
    // Verify Supabase connection
    if (supabase) {
        verifySupabaseConnection(supabase);
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
        if (!reflectionText.value.trim()) {
            showAlert('Please enter a reflection text first.', 'warning');
            return;
        }

        // Determine language based on the radio button selection
        const language = langEn.checked ? 'en' : 'de';
        const style = styleSelector.value;
        
        // Clear any previous session data to avoid conflicts
        sessionStorage.removeItem('currentReflectionId');
        
        console.log('Generating feedback with settings:', { language, style });
        
        // Show loading spinner
        toggleLoading(true);
        
        try {
            const response = await callOpenAI(reflectionText.value, language, style);
            console.log('Generated feedback:', response);
            
            // Format the feedback with markdown to HTML conversion
            const formattedResponse = formatFeedback(response);
            feedback.innerHTML = formattedResponse;
            
            // Store strings only, not objects
            sessionStorage.setItem('reflection', reflectionText.value);
            sessionStorage.setItem('feedback', response);
            sessionStorage.setItem('currentLanguage', language);
            sessionStorage.setItem('currentStyle', style);
            
            showAlert('Feedback generated successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating feedback:', error);
            showAlert(`Error generating feedback: ${error.message}. Please check console for details.`, 'danger');
            feedback.innerHTML = '<p class="text-danger">Failed to generate feedback. Please try again or check the console for error details.</p>';
        } finally {
            toggleLoading(false);
        }
    }

    // Format feedback text with proper HTML
    function formatFeedback(text) {
        if (!text) return '';
        
        // Format headings (#### Heading)
        text = text.replace(/####\s+([^\n]+)/g, '<h4 class="feedback-heading">$1</h4>');
        
        // Format bold text (**text**)
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Format list items starting with - or *
        text = text.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
        
        // Wrap consecutive list items in ul tags
        text = text.replace(/<li>(.+)(?=<li>|$)/g, function(match) {
            return '<ul>' + match.replace(/<\/li>(?!<li>)/g, '</li></ul>');
        });
        
        // Add spacing between sections
        text = text.replace(/<\/h4>/g, '</h4><div class="section-content">');
        text = text.replace(/<h4/g, '</div><h4');
        
        // Remove any leading </div>
        text = text.replace(/^<\/div>/, '');
        
        // Add final closing div
        text += '</div>';
        
        // Replace newlines with <br>
        text = text.replace(/\n/g, '<br>');
        
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

1. **Specificity**: I will refer to particular statements and passages in the text, avoiding vague phrases like "well done" or "this could be improved."

2. **Constructive suggestions**: I will provide realistic, actionable suggestions that help students improve their analytical skills.

3. **Explanations/Justifications**: I will ground my feedback in educational psychology concepts (e.g., wait time, cognitive activation, scaffolding, feedback quality) whenever possible.

4. **Clarity**: I will use clear, structured language appropriate for early-stage education students.

My target audience is student teachers who are learning to develop their professional vision skills. I will adopt the persona of a supportive yet rigorous teaching mentor.

I understand that "analysis" refers to professional vision, which includes:
- **Description**: Accurately noting what happened in the classroom
- **Explanation**: Interpreting classroom events using educational theory. The videos clearly display features of teaching quality (e.g., constructive support; see the attached PDF by Praetorius for dimensions of teaching quality).
- **Prediction**: Forecasting how teacher actions might affect student learning

FORMATTING REQUIREMENTS:
1. I will use "#### Description" as a header for the Description section
2. I will use "#### Explanation" as a header for the Explanation section  
3. I will use "#### Prediction" as a header for the Prediction section
4. I will use "#### Overall Assessment and Next Steps" for the summary section
5. Within each section, I will clearly mark "**Strengths:**" and "**Suggestions for Improvement:**"
6. I will format my response with proper spacing between sections
7. I will use bullet points for listing specific points
8. I will make sure all feedback is well-structured with clear headings`,
            
            'user-friendly English': `I will analyze student teacher reflections and provide helpful feedback that is:

1. **Specific**: I'll point to exact parts of their text, not just say "good job" or "needs work"

2. **Constructive**: I'll suggest practical ways to improve their analysis skills

3. **Well-explained**: I'll connect my suggestions to learning theories (wait time, scaffolding, etc.)

4. **Clear**: I'll use simple language that early education students can easily understand

My audience is student teachers learning to analyze classroom teaching. I'll be a supportive teaching mentor who balances encouragement with helpful critique.

I know that good analysis includes three key parts:
- **Description**: What exactly happened in the classroom
- **Explanation**: Why it happened (using educational theories). The videos clearly display features of teaching quality (e.g., constructive support; see the attached PDF by Praetorius for dimensions of teaching quality).
- **Prediction**: How it might affect student learning

FORMATTING REQUIREMENTS:
1. I MUST use "#### Description" as a header for the Description section
2. I MUST use "#### Explanation" as a header for the Explanation section  
3. I MUST use "#### Prediction" as a header for the Prediction section
4. I MUST use "#### Overall Assessment and Next Steps" for the summary section
5. Within each section, I will clearly start with "**Strengths:**" followed by "**Suggestions for Improvement:**"
6. I will format my response with proper spacing between sections
7. I will use bullet points for listing specific points
8. I will make sure all feedback is well-structured with clear headings
9. I will keep my responses concise and to the point, aiming for no more than 2-3 short paragraphs per main section (Description, Explanation, Prediction) and a brief overall assessment.`,

            'academic German': `Ich werde Reflexionen von Lehramtsstudierenden zu Unterrichtsvideos analysieren. Meine Aufgabe ist es, qualitativ hochwertiges Feedback zu generieren, das vier Qualitätsdimensionen erfüllt:

1. **Spezifität**: Ich werde mich auf konkrete Aussagen und Textpassagen beziehen und vage Formulierungen wie "gut gemacht" oder "könnte besser sein" vermeiden.

2. **Konstruktive Vorschläge**: Ich werde realistische, umsetzbare Verbesserungsvorschläge anbieten, die den Studierenden helfen, ihre Analysefähigkeiten zu verbessern.

3. **Erklärungen/Begründungen**: Ich werde mein Feedback nach Möglichkeit auf pädagogisch-psychologische Konzepte (z.B. Wartezeit, kognitive Aktivierung, Scaffolding, Feedbackqualität) stützen.

4. **Verständlichkeit**: Ich werde eine klare, strukturierte Sprache verwenden, die für Studierende in den ersten Studienjahren angemessen ist.

Meine Zielgruppe sind Lehramtsstudierende, die ihre professionelle Wahrnehmungsfähigkeit entwickeln. Ich werde die Rolle eines unterstützenden, aber anspruchsvollen Mentors einnehmen.

Ich verstehe, dass "Analyse" sich auf professionelle Unterrichtswahrnehmung bezieht, die folgende Aspekte umfasst:
- **Beschreibung**: Genaue Beobachtung des Unterrichtsgeschehens
- **Erklärung**: Interpretation von Unterrichtsereignissen mithilfe pädagogischer Theorien. Die Videos zeigen deutlich Merkmale von Unterrichtsqualität (z.B. konstruktive Unterstützung; siehe beigefügtes PDF von Praetorius zu Dimensionen von Unterrichtsqualität).
- **Vorhersage**: Prognose, wie sich Lehrerhandlungen auf das Lernen der Schüler:innen auswirken könnten

FORMATIERUNGSANFORDERUNGEN:
1. Ich MUSS "#### Beschreibung" als Überschrift für den Beschreibungsabschnitt verwenden
2. Ich MUSS "#### Erklärung" als Überschrift für den Erklärungsabschnitt verwenden
3. Ich MUSS "#### Vorhersage" als Überschrift für den Vorhersageabschnitt verwenden
4. Ich MUSS "#### Gesamtbewertung und nächste Schritte" für den Zusammenfassungsabschnitt verwenden
5. In jedem Abschnitt werde ich deutlich "**Stärken:**" und "**Verbesserungsvorschläge:**" kennzeichnen
6. Ich werde meine Antwort mit angemessenen Abständen zwischen den Abschnitten formatieren
7. Ich werde Aufzählungspunkte für die Auflistung konkreter Punkte verwenden
8. Ich werde sicherstellen, dass das gesamte Feedback gut strukturiert ist und klare Überschriften hat`,

            'user-friendly German': `Ich werde Reflexionen von Lehramtsstudierenden analysieren und hilfreiches Feedback geben, das:

1. **Spezifisch** ist: Ich werde auf konkrete Textstellen hinweisen, nicht nur "gut gemacht" oder "braucht Verbesserung" sagen

2. **Konstruktiv** ist: Ich werde praktische Wege zur Verbesserung ihrer Analysefähigkeiten vorschlagen

3. **Gut begründet** ist: Ich werde meine Vorschläge mit Lerntheorien verbinden (Wartezeit, Scaffolding usw.)

4. **Klar** ist: Ich werde einfache Sprache verwenden, die Lehramtsstudierende leicht verstehen können

Meine Zielgruppe sind angehende Lehrkräfte, die lernen, Unterricht zu analysieren. Ich trete als unterstützender Mentor auf, der Ermutigung mit hilfreichem Feedback verbindet.

Ich weiß, dass eine gute Analyse drei Kernbereiche umfasst:
- **Beschreibung**: Was genau im Unterricht passiert ist
- **Erklärung**: Warum es passiert ist (unter Verwendung pädagogischer Theorien). Die Videos zeigen deutlich Merkmale von Unterrichtsqualität (z.B. konstruktive Unterstützung; siehe beigefügtes PDF von Praetorius zu Dimensionen von Unterrichtsqualität).
- **Vorhersage**: Wie es sich auf das Lernen der Schüler:innen auswirken könnte

FORMATIERUNGSANFORDERUNGEN:
1. Ich MUSS "#### Beschreibung" als Überschrift für den Beschreibungsabschnitt verwenden
2. Ich MUSS "#### Erklärung" als Überschrift für den Erklärungsabschnitt verwenden
3. Ich MUSS "#### Vorhersage" als Überschrift für den Vorhersageabschnitt verwenden
4. Ich MUSS "#### Gesamtbewertung und nächste Schritte" für den Zusammenfassungsabschnitt verwenden
5. In jedem Abschnitt werde ich mit "**Stärken:**" beginnen, gefolgt von "**Verbesserungsvorschläge:**"
6. Ich werde meine Antwort mit angemessenen Abständen zwischen den Abschnitten formatieren
7. Ich werde Aufzählungspunkte für die Auflistung konkreter Punkte verwenden
8. Ich werde sicherstellen, dass das gesamte Feedback gut strukturiert ist und klare Überschriften hat
9. Ich werde meine Antworten kurz und prägnant halten und darauf abzielen, nicht mehr als 2-3 kurze Absätze pro Hauptabschnitt (Beschreibung, Erklärung, Vorhersage) und eine kurze Gesamtbewertung zu verfassen.`
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

    // Save feedback to database
    async function saveFeedback() {
        const name = nameInput.value.trim();
        if (!name) {
            showAlert('Please enter your name before saving.', 'warning');
            return;
        }

        const reflection = reflectionText.value.trim();
        const feedbackText = feedback.innerText || feedback.textContent;
        
        if (!reflection || !feedbackText) {
            showAlert('Missing reflection or feedback. Please generate feedback first.', 'warning');
            return;
        }

        console.log('Saving feedback to database...');
        
        try {
            // Store in session directly as strings (not objects)
            sessionStorage.setItem('reflection', reflection);
            sessionStorage.setItem('feedback', feedbackText);
            
            const { data, error } = await supabase
                .from('reflections')
                .insert([
                    { 
                        student_name: name, 
                        reflection_text: reflection, 
                        feedback_text: feedbackText,
                        created_at: new Date().toISOString()
                    }
                ])
                .select();

            if (error) throw error;
            
            console.log('Save response:', data);
            
            // Store the ID for later use with revision - store as string
            if (data && data.length > 0) {
                const reflectionId = data[0].id.toString();
                console.log('Setting currentReflectionId to:', reflectionId);
                sessionStorage.setItem('currentReflectionId', reflectionId);
            }
            
            showAlert('Feedback saved successfully!', 'success');
            
        } catch (error) {
            console.error('Error saving feedback:', error);
            showAlert('Error saving feedback. Please try again.', 'danger');
        }
    }

    // Show revision panel
    function showRevisionPanel() {
        // Make sure we have saved feedback first
        const reflectionId = sessionStorage.getItem('currentReflectionId');
        if (!reflectionId) {
            showAlert('Please save your feedback first before editing.', 'warning');
            saveBtn.classList.add('btn-pulse');
            setTimeout(() => saveBtn.classList.remove('btn-pulse'), 2000);
            return;
        }
        
        // Display the revision panel with animation
        revisionSection.classList.add('workflow-step');
        revisionSection.style.display = 'block';
        
        // Set the original text from the reflection textarea or session storage
        const originalText = sessionStorage.getItem('reflection') || reflectionText.value.trim();
        revisedText.value = originalText;
        
        // Set focus to the revision textarea
        revisedText.focus();
        
        // Show a helpful message about the edit workflow
        showAlert('Edit your reflection based on the feedback. When you click "Save Revision", your revised text will replace your original reflection.', 'info');
        
        // Smooth scroll to revision section
        revisionSection.scrollIntoView({ behavior: 'smooth' });
        
        console.log('Showing revision panel, original text length:', originalText.length);
    }

    // Save revised reflection to database
    async function saveRevision() {
        const name = nameInput.value.trim();
        if (!name) {
            showAlert('Please enter your name before saving.', 'warning');
            return;
        }

        const revised = revisedText.value.trim();
        if (!revised) {
            showAlert('Please enter your revised reflection.', 'warning');
            return;
        }
        
        // Ensure we have a valid Supabase client
        if (!supabase) {
            console.error('Supabase client not initialized');
            showAlert('Database connection not available. Please refresh the page and try again.', 'danger');
            return;
        }

        // Check if text is too large
        if (revised.length > 10000) {
            showAlert('Your revision is too long. Please keep it under 10,000 characters.', 'warning');
            return;
        }

        console.log('Attempting to save revision...');
        console.log('Name:', name);
        console.log('Revision length:', revised.length);
        
        // Get the stored reflection ID (as string)
        const reflectionId = sessionStorage.getItem('currentReflectionId');
        console.log('Reflection ID from session:', reflectionId);
        
        if (!reflectionId) {
            showAlert('Session data lost. Please save your feedback again.', 'warning');
            return;
        }
        
        // Show loading indicator
        toggleLoading(true);
        
        try {
            // Prepare the data - ensure proper escaping for special characters
            const dataToSave = { 
                student_name: name,
                revised_text: revised,
                updated_at: new Date().toISOString()
            };
            
            console.log('Data to save:', dataToSave);
            
            // Convert ID to number for database query
            const idNumber = parseInt(reflectionId, 10);
            
            if (isNaN(idNumber)) {
                throw new Error('Invalid reflection ID format');
            }
            
            console.log('Updating existing record with ID:', idNumber);
            
            // Use a simpler approach to avoid JSON parsing issues
            const result = await supabase
                .from('reflections')
                .update(dataToSave)
                .eq('id', idNumber);

            if (result.error) {
                throw result.error;
            }
            
            // Save successfully revised text to session storage as a string
            sessionStorage.setItem('revisedReflection', revised);
            
            // Update the original reflection textarea with the revised text
            reflectionText.value = revised;
            
            // Hide the revision section
            revisionSection.style.display = 'none';
            
            // Scroll back to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Show success message
            showAlert('Revision saved successfully! The revised text has been copied to the main input.', 'success');
            
            // Highlight the generate button to suggest next action
            setTimeout(() => {
                generateBtn.classList.add('btn-pulse');
                setTimeout(() => generateBtn.classList.remove('btn-pulse'), 3000);
            }, 1000);
            
        } catch (error) {
            console.error('Error saving revision:', error);
            showAlert(`Error saving revision: ${error.message}. Please check console for details.`, 'danger');
        } finally {
            toggleLoading(false);
        }
    }

    // Submit rating for feedback
    async function submitRating() {
        const feedbackRatingValue = currentQualityRating;
        const usefulnessRatingValue = currentUsefulnessRating;
        
        if (feedbackRatingValue === null || usefulnessRatingValue === null) {
            showAlert('Please select ratings for both quality and usefulness before submitting.', 'warning');
            return;
        }
        
        const reflectionId = sessionStorage.getItem('currentReflectionId');
        console.log('Rating for reflection ID:', reflectionId);
        
        if (!reflectionId) {
            showAlert('Please save your feedback first before rating.', 'warning');
            saveBtn.classList.add('btn-pulse');
            setTimeout(() => saveBtn.classList.remove('btn-pulse'), 2000);
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

    // Compare original and revised reflections
    function compareReflections() {
        const original = sessionStorage.getItem('reflection') || reflectionText.value.trim();
        const revised = revisedText.value.trim();
        
        if (!original || !revised) {
            showAlert('Both original and revised reflections are needed for comparison.', 'warning');
            return;
        }
        
        // Create a modal for comparison
        const modalHtml = `
        <div class="modal fade" id="compareModal" tabindex="-1" aria-labelledby="compareModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="compareModalLabel">Compare Reflections</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="text-center">Original Reflection</h6>
                                <div class="p-3 border rounded" style="white-space: pre-wrap; background-color: #f8f9fa;">${original}</div>
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-center">Revised Reflection</h6>
                                <div class="p-3 border rounded" style="white-space: pre-wrap; background-color: #f8f9fa;">${revised}</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        // Add the modal to the DOM
        if (document.getElementById('compareModal')) {
            document.getElementById('compareModal').remove();
        }
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Show the modal
        const compareModal = new bootstrap.Modal(document.getElementById('compareModal'));
        compareModal.show();
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