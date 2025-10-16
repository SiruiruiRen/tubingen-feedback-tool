// INFER - Simplified Version with In-Between Surveys
// Removes: Welcome/consent, pre-survey, and final survey
// Keeps: Video Intro → Task 1 → Survey 1 → Task 2 → Survey 2 → Complete
//
// DATA COLLECTION:
// - All binary classification results stored in Supabase database
// - All user interactions (clicks, navigations) logged to Supabase
// - Reflection data and feedback stored in Supabase
// - Backup: Also stored in localStorage for redundancy

// Constants and configuration
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const CORS_PROXY_URL = isProduction 
    ? 'https://tubingen-feedback-cors-proxy.onrender.com'
    : 'http://localhost:3000';
const OPENAI_API_URL = `${CORS_PROXY_URL}/api/openai/v1/chat/completions`;
const model = 'gpt-4o';

// Supabase configuration
const SUPABASE_URL = 'https://immrkllzjvhdnzesmaat.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbXJrbGx6anZoZG56ZXNtYWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzk2MzgsImV4cCI6MjA2Mjc1NTYzOH0.glhn-u4mNpKHsH6qiwdecXyYOWhdxDrTVDIvNivKVf8';

// Page flow configuration
const STUDY_PAGES = ['video-intro', 'task1', 'survey1', 'task2', 'survey2', 'thankyou'];
const PROGRESS_VALUES = {
    'video-intro': 0,
    'task1': 16,
    'survey1': 33,
    'task2': 50,
    'survey2': 66,
    'thankyou': 100
};

let currentPage = 'video-intro';
let currentLanguage = 'en';
let userPreferredFeedbackStyle = 'extended';
let currentSessionId = null;
let supabase = null;

// Task state management
const TaskState = {
    task1: {
        feedbackGenerated: false,
        submitted: false,
        currentReflectionId: null,
        parentReflectionId: null,
        revisionCount: 0
    },
    task2: {
        feedbackGenerated: false,
        submitted: false,
        currentReflectionId: null,
        parentReflectionId: null,
        revisionCount: 0
    }
};

