import { supabase } from '@/composables/useSupabase';
import axios from 'axios';

const BASE_API_URL = 'https://data.solanatracker.io';
const API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;

const headers = {
  'x-api-key': API_KEY,
  'Accept': 'application/json'
};

export const fetchTokenChartData = async (tokenAddress: string, interval: string = '1d') => {
  try {
    const response = await axios.get(`${BASE_API_URL}/chart/${tokenAddress}`, {
      headers,
      params: { type: interval }
    });
    const chartData = response.data.oclhv;

    // Insert chart data into Supabase
    for (const dataPoint of chartData) {
      const { data, error } = await supabase
        .from('token_chart_data')
        .upsert({ ...dataPoint, token: tokenAddress, interval, timestamp: new Date() });

      if (error) throw error;
    }

    return chartData;
  } catch (error) {
    console.error('Error fetching token chart data:', error);
    throw error;
  }
};

export const fetchTokenPoolChartData = async (tokenAddress: string, poolAddress: string, interval: string = '1d') => {
  try {
    const response = await axios.get(`${BASE_API_URL}/chart/${tokenAddress}/${poolAddress}`, {
      headers,
      params: { type: interval }
    });
    const chartData = response.data.oclhv;

    // Insert chart data into Supabase
    for (const dataPoint of chartData) {
      const { data, error } = await supabase
        .from('token_pool_chart_data')
        .upsert({ ...dataPoint, token: tokenAddress, pool: poolAddress, interval, timestamp: new Date() });

      if (error) throw error;
    }

    return chartData;
  } catch (error) {
    console.error('Error fetching token pool chart data:', error);
    throw error;
  }
};
