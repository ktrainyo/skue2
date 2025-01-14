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

export const fetchWalletPnL = async (owner: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/pnl/${owner}`, { headers });
    const pnlData = response.data;

    // Insert PnL data into Supabase
    const { data, error } = await supabase
      .from('wallet_pnl')
      .upsert({ ...pnlData, owner });

    if (error) throw error;

    return pnlData;
  } catch (error) {
    console.error('Error fetching wallet PnL:', error);
    throw error;
  }
};

export const fetchFirstBuyers = async (tokenAddress: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/first-buyers/${tokenAddress}`, { headers });
    const firstBuyersData = response.data.buyers;

    // Insert first buyers data into Supabase
    for (const buyer of firstBuyersData) {
      const { data, error } = await supabase
        .from('first_buyers')
        .upsert({ ...buyer, token: tokenAddress });

      if (error) throw error;
    }

    return firstBuyersData;
  } catch (error) {
    console.error('Error fetching first buyers:', error);
    throw error;
  }
};

export const fetchWalletTokenPnL = async (owner: string, tokenAddress: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/pnl/${owner}/${tokenAddress}`, { headers });
    const tokenPnLData = response.data;

    // Insert token PnL data into Supabase
    const { data, error } = await supabase
      .from('wallet_token_pnl')
      .upsert({ ...tokenPnLData, owner, token: tokenAddress });

    if (error) throw error;

    return tokenPnLData;
  } catch (error) {
    console.error('Error fetching wallet token PnL:', error);
    throw error;
  }
};