// Language translations
const translations = {
    en: {
        task1_title: "INFER Task 1",
        task1_subtitle: "Analyze your teaching reflection and receive feedback",
        task2_title: "INFER Task 2",
        task2_subtitle: "Analyze your second teaching reflection and receive feedback",
        survey1_title: "Post-Task 1 Survey",
        survey1_subtitle: "Please share your thoughts about the first task",
        survey2_title: "Post-Task 2 Survey",
        survey2_subtitle: "Please share your thoughts about the second task",
        settings: "Settings",
        your_name: "Your Name:",
        enter_name: "Enter your name",
        video_watched: "Video Watched:",
        select_video: "Select a video...",
        language: "Language:",
        generate_feedback: "Generate Feedback",
        reflection_input: "Student Teacher Reflection",
        paste_reflection: "Paste the student teacher's reflection here...",
        clear: "Clear",
        generated_feedback: "Generated Feedback",
        feedback_placeholder: "Feedback will appear here after generation...",
        extended: "Extended",
        short: "Short",
        copy: "Copy",
        revise_reflection: "Revise Reflection",
        submit_final: "Submit Final Reflection",
        words: " words",
        learn_key_concepts: "Learn the Key Concepts for Better Reflection",
        concepts_help: "Understanding these three dimensions will help you write more comprehensive teaching reflections",
        description: "Description",
        description_def: "Accurately observing and reporting what happened in the classroom - specific behaviors, interactions, and events without interpretation.",
        explanation: "Explanation",
        explanation_def: "Interpreting observed events using educational theory, research, and pedagogical knowledge - understanding why things happened.",
        prediction: "Prediction",
        prediction_def: "Anticipating future outcomes and effects on student learning based on observed teaching practices and their interpretations.",
        choose_feedback_style: "Choose Your Preferred Feedback Style",
        feedback_style_intro: "We generate two types of feedback. Which would you like to see first?",
        extended_description: "Detailed academic feedback with comprehensive analysis and educational theory references",
        short_description: "Concise, easy-to-read feedback with key points and practical tips",
        can_switch_later: "You can switch between both styles anytime using the tabs after feedback is generated.",
        select_extended: "Start with Extended",
        select_short: "Start with Short",
        confirm_final_submission: "Confirm Final Submission",
        final_submission_warning: "Are you sure you want to submit your final reflection? After submission, you won't be able to make any more changes to this task.",
        final_submission_note: "You can continue revising your reflection until you're satisfied, then click this button when you're ready to move on.",
        continue_editing: "Continue Editing",
        confirm_submit: "Yes, Submit Final",
        continue_to_task2: "Continue to Task 2",
        complete_study: "Complete Study",
        survey1_heading: "Post-Task 1 Survey",
        survey1_description: "Please share your thoughts about your experience with Task 1. This takes about 3-5 minutes.",
        survey1_instructions: "Instructions: Complete the survey above, then click \"Continue to Task 2\" below to proceed.",
        survey2_heading: "Post-Task 2 Survey",
        survey2_description: "Please share your thoughts about your experience with Task 2. This takes about 3-5 minutes.",
        survey2_instructions: "Final Step: Complete the survey above, then click \"Complete Study\" below to finish.",
        citation_header: "Citation",
        loading_messages: [
            "Please wait while the little elves create your feedback...",
            "Almost there, we promise...",
            "Computing the secret to the universe...",
            "Still making progress, don't leave yet!",
            "Grab a coffee and come back in a minute?"
        ]
    },
    de: {
        task1_title: "INFER Aufgabe 1",
        task1_subtitle: "Analysieren Sie Ihre Unterrichtsreflexion und erhalten Sie Feedback",
        task2_title: "INFER Aufgabe 2",
        task2_subtitle: "Analysieren Sie Ihre zweite Unterrichtsreflexion und erhalten Sie Feedback",
        survey1_title: "Umfrage nach Aufgabe 1",
        survey1_subtitle: "Bitte teilen Sie Ihre Gedanken zur ersten Aufgabe mit",
        survey2_title: "Umfrage nach Aufgabe 2",
        survey2_subtitle: "Bitte teilen Sie Ihre Gedanken zur zweiten Aufgabe mit",
        settings: "Einstellungen",
        your_name: "Ihr Name:",
        enter_name: "Geben Sie Ihren Namen ein",
        video_watched: "Angesehenes Video:",
        select_video: "Wählen Sie ein Video...",
        language: "Sprache:",
        generate_feedback: "Feedback generieren",
        reflection_input: "Reflexionstext",
        paste_reflection: "Fügen Sie hier Ihre Reflexion ein...",
        clear: "Löschen",
        generated_feedback: "Generiertes Feedback",
        feedback_placeholder: "Feedback wird hier nach der Generierung angezeigt...",
        extended: "Erweitert",
        short: "Kurz",
        copy: "Kopieren",
        revise_reflection: "Reflexion überarbeiten",
        submit_final: "Endgültige Reflexion einreichen",
        words: " Wörter",
        learn_key_concepts: "Lernen Sie die Schlüsselkonzepte für bessere Reflexion",
        concepts_help: "Das Verständnis dieser drei Dimensionen hilft Ihnen, umfassendere Unterrichtsreflexionen zu schreiben",
        description: "Beschreibung",
        description_def: "Genaues Beobachten und Berichten des Geschehens im Klassenzimmer - spezifische Verhaltensweisen, Interaktionen und Ereignisse ohne Interpretation.",
        explanation: "Erklärung",
        explanation_def: "Interpretation von beobachteten Ereignissen mittels pädagogischer Theorie, Forschung und pädagogischem Wissen - Verstehen, warum Dinge passiert sind.",
        prediction: "Vorhersage",
        prediction_def: "Antizipation zukünftiger Ergebnisse und Auswirkungen auf das Lernen der Schüler basierend auf beobachteten Unterrichtspraktiken und deren Interpretationen.",
        choose_feedback_style: "Wählen Sie Ihren bevorzugten Feedback-Stil",
        feedback_style_intro: "Wir generieren zwei Arten von Feedback. Welches möchten Sie zuerst sehen?",
        extended_description: "Detailliertes akademisches Feedback mit umfassender Analyse und pädagogischen Theoriereferenzen",
        short_description: "Prägnantes, leicht lesbares Feedback mit Kernpunkten und praktischen Tipps",
        can_switch_later: "Sie können jederzeit zwischen beiden Stilen wechseln, nachdem das Feedback generiert wurde.",
        select_extended: "Mit Erweitert beginnen",
        select_short: "Mit Kurz beginnen",
        confirm_final_submission: "Endgültige Einreichung bestätigen",
        final_submission_warning: "Sind Sie sicher, dass Sie Ihre endgültige Reflexion einreichen möchten? Nach der Einreichung können Sie keine Änderungen mehr an dieser Aufgabe vornehmen.",
        final_submission_note: "Sie können Ihre Reflexion weiterhin überarbeiten, bis Sie zufrieden sind. Klicken Sie dann auf diese Schaltfläche, wenn Sie bereit sind, fortzufahren.",
        continue_editing: "Weiter bearbeiten",
        confirm_submit: "Ja, endgültig einreichen",
        continue_to_task2: "Weiter zu Aufgabe 2",
        complete_study: "Studie abschließen",
        survey1_heading: "Umfrage nach Aufgabe 1",
        survey1_description: "Bitte teilen Sie Ihre Gedanken zu Ihrer Erfahrung mit Aufgabe 1 mit. Dies dauert ca. 3-5 Minuten.",
        survey1_instructions: "Anleitung: Füllen Sie die Umfrage oben aus und klicken Sie dann unten auf \"Weiter zu Aufgabe 2\", um fortzufahren.",
        survey2_heading: "Umfrage nach Aufgabe 2",
        survey2_description: "Bitte teilen Sie Ihre Gedanken zu Ihrer Erfahrung mit Aufgabe 2 mit. Dies dauert ca. 3-5 Minuten.",
        survey2_instructions: "Letzter Schritt: Füllen Sie die Umfrage oben aus und klicken Sie dann unten auf \"Studie abschließen\", um fertig zu werden.",
        citation_header: "Zitation",
        loading_messages: [
            "Bitte warten Sie, während die kleinen Elfen Ihr Feedback erstellen...",
            "Fast geschafft, wir versprechen es...",
            "Das Geheimnis des Universums wird berechnet...",
            "Immer noch Fortschritte, gehen Sie noch nicht!",
            "Holen Sie sich einen Kaffee und kommen Sie in einer Minute wieder?"
        ]
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing INFER simplified version...');
    
    // Initialize Supabase
    supabase = initSupabase();
    if (supabase) {
        verifySupabaseConnection(supabase);
        currentSessionId = getOrCreateSessionId();
    }
    
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    applyTranslations();
    updateProgress('video-intro');
    updateWordCounts();
    showPage('video-intro');
    
    // Log session start
    logEvent('session_start', {
        entry_page: 'video-intro',
        user_agent: navigator.userAgent,
        screen_width: window.screen.width,
        screen_height: window.screen.height
    });
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-container').forEach(page => {
        page.classList.add('d-none');
    });
    
    // Show requested page
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('d-none');
        const previousPage = currentPage;
        currentPage = pageId;
        updateProgress(pageId);
        console.log(`Navigated to page: ${pageId}`);
        
        // Log page view
        logEvent('page_view', {
            page: pageId,
            from_page: previousPage,
            progress: PROGRESS_VALUES[pageId] || 0,
            timestamp: new Date().toISOString()
        });
    }
}

