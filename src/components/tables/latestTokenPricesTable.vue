<template>
  <div class="latest-token-prices-table">
    <h3>Latest Token Prices</h3>
    <supabase-realtime-display
      tableName="latest_token_prices"
      @data-updated="refreshData"
    >
      <template #default="{ fetchedData }">
        <v-simple-table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Price USD</th>
              <th>Price SOL</th>
              <th>Liquidity</th>
              <th>Market Cap</th>
              <th>Last Updated</th>
              <th>Price Quote</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="token in uniqueTokens(fetchedData)"
              :key="token.token"
              @click="emitTokenClick(token.token)"
            >
              <td>{{ token.token }}</td>
              <td v-html="'$' + $formatPrice(token.price ?? 0)"></td>
              <td v-html="$formatPrice(convertToSol(token.price ?? 0))"></td>
              <td v-html="$formatPrice(token.liquidity ?? 0)"></td>
              <td v-html="$formatPrice(token.marketCap ?? 0)"></td>
              <td>{{ formatDate(token.lastUpdated) }}</td>
              <td v-html="$formatPrice(token.priceQuote ?? 0)"></td>
            </tr>
          </tbody>
        </v-simple-table>
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="currentPage--">
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages(fetchedData) }}</span>
          <button
            :disabled="currentPage === totalPages(fetchedData)"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </template>
    </supabase-realtime-display>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import SupabaseRealtimeDisplay from "@/components/SupabaseRealtimeDisplay.vue";
import { solPrice } from "@/components/data-fetchers/SolUsdTicker.vue";
import { VSimpleTable } from "vuetify/components";

export default defineComponent({
  name: "LatestTokenPricesTable",
  components: {
    SupabaseRealtimeDisplay,
    VSimpleTable,
  },
  setup(_, { emit }) {
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const fetchedData = ref<any[]>([]);

    const totalPages = (data: any[]) => Math.ceil(data.length / itemsPerPage);

    const uniqueTokens = (data: any[]) => {
      const tokenMap = new Map();
      data.forEach((token) => {
        if (
          !tokenMap.has(token.token) ||
          new Date(token.lastUpdated) >
            new Date(tokenMap.get(token.token).lastUpdated)
        ) {
          tokenMap.set(token.token, token);
        }
      });
      const sortedTokens = Array.from(tokenMap.values())
        .sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
        )
        .slice(
          (currentPage.value - 1) * itemsPerPage,
          currentPage.value * itemsPerPage
        );

      console.log("Unique tokens after processing:", sortedTokens); // Add this log
      return sortedTokens;
    };
    const formatDate = (date: string) => new Date(date).toLocaleString("en-US");

    const emitTokenClick = (token: string) => {
      emit("token-click", token);
    };

    const refreshData = (data: any[]) => {
      fetchedData.value = data;
    };

    const convertToSol = (usdPrice: number) => {
      if (solPrice.value === null) return 0;
      return usdPrice / solPrice.value;
    };

    return {
      currentPage,
      totalPages,
      uniqueTokens,
      formatDate,
      emitTokenClick,
      refreshData,
      convertToSol,
      fetchedData,
    };
  },
});
</script>

<style scoped>
.latest-token-prices-table {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  border: 1px solid #ccc;
  text-align: left;
}

tbody tr {
  cursor: pointer;
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
