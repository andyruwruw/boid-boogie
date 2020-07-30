import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home.vue';
import Landing from '../views/Landing.vue';
import Redirect from '../views/Redirect.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/redirect',
    name: 'Redirect',
    component: Redirect,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;