import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

export const createApiService = (apiEndpoint: string, supabaseTable: string) => {
  return async (transformFn?: (data: any) => any) => {
    try {
      const { data: apiData } = await axios.get(apiEndpoint);

      const transformedData = transformFn ? transformFn(apiData) : apiData;

      const { data: supabaseData, error: supabaseError } = await supabase
        .from(supabaseTable)
        .upsert(transformedData);

      if (supabaseError) throw supabaseError;

      return supabaseData;
    } catch (error) {
      console.error(`Error in API Service (${apiEndpoint}):`, error);
      throw error;
    }
  };
};
