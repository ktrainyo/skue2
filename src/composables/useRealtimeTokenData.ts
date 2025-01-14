import { useSupabase } from '@/composables/useSupabase';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useRealtimeTokenData(token: string) {
  const supabase = useSupabase();
  const tokenData = ref<any>(null);
  const channelRef = ref<any>(null);

  const fetchTokenData = async () => {
    const { data, error } = await supabase
      .from('token_overview')
      .select('*')
      .eq('token', token)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching token data:', error.message);
      return;
    }

    tokenData.value = data;
  };

  const subscribeToRealtime = () => {
    channelRef.value = supabase.channel(`realtime-${token}`);

    channelRef.value
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'token_overview',
          filter: `token=eq.${token}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => handleRealtimeChanges(payload)
      )
      .subscribe();
  };

  const handleRealtimeChanges = (payload: RealtimePostgresChangesPayload<any>) => {
    console.log('Realtime change detected:', payload);
    fetchTokenData();
  };

  onMounted(() => {
    fetchTokenData();
    subscribeToRealtime();
  });

  onBeforeUnmount(() => {
    if (channelRef.value) {
      channelRef.value.unsubscribe();
    }
  });

  return {
    tokenData,
  };
}
