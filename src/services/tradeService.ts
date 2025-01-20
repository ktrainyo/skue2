
import { supabase } from '@/composables/useSupabase';
import axios from 'axios';

const BASE_API_URL = 'https://data.solanatracker.io';
const API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;

const headers = {
  'x-api-key': API_KEY,
  'Accept': 'application/json'
};

export const fetchTokenTrades = async (tokenAddress: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}/trades`, { headers });
    const tradesData = response.data;

    // Insert trades data into Supabase
    for (const trade of tradesData) {
      const { data, error } = await supabase
        .from('trades')
        .upsert({ 
          token: tokenAddress, 
          trade_id: trade.trade_id, 
          price: trade.price, 
          amount: trade.amount, 
          timestamp: trade.timestamp 
        });

      if (error) throw error;
    }

    return tradesData;
  } catch (error) {
    console.error('Error fetching token trades:', error);
    throw error;
  }
};
