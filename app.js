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

// Enhanced Language translations for multi-page study
const translations = {
    en: {
        title: "Teacher Professional Vision Study",
        subtitle: "Welcome to our research study on teaching reflection analysis",
        
        // Pre-survey page
        presurvey_title: "Pre-Study Survey",
        presurvey_intro: "Before we begin the main study, please complete this brief survey about your background and expectations.",
        continue_to_task1: "Continue to Task 1",
        
        // Task pages
        task1_title: "Task 1: Teaching Reflection Analysis",
        task1_subtitle: "Analyze your teaching reflection and receive feedback",
        task2_title: "Task 2: Teaching Reflection Analysis", 
        task2_subtitle: "Analyze your second teaching reflection and receive feedback",
        
        // Survey pages
        survey1_title: "Post-Task 1 Survey",
        survey1_subtitle: "Please share your thoughts about the first task",
        continue_to_task2: "Continue to Task 2",
        survey2_title: "Post-Task 2 Survey",
        survey2_subtitle: "Please share your thoughts about the second task",
        continue_to_postsurvey: "Continue to Final Survey",
        postsurvey_title: "Final Survey",
        postsurvey_subtitle: "Thank you for participating! Please complete this final survey.",
        complete_study: "Complete Study",
        
        // Common elements
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
        words: "words",
        
        // Professional vision concepts
        learn_key_concepts: "Learn the Key Concepts for Better Reflection",
        concepts_help: "Understanding these three dimensions will help you write more comprehensive teaching reflections",
        description: "Description",
        description_def: "Accurately observing and reporting what happened in the classroom - specific behaviors, interactions, and events without interpretation.",
        explanation: "Explanation", 
        explanation_def: "Interpreting observed events using educational theory, research, and pedagogical knowledge - understanding why things happened.",
        prediction: "Prediction",
        prediction_def: "Anticipating future outcomes and effects on student learning based on observed teaching practices and their interpretations.",
        
        // Modals
        think_aloud_title: "Think Aloud Reminder",
        think_aloud_message: "Please remember to **think aloud** as you read and make sense of the feedback. Share your thoughts, reactions, and decision-making process out loud.",
        think_aloud_example: "For example: \"This feedback is interesting because...\", \"I agree with this point...\", \"I should focus more on...\"",
        understood: "Understood",
        
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
        
        // Warnings and messages
        no_changes_warning: "You clicked 'Revise Reflection' but haven't made any changes to the text. Please edit your reflection before generating new feedback, or the feedback will be identical to what you already received.",
        
        // Tooltips
        extended_tooltip: "Detailed academic feedback with comprehensive analysis and educational theory references",
        short_tooltip: "Concise, easy-to-read feedback with key points and practical tips",
        generate_error: "Error generating feedback. Please try again."
    },
    de: {
        title: "Teacher Professional Vision Studie",
        subtitle: "Willkommen zu unserer Forschungsstudie über die Analyse von Unterrichtsreflexionen",
        
        // Pre-survey page
        presurvey_title: "Vorab-Umfrage",
        presurvey_intro: "Bevor wir mit der Hauptstudie beginnen, füllen Sie bitte diese kurze Umfrage zu Ihrem Hintergrund und Ihren Erwartungen aus.",
        continue_to_task1: "Weiter zu Aufgabe 1",
        
        // Task pages
        task1_title: "Aufgabe 1: Analyse der Unterrichtsreflexion",
        task1_subtitle: "Analysieren Sie Ihre Unterrichtsreflexion und erhalten Sie Feedback",
        task2_title: "Aufgabe 2: Analyse der Unterrichtsreflexion",
        task2_subtitle: "Analysieren Sie Ihre zweite Unterrichtsreflexion und erhalten Sie Feedback",
        
        // Survey pages
        survey1_title: "Umfrage nach Aufgabe 1", 
        survey1_subtitle: "Bitte teilen Sie Ihre Gedanken zur ersten Aufgabe mit",
        continue_to_task2: "Weiter zu Aufgabe 2",
        survey2_title: "Umfrage nach Aufgabe 2",
        survey2_subtitle: "Bitte teilen Sie Ihre Gedanken zur zweiten Aufgabe mit",
        continue_to_postsurvey: "Weiter zur Abschlussumfrage",
        postsurvey_title: "Abschlussumfrage",
        postsurvey_subtitle: "Vielen Dank für Ihre Teilnahme! Bitte füllen Sie diese abschließende Umfrage aus.",
        complete_study: "Studie abschließen",
        
        // Common elements
        settings: "Einstellungen",
        your_name: "Ihr Name:",
        enter_name: "Geben Sie Ihren Namen ein",
        video_watched: "Angesehenes Video:",
        select_video: "Wählen Sie ein Video...",
        language: "Sprache:",
        generate_feedback: "Feedback generieren",
        reflection_input: "Reflexion des Lehramtsstudierenden",
        paste_reflection: "Fügen Sie hier die Reflexion des Lehramtsstudierenden ein...",
        clear: "Löschen",
        generated_feedback: "Generiertes Feedback",
        feedback_placeholder: "Feedback wird hier nach der Generierung angezeigt...",
        extended: "Erweitert",
        short: "Kurz",
        copy: "Kopieren",
        revise_reflection: "Reflexion überarbeiten",
        submit_final: "Endgültige Reflexion einreichen",
        words: "Wörter",
        
        // Professional vision concepts
        learn_key_concepts: "Lernen Sie die Schlüsselkonzepte für bessere Reflexion",
        concepts_help: "Das Verständnis dieser drei Dimensionen hilft Ihnen, umfassendere Unterrichtsreflexionen zu schreiben",
        description: "Beschreibung",
        description_def: "Genaues Beobachten und Berichten des Geschehens im Klassenzimmer - spezifische Verhaltensweisen, Interaktionen und Ereignisse ohne Interpretation.",
        explanation: "Erklärung",
        explanation_def: "Interpretation von beobachteten Ereignissen mittels pädagogischer Theorie, Forschung und pädagogischem Wissen - Verstehen, warum Dinge passiert sind.",
        prediction: "Vorhersage",
        prediction_def: "Antizipation zukünftiger Ergebnisse und Auswirkungen auf das Lernen der Schüler basierend auf beobachteten Unterrichtspraktiken und deren Interpretationen.",
        
        // Modals
        think_aloud_title: "Denken-Laut-Erinnerung",
        think_aloud_message: "Bitte denken Sie **laut** beim Lesen und Verstehen des Feedbacks. Teilen Sie Ihre Gedanken, Reaktionen und Entscheidungsprozesse laut mit.",
        think_aloud_example: "Zum Beispiel: \"Dieses Feedback ist interessant, weil...\", \"Ich stimme diesem Punkt zu...\", \"Ich sollte mich mehr konzentrieren auf...\"",
        understood: "Verstanden",
        
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
        
        // Warnings and messages
        no_changes_warning: "Sie haben 'Reflexion überarbeiten' geklickt, aber keine Änderungen am Text vorgenommen. Bitte bearbeiten Sie Ihre Reflexion, bevor Sie neues Feedback generieren, sonst wird das Feedback identisch zu dem bereits erhaltenen sein.",
        
        // Tooltips
        extended_tooltip: "Detailliertes akademisches Feedback mit umfassender Analyse und pädagogischen Theoriereferenzen",
        short_tooltip: "Prägnantes, leicht lesbares Feedback mit Kernpunkten und praktischen Tipps",
        generate_error: "Fehler beim Generieren von Feedback. Bitte versuchen Sie es erneut."
    }
};

// Multi-page Application State
let currentPage = 'presurvey';
let studyProgress = 0;
let currentLanguage = 'en';
let currentSessionId = null;
let userPreferredFeedbackStyle = 'extended'; // Track user's initial preference
let supabase = null;

// Study flow configuration
const STUDY_PAGES = [
    'presurvey',    // 0%
    'task1',        // 20%
    'survey1',      // 40%
    'task2',        // 60% 
    'survey2',      // 80%
    'postsurvey'    // 100%
];

