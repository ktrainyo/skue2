<template>
  <div>
    <h3>Looped API Fetcher</h3>
    <button @click="toggleLoop" :disabled="isLoading">
      {{ isLooping ? 'Stop Loop' : 'Start Loop' }}
    </button>
    <p v-if="statusMessage">{{ statusMessage }}</p>
  </div>
</template>

<script lang="ts">
import { fetchOrdersAndSave } from '@/utils/orderService'; // Example with order service
import { runWithInterval } from '@/utils/taskRunner';
import { ref } from 'vue';

export default {
  setup() {
    const isLoading = ref(false);
    const isLooping = ref(false);
    const statusMessage = ref('');
    let stopLoop: (() => void) | null = null;

    const toggleLoop = () => {
      if (isLooping.value) {
        stopLoop?.(); // Stop the loop
        isLooping.value = false;
        statusMessage.value = 'Loop stopped.';
      } else {
        isLoading.value = true;
        statusMessage.value = 'Starting loop...';
        stopLoop = runWithInterval(fetchOrdersAndSave, 5000); // 5-second interval
        isLooping.value = true;
        isLoading.value = false;
      }
    };

    return { isLoading, isLooping, statusMessage, toggleLoop };
  },
};
</script>
