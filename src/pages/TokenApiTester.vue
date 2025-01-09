<template>
    <div class="token-api-tester">
      <h2>Token API Tester</h2>
  
      <!-- Token Input -->
      <input
        type="text"
        v-model="tokenAddress"
        placeholder="Enter token address"
        class="token-input"
      />
  
      <!-- Loop Time Interval -->
      <div v-if="isLooping">
        <label for="interval">Loop Interval (ms):</label>
        <input
          type="number"
          v-model.number="loopInterval"
          id="interval"
          min="1000"
          placeholder="Enter interval in milliseconds"
        />
      </div>
  
      <!-- API Call Buttons -->
      <div class="button-group">
        <button @click="handleApiCall('metadata')" :disabled="!tokenAddress">
          Fetch Metadata
        </button>
        <button @click="handleApiCall('volume')" :disabled="!tokenAddress">
          Fetch Volume
        </button>
        <button @click="handleApiCall('market')" :disabled="!tokenAddress">
          Fetch Market
        </button>
        <button @click="handleApiCall('historical')" :disabled="!tokenAddress">
          Fetch Historical
        </button>
      </div>
  
      <!-- Loop Toggle -->
      <div class="loop-toggle">
        <label>
          <input
            type="checkbox"
            v-model="isLooping"
          />
          Enable Looping
        </label>
      </div>
  
      <!-- Status Message -->
      <p v-if="statusMessage">{{ statusMessage }}</p>
    </div>
  </template>
  
  <script lang="ts">
  import { fetchAndInsertTokenHistorical } from '@/utils/callStaticTokensHistoricalService';
import { fetchAndInsertTokenMarketData } from '@/utils/callStaticTokensMarketService';
import { fetchAndInsertTokenMetadata } from '@/utils/callStaticTokensMetadataService';
import { fetchAndInsertTokenVolume } from '@/utils/callStaticTokensVolumeService';
import { ref, watch } from 'vue';
  
  export default {
    setup() {
      const tokenAddress = ref('');
      const isLooping = ref(false);
      const loopInterval = ref(5000); // Default loop interval: 5 seconds
      const statusMessage = ref('');
      let loopTimeout: ReturnType<typeof setTimeout> | null = null;
  
      // API Call Handlers
      const handleApiCall = async (apiType: string) => {
        if (isLooping.value) {
          // If looping, repeatedly call the function
          const loop = async () => {
            await makeApiCall(apiType);
            loopTimeout = setTimeout(loop, loopInterval.value);
          };
          loop();
        } else {
          // Single API call
          await makeApiCall(apiType);
        }
      };
  
      const makeApiCall = async (apiType: string) => {
        statusMessage.value = `Fetching ${apiType} data...`;
  
        try {
          if (apiType === 'metadata') {
            await fetchAndInsertTokenMetadata(tokenAddress.value.trim());
          } else if (apiType === 'volume') {
            await fetchAndInsertTokenVolume(tokenAddress.value.trim());
          } else if (apiType === 'market') {
            await fetchAndInsertTokenMarketData(tokenAddress.value.trim());
          } else if (apiType === 'historical') {
            await fetchAndInsertTokenHistorical(tokenAddress.value.trim());
          }
          statusMessage.value = `${apiType.charAt(0).toUpperCase() + apiType.slice(1)} data fetched successfully!`;
        } catch (error) {
          statusMessage.value = `Error fetching ${apiType} data: ${error.message}`;
        }
      };
  
      // Watch for changes to looping state to clear intervals
      watch(isLooping, (newVal) => {
        if (!newVal && loopTimeout) {
          clearTimeout(loopTimeout);
          loopTimeout = null;
        }
      });
  
      return {
        tokenAddress,
        isLooping,
        loopInterval,
        statusMessage,
        handleApiCall,
      };
    },
  };
  </script>
  
  <style scoped>
  .token-api-tester {
    padding: 1rem;
    margin: auto;
    max-inline-size: 500px;
  }

  .token-input {
    padding: 0.5rem;
    font-size: 1rem;
    inline-size: 100%;
    margin-block-end: 1rem;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-block-end: 1rem;
  }

  .loop-toggle {
    margin-block-end: 1rem;
  }

  .error {
    color: red;
  }
  </style>
