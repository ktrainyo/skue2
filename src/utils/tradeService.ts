import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
        .upsert({ ...trade, token: tokenAddress, pools: trade.pools });

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
        .upsert({ ...trade, token: tokenAddress, pool: poolAddress, pools: trade.pools });

      if (error) throw error;
    }

    return tokenPoolTradesData;
  } catch (error) {
    console.error('Error fetching token pool trades:', error);
    throw error;
  }
};

export const fetchTokenPoolOwnerTrades = async (tokenAddress: string, poolAddress: string, owner: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/trades/${tokenAddress}/${poolAddress}/${owner}`, { headers });
    const tokenPoolOwnerTradesData = response.data.trades;

    // Insert token pool owner trades data into Supabase
    for (const trade of tokenPoolOwnerTradesData) {
      const { data, error } = await supabase
        .from('token_pool_owner_trades')
        .upsert({ ...trade, token: tokenAddress, pool: poolAddress, owner, pools: trade.pools });

      if (error) throw error;
    }

    return tokenPoolOwnerTradesData;
  } catch (error) {
    console.error('Error fetching token pool owner trades:', error);
    throw error;
  }
};
