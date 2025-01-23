import TokenApiTester from '@/pages/TokenApiTester.vue';
import TokenTracker from '@/pages/TokenTracker.vue';
import Home from '@/views/Home.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/token-api-tester',
    name: 'TokenApiTester',
    component: TokenApiTester,
  },
  {
    path: '/token-tracker',
    name: 'TokenTracker',
    component: TokenTracker,
  },
  // ...other routes...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
