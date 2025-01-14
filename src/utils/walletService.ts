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

export const fetchWalletTokens = async (owner: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/wallet/${owner}`, { headers });
    const walletTokensData = response.data;

    // Insert wallet tokens data into Supabase
    for (const token of walletTokensData.tokens) {
      const { data, error } = await supabase
        .from('wallet_tokens')
        .upsert({ ...token, owner });

      if (error) throw error;
    }

    return walletTokensData;
  } catch (error) {
    console.error('Error fetching wallet tokens:', error);
    throw error;
  }
};

export const fetchWalletBasicTokens = async (owner: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/wallet/${owner}/basic`, { headers });
    const walletBasicTokensData = response.data;

    // Insert wallet basic tokens data into Supabase
    for (const token of walletBasicTokensData.tokens) {
      const { data, error } = await supabase
        .from('wallet_basic_tokens')
        .upsert({ ...token, owner });

      if (error) throw error;
    }

    return walletBasicTokensData;
  } catch (error) {
    console.error('Error fetching wallet basic tokens:', error);
    throw error;
  }
};

export const fetchWalletTrades = async (owner: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/wallet/${owner}/trades`, { headers });
    const walletTradesData = response.data.trades;

    // Insert wallet trades data into Supabase
    for (const trade of walletTradesData) {
      const { data, error } = await supabase
        .from('wallet_trades')
        .upsert({ 
          tx: trade.tx,
          from_address: trade.from.address,
          from_amount: trade.from.amount,
          from_token: trade.from.token,
          to_address: trade.to.address,
          to_amount: trade.to.amount,
          to_token: trade.to.token,
          price: trade.price,
          volume: trade.volume,
          wallet: trade.wallet,
          program: trade.program,
          time: trade.time
        });

      if (error) throw error;
    }

    return walletTradesData;
  } catch (error) {
    console.error('Error fetching wallet trades:', error);
    throw error;
  }
};
