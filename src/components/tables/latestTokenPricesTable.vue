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
          item-value="token"
          show-select
          :model-value="selectedTokens"
          @update:modelValue="updateSelectedTokens"
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
            <strong>Price Quote</strong>
          </template>
          <!-- Custom rendering for Token -->
          <template #item.token="{ item }">
            <span class="token-address" @click="copyToClipboard(item.token)">
              {{ item.token }}
            </span>
          </template>
          <!-- Custom rendering for Price USD -->
          <template #item.price="{ item }">
            <span v-html="formatPrice(item.price ?? 0)"></span>
          </template>

          <!-- Dynamically calculated Price SOL -->
          <template #item.priceSol="{ item }">
            <span v-html="formatPrice(item.priceSol ?? 0)"></span>
          </template>

          <!-- Other custom cells -->
          <template #item.liquidity="{ item }">
            <span v-html="formatPrice(item.liquidity ?? 0)"></span>
          </template>
          <template #item.marketCap="{ item }">
            <span v-html="formatPrice(item.marketCap ?? 0)"></span>
          </template>
          <template #item.lastUpdated="{ item }">
            {{ formatDatePST(item.lastUpdated) }}
          </template>
          <template #item.priceQuote="{ item }">
            <span v-html="formatPrice(item.priceQuote ?? 0)"></span>
          </template>
        </v-data-table>
      </template>
    </SupabaseRealtimeDisplay>
    <v-snackbar v-model="snackbar" :timeout="2000">{{
      snackbarMessage
    }}</v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import SupabaseRealtimeDisplay from "@/components/SupabaseRealtimeDisplay.vue";
import { solPrice } from "@/components/data-fetchers/SolUsdTicker.vue";
import { VDataTable, VSnackbar } from "vuetify/components";
import { formatPrice } from "@/plugins/3.priceFormatter"; // Import the formatPrice function

export default defineComponent({
  name: "LatestTokenPricesTable",
  components: {
    SupabaseRealtimeDisplay,
    VDataTable,
    VSnackbar,
  },
  props: {
    selectedTokens: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  emits: ["update:selectedTokens"],
  setup(props, { emit }) {
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const latestTokenPrices = ref<any[]>([]);
    const snackbar = ref(false);
    const snackbarMessage = ref("");

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
      const options: Intl.DateTimeFormatOptions = {
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

    const updateSelectedTokens = (tokens: any[]) => {
      console.log("Selected tokens:", tokens); // Debugging line
      if (!Array.isArray(tokens)) {
        console.error("Expected an array of tokens, but got:", tokens);
        return;
      }
      const tokenAddresses = tokens
        .map((token) => {
          if (typeof token === "string") {
            return token; // Handle case where token is a string
          }
          if (!token || !token.token) {
            console.error("Invalid token structure:", token);
            return null;
          }
          return token.token;
        })
        .filter(Boolean); // Filter out null values
      emit("update:selectedTokens", tokenAddresses);
    };

    const copyToClipboard = (text: string) => {
      if (!navigator.clipboard) {
        console.error("Clipboard API not available");
        snackbarMessage.value = "Clipboard API not available";
        snackbar.value = true;
        return;
      }

      navigator.clipboard.writeText(text).then(
        () => {
          snackbarMessage.value = "Copied";
          snackbar.value = true;
        },
        (err) => {
          console.error("Could not copy text: ", err);
          snackbarMessage.value = "Failed to copy";
          snackbar.value = true;
        }
      );
    };

    return {
      currentPage,
      itemsPerPage,
      uniqueTokens,
      formatDatePST,
      refreshData,
      convertToSol,
      latestTokenPrices,
      headers,
      updateSelectedTokens,
      formatPrice,
      copyToClipboard,
      snackbar,
      snackbarMessage,
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

.token-address {
  font-size: 8px;
  cursor: pointer;
}

sub {
  vertical-align: sub;
  font-size: smaller;
}
</style>
