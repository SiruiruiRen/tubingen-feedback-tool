# Event Logging System - User Behavior Analysis Guide

## Overview

The Tübingen Teacher Feedback Tool now uses a clean, event-driven logging system to track detailed user behavior patterns. This system captures meaningful interactions and provides clear insights into how participants engage with the feedback tool.

## Database Schema

### 1. Main Tables

#### `reflections` (Clean Core Data)
- **id**: Primary key
- **session_id**: Unique session identifier
- **participant_name**: User's name
- **video_id**: Selected video identifier
- **language**: 'en' or 'de'
- **reflection_text**: The actual reflection content
- **analysis_percentages**: JSON with distribution percentages
- **weakest_component**: Identified weakest area
- **feedback_extended**: Generated extended feedback
- **feedback_short**: Generated short feedback
- **revision_number**: 1 for original, 2+ for revisions
- **parent_reflection_id**: Links to original reflection for revisions
- **capabilities_rating**: UMUX-Lite rating (1-5)
- **ease_rating**: UMUX-Lite rating (1-5)
- **umux_score**: Calculated UMUX score
- **created_at**: Timestamp
- **rated_at**: Rating submission timestamp

#### `user_events` (Detailed Interaction Log)
- **id**: Primary key
- **session_id**: Links to session
- **reflection_id**: Links to specific reflection
- **event_type**: Type of interaction (see Event Types below)
- **timestamp_utc**: Precise timestamp
- **event_data**: JSON with event-specific details
- **user_agent**: Browser information
- **language**: Interface language at time of event

### 2. Event Types

| Event Type | Description | Event Data |
|------------|-------------|------------|
| **session_start** | User starts a new session | `{user_agent, language, timestamp}` |
| **session_end** | User leaves/closes the application | `{session_duration, language}` |
| **submit_reflection** | First-time reflection submission | `{reflection_id, language, video_id, reflection_length, analysis_result}` |
| **resubmit_reflection** | Revised reflection submission | `{reflection_id, language, video_id, reflection_length, revision_number, parent_reflection_id, analysis_result}` |
| **select_feedback_style** | User switches between Extended/Short tabs | `{from_style, to_style, language, reflection_id}` |
| **view_feedback_start** | User begins viewing feedback | `{style, language, reflection_id}` |
| **view_feedback_end** | User stops viewing feedback | `{style, language, duration_seconds, reflection_id}` |
| **click_revise** | User clicks "Revise Reflection" button | `{from_style, language, reflection_id}` |
| **submit_rating** | User submits UMUX ratings | `{reflection_id, capabilities_rating, ease_rating, umux_score, current_feedback_style, language}` |
| **expand_definitions** | User expands definition accordion | `{reflection_id, language}` |
| **copy_feedback** | User copies feedback to clipboard | `{style, language, reflection_id, text_length}` |

## Analysis Views

### 3. Pre-built Analysis Views

#### `reading_patterns`
Analyzes how long users spend reading different feedback styles:
```sql
SELECT * FROM reading_patterns 
WHERE session_id = 'your_session_id';
```

**Columns:**
- `session_id`, `reflection_id`, `participant_name`
- `revision_number`: Which version of reflection
- `feedback_style`: 'extended' or 'short'
- `feedback_language`: 'en' or 'de'
- `reading_duration_seconds`: Time spent reading
- `reading_pattern`: 'quick_scan', 'normal_read', or 'deep_read'

#### `revision_patterns`
Tracks revision behavior and changes:
```sql
SELECT * FROM revision_patterns 
WHERE session_id = 'your_session_id';
```

**Columns:**
- `session_id`, `participant_name`
- `original_reflection_id`, `revised_reflection_id`
- `revision_number`: 2, 3, 4, etc.
- `clicked_from_style`: Which feedback style triggered revision
- `original_length`, `revised_length`, `length_change`
- `original_analysis`, `revised_analysis`: JSON with percentages
- `description_change`, `explanation_change`, `prediction_change`

#### `participant_summary`
High-level participant engagement overview:
```sql
SELECT * FROM participant_summary 
WHERE session_id = 'your_session_id';
```

**Columns:**
- `session_id`, `participant_name`, `preferred_language`
- `total_submissions`, `original_submissions`, `revisions`
- `max_revision_number`: Highest revision reached
- `styles_viewed`, `languages_viewed`: Variety of engagement
- `avg_reading_duration`: Average time per feedback view
- `definitions_expanded`, `feedback_copied`: Interaction counts
- `umux_score`: Final satisfaction rating

