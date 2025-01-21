<template>
  <div class="get-new-tokens">
    <div class="button-container">
      <button 
        @click="toggleService" 
        :class="{ 
          'service-on': isServiceOn, 
          'service-off': !isServiceOn,
          'is-loading': isLoading 
        }"
      >
        {{ buttonText }}
      </button>
      <div class="status-indicator" :class="{ 'active': isServiceOn, 'inactive': !isServiceOn }"></div>
    </div>
    <button 
      v-if="isServiceOn" 
      @click="emergencyStop" 
      class="panic-button"
    >
      Emergency Stop
    </button>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchAndInsertNewTokens } from '@/services/TokenService';
import { useTokenStore } from '@/stores/token';
import { computed, ref } from 'vue';

const tokenStore = useTokenStore();

const isServiceOn = ref(false);
const error = ref<string | null>(null);
const isLoading = ref(false);
let intervalId: ReturnType<typeof setInterval> | null = null;

const buttonText = computed(() => {
  if (isLoading.value) return 'Processing...';
  return isServiceOn.value ? 'Stop Fetching New Tokens' : 'Get New Tokens';
});

const emergencyStop = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isServiceOn.value = false;
  isLoading.value = false;
  error.value = 'Service stopped by emergency stop';
};

const toggleService = async () => {
  error.value = null;
  
  if (isServiceOn.value) {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isServiceOn.value = false;
  } else {
    try {
      isLoading.value = true;
      console.log('Starting to fetch and insert new tokens...');
      await fetchAndInsertNewTokens();
      isServiceOn.value = true;
      intervalId = setInterval(async () => {
        try {
          console.log('Fetching and inserting new tokens in interval...');
          await fetchAndInsertNewTokens();
        } catch (err) {
          console.error('Error in interval fetchAndInsertNewTokens:', err);
          error.value = err instanceof Error ? err.message : 'An error occurred';
        }
      }, 60000);
    } catch (err) {
      console.error('Error in toggleService:', err);
      error.value = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<style scoped>
.get-new-tokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-block: 1rem;
}

.button-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

button {
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  transition: all 0.3s ease;
}

.service-on {
  background-color: #f44336;
  color: white;
}

.service-off {
  background-color: #4caf50;
  color: white;
}

.is-loading {
  cursor: wait;
  opacity: 0.7;
}

.status-indicator {
  border-radius: 50%;
  block-size: 12px;
  inline-size: 12px;
  transition: background-color 0.3s ease;
}

.status-indicator.active {
  animation: pulse 2s infinite;
  background-color: #4caf50;
  box-shadow: 0 0 8px #4caf50;
}

.status-indicator.inactive {
  background-color: #f44336;
}

.panic-button {
  background-color: #ff9800;
  color: white;
  font-weight: bold;
  padding-block: 0.75rem;
  padding-inline: 1.5rem;
  text-transform: uppercase;
}

.panic-button:hover {
  background-color: #f57c00;
}

.error-message {
  color: #f44336;
  font-size: 0.875rem;
  margin-block-start: 0.5rem;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 70%);
  }

  70% {
    box-shadow: 0 0 0 6px rgba(76, 175, 80, 0%);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0%);
  }
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
