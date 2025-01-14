import { supabase } from '@/composables/useSupabase';
import axios from 'axios';

const BASE_API_URL = 'https://data.solanatracker.io';
const API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;

const headers = {
  'x-api-key': API_KEY,
  'Accept': 'application/json'
};

export const fetchTokenInfo = async (tokenAddress: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}`, { headers });
    const tokenData = response.data.token;
    const poolsData = response.data.pools;
    const eventsData = response.data.events;
    const riskData = response.data.risk;

    // Insert token data into Supabase
    const { data, error } = await supabase
      .from('tokens')
      .upsert({
        mint: tokenData.mint,
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

    if (error) throw error;

    // Insert pools data into Supabase
    for (const pool of poolsData) {
      const { data, error } = await supabase
        .from('pools')
        .upsert({
          liquidity: pool.liquidity,
          price: pool.price,
          tokenSupply: pool.tokenSupply,
          lpBurn: pool.lpBurn,
          tokenAddress: pool.tokenAddress,
          marketCap: pool.marketCap,
          market: pool.market,
          quoteToken: pool.quoteToken,
          decimals: pool.decimals,
          security: pool.security,
          lastUpdated: new Date(pool.lastUpdated).toISOString(),
          createdAt: new Date(pool.createdAt).toISOString(),
          poolId: pool.poolId
        });

      if (error) throw error;
    }

    // Insert events data into Supabase
    for (const [interval, event] of Object.entries(eventsData)) {
      const eventData = { ...event, interval, token: tokenAddress };
      const { data, error } = await supabase
        .from('events')
        .upsert(eventData);

      if (error) throw error;
    }

    // Insert risk data into Supabase
    const { data: riskInsertData, error: riskInsertError } = await supabase
      .from('risks')
      .upsert({
        rugged: riskData.rugged,
        risks: riskData.risks,
        score: riskData.score,
        token: tokenAddress
      });

    if (riskInsertError) throw riskInsertError;

    return { tokenData, poolsData, eventsData, riskData };
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

export const fetchTokenAth = async (tokenAddress: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}/ath`, { headers });
    const athData = response.data;

    // Ensure the data includes all required fields
    const athRecord = {
      token: tokenAddress,
      ath: athData.ath,
      ath_change_percentage: athData.ath_change_percentage,
      ath_date: athData.ath_date,
      atl: athData.atl,
      atl_change_percentage: athData.atl_change_percentage,
      atl_date: athData.atl_date,
      market_cap: athData.market_cap,
      market_cap_rank: athData.market_cap_rank,
      fully_diluted_valuation: athData.fully_diluted_valuation,
      total_volume: athData.total_volume,
      high_24h: athData.high_24h,
      low_24h: athData.low_24h,
      price_change_24h: athData.price_change_24h,
      price_change_percentage_24h: athData.price_change_percentage_24h,
      market_cap_change_24h: athData.market_cap_change_24h,
      market_cap_change_percentage_24h: athData.market_cap_change_percentage_24h,
      circulating_supply: athData.circulating_supply,
      total_supply: athData.total_supply,
      max_supply: athData.max_supply,
      last_updated: athData.last_updated
    };

    // Insert ATH data into Supabase
    const { data, error } = await supabase
      .from('token_ath')
      .upsert(athRecord);

    if (error) throw error;

    return athData;
  } catch (error) {
    console.error('Error fetching token ATH:', error);
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