const PROGRESS_VALUES = {
    'presurvey': 0,
    'task1': 20,
    'survey1': 40,
    'task2': 60,
    'survey2': 80,
    'postsurvey': 100
};

// Task management objects
const TaskManager = {
    task1: {
        currentReflectionId: null,
        currentAnalysisResult: null,
        currentFeedbackType: 'extended',
        currentFeedbackStartTime: null,
        feedbackGenerated: false,
        finalSubmitted: false,
        revisionCount: 0, // New for revision tracking
        parentReflectionId: null, // New for revision tracking
        firstSubmissionTime: null // New for revision tracking
    },
    task2: {
        currentReflectionId: null,
        currentAnalysisResult: null,
        currentFeedbackType: 'extended', 
        currentFeedbackStartTime: null,
        feedbackGenerated: false,
        finalSubmitted: false,
        revisionCount: 0, // New for revision tracking
        parentReflectionId: null, // New for revision tracking
        firstSubmissionTime: null // New for revision tracking
    }
};

// DOM Elements Manager
const DOMElements = {
    // Progress tracking
    progressBar: null,
    progressText: null,
    
    // Pages
    pages: {},
    
    // Navigation buttons
    navButtons: {},
    
    // Modals
    modals: {},
    
    // Task-specific elements
    task1: {},
    task2: {},
    
    // Initialize all DOM elements
    init: function() {
        // Progress elements
        this.progressBar = document.getElementById('study-progress');
        this.progressText = document.getElementById('progress-text');
        
        // Pages
        this.pages = {
            presurvey: document.getElementById('page-presurvey'),
            task1: document.getElementById('page-task1'),
            survey1: document.getElementById('page-survey1'),
            task2: document.getElementById('page-task2'),
            survey2: document.getElementById('page-survey2'),
            postsurvey: document.getElementById('page-postsurvey')
        };
        
        // Navigation buttons
        this.navButtons = {
            continueToTask1: document.getElementById('continue-to-task1'),
            continueToTask2: document.getElementById('continue-to-task2'),
            continueToPostsurvey: document.getElementById('continue-to-postsurvey'),
            completeStudy: document.getElementById('complete-study')
        };
        
        // Modals
        this.modals = {
            thinkAloud: document.getElementById('think-aloud-modal'),
            feedbackPreference: document.getElementById('feedback-preference-modal'),
            finalSubmission: document.getElementById('final-submission-modal')
        };
        
        // Task 1 specific elements
        this.task1 = {
            nameInput: document.getElementById('student-name-task1'),
            videoSelect: document.getElementById('video-select-task1'),
            languageEn: document.getElementById('lang-en-task1'),
            languageDe: document.getElementById('lang-de-task1'),
            reflectionText: document.getElementById('reflection-text-task1'),
            wordCount: document.getElementById('word-count-task1'),
            wordCountContainer: document.getElementById('word-count-container-task1'),
            generateBtn: document.getElementById('generate-btn-task1'),
            clearBtn: document.getElementById('clear-btn-task1'),
            copyBtn: document.getElementById('copy-btn-task1'),
            reviseBtn: document.getElementById('revise-reflection-btn-task1'),
            submitFinalBtn: document.getElementById('submit-final-task1'),
            loadingSpinner: document.getElementById('loading-spinner-task1'),
            feedbackTabs: document.getElementById('feedback-tabs-task1'),
            feedbackExtended: document.getElementById('feedback-extended-task1'),
            feedbackShort: document.getElementById('feedback-short-task1'),
            extendedTab: document.getElementById('extended-tab-task1'),
            shortTab: document.getElementById('short-tab-task1'),
            definitionsHeader: document.querySelector('#page-task1 .definitions-header')
        };
        
        // Task 2 specific elements (duplicate structure)
        this.task2 = {
            nameInput: document.getElementById('student-name-task2'),
            videoSelect: document.getElementById('video-select-task2'),
            languageEn: document.getElementById('lang-en-task2'),
            languageDe: document.getElementById('lang-de-task2'),
            reflectionText: document.getElementById('reflection-text-task2'),
            wordCount: document.getElementById('word-count-task2'),
            wordCountContainer: document.getElementById('word-count-container-task2'),
            generateBtn: document.getElementById('generate-btn-task2'),
            clearBtn: document.getElementById('clear-btn-task2'),
            copyBtn: document.getElementById('copy-btn-task2'),
            reviseBtn: document.getElementById('revise-reflection-btn-task2'),
            submitFinalBtn: document.getElementById('submit-final-task2'),
            loadingSpinner: document.getElementById('loading-spinner-task2'),
            feedbackTabs: document.getElementById('feedback-tabs-task2'),
            feedbackExtended: document.getElementById('feedback-extended-task2'),
            feedbackShort: document.getElementById('feedback-short-task2'),
            extendedTab: document.getElementById('extended-tab-task2'),
            shortTab: document.getElementById('short-tab-task2'),
            definitionsHeader: document.querySelector('#page-task2 .definitions-header')
        };
    }
};

// Page Navigation Manager
const PageNavigator = {
    showPage: function(pageId) {
        // Hide all pages
        Object.values(DOMElements.pages).forEach(page => {
            if (page) page.classList.add('d-none');
        });
        
        // Show target page
        if (DOMElements.pages[pageId]) {
            DOMElements.pages[pageId].classList.remove('d-none');
            currentPage = pageId;
            this.updateProgress(pageId);
            this.logPageView(pageId);
        }
    },
    
    updateProgress: function(pageId) {
        const progress = PROGRESS_VALUES[pageId] || 0;
        if (DOMElements.progressBar) {
            DOMElements.progressBar.style.width = progress + '%';
            DOMElements.progressBar.setAttribute('aria-valuenow', progress);
        }
        if (DOMElements.progressText) {
            DOMElements.progressText.textContent = `Study Progress: ${progress}%`;
        }
        studyProgress = progress;
    },
    
    logPageView: function(pageId) {
        logEvent('page_view', {
            page: pageId,
            progress: studyProgress,
                timestamp: new Date().toISOString()
            });
    },
    
    nextPage: function() {
        const currentIndex = STUDY_PAGES.indexOf(currentPage);
        if (currentIndex < STUDY_PAGES.length - 1) {
            this.showPage(STUDY_PAGES[currentIndex + 1]);
        }
    }
};

// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing multi-page Teacher Professional Vision Study...');
    
    // Initialize DOM elements
    DOMElements.init();
    
    // Initialize Supabase
    supabase = initSupabase();
    if (supabase) {
        verifySupabaseConnection(supabase);
        currentSessionId = getOrCreateSessionId();
        logEvent('session_start', {
            user_agent: navigator.userAgent,
            language: currentLanguage,
            timestamp: new Date().toISOString()
        });
    }

    // Initialize language and translations
    updateLanguage('en');
    
    // Set up navigation event listeners
    setupNavigationListeners();
    
    // Set up task-specific event listeners
    setupTaskListeners('task1');
    setupTaskListeners('task2');
    
    // Set up modal event listeners
    setupModalListeners();
    
    // Show initial page
    PageNavigator.showPage('presurvey');
    
    console.log('Multi-page application initialized successfully');
});

