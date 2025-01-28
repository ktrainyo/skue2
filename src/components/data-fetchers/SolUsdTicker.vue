<template>
  <div class="sol-usd-ticker">
    <span>SOL/USD:</span>
    <span>{{ price || "Loading..." }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

export const solPrice = ref<number | null>(null);

export default defineComponent({
  name: "SolUsdTicker",
  setup() {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await response.json();
        solPrice.value = data.solana.usd;
      } catch (error) {
        console.error("Failed to fetch SOL/USD price:", error);
        solPrice.value = null;
      }
    };

    // Fetch price initially
    onMounted(fetchSolPrice);

    // Update every 5 minutes
    setInterval(fetchSolPrice, 5 * 60 * 1000);

    return { price: solPrice };
  },
});
</script>

<style scoped>
.sol-usd-ticker {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 1rem;
  color: #fff;
  font-weight: bold;
}
</style>
