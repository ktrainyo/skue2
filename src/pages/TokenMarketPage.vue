<template>
  <div class="token-market-page">
    <h1>Token Market Testing Page</h1>
    <p>
      Use this page to test fetching token market data. Enter a token address and
      click "Submit" to fetch data and save it to the database. Enable the "Loop"
      checkbox to test periodic fetching.
    </p>

    <div class="form-section">
      <input
        type="text"
        v-model="tokenAddress"
        placeholder="Enter token address"
        class="token-input"
      />
      <div class="options">
        <label>
          <input type="checkbox" v-model="isLooping" />
          Loop
        </label>
        <button @click="fetchMarketData" :disabled="!tokenAddress || isLoading">
          {{ isLoading ? "Loading..." : "Submit" }}
        </button>
      </div>
    </div>

    <div class="console-window">
      <h2>Console</h2>
      <textarea readonly class="console-output" :value="consoleLog"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { fetchAndInsertTokenMarketData } from '@/utils/callStaticTokensMarketService';
import { runWithInterval } from '@/utils/taskRunner';
import { onUnmounted, ref } from 'vue';

export default {
  setup() {
    const tokenAddress = ref('');
    const isLoading = ref(false);
    const isLooping = ref(false);
    const consoleLog = ref('');
    let stopLoop: (() => void) | null = null;

    const logToConsole = (message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      consoleLog.value += `[${timestamp}] ${message}\n`;
    };

    const fetchMarketData = async () => {
      if (!tokenAddress.value.trim()) {
        logToConsole('Error: Token address is required.');
        return;
      }

      if (isLooping.value) {
        // Enable loop
        if (!stopLoop) {
          stopLoop = runWithInterval(async () => {
            isLoading.value = true;
            try {
              logToConsole(`Fetching market data for token: ${tokenAddress.value}`);
              await fetchAndInsertTokenMarketData(tokenAddress.value.trim());
              logToConsole('Market data fetched and saved successfully.');
            } catch (error) {
              logToConsole(`Error during loop: ${error.message}`);
            } finally {
              isLoading.value = false;
            }
          }, 5000); // 5-second interval
        } else {
          logToConsole('Loop is already running.');
        }
      } else {
        // Single fetch
        isLoading.value = true;
        try {
          logToConsole(`Fetching market data for token: ${tokenAddress.value}`);
          await fetchAndInsertTokenMarketData(tokenAddress.value.trim());
          logToConsole('Market data fetched and saved successfully.');
        } catch (error) {
          logToConsole(`Error: ${error.message}`);
        } finally {
          isLoading.value = false;
        }
      }
    };

    // Cleanup on unmount
    onUnmounted(() => {
      if (stopLoop) {
        stopLoop();
        stopLoop = null;
      }
    });

    return { tokenAddress, isLoading, isLooping, consoleLog, fetchMarketData };
  },
};
</script>

<style scoped>
.token-market-page {
  padding: 20px;
  font-family: Arial, sans-serif;
  margin-block: 0;
  margin-inline: auto;
  max-inline-size: 800px;
}

.form-section {
  margin-block-end: 20px;
}

.token-input {
  display: block;
  padding: 10px;
  font-size: 16px;
  inline-size: 100%;
  margin-block-end: 10px;
  max-inline-size: 400px;
}

.options {
  display: flex;
  align-items: center;
  gap: 20px;
}

button {
  cursor: pointer;
  font-size: 16px;
  padding-block: 10px;
  padding-inline: 20px;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.console-window {
  margin-block-start: 20px;
}

.console-output {
  padding: 10px;
  border: 1px solid #ccc;
  background: #f4f4f4;
  block-size: 300px;
  font-family: monospace;
  inline-size: 100%;
  resize: none;
}
</style>
