<template>
  <div class="header">
    <button class="back-button">←</button>
    <div class="title">
      <span>{{ token.name }}</span>
      <span class="timeframe">1m</span>
    </div>
    <div class="menu-actions">
      <div class="sol-price-box">
        <span class="sol-price-label">SOL Price:</span>
        <span class="sol-price-value">{{ solPrice !== null ? `$${solPrice}` : 'Loading...' }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useSupabase } from '@/composables/useSupabase';
import fetchSolPrice from '@/services/solPriceService';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Header',
  props: {
    token: {
      type: Object as PropType<{ name: string }>,
      required: true,
    },
  },
  setup() {
    const solPrice = ref<number | null>(null);
    const supabase = useSupabase();

    const updateSolPrice = async () => {
      console.log('Fetching SOL price...');
      const price = await fetchSolPrice();
      if (price !== null) {
        solPrice.value = price;
        console.log('SOL price fetched:', price);
      } else {
        console.error('Failed to fetch SOL price');
      }
    };

    const fetchMostRecentSolPrice = async () => {
      const { data, error } = await supabase
        .from('sol_price')
        .select('price')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching most recent SOL price:', error.message);
        return;
      }

      if (data && data.length > 0) {
        solPrice.value = data[0].price;
        console.log('Most recent SOL price fetched from Supabase:', solPrice.value);
      }
    };

    onMounted(() => {
      updateSolPrice();
      setInterval(updateSolPrice, 300000); // Fetch every 5 minutes
      fetchMostRecentSolPrice();
    });

    return {
      solPrice,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  border: none;
  background: none;
  color: #fff;
  font-size: 1.5rem;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title span {
  font-size: 1.25rem;
  font-weight: bold;
}

.timeframe {
  color: #0f0;
}

.menu-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sol-price-box {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #2e2e2e;
}

.sol-price-label {
  color: #aaa;
  font-size: 0.75rem;
  margin-inline-end: 0.5rem;
}

.sol-price-value {
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
}
</style>
