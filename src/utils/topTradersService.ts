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

export const fetchTopTraders = async (page: number = 1, expandPnl: boolean = false, sortBy: string = 'total') => {
  try {
    const response = await axios.get(`${BASE_API_URL}/top-traders/all/${page}`, {
      headers,
      params: { expandPnl, sortBy }
    });
    const topTradersData = response.data.wallets;

    // Insert top traders data into Supabase
    for (const trader of topTradersData) {
      const { data, error } = await supabase
        .from('top_traders')
        .upsert(trader);

      if (error) throw error;
    }

    return topTradersData;
  } catch (error) {
    console.error('Error fetching top traders:', error);
    throw error;
  }
};

export const fetchTopTokenTraders = async (tokenAddress: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/top-traders/${tokenAddress}`, { headers });
    const topTokenTradersData = response.data.wallets;

    // Insert top token traders data into Supabase
    for (const trader of topTokenTradersData) {
      const { data, error } = await supabase
        .from('top_token_traders')
        .upsert({ ...trader, token: tokenAddress });

      if (error) throw error;
    }

    return topTokenTradersData;
  } catch (error) {
    console.error('Error fetching top token traders:', error);
    throw error;
  }
};
