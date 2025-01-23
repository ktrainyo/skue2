<template>
  <div class="token-table">
    <!-- PrimeVue DataTable with Pagination and Scrollable Layout -->
    <DataTable
      :value="tokens"
      :lazy="true"
      :paginator="true"
      :rows="5"
      :total-records="totalRecords"
      @page="onPage"
      responsive-layout="scroll"
      class="p-datatable-gridlines p-datatable-striped"
      v-memo="[tokens, totalRecords]"
    >
      <!-- Auto Update Switch -->
      <Column header="Auto Update" class="auto-update-column">
        <template #body="slotProps">
          <div class="auto-update-switch">
            <ToggleSwitch
              v-model="slotProps.data.isPolling"
              @change="togglePolling(slotProps.data)"
            />
          </div>
        </template>
      </Column>

      <!-- Frequency Dropdown -->
      <Column header="Frequency" class="frequency-column">
        <template #body="slotProps">
          <Select
            :options="frequencies"
            v-model="slotProps.data.frequency"
            @change="updateFrequency(slotProps.data)"
            optionLabel="label"
            placeholder="Select Frequency"
          />
        </template>
      </Column>

      <!-- Name Column (Clickable Link) -->
      <Column
        field="title"
        header="Name"
        class="name-column"
      >
        <template #body="slotProps">
          <a href="#" @click.prevent="showTokenOverview(slotProps.data.token)">
            {{ slotProps.data.title }}
          </a>
        </template>
      </Column>

      <!-- Price USD -->
      <Column field="priceusd" header="Price USD" class="price-column">
        <template #body="slotProps">
          {{ formatPriceUSD(slotProps.data.priceusd) }}
        </template>
      </Column>
      <Column field="marketcap" header="Market Cap" class="marketcap-column">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.marketcap) }}
        </template>
      </Column>
      <Column field="liquidity" header="Liquidity" class="liquidity-column">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.liquidity) }}
        </template>
      </Column>

      <!-- Address Column (Clickable Link) -->
      <Column
        field="token"
        header="Address"
        class="address-column"
      >
        <template #body="slotProps">
          <a href="#" @click.prevent="showTokenOverview(slotProps.data.token)">
            {{ slotProps.data.token }}
          </a>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { getSupabaseClient } from '@/composables/useSupabase';
import { fetchTokenChartData } from '@/utils/chartService';
import Select from 'primevue/select';
import ToggleSwitch from 'primevue/toggleswitch';
import { defineComponent, onMounted, ref } from 'vue';

const supabase = getSupabaseClient();

