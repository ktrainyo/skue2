<template>
  <div>
    <h3>Concurrent Fetcher</h3>
    <button @click="startFetching">Start Fetching</button>
    <p>{{ log }}</p>
  </div>
</template>

<script lang="ts">
import { fetchTokenHolders, fetchTokenInfo } from '@/utils/solanaTrackerService';
import { runConcurrently } from '@/utils/taskRunner';

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
        await runConcurrently([
          () => fetchTokenInfo('exampleTokenAddress'),
          () => fetchTokenHolders('exampleTokenAddress')
        ]);
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
