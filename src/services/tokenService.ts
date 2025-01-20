import { supabase } from '@/composables/useSupabase';
import axios from 'axios';

const BASE_API_URL = 'https://data.solanatracker.io';
const API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;

const headers = {
  'x-api-key': API_KEY,
  'Accept': 'application/json'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const MAX_RETRIES = 3;

interface TokenData {
  token: {
    mint: string;
    name: string;
    symbol: string;
    uri: string;
    decimals: number;
    image: string;
    description: string;
    hasFileMetaData: boolean;
    twitter: string;
    telegram: string;
    website: string;
    showName: boolean;
  };
  pools: any[];
  risk: any;
  events: any;
}

export const fetchAndInsertNewTokens = async () => {
  try {
    console.log('Fetching latest tokens from API...');
    const response = await axios.get<TokenData[]>(`${BASE_API_URL}/tokens/latest`, { headers });
    const tokens = Array.isArray(response.data) ? response.data : [response.data];
    console.log('Fetched tokens:', tokens);

    for (const tokenData of tokens) {
      console.log('Processing token:', tokenData.token.mint);
      await processToken(tokenData);
    }

    // Clear the tokens array to remove data from the DOM
    tokens.length = 0;
    console.log('Tokens processed and array cleared.');

  } catch (error) {
    console.error('Error in fetchAndInsertNewTokens:', error);
    throw error;
  }
};

// Process a single token and insert it into the database
async function processToken(tokenData: any, retryCount = 0) {
  try {
    console.log(`Inserting token with mint address ${tokenData.token.mint}...`);
    
    // First, check if token already exists
    const { data: existingToken, error: checkError } = await supabase
      .from('new_token_data')
      .select('id')
      .eq('mint_address_new', tokenData.token.mint)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Token check failed: ${checkError.message}`);
    }

    let tokenId: number;

    if (existingToken) {
      console.log(`Token already exists with ID: ${existingToken.id}`);
      // Update existing token
      tokenId = existingToken.id;
      const { error: updateError } = await supabase
        .from('new_token_data')
        .update({
          name: tokenData.token.name,
          symbol: tokenData.token.symbol,
          uri: tokenData.token.uri,
          decimals: tokenData.token.decimals,
          image: tokenData.token.image,
          description: tokenData.token.description,
          has_file_metadata: tokenData.token.hasFileMetaData,
          twitter: tokenData.token.twitter,
          telegram: tokenData.token.telegram,
          website: tokenData.token.website,
          show_name: tokenData.token.showName,
          updated_at: new Date().toISOString(),
          processed: false
        })
        .eq('id', tokenId);

      if (updateError) throw new Error(`Token update failed: ${updateError.message}`);
      console.log(`Token updated successfully with ID: ${tokenId}`);
    } else {
      console.log('Token does not exist, inserting new token...');
      // Insert new token
      const { data: insertData, error: insertError } = await supabase
        .from('new_token_data')
        .insert({
          mint_address_new: tokenData.token.mint,
          name: tokenData.token.name,
          symbol: tokenData.token.symbol,
          uri: tokenData.token.uri,
          decimals: tokenData.token.decimals,
          image: tokenData.token.image,
          description: tokenData.token.description,
          has_file_metadata: tokenData.token.hasFileMetaData,
          twitter: tokenData.token.twitter,
          telegram: tokenData.token.telegram,
          website: tokenData.token.website,
          show_name: tokenData.token.showName,
          created_at: new Date().toISOString(),
          processed: false
        })
        .select('id')
        .single();

      if (insertError) throw new Error(`Token insertion failed: ${insertError.message}`);
      if (!insertData) throw new Error('No data returned from token insertion');
      
      tokenId = insertData.id;
      console.log(`Token inserted successfully with ID: ${tokenId}`);
    }

    // Process related data
    await Promise.all([
      processTokenPools(tokenData.pools, tokenId),
      processTokenRisks(tokenData.risk, tokenId),
      processTokenEvents(tokenData.events, tokenId)
    ]);

    console.log(`Token processing completed for ID: ${tokenId}`);
    return tokenId;
  } catch (error) {
    console.error(`Error processing token ${tokenData.token.mint}:`, error);
    if (retryCount < MAX_RETRIES) {
      console.warn(`Retry ${retryCount + 1} for token ${tokenData.token.mint}`);
      await delay(1000 * (retryCount + 1));
      return processToken(tokenData, retryCount + 1);
    }
    throw error;
  }
}

function safeDate(value: string | number): string | null {
  if (!value || value === '0') return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date.toISOString();
}

async function processTokenPools(pools: any[], tokenId: number) {
  if (!pools?.length) return;
  
  console.log('Processing pools for token ID:', tokenId);
  
  for (const pool of pools) {
    console.log('Processing pool:', {
      poolId: pool.poolId,
      tokenId: tokenId
    });

    const { error } = await supabase
      .from('new_token_pools')
      .upsert({
        token_id: tokenId, // Link to parent token
        pool_id: pool.poolId,
        quote_liquidity: pool.liquidity?.quote,
        usd_liquidity: pool.liquidity?.usd,
        quote_price: pool.price?.quote,
        usd_price: pool.price?.usd,
        token_supply: pool.tokenSupply,
        lp_burn: pool.lpBurn,
        market_cap_quote: pool.marketCap?.quote,
        market_cap_usd: pool.marketCap?.usd,
        freeze_authority: pool.security?.freezeAuthority,
        mint_authority: pool.security?.mintAuthority,
        quote_token: pool.quoteToken,
        market: pool.market,
        curve_percentage: pool.curvePercentage,
        curve_address: pool.curve,
        last_updated: safeDate(pool.lastUpdated),
        created_at: safeDate(pool.createdAt),
        deployer: pool.deployer,
        buys: pool.txns?.buys,
        total_txns: pool.txns?.total,
        volume: pool.txns?.volume,
        sells: pool.txns?.sells,
        open_time: safeDate(pool.openTime)
      }, {
        onConflict: 'pool_id' // Handle duplicates based on pool_id
      })
      .select(); // Add select() to see the complete response

    if (error) {
      console.error('Pool insertion error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Pool insertion failed: ${error.message}`);
    }
    console.log(`Pool processed successfully for pool ID: ${pool.poolId}`);
  }
}

