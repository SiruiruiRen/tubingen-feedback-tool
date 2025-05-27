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

// Language translations
const translations = {
    en: {
        title: "Teacher Professional Vision Feedback",
        subtitle: "Generate high-quality feedback on teaching reflections",
        settings: "Settings",
        your_name: "Your Name:",
        enter_name: "Enter your name",
        video_watched: "Video Watched:",
        select_video: "Select a video...",
        language: "Language:",
        generate_feedback: "Generate Feedback",
        what_is_def: "What is description, explanation, and prediction?",
        description: "Description:",
        description_def: "Accurately noting what happened in the classroom - observing and reporting specific behaviors, interactions, and events.",
        explanation: "Explanation:",
        explanation_def: "Interpreting observed events using educational theory and research - understanding why things happened.",
        prediction: "Prediction:",
        prediction_def: "Forecasting potential effects on student learning and future classroom dynamics based on observations.",
        reflection_input: "Student Teacher Reflection",
        paste_reflection: "Paste the student teacher's reflection here...",
        clear: "Clear",
        generated_feedback: "Generated Feedback",
        feedback_placeholder: "Feedback will appear here after generation...",
        extended: "Extended",
        short: "Short",
        copy: "Copy",
        revise_reflection: "Revise Reflection",
        rate_feedback: "Rate this feedback:",
        quality: "Quality:",
        usefulness: "Usefulness:",
        submit_rating: "Submit Rating",
        quality_labels: ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        usefulness_labels: ['', 'Not useful', 'Slightly useful', 'Moderately useful', 'Very useful', 'Extremely useful']
    },
    de: {
        title: "Lehrer Professional Vision Feedback",
        subtitle: "Generieren Sie hochwertiges Feedback zu Unterrichtsreflexionen",
        settings: "Einstellungen",
        your_name: "Ihr Name:",
        enter_name: "Geben Sie Ihren Namen ein",
        video_watched: "Angesehenes Video:",
        select_video: "Wählen Sie ein Video...",
        language: "Sprache:",
        generate_feedback: "Feedback generieren",
        what_is_def: "Was ist Beschreibung, Erklärung und Vorhersage?",
        description: "Beschreibung:",
        description_def: "Genaues Beobachten des Geschehens im Klassenzimmer - Beobachten und Berichten spezifischer Verhaltensweisen, Interaktionen und Ereignisse.",
        explanation: "Erklärung:",
        explanation_def: "Interpretation von beobachteten Ereignissen mittels pädagogischer Theorie und Forschung - Verstehen, warum Dinge passiert sind.",
        prediction: "Vorhersage:",
        prediction_def: "Prognose potenzieller Auswirkungen auf das Lernen der Schüler und zukünftige Klassendynamiken basierend auf Beobachtungen.",
        reflection_input: "Reflexion des Lehramtsstudierenden",
        paste_reflection: "Fügen Sie hier die Reflexion des Lehramtsstudierenden ein...",
        clear: "Löschen",
        generated_feedback: "Generiertes Feedback",
        feedback_placeholder: "Feedback wird hier nach der Generierung angezeigt...",
        extended: "Erweitert",
        short: "Kurz",
        copy: "Kopieren",
        revise_reflection: "Reflexion überarbeiten",
        rate_feedback: "Bewerten Sie dieses Feedback:",
        quality: "Qualität:",
        usefulness: "Nützlichkeit:",
        submit_rating: "Bewertung abgeben",
        quality_labels: ['', 'Schlecht', 'Befriedigend', 'Gut', 'Sehr gut', 'Ausgezeichnet'],
        usefulness_labels: ['', 'Nicht nützlich', 'Wenig nützlich', 'Mäßig nützlich', 'Sehr nützlich', 'Äußerst nützlich']
    }
};

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const reviseReflectionBtn = document.getElementById('revise-reflection-btn');
    const reflectionText = document.getElementById('reflection-text');
    const feedbackExtended = document.getElementById('feedback-extended');
    const feedbackShort = document.getElementById('feedback-short');
    const nameInput = document.getElementById('student-name');
    const videoSelect = document.getElementById('video-select');
    const feedbackRating = document.getElementById('feedback-rating');
    const usefulnessRating = document.getElementById('usefulness-rating');
    const submitRatingBtn = document.getElementById('submit-rating-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const qualityRatingButtonsContainer = document.getElementById('quality-rating-buttons');
    const usefulnessRatingButtonsContainer = document.getElementById('usefulness-rating-buttons');
    const qualityRatingHoverLabel = document.getElementById('quality-rating-hover-label');
    const usefulnessRatingHoverLabel = document.getElementById('usefulness-rating-hover-label');
    const feedbackTabs = document.querySelector('.feedback-tabs');
    const extendedTab = document.getElementById('extended-tab');
    const shortTab = document.getElementById('short-tab');
    
    // Language and style selections
    const langEn = document.getElementById('lang-en');
    const langDe = document.getElementById('lang-de');

    let currentQualityRating = null;
    let currentUsefulnessRating = null;
    let currentLanguage = 'en';
    let currentFeedbackType = 'extended'; // Track which feedback is currently shown
    
    // Tracking variables for user interaction
    let tabSwitchCount = 0;
    let timeTracking = {
        extended: { totalTime: 0, lastStarted: null },
        short: { totalTime: 0, lastStarted: null }
    };
    let currentReflectionId = null;

    // Event listeners
    generateBtn.addEventListener('click', generateFeedback);
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyFeedback);
    reviseReflectionBtn.addEventListener('click', handleReviseReflectionClick);
    submitRatingBtn.addEventListener('click', submitRating);
    langEn.addEventListener('change', () => updateLanguage('en'));
    langDe.addEventListener('change', () => updateLanguage('de'));
    extendedTab.addEventListener('click', () => switchToTab('extended'));
    shortTab.addEventListener('click', () => switchToTab('short'));

    // Initialize Supabase client
    const supabase = initSupabase();
    
    // Verify Supabase connection
    if (supabase) {
        verifySupabaseConnection(supabase);
    }

    // Function to update language
    function updateLanguage(lang) {
        currentLanguage = lang;
        const trans = translations[lang];
        
        // Update all elements with data-lang-key
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (trans[key]) {
                element.textContent = trans[key];
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-lang-key-placeholder]').forEach(element => {
            const key = element.getAttribute('data-lang-key-placeholder');
            if (trans[key]) {
                element.placeholder = trans[key];
            }
        });
        
        // Update tooltips
        updateTooltips(lang);
        
        // Update rating labels
        updateRatingLabels();
    }

    // Function to update tooltips based on language
    function updateTooltips(lang) {
        const tooltipTexts = {
            en: {
                generate: "Generate AI feedback based on your reflection",
                clear: "Clear the reflection text",
                copy: "Copy feedback to clipboard",
                revise: "Edit your reflection in the main text area and generate new feedback",
                submit: "Submit your rating of the feedback"
            },
            de: {
                generate: "KI-Feedback basierend auf Ihrer Reflexion generieren",
                clear: "Reflexionstext löschen",
                copy: "Feedback in Zwischenablage kopieren",
                revise: "Bearbeiten Sie Ihre Reflexion im Haupttextbereich und generieren Sie neues Feedback",
                submit: "Senden Sie Ihre Bewertung des Feedbacks"
            }
        };
        
        const texts = tooltipTexts[lang];
        generateBtn.setAttribute('title', texts.generate);
        clearBtn.setAttribute('title', texts.clear);
        copyBtn.setAttribute('title', texts.copy);
        reviseReflectionBtn.setAttribute('title', texts.revise);
        submitRatingBtn.setAttribute('title', texts.submit);
        
        // Reinitialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(function (tooltipTriggerEl) {
            const existingTooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
            if (existingTooltip) {
                existingTooltip.dispose();
            }
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Function to update rating labels
    function updateRatingLabels() {
        const labels = translations[currentLanguage];
        // Update hover labels if ratings are selected
        if (currentQualityRating !== null) {
            qualityRatingHoverLabel.textContent = labels.quality_labels[currentQualityRating];
        }
        if (currentUsefulnessRating !== null) {
            usefulnessRatingHoverLabel.textContent = labels.usefulness_labels[currentUsefulnessRating];
        }
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
        const labels = groupName === 'quality' ? translations[currentLanguage].quality_labels : translations[currentLanguage].usefulness_labels;
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

    // Function to switch tabs and track the interaction
    function switchToTab(tabType) {
        // Stop tracking time for the previous tab
        if (currentFeedbackType && timeTracking[currentFeedbackType].lastStarted) {
            const elapsed = Date.now() - timeTracking[currentFeedbackType].lastStarted;
            timeTracking[currentFeedbackType].totalTime += elapsed;
            timeTracking[currentFeedbackType].lastStarted = null;
        }
        
        // Update current tab
        currentFeedbackType = tabType;
        
        // Start tracking time for the new tab
        timeTracking[tabType].lastStarted = Date.now();
        
        // Increment switch count if feedback has been generated
        if (feedbackTabs.classList.contains('d-none') === false) {
            tabSwitchCount++;
            console.log(`Tab switched to ${tabType}. Total switches: ${tabSwitchCount}`);
        }
    }

    // Function to get time tracking summary
    function getTimeTrackingSummary() {
        // Ensure we capture the time for the currently active tab
        if (currentFeedbackType && timeTracking[currentFeedbackType].lastStarted) {
            const elapsed = Date.now() - timeTracking[currentFeedbackType].lastStarted;
            timeTracking[currentFeedbackType].totalTime += elapsed;
            timeTracking[currentFeedbackType].lastStarted = Date.now(); // Reset the timer
        }
        
        return {
            extendedTime: Math.round(timeTracking.extended.totalTime / 1000), // Convert to seconds
            shortTime: Math.round(timeTracking.short.totalTime / 1000),
            switchCount: tabSwitchCount,
            lastViewedVersion: currentFeedbackType
        };
    }

    // Reset tracking when new feedback is generated
    function resetTracking() {
        tabSwitchCount = 0;
        timeTracking = {
            extended: { totalTime: 0, lastStarted: null },
            short: { totalTime: 0, lastStarted: null }
        };
        currentReflectionId = null;
    }

    // Feedback generation
    async function generateFeedback() {
        const studentName = nameInput.value.trim();
        if (!studentName) {
            showAlert(currentLanguage === 'en' ? 'Please enter your name before generating feedback.' : 'Bitte geben Sie Ihren Namen ein, bevor Sie Feedback generieren.', 'warning');
            nameInput.focus();
            return;
        }

        const videoSelected = videoSelect.value;
        if (!videoSelected) {
            showAlert(currentLanguage === 'en' ? 'Please select a video before generating feedback.' : 'Bitte wählen Sie ein Video aus, bevor Sie Feedback generieren.', 'warning');
            videoSelect.focus();
            return;
        }

        if (!reflectionText.value.trim()) {
            showAlert(currentLanguage === 'en' ? 'Please enter a reflection text first.' : 'Bitte geben Sie zuerst einen Reflexionstext ein.', 'warning');
            reflectionText.focus();
            return;
        }

        // Reset tracking for new feedback generation
        resetTracking();

        // Determine language based on the radio button selection
        const language = langEn.checked ? 'en' : 'de';
        const currentSessionId = getOrCreateSessionId();
        
        // Show loading spinner
        toggleLoading(true);
        
        try {
            // First, analyze the reflection to get percentage distribution
            const analysisResult = await analyzeReflection(reflectionText.value, language);
            console.log('Analysis result:', analysisResult);
            
            // Generate both extended and short feedback
            const [extendedFeedback, shortFeedback] = await Promise.all([
                callOpenAI(reflectionText.value, language, 'academic', analysisResult),
                callOpenAI(reflectionText.value, language, 'user-friendly', analysisResult)
            ]);
            
            console.log('Generated extended feedback:', extendedFeedback);
            console.log('Generated short feedback:', shortFeedback);
            
            // Format and display both feedbacks
            const formattedExtended = formatFeedback(extendedFeedback, analysisResult);
            const formattedShort = formatFeedback(shortFeedback, analysisResult);
            
            feedbackExtended.innerHTML = formattedExtended;
            feedbackShort.innerHTML = formattedShort;
            
            // Show the feedback tabs
            feedbackTabs.classList.remove('d-none');
            
            // Start tracking time for the default tab (extended)
            timeTracking.extended.lastStarted = Date.now();

            // Save to database
            console.log('Saving new reflection and feedback to database...');
            const { data, error } = await supabase
                .from('reflections')
                .insert([
                    { 
                        student_name: studentName,
                        video_id: videoSelected,
                        reflection_text: reflectionText.value, 
                        feedback_text: extendedFeedback, // Save extended version as primary
                        feedback_text_short: shortFeedback, // Save short version
                        analysis_percentages: analysisResult,
                        language: language,
                        style: 'both', // Since we generate both
                        session_id: currentSessionId, 
                        created_at: new Date().toISOString(),
                    }
                ])
                .select();

            if (error) {
                console.error('Error saving new reflection to Supabase:', error);
                throw new Error(`Failed to save new reflection: ${error.message}`);
            }
            
            console.log('Save response (new record):', data);
            if (data && data.length > 0) {
                currentReflectionId = data[0].id.toString();
                sessionStorage.setItem('lastGeneratedReflectionIdForRating', currentReflectionId);
                console.log('New reflection saved. ID for rating purposes:', currentReflectionId);
            }
            
            const alertMessage = currentLanguage === 'en' 
                ? 'Feedback generated and saved as a new entry!' 
                : 'Feedback generiert und als neuer Eintrag gespeichert!';
            
            sessionStorage.setItem('reflection', reflectionText.value);
            sessionStorage.setItem('feedbackExtended', extendedFeedback);
            sessionStorage.setItem('feedbackShort', shortFeedback);
            sessionStorage.setItem('currentLanguage', language);
            
            showAlert(alertMessage, 'success');
            
            // Show revise button
            if (sessionStorage.getItem('reflection')) {
                reviseReflectionBtn.style.display = 'inline-block'; 
            }

            // Reset UI for ratings
            currentQualityRating = null;
            currentUsefulnessRating = null;
            createRatingButtons(qualityRatingButtonsContainer, 5, 'quality');
            createRatingButtons(usefulnessRatingButtonsContainer, 5, 'usefulness');
            qualityRatingHoverLabel.textContent = '';
            usefulnessRatingHoverLabel.textContent = '';
            
        } catch (error) {
            console.error('Error in generateFeedback process:', error);
            showAlert(`Error: ${error.message}. Please check console for details.`, 'danger');
            feedbackExtended.innerHTML = '<p class="text-danger">Failed to generate or save feedback. Please try again or check the console.</p>';
            feedbackShort.innerHTML = '<p class="text-danger">Failed to generate or save feedback. Please try again or check the console.</p>';
            reviseReflectionBtn.style.display = 'none'; 
        } finally {
            toggleLoading(false);
        }
    }

    // Analyze reflection to get percentage distribution
    async function analyzeReflection(reflection, language) {
        const analysisPrompt = language === 'en' 
            ? `Analyze this teaching reflection and determine the percentage distribution of content across three categories:
               1. Description (noting what happened)
               2. Explanation (interpreting using theory)
               3. Prediction (forecasting effects)
               
               Return ONLY a JSON object with percentages like: {"description": 40, "explanation": 35, "prediction": 25}`
            : `Analysieren Sie diese Unterrichtsreflexion und bestimmen Sie die prozentuale Verteilung des Inhalts über drei Kategorien:
               1. Beschreibung (Beobachtung des Geschehens)
               2. Erklärung (Interpretation mit Theorie)
               3. Vorhersage (Prognose der Auswirkungen)
               
               Geben Sie NUR ein JSON-Objekt mit Prozentsätzen zurück wie: {"description": 40, "explanation": 35, "prediction": 25}`;

        const requestData = {
            model: model,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in analyzing teaching reflections. Analyze the text and return ONLY a JSON object with percentage distribution."
                },
                {
                    role: "user",
                    content: analysisPrompt + "\n\nReflection:\n" + reflection
                }
            ],
            temperature: 0.3,
            max_tokens: 100
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
                throw new Error('Error analyzing reflection');
            }

            const result = await response.json();
            const content = result.choices[0].message.content;
            
            // Parse JSON from response
            const jsonMatch = content.match(/\{.*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // Default if parsing fails
            return { description: 33, explanation: 33, prediction: 34 };
        } catch (error) {
            console.error('Error in reflection analysis:', error);
            // Return default distribution if analysis fails
            return { description: 33, explanation: 33, prediction: 34 };
        }
    }

    // Format feedback text with proper HTML
    function formatFeedback(text, analysisResult = null) {
        if (!text) return '';
        
        let formattedText = '';
        
        // Add analysis distribution visualization if available
        if (analysisResult && (analysisResult.description || analysisResult.explanation || analysisResult.prediction)) {
            formattedText += `
                <div class="analysis-distribution">
                    <h5>${currentLanguage === 'en' ? 'Content Distribution Analysis' : 'Inhaltsverteilungsanalyse'}</h5>
                    <div class="distribution-item">
                        <div class="distribution-label">
                            <span>${currentLanguage === 'en' ? 'Description' : 'Beschreibung'}</span>
                            <span>${analysisResult.description}%</span>
                        </div>
                        <div class="distribution-bar">
                            <div class="distribution-fill description" style="width: ${analysisResult.description}%">
                                ${analysisResult.description > 15 ? analysisResult.description + '%' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="distribution-item">
                        <div class="distribution-label">
                            <span>${currentLanguage === 'en' ? 'Explanation' : 'Erklärung'}</span>
                            <span>${analysisResult.explanation}%</span>
                        </div>
                        <div class="distribution-bar">
                            <div class="distribution-fill explanation" style="width: ${analysisResult.explanation}%">
                                ${analysisResult.explanation > 15 ? analysisResult.explanation + '%' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="distribution-item">
                        <div class="distribution-label">
                            <span>${currentLanguage === 'en' ? 'Prediction' : 'Vorhersage'}</span>
                            <span>${analysisResult.prediction}%</span>
                        </div>
                        <div class="distribution-bar">
                            <div class="distribution-fill prediction" style="width: ${analysisResult.prediction}%">
                                ${analysisResult.prediction > 15 ? analysisResult.prediction + '%' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Process the feedback text
        text = text.trim();
        
        // Consolidate heading processing
        text = text.replace(/####\s+([^\n]+)/g, (match, p1) => `<h4 class="feedback-heading">${p1.trim()}</h4>`);
        
        // Format bold text
        text = text.replace(/\*\*(.+?)\*\*/g, (match, p1) => {
            const content = p1.trim();
            let className = '';
            
            // Determine class based on content
            if (content.match(/^(Strength|Stärke|Good|Gut):?$/i)) {
                className = 'feedback-strength';
            } else if (content.match(/^(Suggestions|Verbesserungsvorschläge|Tip|Tipp):?$/i)) {
                className = 'feedback-suggestion';
            } else if (content.match(/^(Why|Warum)\??:?$/i)) {
                className = 'feedback-why';
            }
            
            return `<strong${className ? ` class="${className}"` : ''}>${content}</strong>`;
        });
        
        // Format list items
        text = text.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
        
        // Wrap consecutive list items in ul tags
        text = text.replace(/(<li>.*?<\/li>\s*)+/g, (match) => `<ul>${match.trim()}</ul>`);
        
        // Add structure for sections
        let sections = text.split(/(?=<h4)/);
        text = sections.map(section => {
            if (section.startsWith('<h4')) {
                const h4EndIndex = section.indexOf('</h4>') + 5;
                const heading = section.substring(0, h4EndIndex);
                const content = section.substring(h4EndIndex);
                return `${heading}<div class="section-content">${content.trim()}</div>`;
            }
            return section;
        }).join('');
        
        // Replace newlines with <br>
        text = text.replace(/\n/g, '<br>');
        text = text.replace(/<br>\s*<br>/g, '<br>');
        text = text.replace(/^<br>|<br>$/g, '');
        
        return formattedText + text;
    }

    // Call OpenAI API
    async function callOpenAI(reflection, language, style, analysisResult) {
        console.log(`Using language: ${language}, style: ${style}`);
        const promptType = `${style} ${language === 'en' ? 'English' : 'German'}`;
        const systemPrompt = getSystemPrompt(promptType, analysisResult);
        
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
    function getSystemPrompt(promptType, analysisResult) {
        // Calculate which areas need more focus based on the analysis
        let focusAreas = [];
        if (analysisResult) {
            if (analysisResult.description < 30) focusAreas.push('description');
            if (analysisResult.explanation < 30) focusAreas.push('explanation');
            if (analysisResult.prediction < 20) focusAreas.push('prediction');
        }
        
        const focusInstruction = focusAreas.length > 0 
            ? `\n\nIMPORTANT: The student's reflection shows the following distribution: Description ${analysisResult.description}%, Explanation ${analysisResult.explanation}%, Prediction ${analysisResult.prediction}%. Please emphasize feedback on improving ${focusAreas.join(' and ')} aspects.`
            : '';

        const prompts = {
            'academic English': `I will analyze student teacher reflections on teaching videos. My task is to generate high-quality feedback as a supportive yet rigorous teaching mentor. The feedback must fulfill four quality dimensions:

1.  **Specificity**: Refer to particular statements and passages in the student's text (e.g., by quoting if possible), avoiding vague phrases.
2.  **Constructive suggestions**: Provide realistic, actionable suggestions for improvement (e.g., "To improve further, you could..."), not just critique.
3.  **Explanations/Justifications**: Ground feedback in educational psychology concepts or research (e.g., concepts like wait time, cognitive activation, scaffolding, feedback quality; or citing relevant authors if applicable from provided context) whenever possible to explain why suggestions matter.
4.  **Clarity**: Ensure your feedback uses clear, structured language appropriate for early-stage education students.

My target audience is student teachers developing their professional vision. "Analysis" means professional vision:
- **Description**: Accurately noting what happened.
- **Explanation**: Interpreting events using educational theory.
- **Prediction**: Forecasting effects on student learning.${focusInstruction}

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
- **Prediction**: Forecasting effects on student learning.${focusInstruction}

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
- **Vorhersage**: Prognose der Auswirkungen auf das Lernen der Schüler:innen.${focusInstruction ? focusInstruction.replace('Description', 'Beschreibung').replace('Explanation', 'Erklärung').replace('Prediction', 'Vorhersage').replace('improving', 'Verbesserung von') : ''}

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
- **Vorhersage**: Prognose der Auswirkungen auf das Lernen der Schüler:innen.${focusInstruction ? focusInstruction.replace('Description', 'Beschreibung').replace('Explanation', 'Erklärung').replace('Prediction', 'Vorhersage').replace('improving', 'Verbesserung von') : ''}

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
        feedbackExtended.innerHTML = '<p class="text-muted">Feedback will appear here after generation...</p>';
        feedbackShort.innerHTML = '<p class="text-muted">Feedback will appear here after generation...</p>';
        sessionStorage.removeItem('lastGeneratedReflectionIdForRating'); // Clear this as well
        sessionStorage.removeItem('reflection');
        sessionStorage.removeItem('feedbackExtended');
        sessionStorage.removeItem('feedbackShort');
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
        const currentFeedback = currentFeedbackType === 'extended' ? feedbackExtended : feedbackShort;
        const textToCopy = currentFeedback.innerText || currentFeedback.textContent;
        navigator.clipboard.writeText(textToCopy)
            .then(() => showAlert(currentLanguage === 'en' ? 'Feedback copied to clipboard!' : 'Feedback in Zwischenablage kopiert!', 'success'))
            .catch(err => {
                console.error('Could not copy text: ', err);
                showAlert(currentLanguage === 'en' ? 'Could not copy text. Please try again.' : 'Text konnte nicht kopiert werden. Bitte versuchen Sie es erneut.', 'danger');
            });
    }

    // Submit rating for feedback
    async function submitRating() {
        const reflectionId = sessionStorage.getItem('lastGeneratedReflectionIdForRating');
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
        
        // Get interaction tracking data
        const trackingData = getTimeTrackingSummary();
        
        try {
            console.log('Submitting ratings:', { feedbackRatingValue, usefulnessRatingValue });
            console.log('Interaction tracking:', trackingData);
            
            const { data, error } = await supabase
                .from('reflections')
                .update({ 
                    feedback_rating: feedbackRatingValue,
                    usefulness_rating: usefulnessRatingValue,
                    rated_at: new Date().toISOString(),
                    interaction_data: trackingData // Store interaction tracking
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
        // Capture which version was being viewed when revise was clicked
        const trackingData = getTimeTrackingSummary();
        console.log('Revise clicked while viewing:', trackingData.lastViewedVersion);
        console.log('Full tracking data at revise:', trackingData);
        
        // Store tracking data for this revision action
        if (currentReflectionId) {
            // Update the database with revision tracking data
            supabase
                .from('reflections')
                .update({ 
                    revision_initiated_from: trackingData.lastViewedVersion,
                    pre_revision_interaction: trackingData
                })
                .eq('id', currentReflectionId)
                .then(({ data, error }) => {
                    if (error) {
                        console.error('Error updating revision tracking:', error);
                    } else {
                        console.log('Revision tracking updated:', data);
                    }
                });
        }
        
        const previousReflection = sessionStorage.getItem('reflection');
        if (previousReflection) {
            reflectionText.value = previousReflection;
            showAlert('Your previous reflection has been loaded. Edit it here and click "Generate Feedback" for new feedback. This will be saved as a new entry.', 'info');
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