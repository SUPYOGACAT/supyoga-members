-- Enable uuid-ossp extension for UUID generation
create extension if not exists "uuid-ossp";

-- USERS TABLE (extends Supabase Auth auth.users)
-- We use a trigger to automatically populate this table when a new user signs up
create table public.users (
  id uuid references auth.users(id) on delete cascade not null primary key,
  name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  comms_locked_until timestamp with time zone -- For "Quiet Water" protocol
);

-- USER STATES (Single point of truth for journey progress)
create type journey_stage as enum (
  'NotStarted',
  'ActiveDay1', 'CompletedDay1',
  'ActiveDay2', 'CompletedDay2',
  'ActiveDay3', 'CompletedDay3',
  'ActiveDay4', 'CompletedDay4',
  'ActiveDay5', 'CompletedDay5',
  'ActiveDay6', 'CompletedDay6',
  'ActiveDay7', 'CompletedReset',
  'Inactive24h', 'Inactive48h',
  'AtRisk', 'ReturningUser',
  'Candidate', 'ActiveMember'
);

create table public.user_states (
  user_id uuid references public.users(id) on delete cascade not null primary key,
  current_stage journey_stage default 'NotStarted'::journey_stage not null,
  completed_days integer[] default array[]::integer[],
  water_drops integer default 0 not null,
  current_streak integer default 0 not null,
  last_interaction timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SESSION LOGS (Event Sourcing / Logging)
create table public.session_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  event_type text not null, -- e.g., 'VIDEO_COMPLETED', 'SESSION_START'
  duration_seconds integer,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REFLECTIONS
create type emotional_sentiment as enum ('calm', 'neutral', 'low_emotion');

create table public.reflections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  day integer not null,
  raw_text text,
  sentiment_flag emotional_sentiment,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS)
alter table public.users enable row level security;
alter table public.user_states enable row level security;
alter table public.session_logs enable row level security;
alter table public.reflections enable row level security;

-- RLS POLICIES
create policy "Users can view own profile" 
on public.users for select using (auth.uid() = id);

create policy "Users can update own profile" 
on public.users for update using (auth.uid() = id);

create policy "Users can view own state" 
on public.user_states for select using (auth.uid() = user_id);

create policy "Users can view own logs" 
on public.session_logs for select using (auth.uid() = user_id);

create policy "Users can insert own logs" 
on public.session_logs for insert with check (auth.uid() = user_id);

create policy "Users can view own reflections" 
on public.reflections for select using (auth.uid() = user_id);

create policy "Users can insert own reflections" 
on public.reflections for insert with check (auth.uid() = user_id);

-- TRIGGER TO CREATE USER PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);

  insert into public.user_states (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
