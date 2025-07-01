# Event Logging System - User Behavior Analysis Guide

## Overview

The Tübingen Teacher Feedback Tool uses an event-driven logging system to track detailed user behavior patterns for educational research.

## Database Schema

### Main Tables

#### `reflections` - Core reflection data
- **id**, **session_id**, **participant_name**, **video_id**, **language**
- **reflection_text**, **analysis_percentages**, **weakest_component**
- **feedback_extended**, **feedback_short**
- **revision_number** (1=original, 2+=revision), **parent_reflection_id**
- **capabilities_rating**, **ease_rating**, **umux_score**
- **created_at**, **rated_at**

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
-- Basic revision statistics
SELECT 
    participant_name,
    COUNT(*) as total_submissions,
    COUNT(*) - 1 as revisions_made,
    MAX(revision_number) as highest_revision,
    video_id,
    language
FROM reflections 
GROUP BY participant_name, video_id, language
HAVING COUNT(*) > 1
ORDER BY revisions_made DESC;
```

**Column Explanations:**
- `participant_name`: User's name as entered in the system
- `total_submissions`: Total number of reflections submitted (original + all revisions)
  - Example: If user submitted original, then revised twice = 3 total submissions
- `revisions_made`: Number of times user revised their reflection (total_submissions - 1)
  - Example: 3 total submissions = 2 revisions made
- `highest_revision`: The highest revision number reached
  - 1 = original submission only, 2 = revised once, 3 = revised twice, etc.
- `video_id`: Which video the user analyzed
- `language`: Interface language used ('en' or 'de')

**Note:** This query only shows users who made at least one revision (HAVING COUNT(*) > 1)

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