<template>
  <VDataTable
    :headers="headers"
    :items="tokens"
    :search="search"
    :items-per-page="5"
    class="text-no-wrap"
    @click:row="handleRowClick"
  >
    <!-- Name -->
    <template #item.name="{ item }">
      <span>{{ item.name }}</span>
    </template>

    <!-- Address -->
    <template #item.token="{ item }">
      <span>{{ item.token }}</span>
    </template>

    <!-- Price -->
    <template #item.price_usd="{ item }">
      <span v-html="formatCompactUSD(item.price_usd)"></span>
    </template>

    <!-- Volume -->
    <template #item.buy_volume_24h="{ item }">
      <span>{{ formatNumber(item.buy_volume_24h) }}</span>
    </template>

    <!-- Market Cap -->
    <template #item.current_market_cap="{ item }">
      <span>{{ formatCurrency(item.current_market_cap) }}</span>
    </template>

    <!-- Liquidity -->
    <template #item.liquidity="{ item }">
      <span>{{ formatCurrency(item.liquidity) }}</span>
    </template>

    <!-- Timestamp -->
    <template #item.timestamp="{ item }">
      <span>{{ formatTimestamp(item.timestamp) }}</span>
    </template>
  </VDataTable>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  tokens: Array,
  search: String,
});

const emits = defineEmits(['selectToken']);

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Address', key: 'token' },
  { title: 'Price', key: 'price_usd' },
  { title: 'Volume', key: 'buy_volume_24h' },
  { title: 'Market Cap', key: 'current_market_cap' },
  { title: 'Liquidity', key: 'liquidity' },
  { title: 'Timestamp', key: 'timestamp' },
];

const formatCurrency = (value: number) => {
  if (typeof value !== 'number') return value;
  return `$${value.toFixed(2)}`;
};

const formatNumber = (value: number) => {
  if (typeof value !== 'number') return value;
  return value.toLocaleString();
};

const formatCompactUSD = (value: number) => {
  if (typeof value !== 'number') return value;
  return `$${value.toFixed(2)}`;
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const handleRowClick = (item: any) => {
  emits('selectToken', item);
};
</script>
