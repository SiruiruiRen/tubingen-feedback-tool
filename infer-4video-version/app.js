// INFER - 4-Video Experiment Version
// Complete production-ready version with login, dashboard, progress tracking, and all surveys
//
// DATA COLLECTION:
// - All binary classification results stored in Supabase database
// - All user interactions (clicks, navigations) logged to Supabase
// - Reflection data and feedback stored in Supabase
// - Progress tracking in participant_progress table

// Constants and configuration
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const CORS_PROXY_URL = isProduction 
    ? 'https://tubingen-feedback-cors-proxy.onrender.com'
    : 'http://localhost:3000';
const OPENAI_API_URL = `${CORS_PROXY_URL}/api/openai/v1/chat/completions`;
const model = 'gpt-4o';

// ============================================================================
// Supabase Configuration - UPDATE THESE FOR NEW DATABASE
// ============================================================================
const SUPABASE_URL = 'https://cvmzsljalmkrehfkqjtc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bXpzbGphbG1rcmVoZmtxanRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTM5MzIsImV4cCI6MjA3OTE2OTkzMn0.0IxG1T574aCCH6pxfn8tgGrzw3XUuDKFPE8YQQkV9T4';
// ============================================================================

// Video Configuration - UPDATE WITH YOUR 4 VIDEOS
const VIDEOS = [
    { id: 'video1', name: 'Video 1: [Name]', link: 'VIDEO_LINK_1', password: 'PASSWORD_1' },
    { id: 'video2', name: 'Video 2: [Name]', link: 'VIDEO_LINK_2', password: 'PASSWORD_2' },
    { id: 'video3', name: 'Video 3: [Name]', link: 'VIDEO_LINK_3', password: 'PASSWORD_3' },
    { id: 'video4', name: 'Video 4: [Name]', link: 'VIDEO_LINK_4', password: 'PASSWORD_4' }
];

// Qualtrics Survey Links - UPDATE WITH YOUR SURVEY LINKS
const QUALTRICS_SURVEYS = {
    pre: 'YOUR_PRE_SURVEY_LINK',
    post_video_1: 'YOUR_POST_VIDEO_1_LINK',
    post_video_2: 'YOUR_POST_VIDEO_2_LINK',
    post_video_3: 'YOUR_POST_VIDEO_3_LINK',
    post_video_4: 'YOUR_POST_VIDEO_4_LINK',
    post: 'YOUR_FINAL_POST_SURVEY_LINK'
};

// Global state
let currentPage = 'login';
let currentLanguage = 'de'; // Default to German
let userPreferredFeedbackStyle = 'extended';
let currentSessionId = null;
let supabase = null;
let currentParticipant = null;
let currentParticipantProgress = null;
let currentVideoId = null;
let currentTaskState = {
    feedbackGenerated: false,
    submitted: false,
    currentReflectionId: null,
    parentReflectionId: null,
    revisionCount: 0,
    currentFeedbackType: null,
    currentFeedbackStartTime: null
};

// Tab switching detection
let tabSwitchCount = 0;
let lastHiddenTime = null;
let hasAskedAboutAI = false;

// Language translations (comprehensive for 4-video version)
const translations = {
    en: {
        title: "INFER",
        subtitle: "An intelligent feedback system for observing classroom videos",
        login_title: "Enter Your Participant Code",
        code_help_text: "Create a code: First letter of mother's first name + birth month (2 digits) + birth year (2 digits).",
        code_example: "Example: Mother named Anna, born in August 1995 → A0895",
        participant_code_label: "Participant Code:",
        code_placeholder: "e.g., A0895",
        continue_button: "Continue",
        pre_survey_title: "Pre-Survey",
        pre_survey_subtitle: "Please complete the pre-survey before starting",
        pre_survey_description: "Please complete the survey below. This takes about 5-10 minutes.",
        next_step: "Next Step:",
        pre_survey_instructions: "Complete the survey above, then click \"Continue to Dashboard\" below.",
        continue_to_dashboard: "Continue to Dashboard",
        dashboard_title: "Video Dashboard",
        dashboard_welcome: "Welcome back, ",
        your_progress: "Your Progress",
        videos_completed: "0/4 Videos Completed",
        time_limit: "You have 2.5 weeks to complete all 4 videos",
        all_videos_completed: "All Videos Completed!",
        final_survey_prompt: "Please complete the final post-survey to finish the experiment.",
        start_post_survey: "Start Post-Survey",
        view_pre_survey: "View",
        start_pre_survey: "Start Now",
        video_task_title: "Video Task",
        video_task_subtitle: "Analyze your teaching reflection and receive feedback",
        settings: "Settings",
        video_label: "Video:",
        language: "Language:",
        back_to_dashboard: "Back to Dashboard",
        reflection_input: "Student Teacher Reflection",
        paste_reflection: "Paste your reflection here...",
        clear: "Clear",
        words: "words",
        generate_feedback: "Generate Feedback",
        generated_feedback: "Generated Feedback",
        feedback_placeholder: "Feedback will appear here after generation...",
        note: "Note:",
        percentage_explanation: "The percentages may add up to more than 100% because a single passage can receive multiple codes (Description, Explanation, and Prediction).",
        extended: "Extended",
        short: "Short",
        copy: "Copy",
        revise_reflection: "Revise Reflection",
        submit_final: "Submit Final Reflection",
        learn_key_concepts: "Learn the Key Concepts for Better Reflection",
        concepts_help: "Understanding these three dimensions will help you write more comprehensive teaching reflections",
        description: "Description",
        description_def: "Accurately observing and reporting what happened in the classroom - specific behaviors, interactions, and events without interpretation.",
        explanation: "Explanation",
        explanation_def: "Interpreting observed events using educational theory, research, and pedagogical knowledge - understanding why things happened.",
        prediction: "Prediction",
        prediction_def: "Anticipating future outcomes and effects on student learning based on observed teaching practices and their interpretations.",
        post_video_survey_title: "Post-Video Survey",
        post_video_survey_subtitle: "Please share your thoughts about this video",
        post_video_questionnaire: "Post-Video Questionnaire",
        post_video_questionnaire_description: "Please complete the questionnaire below. This takes about 3-5 minutes.",
        post_video_instructions: "Complete the questionnaire above, then click \"Return to Dashboard\" below.",
        return_to_dashboard: "Return to Dashboard",
        final_post_survey_title: "Final Post-Survey",
        final_post_survey_subtitle: "Thank you for completing all videos!",
        final_post_survey_description: "Please complete the final survey below. This takes about 10-15 minutes.",
        final_step: "Final Step:",
        final_survey_instructions: "Complete the survey above, then click \"Complete Study\" below to finish.",
        complete_study: "Complete Study",
        pre_survey_completed: "Pre-Survey Completed",
        pre_survey_completed_message: "You have already completed the pre-survey. You can review it below or continue to the dashboard.",
        view_pre_survey: "View",
        presurvey_required: "You must complete the pre-survey before accessing video tasks.",
        video_tasks: "Video Tasks",
        thank_you_title: "Thank You!",
        participation_complete: "Your participation is complete",
        study_complete: "Study Complete!",
        thank_you_message: "Thank you for your time and thoughtful reflections.",
        contribution_message: "Your contributions help improve teacher education and feedback systems.",
        percentage_explanation_simple: "Note: Percentages may exceed 100% as text can have multiple codes.",
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
        ai_usage_title: "Tab Switch Detected",
        ai_usage_message: "We noticed you switched to another tab. Did you use another AI system (such as ChatGPT) for your work on this task?",
        ai_usage_yes: "Yes, I used AI",
        ai_usage_no: "No, I did not use AI",
        loading_messages: [
            "Please wait while the little elves create your feedback...",
            "Almost there, we promise...",
            "Computing the secret to the universe...",
            "Still making progress, don't leave yet!",
            "Grab a coffee and come back in a minute?"
        ]
    },
    de: {
        title: "INFER",
        subtitle: "Ein intelligentes Feedback-System zur Beobachtung von Unterricht",
        login_title: "Geben Sie Ihren Teilnehmer-Code ein",
        code_help_text: "Erstellen Sie einen Code: Erster Buchstabe des Vornamens der Mutter + Geburtsmonat (2 Ziffern) + Geburtsjahr (2 Ziffern).",
        code_example: "Beispiel: Mutter heißt Anna, geboren im August 1995 → A0895",
        participant_code_label: "Ihr Teilnehmer-Code:",
        code_placeholder: "z.B. A0895",
        continue_button: "Weiter",
        pre_survey_title: "Vor-Umfrage",
        pre_survey_subtitle: "Bitte vervollständigen Sie die Vor-Umfrage, bevor Sie beginnen",
        pre_survey_description: "Bitte vervollständigen Sie die Umfrage unten. Dies dauert etwa 5-10 Minuten.",
        next_step: "Nächster Schritt:",
        pre_survey_instructions: "Vervollständigen Sie die Umfrage oben und klicken Sie dann unten auf \"Weiter zum Dashboard\".",
        continue_to_dashboard: "Weiter zum Dashboard",
        dashboard_title: "Video-Dashboard",
        dashboard_welcome: "Willkommen zurück, ",
        your_progress: "Ihr Fortschritt",
        videos_completed: "0/4 Videos abgeschlossen",
        time_limit: "Sie haben 2,5 Wochen Zeit, um alle 4 Videos zu vervollständigen",
        all_videos_completed: "Alle Videos abgeschlossen!",
        final_survey_prompt: "Bitte vervollständigen Sie die abschließende Nach-Umfrage, um das Experiment abzuschließen.",
        start_post_survey: "Nach-Umfrage starten",
        video_task_title: "Video-Aufgabe",
        video_task_subtitle: "Analysieren Sie Ihre Unterrichtsreflexion und erhalten Sie Feedback",
        settings: "Einstellungen",
        video_label: "Video:",
        language: "Sprache:",
        back_to_dashboard: "Zurück zum Dashboard",
        reflection_input: "Reflexionstext",
        paste_reflection: "Fügen Sie hier Ihre Reflexion ein...",
        clear: "Löschen",
        words: "Wörter",
        generate_feedback: "Feedback generieren",
        generated_feedback: "Generiertes Feedback",
        feedback_placeholder: "Feedback wird hier nach der Generierung angezeigt...",
        note: "Hinweis:",
        percentage_explanation: "Die Prozentsätze können mehr als 100% ergeben, da ein einzelner Abschnitt mehrere Codes erhalten kann (Beschreibung, Erklärung und Vorhersage).",
        extended: "Erweitert",
        short: "Kurz",
        copy: "Kopieren",
        revise_reflection: "Reflexion überarbeiten",
        submit_final: "Endgültige Reflexion einreichen",
        learn_key_concepts: "Lernen Sie die Schlüsselkonzepte für bessere Reflexion",
        concepts_help: "Das Verständnis dieser drei Dimensionen hilft Ihnen, umfassendere Unterrichtsreflexionen zu schreiben",
        description: "Beschreibung",
        description_def: "Genaues Beobachten und Berichten des Geschehens im Klassenzimmer - spezifische Verhaltensweisen, Interaktionen und Ereignisse ohne Interpretation.",
        explanation: "Erklärung",
        explanation_def: "Interpretation von beobachteten Ereignissen mittels pädagogischer Theorie, Forschung und pädagogischem Wissen - Verstehen, warum Dinge passiert sind.",
        prediction: "Vorhersage",
        prediction_def: "Antizipation zukünftiger Ergebnisse und Auswirkungen auf das Lernen der Schüler basierend auf beobachteten Unterrichtspraktiken und deren Interpretationen.",
        post_video_survey_title: "Nach-Video-Umfrage",
        post_video_survey_subtitle: "Bitte teilen Sie Ihre Gedanken zu diesem Video mit",
        post_video_questionnaire: "Nach-Video-Fragebogen",
        post_video_questionnaire_description: "Bitte vervollständigen Sie den Fragebogen unten. Dies dauert etwa 3-5 Minuten.",
        post_video_instructions: "Vervollständigen Sie den Fragebogen oben und klicken Sie dann unten auf \"Zurück zum Dashboard\".",
        return_to_dashboard: "Zurück zum Dashboard",
        final_post_survey_title: "Abschließende Nach-Umfrage",
        final_post_survey_subtitle: "Vielen Dank, dass Sie alle Videos abgeschlossen haben!",
        final_post_survey_description: "Bitte vervollständigen Sie die abschließende Umfrage unten. Dies dauert etwa 10-15 Minuten.",
        final_step: "Letzter Schritt:",
        final_survey_instructions: "Vervollständigen Sie die Umfrage oben und klicken Sie dann unten auf \"Studie abschließen\", um fertig zu werden.",
        complete_study: "Studie abschließen",
        pre_survey_completed: "Vor-Umfrage abgeschlossen",
        pre_survey_completed_message: "Sie haben die Vor-Umfrage bereits abgeschlossen. Sie können sie unten überprüfen oder zum Dashboard fortfahren.",
        view_pre_survey: "Ansehen",
        presurvey_required: "Sie müssen die Vor-Umfrage abschließen, bevor Sie auf Video-Aufgaben zugreifen können.",
        start_pre_survey: "Jetzt starten",
        video_completed: "Abgeschlossen",
        start_video: "Video starten",
        continue_video: "Fortsetzen",
        survey_completed: "Umfrage erledigt",
        complete_presurvey_first: "Zuerst Vor-Umfrage abschließen",
        data_consent_header: "Einverständniserklärung Datenschutz",
        data_consent_intro: "Während der Bearbeitung der Unterrichtsanalyse werden ihre Daten anonymisiert gespeichert. Weiter werden sie nach der Unterrichtsanalyse gebeten, kurze Fragen zu ihren Erfahrungen und zum Umgang mit dem Tool auszufüllen. Auch diese Daten werden anonymisiert gespeichert. Ihre Antworten helfen uns das Tool stetig weiterzuentwickeln. Bitte stimmen sie zu, wenn wir ihre Daten dementsprechend für wissenschaftliche Zwecke nutzen dürfen.",
        data_consent_agree: "Ich stimme der Nutzung der Daten für wissenschaftliche Zwecke zu.",
        data_consent_disagree: "Ich stimme der Nutzung der Daten für wissenschaftliche Zwecke nicht zu.",
        consent_disagreement_message: "Leider können Sie ohne Zustimmung zur Datennutzung nicht an der Studie teilnehmen. Vielen Dank für Ihr Interesse.",
        welcome_to_infer: "Willkommen zu INFER",
        welcome_message: "Vielen Dank für Ihre Teilnahme an dieser Studie zur KI-gestützten Unterrichtsreflexion. In den nächsten 2,5 Wochen werden Sie 4 Unterrichtsvideos mit unserem INFER-System analysieren.",
        browser_recommendation: "Für die beste Erfahrung empfehlen wir die Verwendung von <strong>Google Chrome</strong>.",
        video_tasks: "Video-Aufgaben",
        thank_you_title: "Vielen Dank!",
        participation_complete: "Ihre Teilnahme ist abgeschlossen",
        study_complete: "Studie abgeschlossen!",
        thank_you_message: "Vielen Dank für Ihre Zeit und Ihre durchdachten Reflexionen.",
        contribution_message: "Ihre Beiträge helfen, die Lehrerausbildung und Feedback-Systeme zu verbessern.",
        percentage_explanation_simple: "Hinweis: Prozentwerte können 100% überschreiten, da Text mehrere Codes haben kann.",
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
        ai_usage_title: "Tab-Wechsel erkannt",
        ai_usage_message: "Wir haben bemerkt, dass Sie zu einem anderen Tab gewechselt haben. Haben Sie ein anderes KI-System (wie ChatGPT) für Ihre Arbeit an dieser Aufgabe verwendet?",
        ai_usage_yes: "Ja, ich habe KI verwendet",
        ai_usage_no: "Nein, ich habe keine KI verwendet",
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
    console.log('Initializing INFER 4-video experiment version...');
    
    // Initialize Supabase
    supabase = initSupabase();
    if (supabase) {
        verifySupabaseConnection(supabase);
        currentSessionId = getOrCreateSessionId();
    }
    
    initializeApp();
});

