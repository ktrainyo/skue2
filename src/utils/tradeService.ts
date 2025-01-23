import { getSupabaseClient } from '@/composables/useSupabase';
import axios from 'axios';

const supabase = getSupabaseClient();

const BASE_API_URL = 'https://data.solanatracker.io';
const API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;

const headers = {
  'x-api-key': API_KEY,
  'Accept': 'application/json'
};

export const fetchTokenTrades = async (tokenAddress: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/trades/${tokenAddress}`, { headers });
    const tokenTradesData = response.data.trades;

    // Insert token trades data into Supabase
    for (const trade of tokenTradesData) {
      const { data, error } = await supabase
        .from('token_trades')
        .upsert({ ...trade, token: tokenAddress });

      if (error) throw error;
    }

    return tokenTradesData;
  } catch (error) {
    console.error('Error fetching token trades:', error);
    throw error;
  }
};

export const fetchTokenPoolTrades = async (tokenAddress: string, poolAddress: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/trades/${tokenAddress}/${poolAddress}`, { headers });
    const tokenPoolTradesData = response.data.trades;

    // Insert token pool trades data into Supabase
    for (const trade of tokenPoolTradesData) {
      const { data, error } = await supabase
        .from('token_pool_trades')
        .upsert({
          tx: trade.tx,
          token: tokenAddress,
          pool: poolAddress,
          amount: trade.amount,
          priceUsd: trade.priceUsd,
          volume: trade.volume,
          type: trade.type,
          wallet: trade.wallet,
          time: trade.time,
          program: trade.program
        });

      if (error) throw error;
    }

    return tokenPoolTradesData;
  } catch (error) {
    console.error('Error fetching token pool trades:', error);
    throw error;
  }
};
