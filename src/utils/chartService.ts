import { getSupabaseClient } from '@/composables/useSupabase';
import axios from 'axios';

const supabase = getSupabaseClient();

const BASE_API_URL = 'https://data.solanatracker.io';
const API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;

const headers = {
  'x-api-key': API_KEY,
  'Accept': 'application/json'
};

export const fetchTokenChartData = async (tokenAddress: string, interval: string = '5s') => {
  try {
    const response = await axios.get(`${BASE_API_URL}/chart/${tokenAddress}`, {
      headers,
      params: { type: interval }
    });
    const chartData = response.data.oclhv;

    if (!Array.isArray(chartData)) {
      throw new Error('Invalid chart data format');
    }

    // Insert chart data into Supabase
    for (const dataPoint of chartData) {
      const { data, error } = await supabase
        .from('token_chart_data')
        .upsert({
          token: tokenAddress,
          interval,
          open: dataPoint.open,
          close: dataPoint.close,
          high: dataPoint.high,
          low: dataPoint.low,
          volume: dataPoint.volume,
          timestamp: new Date(dataPoint.time * 1000), // Convert Unix timestamp to JavaScript Date
          time: dataPoint.time
        });

      if (error) throw error;
    }

    return chartData;
  } catch (error) {
    console.error('Error fetching token chart data:', error);
    throw error;
  }
};

export const fetchTokenPoolChartData = async (tokenAddress: string, poolAddress: string, interval: string = '5s') => {
  try {
    const response = await axios.get(`${BASE_API_URL}/chart/${tokenAddress}/${poolAddress}`, {
      headers,
      params: { type: interval }
    });
    const chartData = response.data.oclhv;

    if (!Array.isArray(chartData)) {
      throw new Error('Invalid chart data format');
    }

    // Insert chart data into Supabase
    for (const dataPoint of chartData) {
      const { data, error } = await supabase
        .from('token_pool_chart_data')
        .upsert({
          token: tokenAddress,
          pool: poolAddress,
          interval,
          open: dataPoint.open,
          close: dataPoint.close,
          high: dataPoint.high,
          low: dataPoint.low,
          volume: dataPoint.volume,
          timestamp: new Date(dataPoint.time * 1000), // Convert Unix timestamp to JavaScript Date
          time: dataPoint.time
        });

      if (error) throw error;
    }

    return chartData;
  } catch (error) {
    console.error('Error fetching token pool chart data:', error);
    throw error;
  }
};
