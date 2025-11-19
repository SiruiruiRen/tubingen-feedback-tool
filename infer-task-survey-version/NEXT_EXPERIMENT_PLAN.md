# Next Experiment Interface Plan - 4 Videos Over 2.5 Weeks

## 🎯 Experiment Requirements

### **Structure:**
- **4 videos** total
- **2.5 weeks** duration
- **Flexible order** - students choose when to do each video
- **Can pause** - complete videos over multiple sessions
- **Surveys:**
  - 1 pre-survey (at start)
  - 4 post-video questionnaires (motivation/cognitive load after each video)
  - 1 post-survey (at end)

### **Key Challenges:**
1. ✅ Track progress across multiple sessions
2. ✅ Allow resuming from where they left off
3. ✅ Associate pseudonym with assigned condition and progress
4. ✅ Explain why percentages exceed 100%

---

## 🏗️ Proposed Interface Design

### **NEW: Video Dashboard (Home/Hub Page)**

```
┌─────────────────────────────────────────────────┐
│  INFER - Professional Vision Development        │
│  Welcome back, [Participant Code]!              │
│                                                 │
│  Your Progress: 2/4 Videos Completed (50%)     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ Video 1     │  │ Video 2     │             │
│  │ Spider      │  │ Butterfly   │             │
│  │ ✓ Complete  │  │ ✓ Complete  │             │
│  └─────────────┘  └─────────────┘             │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ Video 3     │  │ Video 4     │             │
│  │ Height Diff │  │ Ladybug     │             │
│  │ → Start     │  │ 🔒 Locked   │             │
│  └─────────────┘  └─────────────┘             │
│                                                 │
│  Next: Complete Video 3                        │
└─────────────────────────────────────────────────┘
```

---

## 📊 New Flow Design

### **1. Login/Resume System**

```
Entry Page
├─ New Participant → Enter Pseudonym Code → Pre-Survey → Dashboard
└─ Returning Participant → Enter Pseudonym Code → Check Progress → Resume Dashboard
```

**Database Table: `participant_progress`**
```sql
CREATE TABLE participant_progress (
    id BIGSERIAL PRIMARY KEY,
    participant_name TEXT UNIQUE NOT NULL,
    assigned_condition TEXT, -- 'control' or 'experimental'
    current_video_index INTEGER DEFAULT 0,
    videos_completed JSONB DEFAULT '[]', -- ["spider", "butterfly"]
    surveys_completed JSONB DEFAULT '{}', -- {"pre": true, "video1": true, ...}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### **2. Complete Study Flow**

```
1. Login/Resume
   ├─ Enter Pseudonym Code
   ├─ Check if exists in database
   ├─ Load progress OR start new
   └─ Show Dashboard

2. Dashboard (Video Selection Hub)
   ├─ Show 4 video cards
   ├─ Mark completed (✓)
   ├─ Lock uncompleted if order required
   ├─ Show overall progress bar
   └─ Click video → Go to Task

3. Video Task Flow (per video)
   ├─ Video instructions + password
   ├─ Reflection task + feedback
   ├─ Post-video questionnaire (motivation/cognitive load)
   └─ Return to Dashboard

4. After All 4 Videos
   ├─ Dashboard shows "All Complete!"
   └─ Post-Survey → Thank You

5. Progress Saved After Each:
   ├─ Video completion
   ├─ Survey completion
   └─ Can resume anytime
