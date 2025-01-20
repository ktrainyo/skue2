<template>
  <div class="container">
    <h1>Token API Tester</h1>
    <GetNewTokensButton />
    <input
      type="text"
      v-model="tokenAddress"
      placeholder="Enter token address"
      class="token-input"
      id="tokenAddress"
      name="tokenAddress"
    />
    <div class="buttons-container">
      <div class="api-buttons scrollable">
        <label v-for="apiCall in apiCalls" :key="apiCall.name" class="api-button">
          <input type="checkbox" v-model="selectedApiCalls" :value="apiCall.name" :id="apiCall.name" :name="apiCall.name" />
          {{ apiCall.label }}
        </label>
      </div>
      <div class="action-buttons">
        <button @click="startApiCalls" :disabled="isLoading || !tokenAddress || !selectedApiCalls.length">
          {{ isLoading ? 'Loading...' : 'Start API Calls' }}
        </button>
        <button @click="stopAllLoops" :disabled="!loops.length">
          Stop All
        </button>
      </div>
    </div>
    <div class="loop-settings">
      <label>
        Loop Interval (ms):
        <input type="number" v-model="loopInterval" id="loopInterval" name="loopInterval" />
      </label>
      <label>
        <input type="checkbox" v-model="isLoopingEnabled" id="isLoopingEnabled" name="isLoopingEnabled" />
        Enable Looping
      </label>
    </div>
    <TokenTableList @tokenSelected="loadTokenOverview" />
    <div class="overview-container">
      <div>
        <h3>Token Overview (Direct)</h3>
        <TokenOverviewDirect v-if="mostRecentTokenData" :token="mostRecentTokenData?.token" :tokenData="mostRecentTokenData" />
      </div>
    </div>
    <div class="loops-table">
      <h2>Active Loops</h2>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>API Call</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="loop in loops" :key="loop.id">
            <td>{{ loop.token }}</td>
            <td>{{ loop.apiCall }}</td>
            <td>{{ loop.isLooping ? 'Running' : 'Stopped' }}</td>
            <td>
              <button @click="toggleLoop(loop)">
                {{ loop.isLooping ? 'Stop' : 'Start' }}
              </button>
              <button @click="removeLoop(loop.id)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <MessageDisplay ref="messageDisplay" />
  </div>
</template>

<script setup lang="ts">
import GetNewTokensButton from '@/components/GetNewTokensButton.vue';
import MessageDisplay from '@/components/MessageDisplay.vue';
import TokenOverviewDirect from '@/components/TokenOverviewDirect.vue';
import TokenTableList from '@/components/TokenTableList.vue';
import { getSupabaseClient } from '@/composables/useSupabase';
import { fetchTokenAth, fetchTokenChartData, fetchTokenHolders, fetchTokenHoldersTop, fetchTokenInfo, fetchTokenPriceAtTimestamp } from '@/services/tokenService';
import { fetchTokenPrice, fetchTokenPriceHistory } from '@/utils/priceService';
import { runWithInterval } from '@/utils/taskRunner';
import { fetchTokenPoolOwnerTrades, fetchTokenPoolTrades, fetchTokenTrades } from '@/utils/tradeService';
import { onMounted, ref, watch } from 'vue';

const supabase = getSupabaseClient();

const tokenAddress = ref('');
const selectedApiCalls = ref<string[]>([]);
const loopInterval = ref(5000);
const isLoading = ref(false);
const isLoopingEnabled = ref(false);
const statusMessage = ref('');
const loops = ref<any[]>([]);
const lastFetchedTokenData = ref(null);
interface TokenData {
  token: string;
  title: string;
  priceusd: number;
  price: number;
  liquidity: number;
  fdv: number;
  marketcap: number;
  txns: number;
  volume: number;
  makers: number;
  buys: number;
  sells: number;
  buy_volume: number;
  sell_volume: number;
  '1hr_percentage': number;
  '6hr_percentage': number;
  '12hr_percentage': number;
  '24hr_percentage': number;
  '7d_percentage': number;
  '30d_percentage': number;
  buyers: number;
  sellers: number;
  '1M_percentage': number;
  '5M_percentage': number;
  '10M_percentage': number;
  '30M_percentage': number;
  '1Y_percentage': number;
  '3Y_percentage': number;
}

const mostRecentTokenData = ref<TokenData | null>(null);
let loopIdCounter = 0;

const apiCalls = [
  { name: 'fetchTokenInfo', label: 'Fetch Token Info', fn: fetchTokenInfo },
  { name: 'fetchTokenHolders', label: 'Fetch Token Holders', fn: fetchTokenHolders },
  { name: 'fetchTokenHoldersTop', label: 'Fetch Top Token Holders', fn: fetchTokenHoldersTop },
  { name: 'fetchTokenAth', label: 'Fetch Token ATH', fn: fetchTokenAth },
  { name: 'fetchTokenChartData', label: 'Fetch Token Chart Data', fn: fetchTokenChartData },
  { name: 'fetchTokenPrice', label: 'Fetch Token Price', fn: fetchTokenPrice },
  { name: 'fetchTokenPriceHistory', label: 'Fetch Token Price History', fn: fetchTokenPriceHistory },
  { name: 'fetchTokenPriceAtTimestamp', label: 'Fetch Token Price at Timestamp', fn: fetchTokenPriceAtTimestamp },
  { name: 'fetchTokenTrades', label: 'Fetch Token Trades', fn: fetchTokenTrades },
  { name: 'fetchTokenPoolTrades', label: 'Fetch Token Pool Trades', fn: fetchTokenPoolTrades },
  { name: 'fetchTokenPoolOwnerTrades', label: 'Fetch Token Pool Owner Trades', fn: fetchTokenPoolOwnerTrades },
];

