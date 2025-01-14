import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    // Perform async operations if needed
    await someAsyncCheck();
    next();
  } catch (err) {
    console.error('Navigation error:', err);
    next(false); // Prevent navigation
  }
});

export default router;
