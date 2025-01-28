<template>
  <div class="third-page">
    <h1>API Middleware Tester</h1>

    <!-- Input Field for Tokens -->
    <div class="input-field">
      <label for="tokens">Tokens:</label>
      <input
        id="tokens"
        v-model="tokensInput"
        placeholder="Enter one or more tokens, separated by commas"
      />
      <v-btn rounded @click="addToken">+</v-btn>
    </div>

    <!-- Token Selection Box -->
    <div class="token-selection-box">
      <div class="selection-header">
        <h3>Selected Tokens</h3>
        <v-btn rounded @click="clearTokens">Clear</v-btn>
      </div>
      <div class="selected-tokens">
        <div
          v-for="token in selectedTokensArray"
          :key="token"
          class="token-item"
          @click="removeToken(token)"
        >
          {{ token }}
        </div>
      </div>
      <v-btn rounded @click="callMultiTokenPrices">
        Fetch Multi-Token Prices
      </v-btn>
    </div>

    <!-- API Call Buttons -->
    <div class="api-buttons">
      <v-btn rounded @click="callSingleTokenPrice">
        Fetch Single Token Price
      </v-btn>
      <v-btn rounded @click="callTokenData">Fetch Token Data</v-btn>
      <v-btn rounded @click="callTokenTrades">Fetch Token Trades</v-btn>
      <v-btn rounded @click="callFirstBuyers">Get First Buyers</v-btn>
    </div>

    <!-- Chart Data Options -->
    <chart-data-options
      v-if="selectedTokensArray.length === 1"
      :token="selectedTokensArray[0]"
    />

    <!-- Get Latest Tokens Button -->
    <get-latest-tokens />

    <!-- Latest Token Prices Table -->
    <latest-token-prices-table @token-click="addTokenFromTable" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import LatestTokenPricesTable from "@/components/tables/latestTokenPricesTable.vue";
import GetLatestTokens from "@/components/Token/getLatestTokens.vue";
import ChartDataOptions from "@/components/ChartDataOptions.vue";
import { getSingleTokenPrice } from "@/components/services/middleware/getSingleTokenPrice";
import { getMultiTokenPrices } from "@/components/services/middleware/getMultiTokenPrices";
import { getTokenData } from "@/components/services/middleware/getTokenData";
import { getTokenTrades } from "@/components/services/middleware/getTokenTrades";
import { getFirstBuyers } from "@/components/services/middleware/getFirstBuyers";

export default defineComponent({
  name: "ThirdPage",
  components: {
    LatestTokenPricesTable,
    GetLatestTokens,
    ChartDataOptions,
  },
  setup() {
    const tokensInput = ref("");
    const selectedTokens = ref("");

    const selectedTokensArray = computed(() =>
      selectedTokens.value.split(",").filter((token) => token.trim() !== "")
    );

    const addToken = () => {
      const token = tokensInput.value.trim();
      if (token && !selectedTokens.value.includes(token)) {
        selectedTokens.value += (selectedTokens.value ? "," : "") + token;
        tokensInput.value = "";
      }
    };

    const addTokenFromTable = (token: string) => {
      if (!selectedTokens.value.includes(token)) {
        selectedTokens.value += (selectedTokens.value ? "," : "") + token;
      }
    };

    const removeToken = (token: string) => {
      selectedTokens.value = selectedTokensArray.value
        .filter((t) => t !== token)
        .join(",");
    };

    const clearTokens = () => {
      selectedTokens.value = "";
    };

    const callSingleTokenPrice = async () => {
      const tokens = selectedTokensArray.value;
      if (tokens.length !== 1) {
        console.error(
          "The Fetch Single Token Price button will only work with one token selected."
        );
        return;
      }
      console.log("Calling getSingleTokenPrice with token:", tokens[0]);
      try {
        const response = await getSingleTokenPrice(tokens[0]);
        console.log(response);
      } catch (error) {
        console.error("Error fetching single token price:", error.message);
      }
    };

    const callTokenData = async () => {
      const tokens = selectedTokensArray.value;
      if (tokens.length !== 1) {
        console.error(
          "The Fetch Token Data button will only work with one token selected."
        );
        return;
      }
      console.log("Calling getTokenData with token:", tokens[0]);
      try {
        const response = await getTokenData(tokens[0]);
        console.log(response);
      } catch (error) {
        console.error("Error fetching token data:", error.message);
      }
    };

    const callMultiTokenPrices = async () => {
      const tokens = selectedTokensArray.value;
      if (tokens.length === 0) {
        console.error("No tokens selected.");
        return;
      }
      console.log("Calling getMultiTokenPrices with tokens:", tokens);
      try {
        const response = await getMultiTokenPrices(tokens);
        console.log(response);
      } catch (error) {
        console.error("Error fetching multi-token prices:", error.message);
      }
    };

    const callTokenTrades = async () => {
      const tokens = selectedTokensArray.value;
      if (tokens.length !== 1) {
        console.error(
          "The Fetch Token Trades button will only work with one token selected."
        );
        return;
      }
      console.log("Calling getTokenTrades with token:", tokens[0]);
      try {
        const response = await getTokenTrades(tokens[0]);
        console.log(response);
      } catch (error) {
        console.error("Error fetching token trades:", error.message);
      }
    };

    const callFirstBuyers = async () => {
      const tokens = selectedTokensArray.value;
      if (tokens.length !== 1) {
        console.error(
          "The Get First Buyers button will only work with one token selected."
        );
        return;
      }
      console.log("Calling getFirstBuyers with token:", tokens[0]);
      try {
        const response = await getFirstBuyers(tokens[0]);
        console.log(response);
      } catch (error) {
        console.error("Error fetching first buyers:", error.message);
      }
    };

    return {
      tokensInput,
      selectedTokens,
      selectedTokensArray,
      addToken,
      addTokenFromTable,
      removeToken,
      clearTokens,
      callSingleTokenPrice,
      callTokenData,
      callMultiTokenPrices,
      callTokenTrades,
      callFirstBuyers,
    };
  },
});
</script>

<style scoped>
.third-page {
  padding: 20px;
}

.input-field {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.input-field label {
  margin-right: 10px;
}

.input-field input {
  flex: 1;
  margin-right: 10px;
}

.token-selection-box {
  margin-bottom: 20px;
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-tokens {
  display: flex;
  flex-wrap: wrap;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  max-height: 5em;
}

.token-item {
  background-color: #007bff;
  color: white;
  border: 1px solid #0056b3;
  border-radius: 4px;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
}

.api-buttons {
  margin-bottom: 20px;
}

.chart-params {
  margin-bottom: 20px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