// Initialize app
function initializeApp() {
    setupEventListeners();
    renderLanguageSwitchers();
    renderLanguageSwitcherInNav();
    applyTranslations();
    showPage('welcome');
    
    // Set default language to German
    switchLanguage('de');
    
    // Log session start
    logEvent('session_start', {
        entry_page: 'welcome',
        language: currentLanguage,
        user_agent: navigator.userAgent,
        screen_width: window.screen.width,
        screen_height: window.screen.height
    });
}

// Validate consent
function validateConsent() {
    const agreeRadio = document.getElementById('data-consent-agree');
    const disagreeRadio = document.getElementById('data-consent-disagree');
    const continueBtn = document.getElementById('continue-to-login');
    const disagreementMsg = document.getElementById('consent-disagreement-message');
    
    if (agreeRadio && agreeRadio.checked) {
        if (continueBtn) continueBtn.disabled = false;
        if (disagreementMsg) disagreementMsg.classList.add('d-none');
    } else if (disagreeRadio && disagreeRadio.checked) {
        if (continueBtn) continueBtn.disabled = true;
        if (disagreementMsg) disagreementMsg.classList.remove('d-none');
    }
    
    // Log consent interaction
    logEvent('consent_interaction', {
        consent_given: agreeRadio?.checked || false,
        language: currentLanguage
    });
}

// Handle consent continue
function handleConsentContinue() {
    const agreeRadio = document.getElementById('data-consent-agree');
    if (agreeRadio && agreeRadio.checked) {
        logEvent('consent_accepted', {
            language: currentLanguage,
            timestamp: new Date().toISOString()
        });
        showPage('login');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Welcome/Consent page
    document.getElementById('data-consent-agree')?.addEventListener('change', validateConsent);
    document.getElementById('data-consent-disagree')?.addEventListener('change', validateConsent);
    document.getElementById('continue-to-login')?.addEventListener('click', handleConsentContinue);
    
    // Login page
    document.getElementById('login-button')?.addEventListener('click', handleLogin);
    document.getElementById('participant-code-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Pre-survey
    document.getElementById('continue-after-presurvey')?.addEventListener('click', () => {
        markPreSurveyComplete();
        showPage('dashboard');
    });
    
    // Persistent navigation - Dashboard button
    document.getElementById('nav-dashboard-btn')?.addEventListener('click', () => {
        if (currentParticipant) {
            showPage('dashboard');
        }
    });
    
    // Dashboard navigation
    document.getElementById('go-to-presurvey-btn')?.addEventListener('click', () => {
        showPage('presurvey');
        loadSurvey('pre');
    });
    
    document.getElementById('start-post-survey')?.addEventListener('click', () => {
        showPage('postsurvey');
        loadSurvey('post');
    });
    
    // Back to dashboard buttons (now redundant but kept for compatibility)
    document.querySelectorAll('.back-to-dashboard-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showPage('dashboard');
        });
    });
    
    // Language switchers (for task page)
    document.getElementById('task-lang-en')?.addEventListener('change', () => switchLanguage('en'));
    document.getElementById('task-lang-de')?.addEventListener('change', () => switchLanguage('de'));
    
    // Language switchers for all video pages (video-1 through video-4)
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`video-${i}-lang-en`)?.addEventListener('change', () => switchLanguage('en'));
        document.getElementById(`video-${i}-lang-de`)?.addEventListener('change', () => switchLanguage('de'));
    }
    
    // Language switchers (for all pages via language-switcher-container)
    document.addEventListener('click', (e) => {
        if (e.target.id === 'lang-switch-en') {
            switchLanguage('en');
        } else if (e.target.id === 'lang-switch-de') {
            switchLanguage('de');
        }
    });
    
    // Feedback tabs
    document.getElementById('task-extended-tab')?.addEventListener('click', () => {
        if (currentTaskState.currentFeedbackType && currentTaskState.currentFeedbackStartTime) {
            endFeedbackViewing(currentTaskState.currentFeedbackType, currentLanguage);
        }
        startFeedbackViewing('extended', currentLanguage);
    });
    document.getElementById('task-short-tab')?.addEventListener('click', () => {
        if (currentTaskState.currentFeedbackType && currentTaskState.currentFeedbackStartTime) {
            endFeedbackViewing(currentTaskState.currentFeedbackType, currentLanguage);
        }
        startFeedbackViewing('short', currentLanguage);
    });
    
    // Post-video survey
    document.getElementById('continue-after-post-video-survey')?.addEventListener('click', () => {
        markVideoSurveyComplete();
        showPage('dashboard');
    });
    
    // Final submission modal
    document.getElementById('confirm-final-submission')?.addEventListener('click', () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('final-submission-modal'));
        const videoNum = document.getElementById('final-submission-modal')?.dataset.videoNum;
        modal?.hide();
        if (videoNum) {
            confirmFinalSubmissionForVideo(parseInt(videoNum));
        } else {
            confirmFinalSubmission();
        }
    });
    
    // Feedback preference modal
    document.getElementById('select-extended-first')?.addEventListener('click', () => {
        userPreferredFeedbackStyle = 'extended';
        const modal = bootstrap.Modal.getInstance(document.getElementById('feedback-preference-modal'));
        modal?.hide();
    });
    document.getElementById('select-short-first')?.addEventListener('click', () => {
        userPreferredFeedbackStyle = 'short';
        const modal = bootstrap.Modal.getInstance(document.getElementById('feedback-preference-modal'));
        modal?.hide();
    });
    
    // Complete study
    document.getElementById('complete-study')?.addEventListener('click', () => {
        markPostSurveyComplete();
        showPage('thankyou');
    });
    
    // Tab switching detection
    document.addEventListener('visibilitychange', handleTabSwitch);
}

// Tab switching detection
function handleTabSwitch() {
    if (document.hidden) {
        lastHiddenTime = Date.now();
        tabSwitchCount++;
        logEvent('tab_hidden', {
            tab_switch_count: tabSwitchCount,
            current_page: currentPage,
            video_id: currentVideoId,
            participant_name: currentParticipant || null,
            language: currentLanguage,
            timestamp: new Date().toISOString()
        });
    } else {
        const timeAway = lastHiddenTime ? (Date.now() - lastHiddenTime) / 1000 : 0;
        logEvent('tab_visible', {
            tab_switch_count: tabSwitchCount,
            time_away_seconds: timeAway,
            current_page: currentPage,
            video_id: currentVideoId,
            participant_name: currentParticipant || null,
            language: currentLanguage,
            timestamp: new Date().toISOString()
        });
        
        if (timeAway > 5 && currentPage === 'video-task' && !hasAskedAboutAI) {
            hasAskedAboutAI = true;
            showAIUsageModal();
        }
    }
}

