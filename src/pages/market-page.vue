<!-- src/pages/CallStaticTokensMarketPage.vue -->
<template>
  <div class="call-static-tokens-market-page">
    <h2>Call Static Tokens Market</h2>

    <!-- Use SupabaseRealtimeDisplay to fetch data and pass it to vue3-datatable -->
    <SupabaseRealtimeDisplay tableName="call_static_tokens_market" v-slot="{ fetchedData }">
      <vue3-datatable 
        :rows="formattedData(fetchedData)" 
        :columns="columns" 
        sortable 
        @rowClick="handleRowClick"
      ></vue3-datatable>

      <div v-if="selectedTokenData">
        <h3>Candlestick Chart for {{ selectedTokenData.token }}</h3>
        <apexchart type="candlestick" :options="chartOptions" :series="chartSeries"></apexchart>
      </div>
    </SupabaseRealtimeDisplay>
  </div>
</template>

<script setup lang="ts">
import SupabaseRealtimeDisplay from '@/components/SupabaseRealtimeDisplay.vue';
import { useSupabase } from '@/composables/useSupabase';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';
import { ref, watch } from 'vue';

const supabase = useSupabase();

const columns = ref([
  { field: 'token', title: 'Token', sort: true },
  { field: 'price_usd', title: 'Price USD', type: 'number', sort: true, cellRenderer: (item) => `$${item.price_usd.toFixed(8)}` },
  { field: 'price_sol', title: 'Price SOL', type: 'number', sort: true },
  { field: 'current_market_cap', title: 'Current Market Cap', type: 'number', sort: true },
  { field: 'bonding_market_cap', title: 'Bonding Market Cap', type: 'number', sort: true },
  { field: 'bonding_progress', title: 'Bonding Progress', type: 'number', sort: true, cellRenderer: (item) => `${item.bonding_progress}%` },
  { field: 'timestamp', title: 'Last Updated', type: 'date', sort: true, cellRenderer: (item) => new Date(item.timestamp * 1000).toLocaleString() },
]);

const formattedData = (data) => {
  return data.map(item => ({
    ...item,
    price_usd: item.price_usd || 0,
    price_sol: item.price_sol || 0,
    current_market_cap: item.current_market_cap || 0,
    bonding_market_cap: item.bonding_market_cap || 0,
    bonding_progress: item.bonding_progress || 0,
    timestamp: item.timestamp || 0,
  }));
};

const selectedTokenData = ref(null);
const chartOptions = ref({
  chart: {
    type: 'candlestick',
    height: 350
  },
  title: {
    text: 'Candlestick Chart',
    align: 'left'
  },
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    tooltip: {
      enabled: true
    }
  }
});
const chartSeries = ref([]);

const handleRowClick = async (row) => {
  try {
    console.log('Row clicked:', row);
    selectedTokenData.value = row;
    await updateChartSeries(row.token);
  } catch (error) {
    console.error('Error handling row click:', error);
  }
};

const updateChartSeries = async (token) => {
  try {
    const { data, error } = await supabase
      .from('token_ohlc_1sec')
      .select('*')
      .eq('token', token);

    if (error) {
      throw error;
    }

    chartSeries.value = [{
      data: data.map(item => ({
        x: new Date(item.start_time * 1000),
        y: [item.open, item.high, item.low, item.close]
      }))
    }];
  } catch (error) {
    console.error('Error updating chart series:', error);
  }
};

watch(selectedTokenData, (newVal) => {
  if (newVal) {
    updateChartSeries(newVal.token);
  }
});
</script>

<style scoped>
.call-static-tokens-market-page {
  padding: 16px;
}
</style>
