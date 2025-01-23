import { getSupabaseClient } from '@/composables/useSupabase';
import axios from 'axios';

const supabase = getSupabaseClient();

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
      });

    if (error) throw error;
    console.log(`Token price inserted successfully for address: ${tokenAddress}`);

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

export const fetchTokenAth = async (tokenAddress: string) => {
  try {
    console.log(`Fetching token ATH for address: ${tokenAddress}`);
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}/ath`, { headers });
    const athData = response.data;

    // Ensure the data includes all required fields
    const athRecord = {
      token: tokenAddress,
      ath: athData.ath,
      highest_price: athData.high_24h,
      timestamp: safeDate(athData.last_updated)
    };

    // Insert ATH data into Supabase
    const { data, error } = await supabase
      .from('token_ath')
      .upsert(athRecord);

    if (error) throw error;
    console.log(`Token ATH inserted successfully for address: ${tokenAddress}`);

    return athData;
  } catch (error) {
    console.error('Error fetching token ATH:', error);
    throw error;
  }
};

export const fetchTokenInfo = async (tokenAddress: string) => {
  try {
    console.log(`Fetching token info for address: ${tokenAddress}`);
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}`, { headers });
    const tokenData = response.data.token;

    if (!tokenData || !tokenData.mint) {
      throw new Error('Invalid token data format');
    }

    // Insert token data into Supabase
    const { error: tokenError } = await supabase
      .from('tokens')
      .upsert({
        mint: tokenData.mint,  // Corrected column name
        name: tokenData.name,
        symbol: tokenData.symbol,
        uri: tokenData.uri,
        decimals: tokenData.decimals,
        image: tokenData.image,
        description: tokenData.description,
        extensions: tokenData.extensions,
        tags: tokenData.tags,
        creator: tokenData.creator,
        hasFileMetaData: tokenData.hasFileMetaData,
        createdOn: new Date().toISOString()
      });

    if (tokenError) throw new Error(`Token insertion error: ${tokenError.message}`);
    console.log(`Token info inserted successfully for address: ${tokenAddress}`);

    return tokenData;
  } catch (error) {
    console.error('Error fetching token info:', error);
    throw error;
  }
};

export const fetchTokenHolders = async (tokenAddress: string) => {
  try {
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

    return holdersData;
  } catch (error) {
    console.error('Error fetching token holders:', error);
    throw error;
  }
};

export const fetchTokenHoldersTop = async (tokenAddress: string) => {
  try {
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

    return holdersTopData;
  } catch (error) {
    console.error('Error fetching top token holders:', error);
    throw error;
  }
};

export const fetchTokenChartData = async (tokenAddress: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}/chart`, { headers });
    const chartData = response.data;

    // Insert chart data into Supabase
    for (const dataPoint of chartData) {
      const { data, error } = await supabase
        .from('token_chart_data')
        .upsert({ ...dataPoint, token: tokenAddress });

      if (error) throw error;
    }

    return chartData;
  } catch (error) {
    console.error('Error fetching token chart data:', error);
    throw error;
  }
};

export const fetchTokenPriceAtTimestamp = async (tokenAddress: string, timestamp: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}/price?timestamp=${timestamp}`, { headers });
    const priceData = response.data;

    // Insert price data into Supabase
    const { data, error } = await supabase
      .from('token_price_history')
      .upsert({ ...priceData, token: tokenAddress });

    if (error) throw error;

    return priceData;
  } catch (error) {
    console.error('Error fetching token price at timestamp:', error);
    throw error;
  }
};

function safeDate(last_updated: string): string {
  if (!last_updated) return new Date().toISOString();
  const date = new Date(last_updated);
  if (isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

