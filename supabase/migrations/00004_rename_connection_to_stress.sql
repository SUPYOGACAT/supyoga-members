-- Rename connection_score to stress_score to match the new frontend logic
ALTER TABLE public.reflections 
RENAME COLUMN connection_score TO stress_score;
