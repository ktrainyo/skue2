<template>
  <div class="debugging-component">
    <h2>Debugging Information</h2>
    <pre>{{ debugInfo }}</pre>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  tokenAddress: String,
  selectedApiCalls: Array,
  loopInterval: Number,
  isLoading: Boolean,
  isLoopingEnabled: Boolean,
  loops: Array,
  apiCalls: Array,
  mostRecentTokenData: Object,
});

const debugInfo = computed(() => {
  return JSON.stringify(props, null, 2);
});
</script>

<style scoped>
.debugging-component {
  padding: 1rem;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  font-family: monospace;
  margin-block: 1rem;
  margin-inline: 0;
}
</style>
