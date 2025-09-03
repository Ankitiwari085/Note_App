import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please click "Connect to Supabase" in the top right corner to set up your database connection.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);