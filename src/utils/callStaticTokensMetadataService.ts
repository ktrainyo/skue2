import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Supabase client setup
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Proxy server URL
const BASE_API_URL = 'http://192.168.50.226:3011/callstaticrpc/pumpfun/v1/token/metadata';
const API_KEY = import.meta.env.VITE_CALLSTATICRPC_API_KEY;

/**
 * Fetch data for a specific token and insert it into Supabase.
 * @param tokenAddress - The token address to fetch metadata for.
 * @returns The result of the Supabase operation.
 */
export const fetchAndInsertTokenMetadata = async (tokenAddress: string): Promise<any> => {
  if (!tokenAddress || typeof tokenAddress !== 'string' || !tokenAddress.trim()) {
    throw new Error('Invalid token address');
  }

  try {
    // Construct the API request URL
    const requestUrl = `${BASE_API_URL}?token=${tokenAddress.trim()}`;
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    };

    // Log the API request details
    console.log(`[SERVICE] Making API request to: ${requestUrl}`);
    console.log(`[SERVICE] Request Headers:`, headers);

    // Make the API request
    const response = await axios.get(requestUrl, { headers });

    // Log the API response details
    console.log(`[SERVICE] API Request URL:`, response.config.url);
    console.log(`[SERVICE] API Response Status: ${response.status}`);
    console.log(`[SERVICE] API Response Data:`, response.data);

    // Extract and validate API data
    const apiData = response.data.data;

    if (!response.data.success || !apiData) {
      throw new Error('API call unsuccessful or data is missing.');
    }

    // Map API response to Supabase table schema
    const supabaseData = {
      token: apiData.mint, // Primary key
      id: apiData.id,
      deployer: apiData.deployer || null,
      deploy_timestamp: apiData.deploy_timestamp || null,
      mint: apiData.mint || null,
      name: apiData.name || null,
      symbol: apiData.symbol || null,
      decimals: apiData.decimals || null,
      initial_supply: apiData.initial_supply || null,
      total_supply: apiData.total_supply || null,
      description: apiData.description || null,
      mint_authority: apiData.mint_authority || null,
      freeze_authority: apiData.freeze_authority || null,
      twitter: apiData.twitter || null,
      telegram: apiData.telegram || null,
      website: apiData.website || null,
      uri: apiData.uri || null,
      image_uri: apiData.image_uri || null,
      is_complete: apiData.is_complete || null,
      complete_timestamp: apiData.complete_timestamp || null,
      timestamp: Date.now(), // Current timestamp
    };

    // Log the data being sent to Supabase
    console.log(`[SERVICE] Data to upsert into Supabase:`, supabaseData);

    // Insert or update the data in Supabase
    const { data, error } = await supabase
      .from('call_static_tokens_metadata')
      .upsert(supabaseData);

    if (error) {
      console.error(`[SERVICE] Supabase Error:`, error.message);
      throw error;
    }

    console.log(`[SERVICE] Supabase Insert/Update Success:`, data);
    return data;
  } catch (error) {
    console.error(`[SERVICE] Error fetching or inserting token metadata:`, error.message);
    throw error;
  }
};
