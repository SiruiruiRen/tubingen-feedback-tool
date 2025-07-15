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
        reflection_input: "Reflection Text",
        paste_reflection: "Paste your reflection here...",
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
        
        // Step 4: Display structured feedback with proper CSS classes
        elements.feedbackExtended.innerHTML = `<div class="feedback-content">${formatStructuredFeedback(extendedFeedback, analysisResult)}</div>`;
        elements.feedbackShort.innerHTML = `<div class="feedback-content">${formatStructuredFeedback(shortFeedback, analysisResult)}</div>`;
        
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

// Professional feedback formatting with clean sections
function formatStructuredFeedback(text, analysisResult) {
    if (!text) return '';
    
    let formattedText = text.trim();
    
    // Step 1: Handle section headers (before newline conversion)
    const sectionMap = {
        'Overall Assessment': 'overall',
        'Gesamtbewertung': 'overall',
        'Description': 'description',
        'Beschreibung': 'description',
        'Explanation': 'explanation',
        'Erklärung': 'explanation',
        'Prediction': 'prediction',
        'Vorhersage': 'prediction',
        'Conclusion': 'overall',
        'Fazit': 'overall'
    };

    // Generic replacement for both English & German headings
    formattedText = formattedText.replace(/####\s*([^\n]+)\n?/g, (match, p1) => {
        const heading = p1.trim();
        // Determine section class based on heading map
        let sectionClass = 'other';
        for (const key in sectionMap) {
            if (heading.toLowerCase().startsWith(key.toLowerCase())) {
                sectionClass = sectionMap[key];
                break;
            }
        }
        return `<div class="feedback-section feedback-section-${sectionClass}"><h4 class="feedback-heading">${heading}</h4>`;
    });
    // Close any open section divs at the end of the text
    formattedText += '</div>';

    // Step 2: Remove ALL bold markdown first to prevent any text from being bolded
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Step 3: Handle sub-headings - only format specific keywords, not their content
    const keywordPatterns = [
        /(Strength|Strengths|Suggestion|Suggestions|Good|Tip|Tips|Why\?)/gi,
        /(Stärke|Stärken|Vorschlag|Vorschläge|Gut|Tipp|Tipps|Warum\?)/gi
    ];
    keywordPatterns.forEach((pat) => {
        formattedText = formattedText.replace(pat, '<strong class="feedback-keyword">$1</strong>');
    });

    // Ensure keywords end with ':'
    formattedText = formattedText.replace(/(<strong class="feedback-keyword">[^<]+<\/strong>)(\s*)/g, '$1: ');

    // Step 4: Insert line break after keyword labels for better readability
    formattedText = formattedText.replace(/(<strong class="feedback-keyword">[^<]+<\/strong>:)/g, '$1<br>');

    // Step 5: Convert list items
    formattedText = formattedText.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
    formattedText = formattedText.replace(/(<li>.*?<\/li>\s*)+/g, '<ul>$&</ul>');

    // Step 6: Replace newlines with <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    formattedText = formattedText.replace(/<br>\s*<br>/g, '<br>');

    // Close remaining open section divs before next section start
    formattedText = formattedText.replace(/(<\/h4>)/g, '$1');
    formattedText = formattedText.replace(/(<div class="feedback-section[\s\S]*?)(<div class="feedback-section|$)/g, (m, p1, p2) => {
        if (p2 === '') return p1 + '</div>'; // close last section at end
        return p1 + '</div>' + p2;
    });

    // Ensure Why? keyword has no colon duplication
    formattedText = formattedText.replace(/Why\?<br>/gi, 'Why?<br>');
    formattedText = formattedText.replace(/Warum\?<br>/gi, 'Warum?<br>');

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