// Navigation Event Listeners
function setupNavigationListeners() {
    // Pre-survey to Task 1
    if (DOMElements.navButtons.continueToTask1) {
        DOMElements.navButtons.continueToTask1.addEventListener('click', () => {
            logEvent('navigation', { from: 'presurvey', to: 'task1' });
            PageNavigator.showPage('task1');
            
            // Show feedback style preference modal on first task
            showFeedbackPreferenceModal();
        });
    }
    
    // Survey 1 to Task 2  
    if (DOMElements.navButtons.continueToTask2) {
        DOMElements.navButtons.continueToTask2.addEventListener('click', () => {
            logEvent('navigation', { from: 'survey1', to: 'task2' });
            PageNavigator.showPage('task2');
            
            // Copy user settings from Task 1 to Task 2
            copyTaskSettings('task1', 'task2');
        });
    }
    
    // Survey 2 to Post-survey
    if (DOMElements.navButtons.continueToPostsurvey) {
        DOMElements.navButtons.continueToPostsurvey.addEventListener('click', () => {
            logEvent('navigation', { from: 'survey2', to: 'postsurvey' });
            PageNavigator.showPage('postsurvey');
        });
    }
    
    // Complete study
    if (DOMElements.navButtons.completeStudy) {
        DOMElements.navButtons.completeStudy.addEventListener('click', () => {
            logEvent('study_completed', { 
                total_time: Date.now() - performance.timing.navigationStart,
                language: currentLanguage
            });
            showAlert(translations[currentLanguage].complete_study || 'Study completed! Thank you for participating.', 'success');
            
            // Optional: Redirect or show completion message
            setTimeout(() => {
                window.location.reload(); // Reset for next participant
            }, 3000);
        });
    }
}

// Task-specific Event Listeners
function setupTaskListeners(taskId) {
    const elements = DOMElements[taskId];
    const taskManager = TaskManager[taskId];
    
    if (!elements || !taskManager) return;
    
    // Generate feedback button
    if (elements.generateBtn) {
        elements.generateBtn.addEventListener('click', () => generateFeedback(taskId));
    }
    
    // Clear button
    if (elements.clearBtn) {
        elements.clearBtn.addEventListener('click', () => clearText(taskId));
    }
    
    // Copy button
    if (elements.copyBtn) {
        elements.copyBtn.addEventListener('click', () => copyFeedback(taskId));
    }
    
    // Revise button
    if (elements.reviseBtn) {
        elements.reviseBtn.addEventListener('click', () => handleReviseReflectionClick(taskId));
    }
    
    // Submit final button
    if (elements.submitFinalBtn) {
        elements.submitFinalBtn.addEventListener('click', () => showFinalSubmissionModal(taskId));
    }
    
    // Language change listeners
    if (elements.languageEn) {
        elements.languageEn.addEventListener('change', () => updateLanguage('en'));
    }
    if (elements.languageDe) {
        elements.languageDe.addEventListener('change', () => updateLanguage('de'));
    }
    
    // Tab switching
    if (elements.extendedTab) {
        elements.extendedTab.addEventListener('click', () => switchToTab(taskId, 'extended'));
    }
    if (elements.shortTab) {
        elements.shortTab.addEventListener('click', () => switchToTab(taskId, 'short'));
    }
    
    // Word count tracking
    if (elements.reflectionText) {
        elements.reflectionText.addEventListener('input', () => updateWordCount(taskId));
    }
    
    // Definitions tracking
    if (elements.definitionsHeader) {
        elements.definitionsHeader.addEventListener('click', () => {
            const isExpanded = elements.definitionsHeader.getAttribute('aria-expanded') === 'true';
            logEvent('learn_concepts_interaction', {
                task: taskId,
                reflection_id: taskManager.currentReflectionId,
                language: currentLanguage,
                action: isExpanded ? 'collapse' : 'expand',
                has_reflection_text: elements.reflectionText.value.trim().length > 0,
                has_generated_feedback: taskManager.feedbackGenerated,
                timestamp: new Date().toISOString()
            });
        });
    }
}

// Modal Event Listeners
function setupModalListeners() {
    // Feedback preference modal
    const selectExtendedBtn = document.getElementById('select-extended-first');
    const selectShortBtn = document.getElementById('select-short-first');
    
    if (selectExtendedBtn) {
        selectExtendedBtn.addEventListener('click', () => {
            userPreferredFeedbackStyle = 'extended';
            logEvent('feedback_style_preference', { preferred_style: 'extended' });
            const modal = bootstrap.Modal.getInstance(DOMElements.modals.feedbackPreference);
            if (modal) modal.hide();
        });
    }
    
    if (selectShortBtn) {
        selectShortBtn.addEventListener('click', () => {
            userPreferredFeedbackStyle = 'short';
            logEvent('feedback_style_preference', { preferred_style: 'short' });
            const modal = bootstrap.Modal.getInstance(DOMElements.modals.feedbackPreference);
            if (modal) modal.hide();
        });
    }
    
    // Final submission modal
    const confirmSubmissionBtn = document.getElementById('confirm-final-submission');
    if (confirmSubmissionBtn) {
        confirmSubmissionBtn.addEventListener('click', () => {
            const modal = bootstrap.Modal.getInstance(DOMElements.modals.finalSubmission);
            if (modal) {
                const taskId = modal._element.dataset.taskId;
                handleFinalSubmission(taskId);
                modal.hide();
            }
        });
    }
    
    // Think aloud modal - automatically show after feedback generation
    setupThinkAloudReminder();
}

// Modal Display Functions
function showFeedbackPreferenceModal() {
    if (DOMElements.modals.feedbackPreference) {
        const modal = new bootstrap.Modal(DOMElements.modals.feedbackPreference, {
            backdrop: 'static',
            keyboard: false
        });
        modal.show();
    }
}

function showThinkAloudModal() {
    if (DOMElements.modals.thinkAloud) {
        const modal = new bootstrap.Modal(DOMElements.modals.thinkAloud);
        modal.show();
    }
}

function showFinalSubmissionModal(taskId) {
    const elements = DOMElements[taskId];
    if (!elements) return;
    
    // Set the taskId data attribute for the modal so handleFinalSubmission can access it
    const modalElement = DOMElements.modals.finalSubmission;
    modalElement.dataset.taskId = taskId;
    
    logEvent('final_submission_modal_shown', {
        task: taskId,
        participant_name: elements.nameInput.value.trim(),
        video_id: elements.videoSelect.value,
            language: currentLanguage,
        reflection_id: TaskManager[taskId].currentReflectionId,
        total_revisions: TaskManager[taskId].revisionCount || 1,
        final_reflection_length: elements.reflectionText.value.length
    });
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // Don't set onclick handler here - let setupModalListeners handle it
    // This prevents conflicts and ensures handleFinalSubmission is called properly
}

function setupThinkAloudReminder() {
    // Show think aloud reminder once per session when feedback is first generated
    const thinkAloudShown = sessionStorage.getItem('thinkAloudReminderShown');
    if (!thinkAloudShown) {
        // Will be triggered after first feedback generation
        window.addEventListener('firstFeedbackGenerated', () => {
            setTimeout(() => {
                showThinkAloudModal();
                sessionStorage.setItem('thinkAloudReminderShown', 'true');
            }, 2000); // Show 2 seconds after feedback appears
        });
    }
}

