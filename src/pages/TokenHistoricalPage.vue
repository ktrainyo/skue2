<template>
  <div>
    <h3>Fetch Historical Trades</h3>
    <input v-model="tokenAddress" placeholder="Enter token address" />
    <input v-model="limit" type="number" placeholder="Limit" />
    <input v-model="offset" type="number" placeholder="Offset" />
    <button @click="fetchTrades">Fetch</button>
    <p v-if="log">{{ log }}</p>
  </div>
</template>

<script lang="ts">
import { fetchAndInsertTokenHistorical } from '@/utils/callStaticTokensHistoricalService';

export default {
  data() {
    return {
      tokenAddress: '',
      limit: 100,
      offset: 0,
      log: '',
    };
  },
  methods: {
    async fetchTrades() {
      try {
        this.log = 'Fetching...';
        await fetchAndInsertTokenHistorical(this.tokenAddress, this.limit, this.offset);
        this.log = 'Fetch completed.';
      } catch (error) {
        this.log = `Error: ${error.message}`;
      }
    },
  },
};
</script>

<style scoped>
h3 {
  margin-block-end: 1rem;
}

input {
  padding: 0.5rem;
  margin-inline-end: 0.5rem;
}

button {
  padding-block: 0.5rem;
  padding-inline: 1rem;
}
</style>