// NEW 4-STEP CLASSIFICATION SYSTEM (July 2025)
// Step 1: Text Preprocessing - Create sentence windows
function createSentenceWindows(text) {
    // Split text into sentences using basic sentence detection
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const cleanSentences = sentences
        .map(s => s.trim())
        .filter(s => s.length > 0);
    
    const windows = [];
    let windowId = 1;
    
    // Create non-overlapping 3-sentence windows for better speed
    for (let i = 0; i < cleanSentences.length; i += 3) {
        const remainingSentences = cleanSentences.length - i;
        const sentenceCount = Math.min(3, remainingSentences);
        const windowText = cleanSentences.slice(i, i + sentenceCount).join(' ');
        
        if (windowText.length >= 20) {
            windows.push({
                id: `chunk_${String(windowId++).padStart(3, '0')}`,
                text: windowText,
                sentence_count: sentenceCount,
                start_position: i
            });
        }
    }
    
    return windows.length > 0 ? windows : [{ 
        id: 'chunk_001', 
        text: text, 
        sentence_count: 1, 
        start_position: 0 
    }];
}

// Step 2: Binary Classifiers
async function classifyDescription(windowText) {
    const prompt = `You are an expert in analyzing teaching reflections. Determine if this text contains descriptions of observable teaching events.

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

INSTRUCTIONS:
- Respond with ONLY "1" or "0"
- No explanations, quotes, or other text
- "1" if ANY part describes observable teaching events
- "0" if text only contains evaluations, interpretations, or speculation

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
- Examples: "Open questions activate students cognitively", "Rules prevent disruptions"

CRITERIA FOR "0" (No Explanation):
- No connection to educational theories or principles
- Explains non-observable or hypothetical events
- No reference to teaching/learning events
- Pure description without theoretical connection

INSTRUCTIONS:
- Respond with ONLY "1" or "0"
- No explanations, quotes, or other text
- "1" if ANY part connects teaching events to educational knowledge
- "0" if no theoretical connections present

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
- Examples: "This feedback could increase motivation", "Students may feel confused"

CRITERIA FOR "0" (No Prediction):
- No effects on student learning mentioned
- Predictions without educational basis
- No connection to teaching events
- Predictions about non-learning outcomes

INSTRUCTIONS:
- Respond with ONLY "1" or "0"
- No explanations, quotes, or other text
- "1" if ANY part predicts effects on student learning
- "0" if no learning consequences mentioned

TEXT: ${windowText}`;

    return await callBinaryClassifier(prompt);
}

// Binary classifier API call with validation and retry
async function callBinaryClassifier(prompt) {
        const requestData = {
            model: model,
            messages: [
                {
                    role: "system",
                content: "You are an expert teaching reflection analyst. Be conservative in your classifications - only respond '1' if you are clearly certain the criteria are met. Respond with ONLY '1' or '0'."
                },
                {
                    role: "user",
                content: prompt
            }
        ],
        temperature: 0.0,
        max_tokens: 10
    };

    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) continue;

            const result = await response.json();
            const output = result.choices[0].message.content.trim();
            
            // Validate binary output
            if (output === '1' || output === '0') {
                return parseInt(output);
            }
            
            // Try to extract 1 or 0 from response
            if (output.includes('1')) return 1;
            if (output.includes('0')) return 0;
            
        } catch (error) {
            console.warn(`Binary classifier attempt ${attempt + 1} failed:`, error);
        }
    }
    
    // Default to 0 if all attempts fail
    return 0;
}

// Step 3: Mathematical Aggregation
function calculatePercentages(classificationResults) {
    const totalWindows = classificationResults.length;
    
    if (totalWindows === 0) {
        return {
            percentages: { description: 0, explanation: 0, prediction: 0, other: 100, professional_vision: 0 },
            weakest_component: "Prediction",
            analysis_summary: "No valid windows for analysis"
        };
    }
    
    // Assign each window to exactly one category using priority system
    // Priority: Description > Explanation > Prediction > Other
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
    
    // Calculate raw percentages
    const descriptionPct = (descriptionCount / totalWindows) * 100;
    const explanationPct = (explanationCount / totalWindows) * 100;
    const predictionPct = (predictionCount / totalWindows) * 100;
    const otherPct = (otherCount / totalWindows) * 100;
    
    // Professional Vision% = Description% + Explanation% + Prediction%
    const professionalVisionPct = descriptionPct + explanationPct + predictionPct;
    
    // Ensure Professional Vision% + Others% = 100%
    const adjustedOtherPct = 100 - professionalVisionPct;
    
    // Round all percentages to 1 decimal place
    const finalPercentages = {
        description: Math.round(descriptionPct * 10) / 10,
        explanation: Math.round(explanationPct * 10) / 10,
        prediction: Math.round(predictionPct * 10) / 10,
        other: Math.round(adjustedOtherPct * 10) / 10,
        professional_vision: Math.round(professionalVisionPct * 10) / 10
    };
    
    // Find weakest component (excluding other)
    const components = {
        'Description': finalPercentages.description,
        'Explanation': finalPercentages.explanation,
        'Prediction': finalPercentages.prediction
    };
    
    const weakestComponent = Object.keys(components).reduce((a, b) => 
        components[a] <= components[b] ? a : b
    );
    
    return {
        percentages: finalPercentages,
        weakest_component: weakestComponent,
        analysis_summary: `Analyzed ${totalWindows} non-overlapping text windows. Professional Vision: ${finalPercentages.professional_vision}% (D:${finalPercentages.description}% + E:${finalPercentages.explanation}% + P:${finalPercentages.prediction}%) + Other: ${finalPercentages.other}% = 100%`
    };
}

