<template>
  <div>
    <v-card class="mb-4">
      <v-card-title>Token Form</v-card-title>
      <v-card-text>
        <TokenForm @submitToken="submitToken" />
      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title>call-static-tokens-page</v-card-title>
      <v-card-text>
        <TokenSearch v-model="search" />
      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title>Token Stats</v-card-title>
      <v-card-text>
        <TokenStats :tokens="tokens" />
      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title>Token Table</v-card-title>
      <v-card-text>
        <TokenTable :tokens="tokens" :search="search" @selectToken="selectToken" />
      </v-card-text>
    </v-card>

    <v-card class="mb-4" v-if="selectedToken">
      <v-card-title>Token Details</v-card-title>
      <v-card-text>
        <TokenDetails :tokenData="selectedToken" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import TokenDetails from "@/components/Token/TokenDetails.vue";
import TokenForm from "@/components/Token/TokenForm.vue";
import TokenSearch from "@/components/Token/TokenSearch.vue";
import TokenStats from "@/components/Token/TokenStats.vue";
import TokenTable from "@/components/Token/TokenTable.vue";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import { onMounted, ref } from "vue";


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
const selectedToken = ref<Token | null>(null);

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

    tokens.value = combinedData as Token[];
  } catch (error) {
    console.error("Error fetching tokens:", error);
  }
};

const submitToken = async (tokenAddress: string) => {
  try {
    const headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
    };

    const bodyContent = JSON.stringify({
      "address": tokenAddress
    });

    const reqOptions = {
      url: "http://192.168.50.226:8001/fetch-token-data",
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    const response = await axios.request(reqOptions);
    console.log(response.data);

    const { data: volumeData, error: volumeError } = await supabase
      .from('call_static_tokens_volume')
      .select('*')
      .eq('token', tokenAddress)
      .single();

    if (volumeError) {
      throw volumeError;
    }

    const { data: marketData, error: marketError } = await supabase
      .from('call_static_tokens_market')
      .select('*')
      .eq('token', tokenAddress)
      .single();

    if (marketError) {
      throw marketError;
    }

    const { data: metadata, error: metadataError } = await supabase
      .from('call_static_tokens_metadata')
      .select('*')
      .eq('token', tokenAddress)
      .single();

    if (metadataError) {
      throw metadataError;
    }

    selectedToken.value = {
      ...volumeData,
      ...marketData,
      ...metadata,
    };

    tokens.value.push({
      name: metadata.name,
      token: volumeData.token,
      price_usd: parseFloat(marketData.price_usd),
      buy_volume_24h: parseFloat(volumeData.buy_volume_24h),
      current_market_cap: parseFloat(marketData.current_market_cap),
      liquidity: parseFloat(metadata.total_supply) * parseFloat(marketData.price_sol),
      timestamp: volumeData.timestamp || marketData.timestamp || metadata.timestamp,
    });

    axios.post('http://127.0.0.1:8185/process_token', { token: tokenAddress })
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

const selectToken = (token: Token) => {
  selectedToken.value = token;
};
2
onMounted(() => {
  fetchTokens();

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
img {
  max-block-size: 75px;
  max-inline-size: 75px;
}
</style>