// Page navigation - allows free navigation between pages
function showPage(pageId) {
    document.querySelectorAll('.page-container').forEach(page => {
        page.classList.add('d-none');
    });
    
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('d-none');
        const previousPage = currentPage;
        currentPage = pageId;
        
        // Show/hide navigation bar (visible on all pages except welcome, login and thankyou)
        const mainNav = document.getElementById('main-navigation');
        if (mainNav) {
            if (pageId === 'welcome' || pageId === 'login' || pageId === 'thankyou') {
                mainNav.classList.add('d-none');
            } else {
                mainNav.classList.remove('d-none');
                // Update participant name in nav
                const navParticipantName = document.getElementById('nav-participant-name');
                if (navParticipantName && currentParticipant) {
                    navParticipantName.textContent = currentLanguage === 'en' 
                        ? `Participant: ${currentParticipant}`
                        : `Teilnehmer: ${currentParticipant}`;
                }
            }
        }
        
        // Show/hide progress bar - REMOVED
        /*
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
        */
        
        // Update progress bar - REMOVED
        /*
        if (currentParticipantProgress) {
            updateProgressBar();
        }
        */
        
        // Render dashboard if showing dashboard page
        if (pageId === 'dashboard' && currentParticipantProgress) {
            setTimeout(() => {
                renderDashboard();
            }, 100);
        }
        
        // Setup video page if it's a video page
        if (pageId.startsWith('video-')) {
            const videoNum = parseInt(pageId.replace('video-', ''));
            setupVideoPageElements(videoNum);
            
            // Update video page titles/subtitles
            const videoId = `video${videoNum}`;
            const video = VIDEOS.find(v => v.id === videoId);
            if (video) {
                const ids = getVideoElementIds(videoNum);
                const titleEl = document.getElementById(ids.title);
                const subtitleEl = document.getElementById(ids.subtitle);
                if (titleEl) {
                    const titleText = currentLanguage === 'en' 
                        ? `Video ${videoNum} Task: ${video.name}`
                        : `Video ${videoNum} Aufgabe: ${video.name}`;
                    titleEl.textContent = titleText;
                }
                if (subtitleEl) {
                    subtitleEl.textContent = translations[currentLanguage].video_task_subtitle;
                }
            }
        }
        
        // Apply translations for new page
        applyTranslations();
        renderLanguageSwitchers();
        renderLanguageSwitcherInNav();
        
        // Log page view with participant info
        logEvent('page_view', {
            page: pageId,
            from_page: previousPage,
            video_id: currentVideoId,
            participant_name: currentParticipant || null,
            language: currentLanguage,
            timestamp: new Date().toISOString()
        });
    }
}

// Validate consent
function validateConsent() {
    const agreeRadio = document.getElementById('data-consent-agree');
    const disagreeRadio = document.getElementById('data-consent-disagree');
    const continueBtn = document.getElementById('continue-to-login');
    const disagreementMsg = document.getElementById('consent-disagreement-message');
    
    if (agreeRadio && agreeRadio.checked) {
        if (continueBtn) continueBtn.disabled = false;
        if (disagreementMsg) disagreementMsg.classList.add('d-none');
    } else if (disagreeRadio && disagreeRadio.checked) {
        if (continueBtn) continueBtn.disabled = true;
        if (disagreementMsg) disagreementMsg.classList.remove('d-none');
    }
    
    // Log consent interaction
    logEvent('consent_interaction', {
        consent_given: agreeRadio?.checked || false,
        language: currentLanguage
    });
}

// Handle consent continue
function handleConsentContinue() {
    const agreeRadio = document.getElementById('data-consent-agree');
    if (agreeRadio && agreeRadio.checked) {
        logEvent('consent_accepted', {
            language: currentLanguage,
            timestamp: new Date().toISOString()
        });
        showPage('login');
    }
}

// Login handler
async function handleLogin() {
    const codeInput = document.getElementById('participant-code-input');
    const participantCode = codeInput?.value.trim().toUpperCase();
    
    if (!participantCode) {
        showAlert('Please enter your participant code.', 'warning');
        return;
    }
    
    // Check if participant exists
    const progress = await loadParticipantProgress(participantCode);
    
    if (progress) {
        // Returning participant
        currentParticipant = participantCode;
        currentParticipantProgress = progress;
        
        // Show resume message
        const resumeInfo = document.getElementById('resume-info');
        const resumeMessage = document.getElementById('resume-message');
        if (resumeInfo && resumeMessage) {
            const videosDone = progress.videos_completed?.length || 0;
            resumeMessage.textContent = `Welcome back! You have completed ${videosDone}/4 videos.`;
            resumeInfo.classList.remove('d-none');
        }
        
        // Always show dashboard first - don't auto-navigate to pre-survey
        setTimeout(() => {
            showPage('dashboard');
            renderDashboard();
        }, 1500);
    } else {
        // New participant
        currentParticipant = participantCode;
        const condition = assignCondition(participantCode);
        
        // Create new progress record
        await createParticipantProgress(participantCode, condition);
        currentParticipantProgress = {
            participant_name: participantCode,
            assigned_condition: condition,
            videos_completed: [],
            pre_survey_completed: false,
            post_survey_completed: false,
            video_surveys: {}
        };
        
        logEvent('participant_registered', {
            participant_name: participantCode,
            assigned_condition: condition
        });
        
        // Show dashboard first - don't auto-navigate to pre-survey
        setTimeout(() => {
            showPage('dashboard');
            renderDashboard();
        }, 1500);
    }
}

// Assign condition (random 50/50)
function assignCondition(participantName) {
    return Math.random() < 0.5 ? 'control' : 'experimental';
}

// Load participant progress
async function loadParticipantProgress(participantName) {
    if (!supabase) return null;
    
    try {
        const { data, error } = await supabase
            .from('participant_progress')
            .select('*')
            .eq('participant_name', participantName)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
            console.error('Error loading progress:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('Error in loadParticipantProgress:', error);
        return null;
    }
}

// Create participant progress
async function createParticipantProgress(participantName, condition) {
    if (!supabase) return;
    
    try {
        const { error } = await supabase
            .from('participant_progress')
            .insert([{
                participant_name: participantName,
                assigned_condition: condition,
                videos_completed: [],
                pre_survey_completed: false,
                post_survey_completed: false,
                video_surveys: {},
                last_active_at: new Date().toISOString()
            }]);
        
        if (error) {
            console.error('Error creating progress:', error);
        }
    } catch (error) {
        console.error('Error in createParticipantProgress:', error);
    }
}

// Render dashboard
function renderDashboard() {
    console.log('renderDashboard called', { currentParticipantProgress, currentParticipant });
    
    if (!currentParticipantProgress) {
        console.warn('No participant progress available');
        return;
    }
    
    // Update welcome message with participant name
    const welcomeText = document.getElementById('dashboard-welcome-text');
    const nameEl = document.getElementById('dashboard-participant-name');
    if (welcomeText && nameEl) {
        if (currentParticipant) {
            welcomeText.textContent = currentLanguage === 'en' ? 'Welcome back,' : 'Willkommen zurück,';
            nameEl.textContent = currentParticipant;
            nameEl.style.fontWeight = '600';
        } else {
            welcomeText.textContent = currentLanguage === 'en' ? 'Welcome' : 'Willkommen';
            nameEl.textContent = '';
        }
    }
    
    // Update progress bar
    updateProgressBar();
    
    // Update pre-survey status
    updatePreSurveyStatus();
    
    // Render video cards
    const container = document.getElementById('video-cards-container');
    if (!container) {
        console.error('video-cards-container not found');
        return;
    }
    
    container.innerHTML = '';
    
    if (!VIDEOS || VIDEOS.length === 0) {
        console.error('VIDEOS array is empty or undefined');
        container.innerHTML = '<div class="col-12"><div class="alert alert-warning">No videos configured. Please check VIDEOS array in app.js</div></div>';
        return;
    }
    
    VIDEOS.forEach((video, index) => {
        const isCompleted = currentParticipantProgress.videos_completed?.includes(video.id) || false;
        const videoSurveyCompleted = currentParticipantProgress.video_surveys?.[video.id] || false;
        const card = createVideoCard(video, index + 1, isCompleted, videoSurveyCompleted);
        container.appendChild(card);
    });
    
    // Update post-survey status
    updatePostSurveyStatus();
    
    console.log('Dashboard rendered successfully');
}

// Update pre-survey status on dashboard
function updatePreSurveyStatus() {
    const isCompleted = currentParticipantProgress?.pre_survey_completed || false;
    const badge = document.getElementById('presurvey-status-badge');
    const viewBtn = document.getElementById('go-to-presurvey-btn');
    const warning = document.getElementById('presurvey-warning');
    
    if (badge) {
        const t = translations[currentLanguage];
        if (isCompleted) {
            badge.className = 'badge bg-success d-block mb-2';
            badge.textContent = '✓ ' + (t.pre_survey_completed || 'Completed');
        } else {
            badge.className = 'badge bg-danger d-block mb-2';
            badge.textContent = '⚠ ' + (currentLanguage === 'en' ? 'Required' : 'Erforderlich');
        }
    }
    
    if (viewBtn) {
        const t = translations[currentLanguage];
        viewBtn.textContent = isCompleted 
            ? (t.view_pre_survey || 'View')
            : (t.start_pre_survey || 'Start Now');
        viewBtn.className = isCompleted
            ? 'btn btn-sm btn-outline-primary w-100'
            : 'btn btn-sm btn-primary w-100';
    }
    
    if (warning) {
        if (!isCompleted) {
            warning.classList.remove('d-none');
        } else {
            warning.classList.add('d-none');
        }
    }
}

// Update post-survey status on dashboard
function updatePostSurveyStatus() {
    const videosDone = currentParticipantProgress?.videos_completed?.length || 0;
    const allVideosDone = videosDone >= 4;
    const isCompleted = currentParticipantProgress?.post_survey_completed || false;
    
    const badge = document.getElementById('postsurvey-status-badge');
    const startBtn = document.getElementById('start-post-survey');
    
    if (badge) {
        if (isCompleted) {
            badge.className = 'badge bg-success';
            badge.textContent = currentLanguage === 'en' ? 'Completed' : 'Abgeschlossen';
        } else if (allVideosDone) {
            badge.className = 'badge bg-primary';
            badge.textContent = currentLanguage === 'en' ? 'Available' : 'Verfügbar';
        } else {
            badge.className = 'badge bg-secondary';
            badge.textContent = currentLanguage === 'en' ? 'Not Available' : 'Nicht verfügbar';
        }
    }
    
    if (startBtn) {
        if (allVideosDone && !isCompleted) {
            startBtn.classList.remove('d-none');
        } else {
            startBtn.classList.add('d-none');
        }
    }
}

// Create video card
function createVideoCard(video, number, isCompleted, surveyCompleted) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-3';
    
    const t = translations[currentLanguage];
    const completedText = t.video_completed || (currentLanguage === 'en' ? 'Completed' : 'Abgeschlossen');
    const startText = t.start_video || (currentLanguage === 'en' ? 'Start Video' : 'Video starten');
    const continueText = t.continue_video || (currentLanguage === 'en' ? 'Continue' : 'Fortsetzen');
    const surveyText = t.survey_completed || (currentLanguage === 'en' ? 'Survey Done' : 'Umfrage erledigt');
    const preSurveyRequired = t.complete_presurvey_first || (currentLanguage === 'en' ? 'Complete Pre-Survey First' : 'Zuerst Vor-Umfrage abschließen');
    
    // Check if pre-survey is completed
    const canAccess = currentParticipantProgress?.pre_survey_completed || false;
    
    // Button texts based on language
    const btnCompletedText = t.video_completed;
    const btnStartText = t.start_video;
    const btnContinueText = t.continue_video;
    const btnSurveyText = t.survey_completed;
    
    card.innerHTML = `
        <div class="card h-100 video-card ${isCompleted ? 'completed' : ''}" data-video-id="${video.id}">
            <div class="card-body text-center">
                <h5>${currentLanguage === 'en' ? 'Video' : 'Video'} ${number}</h5>
                <p class="text-muted small">${video.name}</p>
                ${isCompleted 
                    ? `<div>
                        <span class="badge bg-success mb-2"><i class="bi bi-check-circle"></i> ${btnCompletedText}</span>
                        ${surveyCompleted ? `<div><small class="text-muted"><i class="bi bi-clipboard-check"></i> ${btnSurveyText}</small></div>` : ''}
                        <button class="btn btn-outline-primary btn-sm mt-2 view-video-btn" data-video-id="${video.id}">${btnContinueText}</button>
                       </div>`
                    : canAccess
                        ? `<button class="btn btn-primary start-video-btn" data-video-id="${video.id}">${btnStartText}</button>`
                        : `<button class="btn btn-secondary start-video-btn" data-video-id="${video.id}" disabled title="${preSurveyRequired}">${btnStartText}</button>`
                }
            </div>
        </div>
    `;
    
    // Add click handler for start/continue button
    const startBtn = card.querySelector('.start-video-btn');
    const viewBtn = card.querySelector('.view-video-btn');
    
    if (startBtn && canAccess) {
        startBtn.addEventListener('click', () => {
            startVideoTask(video.id);
        });
    }
    
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            startVideoTask(video.id);
        });
    }
    
    return card;
}

