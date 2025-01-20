import GetNewTokensButton from '@/components/GetNewTokensButton.vue';
import PrimeVue from 'primevue/config';
import { createApp } from 'vue';
import App from './App.vue';

// Styles
import '@core/scss/template/index.scss';
import '@styles/styles.scss';
import '@styles/token-table-list.css'; // Import custom styles

// Create vue app
const app = createApp(App);

// Register plugins
import { registerPlugins } from '@core/utils/plugins';
registerPlugins(app); // This already includes Pinia registration

// Create an event bus
import mitt from 'mitt';
const emitter = mitt();
app.provide('emitter', emitter);

app.use(PrimeVue);
// Remove duplicate Pinia registration
// app.use(pinia);

// Register the new component
app.component('GetNewTokensButton', GetNewTokensButton);

// Mount vue app
app.mount('#app');

// Helper function to safely stringify arguments
const stringifyArgs = (args: any[]) => args.map(arg => {
  try {
    return typeof arg === 'object' ? JSON.stringify(arg, getCircularReplacer()) : String(arg);
  } catch (e) {
    return String(arg);
  }
});

// Helper function to handle circular references
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  };
};

// Override console methods to log messages to MessageDisplay
const originalConsoleLog = console.log;
console.log = (...args) => {
  originalConsoleLog(...args);
  emitter.emit('logMessage', { content: stringifyArgs(args).join(' '), type: 'info' });
};

const originalConsoleError = console.error;
console.error = (...args) => {
  originalConsoleError(...args);
  emitter.emit('logMessage', { content: stringifyArgs(args).join(' '), type: 'error' });
};

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  originalConsoleWarn(...args);
  emitter.emit('logMessage', { content: stringifyArgs(args).join(' '), type: 'warning' });
};

const originalConsoleInfo = console.info;
console.info = (...args) => {
  originalConsoleInfo(...args);
  emitter.emit('logMessage', { content: stringifyArgs(args).join(' '), type: 'info' });
};
