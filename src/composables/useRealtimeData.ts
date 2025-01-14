import { useSupabase } from '@/composables/useSupabase';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useRealtimeData(tokenAddress: string) {
  const supabase = useSupabase();
  const data = ref<any>(null);
  const channelRef = ref<any>(null);

  const fetchData = async () => {
    console.log('Fetching data for token:', tokenAddress);

    const { data: tokenData, error: tokenDataError } = await supabase
      .from('token_overview')
      .select('*')
      .eq('token', tokenAddress)
      .order('timestamp', { ascending: false }) // Assuming 'timestamp' is the field indicating the most recent data
      .limit(1)
      .single();

    if (tokenDataError) {
      console.error('Error fetching token data:', tokenDataError.message);
      return;
    }

    data.value = {
      title: tokenData.title,
      priceUsd: tokenData.priceusd,
      priceSol: tokenData.price,
      liquidity: tokenData.liquidity,
      fdv: tokenData.fdv,
      marketCap: tokenData.marketcap,
      transactions: tokenData.txns,
      volume: tokenData.volume,
      makers: tokenData.makers,
      buys: tokenData.buys,
      sells: tokenData.sells,
      buyVolume: tokenData.buy_volume,
      sellVolume: tokenData.sell_volume,
      buyers: tokenData.buyers,
      sellers: tokenData.sellers,
      timeframes: {
        '5M': tokenData['5M_percentage'],
        '10M': tokenData['10M_percentage'],
        '15M': tokenData['15M_percentage'],
        '30M': tokenData['30M_percentage'],
      },
    };

    console.log('Fetched data:', data.value);
  };

  const subscribeToRealtime = () => {
    channelRef.value = supabase.channel(`realtime-${tokenAddress}`);

    channelRef.value
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'token_overview',
        },
        (payload: RealtimePostgresChangesPayload<any>) => handleRealtimeChanges(payload)
      )
      .subscribe();
  };

  const handleRealtimeChanges = (payload: RealtimePostgresChangesPayload<any>) => {
    console.log('Realtime change detected:', payload);
    fetchData();
  };

  onMounted(() => {
    fetchData();
    subscribeToRealtime();
  });

  onBeforeUnmount(() => {
    if (channelRef.value) {
      channelRef.value.unsubscribe();
    }
  });

  return {
    data,
  };
}
