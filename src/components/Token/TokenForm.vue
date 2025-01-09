<template>
  <v-card class="mb-4">
    <v-card-title>Add a New Token</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="tokenAddress"
          label="Token Address"
          required
          :rules="[rules.required]"
        ></v-text-field>
        <v-btn
          :disabled="!valid"
          color="primary"
          class="mt-3"
          @click="handleSubmit"
        >Submit</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const emits = defineEmits(['submitToken']);
const tokenAddress = ref('');
const valid = ref(false);
const rules = {
  required: (value: string) => !!value || "Token address is required",
};

const handleSubmit = () => {
  if (valid.value) {
    emits('submitToken', tokenAddress.value);
  }
};
</script>
