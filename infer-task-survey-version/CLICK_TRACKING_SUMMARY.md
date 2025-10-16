# Complete Click Tracking Summary

## ✅ All Click Data Now Logged

### 1. **Feedback Tab Switching** 📊
- **Extended Tab Click:** `select_feedback_style` with `preferred_style: 'extended'`
- **Short Tab Click:** `select_feedback_style` with `preferred_style: 'short'`
- **Duration Tracking:** `view_feedback_start` → `view_feedback_end` with `duration_seconds`

### 2. **Key Concepts Interaction** 💡
- **Concept Card Click:** `learn_concepts_interaction`
- **Available on:** Both tasks (now just task1)
- **Data:** Task, language, timestamp

### 3. **Reading Duration Between Submissions** ⏱️
- **Start Reading:** `view_feedback_start` when tab is clicked
- **End Reading:** `view_feedback_end` when:
  - User clicks revise button
  - User switches tabs
  - User submits final reflection
  - Page unloads
- **Duration:** Calculated in seconds between start/end

### 4. **Complete Event Sequence** 🔄

```
1. session_start
2. page_view (video-intro)
3. consent_interaction (video checkbox)
4. navigation (video-intro → task1)
5. page_view (task1)
6. feedback_style_preference (initial choice)
7. submit_reflection
8. view_feedback_start (extended/short)
9. select_feedback_style (tab switches)
10. view_feedback_end (duration calculated)
11. learn_concepts_interaction (if clicked)
12. copy_feedback (if clicked)
13. click_revise (if clicked)
14. view_feedback_start (new session)
15. view_feedback_end (new duration)
16. final_submission
17. navigation (task1 → survey1)
18. page_view (survey1)
19. study_completed
20. session_end
```

### 5. **Reading Pattern Analysis** 📈

**What You Can Analyze:**
- **Total reading time per feedback style**
- **Time spent on each version (extended vs short)**
- **Reading patterns between revisions**
- **Concept usage patterns**
- **Tab switching behavior**

**Example Queries:**
```sql
-- Total reading time per participant
SELECT 
    session_id,
    SUM(duration_seconds) as total_reading_seconds,
    COUNT(*) as reading_sessions
FROM user_events 
WHERE event_type = 'view_feedback_end'
GROUP BY session_id;

-- Reading time by feedback style
SELECT 
    event_data->>'style' as feedback_style,
    AVG((event_data->>'duration_seconds')::numeric) as avg_seconds,
    COUNT(*) as sessions
FROM user_events 
WHERE event_type = 'view_feedback_end'
GROUP BY event_data->>'style';

-- Concept interaction patterns
SELECT 
    session_id,
    COUNT(*) as concept_clicks,
    MIN(timestamp_utc) as first_click,
    MAX(timestamp_utc) as last_click
FROM user_events 
WHERE event_type = 'learn_concepts_interaction'
GROUP BY session_id;
```

### 6. **Process Mining Data** 🔍

**Complete Digital Trace:**
- Every click logged with timestamp
- Reading durations between actions
- Tab switching patterns
- Concept usage
- Revision behavior
- Copy actions
- Navigation flow

**Perfect for BUPAR Analysis:**
- User behavior patterns
- Reading strategies
- Feedback preference analysis
- Learning process insights

---

## 🎯 Summary

**✅ NOW TRACKING:**
- ✅ Extended/Short tab clicks
- ✅ Reading duration for each version
- ✅ Concept card interactions
- ✅ Reading time between submissions
- ✅ Complete click sequence
- ✅ Process mining data

**Ready for comprehensive analysis!** 🚀
