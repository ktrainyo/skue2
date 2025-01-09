import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Supabase client setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Proxy server URL
const BASE_API_URL = 'http://192.168.50.226:3011/callstaticrpc/pumpfun/v1/historical/trades/byToken';
const API_KEY = import.meta.env.VITE_CALLSTATICRPC_API_KEY;

if (!supabaseUrl || !supabaseAnonKey || !API_KEY) {
  throw new Error('Supabase URL, Anon Key, and API Key must be provided');
}

/**
 * Fetch and insert historical trades for a token.
 * @param tokenAddress - The token address to query trades for.
 * @param limit - Maximum number of records to return.
 * @param offset - Number of records to skip.
 */
export const fetchAndInsertTokenHistorical = async (
  tokenAddress: string,
  limit = 100,
  offset = 0
): Promise<void> => {
  try {
    console.log(`[HISTORICAL SERVICE] Using API Key: ${API_KEY}`);
    console.log(`[HISTORICAL SERVICE] Making API request to: ${BASE_API_URL}`);

    const response = await axios.get(BASE_API_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      params: {
        token: tokenAddress.trim(),
        limit,
        offset,
      },
    });

    console.log(`[HISTORICAL SERVICE] API Response:`, response.data);

    if (response.data.success && Array.isArray(response.data.data)) {
      interface Trade {
        id: string;
        token: string;
        hash: string;
        timestamp: number;
        sol_amount: number;
        token_amount: number;
        price: number;
        dex: number;
        buyer: string | null;
        virtual_sol_reserves: number | null;
        virtual_token_reserves: number | null;
        real_sol_reserves: number | null;
        real_token_reserves: number | null;
        is_buy: boolean | null;
      }

      const trades: Trade[] = response.data.data.map((trade: any) => ({
        id: trade.id,
        token: trade.token,
        hash: trade.hash,
        timestamp: trade.timestamp,
        sol_amount: trade.sol_amount,
        token_amount: trade.token_amount,
        price: trade.price,
        dex: trade.dex,
        buyer: trade.buyer ?? null,
        virtual_sol_reserves: trade.virtual_sol_reserves ?? null,
        virtual_token_reserves: trade.virtual_token_reserves ?? null,
        real_sol_reserves: trade.real_sol_reserves ?? null,
        real_token_reserves: trade.real_token_reserves ?? null,
        is_buy: trade.is_buy ?? null,
      }));

      console.log(`[HISTORICAL SERVICE] Trades to upsert:`, trades);

      const { data, error } = await supabase
        .from('call_static_tokens_historical')
        .upsert(trades, { onConflict: 'id' });

      if (error) {
        console.error(`[HISTORICAL SERVICE] Supabase Error: ${error.message}`);
        throw error;
      }

      console.log(`[HISTORICAL SERVICE] Supabase Upsert Response:`, data);
      console.log(`[HISTORICAL SERVICE] Successfully inserted/updated ${data?.length || 0} trades.`);
    } else {
      console.log(`[HISTORICAL SERVICE] No data returned or success flag is false.`);
    }
  } catch (error: any) {
    console.error('[HISTORICAL SERVICE] Error:', error.message);
    throw error;
  }
};