// Core Feedback Generation Function
async function generateFeedback(taskId) {
    const elements = DOMElements[taskId];
    const taskManager = TaskManager[taskId];
    
    if (!elements || !taskManager) return;
    
    const studentName = elements.nameInput.value.trim();
        if (!studentName) {
        showAlert(translations[currentLanguage].enter_name || 'Please enter your name before generating feedback.', 'warning');
        elements.nameInput.focus();
            return;
        }

    const videoSelected = elements.videoSelect.value;
        if (!videoSelected) {
        showAlert(translations[currentLanguage].select_video || 'Please select a video before generating feedback.', 'warning');
        elements.videoSelect.focus();
            return;
        }

    if (!elements.reflectionText.value.trim()) {
        showAlert(translations[currentLanguage].paste_reflection || 'Please enter a reflection text first.', 'warning');
        elements.reflectionText.focus();
            return;
        }

    // Enhanced duplicate submission check with counter
    const currentReflection = elements.reflectionText.value.trim();
    const storedReflection = sessionStorage.getItem(`reflection-${taskId}`);
    let warningCount = parseInt(sessionStorage.getItem(`warningCount-${taskId}`)) || 0;
    
    // Debug logging
    console.log(`Duplicate check for ${taskId}:`, {
        currentLength: currentReflection.length,
        storedLength: storedReflection ? storedReflection.length : 0,
        feedbackGenerated: taskManager.feedbackGenerated,
        areEqual: storedReflection === currentReflection,
        warningCount: warningCount
    });
    
    // Check for duplicate: same text AND feedback was already generated
    if (storedReflection && storedReflection === currentReflection && taskManager.feedbackGenerated) {
        warningCount++;
        sessionStorage.setItem(`warningCount-${taskId}`, warningCount);
        
        console.log(`⚠️ Duplicate submission detected! Warning count: ${warningCount}`);
        
        // Log both the warning event and the resubmit_same_text event
            logEvent('revision_warning_shown', {
            task: taskId,
            participant_name: studentName,
            video_id: videoSelected,
            reflection_id: taskManager.currentReflectionId,
                language: currentLanguage,
            warning_count: warningCount,
            reflection_length: currentReflection.length,
            time_since_revise_click: Date.now() - (taskManager.lastReviseClickTime || 0),
            submission_type: 'generate_feedback'
        });
        
        logEvent('resubmit_same_text', {
            task: taskId,
            participant_name: studentName,
            video_id: videoSelected,
            reflection_id: taskManager.currentReflectionId,
            language: currentLanguage,
            warning_count: warningCount,
            reflection_length: currentReflection.length
        });
        
                const warningMessage = currentLanguage === 'en' 
            ? `Warning ${warningCount}: You submitted the same reflection text again. Please make changes to your reflection before generating new feedback, or the feedback will be identical to what you already received.`
            : `Warnung ${warningCount}: Sie haben denselben Reflexionstext erneut eingereicht. Bitte nehmen Sie Änderungen an Ihrer Reflexion vor, bevor Sie neues Feedback generieren, oder das Feedback wird identisch zu dem bereits erhaltenen sein.`;
        
        showBubbleWarning(warningMessage, elements.reflectionText, 'warning');
        elements.reflectionText.focus();
            return;
        }

    // Reset warning count for new/modified reflections
    if (storedReflection !== currentReflection) {
        sessionStorage.setItem(`warningCount-${taskId}`, '0');
    }
        
        // Show loading spinner
    toggleLoading(taskId, true);
    
    try {
        // Step 1: Analyze reflection distribution
        const analysisResult = await analyzeReflectionDistribution(elements.reflectionText.value, currentLanguage);
        taskManager.currentAnalysisResult = analysisResult;
        
        // Step 2: Generate both feedback versions with enhanced prompts
            const [extendedFeedback, shortFeedback] = await Promise.all([
            generateWeightedFeedback(elements.reflectionText.value, currentLanguage, 'academic', analysisResult),
            generateWeightedFeedback(elements.reflectionText.value, currentLanguage, 'user-friendly', analysisResult)
        ]);
        
        // Step 3: Display analysis distribution
        displayAnalysisDistribution(taskId, analysisResult);
        
        // Step 4: Display structured feedback
        elements.feedbackExtended.innerHTML = formatStructuredFeedback(extendedFeedback, analysisResult);
        elements.feedbackShort.innerHTML = formatStructuredFeedback(shortFeedback, analysisResult);
        
        // Step 5: Show feedback tabs with user's preferred style first
        elements.feedbackTabs.classList.remove('d-none');
        if (userPreferredFeedbackStyle === 'short') {
            elements.shortTab.click();
        } else {
            elements.extendedTab.click();
        }
        
        // Step 6: Show revise button (submit button is always visible)
        elements.reviseBtn.style.display = 'inline-block';
        
        // Step 7: Save to database with task-specific data
        await saveFeedbackToDatabase(taskId, {
            studentName,
            videoSelected,
            reflectionText: elements.reflectionText.value,
            analysisResult,
            extendedFeedback,
            shortFeedback
        });
        
        // Step 8: Update task state and store reflection immediately
        taskManager.feedbackGenerated = true;
        // Removed buggy random ID override - keep database ID to maintain FK integrity
        // taskManager.currentReflectionId = Math.floor(Math.random() * 1000000) + Date.now() % 1000000;
        
        // CRITICAL: Store reflection immediately after first successful generation
        sessionStorage.setItem(`reflection-${taskId}`, elements.reflectionText.value.trim());
        
        startFeedbackViewing(taskId, taskManager.currentFeedbackType, currentLanguage);
        
        // Step 9: Log successful generation (moved down)
        logEvent('submit_reflection', {
            task: taskId,
            participant_name: studentName,
            video_id: videoSelected,
            language: currentLanguage,
            reflection_id: taskManager.currentReflectionId,
            reflection_length: elements.reflectionText.value.length,
            analysis_percentages: analysisResult.percentages,
            weakest_component: analysisResult.weakest_component,
            revision_number: 1
        });
        
        // Step 10: Trigger think aloud reminder for first feedback
        if (!sessionStorage.getItem('thinkAloudReminderShown')) {
            window.dispatchEvent(new Event('firstFeedbackGenerated'));
        }
        
    } catch (error) {
        console.error('Error generating feedback:', error);
        showAlert(translations[currentLanguage].generate_error || 'Error generating feedback. Please try again.', 'danger');
    } finally {
        toggleLoading(taskId, false);
    }
}

// Professional Analysis Summary (simplified)
function displayAnalysisDistribution(taskId, analysisResult) {
    const elements = DOMElements[taskId];
    if (!elements || !analysisResult) return;
    
    // Find or create distribution container
    let distributionContainer = document.getElementById(`analysis-distribution-${taskId}`);
    if (!distributionContainer) {
        distributionContainer = document.createElement('div');
        distributionContainer.id = `analysis-distribution-${taskId}`;
        distributionContainer.className = 'analysis-distribution-professional mb-3';
        
        // Insert before feedback tabs
        elements.feedbackTabs.parentNode.insertBefore(distributionContainer, elements.feedbackTabs);
    }
    
    const { percentages, weakest_component } = analysisResult;
    const isGerman = currentLanguage === 'de';
    
    distributionContainer.innerHTML = `
        <div class="professional-analysis-summary">
            <h6>${isGerman ? 'Analyse Ihrer Reflexion' : 'Analysis of Your Reflection'}</h6>
            <p class="analysis-text">
                ${isGerman ? `Ihre Reflexion enthält ${percentages.description || 0}% Beschreibung, ${percentages.explanation || 0}% Erklärung und ${percentages.prediction || 0}% Vorhersage. Der schwächste Bereich ist ${weakest_component}.` 
                          : `Your reflection contains ${percentages.description || 0}% description, ${percentages.explanation || 0}% explanation, and ${percentages.prediction || 0}% prediction. The weakest component is ${weakest_component}.`}
            </p>
        </div>
    `;
}

