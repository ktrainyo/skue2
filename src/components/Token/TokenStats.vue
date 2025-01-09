<template>
  <v-card>
    <v-card-title>Token Statistics</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Total Tokens</v-list-item-title>
              <v-list-item-subtitle>{{ totalTokens }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="12" md="6">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Average Price</v-list-item-title>
              <v-list-item-subtitle>{{ formatCurrency(avgPrice) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="12" md="6">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Total Liquidity</v-list-item-title>
              <v-list-item-subtitle>{{ formatCurrency(totalLiquidity) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="12" md="6">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Total Market Cap</v-list-item-title>
              <v-list-item-subtitle>{{ formatCurrency(totalMarketCap) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="12" md="6">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Highest Price</v-list-item-title>
              <v-list-item-subtitle>{{ formatCurrency(highestPrice) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="12" md="6">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Lowest Price</v-list-item-title>
              <v-list-item-subtitle>{{ formatCurrency(lowestPrice) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = defineProps({
  tokens: Array,
});

// Computed properties for token stats
const totalTokens = computed(() => props.tokens.length);

const avgPrice = computed(() => {
  if (props.tokens.length === 0) return 0;
  return props.tokens.reduce((sum, token) => sum + token.price_usd, 0) / props.tokens.length;
});

const totalLiquidity = computed(() =>
  props.tokens.reduce((sum, token) => sum + (token.liquidity || 0), 0)
);

const totalMarketCap = computed(() =>
  props.tokens.reduce((sum, token) => sum + (token.current_market_cap || 0), 0)
);

const highestPrice = computed(() =>
  props.tokens.reduce(
    (max, token) => (token.price_usd > max ? token.price_usd : max),
    0
  )
);

const lowestPrice = computed(() =>
  props.tokens.reduce(
    (min, token) =>
      token.price_usd < min ? token.price_usd : min || Number.MAX_VALUE,
    Number.MAX_VALUE
  )
);

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
</script>
