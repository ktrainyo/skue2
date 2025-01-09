import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Supabase client setup
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Proxy server URL for token volume API
const BASE_API_URL = 'http://192.168.50.226:3011/callstaticrpc/pumpfun/v1/token/volume';
const API_KEY = import.meta.env.VITE_CALLSTATICRPC_API_KEY;

/**
 * Fetch volume data for a specific token and insert it into Supabase.
 * @param tokenAddress - The token address to fetch volume data for.
 * @returns The result of the Supabase operation.
 */
export const fetchAndInsertTokenVolume = async (tokenAddress: string): Promise<any> => {
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
    console.log(`[VOLUME SERVICE] Making API request to: ${requestUrl}`);
    console.log(`[VOLUME SERVICE] Request Headers:`, headers);

    // Make the API request
    const response = await axios.get(requestUrl, { headers });

    // Log the API response details
    console.log(`[VOLUME SERVICE] API Request URL:`, response.config.url);
    console.log(`[VOLUME SERVICE] API Response Status: ${response.status}`);
    console.log(`[VOLUME SERVICE] API Response Data:`, response.data);

    // Extract and validate API data
    const apiData = response.data.data[0];

    if (!response.data.success || !apiData) {
      throw new Error('API call unsuccessful or data is missing.');
    }

    // Map API response to Supabase table schema
    const supabaseData = {
      token: apiData.token,
      name: apiData.name || null,
      symbol: apiData.symbol || null,
      buy_volume_1m: apiData.buy_volume_1m || null,
      buy_volume_5m: apiData.buy_volume_5m || null,
      buy_volume_15m: apiData.buy_volume_15m || null,
      buy_volume_30m: apiData.buy_volume_30m || null,
      buy_volume_1h: apiData.buy_volume_1h || null,
      buy_volume_4h: apiData.buy_volume_4h || null,
      buy_volume_24h: apiData.buy_volume_24h || null,
      buy_volume_1w: apiData.buy_volume_1w || null,
      sell_volume_1m: apiData.sell_volume_1m || null,
      sell_volume_5m: apiData.sell_volume_5m || null,
      sell_volume_15m: apiData.sell_volume_15m || null,
      sell_volume_30m: apiData.sell_volume_30m || null,
      sell_volume_1h: apiData.sell_volume_1h || null,
      sell_volume_4h: apiData.sell_volume_4h || null,
      sell_volume_24h: apiData.sell_volume_24h || null,
      sell_volume_1w: apiData.sell_volume_1w || null,
      last_buy_timestamp: apiData.last_buy_timestamp || null,
      last_sell_timestamp: apiData.last_sell_timestamp || null,
      timestamp: Date.now(), // Current timestamp
    };

    // Log the data being sent to Supabase
    console.log(`[VOLUME SERVICE] Data to upsert into Supabase:`, supabaseData);

    // Insert or update the data in Supabase
    const { data, error } = await supabase
      .from('call_static_tokens_volume')
      .upsert(supabaseData);

    if (error) {
      console.error(`[VOLUME SERVICE] Supabase Error:`, error.message);
      throw error;
    }

    console.log(`[VOLUME SERVICE] Supabase Insert/Update Success:`, data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[VOLUME SERVICE] Error fetching or inserting volume data:`, error.message);
    } else {
      console.error(`[VOLUME SERVICE] Unknown error:`, error);
    }
    throw error;
  }
};
