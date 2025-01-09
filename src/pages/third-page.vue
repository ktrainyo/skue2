<!-- src/pages/CallStaticTokensMarketPage.vue -->
<template>
  <div class="call-static-tokens-market-page">
    <h2>Call Static Tokens Market</h2>

    <!-- 
      Re-use the existing SupabaseRealtimeDisplay component,
      but point to your new "call_static_tokens_market" table.
    -->
    <SupabaseRealtimeDisplay tableName="call_static_tokens_market" />
  </div>
</template>

<script lang="ts">
import SupabaseRealtimeDisplay from '@/components/SupabaseRealtimeDisplay.vue';
import { defineComponent } from 'vue';
// ^ Adjust this import if your component path differs

export default defineComponent({
  name: 'CallStaticTokensMarketPage',
  components: {
    SupabaseRealtimeDisplay,
  },
})
</script>

<style scoped>
.call-static-tokens-market-page {
  /* Optional page styling here */
}
</style>