export default defineComponent({
  name: 'TokenTableList',
  components: {
    Select,
    ToggleSwitch,
  },
  emits: ['tokenSelected'],
  setup(props, { emit }) {
    const tokens = ref<any[]>([]);
    const totalRecords = ref(0);
    const frequencies = ref([
      { label: '5s', value: 5000 },
      { label: '30s', value: 30000 },
      { label: '1m', value: 60000 },
      { label: '5m', value: 300000 },
      { label: '15m', value: 900000 },
      { label: '30m', value: 1800000 },
    ]);

    // Fetch Tokens from Supabase
    const fetchTokens = async (page: number = 0, rows: number = 5) => {
      const start = page * rows;
      const end = start + rows;

      const { data, error, count } = await supabase
        .from('token_overview')
        .select('title, token, priceusd, marketcap, liquidity')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching tokens:', error.message);
      } else {
        // Filter out duplicate tokens, keeping only the most recent entry for each token
        const uniqueTokens = new Map();
        data.forEach((token: any) => {
          if (!uniqueTokens.has(token.token)) {
            uniqueTokens.set(token.token, token);
          }
        });

        const uniqueTokenArray = Array.from(uniqueTokens.values());

        tokens.value = uniqueTokenArray.slice(start, end).map((token: any) => ({
          ...token,
          frequency: token.frequency || 60000, // Default frequency: 1 minute
          isPolling: token.isPolling || false, // Default polling state
        }));
        totalRecords.value = uniqueTokenArray.length;
      }
    };

    // Pagination Handler
    const onPage = (event: any) => {
      fetchTokens(event.page, event.rows);
    };

    // Auto Update Logic
    const updateFrequency = (token: any) => {
      if (token.isPolling) {
        startPolling(token);
      }
    };

    const startPolling = (token: any) => {
      stopPolling(token);
      token.timer = setInterval(async () => {
        await fetchTokenChartData(token.token);
        await fetchTokenPriceAtTimestamp(token.token, Date.now());
      }, token.frequency);
    };

    const stopPolling = (token: any) => {
      if (token.timer) {
        clearInterval(token.timer);
        token.timer = null;
      }
    };

    const togglePolling = (token: any) => {
      if (token.isPolling) {
        startPolling(token);
      } else {
        stopPolling(token);
      }
    };

    const showTokenOverview = (token: string) => {
      emit('tokenSelected', token);
    };

    const formatCurrency = (value: number | null) => {
      if (value === null) {
        return "N/A";
      }

      if (value < 1000) {
        return `$${value.toFixed(0)}`;
      } else {
        return `$${(value / 1000).toFixed(0)}k`;
      }
    };

    const formatPriceUSD = (value: number | null) => {
      if (value === null) {
        return "N/A";
      }

      if (value === 0) {
        return "$0.0";
      }

      const roundedValue = value.toFixed(10);
      const [integerPart, decimalPart] = roundedValue.split(".");

      if (!decimalPart) {
        return "$0.";
      }

      const firstNonZeroIndex = decimalPart.search(/[^0]/);
      if (firstNonZeroIndex === 0) {
        return `$${roundedValue}`;
      }

      const zeroCount = firstNonZeroIndex;
      const remainingDigits = decimalPart.slice(zeroCount);
      const displayedZeroCount = zeroCount > 1 ? zeroCount - 1 : "";

      return `$0.0${displayedZeroCount}${remainingDigits}`;
    };

    // On Component Mount
    onMounted(() => {
      fetchTokens();
    });

    return {
      tokens,
      totalRecords,
      frequencies,
      onPage,
      updateFrequency,
      togglePolling,
      showTokenOverview,
      formatCurrency,
      formatPriceUSD,
    };
  },
});
</script>

<style scoped>
/* Modern Design */
.token-table {
  font-family: Roboto, sans-serif;
  margin-block-end: 2rem;
}

.p-datatable-thead > tr > th {
  padding: 1rem;
  background-color: #4caf50; /* Vibrant green header */
  border-block-end: 2px solid #388e3c; /* Darker green separator */
  color: #fff; /* White text */
  font-size: 1rem;
  text-align: start;
  white-space: nowrap; /* Prevent word wrap */
}

.p-datatable-tbody > tr:nth-child(even) {
  background-color: #f9f9f9; /* Light gray even rows */
}

.p-datatable-tbody > tr:nth-child(odd) {
  background-color: #fff; /* White odd rows */
}

.p-datatable-tbody > tr:hover {
  background-color: #e8f5e9; /* Light green on hover */
}

.p-datatable-tbody > tr > td {
  padding: 0.875rem;
  border-block-end: 1px solid #ddd; /* Add subtle bottom border */
  font-size: 0.95rem;
}

.name-column a,
.address-column a {
  color: #2196f3; /* Vibrant blue links */
  font-weight: bold;
  text-decoration: none;
}

.name-column a:hover,
.address-column a:hover {
  color: #1565c0; /* Darker blue on hover */
  text-decoration: underline;
}

.auto-update-column,
.frequency-column {
  text-align: center; /* Center-align switches and dropdowns */
}

.auto-update-switch {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-datatable .p-paginator {
  background-color: #f1f8e9; /* Light green paginator background */
  border-block-start: 2px solid #c8e6c9; /* Green border */
}
</style>
