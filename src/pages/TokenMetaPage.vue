<template>
  <div class="token-meta-page">
    <h1>Token Metadata Testing Page</h1>
    <p>
      Use this page to test fetching token metadata. Enter a token address and
      click "Submit" to fetch metadata and save it to the database. Enable the
      "Loop" checkbox to test periodic fetching.
    </p>

    <div class="form-section">
      <input
        type="text"
        v-model="tokenAddress"
        placeholder="Enter token address"
        class="token-input"
      />
      <input
        type="number"
        v-model.number="loopInterval"
        min="1000"
        placeholder="Enter loop interval (ms)"
        class="loop-interval"
      />
      <div class="options">
        <label>
          <input type="checkbox" v-model="isLooping" />
          Loop
        </label>
        <button @click="fetchMetadata" :disabled="!tokenAddress || isLoading">
          <span v-if="isLoading">Loading...</span>
          <span v-else>Submit</span>
        </button>
        <button @click="consoleLog = ''">Clear Console</button>
      </div>
    </div>

    <div class="console-window">
      <h2>Console</h2>
      <textarea readonly class="console-output" :value="consoleLog"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { fetchAndInsertTokenMetadata } from '@/utils/callStaticTokensMetadataService';
import { runWithInterval } from '@/utils/taskRunner';
import { onUnmounted, ref } from 'vue';

export default {
  setup() {
    const tokenAddress = ref('');
    const isLoading = ref(false);
    const isLooping = ref(false);
    const loopInterval = ref(5000);
    const consoleLog = ref('');
    let stopLoop: (() => void) | null = null;

    const logToConsole = (message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      consoleLog.value += `[${timestamp}] ${message}\n`;
    };

    const fetchMetadata = async () => {
      if (!tokenAddress.value.trim()) {
        logToConsole('Error: Token address is required.');
        return;
      }

      if (isLooping.value) {
        if (!stopLoop) {
          stopLoop = runWithInterval(async () => {
            isLoading.value = true;
            try {
              logToConsole(`Fetching metadata for token: ${tokenAddress.value}`);
              await fetchAndInsertTokenMetadata(tokenAddress.value.trim());
              logToConsole('Metadata fetched and saved successfully.');
            } catch (error) {
              const err = error as any;
              if (err.response) {
                logToConsole(`API Error: ${err.response.status} - ${err.response.data.message}`);
              } else if (err.request) {
                logToConsole('No response from server. Check your proxy or network.');
              } else {
                logToConsole(`Unexpected Error: ${err.message}`);
              }
            } finally {
              isLoading.value = false;
            }
          }, loopInterval.value || 5000); // Default to 5 seconds
        } else {
          logToConsole('Loop is already running.');
        }
      } else {
        isLoading.value = true;
        try {
          logToConsole(`Fetching metadata for token: ${tokenAddress.value}`);
          await fetchAndInsertTokenMetadata(tokenAddress.value.trim());
          logToConsole('Metadata fetched and saved successfully.');
        } catch (error) {
          const err = error as Error;
          logToConsole(`Error: ${err.message}`);
        } finally {
          isLoading.value = false;
        }
      }
    };

    onUnmounted(() => {
      if (stopLoop) {
        stopLoop();
        stopLoop = null;
      }
    });

    return { tokenAddress, isLoading, isLooping, loopInterval, consoleLog, fetchMetadata };
  },
};
</script>

<style scoped>
.token-meta-page {
  padding: 20px;
  font-family: Arial, sans-serif;
  margin-block: 0;
  margin-inline: auto;
  max-inline-size: 800px;
}

.form-section {
  margin-block-end: 20px;
}

.token-input,
.loop-interval {
  display: block;
  padding: 10px;
  font-size: 16px;
  inline-size: 100%;
  margin-block-end: 20px;
  max-inline-size: 400px;
}

.options {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-block-end: 20px;
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
  block-size: 300px; /* Increased console size */
  font-family: monospace;
  inline-size: 100%;
  resize: none;
}
</style>
