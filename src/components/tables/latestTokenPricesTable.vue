<template>
  <div class="latest-token-prices-table">
    <h3>Latest Token Prices</h3>
    <SupabaseRealtimeDisplay
      table-name="latest_token_prices"
      @data-updated="refreshData"
    >
      <template #default="{ latestTokenPrices }">
        <v-data-table
          :headers="headers"
          :items="uniqueTokens(latestTokenPrices)"
          density="compact"
          :items-per-page="itemsPerPage"
          :page.sync="currentPage"
          @click:row="openDialog"
        >
          <template #header.token>
            <strong>Token Addrs</strong>
          </template>
          <template #header.price>
            <strong>Price USD</strong>
          </template>
          <template #header.priceSol>
            <strong>Price SOL</strong>
          </template>
          <template #header.liquidity>
            <strong>Liquidity</strong>
          </template>
          <template #header.marketCap>
            <strong>MarketCap</strong>
          </template>
          <template #header.lastUpdated>
            <strong>Updated On</strong>
          </template>
          <template #header.priceQuote>
            <strong>pRICEqUOTE</strong>
          </template>
          <!-- Custom rendering for Price USD -->
          <template #item.price="{ item }">
            <span v-html="$formatPrice(item.price ?? 0)"></span>
          </template>

          <!-- Dynamically calculated Price SOL -->
          <template #item.priceSol="{ item }">
            <span v-html="$formatPrice(item.priceSol ?? 0)"></span>
          </template>

          <!-- Other custom cells -->
          <template #item.liquidity="{ item }">
            <span v-html="$formatPrice(item.liquidity ?? 0)"></span>
          </template>
          <template #item.marketCap="{ item }">
            <span v-html="$formatPrice(item.marketCap ?? 0)"></span>
          </template>
          <template #item.lastUpdated="{ item }">
            {{ formatDatePST(item.lastUpdated) }}
          </template>
          <template #item.priceQuote="{ item }">
            <span v-html="$formatPrice(item.priceQuote ?? 0)"></span>
          </template>
        </v-data-table>
        <TokenDialog
          :token="selectedToken"
          :isDialogOpen="isDialogOpen"
          @add-token="addTokenToSelection"
          @close-dialog="closeDialog"
        />
      </template>
    </SupabaseRealtimeDisplay>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SupabaseRealtimeDisplay from "@/components/SupabaseRealtimeDisplay.vue";
import { solPrice } from "@/components/data-fetchers/SolUsdTicker.vue";
import { VDataTable } from "vuetify/components";
import TokenDialog from "@/components/tables/TokenDialog.vue";
import { makeVFieldProps } from "vuetify/lib/components/VField/VField";
import { paginationMeta } from "../../utils/paginationMeta";

export default defineComponent({
  name: "LatestTokenPricesTable",
  components: {
    SupabaseRealtimeDisplay,
    VDataTable,
    TokenDialog,
  },
  setup(_, { emit }) {
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const latestTokenPrices = ref<any[]>([]);
    const isDialogOpen = ref(false);
    const selectedToken = ref("");

    const headers = [
      { text: "Token", value: "token" },
      { text: "Price USD", value: "price" },
      { text: "Price SOL", value: "priceSol" },
      { text: "Liquidity", value: "liquidity" },
      { text: "Market Cap", value: "marketCap" },
      { text: "Last Updated", value: "lastUpdated" },
      { text: "Price Quote", value: "priceQuote" },
    ];

    const uniqueTokens = (data: any[]) => {
      const tokenMap = new Map();
      data.forEach((token) => {
        if (
          !tokenMap.has(token.token) ||
          new Date(token.lastUpdated) >
            new Date(tokenMap.get(token.token).lastUpdated)
        ) {
          // Calculate priceSol and add it to each token
          tokenMap.set(token.token, {
            ...token,
            priceSol: convertToSol(token.price ?? 0),
          });
        }
      });
      return Array.from(tokenMap.values()).sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
    };

    const formatDatePST = (date: string) => {
      const options = {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
    };

    const refreshData = (data: any[]) => {
      latestTokenPrices.value = data;
    };

    const convertToSol = (usdPrice: number) => {
      if (solPrice.value === null) return 0;

      return usdPrice / solPrice.value;
    };

    const openDialog = (event: any) => {
      const item = event.item;
      if (item && item.token) {
        selectedToken.value = item.token;
      } else {
        selectedToken.value = "Unknown Token";
      }
      isDialogOpen.value = true;
    };

    const closeDialog = () => {
      isDialogOpen.value = false;
    };

    const addTokenToSelection = (token: string) => {
      emit("token-click", token);
    };

    return {
      currentPage,
      itemsPerPage,
      uniqueTokens,
      formatDatePST,
      refreshData,
      convertToSol,
      openDialog,
      closeDialog,
      addTokenToSelection,
      latestTokenPrices,
      headers,
      isDialogOpen,
      selectedToken,
    };
  },
});
</script>

<style scoped>
.latest-token-prices-table {
  margin-top: 20px;
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  margin: 0 5px;
}

sub {
  vertical-align: sub;
  font-size: smaller;
}
</style>
