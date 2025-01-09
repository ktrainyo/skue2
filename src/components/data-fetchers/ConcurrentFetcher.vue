<template>
  <div>
    <h3>Concurrent Fetcher</h3>
    <button @click="startFetching">Start Fetching</button>
    <p>{{ log }}</p>
  </div>
</template>

<script lang="ts">
import { fetchAndInsertTokenHistorical } from '@/utils/callStaticTokensHistoricalService';

export default {
  data() {
    return {
      log: '',
    };
  },
  methods: {
    async startFetching() {
      try {
        this.log = 'Fetching started...';
        await fetchAndInsertTokenHistorical('exampleToken', 100, 0);
        this.log = 'Fetching completed.';
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

button {
  cursor: pointer;
  font-size: 1rem;
  padding-block: 0.5rem;
  padding-inline: 1rem;
}
</style>
