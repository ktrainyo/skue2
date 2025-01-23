<template>
  <div class="token-tracking-table">
    <DataTable
      :value="tokens"
      :paginator="true"
      :rows="10"
      :sortField="sortField"
      :sortOrder="sortOrder"
      @sort="onSort"
      class="p-datatable-gridlines p-datatable-striped"
    >
      <Column header="Actions">
        <template #body="slotProps">
          <Button label="Add to Tracking" @click="addToTracking(slotProps.data)"></Button>
          <Button label="Remove from Tracking" @click="removeFromTracking(slotProps.data)"></Button>
        </template>
      </Column>
      <Column field="name" header="Token Name" sortable></Column>
      <Column field="price" header="Price" sortable>
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.price) }}
        </template>
      </Column>
      <Column field="liquidity" header="Liquidity" sortable>
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.liquidity) }}
        </template>
      </Column>
      <Column field="marketCap" header="Market Cap" sortable>
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.marketCap) }}
        </template>
      </Column>
      <Column field="transactions" header="Transactions" sortable>
        <template #body="slotProps">
          {{ slotProps.data.transactions }}
        </template>
      </Column>
      <Column field="priceChange1m" header="1m Change" sortable>
        <template #body="slotProps">
          {{ formatPercentage(slotProps.data.priceChange1m) }}
        </template>
      </Column>
      <Column field="priceChange5m" header="5m Change" sortable>
        <template #body="slotProps">
          {{ formatPercentage(slotProps.data.priceChange5m) }}
        </template>
      </Column>
      <Column field="mint_address_new" header="Address"></Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/supabaseClient';
import { fetchTokenPrice } from '@/utils/priceService';
import { fetchTokenTrades } from '@/utils/tradeService';
import { Button, Column, DataTable } from 'primevue';
import { onMounted, ref } from 'vue';

const tokens = ref<any[]>([]);
const sortField = ref('');
const sortOrder = ref(1);
const trackingIntervals = ref<{ [key: string]: ReturnType<typeof setInterval> }>({});

const fetchQualifiedTokens = async () => {
  try {
    const { data: tokenData, error: tokenError } = await supabase
      .from('new_token_data')
      .select(`
        *,
        new_token_pools (
          usd_liquidity,
          usd_price,
          market_cap_usd
        ),
        new_token_events (
          price_change_percentage
        )
      `)
      .eq('qualified', true);

    if (tokenError) {
      console.error('Error fetching qualified tokens:', tokenError.message);
      return;
    }

    tokens.value = tokenData.map(token => ({
      ...token,
      price: token.new_token_pools?.[0]?.usd_price || 0,
      liquidity: token.new_token_pools?.[0]?.usd_liquidity || 0,
      marketCap: token.new_token_pools?.[0]?.market_cap_usd || 0,
      transactions: token.transactions || 0,
      priceChange1m: token.new_token_events?.[0]?.price_change_percentage || 0,
      priceChange5m: token.new_token_events?.[1]?.price_change_percentage || 0,
    }));
  } catch (error) {
    console.error('Unexpected error fetching qualified tokens:', error);
  }
};

onMounted(() => {
  fetchQualifiedTokens();
});

const onSort = (event: any) => {
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;
};

const addToTracking = async (token: any) => {
  console.log('Add to Tracking:', token);
  try {
    // Fetch token trades initially
    await fetchTokenTrades(token.mint_address_new);

    // Start a loop to fetch token price every 5 seconds
    if (trackingIntervals.value[token.mint_address_new]) {
      clearInterval(trackingIntervals.value[token.mint_address_new]);
    }
    trackingIntervals.value[token.mint_address_new] = setInterval(async () => {
      await fetchTokenPrice(token.mint_address_new);
    }, 5000);
  } catch (error) {
    console.error('Error in addToTracking:', error);
  }
};

const removeFromTracking = (token: any) => {
  console.log('Remove from Tracking:', token);
  // Clear the interval for the token
  if (trackingIntervals.value[token.mint_address_new]) {
    clearInterval(trackingIntervals.value[token.mint_address_new]);
    delete trackingIntervals.value[token.mint_address_new];
  }
  // Implement additional logic to remove the token from tracking if needed
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};
</script>

<style scoped>
.token-tracking-table {
  margin: 1rem;
  inline-size: 100%; /* Ensure the table container takes up the full width */
}

.p-datatable-gridlines .p-datatable-tbody > tr > td {
  border: 1px solid #ddd;
}

.p-datatable-striped .p-datatable-tbody > tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
