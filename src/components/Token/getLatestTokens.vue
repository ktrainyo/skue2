<template>
  <div class="get-latest-tokens">
    <button @click="fetchLatestTokens">Get Latest Tokens</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getLatestTokens } from "@/components/services/middleware/getLatestTokens";

export default defineComponent({
  name: "GetLatestTokens",
  setup() {
    const fetchLatestTokens = async () => {
      try {
        const response = await getLatestTokens();
        console.log("Latest tokens:", response);
      } catch (error) {
        console.error("Error fetching latest tokens:", error.message);
      }
    };

    return {
      fetchLatestTokens,
    };
  },
});
</script>

<style scoped>
.get-latest-tokens {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}
</style>
