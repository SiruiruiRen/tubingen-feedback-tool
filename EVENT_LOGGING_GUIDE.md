# Event Logging System - User Behavior Analysis Guide

## Overview

The Tübingen Teacher Feedback Tool uses an event-driven logging system to track detailed user behavior patterns for educational research.

## Database Schema

### ⚠️ Important: Database Update Required

If you get errors like `"column parent_reflection_id does not exist"`, your database needs to be updated:

```sql
-- Run this to update your database schema:
-- Option 1: Safe migration (preserves existing data)
\i supabase-safe-migration.sql

-- Option 2: Fresh start (if no important data to preserve)  
\i supabase-update.sql
```

### Main Tables

#### `reflections` - Core reflection data
- **id**, **session_id**, **participant_name**, **video_id**, **language**
- **reflection_text** (user's written reflection), **analysis_percentages**, **weakest_component**
- **feedback_extended**, **feedback_short**
- **revision_number** (1=original, 2+=revision), **parent_reflection_id**
- **capabilities_rating**, **ease_rating**, **umux_score**
- **created_at**, **rated_at**

**Note:** `reflection_length` in queries = `LENGTH(reflection_text)` = number of characters in the reflection

#### `user_events` - Detailed interaction log
- **id**, **session_id**, **reflection_id**, **event_type**, **timestamp_utc**
- **event_data** (JSON), **user_agent**, **language**

### Event Types
| Event Type | Description |
|------------|-------------|
| `submit_reflection` | First-time reflection submission |
| `resubmit_reflection` | Revised reflection submission |
| `resubmit_same_text` | User clicked revise but submitted identical text |
| `click_revise` | User clicks "Revise Reflection" button |
| `revision_warning_shown` | Warning shown for submitting same text after revise |
| `view_feedback_start/end` | Feedback reading time tracking |
| `select_feedback_style` | Switch between Extended/Short tabs |
| `copy_feedback` | Copy feedback to clipboard |
| `submit_rating` | UMUX rating submission |

## Research Queries

### RQ1: Revision Patterns - Who revises and how much?

```sql
-- Basic revision statistics (fixed redundancy)
SELECT 
    participant_name,
    video_id,
    language,
    COUNT(*) as total_submissions,
    MAX(revision_number) as highest_revision_reached,
    COUNT(*) - 1 as total_revisions_made,
    MIN(created_at) as first_submission_time,
    MAX(created_at) as last_submission_time,
    EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at)))/60 as total_revision_time_minutes
FROM reflections 
GROUP BY participant_name, video_id, language
ORDER BY total_revisions_made DESC, highest_revision_reached DESC;
```

**Column Explanations:**
- `participant_name`: User's name as entered in the system
- `video_id`: Which video the user analyzed
- `language`: Interface language used ('en' or 'de')
- `total_submissions`: Total number of reflections submitted (original + all revisions)
- `highest_revision_reached`: The highest revision number reached (1, 2, 3, etc.)
- `total_revisions_made`: Number of times user revised (always = total_submissions - 1)
- `first_submission_time`: When user submitted their original reflection
- `last_submission_time`: When user submitted their final revision
- `total_revision_time_minutes`: Total time spent on revision process (from first to last submission)

**Note:** Shows all users, including those with no revisions (total_revisions_made = 0)

### RQ2: Reading Time Analysis - How long do users spend reading feedback?

```sql
-- Reading duration by feedback style
SELECT 
    (event_data->>'style')::text as feedback_style,
    (event_data->>'language')::text as language,
    AVG((event_data->>'duration_seconds')::numeric) as avg_reading_seconds,
    COUNT(*) as total_readings,
    MIN((event_data->>'duration_seconds')::numeric) as min_seconds,
    MAX((event_data->>'duration_seconds')::numeric) as max_seconds
FROM user_events 
WHERE event_type = 'view_feedback_end'
GROUP BY event_data->>'style', event_data->>'language'
ORDER BY avg_reading_seconds DESC;
```

**Column Explanations:**
- `feedback_style`: Type of feedback viewed ('extended' or 'short')
  - 'extended' = detailed academic feedback with theory references
  - 'short' = concise, user-friendly feedback with practical tips
- `language`: Language of the feedback content ('en' or 'de')
- `avg_reading_seconds`: Average time users spent reading this feedback type
  - Calculated from when user starts viewing until they switch tabs or leave
- `total_readings`: Number of times this feedback type was viewed
  - Same user can contribute multiple readings if they switch tabs
- `min_seconds`: Shortest reading time recorded (may indicate quick scanning)
- `max_seconds`: Longest reading time recorded (may indicate deep reading)

**Research Insight:** Compare extended vs short feedback reading times to understand user preferences

### RQ2B: Feedback-to-Revision Analysis - How feedback leads to revisions

```sql
-- Time between reading feedback and clicking revise
WITH feedback_reading AS (
    SELECT 
        session_id,
        reflection_id,
        (event_data->>'style')::text as feedback_style,
        (event_data->>'language')::text as language,
        timestamp_utc as feedback_end_time,
        (event_data->>'duration_seconds')::numeric as reading_duration
    FROM user_events 
    WHERE event_type = 'view_feedback_end'
),
revise_clicks AS (
    SELECT 
        session_id,
        reflection_id,
        (event_data->>'from_style')::text as clicked_from_style,
        timestamp_utc as revise_click_time,
        (event_data->>'current_reflection_length')::numeric as reflection_length
    FROM user_events 
    WHERE event_type = 'click_revise'
)
SELECT 
    fr.session_id,
    fr.reflection_id,
    fr.feedback_style,
    fr.language,
    fr.reading_duration,
    rc.clicked_from_style,
    rc.reflection_length,
    EXTRACT(EPOCH FROM (rc.revise_click_time - fr.feedback_end_time))/60 as minutes_from_reading_to_revise,
    CASE 
        WHEN EXTRACT(EPOCH FROM (rc.revise_click_time - fr.feedback_end_time)) < 60 THEN 'Immediate (<1min)'
        WHEN EXTRACT(EPOCH FROM (rc.revise_click_time - fr.feedback_end_time)) < 300 THEN 'Quick (1-5min)'
        WHEN EXTRACT(EPOCH FROM (rc.revise_click_time - fr.feedback_end_time)) < 900 THEN 'Considered (5-15min)'
        ELSE 'Delayed (>15min)'
    END as revision_timing_pattern
FROM feedback_reading fr
JOIN revise_clicks rc ON fr.session_id = rc.session_id 
    AND fr.reflection_id = rc.reflection_id
    AND fr.feedback_style = rc.clicked_from_style
WHERE rc.revise_click_time > fr.feedback_end_time
ORDER BY minutes_from_reading_to_revise;
```

**Column Explanations:**
- `feedback_style`: Which feedback type user read before revising
- `reading_duration`: How long user spent reading that feedback (in seconds)
- `minutes_from_reading_to_revise`: Time gap between finishing reading and clicking revise
- `revision_timing_pattern`: Categorized timing behavior
  - 'Immediate' = revised within 1 minute of reading
  - 'Quick' = revised within 1-5 minutes
  - 'Considered' = revised within 5-15 minutes  
  - 'Delayed' = revised after 15+ minutes
- `reflection_length`: Number of characters in the reflection text when user decided to revise

**Research Insight:** Shows which feedback style motivates faster revision and how reading time correlates with revision decisions

### RQ3: Warning Patterns - Users who struggle with revisions

```sql
-- Users who get multiple warnings for submitting same text
SELECT 
    (event_data->>'participant_name')::text as participant_name,
    (event_data->>'video_id')::text as video_id,
    COUNT(*) as total_warnings,
    MAX((event_data->>'warning_count')::int) as max_consecutive_warnings,
    AVG((event_data->>'time_since_revise_click')::numeric / 1000.0) as avg_seconds_thinking
FROM user_events 
WHERE event_type = 'revision_warning_shown'
GROUP BY event_data->>'participant_name', event_data->>'video_id'
ORDER BY total_warnings DESC, max_consecutive_warnings DESC;
```

**Column Explanations:**
- `participant_name`: User who received the warnings
- `video_id`: Which video analysis triggered the warnings
- `total_warnings`: Total number of times this user got the "no changes" warning
  - Each time = user clicked "Revise" but submitted identical text
- `max_consecutive_warnings`: Highest consecutive warning count in a single session
  - Example: User gets warning 3 times in a row before finally making changes
- `avg_seconds_thinking`: Average time between clicking "Revise" and getting warning
  - Shows how long user spent "thinking" before submitting same text again
  - Converted from milliseconds to seconds for readability

**Research Insight:** Identifies users who struggle with the revision process and may need additional guidance

### RQ3B: Concept Usage in Revision Process

```sql
-- Do users check concepts before/during revision?
WITH concept_interactions AS (
    SELECT 
        session_id,
        reflection_id,
        timestamp_utc as concept_time,
        (event_data->>'action')::text as concept_action,
        (event_data->>'has_reflection_text')::boolean as had_text,
        (event_data->>'has_generated_feedback')::boolean as had_feedback
    FROM user_events 
    WHERE event_type = 'learn_concepts_interaction'
),
revise_attempts AS (
    SELECT 
        session_id,
        reflection_id,
        timestamp_utc as revise_time,
        (event_data->>'from_style')::text as from_style
    FROM user_events 
    WHERE event_type = 'click_revise'
),
successful_revisions AS (
    SELECT 
        ue.session_id,
        (ue.event_data->>'parent_reflection_id')::integer as parent_reflection_id,
        ue.timestamp_utc as revision_submit_time,
        (ue.event_data->>'revision_number')::integer as revision_number
    FROM user_events ue
    WHERE ue.event_type = 'resubmit_reflection'
)
SELECT 
    ra.session_id,
    ra.reflection_id,
    ra.from_style,
    COUNT(ci.concept_time) as concept_checks_before_revise,
    COUNT(CASE WHEN ci.concept_action = 'expand' THEN 1 END) as concept_expansions,
    MIN(CASE WHEN ci.concept_time < ra.revise_time 
        THEN EXTRACT(EPOCH FROM (ra.revise_time - ci.concept_time))/60 END) as minutes_since_last_concept_check,
    CASE WHEN sr.revision_submit_time IS NOT NULL THEN 'Successful' ELSE 'Abandoned' END as revision_outcome,
    CASE WHEN COUNT(ci.concept_time) > 0 THEN 'Used Concepts' ELSE 'No Concepts' END as concept_usage_pattern
FROM revise_attempts ra
LEFT JOIN concept_interactions ci ON ra.session_id = ci.session_id 
    AND ci.concept_time BETWEEN ra.revise_time - INTERVAL '30 minutes' AND ra.revise_time
LEFT JOIN successful_revisions sr ON ra.session_id = sr.session_id 
    AND ra.reflection_id = sr.parent_reflection_id
GROUP BY ra.session_id, ra.reflection_id, ra.from_style, sr.revision_submit_time
ORDER BY concept_checks_before_revise DESC;
```

**Column Explanations:**
- `from_style`: Which feedback style triggered the revision attempt
- `concept_checks_before_revise`: Number of times user clicked "Learn Key Concepts" in 30min before revising
- `concept_expansions`: How many times user expanded the concept definitions
- `minutes_since_last_concept_check`: Time between last concept check and clicking revise
- `revision_outcome`: Whether user successfully submitted a revision or abandoned it
- `concept_usage_pattern`: Whether user consulted concepts before revising

**Research Insight:** Shows correlation between concept usage and successful revisions

### RQ4: Feedback Style Preferences - Extended vs Short usage

```sql
-- Which feedback style triggers more revisions?
SELECT 
    (event_data->>'from_style')::text as feedback_style_viewed,
    COUNT(*) as revise_clicks_from_this_style,
    AVG((event_data->>'current_reflection_length')::numeric) as avg_reflection_length
FROM user_events 
WHERE event_type = 'click_revise'
GROUP BY event_data->>'from_style'
ORDER BY revise_clicks_from_this_style DESC;
```

**Column Explanations:**
- `feedback_style_viewed`: Which feedback style the user was viewing when they clicked "Revise"
  - 'extended' = user was reading detailed academic feedback
  - 'short' = user was reading concise practical feedback
- `revise_clicks_from_this_style`: Number of times users clicked "Revise" while viewing this style
  - Shows which feedback type motivates more revision attempts
- `avg_reflection_length`: Average length (characters) of reflections when users clicked revise
  - Helps understand if longer/shorter reflections are more likely to be revised

**Research Insight:** Determines which feedback style is more effective at motivating users to improve their reflections

### RQ4B: Complete Revision Journey Analysis

```sql
-- Comprehensive revision behavior including warnings, time spent, and outcomes
-- NOTE: If you get "parent_reflection_id does not exist" error, run the migration script first
WITH revision_journey AS (
    SELECT 
        r.session_id,
        r.participant_name,
        r.video_id,
        r.language,
        COALESCE(r.revision_number, 1) as revision_number,
        r.parent_reflection_id,
        r.created_at as submission_time,
        LENGTH(r.reflection_text) as reflection_length,
        r.analysis_percentages,
        -- Get time spent on this revision
        LAG(r.created_at) OVER (PARTITION BY r.session_id ORDER BY COALESCE(r.revision_number, 1)) as previous_submission_time,
        -- Get warnings for this revision attempt
        (SELECT COUNT(*) FROM user_events ue 
         WHERE ue.session_id = r.session_id 
         AND ue.event_type = 'revision_warning_shown'
         AND ue.timestamp_utc BETWEEN COALESCE(
             LAG(r.created_at) OVER (PARTITION BY r.session_id ORDER BY r.revision_number), 
             r.created_at - INTERVAL '1 hour'
         ) AND r.created_at
        ) as warnings_during_revision,
        -- Get concept interactions during revision
        (SELECT COUNT(*) FROM user_events ue 
         WHERE ue.session_id = r.session_id 
         AND ue.event_type = 'learn_concepts_interaction'
         AND ue.timestamp_utc BETWEEN COALESCE(
             LAG(r.created_at) OVER (PARTITION BY r.session_id ORDER BY r.revision_number), 
             r.created_at - INTERVAL '1 hour'
         ) AND r.created_at
        ) as concept_checks_during_revision,
        -- Get feedback reading time before this revision
        (SELECT SUM((event_data->>'duration_seconds')::numeric) FROM user_events ue 
         WHERE ue.session_id = r.session_id 
         AND ue.event_type = 'view_feedback_end'
         AND ue.timestamp_utc BETWEEN COALESCE(
             LAG(r.created_at) OVER (PARTITION BY r.session_id ORDER BY r.revision_number), 
             r.created_at - INTERVAL '1 hour'
         ) AND r.created_at
        ) as total_feedback_reading_seconds
    FROM reflections r
)
SELECT 
    session_id,
    participant_name,
    video_id,
    language,
    revision_number,
    CASE 
        WHEN revision_number = 1 THEN 'Original'
        ELSE CONCAT('Revision ', revision_number - 1)
    END as submission_type,
    reflection_length,
    CASE 
        WHEN previous_submission_time IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (submission_time - previous_submission_time))/60 
        ELSE NULL 
    END as minutes_spent_revising,
    warnings_during_revision,
    concept_checks_during_revision,
    COALESCE(total_feedback_reading_seconds, 0) as feedback_reading_seconds,
    CASE 
        WHEN warnings_during_revision > 0 AND concept_checks_during_revision > 0 THEN 'Struggled + Used Help'
        WHEN warnings_during_revision > 0 THEN 'Struggled'
        WHEN concept_checks_during_revision > 0 THEN 'Used Help'
        ELSE 'Smooth Process'
    END as revision_pattern,
    -- Analysis of content changes
    CASE 
        WHEN revision_number > 1 THEN 
            (analysis_percentages->>'description')::numeric - 
            LAG((analysis_percentages->>'description')::numeric) OVER (PARTITION BY session_id ORDER BY revision_number)
        ELSE NULL 
    END as description_change,
    CASE 
        WHEN revision_number > 1 THEN 
            (analysis_percentages->>'explanation')::numeric - 
            LAG((analysis_percentages->>'explanation')::numeric) OVER (PARTITION BY session_id ORDER BY revision_number)
        ELSE NULL 
    END as explanation_change,
    CASE 
        WHEN revision_number > 1 THEN 
            (analysis_percentages->>'prediction')::numeric - 
            LAG((analysis_percentages->>'prediction')::numeric) OVER (PARTITION BY session_id ORDER BY revision_number)
        ELSE NULL 
    END as prediction_change
FROM revision_journey
ORDER BY session_id, revision_number;
```

**Column Explanations:**
- `submission_type`: 'Original' or 'Revision 1', 'Revision 2', etc.
- `minutes_spent_revising`: Time between previous submission and this one
- `warnings_during_revision`: Number of "no changes" warnings received during this revision
- `concept_checks_during_revision`: Times user checked concept definitions during revision
- `feedback_reading_seconds`: Total time spent reading feedback before this revision
- `revision_pattern`: Categorized revision behavior
  - 'Smooth Process' = no warnings, no concept checks needed
  - 'Used Help' = checked concepts but no warnings
  - 'Struggled' = got warnings but didn't check concepts
  - 'Struggled + Used Help' = got warnings and checked concepts
- `description_change`, `explanation_change`, `prediction_change`: How percentages changed from previous version

**Research Insight:** Complete picture of revision behavior including struggle indicators and learning resource usage

### RQ4C: Simplified Revision Analysis (Database-Compatible)

```sql
-- Simpler version that works with current database schema
SELECT 
    r.session_id,
    r.participant_name,
    r.video_id,
    r.language,
    r.reflection_text,
    LENGTH(r.reflection_text) as reflection_length,
    r.created_at as submission_time,
    
    -- Count warnings for this user/session
    (SELECT COUNT(*) 
     FROM user_events ue 
     WHERE ue.session_id = r.session_id 
     AND ue.event_type = 'revision_warning_shown'
    ) as total_warnings_received,
    
    -- Count concept interactions for this user/session  
    (SELECT COUNT(*) 
     FROM user_events ue 
     WHERE ue.session_id = r.session_id 
     AND ue.event_type = 'learn_concepts_interaction'
    ) as total_concept_interactions,
    
    -- Count revise clicks for this user/session
    (SELECT COUNT(*) 
     FROM user_events ue 
     WHERE ue.session_id = r.session_id 
     AND ue.event_type = 'click_revise'
    ) as total_revise_clicks,
    
    -- Total feedback reading time for this user/session
    (SELECT SUM((event_data->>'duration_seconds')::numeric) 
     FROM user_events ue 
     WHERE ue.session_id = r.session_id 
     AND ue.event_type = 'view_feedback_end'
    ) as total_feedback_reading_seconds,
    
    -- Categorize user behavior
    CASE 
        WHEN (SELECT COUNT(*) FROM user_events ue WHERE ue.session_id = r.session_id AND ue.event_type = 'revision_warning_shown') > 0 
         AND (SELECT COUNT(*) FROM user_events ue WHERE ue.session_id = r.session_id AND ue.event_type = 'learn_concepts_interaction') > 0 
        THEN 'Struggled + Used Help'
        WHEN (SELECT COUNT(*) FROM user_events ue WHERE ue.session_id = r.session_id AND ue.event_type = 'revision_warning_shown') > 0 
        THEN 'Struggled'
        WHEN (SELECT COUNT(*) FROM user_events ue WHERE ue.session_id = r.session_id AND ue.event_type = 'learn_concepts_interaction') > 0 
        THEN 'Used Help'
        ELSE 'Smooth Process'
    END as user_behavior_pattern
    
FROM reflections r
ORDER BY total_warnings_received DESC, total_concept_interactions DESC;
```

**Column Explanations:**
- `reflection_length`: Number of characters in the reflection text
- `total_warnings_received`: How many "no changes" warnings this user got across all attempts
- `total_concept_interactions`: How many times user clicked "Learn Key Concepts"
- `total_revise_clicks`: How many times user clicked "Revise Reflection" button
- `total_feedback_reading_seconds`: Total time spent reading feedback (all sessions combined)
- `user_behavior_pattern`: Overall behavior classification for this user

**Research Insight:** Simplified analysis that works with any database schema and shows overall user patterns

### RQ5: User Engagement Levels - Complete participation analysis

```sql
-- Comprehensive user engagement summary
WITH user_stats AS (
    SELECT 
        r.participant_name,
        r.video_id,
        r.language,
        COUNT(*) as total_reflections,
        MAX(r.revision_number) as max_revision,
        AVG(LENGTH(r.reflection_text)) as avg_reflection_length,
        MAX(r.umux_score) as final_umux_score,
        COUNT(CASE WHEN ue.event_type = 'copy_feedback' THEN 1 END) as feedback_copies,
        COUNT(CASE WHEN ue.event_type = 'learn_concepts_interaction' THEN 1 END) as concept_interactions
    FROM reflections r
    LEFT JOIN user_events ue ON r.session_id = ue.session_id
    GROUP BY r.participant_name, r.video_id, r.language, r.session_id
)
SELECT 
    participant_name,
    video_id,
    language,
    total_reflections,
    max_revision,
    ROUND(avg_reflection_length) as avg_text_length,
    final_umux_score,
    feedback_copies,
    concept_interactions,
    CASE 
        WHEN max_revision > 2 THEN 'High Engagement'
        WHEN max_revision = 2 THEN 'Medium Engagement' 
        ELSE 'Single Submission'
    END as engagement_level
FROM user_stats
ORDER BY max_revision DESC, total_reflections DESC;
```

**Column Explanations:**
- `participant_name`: User identifier
- `video_id`: Which video was analyzed
- `language`: Interface language used
- `total_reflections`: Number of reflection submissions (original + revisions)
- `max_revision`: Highest revision number reached (1=original only, 2=revised once, etc.)
- `avg_text_length`: Average number of characters in user's reflections
- `final_umux_score`: User's final satisfaction rating (0-100 scale)
  - Based on UMUX-Lite questionnaire responses
- `feedback_copies`: Number of times user copied feedback to clipboard
  - Indicates intention to use/save the feedback
- `concept_interactions`: Number of times user clicked "Learn Key Concepts"
  - Shows engagement with educational definitions
- `engagement_level`: Categorized engagement based on revision behavior
  - 'High Engagement' = revised 2+ times (max_revision > 2)
  - 'Medium Engagement' = revised once (max_revision = 2)
  - 'Single Submission' = no revisions (max_revision = 1)

**Research Insight:** Comprehensive user engagement profile combining behavioral and satisfaction metrics

### RQ6: Time-based Analysis - User journey timing

```sql
-- Time between key events for each user
WITH user_timeline AS (
    SELECT 
        session_id,
        event_type,
        timestamp_utc,
        LAG(timestamp_utc) OVER (PARTITION BY session_id ORDER BY timestamp_utc) as prev_timestamp
    FROM user_events 
    WHERE event_type IN ('submit_reflection', 'click_revise', 'resubmit_reflection', 'revision_warning_shown')
)
SELECT 
    session_id,
    event_type,
    timestamp_utc,
    CASE 
        WHEN prev_timestamp IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (timestamp_utc - prev_timestamp))
        ELSE NULL 
    END as seconds_since_previous_event
FROM user_timeline
ORDER BY session_id, timestamp_utc;
```

**Column Explanations:**
- `session_id`: Unique identifier for each user session
- `event_type`: Type of action performed
  - 'submit_reflection' = original reflection submitted
  - 'click_revise' = user clicked "Revise Reflection" button
  - 'resubmit_reflection' = revised reflection submitted
  - 'revision_warning_shown' = warning displayed for submitting same text
- `timestamp_utc`: Exact time when event occurred (UTC timezone)
- `seconds_since_previous_event`: Time elapsed since the previous action
  - NULL for first event in session
  - Shows pacing of user interactions (quick vs deliberate)

**Research Insight:** Analyze user behavior patterns and identify bottlenecks in the revision process

### RQ7: Language and Video Analysis - Content impact

```sql
-- Performance by video and language
SELECT 
    video_id,
    language,
    COUNT(DISTINCT participant_name) as unique_participants,
    AVG(revision_number) as avg_revisions_per_user,
    AVG(umux_score) as avg_satisfaction,
    AVG(LENGTH(reflection_text)) as avg_reflection_length,
    COUNT(CASE WHEN revision_number > 1 THEN 1 END) as total_revisions
FROM reflections
GROUP BY video_id, language
ORDER BY avg_satisfaction DESC, avg_revisions_per_user DESC;
```

**Column Explanations:**
- `video_id`: Identifier for the teaching video analyzed
- `language`: Interface language ('en' = English, 'de' = German)
- `unique_participants`: Number of different users who analyzed this video
- `avg_revisions_per_user`: Average revision number across all users for this video
  - Higher values indicate video content that prompts more reflection revision
- `avg_satisfaction`: Average UMUX satisfaction score for this video/language combination
- `avg_reflection_length`: Average character count of reflections for this content
- `total_revisions`: Total number of revisions made across all users
  - Different from avg_revisions_per_user (this is absolute count)

**Research Insight:** Identifies which video content and language combinations are most engaging and satisfying for users

## Quick Analysis Commands

### Most Active Users
```sql
SELECT participant_name, COUNT(*) as activities 
FROM user_events 
GROUP BY participant_name 
ORDER BY activities DESC LIMIT 10;
```
**Shows:** Top 10 users by total number of logged interactions (clicks, submissions, etc.)

### Recent Activity
```sql
SELECT event_type, COUNT(*) as count 
FROM user_events 
WHERE timestamp_utc > NOW() - INTERVAL '24 hours'
GROUP BY event_type 
ORDER BY count DESC;
```
**Shows:** What types of actions happened in the last 24 hours, ordered by frequency

### Warning Problem Users
```sql
SELECT DISTINCT (event_data->>'participant_name')::text as participant_name
FROM user_events 
WHERE event_type = 'revision_warning_shown' 
AND (event_data->>'warning_count')::int >= 3;
```
**Shows:** Users who got 3+ consecutive warnings for submitting same text (may need help) 