# INFER 4-Video Experiment Version

## 🎯 What This Version Does

This is an enhanced version of INFER designed for a **longitudinal 4-video experiment** over **2.5 weeks**.

### **Key Features:**

✅ **4 Video Tasks** - Students complete 4 different teaching video analyses  
✅ **Progress Tracking** - Pseudonym-based resume system  
✅ **Flexible Scheduling** - Complete videos in any order, over multiple sessions  
✅ **6 Qualtrics Surveys** - Pre, 4 post-video, and final post-survey  
✅ **Percentage Explanation** - Clear explanation of why scores exceed 100%  
✅ **Tab-Switching Detection** - AI usage detection and logging  

---

## 📊 Study Flow

```
Visit 1:
  → Enter Pseudonym (e.g., A0895)
  → Pre-Survey (Qualtrics)
  → Dashboard: Choose from 4 videos
  → Complete Video 1 → Post-Video 1 Questionnaire
  → Return to Dashboard
  → (Optional: Continue with more videos)

Visit 2 (days later):
  → Enter Same Pseudonym (A0895)
  → System Loads Progress: "2/4 videos complete"
  → Dashboard: Shows completed + remaining videos
  → Complete Video 3 → Post-Video 3 Questionnaire
  → Return to Dashboard

After All 4 Videos:
  → Dashboard: "All Complete! 4/4"
  → Post-Survey (Qualtrics)
  → Thank You Page
```

---

## 🗄️ Database Tables

### **1. participant_progress**
Tracks which videos each participant has completed
- participant_name (pseudonym code)
- assigned_condition (control/experimental)
- videos_completed (array: ['spider', 'butterfly', ...])
- survey completion flags

### **2. reflections** (extended)
Stores reflection data for each video
- Links to participant_name
- Links to video_id
- Stores analysis percentages (raw + priority)

### **3. user_events** (extended)
Logs all interactions including:
- Tab switching (tab_hidden, tab_visible)
- AI usage responses
- Progress loads
- Video selections

---

## 🎨 New Interface Components

### **1. Login/Resume Page**
- Input: Pseudonym code
- Auto-detects: New vs Returning
- Loads: Previous progress for returning users

### **2. Video Dashboard**
- Grid: 4 video cards
- Status: ✓ Complete / → Available / 🔒 Locked
- Progress: "2/4 Videos Completed"

### **3. Percentage Explanation**
- Shows: RAW percentages (can exceed 100%)
- Explains: Why multiple components per passage
- Displays: Both RAW and adjusted (100%) totals

---

## 🚀 Implementation Status

**Current Step:** Setting up new version  
**Folder:** `/Users/sirui/Desktop/tubigen/infer-4video-version/`  
**Base:** Copied from working `infer-task-survey-version`  

**Next Steps:**
1. Create database schema SQL
2. Build login/resume page
3. Build video dashboard
4. Integrate progress tracking
5. Add percentage explanation
6. Test complete flow

---

## 📝 Files in This Folder

- `index.html` - Main HTML (will be modified)
- `app.js` - JavaScript logic (will be modified)
- `styles.css` - Styling
- `University-of-Tubingen-01.png` - Logo
- `UNC_logo.avif` - Logo
- `START_HERE.md` - This file

---

**Ready to implement step by step!** 🎓

