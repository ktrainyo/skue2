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
          v-for="token in selectedTokens"
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

    <!-- Get Latest Tokens Button -->
    <get-latest-tokens />

    <!-- Latest Token Prices Table -->
    <latest-token-prices-table
      :selectedTokens="selectedTokens"
      @update:selectedTokens="updateSelectedTokens"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import LatestTokenPricesTable from "@/components/tables/latestTokenPricesTable.vue";
import GetLatestTokens from "@/components/Token/getLatestTokens.vue";
import { getSingleTokenPrice } from "@/components/services/middleware/getSingleTokenPrice";
import { getMultiTokenPrices } from "@/components/services/middleware/getMultiTokenPrices";
import { getTokenData } from "@/components/services/middleware/getTokenData";
import { getTokenTrades } from "@/components/services/middleware/getTokenTrades";
import { getFirstBuyers } from "@/components/services/middleware/getFirstBuyers";
import { useSupabase } from "@/composables/useSupabase";

export default defineComponent({
  name: "ThirdPage",
  components: {
    LatestTokenPricesTable,
    GetLatestTokens,
  },
  setup() {
    const tokensInput = ref("");
    const selectedTokens = ref<string[]>([]);
    const supabase = useSupabase();

    const addToken = async () => {
      const token = tokensInput.value.trim();
      if (token && !selectedTokens.value.includes(token)) {
        const { data, error } = await supabase
          .from("tokens")
          .select("*")
          .eq("mint", token);

        if (error) {
          console.error("Error checking token existence:", error.message);
          return;
        }

        if (data.length === 0) {
          console.log(
            "Token not found in tokens table, fetching token data..."
          );
          try {
            const response = await getTokenData(token);
            console.log("Fetched token data:", response);
          } catch (error) {
            if (error instanceof Error) {
              console.error("Error fetching token data:", error);
            }
          }
        }

        selectedTokens.value.push(token);
        tokensInput.value = "";
      }
    };

    const removeToken = (token: string) => {
      selectedTokens.value = selectedTokens.value.filter((t) => t !== token);
    };

    const clearTokens = () => {
      selectedTokens.value = [];
    };

    const callSingleTokenPrice = async () => {
      const tokens = selectedTokens.value;
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
        if (error instanceof Error) {
          console.error("Error fetching single token price:", error.message);
        } else {
          console.error("Error fetching single token price:", error);
        }
      }
    };

    const callTokenData = async () => {
      const tokens = selectedTokens.value;
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
      const tokens = selectedTokens.value;
      if (tokens.length === 0) {
        console.error("No tokens selected.");
        return;
      }
      console.log("Calling getMultiTokenPrices with tokens:", tokens);
      try {
        const response = await getMultiTokenPrices(tokens);
        console.log(response);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching multi-token prices:", error.message);
        } else {
          console.error("Error fetching multi-token prices:", error);
        }
      }
    };

    const callTokenTrades = async () => {
      const tokens = selectedTokens.value;
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
        if (error instanceof Error) {
          console.error("Error fetching token trades:", error.message);
        } else {
          console.error("Error fetching token trades:", error);
        }
      }
    };

    const callFirstBuyers = async () => {
      const tokens = selectedTokens.value;
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
        if (error instanceof Error) {
          console.error("Error fetching first buyers:", error.message);
        } else {
          console.error("Error fetching first buyers:", error);
        }
      }
    };

    const updateSelectedTokens = (tokens: string[]) => {
      selectedTokens.value = tokens;
    };

    return {
      tokensInput,
      selectedTokens,
      addToken,
      removeToken,
      clearTokens,
      callSingleTokenPrice,
      callTokenData,
      callMultiTokenPrices,
      callTokenTrades,
      callFirstBuyers,
      updateSelectedTokens,
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
