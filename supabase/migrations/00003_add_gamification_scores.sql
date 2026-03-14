-- Add scoring columns to the reflections table for V2 Gamification profiling
alter table public.reflections
add column energy_score integer check (energy_score >= 1 and energy_score <= 5),
add column calm_score integer check (calm_score >= 1 and calm_score <= 5),
add column connection_score integer check (connection_score >= 1 and connection_score <= 5);
