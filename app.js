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
        learn_key_concepts: "Learn the Key Concepts for Better Reflection",
        concepts_help: "Understanding these three dimensions will help you write more comprehensive teaching reflections",
        click_to_expand: "Click to expand and learn more",
        description: "Description",
        description_def: "Accurately observing and reporting what happened in the classroom - specific behaviors, interactions, and events without interpretation.",
        description_example: "\"The teacher asked a question and waited 3 seconds before calling on a student.\"",
        explanation: "Explanation",
        explanation_def: "Interpreting observed events using educational theory, research, and pedagogical knowledge - understanding why things happened.",
        explanation_example: "\"The wait time allowed students to formulate thoughtful responses, increasing participation.\"",
        prediction: "Prediction",
        prediction_def: "Anticipating future outcomes and effects on student learning based on observed teaching practices and their interpretations.",
        prediction_example: "\"This approach will likely encourage shy students to participate more in future discussions.\"",
        example: "Example:",
        reflection_input: "Student Teacher Reflection",
        paste_reflection: "Paste the student teacher's reflection here...",
        clear: "Clear",
        generated_feedback: "Generated Feedback",
        feedback_placeholder: "Feedback will appear here after generation...",
        extended: "Extended",
        short: "Short",
        copy: "Copy",
        revise_reflection: "Revise Reflection",
        rate_system: "Rate this system:",
        capabilities_meet: "This system's capabilities meet my requirements:",
        easy_to_use: "This system is easy to use:",
        submit_rating: "Submit Rating",
        umux_labels: ['', 'Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        distribution_summary: "Your reflection contains: {description}% description, {explanation}% explanation, and {prediction}% prediction.",
        distribution_summary_with_other: "Your reflection contains: {description}% description, {explanation}% explanation, {prediction}% prediction, and {other}% content outside of professional vision.",
        praise_prefix: "Good job on this reflection! You have a good balance of the core components of professional vision.",
        vision_warning: "Warning: A large portion of your text ({other}%) was outside the core professional vision components. For your next reflection, try to focus more on describing, explaining, and predicting.",
        no_changes_warning: "You clicked 'Revise Reflection' but haven't made any changes to the text. Please edit your reflection before generating new feedback, or the feedback will be identical to what you already received.",
        extended_tooltip: "Detailed academic feedback with comprehensive analysis and educational theory references",
        short_tooltip: "Concise, easy-to-read feedback with key points and practical tips",
        workflow_tooltip: "1. Enter name and select video. 2. Write reflection. 3. Generate feedback (Extended/Short). 4. View definitions below. 5. Copy feedback or revise reflection. 6. Rate the system.",
        generate_tooltip: "Generate both Extended (detailed academic) and Short (concise) feedback versions. Requires name and video selection.",
        words: "words",
        generate_description: "Generates both a detailed and a short feedback version."
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
        learn_key_concepts: "Lernen Sie die Schlüsselkonzepte für bessere Reflexion",
        concepts_help: "Das Verständnis dieser drei Dimensionen hilft Ihnen, umfassendere Unterrichtsreflexionen zu schreiben",
        click_to_expand: "Klicken Sie zum Erweitern und mehr erfahren",
        description: "Beschreibung",
        description_def: "Genaues Beobachten und Berichten des Geschehens im Klassenzimmer - spezifische Verhaltensweisen, Interaktionen und Ereignisse ohne Interpretation.",
        description_example: "\"Die Lehrkraft stellte eine Frage und wartete 3 Sekunden, bevor sie einen Schüler aufrief.\"",
        explanation: "Erklärung",
        explanation_def: "Interpretation von beobachteten Ereignissen mittels pädagogischer Theorie, Forschung und pädagogischem Wissen - Verstehen, warum Dinge passiert sind.",
        explanation_example: "\"Die Wartezeit ermöglichte es den Schülern, durchdachte Antworten zu formulieren und erhöhte die Beteiligung.\"",
        prediction: "Vorhersage",
        prediction_def: "Antizipation zukünftiger Ergebnisse und Auswirkungen auf das Lernen der Schüler basierend auf beobachteten Unterrichtspraktiken und deren Interpretationen.",
        prediction_example: "\"Dieser Ansatz wird wahrscheinlich schüchterne Schüler ermutigen, sich in zukünftigen Diskussionen mehr zu beteiligen.\"",
        example: "Beispiel:",
        reflection_input: "Reflexion des Lehramtsstudierenden",
        paste_reflection: "Fügen Sie hier die Reflexion des Lehramtsstudierenden ein...",
        clear: "Löschen",
        generated_feedback: "Generiertes Feedback",
        feedback_placeholder: "Feedback wird hier nach der Generierung angezeigt...",
        extended: "Erweitert",
        short: "Kurz",
        copy: "Kopieren",
        revise_reflection: "Reflexion überarbeiten",
        rate_system: "Bewerten Sie dieses System:",
        capabilities_meet: "Die Funktionen dieses Systems erfüllen meine Anforderungen:",
        easy_to_use: "Dieses System ist einfach zu bedienen:",
        submit_rating: "Bewertung abgeben",
        umux_labels: ['', 'Stimme überhaupt nicht zu', 'Stimme nicht zu', 'Neutral', 'Stimme zu', 'Stimme voll zu'],
        distribution_summary: "Ihre Reflexion enthält: {description}% Beschreibung, {explanation}% Erklärung und {prediction}% Vorhersage.",
        distribution_summary_with_other: "Ihre Reflexion enthält: {description}% Beschreibung, {explanation}% Erklärung, {prediction}% Vorhersage und {other}% Inhalt außerhalb der professionellen Unterrichtswahrnehmung.",
        praise_prefix: "Gute Arbeit bei dieser Reflexion! Sie haben eine gute Balance zwischen den Kernkomponenten der professionellen Unterrichtswhrnehmung.",
        vision_warning: "Warnung: Ein großer Teil Ihres Textes ({other}%) lag außerhalb der Kernkomponenten der professionellen Unterrichtswahrnehmung. Versuchen Sie bei Ihrer nächsten Reflexion, sich mehr auf das Beschreiben, Erklären und Vorhersagen zu konzentrieren.",
        no_changes_warning: "Sie haben 'Reflexion überarbeiten' geklickt, aber keine Änderungen am Text vorgenommen. Bitte bearbeiten Sie Ihre Reflexion, bevor Sie neues Feedback generieren, sonst wird das Feedback identisch zu dem bereits erhaltenen sein.",
        extended_tooltip: "Detailliertes akademisches Feedback mit umfassender Analyse und pädagogischen Theoriereferenzen",
        short_tooltip: "Prägnantes, leicht lesbares Feedback mit Kernpunkten und praktischen Tipps",
        workflow_tooltip: "1. Name eingeben und Video auswählen. 2. Reflexion schreiben. 3. Feedback generieren (Erweitert/Kurz). 4. Definitionen unten ansehen. 5. Feedback kopieren oder Reflexion überarbeiten. 6. System bewerten.",
        generate_tooltip: "Generieren Sie sowohl erweiterte (detaillierte akademische) als auch kurze (prägnante) Feedback-Versionen. Erfordert Name und Video-Auswahl.",
        words: "Wörter",
        generate_description: "Erzeugt sowohl eine detaillierte als auch eine kurze Feedback-Version."
    }
};

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const reviseReflectionBtn = document.getElementById('revise-reflection-btn');
    const reflectionText = document.getElementById('reflection-text');
    const wordCount = document.getElementById('word-count');
    const wordCountContainer = document.getElementById('word-count-container');
    const feedbackExtended = document.getElementById('feedback-extended');
    const feedbackShort = document.getElementById('feedback-short');
    const nameInput = document.getElementById('student-name');
    const videoSelect = document.getElementById('video-select');
    const submitRatingBtn = document.getElementById('submit-rating-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const capabilitiesRatingButtonsContainer = document.getElementById('capabilities-rating-buttons');
    const easeRatingButtonsContainer = document.getElementById('ease-rating-buttons');
    const capabilitiesRatingHoverLabel = document.getElementById('capabilities-rating-hover-label');
    const easeRatingHoverLabel = document.getElementById('ease-rating-hover-label');
    const feedbackTabs = document.querySelector('.feedback-tabs');
    const extendedTab = document.getElementById('extended-tab');
    const shortTab = document.getElementById('short-tab');
    const workflowInfoIcon = document.getElementById('workflow-info-icon');
    
    // Language and style selections
    const langEn = document.getElementById('lang-en');
    const langDe = document.getElementById('lang-de');

    let currentCapabilitiesRating = null;
    let currentEaseRating = null;
    let currentLanguage = 'en';
    let currentFeedbackType = 'extended'; // Track which feedback is currently shown
    
    // Tracking variables for user interaction
    let tabSwitchCount = 0;
    let timeTracking = {
        extended: { totalTime: 0, lastStarted: null },
        short: { totalTime: 0, lastStarted: null }
    };
    let currentReflectionId = null;
    let currentAnalysisResult = null; // Store analysis result for display
    let definitionsExpanded = false; // Track if definitions were expanded
    let revisionInitiated = false; // Track if user clicked revise
    let originalReflectionForRevision = null; // Store original text when revise is clicked

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

    reflectionText.addEventListener('input', () => {
        const text = reflectionText.value.trim();
        const words = text === '' ? 0 : text.split(/\s+/).filter(Boolean).length;
        wordCount.textContent = words;
    });

    // Track definitions expansion
    const definitionsHeader = document.querySelector('.definitions-header');
    definitionsHeader.addEventListener('click', () => {
        definitionsExpanded = !definitionsExpanded;
        console.log('Definitions expanded:', definitionsExpanded);
        
        // Update interaction data if we have a current reflection
        if (currentReflectionId) {
            updateDefinitionsInteraction();
        }
    });

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

        // Update word count label
        const wordCountLabel = wordCountContainer.childNodes[2];
        if (wordCountLabel) {
            wordCountLabel.textContent = ` ${trans.words}`;
        }
    }

    // Function to update tooltips based on language
    function updateTooltips(lang) {
        const tooltipTexts = {
            en: {
                clear: "Clear the reflection text",
                copy: "Copy feedback to clipboard",
                revise: "Edit your reflection in the main text area and generate new feedback",
                submit: "Submit your rating of the feedback"
            },
            de: {
                clear: "Reflexionstext löschen",
                copy: "Feedback in Zwischenablage kopieren",
                revise: "Bearbeiten Sie Ihre Reflexion im Haupttextbereich und generieren Sie neues Feedback",
                submit: "Senden Sie Ihre Bewertung des Feedbacks"
            }
        };
        
        const texts = tooltipTexts[lang];
        const trans = translations[lang];
        
        generateBtn.setAttribute('title', trans.generate_tooltip);
        clearBtn.setAttribute('title', texts.clear);
        copyBtn.setAttribute('title', texts.copy);
        reviseReflectionBtn.setAttribute('title', texts.revise);
        submitRatingBtn.setAttribute('title', texts.submit);
        
        // Update workflow info tooltip
        workflowInfoIcon.setAttribute('title', trans.workflow_tooltip);
        
        // Reinitialize tooltips for regular elements
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(function (tooltipTriggerEl) {
            const existingTooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
            if (existingTooltip) {
                existingTooltip.dispose();
            }
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // Handle tab tooltips separately (since they use data-bs-toggle="tab")
        [extendedTab, shortTab].forEach(tabEl => {
            const existingTooltip = bootstrap.Tooltip.getInstance(tabEl);
            if (existingTooltip) {
                existingTooltip.dispose();
            }
        });

        new bootstrap.Tooltip(extendedTab, {
            title: trans.extended_tooltip,
            placement: 'top'
        });
        
        new bootstrap.Tooltip(shortTab, {
            title: trans.short_tooltip,
            placement: 'top'
        });

        // Manually trigger word count update on load if there's text
        reflectionText.dispatchEvent(new Event('input'));
    }

    // Function to update rating labels
    function updateRatingLabels() {
        const labels = translations[currentLanguage];
        // Update hover labels if ratings are selected
        if (currentCapabilitiesRating !== null) {
            capabilitiesRatingHoverLabel.textContent = labels.umux_labels[currentCapabilitiesRating];
        }
        if (currentEaseRating !== null) {
            easeRatingHoverLabel.textContent = labels.umux_labels[currentEaseRating];
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

    // Initialize language first to set up tooltips properly
    updateLanguage('en');
    
    // Function to create rating buttons
    function createRatingButtons(container, count, groupName) {
        container.innerHTML = ''; // Clear existing buttons
        const labels = translations[currentLanguage].umux_labels;
        const hoverLabelElement = groupName === 'capabilities' ? capabilitiesRatingHoverLabel : easeRatingHoverLabel;

        for (let i = 1; i <= count; i++) {
            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('btn', 'btn-outline-secondary', 'btn-rating');
            button.textContent = i;
            button.dataset.value = i;
            button.addEventListener('click', function() {
                handleRatingButtonClick(this, groupName, labels[i]);
            });
            button.addEventListener('mouseover', function() {
                hoverLabelElement.textContent = labels[i];
            });
            button.addEventListener('mouseout', function() {
                const currentRating = groupName === 'capabilities' ? currentCapabilitiesRating : currentEaseRating;
                if (currentRating !== null) {
                    hoverLabelElement.textContent = labels[currentRating];
                } else {
                    hoverLabelElement.textContent = '';
                }
            });
            container.appendChild(button);
        }
    }

    // Handle rating button click
    function handleRatingButtonClick(button, groupName, labelText) {
        const value = parseInt(button.dataset.value);
        const buttonsInGroup = button.parentElement.querySelectorAll('.btn-rating');
        const hoverLabelElement = groupName === 'capabilities' ? capabilitiesRatingHoverLabel : easeRatingHoverLabel;
        
        buttonsInGroup.forEach((btn) => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-outline-secondary');
        });
        
        button.classList.remove('btn-outline-secondary');
        button.classList.add('active', 'btn-primary');
        
        if (groupName === 'capabilities') {
            currentCapabilitiesRating = value;
        } else if (groupName === 'ease') {
            currentEaseRating = value;
        }
        hoverLabelElement.textContent = labelText;
    }

    // Initialize rating buttons
    createRatingButtons(capabilitiesRatingButtonsContainer, 5, 'capabilities');
    createRatingButtons(easeRatingButtonsContainer, 5, 'ease');

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
            lastViewedVersion: currentFeedbackType,
            definitionsExpanded: definitionsExpanded
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
        definitionsExpanded = false;
        revisionInitiated = false;
        originalReflectionForRevision = null;
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

        // Check if user clicked revise but didn't actually change the reflection
        if (revisionInitiated && originalReflectionForRevision && reflectionText.value.trim() === originalReflectionForRevision.trim()) {
            showAlert(translations[currentLanguage].no_changes_warning, 'warning');
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
            currentAnalysisResult = analysisResult; // Store for later use
            
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
            currentCapabilitiesRating = null;
            currentEaseRating = null;
            createRatingButtons(capabilitiesRatingButtonsContainer, 5, 'capabilities');
            createRatingButtons(easeRatingButtonsContainer, 5, 'ease');
            capabilitiesRatingHoverLabel.textContent = '';
            easeRatingHoverLabel.textContent = '';
            
            // Reset word count on clear
            reflectionText.dispatchEvent(new Event('input'));
            
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
            ? `Analyze this teaching reflection and determine the percentage distribution of content across four categories:
               1. Description (noting what happened)
               2. Explanation (interpreting using theory)
               3. Prediction (forecasting effects)
               4. Other (content that does not fit the other three, i.e., content outside of professional vision)
               
               Return ONLY a JSON object with percentages that sum to 100, like: {"description": 40, "explanation": 35, "prediction": 20, "other": 5}`
            : `Analysieren Sie diese Unterrichtsreflexion und bestimmen Sie die prozentuale Verteilung des Inhalts über vier Kategorien:
               1. Beschreibung (Beobachtung des Geschehens)
               2. Erklärung (Interpretation mit Theorie)
               3. Vorhersage (Prognose der Auswirkungen)
               4. Sonstiges (Inhalte, die nicht in die anderen drei Kategorien passen, d.h. Inhalte außerhalb der professionellen Unterrichtswahrnehmung)
               
               Geben Sie NUR ein JSON-Objekt mit Prozentsätzen zurück, die sich zu 100 addieren, wie: {"description": 40, "explanation": 35, "prediction": 20, "other": 5}`;

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
            return { description: 33, explanation: 33, prediction: 34, other: 0 };
        } catch (error) {
            console.error('Error in reflection analysis:', error);
            // Return default distribution if analysis fails
            return { description: 33, explanation: 33, prediction: 34, other: 0 };
        }
    }

    // Format feedback text with proper HTML
    function formatFeedback(text, analysisResult = null) {
        if (!text) return '';
        
        let formattedText = '';
        
        // Add analysis distribution visualization if available
        if (analysisResult) {
            let distributionText;
            const trans = translations[currentLanguage];

            if (analysisResult.other > 0) {
                distributionText = trans.distribution_summary_with_other
                    .replace('{description}', analysisResult.description)
                    .replace('{explanation}', analysisResult.explanation)
                    .replace('{prediction}', analysisResult.prediction)
                    .replace('{other}', analysisResult.other);
            } else {
                distributionText = trans.distribution_summary
                    .replace('{description}', analysisResult.description)
                    .replace('{explanation}', analysisResult.explanation)
                    .replace('{prediction}', analysisResult.prediction);
            }
            
            const sectionTitle = currentLanguage === 'en' ? 'Analysis Distribution:' : 'Analyse-Verteilung:';
            
            formattedText += `<div class="analysis-distribution-compact"><div class="distribution-text-compact"><strong>${sectionTitle}</strong> ${distributionText}</div></div>`;
        }
        
        // Process the feedback text
        text = text.trim();
        
        // Consolidate heading processing
        text = text.replace(/####\s+([^\n]+)/g, (match, p1) => `<h4>${p1.trim()}</h4>`);
        
        // Format bold text with proper color classes
        text = text.replace(/\*\*(.+?)\*\*/g, (match, p1) => {
            const content = p1.trim();
            
            // Check if it's one of our keywords - more flexible matching
            if (content.match(/^(Strength|Stärke|Good|Gut|Suggestions?|Verbesserungsvorschläge?|Tip|Tipp|Why|Warum)\??:?\s*$/i)) {
                return `<strong class="feedback-keyword">${content}</strong>`;
            }
            
            // For other bold text, just return without special class
            return `<strong>${content}</strong>`;
        });
        
        // Also catch keywords that might not be in ** format
        text = text.replace(/\b(Good|Gut|Tip|Tipp|Why|Warum|Strength|Stärke|Suggestions?|Verbesserungsvorschläge?)\s*:/gi, (match, keyword) => {
            return `<strong class="feedback-keyword">${keyword}:</strong>`;
        });
        
        // Specifically ensure "Why?" and "Warum?" are bolded even without colon
        text = text.replace(/\b(Why\?|Warum\?)/gi, (match, keyword) => {
            return `<strong class="feedback-keyword">${keyword}</strong>`;
        });
        
        // Format list items
        text = text.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
        
        // Wrap consecutive list items in ul tags
        text = text.replace(/(<li>.*?<\/li>\s*)+/g, (match) => `<ul>${match.trim()}</ul>`);
        
        // Add structure for sections with new color-coded classes
        let sections = text.split(/(?=<h4>)/);
        text = sections.map(section => {
            if (section.startsWith('<h4>')) {
                const h4EndIndex = section.indexOf('</h4>') + 5;
                const heading = section.substring(0, h4EndIndex);
                const content = section.substring(h4EndIndex);
                let sectionClass = 'feedback-section';
                
                if (heading.includes('Description') || heading.includes('Beschreibung')) {
                    sectionClass += ' feedback-section-description';
                } else if (heading.includes('Explanation') || heading.includes('Erklärung')) {
                    sectionClass += ' feedback-section-explanation';
                } else if (heading.includes('Prediction') || heading.includes('Vorhersage')) {
                    sectionClass += ' feedback-section-prediction';
                } else if (heading.includes('Other') || heading.includes('Sonstiges')) {
                    sectionClass += ' feedback-section-other';
                } else if (heading.includes('Overall') || heading.includes('Gesamtbewertung')) {
                    sectionClass += ' feedback-section-overall';
                }

                return `<div class="${sectionClass}">${heading}<div class="section-content">${content.trim()}</div></div>`;
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
        let initialInstruction = '';
        const lang = promptType.includes('English') ? 'en' : 'de';
        const trans = translations[lang];

        if (analysisResult) {
            const { description, explanation, prediction, other } = analysisResult;
            const visionTotal = description + explanation + prediction;

            if (visionTotal < 50) {
                initialInstruction = trans.vision_warning.replace('{other}', other);
            } else if (description > 20 && explanation > 20 && prediction > 10) {
                initialInstruction = trans.praise_prefix;
            }

            // Add instruction to focus on weak areas
            let focusAreas = [];
            if (description < 25) focusAreas.push(trans.description.toLowerCase());
            if (explanation < 25) focusAreas.push(trans.explanation.toLowerCase());
            if (prediction < 15) focusAreas.push(trans.prediction.toLowerCase());

            if (focusAreas.length > 0) {
                const focusJoiner = lang === 'de' ? ' und ' : ' and ';
                const focusAreasString = focusAreas.join(focusJoiner);
                const improveInstruction = lang === 'de' 
                    ? `\nIhre Reflexion ist in den Bereichen ${focusAreasString} schwächer. Bitte geben Sie in diesen Bereichen besonders detailliertes Feedback.`
                    : `\nYour reflection is weaker in the ${focusAreasString} areas. Please provide especially detailed feedback in these sections.`;
                initialInstruction += improveInstruction;
            }
        }
        
        const baseSystemMessage = initialInstruction ? `${initialInstruction}\n\n` : '';

        const prompts = {
            'academic English': baseSystemMessage + `You are a supportive yet rigorous teaching mentor. Your main task is to analyze a student teacher's reflection on a teaching video and provide high-quality feedback based on the following quality dimensions and structure.

**Quality Dimensions:**
1.  **Specificity**: Refer to particular statements and passages in the student's text.
2.  **Constructive suggestions**: Provide realistic, actionable suggestions for improvement.
3.  **Explanations/Justifications**: Ground feedback in educational psychology concepts or research.
4.  **Clarity**: Use clear, structured language appropriate for early-stage education students.

**Core Content (Professional Vision):**
- **Description**: Accurately noting what happened.
- **Explanation**: Interpreting events using educational theory.
- **Prediction**: Forecasting effects on student learning.

**FORMATTING REQUIREMENTS:**
- Address the student directly (e.g., "Your analysis...").
- Include these four sections exactly: "#### Description", "#### Explanation", "#### Prediction", and "#### Overall Assessment and Next Steps".
- **For "Description"**: Do NOT judge the quality (e.g., avoid "good description"). State what was described and suggest other things to focus on.
- **For each section**: Use these exact sub-headings: "Strength:", "Suggestions:", and "Why?:".
- Use well-structured English. Avoid emoticons.`,
            
            'user-friendly English': baseSystemMessage + `You are a supportive teaching mentor. Your main task is to give simple, clear, and brief feedback on a student teacher's reflection.

**Core Content (Professional Vision):**
- **Description**: What happened?
- **Explanation**: Why did it happen (using simple theory)?
- **Prediction**: What will happen next?

**FORMATTING REQUIREMENTS (VERY IMPORTANT):**
- Be brief and easy to understand.
- Address the student directly (e.g., "Your reflection...").
- **For "Description"**: Don't say "good" or "bad." Just note what was described and give a tip.
- For EACH section ("#### Description", "#### Explanation", "#### Prediction", "#### Overall Assessment and Next Steps"), use these exact labels: "Good:", "Tip:", and "Why?:".
- Respond only in English. Avoid emoticons.`,

            'academic German': baseSystemMessage + `Sie sind ein unterstützender, aber dennoch kritischer Mentor. Ihre Hauptaufgabe ist es, die Reflexion eines Lehramtsstudierenden zu analysieren und qualitativ hochwertiges Feedback zu geben, das auf den folgenden Qualitätsdimensionen und der Struktur basiert.

**Qualitätsdimensionen:**
1.  **Spezifität**: Beziehen Sie sich auf konkrete Aussagen/Textpassagen.
2.  **Konstruktive Vorschläge**: Geben Sie realistische, umsetzbare Verbesserungsvorschläge.
3.  **Erklärungen/Begründungen**: Begründen Sie Feedback mit Konzepten der Pädagogischen Psychologie.
4.  **Verständlichkeit**: Verwenden Sie eine klare, strukturierte Sprache.

**Kerninhalte (Professionelle Unterrichtswahrnehmung):**
- **Beschreibung**: Genaues Beobachten des Geschehens.
- **Erklärung**: Interpretation von Ereignissen mittels pädagogischer Theorien.
- **Vorhersage**: Prognose der Auswirkungen auf das Lernen.

**FORMATIERUNGSANFORDERUNGEN:**
- Sprechen Sie die Studierenden direkt an (z.B. "Ihre Analyse...").
- Fügen Sie genau diese vier Abschnitte ein: "#### Beschreibung", "#### Erklärung", "#### Vorhersage", und "#### Gesamtbewertung und nächste Schritte".
- **Für "Beschreibung"**: Beurteilen Sie NICHT die Qualität (z.B. vermeiden Sie "gute Beschreibung"). Geben Sie an, was beschrieben wurde, und schlagen Sie andere Schwerpunkte vor.
- **Für jeden Abschnitt**: Verwenden Sie genau diese Unterüberschriften: "Stärke:", "Verbesserungsvorschläge:", und "Warum?:".
- Achten Sie auf gut strukturiertes Deutsch. Vermeiden Sie Emoticons.`,

            'user-friendly German': baseSystemMessage + `Sie sind ein unterstützender Mentor. Ihre Hauptaufgabe ist es, einfaches, klares und kurzes Feedback zur Reflexion eines Lehramtsstudierenden zu geben.

**Kerninhalte (Professionelle Unterrichtswahrnehmung):**
- **Beschreibung**: Was ist passiert?
- **Erklärung**: Warum ist es passiert (mit einfacher Theorie)?
- **Vorhersage**: Was wird als nächstes passieren?

**FORMATIERUNGSANFORDERUNGEN (SEHR WICHTIG):**
- Seien Sie kurz und leicht verständlich.
- Sprechen Sie die Studierenden direkt an (z.B. "Deine Reflexion...").
- **Für "Beschreibung"**: Sagen Sie nicht "gut" oder "schlecht". Notieren Sie nur, was beschrieben wurde und geben Sie einen Tipp.
- Für JEDEN Abschnitt ("#### Beschreibung", "#### Erklärung", "#### Vorhersage", "#### Gesamtbewertung und nächste Schritte"), verwenden Sie diese exakten Bezeichnungen: "Gut:", "Tipp:", und "Warum?:".
- Antworten Sie nur auf Deutsch. Vermeiden Sie Emoticons.`
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
        // Manually trigger word count update
        reflectionText.dispatchEvent(new Event('input'));

        feedbackExtended.innerHTML = `<p class="text-muted" data-lang-key="feedback_placeholder">${translations[currentLanguage].feedback_placeholder}</p>`;
        feedbackShort.innerHTML = `<p class="text-muted" data-lang-key="feedback_placeholder">${translations[currentLanguage].feedback_placeholder}</p>`;
        sessionStorage.removeItem('lastGeneratedReflectionIdForRating');
        sessionStorage.removeItem('reflection');
        sessionStorage.removeItem('feedbackExtended');
        sessionStorage.removeItem('feedbackShort');
        reviseReflectionBtn.style.display = 'none';
        currentCapabilitiesRating = null;
        currentEaseRating = null;
        currentAnalysisResult = null;
        revisionInitiated = false;
        originalReflectionForRevision = null;
        createRatingButtons(capabilitiesRatingButtonsContainer, 5, 'capabilities');
        createRatingButtons(easeRatingButtonsContainer, 5, 'ease');
        capabilitiesRatingHoverLabel.textContent = '';
        easeRatingHoverLabel.textContent = '';
        feedbackTabs.classList.add('d-none');
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
            showAlert(currentLanguage === 'en' ? 'Please generate feedback first before rating.' : 'Bitte generieren Sie zuerst Feedback, bevor Sie bewerten.', 'warning');
             if (!generateBtn.disabled) {
                generateBtn.classList.add('btn-pulse');
                setTimeout(() => generateBtn.classList.remove('btn-pulse'), 2000);
            }
            return;
        }
        
        const capabilitiesRatingValue = currentCapabilitiesRating;
        const easeRatingValue = currentEaseRating;
        
        if (capabilitiesRatingValue === null || easeRatingValue === null) {
            showAlert(currentLanguage === 'en' ? 'Please select ratings for both questions before submitting.' : 'Bitte wählen Sie Bewertungen für beide Fragen aus, bevor Sie absenden.', 'warning');
            return;
        }
        
        // Get interaction tracking data
        const trackingData = getTimeTrackingSummary();
        
        // Calculate UMUX-Lite score
        const umuxScore = ((capabilitiesRatingValue - 1) + (easeRatingValue - 1)) * 100 / 8;
        
        try {
            console.log('Submitting ratings:', { capabilitiesRatingValue, easeRatingValue, umuxScore });
            console.log('Interaction tracking:', trackingData);
            
            const { data, error } = await supabase
                .from('reflections')
                .update({ 
                    capabilities_rating: capabilitiesRatingValue,
                    ease_rating: easeRatingValue,
                    umux_score: umuxScore,
                    rated_at: new Date().toISOString(),
                    interaction_data: trackingData // Store interaction tracking
                })
                .eq('id', reflectionId)
                .select();

            if (error) {
                // Check if it's a missing column error
                if (error.code === 'PGRST204' || error.message.includes('capabilities_rating') || error.message.includes('column')) {
                    const errorMsg = currentLanguage === 'en' 
                        ? 'Database needs to be updated for the rating system. Please check DATABASE_UPDATE_INSTRUCTIONS.md or contact support.'
                        : 'Die Datenbank muss für das Bewertungssystem aktualisiert werden. Bitte prüfen Sie DATABASE_UPDATE_INSTRUCTIONS.md oder kontaktieren Sie den Support.';
                    showAlert(errorMsg, 'danger');
                    console.error('Database schema error - missing rating columns:', error);
                    return;
                }
                throw error;
            }
            
            console.log('Rating update response:', data);
            showAlert(currentLanguage === 'en' ? 'Thank you for your feedback!' : 'Vielen Dank für Ihr Feedback!', 'success');
            
        } catch (error) {
            console.error('Error submitting rating:', error);
            
            // Provide more specific error messages
            let errorMessage;
            if (error.message.includes('column') || error.code === 'PGRST204') {
                errorMessage = currentLanguage === 'en' 
                    ? 'Database schema error. Please update the database using the instructions in DATABASE_UPDATE_INSTRUCTIONS.md'
                    : 'Datenbankschema-Fehler. Bitte aktualisieren Sie die Datenbank mit den Anweisungen in DATABASE_UPDATE_INSTRUCTIONS.md';
            } else {
                errorMessage = currentLanguage === 'en' 
                    ? 'Error submitting rating. Please try again.' 
                    : 'Fehler beim Senden der Bewertung. Bitte versuchen Sie es erneut.';
            }
            
            showAlert(errorMessage, 'danger');
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
            // Set revision tracking variables
            revisionInitiated = true;
            originalReflectionForRevision = previousReflection;
            
            const message = currentLanguage === 'en' 
                ? 'Your previous reflection has been loaded. Edit it here and click "Generate Feedback" for new feedback. This will be saved as a new entry.'
                : 'Ihre vorherige Reflexion wurde geladen. Bearbeiten Sie sie hier und klicken Sie auf "Feedback generieren" für neues Feedback. Dies wird als neuer Eintrag gespeichert.';
            showAlert(message, 'info');
        } else {
            const message = currentLanguage === 'en' 
                ? 'No previous reflection found in this session to load.'
                : 'Keine vorherige Reflexion in dieser Sitzung gefunden.';
            showAlert(message, 'warning');
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

    // Function to update definitions interaction in database
    async function updateDefinitionsInteraction() {
        if (!currentReflectionId || !supabase) return;
        
        try {
            const { data: currentData, error: fetchError } = await supabase
                .from('reflections')
                .select('interaction_data')
                .eq('id', currentReflectionId)
                .single();
            
            if (fetchError) {
                console.error('Error fetching current interaction data:', fetchError);
                return;
            }
            
            const interactionData = currentData.interaction_data || {};
            interactionData.definitionsExpanded = true;
            interactionData.definitionsExpandedAt = new Date().toISOString();
            
            const { error: updateError } = await supabase
                .from('reflections')
                .update({ interaction_data: interactionData })
                .eq('id', currentReflectionId);
            
            if (updateError) {
                console.error('Error updating definitions interaction:', updateError);
            }
        } catch (error) {
            console.error('Error in updateDefinitionsInteraction:', error);
        }
    }

}); /* Force rebuild - Wed May 28 01:35:00 CST 2025 - Removed theories from user-friendly versions */
