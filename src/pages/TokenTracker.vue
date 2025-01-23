<template>
  <div class="container token-tracker">
    <h1>Token Tracker</h1>
    <div class="table-container">
      <TokenTrackingTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import TokenTrackingTable from '@/components/TokenTrackingTable.vue';
</script>

<style scoped>
.token-tracker {
  padding: 1rem;
}

.table-container {
  inline-size: 100%; /* Ensure the table container takes up the full width */
}
</style>