function updateProgress(pageId) {
    const progress = PROGRESS_VALUES[pageId] || 0;
    const progressBar = document.getElementById('study-progress');
    const progressText = document.getElementById('progress-text');
    const trans = translations[currentLanguage];
    
    if (progressBar) {
        progressBar.style.width = progress + '%';
        progressBar.setAttribute('aria-valuenow', progress);
    }
    if (progressText) {
        progressText.textContent = `Study Progress: ${progress}%`;
    }
}

function nextPage() {
    const currentIndex = STUDY_PAGES.indexOf(currentPage);
    if (currentIndex < STUDY_PAGES.length - 1) {
        showPage(STUDY_PAGES[currentIndex + 1]);
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Video intro page listeners
    const videoCheckbox = document.getElementById('video-watched-checkbox');
    const continueFromVideoBtn = document.getElementById('continue-to-task1-from-video');
    
    if (videoCheckbox && continueFromVideoBtn) {
        videoCheckbox.addEventListener('change', (e) => {
            continueFromVideoBtn.disabled = !e.target.checked;
            
            // Log checkbox interaction
            logEvent('video_watched_confirmation', {
                checked: e.target.checked,
                timestamp: new Date().toISOString()
            });
        });
        
        continueFromVideoBtn.addEventListener('click', () => {
            logEvent('navigation', {
                from: 'video-intro',
                to: 'task1',
                action: 'continue_from_video'
            });
            showPage('task1');
        });
    }
    
    // Task 1 listeners
    setupTaskListeners('task1');
    
    // Task 2 listeners
    setupTaskListeners('task2');
    
    // Survey navigation
    document.getElementById('continue-to-task2')?.addEventListener('click', () => {
        logEvent('navigation', { from: 'survey1', to: 'task2' });
        showPage('task2');
    });
    
    document.getElementById('complete-study')?.addEventListener('click', () => {
        logEvent('navigation', { from: 'survey2', to: 'thankyou' });
        logEvent('study_completed', {
            session_id: currentSessionId,
            final_page: 'thankyou',
            timestamp: new Date().toISOString()
        });
        showPage('thankyou');
    });
    
    // Modal listeners
    setupModalListeners();
}

function setupTaskListeners(taskId) {
    const elements = getTaskElements(taskId);
    
    // Language switchers
    elements.langEn?.addEventListener('change', () => switchLanguage('en'));
    elements.langDe?.addEventListener('change', () => switchLanguage('de'));
    
    // Buttons
    elements.generateBtn?.addEventListener('click', () => handleGenerateFeedback(taskId));
    elements.clearBtn?.addEventListener('click', () => handleClear(taskId));
    elements.copyBtn?.addEventListener('click', () => handleCopy(taskId));
    elements.reviseBtn?.addEventListener('click', () => handleRevise(taskId));
    elements.submitBtn?.addEventListener('click', () => handleFinalSubmission(taskId));
    
    // Word count
    elements.reflectionText?.addEventListener('input', () => updateWordCount(taskId));
}

function getTaskElements(taskId) {
    return {
        nameInput: document.getElementById(`student-name-${taskId}`),
        videoSelect: document.getElementById(`video-select-${taskId}`),
        reflectionText: document.getElementById(`reflection-text-${taskId}`),
        generateBtn: document.getElementById(`generate-btn-${taskId}`),
        clearBtn: document.getElementById(`clear-btn-${taskId}`),
        copyBtn: document.getElementById(`copy-btn-${taskId}`),
        reviseBtn: document.getElementById(`revise-reflection-btn-${taskId}`),
        submitBtn: document.getElementById(`submit-final-${taskId}`),
        wordCount: document.getElementById(`word-count-${taskId}`),
        loadingSpinner: document.getElementById(`loading-spinner-${taskId}`),
        feedbackTabs: document.getElementById(`feedback-tabs-${taskId}`),
        feedbackExtended: document.getElementById(`feedback-extended-${taskId}`),
        feedbackShort: document.getElementById(`feedback-short-${taskId}`),
        langEn: document.getElementById(`lang-en-${taskId}`),
        langDe: document.getElementById(`lang-de-${taskId}`)
    };
}

function setupModalListeners() {
    document.getElementById('select-extended-first')?.addEventListener('click', () => {
        userPreferredFeedbackStyle = 'extended';
        
        // Log preference
        logEvent('feedback_style_preference', {
            preferred_style: 'extended',
            timestamp: new Date().toISOString()
        });
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('feedback-preference-modal'));
        modal?.hide();
    });
    
    document.getElementById('select-short-first')?.addEventListener('click', () => {
        userPreferredFeedbackStyle = 'short';
        
        // Log preference
        logEvent('feedback_style_preference', {
            preferred_style: 'short',
            timestamp: new Date().toISOString()
        });
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('feedback-preference-modal'));
        modal?.hide();
    });
    
    document.getElementById('confirm-final-submission')?.addEventListener('click', () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('final-submission-modal'));
        const taskId = document.getElementById('final-submission-modal').dataset.taskId;
        modal?.hide();
        confirmFinalSubmission(taskId);
    });
}