// Get video page number from video ID
function getVideoPageNumber(videoId) {
    const index = VIDEOS.findIndex(v => v.id === videoId);
    return index >= 0 ? index + 1 : 1;
}

// Get element IDs for a specific video page
function getVideoElementIds(videoNum) {
    return {
        title: `video-${videoNum}-title`,
        subtitle: `video-${videoNum}-subtitle`,
        participantCode: `video-${videoNum}-participant-code`,
        videoName: `video-${videoNum}-video-name`,
        reflectionText: `video-${videoNum}-reflection-text`,
        wordCount: `video-${videoNum}-word-count`,
        generateBtn: `video-${videoNum}-generate-btn`,
        submitBtn: `video-${videoNum}-submit-btn`,
        clearBtn: `video-${videoNum}-clear-btn`,
        copyBtn: `video-${videoNum}-copy-btn`,
        reviseBtn: `video-${videoNum}-revise-btn`,
        loadingSpinner: `video-${videoNum}-loading-spinner`,
        loadingText: `video-${videoNum}-loading-text`,
        percentageExplanation: `video-${videoNum}-percentage-explanation`,
        feedbackTabs: `video-${videoNum}-feedback-tabs`,
        feedbackExtended: `video-${videoNum}-feedback-extended`,
        feedbackShort: `video-${videoNum}-feedback-short`,
        extendedTab: `video-${videoNum}-extended-tab`,
        shortTab: `video-${videoNum}-short-tab`,
        langEn: `video-${videoNum}-lang-en`,
        langDe: `video-${videoNum}-lang-de`,
        backBtn: `back-to-dashboard-btn`
    };
}

// Setup event listeners for a specific video page
function setupVideoPageElements(videoNum) {
    const ids = getVideoElementIds(videoNum);
    
    // Set up event listeners
    const reflectionText = document.getElementById(ids.reflectionText);
    if (reflectionText) {
        reflectionText.addEventListener('input', () => updateWordCountForVideo(videoNum));
    }
    
    const generateBtn = document.getElementById(ids.generateBtn);
    if (generateBtn) {
        generateBtn.addEventListener('click', () => handleGenerateFeedbackForVideo(videoNum));
    }
    
    const clearBtn = document.getElementById(ids.clearBtn);
    if (clearBtn) {
        clearBtn.addEventListener('click', () => handleClearForVideo(videoNum));
    }
    
    const copyBtn = document.getElementById(ids.copyBtn);
    if (copyBtn) {
        copyBtn.addEventListener('click', () => handleCopyForVideo(videoNum));
    }
    
    const reviseBtn = document.getElementById(ids.reviseBtn);
    if (reviseBtn) {
        reviseBtn.addEventListener('click', () => handleReviseForVideo(videoNum));
    }
    
    const submitBtn = document.getElementById(ids.submitBtn);
    if (submitBtn) {
        submitBtn.addEventListener('click', () => handleFinalSubmissionForVideo(videoNum));
    }
    
    const extendedTab = document.getElementById(ids.extendedTab);
    if (extendedTab) {
        extendedTab.addEventListener('click', () => startFeedbackViewing('extended', currentLanguage));
    }
    
    const shortTab = document.getElementById(ids.shortTab);
    if (shortTab) {
        shortTab.addEventListener('click', () => startFeedbackViewing('short', currentLanguage));
    }
    
    const langEn = document.getElementById(ids.langEn);
    if (langEn) {
        langEn.addEventListener('change', () => switchLanguage('en'));
    }
    
    const langDe = document.getElementById(ids.langDe);
    if (langDe) {
        langDe.addEventListener('change', () => switchLanguage('de'));
    }
}

// Start video task
async function startVideoTask(videoId) {
    // Check if pre-survey is completed
    if (!currentParticipantProgress?.pre_survey_completed) {
        const message = currentLanguage === 'en'
            ? 'Please complete the pre-survey before starting video tasks.'
            : 'Bitte vervollständigen Sie die Vor-Umfrage, bevor Sie mit den Video-Aufgaben beginnen.';
        showAlert(message, 'warning');
        showPage('presurvey');
        loadSurvey('pre');
        return;
    }
    
    currentVideoId = videoId;
    const video = VIDEOS.find(v => v.id === videoId);
    
    if (!video) return;
    
    const videoNum = getVideoPageNumber(videoId);
    const ids = getVideoElementIds(videoNum);
    
    // Update task page with video info
    const titleEl = document.getElementById(ids.title);
    const subtitleEl = document.getElementById(ids.subtitle);
    const codeEl = document.getElementById(ids.participantCode);
    const videoNameEl = document.getElementById(ids.videoName);
    
    if (titleEl) {
        const titleText = currentLanguage === 'en' 
            ? `Video ${videoNum} Task: ${video.name}`
            : `Video ${videoNum} Aufgabe: ${video.name}`;
        titleEl.textContent = titleText;
    }
    if (subtitleEl) {
        subtitleEl.setAttribute('data-lang-key', 'video_task_subtitle');
        subtitleEl.textContent = translations[currentLanguage].video_task_subtitle;
    }
    if (codeEl) codeEl.value = currentParticipant;
    if (videoNameEl) videoNameEl.value = video.name;
    
    // Load previous reflection and feedback for this video
    await loadPreviousReflectionAndFeedbackForVideo(videoId, videoNum);
    
    // Show percentage explanation
    const explanationEl = document.getElementById(ids.percentageExplanation);
    if (explanationEl) explanationEl.classList.remove('d-none');
    
    // Show task page for this video (use page-video-X format)
    const videoPageId = `video-${videoNum}`;
    console.log(`Navigating to video page: ${videoPageId} for video ${videoId}`);
    showPage(videoPageId);
    
    logEvent('video_task_started', {
        video_id: videoId,
        participant_name: currentParticipant
    });
}

// Load previous reflection and feedback for a specific video page
async function loadPreviousReflectionAndFeedbackForVideo(videoId, videoNum) {
    if (!supabase || !currentParticipant) {
        // No database, start fresh
        resetTaskStateForVideo(videoNum);
        return;
    }
    
    try {
        // Get the most recent reflection for this video and participant
        const { data: reflection, error } = await supabase
            .from('reflections')
            .select('*')
            .eq('participant_name', currentParticipant)
            .eq('video_id', videoId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
            console.error('Error loading previous reflection:', error);
            resetTaskStateForVideo(videoNum);
            return;
        }
        
        const ids = getVideoElementIds(videoNum);
        
        if (reflection) {
            // Load previous reflection text
            const reflectionText = document.getElementById(ids.reflectionText);
            if (reflectionText && reflection.reflection_text) {
                reflectionText.value = reflection.reflection_text;
                updateWordCountForVideo(videoNum);
            }
            
            // Load previous feedback if available
            if (reflection.feedback_extended || reflection.feedback_short) {
                const feedbackExtended = document.getElementById(ids.feedbackExtended);
                const feedbackShort = document.getElementById(ids.feedbackShort);
                const feedbackTabs = document.getElementById(ids.feedbackTabs);
                const reviseBtn = document.getElementById(ids.reviseBtn);
                const submitBtn = document.getElementById(ids.submitBtn);
                
                if (reflection.feedback_extended && feedbackExtended) {
                    const analysisResult = reflection.analysis_percentages ? {
                        percentages_raw: reflection.analysis_percentages.raw || reflection.analysis_percentages,
                        percentages_priority: reflection.analysis_percentages.priority || reflection.analysis_percentages,
                        weakest_component: reflection.weakest_component || 'Prediction'
                    } : null;
                    feedbackExtended.innerHTML = formatStructuredFeedback(reflection.feedback_extended, analysisResult);
                }
                
                if (reflection.feedback_short && feedbackShort) {
                    const analysisResult = reflection.analysis_percentages ? {
                        percentages_raw: reflection.analysis_percentages.raw || reflection.analysis_percentages,
                        percentages_priority: reflection.analysis_percentages.priority || reflection.analysis_percentages,
                        weakest_component: reflection.weakest_component || 'Prediction'
                    } : null;
                    feedbackShort.innerHTML = formatStructuredFeedback(reflection.feedback_short, analysisResult);
                }
                
                // Show feedback tabs and buttons
                if (feedbackTabs) feedbackTabs.classList.remove('d-none');
                if (reviseBtn) reviseBtn.style.display = 'inline-block';
                if (submitBtn) submitBtn.style.display = 'block';
                
                // Display analysis distribution if available
                if (reflection.analysis_percentages) {
                    const analysisResult = {
                        percentages_raw: reflection.analysis_percentages.raw || reflection.analysis_percentages,
                        percentages_priority: reflection.analysis_percentages.priority || reflection.analysis_percentages,
                        weakest_component: reflection.weakest_component || 'Prediction'
                    };
                    displayAnalysisDistributionForVideo(analysisResult, videoNum);
                }
                
                // Update task state
                currentTaskState = {
                    feedbackGenerated: true,
                    submitted: reflection.revision_number > 1,
                    currentReflectionId: reflection.id,
                    parentReflectionId: reflection.parent_reflection_id,
                    revisionCount: reflection.revision_number || 1,
                    currentFeedbackType: null,
                    currentFeedbackStartTime: null
                };
                
                // Store reflection for duplicate detection
                sessionStorage.setItem(`reflection-${videoId}`, reflection.reflection_text);
            } else {
                // No feedback yet, reset state
                resetTaskStateForVideo(videoNum);
            }
        } else {
            // No previous reflection, start fresh
            resetTaskStateForVideo(videoNum);
        }
    } catch (error) {
        console.error('Error in loadPreviousReflectionAndFeedbackForVideo:', error);
        resetTaskStateForVideo(videoNum);
    }
}