// Professional feedback formatting with clean sections
function formatStructuredFeedback(text, analysisResult) {
    if (!text) return '';
    
    let formattedText = text.trim();
    
    // English section formatting
    formattedText = formattedText.replace(/####\s*Overall Assessment.*?(?=####|\n\n|$)/gs, (match) => {
        return `<div class="feedback-section feedback-section-overall">${match.replace(/####\s*/, '<h4 class="feedback-heading">')}</h4></div>`;
    });
    
    formattedText = formattedText.replace(/####\s*Description.*?(?=####|\n\n|$)/gs, (match) => {
        return `<div class="feedback-section feedback-section-description">${match.replace(/####\s*/, '<h4 class="feedback-heading">')}</h4></div>`;
    });
    
    formattedText = formattedText.replace(/####\s*Explanation.*?(?=####|\n\n|$)/gs, (match) => {
        return `<div class="feedback-section feedback-section-explanation">${match.replace(/####\s*/, '<h4 class="feedback-heading">')}</h4></div>`;
    });
    
    formattedText = formattedText.replace(/####\s*Prediction.*?(?=####|\n\n|$)/gs, (match) => {
        return `<div class="feedback-section feedback-section-prediction">${match.replace(/####\s*/, '<h4 class="feedback-heading">')}</h4></div>`;
    });
    
    formattedText = formattedText.replace(/####\s*Conclusion.*?(?=####|\n\n|$)/gs, (match) => {
        return `<div class="feedback-section feedback-section-overall">${match.replace(/####\s*/, '<h4 class="feedback-heading">')}</h4></div>`;
    });
    
    // German section formatting
    formattedText = formattedText.replace(/####\s*Gesamtbewertung.*?(?=####|\n\n|$)/gs, (match) => {
        return `<div class="feedback-section feedback-section-overall">${match.replace(/####\s*/, '<h4 class="feedback-heading">')}</h4></div>`;
    });
    
    formattedText = formattedText.replace(/####\s*Beschreibung.*?(?=####|\n\n|$)/gs, (match) => {
        return `<div class="feedback-section feedback-section-description">${match.replace(/####\s*/, '<h4 class="feedback-heading">')}</h4></div>`;
    });
    
    formattedText = formattedText.replace(/####\s*Erklärung.*?(?=####|\n\n|$)/gs, (match) => {
        return `<div class="feedback-section feedback-section-explanation">${match.replace(/####\s*/, '<h4 class="feedback-heading">')}</h4></div>`;
    });
    
    formattedText = formattedText.replace(/####\s*Vorhersage.*?(?=####|\n\n|$)/gs, (match) => {
        return `<div class="feedback-section feedback-section-prediction">${match.replace(/####\s*/, '<h4 class="feedback-heading">')}</h4></div>`;
    });
    
    formattedText = formattedText.replace(/####\s*Fazit.*?(?=####|\n\n|$)/gs, (match) => {
        return `<div class="feedback-section feedback-section-overall">${match.replace(/####\s*/, '<h4 class="feedback-heading">')}</h4></div>`;
    });
    
    // Format sub-headings with professional emphasis
    // First, handle English/German labels and make them bold (colon outside)
    formattedText = formattedText.replace(/\*\*(Strength|Strengths|Tip|Tips|Suggestions|Good):\*\*/g, '<strong class="feedback-keyword">$1</strong>:');
    // Handle "Why?" label (remove colon if present)
    formattedText = formattedText.replace(/\*\*(Why\\?|Why):?\*\*/g, '<strong class="feedback-keyword">Why?</strong>');
    // German labels
    formattedText = formattedText.replace(/\*\*(Stärke|Stärken|Gut|Tipp|Tipps|Vorschläge):\*\*/g, '<strong class="feedback-keyword">$1:</strong>');
    formattedText = formattedText.replace(/\*\*(Warum\\?):?\*\*/g, '<strong class="feedback-keyword">Warum?</strong>');
    
    // Format bold text
    formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Format list items
    formattedText = formattedText.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
    formattedText = formattedText.replace(/(<li>.*?<\/li>\s*)+/g, '<ul>$&</ul>');
    
    // Replace newlines with <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    formattedText = formattedText.replace(/<br>\s*<br>/g, '<br>');
    
    // After existing bold label replacements add plain label handling
     // Handle plain (non-bold) labels at start of line
    formattedText = formattedText.replace(/^(\s*)(Strengths?|Strength|Suggestions|Tip|Tips|Good)\s*:/gmi, '$1<strong class="feedback-keyword">$2</strong>:');
    formattedText = formattedText.replace(/^(\s*)Why\?\s*:/gmi, '$1<strong class="feedback-keyword">Why?</strong> ');
    formattedText = formattedText.replace(/^(\s*)(Stärke|Stärken|Tipp|Tipps|Vorschläge|Gut)\s*:/gmi, '$1<strong class="feedback-keyword">$2</strong>:');
    formattedText = formattedText.replace(/^(\s*)Warum\?\s*:/gmi, '$1<strong class="feedback-keyword">Warum?</strong> ');
    
    // After label replacements add:
    // Remove colon after Why keyword
    formattedText = formattedText.replace(/<strong class="feedback-keyword">Why\?<\/strong>\s*:/g, '<strong class="feedback-keyword">Why?</strong>');
    formattedText = formattedText.replace(/<strong class="feedback-keyword">Warum\?<\/strong>\s*:/g, '<strong class="feedback-keyword">Warum?</strong>');
    
    return formattedText;
}

// Utility Functions
function updateWordCount(taskId) {
    const elements = DOMElements[taskId];
    if (!elements) return;
    
    const text = elements.reflectionText.value.trim();
    const words = text === '' ? 0 : text.split(/\s+/).filter(Boolean).length;
    elements.wordCount.textContent = words;
}

function clearText(taskId) {
    const elements = DOMElements[taskId];
    const taskManager = TaskManager[taskId];
    
    if (!elements || !taskManager) return;
    
    elements.reflectionText.value = '';
    updateWordCount(taskId);
    
    // Reset feedback display
    elements.feedbackExtended.innerHTML = `<p class="text-muted">${translations[currentLanguage].feedback_placeholder}</p>`;
    elements.feedbackShort.innerHTML = `<p class="text-muted">${translations[currentLanguage].feedback_placeholder}</p>`;
    elements.feedbackTabs.classList.add('d-none');
    // Submit button remains visible - users can submit without generating feedback
    
    // Reset task state
    Object.assign(taskManager, {
        currentReflectionId: null,
        currentAnalysisResult: null,
        currentFeedbackType: userPreferredFeedbackStyle,
        currentFeedbackStartTime: null,
        feedbackGenerated: false
    });
    
    // Clear stored reflection
    sessionStorage.removeItem(`reflection-${taskId}`);
}

function copyFeedback(taskId) {
    const elements = DOMElements[taskId];
    const taskManager = TaskManager[taskId];
    
    if (!elements || !taskManager) return;
    
    const currentFeedback = taskManager.currentFeedbackType === 'extended' ? 
        elements.feedbackExtended : elements.feedbackShort;
    const textToCopy = currentFeedback.innerText || currentFeedback.textContent;
    
    logEvent('copy_feedback', {
        task: taskId,
        style: taskManager.currentFeedbackType,
        language: currentLanguage,
        reflection_id: taskManager.currentReflectionId,
        text_length: textToCopy.length
    });
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => showAlert(translations[currentLanguage].copy || 'Feedback copied to clipboard!', 'success'))
        .catch(err => {
            console.error('Could not copy text: ', err);
            showAlert('Could not copy text. Please try again.', 'danger');
        });
}

function handleReviseReflectionClick(taskId) {
    const elements = DOMElements[taskId];
    const taskManager = TaskManager[taskId];
    
    if (!elements || !taskManager) return;
    
    // Store the time when revise was clicked for warning tracking
    taskManager.lastReviseClickTime = Date.now();
    
    logEvent('click_revise', {
        task: taskId,
        from_style: taskManager.currentFeedbackType,
        language: currentLanguage,
        reflection_id: taskManager.currentReflectionId,
        current_reflection_length: elements.reflectionText.value.length,
        participant_name: elements.nameInput.value.trim(),
        video_id: elements.videoSelect.value
    });
    
    const previousReflection = sessionStorage.getItem(`reflection-${taskId}`);
    if (previousReflection) {
        elements.reflectionText.value = previousReflection;
        const message = currentLanguage === 'en' 
            ? 'Your previous reflection has been loaded. Edit it and click "Generate Feedback" for new feedback.'
            : 'Ihre vorherige Reflexion wurde geladen. Bearbeiten Sie sie und klicken Sie auf "Feedback generieren" für neues Feedback.';
        showAlert(message, 'info');
    }
    
    // Hide revise button and feedback until new generation
    elements.reviseBtn.style.display = 'none';
    elements.feedbackTabs.classList.add('d-none');
    
    // Remove analysis distribution
    const distributionContainer = document.getElementById(`analysis-distribution-${taskId}`);
    if (distributionContainer) {
        distributionContainer.remove();
    }
    
    elements.reflectionText.scrollIntoView({ behavior: 'smooth' });
    elements.reflectionText.focus();
}