const fetchMostRecentTokenData = async (token: string | null = null) => {
  try {
    let query = supabase
      .from('token_overview')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1);

    if (token) {
      query = query.eq('token', token);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('Error fetching most recent token data:', error.message);
    } else if (!data) {
      console.warn('No data found for token:', token);
      mostRecentTokenData.value = null;
    } else {
      mostRecentTokenData.value = data;
      tokenAddress.value = data.token;
    }
  } catch (error) {
    console.error('Unexpected error fetching most recent token data:', error);
  }
};

onMounted(() => {
  fetchMostRecentTokenData();
});

const startApiCalls = () => {
  isLoading.value = true;
  statusMessage.value = 'Starting API calls...';
  const messageDisplay = ref<typeof MessageDisplay>();
  const poolAddress = ''; // Define poolAddress here

  const selectedFns = apiCalls
    .filter(apiCall => selectedApiCalls.value.includes(apiCall.name))
    .map(apiCall => ({ name: apiCall.name, fn: apiCall.fn }));

  for (const apiCall of selectedFns) {
    const loopId = loopIdCounter++;
    const loop = {
      id: loopId,
      token: tokenAddress.value.trim(),
      apiCall: apiCall.name,
      isLooping: false,
      stopLoop: null as (() => void) | null,
    };

    if (isLoopingEnabled.value) {
      loop.stopLoop = runWithInterval(async () => {
        const owner = ''; // Define owner here
        await apiCall.fn(tokenAddress.value.trim(), poolAddress, owner).catch(error => {
          console.error(error);
          messageDisplay.value?.logMessage(`Error: ${(error as any).message}`, 'error');
        });
      }, loopInterval.value);
      loop.isLooping = true;
    } else {
      (async () => {
        try {
          const data = await apiCall.fn(tokenAddress.value.trim(), poolAddress, '');
          lastFetchedTokenData.value = data;
          isLoading.value = false;
          statusMessage.value = 'API calls completed.';
          messageDisplay.value?.logMessage('API calls completed.', 'info');
        } catch (error) {
          console.error(error);
          messageDisplay.value?.logMessage(`Error: ${(error as any).message}`, 'error');
        }
      })();
    }

    loops.value.push(loop);
  }

  isLoading.value = false;
};

const stopAllLoops = () => {
  for (const loop of loops.value) {
    if (loop.stopLoop) {
      loop.stopLoop();
      loop.isLooping = false;
    }
  }
  statusMessage.value = 'All loops stopped.';
  const messageDisplay = ref<typeof MessageDisplay>();
  messageDisplay.value?.logMessage('All loops stopped.', 'info');
};

const toggleLoop = (loop: any) => {
  const messageDisplay = ref<typeof MessageDisplay>();
  const poolAddress = ''; // Define poolAddress here
  if (loop.isLooping) {
    loop.stopLoop?.();
    loop.isLooping = false;
    messageDisplay.value?.logMessage(`Loop for ${loop.apiCall} stopped.`, 'info');
  } else {
    loop.stopLoop = runWithInterval(async () => {
      try {
        const owner = ''; // Define owner here
        await apiCalls.find(apiCall => apiCall.name === loop.apiCall)?.fn(loop.token, poolAddress, owner);
      } catch (error) {
        console.error(error);
        messageDisplay.value?.logMessage(`Error: ${error.message}`, 'error');
      }
    }, loopInterval.value);
    loop.isLooping = true;
    messageDisplay.value?.logMessage(`Loop for ${loop.apiCall} started.`, 'info');
  }
};

const removeLoop = (loopId: number) => {
  const loopIndex = loops.value.findIndex(loop => loop.id === loopId);
  if (loopIndex !== -1) {
    const loop = loops.value[loopIndex];
    loop.stopLoop?.();
    loops.value.splice(loopIndex, 1);
    const messageDisplay = ref<MessageDisplay>();
    messageDisplay.value?.logMessage(`Loop for ${loop.apiCall} removed.`, 'info');
  }
};

const loadTokenOverview = async (token: string) => {
  await fetchMostRecentTokenData(token);
};

watch(tokenAddress, async () => {
  try {
    lastFetchedTokenData.value = null;
    await fetchMostRecentTokenData(tokenAddress.value);
  } catch (err) {
    console.error('Error in watcher:', err);
  }
});
</script>

<style scoped>
.container {
  padding: 1rem;
  margin-block: 0;
  margin-inline: auto;
  max-inline-size: 800px;
}

.token-input {
  display: block;
  padding: 0.5rem;
  font-size: 1rem;
  inline-size: 100%;
  margin-block-end: 1rem;
  max-inline-size: 300px;
}

.buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-block-end: 1rem;
}

.api-buttons {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-block-size: 200px;
  overflow-y: auto;
}

.api-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.loop-settings {
  margin-block-end: 1rem;
}

.overview-container {
  display: flex;
  gap: 2rem;
  margin-block-start: 2rem;
}

.loops-table {
  margin-block-start: 2rem;
}

table {
  border-collapse: collapse;
  inline-size: 100%;
}

th,
td {
  padding: 0.5rem;
  border: 1px solid #ddd;
  text-align: start;
}

th {
  background-color: #f2f2f2;
}
</style>
