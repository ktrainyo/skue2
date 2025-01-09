

<template>
  <div>
    <!-- Add Token Form -->
    <v-card class="mb-4">
      <v-card-title>Add a New Token</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="tokenAddress"
            label="Token Address"
            required
            :rules="[rules.required]"
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            color="primary"
            class="mt-3"
            @click="submitToken"
          >Submit</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Token List -->
    <VCardText>
      <VRow>
        <VCol cols="12" offset-md="8" md="4">
          <AppTextField
            v-model="search"
            placeholder="Search ..."
            append-inner-icon="tabler-search"
            single-line
            hide-details
            dense
            outlined
          />
        </VCol>
      </VRow>
    </VCardText>

    <!-- Data Table -->
    <VDataTable
      :headers="headers"
      :items="tokens || []"
      :search="search"
      :items-per-page="5"
      class="text-no-wrap"
    >
      <!-- Name -->
      <template #item.name="{ item }">
        <span>{{ item.name }}</span>
      </template>

      <!-- Address -->
      <template #item.token="{ item }">
        <span>{{ item.token }}</span>
      </template>

      <!-- Price -->
      <template #item.price_usd="{ item }">
        <span v-html="formatCompactUSD(item.price_usd)"></span>
      </template>

      <!-- Volume -->
      <template #item.buy_volume_24h="{ item }">
        <span>{{ formatNumber(item.buy_volume_24h) }}</span>
      </template>

      <!-- Market Cap -->
      <template #item.current_market_cap="{ item }">
        <span>{{ formatCurrency(item.current_market_cap) }}</span>
      </template>

      <!-- Liquidity -->
      <template #item.liquidity="{ item }">
        <span>{{ formatCurrency(item.liquidity) }}</span>
      </template>

      <!-- Timestamp -->
      <template #item.timestamp="{ item }">
        <span>{{ formatTimestamp(item.timestamp) }}</span>
      </template>
    </VDataTable>

    <!-- Token Data Display -->
    <v-card class="mb-4">
      <v-card-title>Token Data</v-card-title>
      <v-card-text v-if="tokenData">
        <div><strong>Token:</strong> {{ tokenData.token }}</div>
        <div><strong>Name:</strong> {{ tokenData.name }}</div>
        <div><strong>Symbol:</strong> {{ tokenData.symbol }}</div>
        <div><strong>Buy Volume 1m:</strong> {{ tokenData.buy_volume_1m }}</div>
        <div><strong>Buy Volume 5m:</strong> {{ tokenData.buy_volume_5m }}</div>
        <div><strong>Buy Volume 15m:</strong> {{ tokenData.buy_volume_15m }}</div>
        <div><strong>Buy Volume 30m:</strong> {{ tokenData.buy_volume_30m }}</div>
        <div><strong>Buy Volume 1h:</strong> {{ tokenData.buy_volume_1h }}</div>
        <div><strong>Buy Volume 4h:</strong> {{ tokenData.buy_volume_4h }}</div>
        <div><strong>Buy Volume 24h:</strong> {{ tokenData.buy_volume_24h }}</div>
        <div><strong>Buy Volume 1w:</strong> {{ tokenData.buy_volume_1w }}</div>
        <div><strong>Sell Volume 1m:</strong> {{ tokenData.sell_volume_1m }}</div>
        <div><strong>Sell Volume 5m:</strong> {{ tokenData.sell_volume_5m }}</div>
        <div><strong>Sell Volume 15m:</strong> {{ tokenData.sell_volume_15m }}</div>
        <div><strong>Sell Volume 30m:</strong> {{ tokenData.sell_volume_30m }}</div>
        <div><strong>Sell Volume 1h:</strong> {{ tokenData.sell_volume_1h }}</div>
        <div><strong>Sell Volume 4h:</strong> {{ tokenData.sell_volume_4h }}</div>
        <div><strong>Sell Volume 24h:</strong> {{ tokenData.sell_volume_24h }}</div>
        <div><strong>Sell Volume 1w:</strong> {{ tokenData.sell_volume_1w }}</div>
        <div><strong>Last Buy Timestamp:</strong> {{ tokenData.last_buy_timestamp }}</div>
        <div><strong>Last Sell Timestamp:</strong> {{ tokenData.last_sell_timestamp }}</div>
        <div><strong>Price Usd:</strong> {{ tokenData.price_usd }}</div>
        <div><strong>Price Sol:</strong> {{ tokenData.price_sol }}</div>
        <div><strong>Current Market Cap:</strong> {{ tokenData.current_market_cap }}</div>
        <div><strong>Bonding Market Cap:</strong> {{ tokenData.bonding_market_cap }}</div>
        <div><strong>Bonding Progress:</strong> {{ tokenData.bonding_progress }}</div>
        <div><strong>Id:</strong> {{ tokenData.id }}</div>
        <div><strong>Deployer:</strong> {{ tokenData.deployer }}</div>
        <div><strong>Deploy Timestamp:</strong> {{ tokenData.deploy_timestamp }}</div>
        <div><strong>Mint:</strong> {{ tokenData.mint }}</div>
        <div><strong>Decimals:</strong> {{ tokenData.decimals }}</div>
        <div><strong>Initial Supply:</strong> {{ tokenData.initial_supply }}</div>
        <div><strong>Total Supply:</strong> {{ tokenData.total_supply }}</div>
        <div><strong>Description:</strong> {{ tokenData.description }}</div>
        <div><strong>Mint Authority:</strong> {{ tokenData.mint_authority }}</div>
        <div><strong>Freeze Authority:</strong> {{ tokenData.freeze_authority }}</div>
        <div><strong>Twitter:</strong> <a :href="tokenData.twitter" target="_blank">{{ tokenData.twitter }}</a></div>
        <div><strong>Telegram:</strong> <a :href="tokenData.telegram" target="_blank">{{ tokenData.telegram }}</a></div>
        <div><strong>Website:</strong> <a :href="tokenData.website" target="_blank">{{ tokenData.website }}</a></div>
        <div><strong>Uri:</strong> <a :href="tokenData.uri" target="_blank">{{ tokenData.uri }}</a></div>
        <div><strong>Image Uri:</strong> <a :href="tokenData.image_uri" target="_blank">{{ tokenData.image_uri }}</a></div>
        <div><strong>Is Complete:</strong> {{ tokenData.is_complete }}</div>
        <div><strong>Complete Timestamp:</strong> {{ tokenData.complete_timestamp }}</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import { onMounted, ref } from 'vue';

