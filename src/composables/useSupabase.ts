// src/composables/useSupabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ensure the correct environment variables are used
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('supabaseUrl and supabaseKey are required.');
}

let supabaseInstance: SupabaseClient | undefined;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      db: {
        schema: 'public'
      },
      // Add debug mode
      debug: true
    });

    // Log all queries
    supabaseInstance.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Database change:', payload);
        }
      )
      .subscribe();
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

// Ensure all references to 'mint_address' are updated
export async function fetchTokenByMintAddress(mintAddress: string) {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('mint', mintAddress); // Updated column name

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
