import { supabase } from '@/composables/useSupabase';
import axios from 'axios';

const fetchSolPrice = async () => {
  try {
    console.log('Fetching SOL price from CoinGecko...');
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const solPrice = response.data.solana.usd;
    console.log('SOL price fetched from CoinGecko:', solPrice);

    // Insert the SOL price into the database
    const { error } = await supabase
      .from('sol_price')
      .insert([{ price: solPrice }]);

    if (error) {
      console.error('Error inserting SOL price into Supabase:', error.message);
      throw new Error(error.message);
    }

    console.log('SOL price inserted into Supabase:', solPrice);
    return solPrice;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return null;
  }
};

export default fetchSolPrice;
