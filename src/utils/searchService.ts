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

export const searchTokens = async (query: string, page: number = 1, limit: number = 100) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/search`, {
      headers,
      params: { query, page, limit }
    });
    const searchData = response.data.data;

    // Insert search data into Supabase
    for (const token of searchData) {
      const { data, error } = await supabase
        .from('search_results')
        .upsert({
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          mint: token.mint,
          image: token.image,
          decimals: token.decimals,
          quoteToken: token.quoteToken,
          hasSocials: token.hasSocials,
          poolAddress: token.poolAddress,
          liquidityUsd: token.liquidityUsd,
          marketCapUsd: token.marketCapUsd,
          lpBurn: token.lpBurn,
          market: token.market,
          freezeAuthority: token.freezeAuthority,
          mintAuthority: token.mintAuthority,
          deployer: token.deployer,
          createdAt: token.createdAt,
          status: token.status,
          lastUpdated: token.lastUpdated,
          buys: token.buys,
          sells: token.sells,
          totalTransactions: token.totalTransactions,
          price: token.price // Add price field
        });

      if (error) throw error;
    }

    return searchData;
  } catch (error) {
    console.error('Error searching tokens:', error);
    throw error;
  }
};