function handleFinalSubmission(taskId) {
    const elements = DOMElements[taskId];
    const taskManager = TaskManager[taskId];
    
    if (!elements || !taskManager) return;
    
    // Check if there's any reflection text
    const currentReflection = elements.reflectionText.value.trim();
    if (!currentReflection) {
        const message = currentLanguage === 'en' 
            ? 'Please enter a reflection before final submission.' 
            : 'Bitte geben Sie eine Reflexion vor der endgültigen Einreichung ein.';
        showAlert(message, 'warning');
        elements.reflectionText.focus();
        return;
    }
    
    // No duplicate detection for final submission – user may submit same text if satisfied
    console.log('Final submission – duplicate detection skipped.');
    const warningCount = 0;
    
    // Log successful final submission
    logEvent('final_submission', {
        task: taskId,
        reflection_id: taskManager.currentReflectionId || Math.floor(Math.random() * 1000000),
        participant_name: elements.nameInput.value.trim(),
        video_id: elements.videoSelect.value,
        reflection_text: currentReflection,
        language: currentLanguage,
        warning_count_reached: warningCount,
        timestamp: new Date().toISOString()
    });
    
    // Show success message
    const successMessage = currentLanguage === 'en' 
        ? '✅ Final reflection submitted successfully!' 
        : '✅ Endgültige Reflexion erfolgreich eingereicht!';
    showAlert(successMessage, 'success');
    
    // Navigate to next page
    if (taskId === 'task1') {
        PageNavigator.showPage('survey1');
    } else if (taskId === 'task2') {
        PageNavigator.showPage('survey2');
    }
}

function copyTaskSettings(fromTaskId, toTaskId) {
    const fromElements = DOMElements[fromTaskId];
    const toElements = DOMElements[toTaskId];
    
    if (!fromElements || !toElements) return;
    
    // Copy name and language settings
    if (fromElements.nameInput && toElements.nameInput) {
        toElements.nameInput.value = fromElements.nameInput.value;
    }
    
    // Copy language selection
    if (fromElements.languageEn && fromElements.languageEn.checked && toElements.languageEn) {
        toElements.languageEn.checked = true;
    } else if (fromElements.languageDe && fromElements.languageDe.checked && toElements.languageDe) {
        toElements.languageDe.checked = true;
    }
}

function switchToTab(taskId, tabType) {
    const taskManager = TaskManager[taskId];
    
    if (!taskManager) return;
    
    // End viewing for previous tab
    if (taskManager.currentFeedbackType && taskManager.currentFeedbackStartTime) {
        endFeedbackViewing(taskId, taskManager.currentFeedbackType, currentLanguage);
    }
    
    // Log tab switch event
    logEvent('select_feedback_style', {
        task: taskId,
        from_style: taskManager.currentFeedbackType,
        to_style: tabType,
        language: currentLanguage,
        reflection_id: taskManager.currentReflectionId
    });
    
    // Update current tab
    taskManager.currentFeedbackType = tabType;
    
    // Start tracking time for the new tab
    if (taskManager.feedbackGenerated) {
        startFeedbackViewing(taskId, tabType, currentLanguage);
    }
}

function startFeedbackViewing(taskId, style, language) {
    const taskManager = TaskManager[taskId];
    if (!taskManager) return;
    
    taskManager.currentFeedbackStartTime = Date.now();
    logEvent('view_feedback_start', {
        task: taskId,
        style: style,
        language: language,
        reflection_id: taskManager.currentReflectionId
    });
}

function endFeedbackViewing(taskId, style, language) {
    const taskManager = TaskManager[taskId];
    if (!taskManager || !taskManager.currentFeedbackStartTime) return;
    
    const duration = (Date.now() - taskManager.currentFeedbackStartTime) / 1000;
    logEvent('view_feedback_end', {
        task: taskId,
        style: style,
        language: language,
        duration_seconds: duration,
        reflection_id: taskManager.currentReflectionId
    });
    taskManager.currentFeedbackStartTime = null;
}

// Continue with remaining essential functions...
// [Due to length constraints, will add remaining functions in next edit]

// Language Management
function updateLanguage(lang) {
    currentLanguage = lang;
    const trans = translations[lang];
    
    // Update all elements with data-lang-key across all pages
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
    
    // Update progress text
    if (DOMElements.progressText) {
        DOMElements.progressText.textContent = `Study Progress: ${studyProgress}%`;
    }
    
    // Update word count labels for both tasks
    updateWordCountLabels();
}

function updateWordCountLabels() {
    const trans = translations[currentLanguage];
    
    // Update Task 1 word count label
    const task1Container = DOMElements.task1.wordCountContainer;
    if (task1Container) {
        const wordSpan = task1Container.querySelector('span:last-child');
        if (wordSpan) wordSpan.textContent = ` ${trans.words}`;
    }
    
    // Update Task 2 word count label  
    const task2Container = DOMElements.task2.wordCountContainer;
    if (task2Container) {
        const wordSpan = task2Container.querySelector('span:last-child');
        if (wordSpan) wordSpan.textContent = ` ${trans.words}`;
    }
}

// AI Feedback Generation Functions (simplified versions of the original)
async function analyzeReflectionDistribution(reflection, language) {
    const analysisPrompt = language === 'en' 
        ? `Analyze this teaching reflection and determine the distribution of content across Description, Explanation, and Prediction components. Return ONLY a JSON object: {"percentages": {"description": 40, "explanation": 35, "prediction": 20, "other": 5}, "weakest_component": "Prediction", "analysis_summary": "Brief explanation"}`
        : `Analysieren Sie diese Unterrichtsreflexion und bestimmen Sie die Verteilung auf Beschreibung, Erklärung und Vorhersage. Geben Sie NUR ein JSON-Objekt zurück: {"percentages": {"description": 40, "explanation": 35, "prediction": 20, "other": 5}, "weakest_component": "Vorhersage", "analysis_summary": "Kurze Erklärung"}`;

        const requestData = {
            model: model,
            messages: [
                {
                    role: "system",
                content: "You are an expert in analyzing teaching reflections. Return ONLY a valid JSON object."
                },
                {
                    role: "user",
                content: analysisPrompt + "\n\nReflection:\n" + reflection
                }
            ],
        temperature: 0.3,
            max_tokens: 300,
        response_format: { type: "json_object" }
        };

        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
            headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

        if (!response.ok) throw new Error('Error analyzing reflection distribution');

            const result = await response.json();
        const analysis = JSON.parse(result.choices[0].message.content);
            
            // Validate and normalize percentages
            const { percentages } = analysis;
                const keys = ['description', 'explanation', 'prediction', 'other'];
            
                keys.forEach(key => {
                if (typeof percentages[key] !== 'number' || isNaN(percentages[key]) || percentages[key] < 0) {
                        percentages[key] = 0;
                    }
                });

            // Ensure percentages sum to 100
        const total = Object.values(percentages).reduce((sum, value) => sum + value, 0);
        if (total > 0) {
            const scaleFactor = 100 / total;
            Object.keys(percentages).forEach(key => {
                percentages[key] = Math.round(percentages[key] * scaleFactor);
            });
        }

            return analysis;

        } catch (error) {
        console.error('Error in analyzeReflectionDistribution:', error);
            return {
                percentages: { description: 30, explanation: 35, prediction: 25, other: 10 },
                weakest_component: "Prediction",
                analysis_summary: "Default distribution due to analysis error"
            };
        }
    }

    async function generateWeightedFeedback(reflection, language, style, analysisResult) {
        const promptType = `${style} ${language === 'en' ? 'English' : 'German'}`;
        const systemPrompt = getFeedbackPrompt(promptType, analysisResult);
        
        const languageInstruction = language === 'en' 
        ? "IMPORTANT: You MUST respond in English. The entire feedback MUST be in English only."
        : "WICHTIG: Sie MÜSSEN auf Deutsch antworten. Das gesamte Feedback MUSS ausschließlich auf Deutsch sein.";
        
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
                content: `Based on the analysis showing ${analysisResult.percentages.description}% description, ${analysisResult.percentages.explanation}% explanation, ${analysisResult.percentages.prediction}% prediction, provide feedback for this reflection:\n\n${reflection}`
                }
            ],
        temperature: 0.7,
        max_tokens: 2000
        };
        
        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
            headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Error generating feedback');
            }
            
            const result = await response.json();
        return result.choices[0].message.content;
        } catch (error) {
        console.error('Error in generateWeightedFeedback:', error);
            throw error;
        }
    }

