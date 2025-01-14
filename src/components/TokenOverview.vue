<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="header">
      <div class="back-button">←</div>
      <div class="title-container">
        <h1>{{ title }}</h1>
        <span class="time-frame">1m</span>
      </div>
      <div class="actions">...</div>
    </header>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stat" v-for="(stat, index) in stats" :key="index">
        <h3>{{ stat.label }}</h3>
        <p>{{ stat.value }}</p>
      </div>
    </section>

    <!-- Timeframes Section -->
    <section class="timeframes-section">
      <div class="timeframe" v-for="(timeframe, index) in timeframes" :key="index">
        <span>{{ timeframe.period }}</span>
        <p>{{ timeframe.percentage }}%</p>
      </div>
    </section>

    <!-- Transaction Details Section -->
    <section class="transaction-details">
      <div class="details">
        <h4>TXNS</h4>
        <p>{{ transactions }}</p>
      </div>
      <div class="details">
        <h4>VOLUME</h4>
        <p>{{ volume }}</p>
      </div>
      <div class="details">
        <h4>MAKERS</h4>
        <p>{{ makers }}</p>
      </div>
    </section>

    <!-- Buy/Sell Details -->
    <section class="buy-sell-details">
      <div class="row">
        <div class="column">
          <h4>BUYS</h4>
          <p>{{ buys }}</p>
        </div>
        <div class="column">
          <h4>SELLS</h4>
          <p>{{ sells }}</p>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <h4>BUY VOL</h4>
          <p>{{ buyVolume }}</p>
        </div>
        <div class="column">
          <h4>SELL VOL</h4>
          <p>{{ sellVolume }}</p>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <h4>BUYERS</h4>
          <p>{{ buyers }}</p>
        </div>
        <div class="column">
          <h4>SELLERS</h4>
          <p>{{ sellers }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";

export default defineComponent({
  name: "TokenOverview",
  props: {
    tokenData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const stats = reactive([
      { label: "PRICE USD", value: props.tokenData.priceusd || "$0.0003863" },
      { label: "PRICE", value: props.tokenData.price || "0.052064 SOL" },
      { label: "LIQUIDITY", value: props.tokenData.liquidity || "$21K" },
      { label: "FDV", value: props.tokenData.fdv || "$386K" },
      { label: "MARKET CAP", value: props.tokenData.marketcap || "$386K" },
    ]);

    const timeframes = reactive([
      { period: "5M", percentage: props.tokenData["5M_percentage"] || 1.18 },
      { period: "1H", percentage: props.tokenData["1H_percentage"] || 1.18 },
      { period: "6H", percentage: props.tokenData["6H_percentage"] || 1.18 },
      { period: "24H", percentage: props.tokenData["24H_percentage"] || 1.18 },
    ]);

    const transactions = props.tokenData.transactions || 2;
    const volume = props.tokenData.volume || "$224";
    const makers = props.tokenData.makers || 2;
    const buys = props.tokenData.buys || 2;
    const sells = props.tokenData.sells || 0;
    const buyVolume = props.tokenData.buyvolume || "$224";
    const sellVolume = props.tokenData.sellvolume || "$0";
    const buyers = props.tokenData.buyers || 2;
    const sellers = props.tokenData.sellers || 0;

    watch(() => props.tokenData, (newData) => {
      stats[0].value = newData.priceusd || "$0.0003863";
      stats[1].value = newData.price || "0.052064 SOL";
      stats[2].value = newData.liquidity || "$21K";
      stats[3].value = newData.fdv || "$386K";
      stats[4].value = newData.marketcap || "$386K";

      timeframes[0].percentage = newData["5M_percentage"] || 1.18;
      timeframes[1].percentage = newData["1H_percentage"] || 1.18;
      timeframes[2].percentage = newData["6H_percentage"] || 1.18;
      timeframes[3].percentage = newData["24H_percentage"] || 1.18;
    });

    return {
      title: props.tokenData.title || "Token Name",
      stats,
      timeframes,
      transactions,
      volume,
      makers,
      buys,
      sells,
      buyVolume,
      sellVolume,
      buyers,
      sellers,
    };
  },
});
</script>

<style scoped>
/* General Styles */
.dashboard {
  padding: 16px;
  margin: auto;
  background-color: #121212;
  color: #fff;
  font-family: Arial, sans-serif;
  max-inline-size: 400px;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 16px;
}

.back-button {
  cursor: pointer;
  font-size: 16px;
}

.title-container {
  text-align: center;
}

.time-frame {
  color: #8bc34a;
  font-size: 14px;
}

/* Stats Section */
.stats-section {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  margin-block-end: 16px;
}

.stat h3 {
  margin: 0;
  color: #aaa;
  font-size: 12px;
}

.stat p {
  margin: 0;
  font-size: 16px;
}

/* Timeframes Section */
.timeframes-section {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(4, 1fr);
  margin-block-end: 16px;
}

.timeframe span {
  color: #aaa;
  font-size: 12px;
}

.timeframe p {
  color: #8bc34a;
  font-size: 14px;
}

/* Transaction Details */
.transaction-details {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr);
  margin-block-end: 16px;
}

.details h4 {
  margin: 0;
  color: #aaa;
  font-size: 12px;
}

.details p {
  margin: 0;
  font-size: 14px;
}

/* Buy/Sell Details */
.buy-sell-details {
  margin-block-end: 16px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-block-end: 8px;
}

.column {
  flex: 1;
  text-align: center;
}

.column h4 {
  margin: 0;
  color: #aaa;
  font-size: 12px;
}

.column p {
  margin: 0;
  color: #fff;
  font-size: 14px;
}
</style>
