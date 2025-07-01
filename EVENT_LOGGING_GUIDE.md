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

## Quick Analysis Commands

### Most Active Users
```sql
SELECT participant_name, COUNT(*) as activities 
FROM user_events 
GROUP BY participant_name 
ORDER BY activities DESC LIMIT 10;
```

### Recent Activity
```sql
SELECT event_type, COUNT(*) as count 
FROM user_events 
WHERE timestamp_utc > NOW() - INTERVAL '24 hours'
GROUP BY event_type 
ORDER BY count DESC;
```

### Warning Problem Users
```sql
SELECT DISTINCT (event_data->>'participant_name')::text as participant_name
FROM user_events 
WHERE event_type = 'revision_warning_shown' 
AND (event_data->>'warning_count')::int >= 3;
``` 