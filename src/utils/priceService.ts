import { supabase } from '@/composables/useSupabase';
import axios from 'axios';

const BASE_API_URL = 'https://data.solanatracker.io';
const API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;

const headers = {
  'x-api-key': API_KEY,
  'Accept': 'application/json'
};

export const fetchTokenPrice = async (tokenAddress: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/price`, {
      headers,
      params: { token: tokenAddress }
    });
    const priceData = response.data;

    // Insert price data into Supabase
    const { data, error } = await supabase
      .from('token_prices')
      .upsert({ 
        token: tokenAddress, 
        price: priceData.price, 
        priceQuote: priceData.priceQuote, 
        liquidity: priceData.liquidity, 
        marketCap: priceData.marketCap, 
        lastUpdated: new Date(priceData.lastUpdated) 
      });

    if (error) throw error;

    return priceData;
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
  }
};

export const fetchTokenPriceHistory = async (tokenAddress: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/price/history`, {
      headers,
      params: { token: tokenAddress }
    });
    const priceHistoryData = response.data;

    // Insert price history data into Supabase
    const { data, error } = await supabase
      .from('token_price_history')
      .upsert({ 
        token: tokenAddress, 
        current: priceHistoryData.current, 
        "3d": priceHistoryData["3d"], 
        "5d": priceHistoryData["5d"], 
        "7d": priceHistoryData["7d"], 
        "14d": priceHistoryData["14d"], 
        "30d": priceHistoryData["30d"], 
        lastUpdated: new Date() 
      });

    if (error) throw error;

    return priceHistoryData;
  } catch (error) {
    console.error('Error fetching token price history:', error);
    throw error;
  }
};

export const fetchTokenPriceAtTimestamp = async (tokenAddress: string, timestamp: number) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/price/history/timestamp`, {
      headers,
      params: { token: tokenAddress, timestamp }
    });
    const priceAtTimestampData = response.data;

    // Insert price at timestamp data into Supabase
    const { data, error } = await supabase
      .from('token_price_at_timestamp')
      .upsert({ 
        token: tokenAddress, 
        price: priceAtTimestampData.price, 
        timestamp: priceAtTimestampData.timestamp, 
        timestamp_unix: priceAtTimestampData.timestamp_unix, 
        pool: priceAtTimestampData.pool, 
        error: null 
      });

    if (error) throw error;

    return priceAtTimestampData;
  } catch (error) {
    console.error('Error fetching token price at timestamp:', error);
    throw error;
  }
};
