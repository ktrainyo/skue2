<template>
  <!-- ...existing code... -->
  <ChartBase
    :chartData="metricsChartData"
    :options="chartOptions"
    :chartType="chartType"
  />
  <!-- ...existing code... -->
</template>

<script setup lang="ts">
// ...existing code...
import ChartBase from '@/components/base/ChartBase.vue';
// ...existing code...
</script>