// Step 4: Main Analysis Function (replaces old analyzeReflectionDistribution)
async function analyzeReflectionDistribution(reflection, language) {
    try {
        console.log('🔄 Starting 4-step classification analysis...');
        
        // Step 1: Create sentence windows
        const windows = createSentenceWindows(reflection);
        console.log(`📝 Created ${windows.length} non-overlapping sentence windows`);
        
        // Step 2: Triple binary classification for each window
        const classificationResults = [];
        
        for (const window of windows) {
            console.log(`🔍 Analyzing window: ${window.id}`);
            
            // Run all three classifiers in parallel for efficiency
            const [description, explanation, prediction] = await Promise.all([
                classifyDescription(window.text),
                classifyExplanation(window.text),
                classifyPrediction(window.text)
            ]);
            
            classificationResults.push({
                window_id: window.id,
                description,
                explanation,
                prediction
            });
        }
        
        console.log('✅ Classification complete, calculating percentages (adding up to 100%)...');
        
        // Step 3: Mathematical aggregation
        const analysis = calculatePercentages(classificationResults);
        
        console.log('📊 Analysis result:', analysis);
            return analysis;

        } catch (error) {
        console.error('❌ Error in 4-step classification:', error);
        // Fallback to default distribution
            return {
                percentages: { description: 30, explanation: 35, prediction: 25, other: 10 },
                weakest_component: "Prediction",
            analysis_summary: "Fallback distribution due to classification error"
            };
        }
    }