// Language Management
function switchLanguage(lang) {
    currentLanguage = lang;
    applyTranslations();
    
    // Update all language radio buttons
    document.querySelectorAll('input[type="radio"][name^="language"]').forEach(radio => {
        if (radio.id.includes(`lang-${lang}`)) {
            radio.checked = true;
        }
    });
}

function applyTranslations() {
    const t = translations[currentLanguage];
    
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    
    document.querySelectorAll('[data-lang-key-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-key-placeholder');
        if (t[key]) {
            element.placeholder = t[key];
        }
    });
}

// Word Count
function updateWordCount(taskId) {
    const elements = getTaskElements(taskId);
    const text = elements.reflectionText?.value.trim() || '';
    const words = text ? text.split(/\s+/).length : 0;
    if (elements.wordCount) {
        elements.wordCount.textContent = words;
    }
}

function updateWordCounts() {
    updateWordCount('task1');
    updateWordCount('task2');
}

// Feedback Generation
async function handleGenerateFeedback(taskId) {
    const elements = getTaskElements(taskId);
    
    // Validation
    const studentName = elements.nameInput?.value.trim();
    if (!studentName) {
        showAlert('Please enter your name before generating feedback.', 'warning');
        elements.nameInput?.focus();
        return;
    }

    const videoSelected = elements.videoSelect?.value;
    if (!videoSelected) {
        showAlert('Please select a video before generating feedback.', 'warning');
        elements.videoSelect?.focus();
        return;
    }

    const reflection = elements.reflectionText?.value.trim();
    if (!reflection) {
        showAlert('Please enter a reflection text first.', 'warning');
        elements.reflectionText?.focus();
        return;
    }

    // Show style preference modal on first generation
    if (!TaskState[taskId].feedbackGenerated) {
        const modal = new bootstrap.Modal(document.getElementById('feedback-preference-modal'));
        modal.show();
        
        document.getElementById('feedback-preference-modal').addEventListener('hidden.bs.modal', function handler() {
            this.removeEventListener('hidden.bs.modal', handler);
            generateFeedback(taskId, reflection);
        });
    } else {
        generateFeedback(taskId, reflection);
    }
}

async function generateFeedback(taskId, reflection) {
    const elements = getTaskElements(taskId);
    
    // Show loading
    if (elements.loadingSpinner) elements.loadingSpinner.style.display = 'flex';
    if (elements.generateBtn) elements.generateBtn.disabled = true;
    
    // Rotate loading messages
    const loadingText = document.getElementById(`loading-text-${taskId}`);
    let loadingMessageIndex = 0;
    const loadingInterval = setInterval(() => {
        loadingMessageIndex = (loadingMessageIndex + 1) % translations[currentLanguage].loading_messages.length;
        if (loadingText) {
            loadingText.textContent = translations[currentLanguage].loading_messages[loadingMessageIndex];
        }
    }, 8000);
    
    try {
        console.log(`🔄 Generating feedback for ${taskId}...`);
        
        // Step 1: Analyze reflection
        const analysisResult = await analyzeReflectionDistribution(reflection, currentLanguage);
        console.log('✅ Analysis complete:', analysisResult);
        
        // Store binary classification results (for research data)
        storeBinaryClassificationResults(taskId, analysisResult);
        
        // Step 2: Display analysis distribution
        displayAnalysisDistribution(taskId, analysisResult);
        
        // Step 3: Generate both feedback styles
        const [extendedFeedback, shortFeedback] = await Promise.all([
            generateWeightedFeedback(reflection, currentLanguage, 'academic', analysisResult),
            generateWeightedFeedback(reflection, currentLanguage, 'user-friendly', analysisResult)
        ]);
        
        // Step 4: Save to database (before displaying)
        const studentName = elements.nameInput?.value.trim();
        const videoSelected = elements.videoSelect?.value;
        
        await saveFeedbackToDatabase(taskId, {
            studentName,
            videoSelected,
            reflectionText: reflection,
            analysisResult,
            extendedFeedback,
            shortFeedback
        });
        
        // Step 5: Display feedback
        if (elements.feedbackExtended) {
            elements.feedbackExtended.innerHTML = formatStructuredFeedback(extendedFeedback, analysisResult);
        }
        if (elements.feedbackShort) {
            elements.feedbackShort.innerHTML = formatStructuredFeedback(shortFeedback, analysisResult);
        }
        
        // Step 6: Show tabs and switch to preferred style
        if (elements.feedbackTabs) {
            elements.feedbackTabs.classList.remove('d-none');
        }
        
        if (userPreferredFeedbackStyle === 'short') {
            document.getElementById(`short-tab-${taskId}`)?.click();
        } else {
            document.getElementById(`extended-tab-${taskId}`)?.click();
        }
        
        // Step 7: Show revise and submit buttons
        if (elements.reviseBtn) elements.reviseBtn.style.display = 'inline-block';
        if (elements.submitBtn) elements.submitBtn.style.display = 'block';
        
        TaskState[taskId].feedbackGenerated = true;
        
        // Log feedback generation event
        logEvent('submit_reflection', {
            task: taskId,
            participant_name: studentName,
            video_id: videoSelected,
            language: currentLanguage,
            reflection_id: TaskState[taskId].currentReflectionId,
            reflection_length: reflection.length,
            analysis_percentages: analysisResult.percentages,
            weakest_component: analysisResult.weakest_component
        });
        
        showAlert('✅ Feedback generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating feedback:', error);
        showAlert(`⚠️ ${error.message}`, 'danger');
    } finally {
        clearInterval(loadingInterval);
        if (elements.loadingSpinner) elements.loadingSpinner.style.display = 'none';
        if (elements.generateBtn) elements.generateBtn.disabled = false;
    }
}

