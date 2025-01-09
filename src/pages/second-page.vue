<template>
  <div>
    <h1>API Tester</h1>
    <input v-model="token" placeholder="Enter token address" />
    <button @click="fetchTokenData" :disabled="loading">Fetch Token Data</button>
    <button @click="updateAllData" :disabled="loading">Update All Data</button>
    <button @click="updateSpecificTable('call_static_tokens_volume')" :disabled="loading">Update Token Data</button>
    <button @click="updateSpecificTable('call_static_tokens_market')" :disabled="loading">Update Market Data</button>
    <button @click="updateSpecificTable('call_static_tokens_metadata')" :disabled="loading">Update Metadata</button>
    <button @click="updateSpecificTable('call_static_tokens_historical')" :disabled="loading">Update Historical Data</button>
    <button @click="startLoop('call_static_tokens_volume')" :disabled="loading">Start Loop Token Data</button>
    <button @click="startLoop('call_static_tokens_market')" :disabled="loading">Start Loop Market Data</button>
    <button @click="startLoop('call_static_tokens_metadata')" :disabled="loading">Start Loop Metadata</button>
    <button @click="startLoop('call_static_tokens_historical')" :disabled="loading">Start Loop Historical Data</button>
    <button @click="stopLoop('call_static_tokens_volume')" :disabled="loading">Stop Loop Token Data</button>
    <button @click="stopLoop('call_static_tokens_market')" :disabled="loading">Stop Loop Market Data</button>
    <button @click="stopLoop('call_static_tokens_metadata')" :disabled="loading">Stop Loop Metadata</button>
    <button @click="stopLoop('call_static_tokens_historical')" :disabled="loading">Stop Loop Historical Data</button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      token: '',
      interval: 30, // Default interval for loops
      loading: false,
      error: null,
    };
  },
  methods: {
    validateToken() {
      if (!this.token) {
        this.error = 'Token address is required';
        return false;
      }
      this.error = null;
      return true;
    },
    async fetchTokenData() {
      if (!this.validateToken()) return;
      this.loading = true;
      try {
        console.log('Fetching token data for:', this.token);
        const response = await axios.get('http://192.168.50.226:8001/fetch-token-data', {
          params: { address: this.token },
        });
        console.log('Token data fetched:', response.data);
      } catch (error) {
        console.error('Error fetching token data:', error);
        this.error = 'Failed to fetch token data';
      } finally {
        this.loading = false;
      }
    },
    async updateAllData() {
      if (!this.validateToken()) return;
      this.loading = true;
      try {
        console.log('Updating all data for:', this.token);
        const response = await axios.post('http://192.168.50.226:8001/update', {
          table: 'all',
          token: this.token,
        });
        console.log('All data updated:', response.data);
      } catch (error) {
        console.error('Error updating all data:', error);
        this.error = 'Failed to update all data';
      } finally {
        this.loading = false;
      }
    },
    async updateSpecificTable(table) {
      if (!this.validateToken()) return;
      this.loading = true;
      try {
        console.log(`Updating ${table} for:`, this.token);
        const response = await axios.post('http://192.168.50.226:8001/update', {
          table,
          token: this.token,
        });
        console.log(`${table} updated:`, response.data);
      } catch (error) {
        console.error(`Error updating ${table}:`, error);
        this.error = `Failed to update ${table}`;
      } finally {
        this.loading = false;
      }
    },
    async startLoop(table) {
      if (!this.validateToken()) return;
      this.loading = true;
      try {
        console.log(`Starting loop for ${table} with interval ${this.interval} seconds`);
        const response = await axios.get('http://192.168.50.226:8001/start-loop', {
          params: { table, address: this.token, interval: this.interval },
        });
        console.log(`Loop started for ${table}:`, response.data);
      } catch (error) {
        console.error(`Error starting loop for ${table}:`, error);
        this.error = `Failed to start loop for ${table}`;
      } finally {
        this.loading = false;
      }
    },
    async stopLoop(table) {
      this.loading = true;
      try {
        console.log(`Stopping loop for ${table}`);
        const response = await axios.get('http://192.168.50.226:8001/stop-loop', {
          params: { table },
        });
        console.log(`Loop stopped for ${table}:`, response.data);
      } catch (error) {
        console.error(`Error stopping loop for ${table}:`, error);
        this.error = `Failed to stop loop for ${table}`;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
input {
  padding: 5px;
  inline-size: 300px;
  margin-block-end: 10px;
}

button {
  padding: 10px;
  margin: 5px;
  cursor: pointer;
}

.error {
  color: red;
}
</style>