// Load previous reflection and feedback for a video (legacy function - kept for compatibility)
async function loadPreviousReflectionAndFeedback(videoId) {
    if (!supabase || !currentParticipant) {
        // No database, start fresh
        resetTaskState();
        return;
    }
    
    try {
        // Get the most recent reflection for this video and participant
        const { data: reflection, error } = await supabase
            .from('reflections')
            .select('*')
            .eq('participant_name', currentParticipant)
            .eq('video_id', videoId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
            console.error('Error loading previous reflection:', error);
            resetTaskState();
            return;
        }
        
        if (reflection) {
            // Load previous reflection text
            const reflectionText = document.getElementById('task-reflection-text');
            if (reflectionText && reflection.reflection_text) {
                reflectionText.value = reflection.reflection_text;
                updateWordCount();
            }
            
            // Load previous feedback if available
            if (reflection.feedback_extended || reflection.feedback_short) {
                const feedbackExtended = document.getElementById('task-feedback-extended');
                const feedbackShort = document.getElementById('task-feedback-short');
                const feedbackTabs = document.getElementById('task-feedback-tabs');
                const reviseBtn = document.getElementById('task-revise-btn');
                const submitBtn = document.getElementById('task-submit-final');
                
                if (reflection.feedback_extended && feedbackExtended) {
                    const analysisResult = reflection.analysis_percentages ? {
                        percentages_raw: reflection.analysis_percentages.raw || reflection.analysis_percentages,
                        percentages_priority: reflection.analysis_percentages.priority || reflection.analysis_percentages,
                        weakest_component: reflection.weakest_component || 'Prediction'
                    } : null;
                    feedbackExtended.innerHTML = formatStructuredFeedback(reflection.feedback_extended, analysisResult);
                }
                
                if (reflection.feedback_short && feedbackShort) {
                    const analysisResult = reflection.analysis_percentages ? {
                        percentages_raw: reflection.analysis_percentages.raw || reflection.analysis_percentages,
                        percentages_priority: reflection.analysis_percentages.priority || reflection.analysis_percentages,
                        weakest_component: reflection.weakest_component || 'Prediction'
                    } : null;
                    feedbackShort.innerHTML = formatStructuredFeedback(reflection.feedback_short, analysisResult);
                }
                
                // Show feedback tabs and buttons
                if (feedbackTabs) feedbackTabs.classList.remove('d-none');
                if (reviseBtn) reviseBtn.style.display = 'inline-block';
                if (submitBtn) submitBtn.style.display = 'block';
                
                // Display analysis distribution if available
                if (reflection.analysis_percentages) {
                    const analysisResult = {
                        percentages_raw: reflection.analysis_percentages.raw || reflection.analysis_percentages,
                        percentages_priority: reflection.analysis_percentages.priority || reflection.analysis_percentages,
                        weakest_component: reflection.weakest_component || 'Prediction'
                    };
                    displayAnalysisDistribution(analysisResult);
                }
                
                // Update task state
                currentTaskState = {
                    feedbackGenerated: true,
                    submitted: reflection.revision_number > 1, // Consider submitted if multiple revisions
                    currentReflectionId: reflection.id,
                    parentReflectionId: reflection.parent_reflection_id,
                    revisionCount: reflection.revision_number || 1,
                    currentFeedbackType: null,
                    currentFeedbackStartTime: null
                };
                
                // Store reflection for duplicate detection
                sessionStorage.setItem(`reflection-${videoId}`, reflection.reflection_text);
            } else {
                // No feedback yet, reset state
                resetTaskState();
            }
        } else {
            // No previous reflection, start fresh
            resetTaskState();
        }
    } catch (error) {
        console.error('Error in loadPreviousReflectionAndFeedback:', error);
        resetTaskState();
    }
}

// Reset task state for a specific video page
function resetTaskStateForVideo(videoNum) {
    // Reset task state
    currentTaskState = {
        feedbackGenerated: false,
        submitted: false,
        currentReflectionId: null,
        parentReflectionId: null,
        revisionCount: 0,
        currentFeedbackType: null,
        currentFeedbackStartTime: null
    };
    
    const ids = getVideoElementIds(videoNum);
    
    // Clear reflection text
    const reflectionText = document.getElementById(ids.reflectionText);
    if (reflectionText) reflectionText.value = '';
    updateWordCountForVideo(videoNum);
    
    // Clear all feedback displays
    const feedbackExtended = document.getElementById(ids.feedbackExtended);
    const feedbackShort = document.getElementById(ids.feedbackShort);
    const feedbackTabs = document.getElementById(ids.feedbackTabs);
    const reviseBtn = document.getElementById(ids.reviseBtn);
    const submitBtn = document.getElementById(ids.submitBtn);
    
    if (feedbackExtended) feedbackExtended.innerHTML = '<p class="text-muted" data-lang-key="feedback_placeholder">Feedback will appear here after generation...</p>';
    if (feedbackShort) feedbackShort.innerHTML = '<p class="text-muted" data-lang-key="feedback_placeholder">Feedback will appear here after generation...</p>';
    if (feedbackTabs) feedbackTabs.classList.add('d-none');
    
    // Remove analysis distribution if exists
    const analysisDist = document.getElementById(`analysis-distribution-video-${videoNum}`);
    if (analysisDist) analysisDist.remove();
    
    if (reviseBtn) reviseBtn.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'none';
}

// Reset task state (legacy function - kept for compatibility)
function resetTaskState() {
    // This is a fallback - try to detect current video page
    const currentVideoPage = document.querySelector('.video-task-page:not(.d-none)');
    if (currentVideoPage) {
        const videoId = currentVideoPage.dataset.videoId;
        const videoNum = getVideoPageNumber(videoId);
        resetTaskStateForVideo(videoNum);
    }
}

// Update progress bar
function updateProgressBar() {
    if (!currentParticipantProgress) return;
    
    const videosDone = currentParticipantProgress.videos_completed?.length || 0;
    const progress = (videosDone / 4) * 100;
    
    const progressBar = document.getElementById('dashboard-progress-bar');
    const progressText = document.getElementById('dashboard-progress-text');
    
    if (progressBar) {
        progressBar.style.width = progress + '%';
        progressBar.setAttribute('aria-valuenow', progress);
    }
    
    if (progressText) {
        progressText.textContent = `${videosDone}/4 Videos Completed`;
    }
}

// Load survey iframe
function loadSurvey(surveyType) {
    let surveyUrl = '';
    
    if (surveyType === 'pre') {
        surveyUrl = QUALTRICS_SURVEYS.pre;
        document.getElementById('pre-survey-iframe').src = surveyUrl;
    } else if (surveyType === 'post') {
        surveyUrl = QUALTRICS_SURVEYS.post;
        document.getElementById('post-survey-iframe').src = surveyUrl;
    } else if (surveyType.startsWith('post_video_')) {
        const videoNum = surveyType.split('_')[2];
        surveyUrl = QUALTRICS_SURVEYS[`post_video_${videoNum}`];
        document.getElementById('post-video-survey-iframe').src = surveyUrl;
        
        // Update title
        const titleEl = document.getElementById('post-video-survey-title');
        const subtitleEl = document.getElementById('post-video-survey-subtitle');
        if (titleEl) titleEl.textContent = `Post-Video ${videoNum} Questionnaire`;
        if (subtitleEl) subtitleEl.textContent = `Please share your thoughts about Video ${videoNum}`;
    }
}

// Update pre-survey page based on completion status
function updatePreSurveyPage() {
    const isCompleted = currentParticipantProgress?.pre_survey_completed || false;
    const completedStatus = document.getElementById('presurvey-completed-status');
    const description = document.getElementById('presurvey-description');
    const instructions = document.getElementById('presurvey-instructions');
    const continueBtn = document.getElementById('continue-after-presurvey');
    
    if (isCompleted) {
        // Show completion status
        if (completedStatus) {
            completedStatus.classList.remove('d-none');
        }
        if (description) {
            description.textContent = currentLanguage === 'en' 
                ? 'You have already completed this survey. You can review it below or return to the dashboard.'
                : 'Sie haben diese Umfrage bereits abgeschlossen. Sie können sie unten überprüfen oder zum Dashboard zurückkehren.';
        }
        if (instructions) {
            instructions.innerHTML = currentLanguage === 'en'
                ? '<small><i class="bi bi-info-circle me-1"></i><strong>Status:</strong> <span>Pre-survey completed. You can review it above or return to the dashboard.</span></small>'
                : '<small><i class="bi bi-info-circle me-1"></i><strong>Status:</strong> <span>Vor-Umfrage abgeschlossen. Sie können sie oben überprüfen oder zum Dashboard zurückkehren.</span></small>';
            instructions.className = 'alert alert-info mt-3 mb-0';
        }
        if (continueBtn) {
            continueBtn.textContent = currentLanguage === 'en' ? 'Return to Dashboard' : 'Zum Dashboard zurückkehren';
        }
    } else {
        // Hide completion status
        if (completedStatus) {
            completedStatus.classList.add('d-none');
        }
        if (instructions) {
            instructions.className = 'alert alert-success mt-3 mb-0';
        }
    }
}

// Mark pre-survey complete
async function markPreSurveyComplete() {
    if (!supabase || !currentParticipant) return;
    
    try {
        const { error } = await supabase
            .from('participant_progress')
            .update({ 
                pre_survey_completed: true,
                last_active_at: new Date().toISOString()
            })
            .eq('participant_name', currentParticipant);
        
        if (error) console.error('Error marking pre-survey complete:', error);
        else {
            currentParticipantProgress.pre_survey_completed = true;
            updatePreSurveyStatus(); // Update dashboard status
            logEvent('pre_survey_completed', { 
                participant_name: currentParticipant,
                language: currentLanguage
            });
        }
    } catch (error) {
        console.error('Error in markPreSurveyComplete:', error);
    }
}

// Mark video survey complete
async function markVideoSurveyComplete() {
    if (!supabase || !currentParticipant || !currentVideoId) return;
    
    try {
        const videoSurveys = currentParticipantProgress.video_surveys || {};
        videoSurveys[currentVideoId] = true;
        
        const { error } = await supabase
            .from('participant_progress')
            .update({ 
                video_surveys: videoSurveys,
                last_active_at: new Date().toISOString()
            })
            .eq('participant_name', currentParticipant);
        
        if (error) console.error('Error marking video survey complete:', error);
        else {
            currentParticipantProgress.video_surveys = videoSurveys;
            logEvent('video_survey_completed', { 
                participant_name: currentParticipant,
                video_id: currentVideoId
            });
        }
    } catch (error) {
        console.error('Error in markVideoSurveyComplete:', error);
    }
}

// Mark post-survey complete
async function markPostSurveyComplete() {
    if (!supabase || !currentParticipant) return;
    
    try {
        const { error } = await supabase
            .from('participant_progress')
            .update({ 
                post_survey_completed: true,
                last_active_at: new Date().toISOString()
            })
            .eq('participant_name', currentParticipant);
        
        if (error) console.error('Error marking post-survey complete:', error);
        else {
            currentParticipantProgress.post_survey_completed = true;
            logEvent('post_survey_completed', { 
                participant_name: currentParticipant,
                language: currentLanguage
            });
        }
    } catch (error) {
        console.error('Error in markPostSurveyComplete:', error);
    }
}

// Word count for specific video page
function updateWordCountForVideo(videoNum) {
    const ids = getVideoElementIds(videoNum);
    const text = document.getElementById(ids.reflectionText)?.value.trim() || '';
    const words = text ? text.split(/\s+/).length : 0;
    const wordCountEl = document.getElementById(ids.wordCount);
    if (wordCountEl) wordCountEl.textContent = words;
}

