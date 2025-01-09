<template>
  <div>
    <h3>Fetch Token Metadata</h3>
    <input
      type="text"
      v-model="tokenAddress"
      placeholder="Enter token address"
      class="token-input"
    />
    <button @click="fetchTokenMetadata" :disabled="isLoading || !tokenAddress">
      {{ isLoading ? 'Loading...' : 'Fetch Metadata' }}
    </button>
    <p v-if="statusMessage">{{ statusMessage }}</p>
  </div>
</template>

<script lang="ts">
import { fetchAndInsertTokenMetadata } from '@/utils/callStaticTokensMetadataService';
import { ref } from 'vue';

export default {
  setup() {
    const tokenAddress = ref('');
    const isLoading = ref(false);
    const statusMessage = ref('');

    const fetchTokenMetadata = async () => {
      isLoading.value = true;
      statusMessage.value = '';

      try {
        await fetchAndInsertTokenMetadata(tokenAddress.value.trim());
        statusMessage.value = 'Token metadata fetched and saved successfully!';
      } catch (error) {
        statusMessage.value = `Error: ${error.message}`;
      } finally {
        isLoading.value = false;
      }
    };

    return { tokenAddress, isLoading, statusMessage, fetchTokenMetadata };
  },
};
</script>

<style scoped>
.token-input {
  display: block;
  padding: 0.5rem;
  font-size: 1rem;
  inline-size: 100%;
  margin-block-end: 1rem;
  max-inline-size: 300px;
}
</style>
