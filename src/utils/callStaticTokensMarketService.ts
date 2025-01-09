import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Supabase client setup
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Proxy server URL for token market data API
const BASE_API_URL = 'http://192.168.50.226:3011/callstaticrpc/pumpfun/v1/token/marketData';
const API_KEY = import.meta.env.VITE_CALLSTATICRPC_API_KEY;

/**
 * Fetch market data for a specific token and insert it into Supabase.
 * @param tokenAddress - The token address to fetch market data for.
 * @returns The result of the Supabase operation.
 */
export const fetchAndInsertTokenMarketData = async (tokenAddress: string): Promise<any> => {
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
    console.log(`[MARKET SERVICE] Making API request to: ${requestUrl}`);
    console.log(`[MARKET SERVICE] Request Headers:`, headers);

    // Make the API request
    const response = await axios.get(requestUrl, { headers });

    // Log the API response details
    console.log(`[MARKET SERVICE] API Request URL:`, response.config.url);
    console.log(`[MARKET SERVICE] API Response Status: ${response.status}`);
    console.log(`[MARKET SERVICE] API Response Data:`, response.data);

    // Extract and validate API data
    const apiData = response.data.data;

    if (!response.data.success || !apiData) {
      throw new Error('API call unsuccessful or data is missing.');
    }

    // Map API response to Supabase table schema
    const supabaseData = {
      token: tokenAddress.trim(),
      price_usd: parseFloat(apiData.price_usd) || null,
      price_sol: parseFloat(apiData.price_sol) || null,
      current_market_cap: parseFloat(apiData.current_market_cap) || null,
      bonding_market_cap: parseFloat(apiData.bonding_market_cap) || null,
      bonding_progress: parseFloat(apiData.bonding_progress) || null,
      timestamp: Date.now(), // Current timestamp
    };

    // Log the data being sent to Supabase
    console.log(`[MARKET SERVICE] Data to upsert into Supabase:`, supabaseData);

    // Insert or update the data in Supabase
    const { data, error } = await supabase
      .from('call_static_tokens_market')
      .upsert(supabaseData);

    if (error) {
      console.error(`[MARKET SERVICE] Supabase Error:`, error.message);
      throw error;
    }

    console.log(`[MARKET SERVICE] Supabase Insert/Update Success:`, data);
    return data;
  } catch (error) {
    console.error(`[MARKET SERVICE] Error fetching or inserting market data:`, error.message);
    throw error;
  }
};
