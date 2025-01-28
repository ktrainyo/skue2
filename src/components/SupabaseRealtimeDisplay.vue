<template>
  <div class="supabase-realtime-display">
    <slot :latestTokenPrices="latestTokenPrices"></slot>
  </div>
</template>

<script lang="ts">
import { useSupabase } from "@/composables/useSupabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";

export default defineComponent({
  name: "SupabaseRealtimeDisplay",
  props: {
    tableName: {
      type: String,
      required: true,
    },
  },
  emits: ["data-updated"],
  setup(props, { emit }) {
    const supabase = useSupabase();
    const latestTokenPrices = ref<any[]>([]);
    const channelRef = ref<any>(null);

    onMounted(() => {
      loadInitialData();
      subscribeToRealtime();
    });

    onBeforeUnmount(() => {
      if (channelRef.value) {
        channelRef.value.unsubscribe();
      }
    });

    const loadInitialData = async () => {
      const { data, error } = await supabase.from(props.tableName).select("*");

      if (error) {
        console.error("Error fetching initial data:", error.message);
      } else {
        latestTokenPrices.value = data ?? [];
        emit("data-updated", latestTokenPrices.value);
      }
    };

    const subscribeToRealtime = () => {
      channelRef.value = supabase.channel(`realtime-${props.tableName}`);

      channelRef.value
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: props.tableName,
          },
          (payload: RealtimePostgresChangesPayload<any>) =>
            handleRealtimeChanges(payload)
        )
        .subscribe();
    };

    const handleRealtimeChanges = (
      payload: RealtimePostgresChangesPayload<any>
    ) => {
      console.log("Realtime payload:", payload); // Add this line
      switch (payload.eventType) {
        case "INSERT":
          latestTokenPrices.value.push(payload.new);
          break;

        case "UPDATE": {
          const idx = latestTokenPrices.value.findIndex(
            (item) => item.token === payload.old.token
          );
          if (idx !== -1) {
            latestTokenPrices.value[idx] = payload.new;
          }
          break;
        }

        case "DELETE":
          latestTokenPrices.value = latestTokenPrices.value.filter(
            (item) => item.token !== payload.old.token
          );
          break;
      }
      emit("data-updated", latestTokenPrices.value);
    };

    return {
      latestTokenPrices,
    };
  },
});
</script>

<style scoped>
.supabase-realtime-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
