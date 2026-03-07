import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const userId = '7039492d-1e06-46dc-9d28-d8d5f9969080';
  const { data, error } = await supabase.from('user_states').update({ current_stage: 'CompletedDay1' }).eq('user_id', userId);
  console.log('Result:', data, 'Error:', error);
}

test();
