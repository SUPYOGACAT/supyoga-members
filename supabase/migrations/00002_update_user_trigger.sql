-- Update the handle_new_user trigger to save the full_name from metadata into the name column of the users table
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');

  insert into public.user_states (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;
