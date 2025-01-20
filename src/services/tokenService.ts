import { supabase } from '@/composables/useSupabase';
import type { TokenData, TokenEvent, TokenPool, TokenRisk } from '@/types/TokenService';
import axios from 'axios';

const BASE_API_URL = 'https://data.solanatracker.io';
const API_KEY = 'cac8560f-6f68-4b10-af5c-355b8e4a16ef';

const headers = {
  'x-api-key': API_KEY,
  'Accept': 'application/json'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const MAX_RETRIES = 3;

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
async function processToken(tokenData: TokenData, retryCount = 0) {
  try {
    console.log(`Inserting token with mint address ${tokenData.token.mint}...`);
    const { data: tokenResult, error: tokenError } = await supabase
      .from('new_token_data')
      .insert({
        mint_address_new: tokenData.token.mint, // Updated column name
        name: tokenData.token.name,
        symbol: tokenData.token.symbol,
        uri: tokenData.token.uri || null,
        decimals: tokenData.token.decimals,
        has_file_metadata: tokenData.token.hasFileMetaData,
        created_on: tokenData.token.createdOn || null,
        description: tokenData.token.description || null,
        image: tokenData.token.image || null,
        show_name: tokenData.token.showName || null,
        twitter: tokenData.token.twitter || null,
        telegram: tokenData.token.telegram || null,
        website: tokenData.token.website || null,
        processed: false, // Set processed to false
      })
      .select('id')
      .single();

    if (tokenError) {
      throw new Error(`Token insertion failed: ${tokenError.message}`);
    }

    if (!tokenResult?.id) {
      throw new Error('No token ID returned');
    }

    const tokenId = tokenResult.id;
    console.log(`Token inserted with id ${tokenId}`);

    if (tokenData.pools?.length) {
      for (const pool of tokenData.pools) {
        console.log(`Processing pool for token id ${tokenId}...`);
        await processPool(pool, tokenId);
      }
    }

    for (const [interval, event] of Object.entries(tokenData.events)) {
      console.log(`Processing event for token id ${tokenId}...`);
      await processEvent(interval, event, tokenId);
    }

    for (const riskItem of tokenData.risk.risks) {
      console.log(`Processing risk for token id ${tokenId}...`);
      await processRisk(riskItem, tokenData.risk, tokenId);
    }

  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.warn(`Retry ${retryCount + 1} for token ${tokenData.token.mint}`);
      await delay(1000 * (retryCount + 1));
      return processToken(tokenData, retryCount + 1);
    }
    console.error('Failed to process token after retries:', tokenData.token.mint, error);
  }
}

// Process a single pool and insert it into the database
async function processPool(pool: TokenPool, tokenId: number) {
  try {
    console.log(`Inserting pool data for token id ${tokenId}...`);
    await supabase
      .from('new_token_pools')
      .insert({
        token_id: tokenId,
        pool_id: pool.poolId,
        quote_liquidity: pool.liquidity.quote,
        usd_liquidity: pool.liquidity.usd,
        quote_price: pool.price.quote,
        usd_price: pool.price.usd,
        token_supply: pool.tokenSupply,
        lp_burn: pool.lpBurn,
        market_cap_quote: pool.marketCap.quote,
        market_cap_usd: pool.marketCap.usd,
        freeze_authority: pool.security?.freezeAuthority || null,
        mint_authority: pool.security?.mintAuthority || null,
        quote_token: pool.quoteToken,
        market: pool.market,
        curve_percentage: pool.curvePercentage || null,
        curve_address: pool.curve || null,
        last_updated: pool.lastUpdated,
        created_at: pool.createdAt,
        deployer: pool.deployer,
        buys: pool.txns.buys,
        total_txns: pool.txns.total,
        volume: pool.txns.volume,
        sells: pool.txns.sells,
        open_time: pool.openTime || null,
      })
      .select();
    console.log(`Pool data inserted for token id ${tokenId}`);
  } catch (error) {
    console.error(`Pool processing error for token ${tokenId}:`, error);
  }
}

// Process a single event and insert it into the database
async function processEvent(interval: string, event: TokenEvent, tokenId: number) {
  try {
    console.log(`Inserting event data for token id ${tokenId}...`);
    await supabase
      .from('new_token_events')
      .insert({
        token_id: tokenId,
        interval,
        price_change_percentage: event.priceChangePercentage,
      });
    console.log(`Event data inserted for token id ${tokenId}`);
  } catch (error) {
    console.error(`Event processing error for token ${tokenId}:`, error);
  }
}

// Process a single risk and insert it into the database
async function processRisk(riskItem: any, riskData: TokenRisk, tokenId: number) {
  try {
    console.log(`Inserting risk data for token id ${tokenId}...`);
    await supabase
      .from('new_token_risks')
      .insert({
        token_id: tokenId,
        rugged: riskData.rugged,
        risk_name: riskItem.name,
        risk_description: riskItem.description,
        risk_level: riskItem.level,
        risk_score: riskItem.score,
        overall_risk_score: riskData.score,
      });
    console.log(`Risk data inserted for token id ${tokenId}`);
  } catch (error) {
    console.error(`Risk processing error for token ${tokenId}:`, error);
  }
}