// Word count (legacy - kept for compatibility)
function updateWordCount() {
    // Try to detect current video page
    const currentVideoPage = document.querySelector('.video-task-page:not(.d-none)');
    if (currentVideoPage) {
        const videoId = currentVideoPage.dataset.videoId;
        const videoNum = getVideoPageNumber(videoId);
        updateWordCountForVideo(videoNum);
    }
}

// Generate feedback handler for specific video
async function handleGenerateFeedbackForVideo(videoNum) {
    const ids = getVideoElementIds(videoNum);
    const reflection = document.getElementById(ids.reflectionText)?.value.trim();
    
    if (!reflection) {
        showAlert('Please enter a reflection text first.', 'warning');
        return;
    }
    
    // Show style preference modal on first generation
    if (!currentTaskState.feedbackGenerated) {
        const modal = new bootstrap.Modal(document.getElementById('feedback-preference-modal'));
        modal.show();
        
        document.getElementById('feedback-preference-modal').addEventListener('hidden.bs.modal', function handler() {
            this.removeEventListener('hidden.bs.modal', handler);
            generateFeedbackForVideo(reflection, videoNum);
        });
    } else {
        generateFeedbackForVideo(reflection, videoNum);
    }
}

// Generate feedback handler (legacy - kept for compatibility)
async function handleGenerateFeedback() {
    // Try to detect current video page
    const currentVideoPage = document.querySelector('.video-task-page:not(.d-none)');
    if (currentVideoPage) {
        const videoId = currentVideoPage.dataset.videoId;
        const videoNum = getVideoPageNumber(videoId);
        handleGenerateFeedbackForVideo(videoNum);
    }
}

// Generate feedback (core logic - same as original)
async function generateFeedback(reflection) {
    const loadingSpinner = document.getElementById('task-loading-spinner');
    const generateBtn = document.getElementById('task-generate-btn');
    
    // Show loading
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    if (generateBtn) generateBtn.disabled = true;
    
    // Rotate loading messages
    const loadingText = document.getElementById('task-loading-text');
    let loadingMessageIndex = 0;
    const loadingInterval = setInterval(() => {
        loadingMessageIndex = (loadingMessageIndex + 1) % translations[currentLanguage].loading_messages.length;
        if (loadingText) {
            loadingText.textContent = translations[currentLanguage].loading_messages[loadingMessageIndex];
        }
    }, 8000);
    
    try {
        // Step 0: Check for duplicate reflection
        const previousReflection = sessionStorage.getItem(`reflection-${currentVideoId}`);
        if (previousReflection && previousReflection.trim() === reflection.trim()) {
            const duplicateMessage = currentLanguage === 'en'
                ? "⚠️ You submitted the same reflection as before. Please revise your reflection to improve it based on the previous feedback, then generate new feedback."
                : "⚠️ Sie haben dieselbe Reflexion wie zuvor eingereicht. Bitte überarbeiten Sie Ihre Reflexion, um sie basierend auf dem vorherigen Feedback zu verbessern, und generieren Sie dann neues Feedback.";
            
            logEvent('duplicate_reflection_detected', {
                participant_name: currentParticipant,
                video_id: currentVideoId,
                language: currentLanguage,
                reflection_length: reflection.length,
                revision_count: currentTaskState.revisionCount || 0
            });
            
            clearInterval(loadingInterval);
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (generateBtn) generateBtn.disabled = false;
            
            showAlert(duplicateMessage, 'warning');
            return;
        }
        
        // Step 0.5: Check for very short or non-relevant reflection
        const wordCount = reflection.split(/\s+/).length;
        const isVeryShort = wordCount < 20;
        
        // Step 1: Analyze reflection (binary classification at window level, then aggregated)
        const analysisResult = await analyzeReflectionDistribution(reflection, currentLanguage);
        
        // Store binary classification results (window-level D/E/P scores)
        await storeBinaryClassificationResults(analysisResult);
        
        // Step 2: Check for non-meaningful input (short OR non-relevant)
        const isNonRelevant = analysisResult.percentages_priority.professional_vision < 10;
        
        if (isVeryShort || isNonRelevant) {
            displayAnalysisDistribution(analysisResult);
            
            let warningMessage = '';
            if (isVeryShort && isNonRelevant) {
                warningMessage = currentLanguage === 'en'
                    ? "⚠️ Your reflection is very short and does not relate to the teaching video. Please write a longer reflection (at least 50 words) that describes what you observed, explains why it happened using educational theories, and predicts the effects on student learning."
                    : "⚠️ Ihre Reflexion ist sehr kurz und bezieht sich nicht auf das Unterrichtsvideo. Bitte schreiben Sie eine längere Reflexion (mindestens 50 Wörter), die beschreibt, was Sie beobachtet haben, erklärt, warum es passiert ist (unter Verwendung pädagogischer Theorien), und die Auswirkungen auf das Lernen der Schüler vorhersagt.";
            } else if (isVeryShort) {
                warningMessage = currentLanguage === 'en'
                    ? "⚠️ Your reflection is very short (only " + wordCount + " words). Please expand your reflection to at least 50 words, providing more detail about what you observed, why it happened, and its effects on student learning."
                    : "⚠️ Ihre Reflexion ist sehr kurz (nur " + wordCount + " Wörter). Bitte erweitern Sie Ihre Reflexion auf mindestens 50 Wörter und geben Sie mehr Details zu dem, was Sie beobachtet haben, warum es passiert ist und welche Auswirkungen es auf das Lernen der Schüler hat.";
            } else {
                warningMessage = currentLanguage === 'en'
                    ? "⚠️ Your reflection does not relate to the teaching video you watched. Please revise your reflection to focus on describing what you observed, explaining why it happened using educational theories, and predicting the effects on student learning."
                    : "⚠️ Ihre Reflexion bezieht sich nicht auf das Unterrichtsvideo, das Sie sich angeschaut haben. Bitte überarbeiten Sie Ihre Reflexion, um sich auf die Beschreibung Ihrer Beobachtungen, die Erklärung mit Hilfe pädagogischer Theorien und die Vorhersage der Auswirkungen auf das Lernen der Schüler zu konzentrieren.";
            }
            
            logEvent('non_relevant_reflection_detected', {
                participant_name: currentParticipant,
                video_id: currentVideoId,
                language: currentLanguage,
                reflection_length: reflection.length,
                word_count: wordCount,
                professional_vision_percentage: analysisResult.percentages_priority.professional_vision,
                is_very_short: isVeryShort,
                is_non_relevant: isNonRelevant
            });
            
            const feedbackExtended = document.getElementById('task-feedback-extended');
            const feedbackShort = document.getElementById('task-feedback-short');
            if (feedbackExtended) feedbackExtended.innerHTML = `<div class="alert alert-warning"><i class="bi bi-exclamation-triangle me-2"></i>${warningMessage}</div>`;
            if (feedbackShort) feedbackShort.innerHTML = `<div class="alert alert-warning"><i class="bi bi-exclamation-triangle me-2"></i>${warningMessage}</div>`;
            
            const feedbackTabs = document.getElementById('task-feedback-tabs');
            if (feedbackTabs) feedbackTabs.classList.remove('d-none');
            
            clearInterval(loadingInterval);
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (generateBtn) generateBtn.disabled = false;
            return;
        }
        
        // Step 3: Display analysis distribution
        displayAnalysisDistribution(analysisResult);
        
        // Step 4: Generate both feedback styles
        const [extendedFeedback, shortFeedback] = await Promise.all([
            generateWeightedFeedback(reflection, currentLanguage, 'academic', analysisResult),
            generateWeightedFeedback(reflection, currentLanguage, 'user-friendly', analysisResult)
        ]);
        
        // Step 5: Add revision suggestion if needed (for non-relevant content)
        let finalShortFeedback = shortFeedback;
        let finalExtendedFeedback = extendedFeedback;
        
        // Add warning if significant non-relevant content
        if (analysisResult && analysisResult.percentages_priority.other > 50) {
            const revisionNote = currentLanguage === 'en' 
                ? "\n\n**⚠️ Important Note:** Your reflection contains a significant amount of content that doesn't follow professional lesson analysis steps. Please revise your reflection to focus more on describing what you observed, explaining why it happened using educational theories, and predicting the effects on student learning."
                : "\n\n**⚠️ Wichtiger Hinweis:** Ihre Reflexion enthält einen erheblichen Anteil an Inhalten, die nicht den Schritten einer professionellen Stundenanalyse folgen. Bitte überarbeiten Sie Ihre Reflexion, um sich mehr auf die Beschreibung Ihrer Beobachtungen, die Erklärung mit Hilfe pädagogischer Theorien und die Vorhersage der Auswirkungen auf das Lernen der Schüler zu konzentrieren.";
            finalShortFeedback += revisionNote;
            finalExtendedFeedback += revisionNote;
            
            logEvent('non_relevant_content_warning', {
                participant_name: currentParticipant,
                video_id: currentVideoId,
                language: currentLanguage,
                other_percentage: analysisResult.percentages_priority.other,
                professional_vision_percentage: analysisResult.percentages_priority.professional_vision
            });
        }
        
        // Add warning if professional vision is low but above threshold
        if (analysisResult && analysisResult.percentages_priority.professional_vision < 30 && analysisResult.percentages_priority.professional_vision >= 10) {
            const lowPVNote = currentLanguage === 'en'
                ? "\n\n**Note:** Your reflection shows limited connection to professional vision concepts. Try to include more descriptions of observable teaching events, explanations linking events to educational theories, and predictions about effects on student learning."
                : "\n\n**Hinweis:** Ihre Reflexion zeigt eine begrenzte Verbindung zu Professional-Vision-Konzepten. Versuchen Sie, mehr Beschreibungen beobachtbarer Unterrichtsereignisse, Erklärungen, die Ereignisse mit pädagogischen Theorien verknüpfen, und Vorhersagen über Auswirkungen auf das Lernen der Schüler einzubeziehen.";
            finalShortFeedback += lowPVNote;
            finalExtendedFeedback += lowPVNote;
        }
        
        // Step 6: Save to database
        await saveFeedbackToDatabase({
            participantCode: currentParticipant,
            videoSelected: currentVideoId,
            reflectionText: reflection,
            analysisResult,
            extendedFeedback: finalExtendedFeedback,
            shortFeedback: finalShortFeedback
        });
        
        // Step 7: Store reflection for duplicate detection
        sessionStorage.setItem(`reflection-${currentVideoId}`, reflection.trim());
        
        // Step 8: Display feedback
        const feedbackExtended = document.getElementById('task-feedback-extended');
        const feedbackShort = document.getElementById('task-feedback-short');
        if (feedbackExtended) feedbackExtended.innerHTML = formatStructuredFeedback(finalExtendedFeedback, analysisResult);
        if (feedbackShort) feedbackShort.innerHTML = formatStructuredFeedback(finalShortFeedback, analysisResult);
        
        // Step 9: Show tabs
        const feedbackTabs = document.getElementById('task-feedback-tabs');
        if (feedbackTabs) feedbackTabs.classList.remove('d-none');
        
        if (userPreferredFeedbackStyle === 'short') {
            document.getElementById('task-short-tab')?.click();
        } else {
            document.getElementById('task-extended-tab')?.click();
        }
        
        // Start feedback viewing tracking
        startFeedbackViewing(userPreferredFeedbackStyle, currentLanguage);
        
        // Step 10: Show revise and submit buttons
        const reviseBtn = document.getElementById('task-revise-btn');
        const submitBtn = document.getElementById('task-submit-final');
        if (reviseBtn) reviseBtn.style.display = 'inline-block';
        if (submitBtn) submitBtn.style.display = 'block';
        
        currentTaskState.feedbackGenerated = true;
        
        // Log successful feedback generation
        logEvent('feedback_generated_successfully', {
            participant_name: currentParticipant,
            video_id: currentVideoId,
            language: currentLanguage,
            reflection_length: reflection.length,
            word_count: wordCount,
            professional_vision_percentage: analysisResult.percentages_priority.professional_vision,
            other_percentage: analysisResult.percentages_priority.other,
            revision_count: currentTaskState.revisionCount || 0
        });
        
        showAlert('✅ Feedback generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating feedback:', error);
        showAlert(`⚠️ ${error.message}`, 'danger');
    } finally {
        clearInterval(loadingInterval);
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (generateBtn) generateBtn.disabled = false;
    }
}

