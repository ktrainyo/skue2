import { defineStore } from 'pinia';

export const useTokenStore = defineStore('token', {
  state: () => ({
    isServiceOn: false,
    error: null as string | null,
    isLoading: false,
    currentToken: null,
  }),

  actions: {
    async fetchAndInsertNewTokens() {
      this.isLoading = true;
      try {
        // Your token fetching logic here
        await fetchAndInsertNewTokens();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'An error occurred';
      } finally {
        this.isLoading = false;
      }
    },

    setServiceStatus(status: boolean) {
      this.isServiceOn = status;
    },
  },
});
