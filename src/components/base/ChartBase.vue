<template>
  <!-- ...existing code... -->
  <canvas ref="chartCanvas"></canvas>
  <!-- ...existing code... -->
</template>

<script setup lang="ts">
// ...existing code...
import { Chart, ChartOptions, registerables } from 'chart.js';
import { onMounted, ref, watch } from 'vue';
Chart.register(...registerables);

interface ChartProps {
  chartData: any;
  options: ChartOptions;
  chartType: string;
}

const props = defineProps<ChartProps>();
const chartInstance = ref<Chart | null>(null);

onMounted(() => {
  if (!chartInstance.value) {
    const ctx = (document.querySelector('#chartCanvas') as HTMLCanvasElement)?.getContext('2d');
    chartInstance.value = new Chart(ctx!, {
      type: props.chartType,
      data: props.chartData,
      options: props.options
    });
  }
});

watch(() => props.chartData, (newData) => {
  if (chartInstance.value) {
    chartInstance.value.data = newData;
    chartInstance.value.update();
  }
});
</script>
