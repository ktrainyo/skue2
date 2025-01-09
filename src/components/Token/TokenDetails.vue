<template>
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
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  tokenData: Object,
});
</script>
