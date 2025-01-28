<template>
  <v-dialog v-model="isDialogOpen" max-width="500">
    <v-card>
      <v-card-title class="headline">Token Options</v-card-title>
      <v-card-text>
        <p>Token: {{ token }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="addToken">Add Token To Selection</v-btn>
        <v-btn color="secondary" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TokenDialog",
  props: {
    token: {
      type: String,
      required: true,
    },
    isDialogOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["add-token", "close-dialog"],
  setup(props, { emit }) {
    const addToken = () => {
      emit("add-token", props.token);
      emit("close-dialog");
    };

    const closeDialog = () => {
      emit("close-dialog");
    };

    return {
      addToken,
      closeDialog,
    };
  },
});
</script>
