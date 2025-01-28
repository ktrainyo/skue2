<template>
  <div ref="chartContainer" class="chart-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { createChart, IChartApi, CandlestickData } from "lightweight-charts";
import { fetchOHLCData } from "./api"; // Import the function to fetch OHLC data

export default defineComponent({
  name: "CandlestickChart",
  setup() {
    const chartContainer = ref<HTMLDivElement | null>(null);
    let chart: IChartApi | null = null;

    const renderChart = async () => {
      if (!chartContainer.value) return;

      // Fetch OHLC data for Xtoken
      const token = "Xtoken";
      const interval = 60; // 1-minute interval
      const startTime = 0; // All-time start
      const endTime = null; // Current time

      const ohlcData = await fetchOHLCData(token, interval, startTime, endTime);

      if (!ohlcData) return;

      // Transform data into Lightweight Charts format for candlesticks
      const candlestickData: CandlestickData[] = ohlcData.map((row: any) => ({
        time: new Date(row.period_start).getTime() / 1000, // Convert to Unix timestamp
        open: row.open,
        high: row.high,
        low: row.low,
        close: row.close,
      }));

      // Create or reset the chart
      if (chart) {
        chart.remove(); // Remove the previous chart if it exists
      }
      chart = createChart(chartContainer.value, {
        width: chartContainer.value.clientWidth,
        height: 400,
        layout: { backgroundColor: "#ffffff", textColor: "#000000" },
        grid: {
          vertLines: { color: "#eeeeee" },
          horzLines: { color: "#eeeeee" },
        },
      });

      // Add a candlestick series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });

      // Set the candlestick data
      candlestickSeries.setData(candlestickData);
    };

    onMounted(() => {
      renderChart();
    });

    return { chartContainer };
  },
});
</script>

<style>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