// Display analysis distribution
function displayAnalysisDistribution(analysisResult) {
    const rawPercentages = analysisResult.percentages_raw || analysisResult.percentages;
    const isGerman = currentLanguage === 'de';
    
    // Create or update distribution container
    let container = document.getElementById('analysis-distribution-task');
    if (!container) {
        container = document.createElement('div');
        container.id = 'analysis-distribution-task';
        container.className = 'analysis-distribution-professional mb-3';
        const feedbackTabs = document.getElementById('task-feedback-tabs');
        if (feedbackTabs) {
            feedbackTabs.parentNode.insertBefore(container, feedbackTabs);
        }
    }
    
    if (rawPercentages.professional_vision <= 5) {
        container.innerHTML = `
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
    
    container.innerHTML = `
        <div class="professional-analysis-summary">
            <h6>${isGerman ? 'Analyse Ihrer Reflexion' : 'Analysis of Your Reflection'}</h6>
            <p class="analysis-text">
                ${isGerman 
                    ? `Ihre Reflexion enthält ${rawPercentages.description || 0}% Beschreibung, ${rawPercentages.explanation || 0}% Erklärung und ${rawPercentages.prediction || 0}% Vorhersage.` 
                    : `Your reflection contains ${rawPercentages.description || 0}% description, ${rawPercentages.explanation || 0}% explanation, and ${rawPercentages.prediction || 0}% prediction.`}
            </p>
        </div>
    `;
}

// Button handlers
function handleClear() {
    const reflectionText = document.getElementById('task-reflection-text');
    if (reflectionText) {
        reflectionText.value = '';
        updateWordCount();
        reflectionText.focus();
    }
}

function handleCopy() {
    const activeTab = document.querySelector('#task-feedback-tabs .nav-link.active');
    const feedbackType = activeTab?.id.includes('extended') ? 'extended' : 'short';
    const feedbackContent = feedbackType === 'extended'
        ? document.getElementById('task-feedback-extended')?.textContent
        : document.getElementById('task-feedback-short')?.textContent;
    
    if (feedbackContent) {
        navigator.clipboard.writeText(feedbackContent).then(() => {
            showAlert('✅ Feedback copied to clipboard!', 'success');
            logEvent('copy_feedback', {
                video_id: currentVideoId,
                feedback_type: feedbackType,
                reflection_id: currentTaskState.currentReflectionId
            });
        });
    }
}

function handleRevise() {
    if (currentTaskState.currentFeedbackType && currentTaskState.currentFeedbackStartTime) {
        endFeedbackViewing(currentTaskState.currentFeedbackType, currentLanguage);
    }
    
    document.getElementById('task-reflection-text')?.focus();
    showAlert('You can now revise your reflection and generate new feedback.', 'info');
    
    currentTaskState.revisionCount = (currentTaskState.revisionCount || 0) + 1;
    
    logEvent('click_revise', {
        video_id: currentVideoId,
        reflection_id: currentTaskState.currentReflectionId,
        revision_number: currentTaskState.revisionCount
    });
}

function handleFinalSubmission() {
    const currentVideoPage = document.querySelector('.video-task-page:not(.d-none)');
    if (currentVideoPage) {
        const videoId = currentVideoPage.dataset.videoId;
        const videoNum = getVideoPageNumber(videoId);
        handleFinalSubmissionForVideo(videoNum);
    }
}

function confirmFinalSubmission() {
    const currentVideoPage = document.querySelector('.video-task-page:not(.d-none)');
    if (currentVideoPage) {
        const videoId = currentVideoPage.dataset.videoId;
        const videoNum = getVideoPageNumber(videoId);
        confirmFinalSubmissionForVideo(videoNum);
    }
}

// Mark video as completed
async function markVideoCompleted() {
    if (!supabase || !currentParticipant || !currentVideoId) return;
    
    try {
        const videosCompleted = currentParticipantProgress.videos_completed || [];
        if (!videosCompleted.includes(currentVideoId)) {
            videosCompleted.push(currentVideoId);
        }
        
        const { error } = await supabase
            .from('participant_progress')
            .update({ 
                videos_completed: videosCompleted,
                last_active_at: new Date().toISOString()
            })
            .eq('participant_name', currentParticipant);
        
        if (error) {
            console.error('Error marking video completed:', error);
        } else {
            currentParticipantProgress.videos_completed = videosCompleted;
            logEvent('video_completed', {
                participant_name: currentParticipant,
                video_id: currentVideoId
            });
        }
    } catch (error) {
        console.error('Error in markVideoCompleted:', error);
    }
}

// Language switching
// Language Management Functions
function switchLanguage(lang) {
    currentLanguage = lang;
    renderLanguageSwitchers();
    renderLanguageSwitcherInNav();
    applyTranslations();
    
    // Update all language radio buttons (including video pages and general language switchers)
    document.querySelectorAll('input[type="radio"][name^="video-"], input[type="radio"][name="language-task1"]').forEach(radio => {
        if (radio.id.includes(`lang-${lang}`)) {
            radio.checked = true;
        }
    });
    
    // Re-render dashboard if on dashboard page (to update video cards with new language)
    if (currentPage === 'dashboard' && currentParticipantProgress) {
        renderDashboard();
    }
    
    // Update video page titles/subtitles if on a video page
    if (currentPage.startsWith('video-')) {
        const videoNum = parseInt(currentPage.replace('video-', ''));
        const videoId = `video${videoNum}`;
        const video = VIDEOS.find(v => v.id === videoId);
        if (video) {
            const ids = getVideoElementIds(videoNum);
            const titleEl = document.getElementById(ids.title);
            const subtitleEl = document.getElementById(ids.subtitle);
            if (titleEl) {
                const titleText = currentLanguage === 'en' 
                    ? `Video ${videoNum} Task: ${video.name}`
                    : `Video ${videoNum} Aufgabe: ${video.name}`;
                titleEl.textContent = titleText;
            }
            if (subtitleEl) {
                subtitleEl.textContent = translations[currentLanguage].video_task_subtitle;
            }
        }
    }
    
    // Log language change with participant info
    logEvent('language_change', {
        new_language: lang,
        participant_name: currentParticipant || null,
        page: currentPage,
        video_id: currentVideoId
    });
}

function renderLanguageSwitchers() {
    const containers = document.querySelectorAll('.language-switcher-container');
    containers.forEach(container => {
        container.innerHTML = `
            <div class="btn-group" role="group">
                <button type="button" class="btn ${currentLanguage === 'en' ? 'btn-primary' : 'btn-outline-primary'}" id="lang-switch-en">English</button>
                <button type="button" class="btn ${currentLanguage === 'de' ? 'btn-primary' : 'btn-outline-primary'}" id="lang-switch-de">Deutsch</button>
            </div>
        `;
    });
    
    // Add event listeners
    document.getElementById('lang-switch-en')?.addEventListener('click', () => switchLanguage('en'));
    document.getElementById('lang-switch-de')?.addEventListener('click', () => switchLanguage('de'));
}

function renderLanguageSwitcherInNav() {
    const navContainer = document.querySelector('.language-switcher-container-inline');
    if (navContainer) {
        navContainer.innerHTML = `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-sm ${currentLanguage === 'en' ? 'btn-primary' : 'btn-outline-primary'}" id="nav-lang-switch-en">English</button>
                <button type="button" class="btn btn-sm ${currentLanguage === 'de' ? 'btn-primary' : 'btn-outline-primary'}" id="nav-lang-switch-de">Deutsch</button>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('nav-lang-switch-en')?.addEventListener('click', () => switchLanguage('en'));
        document.getElementById('nav-lang-switch-de')?.addEventListener('click', () => switchLanguage('de'));
    }
}

function applyTranslations() {
    const t = translations[currentLanguage];
    if (!t) return;
    
    // Update all elements with data-lang-key attribute
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (t[key]) {
            // Check if it's a placeholder (either data-lang-key-placeholder or has placeholder attribute)
            if (element.hasAttribute('data-lang-key-placeholder') || element.hasAttribute('placeholder')) {
                element.placeholder = t[key];
            } 
            // For buttons with spans inside, update the span
            else if (element.tagName === 'BUTTON' && element.querySelector('span[data-lang-key]')) {
                const span = element.querySelector('span[data-lang-key]');
                if (span) span.textContent = t[key];
            } 
            // For span elements directly
            else if (element.tagName === 'SPAN' && element.hasAttribute('data-lang-key')) {
                element.textContent = t[key];
            } 
            // For input elements, check if they should have placeholder updated
            else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // Only update placeholder if it's a text input/textarea
                if (element.type === 'text' || element.type === 'textarea' || element.tagName === 'TEXTAREA') {
                    if (key.includes('placeholder') || key.includes('reflection') || key.includes('paste')) {
                        element.placeholder = t[key];
                    } else {
                        element.textContent = t[key];
                    }
                } else {
                    element.textContent = t[key];
                }
            }
            // For other elements, update text content directly
            else {
                // Only update if element doesn't have children with data-lang-key (to preserve structure)
                const hasChildrenWithLangKey = element.querySelector('[data-lang-key]');
                if (!hasChildrenWithLangKey || ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LABEL'].includes(element.tagName)) {
                    element.textContent = t[key];
                }
            }
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
}

// AI Usage Modal
function showAIUsageModal() {
    const modal = new bootstrap.Modal(document.getElementById('ai-usage-modal'));
    modal.show();
}

function handleAIUsageResponse(usedAI) {
    logEvent('ai_usage_response', {
        used_ai: usedAI,
        tab_switch_count: tabSwitchCount,
        current_page: currentPage,
        video_id: currentVideoId,
        timestamp: new Date().toISOString()
    });
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('ai-usage-modal'));
    if (modal) modal.hide();
    
    if (usedAI) {
        const message = currentLanguage === 'de' 
            ? 'Vielen Dank für Ihre Ehrlichkeit. Bitte beachten Sie, dass diese Aufgabe Ihre eigene Analyse erfordert.'
            : 'Thank you for your honesty. Please note that this task requires your own analysis.';
        showAlert(message, 'warning');
    }
}

// Make handleAIUsageResponse global for onclick
window.handleAIUsageResponse = handleAIUsageResponse;

// Feedback viewing tracking
function startFeedbackViewing(style, language) {
    currentTaskState.currentFeedbackStartTime = Date.now();
    currentTaskState.currentFeedbackType = style;
    
    logEvent('view_feedback_start', {
        video_id: currentVideoId,
        style: style,
        language: language,
        participant_name: currentParticipant || null,
        reflection_id: currentTaskState.currentReflectionId
    });
}

