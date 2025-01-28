<template>
  <v-card>
    <v-card-title @click="toggleExpand">
      Fetch Token Chart Data
      <v-icon right>{{
        expanded ? "mdi-chevron-up" : "mdi-chevron-down"
      }}</v-icon>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-if="expanded">
        <v-select
          v-model="chartInterval"
          :items="intervals"
          label="Select Interval"
        ></v-select>
        <v-switch v-model="useDatePicker"> Use Date Picker </v-switch>
        <v-menu
          v-model="menuRange"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
          v-if="useDatePicker"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="dateRangeLabel"
              label="Select Date Range"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="props"
            ></v-text-field>
          </template>
          <v-date-picker
            multiple="range"
            v-model="selectedRange"
            @update:modelValue="updateDateRange"
          />
        </v-menu>
        <v-card-subtitle v-if="useDatePicker && selectedRange.length">
          <template v-if="selectedRange.length === 2">
            Selected range: {{ selectedRange[0] }} → {{ selectedRange[1] }} ({{
              dayDiff
            }}
            days)
          </template>
          <template v-else> Selected date: {{ selectedRange[0] }} </template>
        </v-card-subtitle>
        <v-btn class="mt-4" @click="fetchChartData" rounded>Start</v-btn>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { getTokenChartData } from "@/components/services/middleware/getTokenChartData";

export default defineComponent({
  name: "ChartDataOptions",
  props: {
    token: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const expanded = ref(false);
    const chartInterval = ref("5m");
    const intervals = [
      "1s",
      "5s",
      "15s",
      "1m",
      "3m",
      "5m",
      "15m",
      "30m",
      "1h",
      "2h",
      "4h",
      "6h",
      "8h",
      "12h",
      "1d",
      "3d",
      "1w",
      "1mn",
    ];
    const useDatePicker = ref(false);
    const selectedRange = ref<string[]>([]);
    const menuRange = ref(false);

    const dateRangeLabel = computed(() => {
      if (selectedRange.value.length === 2) {
        return `${selectedRange.value[0]} → ${selectedRange.value[1]}`;
      } else if (selectedRange.value.length === 1) {
        return `${selectedRange.value[0]} → `;
      }
      return "";
    });

    const dayDiff = computed(() => {
      if (selectedRange.value.length === 2) {
        const [start, end] = selectedRange.value;
        const diffMs = new Date(end).getTime() - new Date(start).getTime();
        return Math.ceil(diffMs / (1000 * 3600 * 24));
      }
      return 0;
    });

    const toggleExpand = () => {
      expanded.value = !expanded.value;
    };

    const updateDateRange = (newRange: string[]) => {
      selectedRange.value = newRange;
      if (newRange.length === 2) {
        menuRange.value = false;
      }
    };

    const fetchChartData = async () => {
      let timeFromTimestamp, timeToTimestamp;
      if (selectedRange.value.length > 0) {
        timeFromTimestamp = new Date(selectedRange.value[0]).getTime() / 1000;
      }
      if (selectedRange.value.length > 1) {
        timeToTimestamp = new Date(selectedRange.value[1]).getTime() / 1000;
      }
      console.log(
        "Calling getTokenChartData with token:",
        props.token,
        "interval:",
        chartInterval.value,
        "timeFrom:",
        timeFromTimestamp,
        "timeTo:",
        timeToTimestamp
      );
      try {
        const response = await getTokenChartData(
          props.token,
          chartInterval.value,
          timeFromTimestamp,
          timeToTimestamp
        );
        console.log(response);
      } catch (error) {
        console.error("Error fetching token chart data:", error.message);
      }
    };

    return {
      expanded,
      chartInterval,
      intervals,
      useDatePicker,
      selectedRange,
      menuRange,
      dateRangeLabel,
      dayDiff,
      toggleExpand,
      fetchChartData,
      updateDateRange,
    };
  },
});
</script>

<style scoped>
.v-card-title {
  cursor: pointer;
}
</style>