// Button Handlers
function handleClear(taskId) {
    const elements = getTaskElements(taskId);
    if (elements.reflectionText) {
        elements.reflectionText.value = '';
        updateWordCount(taskId);
        elements.reflectionText.focus();
    }
}

function handleCopy(taskId) {
    const activeTab = document.querySelector(`#feedback-tabs-${taskId} .nav-link.active`);
    const elements = getTaskElements(taskId);
    const feedbackType = activeTab?.id.includes('extended') ? 'extended' : 'short';
    const feedbackContent = feedbackType === 'extended'
        ? elements.feedbackExtended?.textContent
        : elements.feedbackShort?.textContent;
    
    if (feedbackContent) {
        navigator.clipboard.writeText(feedbackContent).then(() => {
            showAlert('✅ Feedback copied to clipboard!', 'success');
            
            // Log copy event
            logEvent('copy_feedback', {
                task: taskId,
                participant_name: elements.nameInput?.value.trim(),
                video_id: elements.videoSelect?.value,
                feedback_type: feedbackType,
                reflection_id: TaskState[taskId].currentReflectionId
            });
        });
    }
}

function handleRevise(taskId) {
    const elements = getTaskElements(taskId);
    elements.reflectionText?.focus();
    showAlert('You can now revise your reflection and generate new feedback.', 'info');
    
    // Increment revision count
    TaskState[taskId].revisionCount = (TaskState[taskId].revisionCount || 0) + 1;
    
    // Log revise click
    logEvent('click_revise', {
        task: taskId,
        participant_name: elements.nameInput?.value.trim(),
        video_id: elements.videoSelect?.value,
        reflection_id: TaskState[taskId].currentReflectionId,
        revision_number: TaskState[taskId].revisionCount
    });
}

function handleFinalSubmission(taskId) {
    const elements = getTaskElements(taskId);
    
    if (!TaskState[taskId].feedbackGenerated) {
        showAlert('Please generate feedback before submitting.', 'warning');
        return;
    }
    
    // Show confirmation modal
    const modal = new bootstrap.Modal(document.getElementById('final-submission-modal'));
    document.getElementById('final-submission-modal').dataset.taskId = taskId;
    modal.show();
}

function confirmFinalSubmission(taskId) {
    const elements = getTaskElements(taskId);
    
    TaskState[taskId].submitted = true;
    
    // Log final submission
    logEvent('final_submission', {
        task: taskId,
        participant_name: elements.nameInput?.value.trim(),
        video_id: elements.videoSelect?.value,
        language: currentLanguage,
        reflection_id: TaskState[taskId].currentReflectionId,
        total_revisions: TaskState[taskId].revisionCount || 1,
        final_reflection_length: elements.reflectionText?.value.length
    });
    
    showAlert('✅ Final reflection submitted successfully!', 'success');
    
    // Move to next page
    setTimeout(() => {
        nextPage();
    }, 1500);
}

// Alert System
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// ============================================================================
// Display and Storage Functions
// ============================================================================

function displayAnalysisDistribution(taskId, analysisResult) {
    const elements = getTaskElements(taskId);
    if (!elements || !analysisResult) return;
    
    // Find or create distribution container
    let distributionContainer = document.getElementById(`analysis-distribution-${taskId}`);
    if (!distributionContainer) {
        distributionContainer = document.createElement('div');
        distributionContainer.id = `analysis-distribution-${taskId}`;
        distributionContainer.className = 'analysis-distribution-professional mb-3';
        
        // Insert before feedback tabs
        if (elements.feedbackTabs) {
            elements.feedbackTabs.parentNode.insertBefore(distributionContainer, elements.feedbackTabs);
        }
    }
    
    const { percentages, weakest_component } = analysisResult;
    const isGerman = currentLanguage === 'de';
    
    // Check for gibberish/no professional vision
    if (percentages.professional_vision <= 5) {
        distributionContainer.innerHTML = `
            <div class="professional-analysis-summary">
                <h6>${isGerman ? 'Analyse Ihrer Reflexion' : 'Analysis of Your Reflection'}</h6>
                <p class="analysis-text text-warning">
                    ${isGerman ? 'Ihr Text bezieht sich nicht auf Professional Vision. Überarbeiten Sie ihn, um ihn auf das Video zu beziehen.' 
                              : 'Your text does not relate to professional vision. Revise to relate to the video.'}
                </p>
            </div>
        `;
        return;
    }

    distributionContainer.innerHTML = `
        <div class="professional-analysis-summary">
            <h6>${isGerman ? 'Analyse Ihrer Reflexion' : 'Analysis of Your Reflection'}</h6>
            <p class="analysis-text">
                ${isGerman ? `Ihre Reflexion enthält ${percentages.description || 0}% Beschreibung, ${percentages.explanation || 0}% Erklärung und ${percentages.prediction || 0}% Vorhersage. ${weakest_component} kann gestärkt werden.` 
                          : `Your reflection contains ${percentages.description || 0}% description, ${percentages.explanation || 0}% explanation, and ${percentages.prediction || 0}% prediction. ${weakest_component} can be strengthened.`}
            </p>
        </div>
    `;
}

