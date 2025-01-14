<template>
  <div class="main-layout">
    <Header :token="token" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/Header.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    Header,
  },
  data() {
    return {
      token: {
        name: 'Example Token',
      },
    };
  },
});
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  block-size: 100vh;
}
</style>
