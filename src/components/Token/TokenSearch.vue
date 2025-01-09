<template>
  <VCardText>
    <VRow>
      <VCol cols="12" offset-md="8" md="4">
        <AppTextField
          v-model="search"
          placeholder="Search ..."
          append-inner-icon="tabler-search"
          single-line
          hide-details
          dense
          outlined
        />
      </VCol>
    </VRow>
  </VCardText>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';

const props = defineProps({
  modelValue: String,
});

const search = ref(props.modelValue);

watch(search, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>