async function storeBinaryClassificationResults(taskId, analysisResult) {
    const timestamp = new Date().toISOString();
    const elements = getTaskElements(taskId);
    const studentName = elements.nameInput?.value.trim() || 'Unknown';
    const videoId = elements.videoSelect?.value || 'Unknown';
    
    // Create comprehensive data object
    const dataToStore = {
        timestamp,
        task_id: taskId,
        participant_name: studentName,
        video_id: videoId,
        language: currentLanguage,
        analysis_summary: {
            percentages: analysisResult.percentages,
            weakest_component: analysisResult.weakest_component,
            total_windows: analysisResult.windows?.length || 0
        },
        binary_classifications: analysisResult.classificationResults || [],
        windows: analysisResult.windows || []
    };
    
    // Store in localStorage for backup
    const storageKey = `${taskId}_classifications_${timestamp}`;
    try {
        localStorage.setItem(storageKey, JSON.stringify(dataToStore));
        console.log(`✅ Binary classification results stored in localStorage:`, storageKey);
        
        const allKeys = JSON.parse(localStorage.getItem('all_classification_keys') || '[]');
        allKeys.push(storageKey);
        localStorage.setItem('all_classification_keys', JSON.stringify(allKeys));
    } catch (error) {
        console.error('Error storing to localStorage:', error);
    }
    
    // Store each binary classification to Supabase
    if (supabase && currentSessionId) {
        try {
            const reflectionId = TaskState[taskId].currentReflectionId;
            
            // Prepare binary classification records for batch insert
            const classificationRecords = analysisResult.classificationResults.map(result => ({
                session_id: currentSessionId,
                reflection_id: reflectionId,
                task_id: taskId,
                participant_name: studentName,
                video_id: videoId,
                language: currentLanguage,
                window_id: result.window_id,
                window_text: result.window_text,
                description_score: result.description,
                explanation_score: result.explanation,
                prediction_score: result.prediction,
                created_at: timestamp
            }));
            
            if (classificationRecords.length > 0) {
                const { data, error } = await supabase
                    .from('binary_classifications')
                    .insert(classificationRecords);
                
                if (error) {
                    console.error('Error storing binary classifications to Supabase:', error);
                } else {
                    console.log(`✅ ${classificationRecords.length} binary classifications stored to Supabase`);
                }
            }
        } catch (error) {
            console.error('Error in Supabase binary classification storage:', error);
        }
    }
    
    // Log to console for debugging
    console.table(analysisResult.classificationResults);
}

// Helper function to export all classification data
function exportAllClassificationData() {
    const allKeys = JSON.parse(localStorage.getItem('all_classification_keys') || '[]');
    const allData = allKeys.map(key => JSON.parse(localStorage.getItem(key) || '{}'));
    
    console.log('📦 All stored classification data:', allData);
    
    // Create downloadable JSON
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `infer_classification_data_${new Date().toISOString()}.json`;
    link.click();
    
    return allData;
}

// ============================================================================
// Analysis Functions (Same as original)
// ============================================================================

async function analyzeReflectionDistribution(reflection, language) {
    try {
        console.log('🔄 Starting 4-step classification analysis...');
        
        const windows = createSentenceWindows(reflection);
        console.log(`📝 Created ${windows.length} non-overlapping sentence windows`);
        
        const classificationResults = [];
        
        for (const window of windows) {
            const [description, explanation, prediction] = await Promise.all([
                classifyDescription(window.text),
                classifyExplanation(window.text),
                classifyPrediction(window.text)
            ]);
            
            classificationResults.push({
                window_id: window.id,
                window_text: window.text,
                description,
                explanation,
                prediction
            });
        }
        
        const analysis = calculatePercentages(classificationResults);
        console.log('📊 Analysis result:', analysis);
        
        // Store classification results with analysis
        analysis.classificationResults = classificationResults;
        analysis.windows = windows;
        
        return analysis;
    } catch (error) {
        console.error('❌ Error in classification:', error);
        return {
            percentages: { description: 30, explanation: 35, prediction: 25, other: 10, professional_vision: 90 },
            weakest_component: "Prediction",
            analysis_summary: "Fallback distribution due to classification error",
            classificationResults: [],
            windows: []
        };
    }
}

function createSentenceWindows(text) {
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const cleanSentences = sentences.map(s => s.trim()).filter(s => s.length > 0);
    
    const windows = [];
    let windowId = 1;
    
    for (let i = 0; i < cleanSentences.length; i += 3) {
        const sentenceCount = Math.min(3, cleanSentences.length - i);
        const windowText = cleanSentences.slice(i, i + sentenceCount).join(' ');
        
        if (windowText.length >= 20) {
            windows.push({
                id: `chunk_${String(windowId++).padStart(3, '0')}`,
                text: windowText
            });
        }
    }
    
    return windows.length > 0 ? windows : [{ id: 'chunk_001', text: text }];
}

async function classifyDescription(windowText) {
    const prompt = `You are an expert in analyzing teaching reflections. Determine if this text contains descriptions of observable teaching events.

DEFINITION: Descriptions identify and differentiate teaching events based on educational knowledge, WITHOUT making evaluations, interpretations, or speculations.

CRITERIA FOR "1" (Contains Description):
- Identifies observable teacher or student actions
- Relates to learning processes, teaching processes, or learning activities
- Uses neutral, observational language

CRITERIA FOR "0" (No Description):
- Contains evaluations, interpretations, or speculations
- Not about teaching/learning events

INSTRUCTIONS: Respond with ONLY "1" or "0"

TEXT: ${windowText}`;

    return await callBinaryClassifier(prompt);
}

async function classifyExplanation(windowText) {
    const prompt = `You are an expert in analyzing teaching reflections. Determine if this text contains explanations that connect teaching events to educational theories.

DEFINITION: Explanations relate observable teaching events to theories of effective teaching, focusing on WHY events occur.

CRITERIA FOR "1" (Contains Explanation):
- Links observable teaching events to educational knowledge
- References learning theories, teaching principles, or pedagogical concepts
- Explains WHY a teaching action was used or effective

CRITERIA FOR "0" (No Explanation):
- No connection to educational theories or principles
- Pure description without theoretical connection

INSTRUCTIONS: Respond with ONLY "1" or "0"

TEXT: ${windowText}`;

    return await callBinaryClassifier(prompt);
}