```

---

### **3. Percentage Explanation Addition**

**Current Display:**
```
┌─────────────────────────────────────────┐
│ Analysis of Your Reflection            │
│ Your reflection contains:              │
│ - 70% description                      │
│ - 60% explanation                      │
│ - 30% prediction                       │
└─────────────────────────────────────────┘
```

**Proposed NEW Display:**
```
┌─────────────────────────────────────────┐
│ Analysis of Your Reflection            │
│                                         │
│ Component Analysis (can exceed 100%):  │
│ - 70% of passages contain Description  │
│ - 60% of passages contain Explanation  │
│ - 30% of passages contain Prediction   │
│                                         │
│ ℹ️ Why over 100%?                      │
│ Some passages contain multiple         │
│ components (e.g., both Description     │
│ AND Explanation), so the total can     │
│ exceed 100%. This shows the richness   │
│ of your analysis.                      │
│                                         │
│ Total Professional Vision: 110%        │
│ (Adjusted for analysis: 100%)          │
└─────────────────────────────────────────┘
```

---

## 🗄️ New Database Tables Needed

### **Table 1: participant_progress**
```sql
CREATE TABLE participant_progress (
    id BIGSERIAL PRIMARY KEY,
    participant_name TEXT UNIQUE NOT NULL,
    assigned_condition TEXT, -- 'control' or 'experimental'
    videos_completed TEXT[], -- ['spider', 'butterfly', ...]
    current_video TEXT,
    pre_survey_completed BOOLEAN DEFAULT FALSE,
    post_survey_completed BOOLEAN DEFAULT FALSE,
    video_surveys_completed JSONB DEFAULT '{}', -- {"spider": true, "butterfly": false, ...}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Table 2: video_sessions (extend reflections)**
Already exists, but add:
- `video_id` (already have)
- `completion_status` (new: 'in_progress', 'completed', 'abandoned')
- Link to `participant_progress`

### **Table 3: survey_responses**
```sql
CREATE TABLE survey_responses (
    id BIGSERIAL PRIMARY KEY,
    participant_name TEXT NOT NULL,
    survey_type TEXT NOT NULL, -- 'pre', 'post', 'video_1', 'video_2', etc.
    video_id TEXT, -- NULL for pre/post, video ID for post-video
    responses JSONB,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 Interface Components to Build

### **Component 1: Login/Resume Page**

**Features:**
- Input: Pseudonym code
- Button: "Start New" or "Resume"
- Database check: Does code exist?
- Load progress if exists
- Assign condition if new

**Layout:**
```html
<div class="login-page">
    <h2>Welcome to INFER</h2>
    <p>Enter your participant code to begin or resume</p>
    <input type="text" id="participant-code" placeholder="e.g., A0895">
    <button onclick="checkProgress()">Continue</button>
</div>
```

---

### **Component 2: Video Dashboard**

**Features:**
- 4 video cards (grid layout)
- Progress bar (X/4 completed)
- Video status: ✓ Complete | → Available | 🔒 Locked
- Next steps message
- Logout button

**Data to Display:**
```javascript
{
    participantName: "A0895",
    condition: "experimental",
    videosCompleted: ["spider", "butterfly"],
    currentProgress: 2,
    totalVideos: 4,
    nextVideo: "height"
}
```

---

### **Component 3: Percentage Explanation Box**

**Location:** Below the analysis distribution, before feedback

**Design:**
```html
<div class="percentage-explanation-box">
    <div class="explanation-header">
        <i class="bi bi-info-circle"></i>
        <strong>Why do percentages exceed 100%?</strong>
    </div>
    <div class="explanation-content">
        <p>We show TWO types of analysis:</p>
        
        <div class="analysis-type">
            <strong>1. Component Coverage (RAW):</strong>
            <ul>
                <li>70% of passages contain Description</li>
                <li>60% of passages contain Explanation</li>
                <li>30% of passages contain Prediction</li>
            </ul>
            <p class="note">Total: 160% - This is normal! Some passages have multiple components.</p>
        </div>
        
        <div class="analysis-type">
            <strong>2. Professional Vision Total:</strong>
            <p>Adjusted calculation: 100% (for comparison purposes)</p>
        </div>
    </div>
</div>
```

---

### **Component 4: Post-Video Questionnaire**

**After each video completion:**
- Embedded Qualtrics survey
- Questions on:
  - Motivation (e.g., "I felt motivated to complete this task")
  - Cognitive load (e.g., "The feedback was easy to understand")
  - 5-point Likert scales
- Mark survey as completed in database
- Return to dashboard

---

## 📝 Implementation Steps

### **Phase 1: Database Setup (Week 1)**
1. Create `participant_progress` table
2. Create `survey_responses` table
3. Add progress tracking fields
4. Test progress save/load

### **Phase 2: Login/Resume System (Week 1)**
1. Build login/resume page
2. Pseudonym validation
3. Progress checking logic
4. Condition assignment
5. Dashboard routing

### **Phase 3: Video Dashboard (Week 2)**
1. Design 4-video grid layout
2. Progress bar component
3. Video card states (complete/available/locked)
4. Navigation to video tasks
5. Return to dashboard after completion

### **Phase 4: Percentage Explanation (Week 2)**
1. Design explanation box
2. Add translations (EN/DE)
3. Position below analysis distribution
4. Show RAW vs adjusted percentages
5. Add tooltip/info icon

### **Phase 5: Survey Integration (Week 3)**
1. Embed Qualtrics for post-video questionnaires
2. Track survey completion
3. Update progress after surveys
4. Prevent skipping surveys

### **Phase 6: Testing (Week 3)**
1. Test complete 4-video flow
2. Test progress saving/resuming
3. Test all 4 videos in one session
4. Test 4 videos across multiple days
5. Test percentage explanation clarity

---

## 🎯 Key Design Decisions

### **Decision 1: Video Order**

**Option A: Flexible Order** ✅ RECOMMENDED
- Students can do videos in any order
- More realistic for 2.5-week study
- Better engagement

**Option B: Fixed Sequential Order**
- Must complete Video 1 before Video 2
- Easier to implement
- May cause dropout if stuck

**Recommendation:** Start with Option A (flexible)

---

### **Decision 2: Progress Storage**

**Option A: Database-Only** ✅ RECOMMENDED
- Store in Supabase `participant_progress` table
- Reliable, accessible from any device
- Can analyze progress patterns

**Option B: LocalStorage + Database**
- Faster access
- Works offline
- Backup redundancy

**Recommendation:** Option A, with optional localStorage cache

---

### **Decision 3: Percentage Display**

**Option A: Show Both RAW and Adjusted** ✅ RECOMMENDED
```
Component Coverage:
- 70% Description, 60% Explanation, 30% Prediction
Total: 160% (some passages have multiple components)

Professional Vision Score: 100% (adjusted)
```

**Option B: Show Only RAW**
```
- 70% Description
- 60% Explanation  
- 30% Prediction
(Percentages can exceed 100%)
```

**Recommendation:** Option A - educates students about the method

---

### **Decision 4: Return Mechanism**

**Option A: Pseudonym Login** ✅ RECOMMENDED
- Simple: Enter code → Load progress
- No password needed
- Privacy-friendly

**Option B: Session URL**
- Email unique URL to each participant
- Auto-resume when clicked
- More complex to implement

**Recommendation:** Option A

---

## 📋 New Pages Needed

### **Page 1: Login/Resume**
- Enter pseudonym
- "New" or "Resume" detection
- Condition assignment for new
- Progress loading for returning

### **Page 2: Pre-Survey**
- One-time survey at start
- Only for new participants
- Mark completion in database

### **Page 3: Video Dashboard**
- Shows 4 videos
- Progress tracking
- Video selection
- Navigation to tasks

### **Page 4: Video Task** (x4)
- Similar to current task1
- Video-specific instructions
- Reflection + feedback
- Post-video questionnaire

### **Page 5: Post-Video Questionnaire** (x4)
- Motivation questions
- Cognitive load questions
- Qualtrics embed
- Mark completion

### **Page 6: Post-Survey**
- Final survey after all 4 videos
- Only shown when all complete

### **Page 7: Thank You**
- Study completion
- Citation info

---

## 🔧 Technical Implementation

### **1. Progress Tracking Functions**

```javascript
async function saveProgress(participantName, videoId, status) {
    const { data, error } = await supabase
        .from('participant_progress')
        .upsert({
            participant_name: participantName,
            videos_completed: [...existingCompleted, videoId],
            last_active_at: new Date().toISOString()
        });
}

async function loadProgress(participantName) {
    const { data, error } = await supabase
        .from('participant_progress')
        .select('*')
        .eq('participant_name', participantName)
        .single();
    
    return data; // { videos_completed: [...], current_video: "..." }
}

function isVideoCompleted(videoId, progressData) {
    return progressData.videos_completed.includes(videoId);
}
```

---

### **2. Percentage Explanation Component**

```javascript
function displayAnalysisDistribution(taskId, analysisResult) {
    const rawPercentages = analysisResult.percentages_raw;
    const isGerman = currentLanguage === 'de';
    
    const html = `
        <div class="professional-analysis-summary">
            <h6>${isGerman ? 'Analyse Ihrer Reflexion' : 'Analysis of Your Reflection'}</h6>
            
            <div class="component-breakdown">
                <p class="analysis-text">
                    ${isGerman ? 'Komponenten-Analyse:' : 'Component Analysis:'}
                </p>
                <ul>
                    <li>${rawPercentages.description}% ${isGerman ? 'der Abschnitte enthalten Beschreibung' : 'of passages contain Description'}</li>
                    <li>${rawPercentages.explanation}% ${isGerman ? 'der Abschnitte enthalten Erklärung' : 'of passages contain Explanation'}</li>
                    <li>${rawPercentages.prediction}% ${isGerman ? 'der Abschnitte enthalten Vorhersage' : 'of passages contain Prediction'}</li>
                </ul>
            </div>
            
            <div class="percentage-explanation alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                <strong>${isGerman ? 'Warum über 100%?' : 'Why over 100%?'}</strong><br>
                ${isGerman 
                    ? 'Einige Abschnitte enthalten mehrere Komponenten (z.B. sowohl Beschreibung ALS AUCH Erklärung), daher kann die Summe 100% überschreiten. Dies zeigt den Reichtum Ihrer Analyse.'
                    : 'Some passages contain multiple components (e.g., both Description AND Explanation), so the total can exceed 100%. This shows the richness of your analysis.'}
            </div>
            
            <div class="pv-total">
                <strong>${isGerman ? 'Professional Vision Gesamt:' : 'Total Professional Vision:'}</strong> 
                ${rawPercentages.professional_vision}%
                ${isGerman ? '(für Vergleich angepasst: 100%)' : '(adjusted for comparison: 100%)'}
            </div>
        </div>
    `;
    
    distributionContainer.innerHTML = html;
}
```

---

### **3. Video Dashboard Component**

```javascript
function renderVideoDashboard(progressData) {
    const videos = [
        { id: 'spider', name: 'Spider Task', password: 'M52025', url: '...' },
        { id: 'butterfly', name: 'Butterfly Task', password: 'M52025', url: '...' },
        { id: 'height', name: 'Height Difference', password: 'M52025', url: '...' },
        { id: 'ladybug', name: 'Ladybug Task', password: 'M52025', url: '...' }
    ];
    
    const dashboard = document.getElementById('video-dashboard');
    dashboard.innerHTML = `
        <div class="progress-header">
            <h2>Your Progress: ${progressData.videos_completed.length}/4 Videos Completed</h2>
            <div class="progress">
                <div class="progress-bar" style="width: ${progressData.videos_completed.length * 25}%"></div>
            </div>
        </div>
        
        <div class="video-grid">
            ${videos.map(video => `
                <div class="video-card ${isVideoCompleted(video.id, progressData) ? 'completed' : 'available'}">
                    <h3>${video.name}</h3>
                    ${isVideoCompleted(video.id, progressData) 
                        ? '<span class="badge bg-success">✓ Complete</span>'
                        : '<button onclick="startVideo(\'${video.id}\')">Start Video</button>'}
                </div>
            `).join('')}
        </div>
    `;
}
```

---

## 📊 Data Tracking Enhancements

### **New Event Types to Log:**

| Event Type | When | Data Captured |
|------------|------|---------------|
| `login_attempt` | User enters pseudonym | Code, new/returning |
| `progress_loaded` | Returning user loads progress | Videos completed, condition |
| `video_selected` | User clicks video card | Video ID, completion status |
| `video_completed` | User finishes video + survey | Video ID, total time |
| `survey_started` | User opens survey | Survey type, video ID |
| `survey_completed` | User submits survey | Survey type, responses |
| `dashboard_view` | User returns to dashboard | Progress update |

---

## 🎨 UI/UX Enhancements

### **1. Progress Persistence Message**
```
"Welcome back! You've completed 2 out of 4 videos. 
Continue where you left off or choose another video."
```

### **2. Video Card States**

**Completed:**
- Green checkmark
- Grayed out
- "Review" button (optional)

**Available:**
- Colorful, highlighted
- "Start" or "Continue" button
- Video preview image

**Locked:** (if sequential order)
- Grayed out, locked icon
- "Complete Video X first"

### **3. Percentage Explanation Styling**

```css
.percentage-explanation {
    background-color: #e7f3ff;
    border-left: 4px solid #0066cc;
    padding: 12px;
    margin: 10px 0;
    border-radius: 4px;
}

.component-breakdown ul {
    list-style: none;
    padding-left: 0;
}

.component-breakdown li {
    padding: 4px 0;
    font-weight: 500;
}
```

---

## ⚙️ Configuration Options

### **Flexibility Settings:**

```javascript
const EXPERIMENT_CONFIG = {
    totalVideos: 4,
    allowFlexibleOrder: true, // Change to false for sequential
    requireAllVideosBeforePost: true,
    sessionTimeout: 30 * 24 * 60 * 60 * 1000, // 30 days
    showPercentageExplanation: true,
    condition: 'experimental' // or 'control'
};
```

---

## 🚀 Recommended Implementation Order

### **Week 1:**
1. ✅ Create database tables (participant_progress, survey_responses)
2. ✅ Build login/resume page
3. ✅ Implement progress tracking functions
4. ✅ Test save/load with 1 participant

### **Week 2:**
5. ✅ Build video dashboard
6. ✅ Integrate 4 video tasks
7. ✅ Add post-video questionnaires
8. ✅ Test complete 4-video flow

### **Week 3:**
9. ✅ Add percentage explanation
10. ✅ Add pre/post surveys
11. ✅ Full integration testing
12. ✅ Deploy and pilot test

---

## 📋 Testing Checklist

- [ ] New participant can start, complete 1 video, and return later
- [ ] Returning participant sees correct progress
- [ ] All 4 videos can be completed in any order
- [ ] Progress saves after each video
- [ ] Surveys integrate smoothly
- [ ] Percentage explanation displays correctly in EN and DE
- [ ] Tab switching detection works
- [ ] All data logs to Supabase correctly

---

## 💡 Additional Considerations

### **Dropout Prevention:**
- Email reminders after X days inactive
- Progress dashboard shows what's left
- Clear "Next steps" messaging

### **Data Quality:**
- Require minimum reflection length
- Detect copy-paste from AI
- Track time spent on each video

### **User Experience:**
- Save partial work (auto-save reflection text)
- Clear instructions on dashboard
- Mobile-friendly design

---

**This plan transforms the single-task system into a flexible, multi-video longitudinal study! 🎓**