interface Token {
  name: string;
  token: string;
  price_usd: number;
  buy_volume_24h: number;
  current_market_cap: number;
  liquidity: number;
  timestamp: number;
}

const tokens = ref<Token[]>([]);
const search = ref('');
const tokenAddress = ref('');
const valid = ref(false);
const tokenData = ref(null);
const rules = {
  required: (value: string) => !!value || "Token address is required",
};

// headers
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Address', key: 'token' },
  { title: 'Price', key: 'price_usd' },
  { title: 'Volume', key: 'buy_volume_24h' },
  { title: 'Market Cap', key: 'current_market_cap' },
  { title: 'Liquidity', key: 'liquidity' },
  { title: 'Timestamp', key: 'timestamp' },
];

const formatCurrency = (value: number) => {
  if (typeof value !== 'number') return value;
  return `$${value.toFixed(2)}`;
};

const formatNumber = (value: number) => {
  if (typeof value !== 'number') return value;
  return value.toLocaleString();
};

const formatCompactUSD = (value: number) => {
  if (typeof value !== 'number') return value;
  return `$${value.toFixed(2)}`;
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const fetchTokens = async () => {
  try {
    const { data: volumeData, error: volumeError } = await supabase
      .from('call_static_tokens_volume')
      .select('*');

    if (volumeError) {
      console.error(volumeError);
      return;
    }

    const { data: marketData, error: marketError } = await supabase
      .from('call_static_tokens_market')
      .select('*');

    if (marketError) {
      console.error(marketError);
      return;
    }

    const { data: metadata, error: metadataError } = await supabase
      .from('call_static_tokens_metadata')
      .select('*');

    if (metadataError) {
      console.error(metadataError);
      return;
    }

    const combinedData = volumeData.map(volumeItem => {
      const marketItem = marketData.find(item => item.token === volumeItem.token);
      const metadataItem = metadata.find(item => item.token === volumeItem.token);

      if (!marketItem || !metadataItem) {
        return null;
      }

      return {
        name: metadataItem.name,
        token: volumeItem.token,
        price_usd: parseFloat(marketItem.price_usd),
        buy_volume_24h: parseFloat(volumeItem.buy_volume_24h),
        current_market_cap: parseFloat(marketItem.current_market_cap),
        liquidity: parseFloat(metadataItem.total_supply) * parseFloat(marketItem.price_sol),
        timestamp: volumeItem.timestamp || marketItem.timestamp || metadataItem.timestamp,
      };
    }).filter(item => item !== null);

    console.log("Combined data:", combinedData);
    tokens.value = combinedData;
  } catch (error) {
    console.error("Error fetching tokens:", error);
  }
};

const submitToken = async () => {
  try {
    // Insert token using Go middleware
    const headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
    };

    const bodyContent = JSON.stringify({
      "address": tokenAddress.value
    });

    const reqOptions = {
      url: "http://192.168.50.226:8001/fetch-token-data",
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    const response = await axios.request(reqOptions);
    console.log(response.data);

    // Fetch token data from Supabase
    const { data: volumeData, error: volumeError } = await supabase
      .from('call_static_tokens_volume')
      .select('*')
      .eq('token', tokenAddress.value)
      .single();

    if (volumeError) {
      throw volumeError;
    }

    const { data: marketData, error: marketError } = await supabase
      .from('call_static_tokens_market')
      .select('*')
      .eq('token', tokenAddress.value)
      .single();

    if (marketError) {
      throw marketError;
    }

    const { data: metadata, error: metadataError } = await supabase
      .from('call_static_tokens_metadata')
      .select('*')
      .eq('token', tokenAddress.value)
      .single();

    if (metadataError) {
      throw metadataError;
    }

    // Combine all token data
    tokenData.value = {
      ...volumeData,
      ...marketData,
      ...metadata,
    };

    // Add the new token data to the tokens array
    tokens.value.push({
      name: metadata.name,
      token: volumeData.token,
      price_usd: parseFloat(marketData.price_usd),
      buy_volume_24h: parseFloat(volumeData.buy_volume_24h),
      current_market_cap: parseFloat(marketData.current_market_cap),
      liquidity: parseFloat(metadata.total_supply) * parseFloat(marketData.price_sol),
      timestamp: volumeData.timestamp || marketData.timestamp || metadata.timestamp,
    });

    // Send the token address to the Python service
    const token = tokenAddress.value;
    axios.post('http://192.168.50.226:8185/process_token', { token: token })
      .then(response => {
        console.log('Token processed successfully:', response.data);
      })
      .catch(error => {
        console.error('Error processing token:', error);
      });

  } catch (error) {
    console.error("Error submitting token:", error);
  }
};

onMounted(() => {
  fetchTokens();

  // Subscribe to changes in the Supabase tables
  supabase
    .channel('public:call_static_tokens_volume')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'call_static_tokens_volume' }, payload => {
      console.log("Volume data changed:", payload);
      fetchTokens();
    })
    .subscribe();

  supabase
    .channel('public:call_static_tokens_market')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'call_static_tokens_market' }, payload => {
      console.log("Market data changed:", payload);
      fetchTokens();
    })
    .subscribe();

  supabase
    .channel('public:call_static_tokens_metadata')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'call_static_tokens_metadata' }, payload => {
      console.log("Metadata changed:", payload);
      fetchTokens();
    })
    .subscribe();
});
</script>

<style scoped>
/* Add any component-specific styles here */
img {
  max-block-size: 75px;
  max-inline-size: 75px;
}
</style>
