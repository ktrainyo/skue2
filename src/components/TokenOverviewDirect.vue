<template>
  <div class="token-overview" v-if="token && tokenData">
    <!-- Header Section -->
    <div class="header">
      <div class="title">
        <span>{{ tokenData.title }}</span>
      </div>
      <div class="menu-actions">
        <!-- Add menu actions here -->
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-grid">
      <div class="stat-box">
        <span class="label">PRICE USD</span>
        <span class="value">
          <template v-if="formattedPriceUSD.zeroCount !== ''">
            {{ formattedPriceUSD.base }}
            <span>0</span>
            <span class="zero-count">{{ formattedPriceUSD.zeroCount }}</span>
            {{ formattedPriceUSD.remainingDigits }}
          </template>
          <template v-else>
            {{ formattedPriceUSD.base }}
          </template>
        </span>
      </div>
      <div class="stat-box">
        <span class="label">PRICE SOL</span>
        <span class="value">
          <template v-if="formattedPriceSOL.zeroCount !== ''">
            {{ formattedPriceSOL.base }}
            <span>0</span>
            <span class="zero-count">{{ formattedPriceSOL.zeroCount }}</span>
            {{ formattedPriceSOL.remainingDigits }}
          </template>
          <template v-else>
            {{ formattedPriceSOL.base }}
          </template>
        </span>
      </div>
      <div class="stat-box">
        <span class="label">LIQUIDITY</span>
        <span class="value">{{ formattedLiquidity }}</span>
      </div>
      <div class="stat-box">
        <span class="label">FDV</span>
        <span class="value">{{ formattedFDV }}</span>
      </div>
      <div class="stat-box">
        <span class="label">MARKET CAP</span>
        <span class="value">{{ formattedMarketCap }}</span>
      </div>
    </div>

    <!-- Timeframes Section -->
    <div class="timeframes-grid">
      <div class="timeframe-box" :class="{ positive: tokenData['1M_percentage'] >= 0, negative: tokenData['1M_percentage'] < 0 }">
        <span class="label">1min</span>
        <span class="value">{{ tokenData['1M_percentage'] }}%</span>
      </div>
      <div class="timeframe-box" :class="{ positive: tokenData['5M_percentage'] >= 0, negative: tokenData['5M_percentage'] < 0 }">
        <span class="label">5min</span>
        <span class="value">{{ tokenData['5M_percentage'] }}%</span>
      </div>
      <div class="timeframe-box" :class="{ positive: tokenData['10M_percentage'] >= 0, negative: tokenData['10M_percentage'] < 0 }">
        <span class="label">10min</span>
        <span class="value">{{ tokenData['10M_percentage'] }}%</span>
      </div>
      <div class="timeframe-box" :class="{ positive: tokenData['30M_percentage'] >= 0, negative: tokenData['30M_percentage'] < 0 }">
        <span class="label">30min</span>
        <span class="value">{{ tokenData['30M_percentage'] }}%</span>
      </div>
      <div class="timeframe-box" :class="{ positive: tokenData['12hr_percentage'] >= 0, negative: tokenData['12hr_percentage'] < 0 }">
        <span class="label">12hr</span>
        <span class="value">{{ tokenData['12hr_percentage'] }}%</span>
      </div>
    </div>

    <!-- Transaction Details Section -->
    <div class="transaction-details-grid">
      <div class="transaction-box">
        <span class="label">TXNS</span>
        <span class="value">{{ tokenData.txns }}</span>
      </div>
      <div class="transaction-box">
        <span class="label">VOLUME</span>
        <span class="value">{{ formattedVolume }}</span>
      </div>
      <div class="transaction-box">
        <span class="label">MAKERS</span>
        <span class="value">{{ formattedMakers }}</span>
      </div>
    </div>

    <!-- Buy/Sell Details Section -->
    <div class="buy-sell-details-grid">
      <div class="buy-sell-box">
        <span class="label">BUYS</span>
        <span class="value">{{ tokenData.buys }}</span>
      </div>
      <div class="buy-sell-box">
        <span class="label">SELLS</span>
        <span class="value">{{ tokenData.sells }}</span>
      </div>
      <div class="buy-sell-box">
        <span class="label">BUY VOL</span>
        <span class="value">{{ formattedBuyVolume }}</span>
      </div>
      <div class="buy-sell-box">
        <span class="label">SELL VOL</span>
        <span class="value">{{ formattedSellVolume }}</span>
      </div>
      <div class="buy-sell-box">
        <span class="label">BUYERS</span>
        <span class="value">{{ tokenData.buyers }}</span>
      </div>
      <div class="buy-sell-box">
        <span class="label">SELLERS</span>
        <span class="value">{{ tokenData.sellers }}</span>
      </div>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'TokenOverviewDirect',
  props: {
    token: {
      type: [Object, String] as PropType<{ name: string } | string>,
      required: true,
    },
    tokenData: {
      type: Object as PropType<{
        title: string;
        priceusd: number;
        price: number;
        liquidity: number;
        fdv: number;
        marketcap: number;
        txns: number;
        volume: number;
        makers: number;
        buys: number;
        sells: number;
        buy_volume: number;
        sell_volume: number;
        buyers: number;
        sellers: number;
        '1M_percentage': number;
        '5M_percentage': number;
        '10M_percentage': number;
        '30M_percentage': number;
        '12hr_percentage': number;
      }>,
      required: true,
    },
  },
  setup(props) {
    const formattedLiquidity = computed(() => {
      const liquidity = props.tokenData?.liquidity ?? 0;
      if (liquidity < 1000) {
        return `$${liquidity.toFixed(0)}`;
      } else {
        return `$${(liquidity / 1000).toFixed(0)}k`;
      }
    });

    const formattedVolume = computed(() => {
      return `$${props.tokenData?.volume?.toFixed(0) ?? 0}`;
    });

    const formattedBuyVolume = computed(() => {
      return `$${props.tokenData?.buy_volume?.toFixed(0) ?? 0}`;
    });

    const formattedSellVolume = computed(() => {
      return `$${props.tokenData?.sell_volume?.toFixed(0) ?? 0}`;
    });

    const formattedFDV = computed(() => {
      const fdv = props.tokenData?.fdv ?? 0;
      if (fdv < 1000) {
        return `$${fdv.toFixed(0)}`;
      } else {
        return `$${(fdv / 1000).toFixed(0)}k`;
      }
    });

    const formattedMarketCap = computed(() => {
      const marketcap = props.tokenData?.marketcap ?? 0;
      if (marketcap < 1000) {
        return `$${marketcap.toFixed(0)}`;
      } else {
        return `$${(marketcap / 1000).toFixed(0)}k`;
      }
    });

    const formattedMakers = computed(() => {
      return (props.tokenData?.buyers ?? 0) + (props.tokenData?.sellers ?? 0);
    });

    const formatPrice = (value: number) => {
      // Handle the case where the value is zero
      if (value === 0) {
        return { base: "$0.0", zeroCount: "", remainingDigits: "" };
      }

      // Round to 12 decimal places for precision
      const roundedValue = value.toFixed(12);
      const [integerPart, decimalPart] = roundedValue.split(".");

      if (!decimalPart) {
        return { base: "$0.", zeroCount: "", remainingDigits: "" };
      }

      // Check if there are leading zeros
      const firstNonZeroIndex = decimalPart.search(/[^0]/);
      if (firstNonZeroIndex === 0) {
        // No leading zeros, return the rounded value as is
        return { base: `$${roundedValue}`, zeroCount: "", remainingDigits: "" };
      }

      // Count the number of leading zeros after the decimal
      const zeroCount = firstNonZeroIndex; // Number of leading zeros
      const remainingDigits = decimalPart.slice(zeroCount); // Digits after the leading zeros

      // Display logic: show one zero explicitly, count of remaining zeros, and digits
      const displayedZeroCount = zeroCount > 1 ? zeroCount - 1 : "";

      return {
        base: "$0.0", // The leading display format
        zeroCount: displayedZeroCount, // The count of zeros displayed after the first zero
        remainingDigits, // The digits remaining after all zeros
      };
    };

    const formattedPriceUSD = computed(() => formatPrice(props.tokenData?.priceusd ?? 0));
    const formattedPriceSOL = computed(() => formatPrice(props.tokenData?.price ?? 0));

    return {
      formattedLiquidity,
      formattedVolume,
      formattedBuyVolume,
      formattedSellVolume,
      formattedFDV,
      formattedMarketCap,
      formattedMakers,
      formattedPriceUSD,
      formattedPriceSOL,
    };
  },
});
</script>

<style scoped>
.token-overview {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #1e1e1e;
  color: #fff;
  gap: 1rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title span {
  font-size: 1.25rem;
  font-weight: bold;
}

.menu-actions {
  /* Add styles for menu actions */
}

.stats-grid,
.timeframes-grid,
.transaction-details-grid,
.buy-sell-details-grid {
  display: grid;
  gap: 1rem;
}

.stats-grid {
  grid-template-columns: repeat(2, 1fr);
}

.timeframes-grid {
  grid-template-columns: repeat(5, 1fr);
}

.transaction-details-grid {
  grid-template-columns: repeat(3, 1fr);
}

.buy-sell-details-grid {
  grid-template-columns: repeat(2, 1fr);
}

.stat-box,
.timeframe-box,
.transaction-box,
.buy-sell-box {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #2e2e2e;
}

.label {
  color: #aaa;
  font-size: 0.75rem;
}

.value {
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
}

.timeframe-box.positive .value {
  color: #0f0;
}

.timeframe-box.negative .value {
  color: #f00;
}

.zero-count {
  color: #aaa; /* Optional: Gray for distinction */
  font-size: 0.75em; /* Smaller font size */
  vertical-align: sub; /* Offset downward */
}
</style>
