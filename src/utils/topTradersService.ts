import { getSupabaseClient } from '@/composables/useSupabase';
import axios from 'axios';

const supabase = getSupabaseClient();

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

export const fetchTokenHolders = async (tokenAddress: string) => {
  try {
    console.log(`Fetching token holders for address: ${tokenAddress}`);
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}/holders`, { headers });
    const holdersData = response.data.accounts;

    if (!Array.isArray(holdersData)) {
      throw new Error('Invalid holders data format');
    }

    // Insert holders data into Supabase
    for (const holder of holdersData) {
      const { data, error } = await supabase
        .from('token_holders')
        .upsert({
          token: tokenAddress,
          wallet: holder.wallet,
          amount: holder.amount,
          percentage: holder.percentage,
          value: holder.value
        });

      if (error) throw error;
    }
    console.log(`Token holders inserted successfully for address: ${tokenAddress}`);

    return holdersData;
  } catch (error) {
    console.error('Error fetching token holders:', error);
    throw error;
  }
};

export const fetchTokenHoldersTop = async (tokenAddress: string) => {
  try {
    console.log(`Fetching top token holders for address: ${tokenAddress}`);
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}/holders/top`, { headers });
    const holdersTopData = response.data;

    if (!Array.isArray(holdersTopData)) {
      throw new Error('Invalid top holders data format');
    }

    // Insert top holders data into Supabase
    for (const holder of holdersTopData) {
      const { data, error } = await supabase
        .from('token_holders_top')
        .upsert({
          token: tokenAddress,
          wallet: holder.address,
          amount: holder.amount,
          percentage: holder.percentage,
          value: holder.value
        });

      if (error) throw error;
    }
    console.log(`Top token holders inserted successfully for address: ${tokenAddress}`);

    return holdersTopData;
  } catch (error) {
    console.error('Error fetching top token holders:', error);
    throw error;
  }
};

export const fetchTokenTraders = async (tokenAddress: string) => {
  try {
    console.log(`Fetching top token traders for address: ${tokenAddress}`);
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}/traders`, { headers });
    const topTokenTradersData = response.data;

    if (!Array.isArray(topTokenTradersData)) {
      throw new Error('Invalid top token traders data format');
    }

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