function endFeedbackViewing(style, language) {
    if (!currentTaskState.currentFeedbackStartTime) return;
    
    const duration = (Date.now() - currentTaskState.currentFeedbackStartTime) / 1000;
    logEvent('view_feedback_end', {
        video_id: currentVideoId,
        style: style,
        language: language,
        participant_name: currentParticipant || null,
        duration_seconds: duration,
        reflection_id: currentTaskState.currentReflectionId
    });
    
    currentTaskState.currentFeedbackStartTime = null;
    currentTaskState.currentFeedbackType = null;
}

// Alert system
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
// Core Analysis Functions (Same as original - keep all logic)
// ============================================================================

async function analyzeReflectionDistribution(reflection, language) {
    try {
        const windows = createSentenceWindows(reflection);
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
        analysis.classificationResults = classificationResults;
        analysis.windows = windows;
        
        return analysis;
    } catch (error) {
        console.error('Error in classification:', error);
        return {
            percentages_raw: { description: 30, explanation: 35, prediction: 25, professional_vision: 90 },
            percentages_priority: { description: 30, explanation: 35, prediction: 25, other: 10, professional_vision: 90 },
            weakest_component: "Prediction",
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

async function classifyDescription(windowText) {
    const prompt = `You are an expert in analyzing teaching reflections. Determine if this text contains descriptions of observable teaching events.

DEFINITION: Descriptions identify and differentiate teaching events based on educational knowledge, WITHOUT making evaluations, interpretations, or speculations.

CRITERIA FOR "1" (Contains Description):
- Identifies observable teacher or student actions
- Relates to learning processes, teaching processes, or learning activities
- Uses neutral, observational language
- Must be relevant to teaching/learning context

CRITERIA FOR "0" (No Description):
- Contains evaluations, interpretations, or speculations
- Not about teaching/learning events
- Non-relevant content (e.g., personal opinions unrelated to teaching, random text)
- Too short or meaningless fragments

INSTRUCTIONS: 
- Respond with ONLY "1" or "0"
- Be conservative: only respond "1" if clearly certain the criteria are met
- If text is non-relevant or too short, respond "0"

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
- Must be relevant to teaching/learning context

CRITERIA FOR "0" (No Explanation):
- No connection to educational theories or principles
- Explains non-observable or hypothetical events
- No reference to teaching/learning events
- Pure description without theoretical connection
- Non-relevant content unrelated to teaching
- Too short or meaningless fragments

INSTRUCTIONS:
- Respond with ONLY "1" or "0"
- No explanations, quotes, or other text
- "1" if ANY part connects teaching events to educational knowledge
- "0" if no theoretical connections present OR if content is non-relevant
- Be conservative: only respond "1" if clearly certain

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
- Must be relevant to teaching/learning context

CRITERIA FOR "0" (No Prediction):
- No effects on student learning mentioned
- Predictions without educational basis
- No connection to teaching events
- Predictions about non-learning outcomes
- Non-relevant content unrelated to teaching
- Too short or meaningless fragments

INSTRUCTIONS:
- Respond with ONLY "1" or "0"
- No explanations, quotes, or other text
- "1" if ANY part predicts effects on student learning
- "0" if no learning consequences mentioned OR if content is non-relevant
- Be conservative: only respond "1" if clearly certain

TEXT: ${windowText}`;

    return await callBinaryClassifier(prompt);
}

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
            
            if (!response.ok) {
                console.warn(`Binary classifier attempt ${attempt + 1} failed: HTTP ${response.status}`);
                continue;
            }
            
            const result = await response.json();
            const output = result.choices[0].message.content.trim();
            
            if (output === '1' || output === '0') {
                return parseInt(output);
            }
            
            if (output.includes('1')) return 1;
            if (output.includes('0')) return 0;
            
            console.warn(`Binary classifier attempt ${attempt + 1}: Unexpected output: "${output}"`);
            
        } catch (error) {
            console.warn(`Binary classifier attempt ${attempt + 1} failed:`, error);
        }
    }
    
    console.error('All binary classifier attempts failed, defaulting to 0');
    return 0;
}

function calculatePercentages(classificationResults) {
    const totalWindows = classificationResults.length;
    
    if (totalWindows === 0) {
        return {
            percentages_raw: { description: 0, explanation: 0, prediction: 0, professional_vision: 0 },
            percentages_priority: { description: 0, explanation: 0, prediction: 0, other: 100, professional_vision: 0 },
            weakest_component: "Prediction",
            analysis_summary: "No valid windows for analysis"
        };
    }
    
    // RAW CALCULATION (can exceed 100%)
    let rawDescriptionCount = 0;
    let rawExplanationCount = 0;
    let rawPredictionCount = 0;
    
    classificationResults.forEach(result => {
        if (result.description === 1) rawDescriptionCount++;
        if (result.explanation === 1) rawExplanationCount++;
        if (result.prediction === 1) rawPredictionCount++;
    });
    
    const rawPercentages = {
        description: Math.round((rawDescriptionCount / totalWindows) * 100 * 10) / 10,
        explanation: Math.round((rawExplanationCount / totalWindows) * 100 * 10) / 10,
        prediction: Math.round((rawPredictionCount / totalWindows) * 100 * 10) / 10,
        professional_vision: Math.round(((rawDescriptionCount + rawExplanationCount + rawPredictionCount) / totalWindows) * 100 * 10) / 10
    };
    
    // PRIORITY-BASED CALCULATION (adds to 100%)
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
    
    const priorityPercentages = {
        description: Math.round((descriptionCount / totalWindows) * 100 * 10) / 10,
        explanation: Math.round((explanationCount / totalWindows) * 100 * 10) / 10,
        prediction: Math.round((predictionCount / totalWindows) * 100 * 10) / 10,
        other: Math.round((otherCount / totalWindows) * 100 * 10) / 10,
        professional_vision: Math.round(((descriptionCount + explanationCount + predictionCount) / totalWindows) * 100 * 10) / 10
    };
    
    // Find weakest component
    const components = {
        'Description': priorityPercentages.description,
        'Explanation': priorityPercentages.explanation,
        'Prediction': priorityPercentages.prediction
    };
    
    const weakestComponent = Object.keys(components).reduce((a, b) => 
        components[a] <= components[b] ? a : b
    );
    
    return {
        percentages_raw: rawPercentages,
        percentages_priority: priorityPercentages,
        percentages: rawPercentages,
        weakest_component: weakestComponent,
        analysis_summary: `Analyzed ${totalWindows} windows. Raw: D:${rawPercentages.description}% E:${rawPercentages.explanation}% P:${rawPercentages.prediction}% (Total PV: ${rawPercentages.professional_vision}%). Priority-based: D:${priorityPercentages.description}% E:${priorityPercentages.explanation}% P:${priorityPercentages.prediction}% Other:${priorityPercentages.other}% = 100%`
    };
}

// ============================================================================
// Feedback Generation (Same as original)
// ============================================================================

async function generateWeightedFeedback(reflection, language, style, analysisResult) {
    const promptType = `${style} ${language === 'en' ? 'English' : 'German'}`;
    const systemPrompt = getFeedbackPrompt(promptType, analysisResult);
    const pctPriority = analysisResult.percentages_priority;
    
    const languageInstruction = language === 'en' 
        ? "IMPORTANT: You MUST respond in English. The entire feedback MUST be in English only."
        : "WICHTIG: Sie MÜSSEN auf Deutsch antworten. Das gesamte Feedback MUSS ausschließlich auf Deutsch sein.";
    
    const requestData = {
        model: model,
        messages: [
            { role: "system", content: languageInstruction + "\n\n" + systemPrompt },
            { role: "user", content: `Based on the analysis showing ${pctPriority.description}% description, ${pctPriority.explanation}% explanation, ${pctPriority.prediction}% prediction (Professional Vision: ${pctPriority.professional_vision}%) + Other: ${pctPriority.other}% = 100%, provide feedback for this reflection:\n\n${reflection}` }
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
// Database Functions
// ============================================================================

function initSupabase() {
    if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('YOUR_') || SUPABASE_KEY.includes('YOUR_')) {
        console.warn('Supabase credentials not set. Running in demo mode.');
        showAlert('Running in demo mode - feedback works, but data won\'t be saved to database.', 'info');
        return null;
    }
    
    try {
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
    if (!client) return;
    
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

async function storeBinaryClassificationResults(analysisResult) {
    if (!supabase || !currentSessionId || !currentParticipant || !currentVideoId) return;
    
    try {
        const classificationRecords = analysisResult.classificationResults.map(result => ({
            session_id: currentSessionId,
            reflection_id: currentTaskState.currentReflectionId,
            task_id: `video-task-${currentVideoId}`,
            participant_name: currentParticipant,
            video_id: currentVideoId,
            language: currentLanguage,
            window_id: result.window_id,
            window_text: result.window_text,
            description_score: result.description,
            explanation_score: result.explanation,
            prediction_score: result.prediction,
            created_at: new Date().toISOString()
        }));
        
        if (classificationRecords.length > 0) {
            const { data, error } = await supabase
                .from('binary_classifications')
                .insert(classificationRecords);
            
            if (error) {
                console.error('Error storing binary classifications:', error);
            } else {
                console.log(`✅ ${classificationRecords.length} binary classifications stored`);
            }
        }
    } catch (error) {
        console.error('Error in storeBinaryClassificationResults:', error);
    }
}

async function saveFeedbackToDatabase(data) {
    if (!supabase) {
        console.log('No database connection - running in demo mode');
        return;
    }
    
    try {
        const revisionNumber = currentTaskState.revisionCount || 1;
        const parentReflectionId = currentTaskState.parentReflectionId || null;

        const reflectionData = {
            session_id: currentSessionId,
            participant_name: data.participantCode,
            video_id: data.videoSelected,
            language: currentLanguage,
            task_id: `video-task-${data.videoSelected}`,
            reflection_text: data.reflectionText,
            analysis_percentages: {
                raw: data.analysisResult.percentages_raw,
                priority: data.analysisResult.percentages_priority,
                displayed_to_student: data.analysisResult.percentages_raw
            },
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

        currentTaskState.currentReflectionId = result.id;
        
        if (revisionNumber === 1) {
            currentTaskState.parentReflectionId = result.id;
        }
        
        console.log(`✅ Reflection saved to database:`, result.id);
        
        logEvent('submit_reflection', {
            video_id: data.videoSelected,
            participant_name: data.participantCode,
            language: currentLanguage,
            reflection_id: result.id,
            reflection_length: data.reflectionText.length,
            analysis_percentages_raw: data.analysisResult.percentages_raw,
            analysis_percentages_priority: data.analysisResult.percentages_priority,
            weakest_component: data.analysisResult.weakest_component
        });
        
    } catch (error) {
        console.error('Error saving to database:', error);
    }
}

// Session end tracking
window.addEventListener('beforeunload', () => {
    if (currentTaskState.currentFeedbackType && currentTaskState.currentFeedbackStartTime) {
        endFeedbackViewing(currentTaskState.currentFeedbackType, currentLanguage);
    }
    
    logEvent('session_end', {
        session_duration: Date.now() - performance.timing.navigationStart,
        language: currentLanguage,
        final_page: currentPage,
        video_id: currentVideoId,
        participant_name: currentParticipant || null
    });
});