// AI Feedback Generation Functions (simplified versions of the original)
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
            content: `Based on the analysis showing ${analysisResult.percentages.description}% description, ${analysisResult.percentages.explanation}% explanation, ${analysisResult.percentages.prediction}% prediction (Professional Vision: ${analysisResult.percentages.professional_vision}%) + Other: ${analysisResult.percentages.other}% = 100%, provide feedback for this reflection:\n\n${reflection}`
                }
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
                const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error generating feedback');
            }
            
            const result = await response.json();
            let feedback = result.choices[0].message.content;
            
            // Add revision suggestion if content is too irrelevant to professional vision
            if (analysisResult && analysisResult.percentages.other > 50) {
                const revisionNote = language === 'en' 
                    ? "\n\n**Important Note:** Your reflection contains a significant amount of content that doesn't follow professional lesson analysis steps. Please revise your reflection to focus more on describing what you observed, explaining why it happened using educational theories, and predicting the effects on student learning."
                    : "\n\n**Wichtiger Hinweis:** Ihre Reflexion enthält einen erheblichen Anteil an Inhalten, die nicht den Schritten einer professionellen Stundenanalyse folgen. Bitte überarbeiten Sie Ihre Reflexion, um sich mehr auf die Beschreibung Ihrer Beobachtungen, die Erklärung mit Hilfe pädagogischer Theorien und die Vorhersage der Auswirkungen auf das Lernen der Schüler zu konzentrieren.";
                feedback += revisionNote;
            }
            
            return feedback;
        } catch (error) {
    console.error('Error in generateWeightedFeedback:', error);
            throw error;
        }
    }

    function getFeedbackPrompt(promptType, analysisResult) {
        const weakestComponent = analysisResult ? analysisResult.weakest_component : 'Prediction';
    const percentages = analysisResult ? analysisResult.percentages : { description: 30, explanation: 35, prediction: 25, other: 10, professional_vision: 90 };

        const prompts = {
        'academic English': `You are a supportive yet rigorous teaching mentor providing feedback on student teacher classroom video analysis using the Professional Vision Framework.

**Knowledge Base Integration:**
Base your feedback on the theoretical framework of empirical teaching quality research about effective teaching and learning components, for example according to the process-oriented teaching-learning model (Seidel & Shavelson, 2007) or the three basic dimensions of teaching quality (Klieme, 2006). Use references to effective teaching and learning components from these frameworks for feedback on description and explanation. To analyze possible consequences for student learning regarding prediction, effective teaching and learning components as superordinate theoretical category can be explained by the self-determination theory of motivation (Deci & Ryan, 1993) or the theory of cognitive and constructive learning (Atkinson & Shiffrin, 1968; Craik & Lockhart, 1972).

**CRITICAL: ONLY use the theories mentioned above. Do NOT cite any other theories or authors not explicitly provided in this knowledge base.**

**MANDATORY WEIGHTED FEEDBACK STRUCTURE:**
1. Description% (${percentages.description}%) + Explanation% (${percentages.explanation}%) + Prediction% (${percentages.prediction}%) = Professional Vision% (${percentages.professional_vision}%), Professional Vision% + Others% (${percentages.other}%) = 100%
2. **IDENTIFY WEAKEST AREA**: Find the LOWEST percentage among Description, Explanation, Prediction
3. **MAIN FOCUS**: Write 6-8 detailed sentences ONLY for the weakest area with multiple specific suggestions
4. **BRIEF SECTIONS**: For the two stronger areas, write exactly 3 sentences each (1 Strength + 1 Suggestion + 1 Why)
5. **Focus conclusion**: Target advice on improving the weakest area only

**Overall Assessment Template (2-3 sentences max):**
"Your analysis shows ${percentages.professional_vision}% professional vision (${percentages.description}% description, ${percentages.explanation}% explanation, ${percentages.prediction}% prediction) and ${percentages.other}% other content. The weakest area is ${weakestComponent}, which needs more development."

**CRITICAL FOCUS REQUIREMENTS:**
- Focus ONLY on analysis skills, NEVER on teaching practice
- NO predictions about student behaviors - focus on teacher's analysis abilities
- Description feedback must emphasize NO evaluation/judgment
- Target the weakest professional vision component for development

**FORMATTING:**
- Five sections: "#### Overall Assessment", "#### Description", "#### Explanation", "#### Prediction", "#### Conclusion"
- Sub-headings: "Strength:", "Suggestions:", "Why?"
- Conclusion template: "You show a strong sense of what effective teacher behavior involves and identify key problems in learning process design. To further improve your analysis: [focus on weakest component], refer explicitly to teaching quality components, use clearly named psychological concepts when predicting learning effects."

**CRITICAL SENTENCE REQUIREMENTS - MUST BE FOLLOWED EXACTLY:**
- **${weakestComponent} section ONLY**: Write 6-8 detailed sentences with multiple specific suggestions (THIS IS THE WEAKEST AREA)
- **All other sections**: Write EXACTLY 3 sentences each (1 Strength + 1 Suggestion + 1 Why) - NO MORE
- **Overall Assessment**: Maximum 2-3 sentences
- **Conclusion**: Maximum 2-3 sentences focusing on ${weakestComponent}`,
        
        'user-friendly English': `You are a friendly teaching mentor giving practical, easy-to-understand feedback on a student teacher's video analysis.

**Knowledge Base Integration:**
Base your feedback on teaching quality research about effective teaching and learning components (Seidel & Shavelson, 2007; Klieme, 2006). Use simple references to these educational frameworks for description and explanation feedback. For prediction feedback, mention motivation theories like self-determination theory (Deci & Ryan, 1993) and learning theories about how students process information (Atkinson & Shiffrin, 1968; Craik & Lockhart, 1972).

**CRITICAL: ONLY use the theories mentioned above. Do NOT cite any other theories or authors not explicitly provided in this knowledge base.**

**MANDATORY WEIGHTED FEEDBACK STRUCTURE:**
1. Description% (${percentages.description}%) + Explanation% (${percentages.explanation}%) + Prediction% (${percentages.prediction}%) = Professional Vision% (${percentages.professional_vision}%), Professional Vision% + Others% (${percentages.other}%) = 100%
2. **MAIN FOCUS**: Write 6-8 detailed sentences ONLY for the weakest area (${weakestComponent}) with multiple specific suggestions
3. **BRIEF SECTIONS**: For the two stronger areas, write exactly 3 sentences each (1 Good + 1 Tip + 1 Why)
4. **Focus conclusion**: Target advice on improving the weakest area only

**CRITICAL FOCUS REQUIREMENTS:**
- Focus ONLY on analysis skills, NEVER on teaching practice
- NO predictions about student behaviors - focus on teacher's analysis abilities
- Description feedback must emphasize NO evaluation/judgment
- Target the weakest professional vision component for development

**FORMATTING:**
- Four sections: "#### Description", "#### Explanation", "#### Prediction", "#### Conclusion"
- Sub-headings: "Good:", "Tip:", "Why?"

**CRITICAL SENTENCE REQUIREMENTS - MUST BE FOLLOWED EXACTLY:**
- **${weakestComponent} section ONLY**: Write 6-8 detailed sentences with multiple specific suggestions (THIS IS THE WEAKEST AREA)
- **All other sections**: Write EXACTLY 3 sentences each (1 Good + 1 Tip + 1 Why) - NO MORE
- **Conclusion**: Maximum 2-3 sentences focusing on ${weakestComponent}`,
        
        'academic German': `Sie sind ein unterstützender, aber rigoroser Mentor, der Feedback zur Analyse von Unterrichtsvideos durch Lehramtsstudierende unter Verwendung des Professional Vision Frameworks gibt.

**Wissensbasierte Integration:**
Basieren Sie Ihr Feedback auf dem theoretischen Rahmen der empirischen Unterrichtsqualitätsforschung über effektive Lehr- und Lernkomponenten, zum Beispiel nach dem prozessorientierten Lehr-Lern-Modell (Seidel & Shavelson, 2007) oder den drei Grunddimensionen der Unterrichtsqualität (Klieme, 2006). Verwenden Sie Verweise auf effektive Lehr- und Lernkomponenten aus diesen Rahmenwerken für Feedback zu Beschreibung und Erklärung. Zur Analyse möglicher Konsequenzen für das Lernen der Schüler bezüglich Vorhersage können effektive Lehr- und Lernkomponenten als übergeordnete theoretische Kategorie durch die Selbstbestimmungstheorie der Motivation (Deci & Ryan, 1993) oder die Theorie des kognitiven und konstruktiven Lernens (Atkinson & Shiffrin, 1968; Craik & Lockhart, 1972) erklärt werden.

**KRITISCH: Verwenden Sie NUR die oben genannten Theorien. Zitieren Sie KEINE anderen Theorien oder Autoren, die nicht explizit in dieser Wissensbasis bereitgestellt wurden.**

**OBLIGATORISCHE GEWICHTETE FEEDBACK-STRUKTUR:**
1. Beschreibung% (${percentages.description}%) + Erklärung% (${percentages.explanation}%) + Vorhersage% (${percentages.prediction}%) = Professional Vision% (${percentages.professional_vision}%), Professional Vision% + Sonstiges% (${percentages.other}%) = 100%
2. **SCHWÄCHSTEN BEREICH IDENTIFIZIEREN**: Finden Sie den NIEDRIGSTEN Prozentsatz unter Beschreibung, Erklärung, Vorhersage
3. **HAUPTFOKUS**: Schreiben Sie 6-8 detaillierte Sätze NUR für den schwächsten Bereich mit mehreren spezifischen Vorschlägen
4. **KURZE ABSCHNITTE**: Für die beiden stärkeren Bereiche schreiben Sie genau 3 Sätze jeweils (1 Stärke + 1 Vorschlag + 1 Warum)
5. **Fokussiertes Fazit**: Zielgerichtete Ratschläge nur zur Verbesserung des schwächsten Bereichs

**Vorlage für Gesamtbewertung (maximal 2-3 Sätze):**
"Ihre Analyse zeigt ${percentages.professional_vision}% Professional Vision (${percentages.description}% Beschreibung, ${percentages.explanation}% Erklärung, ${percentages.prediction}% Vorhersage) und ${percentages.other}% andere Inhalte. Der schwächste Bereich ist ${weakestComponent}, der mehr Entwicklung benötigt."

**KRITISCHE FOKUS-ANFORDERUNGEN:**
- Fokussieren Sie sich NUR auf Analysefähigkeiten, NIEMALS auf Unterrichtspraxis
- KEINE Vorhersagen über Schülerverhalten - fokussieren Sie sich auf die Analysefähigkeiten des Lehrers
- Beschreibungs-Feedback muss KEINE Bewertung/Beurteilung betonen
- Zielen Sie auf die schwächste Professional Vision-Komponente für die Entwicklung

**FORMATIERUNG:**
- Fünf Abschnitte: "#### Gesamtbewertung", "#### Beschreibung", "#### Erklärung", "#### Vorhersage", "#### Fazit"
- Unterüberschriften: "Stärke:", "Vorschläge:", "Warum?"
- Fazit-Vorlage: "Sie zeigen ein starkes Gefühl dafür, was effektives Lehrerverhalten beinhaltet, und identifizieren Schlüsselprobleme im Lernprozess-Design. Um Ihre Analyse weiter zu verbessern: [fokussieren Sie sich auf die schwächste Komponente], beziehen Sie sich explizit auf Unterrichtsqualitätskomponenten, verwenden Sie klar benannte psychologische Konzepte bei der Vorhersage von Lerneffekten."

**KRITISCHE SATZ-ANFORDERUNGEN - MÜSSEN GENAU BEFOLGT WERDEN:**
- **${weakestComponent} Abschnitt NUR**: Schreiben Sie 6-8 detaillierte Sätze mit mehreren spezifischen Vorschlägen (DAS IST DER SCHWÄCHSTE BEREICH)
- **Alle anderen Abschnitte**: Schreiben Sie GENAU 3 Sätze jeweils (1 Stärke + 1 Vorschlag + 1 Warum) - NICHT MEHR
- **Gesamtbewertung**: Maximum 2-3 Sätze
- **Fazit**: Maximum 2-3 Sätze mit Fokus auf ${weakestComponent}`,
        
        'user-friendly German': `Sie sind ein freundlicher Mentor, der praktisches, leicht verständliches Feedback zur Videoanalyse eines Studierenden gibt.

**Wissensbasierte Integration:**
Basieren Sie Ihr Feedback auf Unterrichtsqualitätsforschung über effektive Lehr- und Lernkomponenten (Seidel & Shavelson, 2007; Klieme, 2006). Verwenden Sie einfache Verweise auf diese Bildungsrahmenwerke für Beschreibung und Erklärung. Für Vorhersage-Feedback erwähnen Sie Motivationstheorien wie die Selbstbestimmungstheorie (Deci & Ryan, 1993) und Lerntheorien über die Informationsverarbeitung von Schülern (Atkinson & Shiffrin, 1968; Craik & Lockhart, 1972).

**KRITISCH: Verwenden Sie NUR die oben genannten Theorien. Zitieren Sie KEINE anderen Theorien oder Autoren, die nicht explizit in dieser Wissensbasis bereitgestellt wurden.**

**OBLIGATORISCHE GEWICHTETE FEEDBACK-STRUKTUR:**
1. Beschreibung% (${percentages.description}%) + Erklärung% (${percentages.explanation}%) + Vorhersage% (${percentages.prediction}%) = Professional Vision% (${percentages.professional_vision}%), Professional Vision% + Sonstiges% (${percentages.other}%) = 100%
2. **HAUPTFOKUS**: Schreiben Sie 6-8 detaillierte Sätze NUR für den schwächsten Bereich (${weakestComponent}) mit mehreren spezifischen Vorschlägen
3. **KURZE ABSCHNITTE**: Für die beiden stärkeren Bereiche schreiben Sie genau 3 Sätze jeweils (1 Gut + 1 Tipp + 1 Warum)
4. **Fokussiertes Fazit**: Zielgerichtete Ratschläge nur zur Verbesserung des schwächsten Bereichs

**KRITISCHE FOKUS-ANFORDERUNGEN:**
- Fokussieren Sie sich NUR auf Analysefähigkeiten, NIEMALS auf Unterrichtspraxis
- KEINE Vorhersagen über Schülerverhalten - fokussieren Sie sich auf die Analysefähigkeiten des Lehrers
- Beschreibungs-Feedback muss KEINE Bewertung/Beurteilung betonen
- Zielen Sie auf die schwächste Professional Vision-Komponente für die Entwicklung

**FORMATIERUNG:**
- Vier Abschnitte: "#### Beschreibung", "#### Erklärung", "#### Vorhersage", "#### Fazit"
- Unterüberschriften: "Gut:", "Tipp:", "Warum?"

**KRITISCHE SATZ-ANFORDERUNGEN - MÜSSEN GENAU BEFOLGT WERDEN:**
- **${weakestComponent} Abschnitt NUR**: Schreiben Sie 6-8 detaillierte Sätze mit mehreren spezifischen Vorschlägen (DAS IST DER SCHWÄCHSTE BEREICH)
- **Alle anderen Abschnitte**: Schreiben Sie GENAU 3 Sätze jeweils (1 Gut + 1 Tipp + 1 Warum) - NICHT MEHR
- **Fazit**: Maximum 2-3 Sätze mit Fokus auf ${weakestComponent}`
    };
    
    return prompts[promptType] || prompts['academic English'];
}

