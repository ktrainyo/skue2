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

export const fetchLatestTokens = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/tokens/latest`, { headers });
    const latestTokensData = response.data;

    // Insert latest tokens data into Supabase
    for (const token of latestTokensData) {
      const { data, error } = await supabase
        .from('latest_tokens')
        .upsert(token);

      if (error) throw error;
    }

    return latestTokensData;
  } catch (error) {
    console.error('Error fetching latest tokens:', error);
    throw error;
  }
};

export const fetchTrendingTokens = async (timeframe: string = '') => {
  try {
    const response = await axios.get(`${BASE_API_URL}/tokens/trending${timeframe ? `/${timeframe}` : ''}`, { headers });
    const trendingTokensData = response.data;

    // Insert trending tokens data into Supabase
    for (const token of trendingTokensData) {
      const { data, error } = await supabase
        .from('trending_tokens')
        .upsert(token);

      if (error) throw error;
    }

    return trendingTokensData;
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    throw error;
  }
};

export const fetchTokensByVolume = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/tokens/volume`, { headers });
    const tokensByVolumeData = response.data;

    // Insert tokens by volume data into Supabase
    for (const token of tokensByVolumeData) {
      const { data, error } = await supabase
        .from('tokens_by_volume')
        .upsert(token);

      if (error) throw error;
    }

    return tokensByVolumeData;
  } catch (error) {
    console.error('Error fetching tokens by volume:', error);
    throw error;
  }
};

export const fetchMultiTokens = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/tokens/multi/all`, { headers });
    const multiTokensData = response.data;

    // Insert multi tokens data into Supabase
    for (const token of multiTokensData.latest) {
      const { data, error } = await supabase
        .from('multi_tokens')
        .upsert({ ...token, status: 'latest' });

      if (error) throw error;
    }

    for (const token of multiTokensData.graduating) {
      const { data, error } = await supabase
        .from('multi_tokens')
        .upsert({ ...token, status: 'graduating' });

      if (error) throw error;
    }

    for (const token of multiTokensData.graduated) {
      const { data, error } = await supabase
        .from('multi_tokens')
        .upsert({ ...token, status: 'graduated' });

      if (error) throw error;
    }

    return multiTokensData;
  } catch (error) {
    console.error('Error fetching multi tokens:', error);
    throw error;
  }
};

export const fetchGraduatedTokens = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/tokens/multi/graduated`, { headers });
    const graduatedTokensData = response.data;

    // Insert graduated tokens data into Supabase
    for (const token of graduatedTokensData) {
      const { data, error } = await supabase
        .from('graduated_tokens')
        .upsert(token);

      if (error) throw error;
    }

    return graduatedTokensData;
  } catch (error) {
    console.error('Error fetching graduated tokens:', error);
    throw error;
  }
};