async function processTokenEvents(events: any, tokenId: number) {
  if (!events) return;

  console.log('Processing events for token ID:', tokenId);

  await Promise.all(Object.entries(events).map(async ([interval, event]: [string, any]) => {
    const { error } = await supabase
      .from('new_token_events')
      .upsert({
        token_id: tokenId,
        interval: interval,
        price_change_percentage: event.priceChangePercentage
      }, {
        onConflict: 'token_id,interval' // Handle duplicates based on composite unique constraint
      });

    if (error) throw new Error(`Event insertion failed: ${error.message}`);
    console.log(`Event processed successfully for interval: ${interval}`);
  }));
}

async function processTokenRisks(riskData: any, tokenId: number) {
  if (!riskData?.risks?.length) return;

  console.log('Processing risks for token ID:', tokenId);

  await Promise.all(riskData.risks.map(async (risk: any) => {
    const { error } = await supabase
      .from('new_token_risks')
      .upsert({
        token_id: tokenId,
        rugged: riskData.rugged,
        risk_name: risk.name,
        risk_description: risk.description,
        risk_level: risk.level,
        risk_score: risk.score,
        overall_risk_score: riskData.score
      }, {
        onConflict: 'token_id,risk_name' // Handle duplicates based on composite unique constraint
      });

    if (error) throw new Error(`Risk insertion failed: ${error.message}`);
    console.log(`Risk processed successfully for risk name: ${risk.name}`);
  }));
}

export const fetchTokenInfo = async (tokenAddress: string) => {
  try {
    console.log(`Fetching token info for address: ${tokenAddress}`);
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}`, { headers });
    const tokenData = response.data.token;
    const poolsData = response.data.pools;
    const eventsData = response.data.events;
    const riskData = response.data.risk;

    // Insert token data into Supabase
    const { data: tokenDataResponse, error: tokenError } = await supabase
      .from('tokens')
      .upsert({
        mint_address_new: tokenData.mint, // Updated column name
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

    // Insert pools data into Supabase
    const poolPromises = poolsData.map((pool: any) => {
      return supabase
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
          lastUpdated: safeDate(pool.lastUpdated),
          createdAt: safeDate(pool.createdAt),
          poolId: pool.poolId
        });
    });

    const poolResults = await Promise.all(poolPromises);
    poolResults.forEach(({ error }) => {
      if (error) throw new Error(`Pool insertion error: ${error.message}`);
    });
    console.log(`Pools data inserted successfully for address: ${tokenAddress}`);

    // Insert events data into Supabase
    const eventPromises = Object.entries(eventsData).map(([interval, event]) => {
      return supabase
        .from('events')
        .upsert({
          interval,
          ...(typeof event === 'object' ? event : {})
        });
    });

    const eventResults = await Promise.all(eventPromises);
    eventResults.forEach(({ error }) => {
      if (error) throw new Error(`Event insertion error: ${error.message}`);
    });
    console.log(`Events data inserted successfully for address: ${tokenAddress}`);

    // Insert risk data into Supabase
    const { data: riskDataResponse, error: riskError } = await supabase
      .from('risks')
      .upsert({
        rugged: riskData.rugged,
        risk_name: riskData.risk_name,
        risk_description: riskData.risk_description,
        risk_level: riskData.risk_level,
        risk_score: riskData.risk_score,
        overall_risk_score: riskData.overall_risk_score
      });

    if (riskError) throw new Error(`Risk insertion error: ${riskError.message}`);
    console.log(`Risk data inserted successfully for address: ${tokenAddress}`);

  } catch (error) {
    console.error(`Failed to fetch and insert token info for address ${tokenAddress}:`, error);
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

export const fetchTokenAth = async (tokenAddress: string) => {
  try {
    console.log(`Fetching token ATH for address: ${tokenAddress}`);
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
      last_updated: safeDate(athData.last_updated)
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

export const fetchTokenChartData = async (tokenAddress: string) => {
  try {
    console.log(`Fetching token chart data for address: ${tokenAddress}`);
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}/chart`, { headers });
    const chartData = response.data;

    // Insert chart data into Supabase
    for (const dataPoint of chartData) {
      const { data, error } = await supabase
        .from('token_chart_data')
        .upsert({ ...dataPoint, token: tokenAddress });

      if (error) throw error;
    }
    console.log(`Token chart data inserted successfully for address: ${tokenAddress}`);

    return chartData;
  } catch (error) {
    console.error('Error fetching token chart data:', error);
    throw error;
  }
};

export const fetchTokenPriceAtTimestamp = async (tokenAddress: string, timestamp: string) => {
  try {
    console.log(`Fetching token price at timestamp for address: ${tokenAddress}`);
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}/price?timestamp=${timestamp}`, { headers });
    const priceData = response.data;

    // Insert price data into Supabase
    const { data, error } = await supabase
      .from('token_price_history')
      .upsert({ ...priceData, token: tokenAddress });

    if (error) throw error;
    console.log(`Token price at timestamp inserted successfully for address: ${tokenAddress}`);

    return priceData;
  } catch (error) {
    console.error('Error fetching token price at timestamp:', error);
    throw error;
  }
};