function getFeedbackPrompt(promptType, analysisResult) {
    const weakestComponent = analysisResult ? analysisResult.weakest_component : 'Prediction';
    const percentages = analysisResult ? analysisResult.percentages : { description: 30, explanation: 35, prediction: 25, other: 10 };
    
    const prompts = {
        'academic English': `You are a supportive teaching mentor providing academic feedback on a student teacher's reflection analysis using the professional vision framework.

ANALYSIS RESULTS: The student's reflection contains ${percentages.description}% Description, ${percentages.explanation}% Explanation, ${percentages.prediction}% Prediction, and ${percentages.other}% Other content. The weakest component is ${weakestComponent}.

PROFESSIONAL VISION FRAMEWORK:
- **Description**: Accurately noting what happened in the classroom without interpretation
- **Explanation**: Interpreting classroom events using educational theory and research
- **Prediction**: Forecasting how teacher actions might affect student learning

FEEDBACK STRUCTURE REQUIREMENTS:
You MUST provide feedback in exactly these sections with proper headings:

#### Overall Assessment
Provide a comprehensive overview using actual percentages: "Your reflection demonstrates ${percentages.description}% description, ${percentages.explanation}% explanation, and ${percentages.prediction}% prediction. The weakest area is ${weakestComponent}."

#### Description  
**Strength:** [2-3 sentences if ${weakestComponent} = Description, otherwise 1 sentence]
**Suggestions:** [2-3 sentences if ${weakestComponent} = Description, otherwise 1 sentence]  
**Why?:** [2-3 sentences if ${weakestComponent} = Description, otherwise 1 sentence]

#### Explanation
**Strength:** [2-3 sentences if ${weakestComponent} = Explanation, otherwise 1 sentence]
**Suggestions:** [2-3 sentences if ${weakestComponent} = Explanation, otherwise 1 sentence]
**Why?:** [2-3 sentences if ${weakestComponent} = Explanation, otherwise 1 sentence]

#### Prediction  
**Strength:** [2-3 sentences if ${weakestComponent} = Prediction, otherwise 1 sentence]
**Suggestions:** [2-3 sentences if ${weakestComponent} = Prediction, otherwise 1 sentence]
**Why?:** [2-3 sentences if ${weakestComponent} = Prediction, otherwise 1 sentence]

#### Conclusion
Provide specific next steps focusing on improving ${weakestComponent}.

Focus extra attention on ${weakestComponent} as it's the weakest area. Use educational theory references and maintain academic rigor.`,
        
        'user-friendly English': `You are a friendly teaching mentor giving practical, easy-to-understand feedback on a student teacher's video analysis.

ANALYSIS RESULTS: The student's reflection has ${percentages.description}% Description, ${percentages.explanation}% Explanation, ${percentages.prediction}% Prediction, and ${percentages.other}% Other content. They need the most help with ${weakestComponent}.

WHAT TO LOOK FOR:
- **Description**: What exactly happened in the classroom (no judging, just facts)
- **Explanation**: Why it happened (using teaching theories)  
- **Prediction**: How it might affect student learning

FEEDBACK STRUCTURE REQUIREMENTS:
You MUST provide feedback in exactly these sections:

#### Description
**Good:** [2-3 sentences if ${weakestComponent} = Description, otherwise 1 sentence]
**Tip:** [2-3 sentences if ${weakestComponent} = Description, otherwise 1 sentence]
**Why?:** [2-3 sentences if ${weakestComponent} = Description, otherwise 1 sentence]

#### Explanation  
**Good:** [2-3 sentences if ${weakestComponent} = Explanation, otherwise 1 sentence]
**Tip:** [2-3 sentences if ${weakestComponent} = Explanation, otherwise 1 sentence]
**Why?:** [2-3 sentences if ${weakestComponent} = Explanation, otherwise 1 sentence]

#### Prediction
**Good:** [2-3 sentences if ${weakestComponent} = Prediction, otherwise 1 sentence] 
**Tip:** [2-3 sentences if ${weakestComponent} = Prediction, otherwise 1 sentence]
**Why?:** [2-3 sentences if ${weakestComponent} = Prediction, otherwise 1 sentence]

#### Conclusion
Give simple, practical advice for improving ${weakestComponent}.

Use simple language and focus most on helping with ${weakestComponent} since that's where they need the most support.`,
        
        'academic German': `Sie sind ein unterstützender Mentor, der akademisches Feedback zur Reflexionsanalyse eines Studierenden gibt, basierend auf dem Professional Vision Framework.

ANALYSEERGEBNISSE: Die Reflexion des Studierenden enthält ${percentages.description}% Beschreibung, ${percentages.explanation}% Erklärung, ${percentages.prediction}% Vorhersage und ${percentages.other}% Sonstiges. Die schwächste Komponente ist ${weakestComponent}.

PROFESSIONAL VISION FRAMEWORK:
- **Beschreibung**: Genaue Beobachtung ohne Interpretation
- **Erklärung**: Interpretation mit pädagogischen Theorien
- **Vorhersage**: Prognose der Auswirkungen auf das Lernen

FEEDBACK-STRUKTUR ANFORDERUNGEN:
Sie MÜSSEN Feedback in genau diesen Abschnitten mit korrekten Überschriften geben:

#### Gesamtbewertung
Umfassender Überblick mit tatsächlichen Prozentsätzen: "Ihre Reflexion zeigt ${percentages.description}% Beschreibung, ${percentages.explanation}% Erklärung und ${percentages.prediction}% Vorhersage. Der schwächste Bereich ist ${weakestComponent}."

#### Beschreibung
**Stärke:** [2-3 Sätze wenn ${weakestComponent} = Beschreibung, sonst 1 Satz]
**Vorschläge:** [2-3 Sätze wenn ${weakestComponent} = Beschreibung, sonst 1 Satz]
**Warum?:** [2-3 Sätze wenn ${weakestComponent} = Beschreibung, sonst 1 Satz]

#### Erklärung  
**Stärke:** [2-3 Sätze wenn ${weakestComponent} = Erklärung, sonst 1 Satz]
**Vorschläge:** [2-3 Sätze wenn ${weakestComponent} = Erklärung, sonst 1 Satz]
**Warum?:** [2-3 Sätze wenn ${weakestComponent} = Erklärung, sonst 1 Satz]

#### Vorhersage
**Stärke:** [2-3 Sätze wenn ${weakestComponent} = Vorhersage, sonst 1 Satz]  
**Vorschläge:** [2-3 Sätze wenn ${weakestComponent} = Vorhersage, sonst 1 Satz]
**Warum?:** [2-3 Sätze wenn ${weakestComponent} = Vorhersage, sonst 1 Satz]

#### Fazit
Spezifische nächste Schritte zur Verbesserung von ${weakestComponent}.

Konzentrieren Sie sich besonders auf ${weakestComponent} als schwächsten Bereich.`,
        
        'user-friendly German': `Sie sind ein freundlicher Mentor, der praktisches, leicht verständliches Feedback zur Videoanalyse eines Studierenden gibt.

ANALYSEERGEBNISSE: Die Reflexion hat ${percentages.description}% Beschreibung, ${percentages.explanation}% Erklärung, ${percentages.prediction}% Vorhersage und ${percentages.other}% Sonstiges. Am meisten Hilfe brauchen sie bei ${weakestComponent}.

WORAUF ACHTEN:
- **Beschreibung**: Was genau passiert ist (keine Bewertung, nur Fakten)
- **Erklärung**: Warum es passiert ist (mit Lehrtheorien)
- **Vorhersage**: Wie es das Lernen beeinflussen könnte

FEEDBACK-STRUKTUR ANFORDERUNGEN:
Sie MÜSSEN Feedback in genau diesen Abschnitten geben:

#### Beschreibung
**Gut:** [2-3 Sätze wenn ${weakestComponent} = Beschreibung, sonst 1 Satz]
**Tipp:** [2-3 Sätze wenn ${weakestComponent} = Beschreibung, sonst 1 Satz]  
**Warum?:** [2-3 Sätze wenn ${weakestComponent} = Beschreibung, sonst 1 Satz]

#### Erklärung
**Gut:** [2-3 Sätze wenn ${weakestComponent} = Erklärung, sonst 1 Satz]
**Tipp:** [2-3 Sätze wenn ${weakestComponent} = Erklärung, sonst 1 Satz]
**Warum?:** [2-3 Sätze wenn ${weakestComponent} = Erklärung, sonst 1 Satz]

#### Vorhersage  
**Gut:** [2-3 Sätze wenn ${weakestComponent} = Vorhersage, sonst 1 Satz]
**Tipp:** [2-3 Sätze wenn ${weakestComponent} = Vorhersage, sonst 1 Satz]
**Warum?:** [2-3 Sätze wenn ${weakestComponent} = Vorhersage, sonst 1 Satz]

#### Fazit
Einfache, praktische Ratschläge zur Verbesserung von ${weakestComponent}.

Verwenden Sie einfache Sprache und konzentrieren Sie sich auf ${weakestComponent}.`
    };
    
    return prompts[promptType] || prompts['academic English'];
}

