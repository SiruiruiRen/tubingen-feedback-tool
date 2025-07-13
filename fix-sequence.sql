-- Fix reflections_id_seq to avoid duplicate key errors
SELECT setval(
    pg_get_serial_sequence('reflections', 'id'),
    (SELECT COALESCE(MAX(id), 0) FROM reflections) + 1,
    false
);

-- Verify
SELECT currval(pg_get_serial_sequence('reflections', 'id')) AS current_sequence_value; 