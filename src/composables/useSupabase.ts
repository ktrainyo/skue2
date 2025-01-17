// src/composables/useSupabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('supabaseUrl and supabaseKey are required.');
}

import type { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | undefined;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();

export async function fetchMostRecentTokenData() {
  const { data, error } = await supabase
    .from('token_overview')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