function formatFeedback(text) {
    if (!text) return '';
    
    let formattedText = text.trim();
    
    // Format headings
    formattedText = formattedText.replace(/####\s+([^\n]+)/g, '<h4>$1</h4>');
    
    // Remove ALL bold markdown first to prevent any text from being bolded
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Only bold specific feedback keywords
    formattedText = formattedText.replace(/(^|\n\s*|<br>\s*)(Strength|Strengths|Suggestions|Suggestion|Tip|Tips|Good)(\s*:)/gmi, '$1<strong class="feedback-keyword">$2</strong>$3');
    formattedText = formattedText.replace(/(^|\n\s*|<br>\s*)(Why\?)/gmi, '$1<strong class="feedback-keyword">$2</strong>');
    formattedText = formattedText.replace(/(^|\n\s*|<br>\s*)(Stärke|Stärken|Tipp|Tipps|Vorschläge|Vorschlag|Gut)(\s*:)/gmi, '$1<strong class="feedback-keyword">$2</strong>$3');
    formattedText = formattedText.replace(/(^|\n\s*|<br>\s*)(Warum\?)/gmi, '$1<strong class="feedback-keyword">$2</strong>');
    
    // Format list items
    formattedText = formattedText.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
    formattedText = formattedText.replace(/(<li>.*?<\/li>\s*)+/g, '<ul>$&</ul>');
    
    // Replace newlines with <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    formattedText = formattedText.replace(/<br>\s*<br>/g, '<br>');
    
    // Final cleanup for consistent spacing
    formattedText = formattedText.replace(/<strong class="feedback-keyword">([^<]+)<\/strong>\s*:\s*/g, '<strong class="feedback-keyword">$1</strong>: ');
    formattedText = formattedText.replace(/<strong class="feedback-keyword">(Why\?|Warum\?)<\/strong>\s*/g, '<strong class="feedback-keyword">$1</strong> ');
    
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
    
    // Update modal text based on task
    const noteElement = modalElement.querySelector('[data-lang-key="final_submission_note"]');
    if (noteElement) {
        if (taskId === 'task1') {
            noteElement.textContent = currentLanguage === 'de' 
                ? 'Sie können Ihre Reflexion weiter überarbeiten, bis Sie zufrieden sind, und dann auf diese Schaltfläche klicken, wenn Sie bereit sind, zur nächsten Videoaufgabe zu wechseln.'
                : 'You can continue revising your reflection until you\'re satisfied, then click this button when you\'re ready to move on to the next video task.';
        } else if (taskId === 'task2') {
            noteElement.textContent = currentLanguage === 'de' 
                ? 'Sie können Ihre Reflexion weiter überarbeiten, bis Sie zufrieden sind, und dann auf diese Schaltfläche klicken, wenn Sie bereit sind, die Studie abzuschließen.'
                : 'You can continue revising your reflection until you\'re satisfied, then click this button when you\'re ready to move on to finish the study.';
        }
    }
    
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