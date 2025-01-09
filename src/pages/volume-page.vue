<template>
  <div class="call-static-tokens-volume-page">
    <h2>Call Static Tokens Volume</h2>

    <!-- Use SupabaseRealtimeDisplay to fetch data and pass it to summary cards -->
    <SupabaseRealtimeDisplay tableName="call_static_tokens_volume" v-slot="{ fetchedData }">
      <div class="cards-container">
        <div v-for="item in formattedData(fetchedData)" :key="item.token" class="card">
          <h3>{{ item.name }} ({{ item.symbol }})</h3>
          <p><strong>Token:</strong> {{ item.token }}</p>
          <p><strong>Buy Volume 1m:</strong> {{ item.buy_volume_1m }}</p>
          <p><strong>Buy Volume 5m:</strong> {{ item.buy_volume_5m }}</p>
          <p><strong>Buy Volume 15m:</strong> {{ item.buy_volume_15m }}</p>
          <p><strong>Buy Volume 30m:</strong> {{ item.buy_volume_30m }}</p>
          <p><strong>Buy Volume 1h:</strong> {{ item.buy_volume_1h }}</p>
          <p><strong>Buy Volume 4h:</strong> {{ item.buy_volume_4h }}</p>
          <p><strong>Buy Volume 24h:</strong> {{ item.buy_volume_24h }}</p>
          <p><strong>Buy Volume 1w:</strong> {{ item.buy_volume_1w }}</p>
          <p><strong>Sell Volume 1m:</strong> {{ item.sell_volume_1m }}</p>
          <p><strong>Sell Volume 5m:</strong> {{ item.sell_volume_5m }}</p>
          <p><strong>Sell Volume 15m:</strong> {{ item.sell_volume_15m }}</p>
          <p><strong>Sell Volume 30m:</strong> {{ item.sell_volume_30m }}</p>
          <p><strong>Sell Volume 1h:</strong> {{ item.sell_volume_1h }}</p>
          <p><strong>Sell Volume 4h:</strong> {{ item.sell_volume_4h }}</p>
          <p><strong>Sell Volume 24h:</strong> {{ item.sell_volume_24h }}</p>
          <p><strong>Sell Volume 1w:</strong> {{ item.sell_volume_1w }}</p>
          <p><strong>Last Buy Timestamp:</strong> {{ new Date(item.last_buy_timestamp * 1000).toLocaleString() }}</p>
          <p><strong>Last Sell Timestamp:</strong> {{ new Date(item.last_sell_timestamp * 1000).toLocaleString() }}</p>
          <p><strong>Timestamp:</strong> {{ new Date(item.timestamp * 1000).toLocaleString() }}</p>
        </div>
      </div>
    </SupabaseRealtimeDisplay>
  </div>
</template>

<script setup lang="ts">
import SupabaseRealtimeDisplay from '@/components/SupabaseRealtimeDisplay.vue';

const formattedData = (data) => {
  return data.map(item => ({
    ...item,
    buy_volume_1m: item.buy_volume_1m || '0',
    buy_volume_5m: item.buy_volume_5m || '0',
    buy_volume_15m: item.buy_volume_15m || '0',
    buy_volume_30m: item.buy_volume_30m || '0',
    buy_volume_1h: item.buy_volume_1h || '0',
    buy_volume_4h: item.buy_volume_4h || '0',
    buy_volume_24h: item.buy_volume_24h || '0',
    buy_volume_1w: item.buy_volume_1w || '0',
    sell_volume_1m: item.sell_volume_1m || '0',
    sell_volume_5m: item.sell_volume_5m || '0',
    sell_volume_15m: item.sell_volume_15m || '0',
    sell_volume_30m: item.sell_volume_30m || '0',
    sell_volume_1h: item.sell_volume_1h || '0',
    sell_volume_4h: item.sell_volume_4h || '0',
    sell_volume_24h: item.sell_volume_24h || '0',
    sell_volume_1w: item.sell_volume_1w || '0',
    last_buy_timestamp: item.last_buy_timestamp || 0,
    last_sell_timestamp: item.last_sell_timestamp || 0,
    timestamp: item.timestamp || 0,
  }));
};
</script>

<style scoped>
.call-static-tokens-volume-page {
  padding: 16px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 10%);
  inline-size: calc(33.333% - 32px);
}

.card h3 {
  margin-block-start: 0;
}

.card p {
  margin-block: 4px;
  margin-inline: 0;
}
</style>