function formatFeedback(text) {
    if (!text) return '';
    
    let formattedText = text.trim();
    
    // Format headings
    formattedText = formattedText.replace(/####\s+([^\n]+)/g, '<h4>$1</h4>');
    
    // Format bold text
    formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Format list items
    formattedText = formattedText.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
    formattedText = formattedText.replace(/(<li>.*?<\/li>\s*)+/g, '<ul>$&</ul>');
    
    // Replace newlines with <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    formattedText = formattedText.replace(/<br>\s*<br>/g, '<br>');
    
    return formattedText;
}

// Enhanced Database Functions with Task-Specific Logging
async function saveFeedbackToDatabase(taskId, data) {
    if (!supabase) {
        console.log('No database connection - running in demo mode');
        return;
    }

    try {
        const revisionNumber = TaskManager[taskId].revisionCount || 1;
        const parentReflectionId = TaskManager[taskId].parentReflectionId || null;

        const reflectionData = {
            session_id: currentSessionId,
            participant_name: data.studentName,
            video_id: data.videoSelected,
            language: currentLanguage,
            task_id: taskId, // CRITICAL: Task-specific tracking
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

        // Update task manager with database ID
        TaskManager[taskId].currentReflectionId = result.id;
        
        // If this is a revision, store parent ID for next revision
        if (revisionNumber === 1) {
            TaskManager[taskId].parentReflectionId = result.id;
        }
        
        console.log(`✅ ${taskId} reflection saved to database:`, result.id);
        
    } catch (error) {
        console.error('Error saving to database:', error);
    }
}

// Enhanced resubmit function for revisions
async function resubmitReflection(taskId) {
    const elements = DOMElements[taskId];
    const taskManager = TaskManager[taskId];
    
    if (!elements || !taskManager) return;
    
    // Increment revision count
    taskManager.revisionCount = (taskManager.revisionCount || 1) + 1;
    
    // Log revision submission
    logEvent('resubmit_reflection', {
        task: taskId,
        participant_name: elements.nameInput.value.trim(),
        video_id: elements.videoSelect.value,
        language: currentLanguage,
        reflection_id: taskManager.currentReflectionId,
        parent_reflection_id: taskManager.parentReflectionId,
        revision_number: taskManager.revisionCount,
        reflection_length: elements.reflectionText.value.length,
        time_since_first_submission: Date.now() - (taskManager.firstSubmissionTime || Date.now())
    });
    
    // Generate new feedback
    await generateFeedback(taskId);
}

// Show Final Submission Modal with Enhanced Logging
function showFinalSubmissionModal(taskId) {
    const elements = DOMElements[taskId];
    if (!elements) return;
    
    // Set the taskId data attribute for the modal so handleFinalSubmission can access it
    const modalElement = DOMElements.modals.finalSubmission;
    modalElement.dataset.taskId = taskId;
    
    logEvent('final_submission_modal_shown', {
        task: taskId,
        participant_name: elements.nameInput.value.trim(),
        video_id: elements.videoSelect.value,
            language: currentLanguage,
        reflection_id: TaskManager[taskId].currentReflectionId,
        total_revisions: TaskManager[taskId].revisionCount || 1,
        final_reflection_length: elements.reflectionText.value.length
    });
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // Don't set onclick handler here - let setupModalListeners handle it
    // This prevents conflicts and ensures handleFinalSubmission is called properly
}

// Utility Functions
function getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('appSessionId');
    if (!sessionId) {
        sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        sessionStorage.setItem('appSessionId', sessionId);
        console.log('New session ID generated:', sessionId);
    }
    return sessionId;
}

async function logEvent(eventType, eventData = {}) {
    if (!supabase || !currentSessionId) return;
    
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
            console.log(`Event logged: ${eventType}`, eventData);
        }
    } catch (error) {
        console.error('Error in logEvent:', error);
    }
}

function toggleLoading(taskId, isLoading) {
    const elements = DOMElements[taskId];
    if (!elements) return;
    
    if (isLoading) {
        elements.loadingSpinner.style.display = 'flex';
        elements.generateBtn.disabled = true;
            } else {
        elements.loadingSpinner.style.display = 'none';
        elements.generateBtn.disabled = false;
    }
}

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;
    
    const icons = {
        success: '<i class="bi bi-check-circle-fill me-2"></i>',
        warning: '<i class="bi bi-exclamation-triangle-fill me-2"></i>',
        danger: '<i class="bi bi-x-circle-fill me-2"></i>',
        info: '<i class="bi bi-info-circle-fill me-2"></i>'
    };
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${icons[type] || icons.info}${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

    function initSupabase() {
        if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        console.warn('Supabase credentials not set. Running in demo mode.');
        showAlert('Running in demo mode - feedback generation works, but data won\'t be saved.', 'info');
            return null;
        }
        
        try {
        console.log('Initializing Supabase client...');
        
        // Check if Supabase library is loaded properly
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
            console.log('Verifying Supabase connection...');
            const { data, error } = await client.from('reflections').select('id').limit(1);
            
        if (error) throw error;
            
            console.log('Successfully connected to Supabase database');
        showAlert('✅ Database connected - all features available!', 'success');
        } catch (error) {
            console.error('Supabase connection verification failed:', error);
        showAlert('Database connection issue - running in demo mode. Feedback generation still works!', 'warning');
    }
}

// Cleanup on page unload
    window.addEventListener('beforeunload', () => {
    // End any active feedback viewing sessions
    Object.keys(TaskManager).forEach(taskId => {
        const taskManager = TaskManager[taskId];
        if (taskManager.currentFeedbackType && taskManager.currentFeedbackStartTime) {
            endFeedbackViewing(taskId, taskManager.currentFeedbackType, currentLanguage);
        }
    });
        
        logEvent('session_end', {
            session_duration: Date.now() - performance.timing.navigationStart,
        language: currentLanguage,
        final_page: currentPage,
        final_progress: studyProgress
        });
    });

// Enhanced bubble alert for duplicate warnings (more noticeable)
function showBubbleWarning(message, element, type = 'warning') {
    // Remove any existing bubbles
    const existingBubbles = document.querySelectorAll('.bubble-warning');
    existingBubbles.forEach(bubble => bubble.remove());
    
    // Create bubble element
    const bubble = document.createElement('div');
    bubble.className = `bubble-warning bubble-${type}`;
    bubble.innerHTML = `
        <div class="bubble-content">
            <span class="bubble-icon">⚠️</span>
            <span class="bubble-text">${message}</span>
            <button class="bubble-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    bubble.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #fff3cd;
        border: 2px solid #ffc107;
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        z-index: 12000;
        max-width: 360px;
        font-size: 0.85rem;
        line-height: 1.4;
        color: #856404;
        animation: bubbleSlideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(bubble);
}

console.log('Multi-page Teacher Professional Vision Study loaded successfully');