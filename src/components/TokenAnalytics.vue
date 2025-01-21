
<template>
  <!-- ...existing code... -->
  <ChartBase
    :chartData="analyticsData"
    :options="chartOptions"
    :chartType="selectedChartType"
  />
  <!-- ...existing code... -->
</template>

<script setup lang="ts">
// ...existing code...
import ChartBase from '@/components/base/ChartBase.vue';
// ...existing code...
</script>
