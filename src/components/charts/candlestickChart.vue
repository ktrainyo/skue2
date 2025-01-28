<template>
  <div ref="chartContainer" class="chart-container"></div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted } from "vue";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  BarData,
} from "lightweight-charts";
import { useSupabase } from "@/composables/useSupabase";

export default defineComponent({
  name: "CandlestickChart",
  props: {
    token: {
      type: String,
      required: true,
    },
    interval: {
      type: String,
      default: "3600", // Default to hourly data
    },
    timeFrom: {
      type: Number,
      required: true,
    },
    timeTo: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const chartContainer = ref<HTMLDivElement | null>(null);
    let chart: IChartApi | null = null;
    let candlestickSeries: ISeriesApi<"Candlestick"> | null = null;
    const supabase = useSupabase();

    const fetchData = async () => {
      const { data, error } = await supabase.rpc("get_ohlc_data", {
        token_name: props.token,
        start_time: props.timeFrom,
        end_time: props.timeTo,
        interval_seconds: parseInt(props.interval),
      });

      if (error) {
        console.error("Error fetching OHLC data:", error.message);
        return;
      }

      if (data) {
        const chartData: BarData[] = data.map((item: any) => ({
          time: new Date(item.period_start).getTime() / 1000,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }));

        if (candlestickSeries) {
          candlestickSeries.setData(chartData);
        }
      }
    };

    onMounted(() => {
      if (chartContainer.value) {
        chart = createChart(chartContainer.value, {
          width: chartContainer.value.clientWidth,
          height: chartContainer.value.clientHeight,
        });

        candlestickSeries = chart.addCandlestickSeries();
        fetchData();
      }
    });

    onUnmounted(() => {
      if (chart) {
        chart.remove();
      }
    });

    watch(
      [
        () => props.token,
        () => props.interval,
        () => props.timeFrom,
        () => props.timeTo,
      ],
      fetchData
    );

    return {
      chartContainer,
    };
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