async function classifyPrediction(windowText) {
    const prompt = `You are an expert in analyzing teaching reflections. Determine if this text contains predictions about effects of teaching events on student learning.

DEFINITION: Predictions estimate potential consequences of teaching events for students based on learning theories.

CRITERIA FOR "1" (Contains Prediction):
- Predicts effects on student learning, motivation, or understanding
- Based on educational knowledge about learning
- Focuses on consequences for students

CRITERIA FOR "0" (No Prediction):
- No effects on student learning mentioned
- Predictions without educational basis

INSTRUCTIONS: Respond with ONLY "1" or "0"

TEXT: ${windowText}`;

    return await callBinaryClassifier(prompt);
}

async function callBinaryClassifier(prompt) {
    const requestData = {
        model: model,
        messages: [
            { role: "system", content: "You are an expert teaching reflection analyst. Respond with ONLY '1' or '0'." },
            { role: "user", content: prompt }
        ],
        temperature: 0.0,
        max_tokens: 5
    };
    
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const result = await response.json();
        const content = result.choices[0].message.content.trim();
        return content === '1' ? 1 : 0;
    } catch (error) {
        console.error('Error in binary classifier:', error);
        return 0;
    }
}

function calculatePercentages(classificationResults) {
    const totalWindows = classificationResults.length;
    
    if (totalWindows === 0) {
        return {
            percentages: { description: 0, explanation: 0, prediction: 0, other: 100, professional_vision: 0 },
            weakest_component: "Prediction"
        };
    }
    
    let descriptionCount = 0;
    let explanationCount = 0;
    let predictionCount = 0;
    let otherCount = 0;
    
    classificationResults.forEach(result => {
        if (result.description === 1) {
            descriptionCount++;
        } else if (result.explanation === 1) {
            explanationCount++;
        } else if (result.prediction === 1) {
            predictionCount++;
        } else {
            otherCount++;
        }
    });
    
    const percentages = {
        description: Math.round((descriptionCount / totalWindows) * 100),
        explanation: Math.round((explanationCount / totalWindows) * 100),
        prediction: Math.round((predictionCount / totalWindows) * 100),
        other: Math.round((otherCount / totalWindows) * 100)
    };
    
    percentages.professional_vision = percentages.description + percentages.explanation + percentages.prediction;
    
    const weakest = Object.entries(percentages)
        .filter(([key]) => ['description', 'explanation', 'prediction'].includes(key))
        .sort((a, b) => a[1] - b[1])[0];
    
    const weakestComponent = weakest[0].charAt(0).toUpperCase() + weakest[0].slice(1);
    
    return { percentages, weakest_component: weakestComponent };
}

// ============================================================================
// Feedback Generation (Same as original)
// ============================================================================

async function generateWeightedFeedback(reflection, language, style, analysisResult) {
    const promptType = `${style} ${language === 'en' ? 'English' : 'German'}`;
    const systemPrompt = getFeedbackPrompt(promptType, analysisResult);
    
    const languageInstruction = language === 'en' 
        ? "IMPORTANT: You MUST respond in English. The entire feedback MUST be in English only."
        : "WICHTIG: Sie MÜSSEN auf Deutsch antworten. Das gesamte Feedback MUSS ausschließlich auf Deutsch sein.";
    
    const requestData = {
        model: model,
        messages: [
            { role: "system", content: languageInstruction + "\n\n" + systemPrompt },
            { role: "user", content: `Based on the analysis showing ${analysisResult.percentages.description}% description, ${analysisResult.percentages.explanation}% explanation, ${analysisResult.percentages.prediction}% prediction (Professional Vision: ${analysisResult.percentages.professional_vision}%) + Other: ${analysisResult.percentages.other}% = 100%, provide feedback for this reflection:\n\n${reflection}` }
        ],
        temperature: 0.3,
        max_tokens: 2000
    };
    
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        let feedback = result.choices[0].message.content;
        
        if (style === 'user-friendly') {
            feedback = feedback.replace(/\s*\([^)]+\d{4}\)/g, '');
        }
        
        return feedback;
    } catch (error) {
        console.error('Error in generateWeightedFeedback:', error);
        throw error;
    }
}

function getFeedbackPrompt(promptType, analysisResult) {
    const weakestComponent = analysisResult?.weakest_component || 'Prediction';
    
    const prompts = {
        'academic English': `You are a supportive yet rigorous teaching mentor providing feedback in a scholarly tone. Your feedback MUST be detailed, academic, and comprehensive, deeply integrating theory.

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
- Sub-headings: "Strength:", "Suggestions:", "Why:"`,
        
        'user-friendly English': `You are a friendly teaching mentor providing feedback for a busy teacher who wants quick, practical tips.

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
- Sub-headings: "Good:", "Tip:"`,
        
        'academic German': `Sie sind ein unterstützender, aber rigoroser Mentor, der Feedback in einem wissenschaftlichen Ton gibt. Ihr Feedback MUSS detailliert, akademisch und umfassend sein und die Theorie tief integrieren.

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
- Unterüberschriften: "Stärke:", "Vorschläge:", "Warum:"`,
        
        'user-friendly German': `Sie sind ein freundlicher Mentor, der Feedback für einen vielbeschäftigten Lehrer gibt, der schnelle, praktische Tipps wünscht.

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
- Unterüberschriften: "Gut:", "Tipp:"`
    };
    
    return prompts[promptType] || prompts['academic English'];
}

