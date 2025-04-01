import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import HistoriasBiblicas from '../pages/HistoriasBiblicas.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App
  },
  {
    path: '/historias-biblicas',
    name: 'HistoriasBiblicas',
    component: HistoriasBiblicas
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    }
    return { top: 0 };
  }
});

export default router;
