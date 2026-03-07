-- Fix missing RLS Policy for user_states

-- Allow users to update their own state
create policy "Users can update own state" 
on public.user_states for update using (auth.uid() = user_id);