function formatStructuredFeedback(text, analysisResult) {
    if (!text) return '';

    let formattedText = text.trim().replace(/\r\n/g, '\n').replace(/\*\*(.*?)\*\*/g, '$1');
    const sections = formattedText.split(/####\s*/).filter(s => s.trim().length > 0);

    const sectionMap = {
        'Overall Assessment': 'overall', 'Gesamtbewertung': 'overall',
        'Description': 'description', 'Beschreibung': 'description',
        'Explanation': 'explanation', 'Erklärung': 'explanation',
        'Prediction': 'prediction', 'Vorhersage': 'prediction',
        'Conclusion': 'overall', 'Fazit': 'overall'
    };

    const processedSections = sections.map(sectionText => {
        const lines = sectionText.trim().split('\n');
        const heading = lines.shift().trim();
        let body = lines.join('\n').trim();

        let sectionClass = 'other';
        for (const key in sectionMap) {
            if (heading.toLowerCase().startsWith(key.toLowerCase())) {
                sectionClass = sectionMap[key];
                break;
            }
        }

        const keywords = [
            'Strength:', 'Stärke:', 'Suggestions:', 'Vorschläge:',
            'Why:', 'Warum:', 'Good:', 'Gut:', 'Tip:', 'Tipp:'
        ];

        keywords.forEach(keyword => {
            const regex = new RegExp(`^(${keyword.replace(':', '\\:')})`, 'gm');
            body = body.replace(regex, `<span class="feedback-keyword">${keyword}</span>`);
        });

        body = body.replace(/\n/g, '<br>');

        return `
            <div class="feedback-section feedback-section-${sectionClass}">
                <h4 class="feedback-heading">${heading}</h4>
                <div class="section-content">${body}</div>
            </div>
        `;
    }).join('');

    return processedSections;
}

// ============================================================================
// Supabase Database Functions
// ============================================================================

function initSupabase() {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.warn('Supabase credentials not set. Running in demo mode.');
        showAlert('Running in demo mode - feedback works, but data won\'t be saved to database.', 'info');
        return null;
    }
    
    try {
        console.log('Initializing Supabase client...');
        
        if (typeof window.supabase === 'undefined' || !window.supabase) {
            throw new Error('Supabase library not loaded from CDN.');
        }
        
        if (typeof window.supabase.createClient !== 'function') {
            throw new Error('Supabase createClient function not available.');
        }
        
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        if (!client) {
            throw new Error('Failed to create Supabase client instance.');
        }
        
        console.log('✅ Supabase client initialized successfully');
        return client;
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        showAlert('Database connection failed - running in demo mode. Feedback generation still works!', 'warning');
        return null;
    }
}

async function verifySupabaseConnection(client) {
    if (!client) {
        console.log('No database client - running in demo mode');
        return;
    }
    
    try {
        const { data, error } = await client
            .from('reflections')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('Database connection test failed:', error);
            showAlert('Database connection issue - data may not be saved.', 'warning');
        } else {
            console.log('✅ Supabase connection verified');
        }
    } catch (error) {
        console.error('Error verifying Supabase connection:', error);
    }
}

function getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('session_id');
    
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('session_id', sessionId);
        console.log('✅ New session created:', sessionId);
    } else {
        console.log('✅ Existing session found:', sessionId);
    }
    
    return sessionId;
}

// Event logging function
async function logEvent(eventType, eventData = {}) {
    if (!supabase || !currentSessionId) {
        console.log(`Event (no DB): ${eventType}`, eventData);
        return;
    }
    
    try {
        const { error } = await supabase
            .from('user_events')
            .insert([{
                session_id: currentSessionId,
                reflection_id: eventData.reflection_id || null,
                event_type: eventType,
                event_data: eventData,
                user_agent: navigator.userAgent,
                language: currentLanguage,
                timestamp_utc: new Date().toISOString()
            }]);

        if (error) {
            console.error('Error logging event:', error);
        } else {
            console.log(`📝 Event logged: ${eventType}`, eventData);
        }
    } catch (error) {
        console.error('Error in logEvent:', error);
    }
}

// Save reflection and feedback to database
async function saveFeedbackToDatabase(taskId, data) {
    if (!supabase) {
        console.log('No database connection - running in demo mode');
        return;
    }
    
    try {
        const revisionNumber = TaskState[taskId].revisionCount || 1;
        const parentReflectionId = TaskState[taskId].parentReflectionId || null;

        const reflectionData = {
            session_id: currentSessionId,
            participant_name: data.studentName,
            video_id: data.videoSelected,
            language: currentLanguage,
            task_id: taskId,
            reflection_text: data.reflectionText,
            analysis_percentages: data.analysisResult.percentages,
            weakest_component: data.analysisResult.weakest_component,
            feedback_extended: data.extendedFeedback,
            feedback_short: data.shortFeedback,
            revision_number: revisionNumber,
            parent_reflection_id: parentReflectionId,
            created_at: new Date().toISOString()
        };

        const { data: result, error } = await supabase
            .from('reflections')
            .insert([reflectionData])
            .select()
            .single();

        if (error) {
            console.error('Database insert error:', error);
            return;
        }

        // Update task state with database ID
        TaskState[taskId].currentReflectionId = result.id;
        
        // If this is the first submission, store as parent for revisions
        if (revisionNumber === 1) {
            TaskState[taskId].parentReflectionId = result.id;
        }
        
        console.log(`✅ ${taskId} reflection saved to database:`, result.id);
        
    } catch (error) {
        console.error('Error saving to database:', error);
    }
}
