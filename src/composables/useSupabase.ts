// src/composables/useSupabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient

export function useSupabase(): SupabaseClient {
  if (!supabase) {
    // Read from .env (must be prefixed with VITE_ in a Vite project)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabase
}
