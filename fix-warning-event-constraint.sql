-- Fix Database Constraint to Allow revision_warning_shown Events
-- This script adds the missing event type to the database constraint

-- Drop the existing constraint
ALTER TABLE user_events DROP CONSTRAINT IF EXISTS valid_event_types;

-- Add the new constraint with revision_warning_shown included
ALTER TABLE user_events ADD CONSTRAINT valid_event_types CHECK (
    event_type IN (
        'submit_reflection',
        'resubmit_reflection',
        'resubmit_same_text',
        'select_feedback_style',
        'view_feedback_start',
        'view_feedback_end',
        'click_revise',
        'revision_warning_shown',
        'submit_rating',
        'learn_concepts_interaction',
        'copy_feedback',
        'session_start',
        'session_end'
    )
);

-- Verify the constraint was updated
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'valid_event_types';

-- Test query to check warning events after fix
SELECT COUNT(*) as warning_events_count
FROM user_events 
WHERE event_type = 'revision_warning_shown'; 