## Research Questions & Queries

### 4. Key Research Questions

#### Q1: How long do users spend reading different feedback styles?
```sql
SELECT 
    feedback_style,
    feedback_language,
    AVG(reading_duration_seconds) as avg_duration,
    COUNT(*) as total_views
FROM reading_patterns 
GROUP BY feedback_style, feedback_language
ORDER BY avg_duration DESC;
```

#### Q2: What triggers users to revise their reflections?
```sql
SELECT 
    clicked_from_style,
    COUNT(*) as revision_count,
    AVG(length_change) as avg_text_change,
    AVG(description_change) as avg_description_change,
    AVG(explanation_change) as avg_explanation_change,
    AVG(prediction_change) as avg_prediction_change
FROM revision_patterns 
GROUP BY clicked_from_style;
```

#### Q3: How do reading patterns change after revision?
```sql
WITH pre_revision AS (
    SELECT session_id, AVG(reading_duration_seconds) as pre_duration
    FROM reading_patterns 
    WHERE revision_number = 1
    GROUP BY session_id
),
post_revision AS (
    SELECT session_id, AVG(reading_duration_seconds) as post_duration
    FROM reading_patterns 
    WHERE revision_number > 1
    GROUP BY session_id
)
SELECT 
    COUNT(*) as participants_who_revised,
    AVG(post_duration - pre_duration) as avg_duration_change
FROM pre_revision pr
JOIN post_revision po ON pr.session_id = po.session_id;
```

#### Q4: User engagement patterns and satisfaction
```sql
SELECT 
    participant_name,
    total_submissions,
    revisions,
    styles_viewed,
    languages_viewed,
    avg_reading_duration,
    definitions_expanded,
    feedback_copied,
    umux_score,
    CASE 
        WHEN umux_score >= 80 THEN 'High Satisfaction'
        WHEN umux_score >= 60 THEN 'Medium Satisfaction'
        ELSE 'Low Satisfaction'
    END as satisfaction_level
FROM participant_summary
ORDER BY umux_score DESC NULLS LAST;
```

#### Q5: Detailed interaction timeline for a specific user
```sql
SELECT 
    event_type,
    timestamp_utc,
    event_data,
    EXTRACT(EPOCH FROM (timestamp_utc - LAG(timestamp_utc) OVER (ORDER BY timestamp_utc))) as seconds_since_last_event
FROM user_events 
WHERE session_id = 'specific_session_id'
ORDER BY timestamp_utc;
```

## Usage Instructions

### 5. How to Use the System

1. **Run the Database Update:**
   ```bash
   # Execute the new schema
   psql -h your-supabase-host -U postgres -d postgres -f supabase-update.sql
   ```

2. **Deploy the Updated App:**
   - The app.js now automatically logs all events
   - No additional configuration needed
   - Events are logged in real-time as users interact

3. **Analyze the Data:**
   - Use the pre-built views for common analyses
   - Write custom queries for specific research questions
   - Export data for statistical analysis in R/Python

### 6. Data Export for Analysis

```sql
-- Export all participant data for statistical analysis
SELECT 
    ps.*,
    rp.reading_duration_seconds,
    rp.feedback_style,
    rp.reading_pattern
FROM participant_summary ps
LEFT JOIN reading_patterns rp ON ps.session_id = rp.session_id
ORDER BY ps.session_id, rp.feedback_style;

-- Export revision analysis data
SELECT * FROM revision_patterns 
ORDER BY session_id, revision_number;
```

## Benefits of This System

### 7. Advantages

1. **Clean Separation**: Core data vs. interaction logs
2. **Detailed Tracking**: Every meaningful interaction captured
3. **Flexible Analysis**: Pre-built views + custom queries
4. **Real-time Logging**: No data loss, immediate insights
5. **Research-Ready**: Structured for academic analysis
6. **Privacy-Conscious**: No unnecessary personal data
7. **Scalable**: Efficient indexing and querying

### 8. Research Insights Available

- **Reading Behavior**: Time spent on different feedback styles
- **Revision Patterns**: What triggers revisions and how content changes
- **Language Preferences**: EN vs DE usage patterns
- **Engagement Levels**: Deep vs surface-level interaction
- **Satisfaction Correlation**: How behavior relates to UMUX scores
- **Learning Progression**: How users improve through revisions
- **Interface Effectiveness**: Which features drive engagement

This system provides comprehensive insights into user behavior while maintaining clean, analyzable data structures perfect for educational research. 