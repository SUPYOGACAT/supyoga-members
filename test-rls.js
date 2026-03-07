import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('user_states').update({ current_stage: 'CompletedDay1' }).eq('user_id', '7039492d-1e06-46dc-9d28-d8d5f9969080');
  console.log('Update Data:', data, 'Error:', error);
}
check();
