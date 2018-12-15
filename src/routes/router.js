/* eslint-disable implicit-arrow-linebreak */
import Vue from 'vue'
import Router from 'vue-router'
import Home from './Home.vue'


Vue.use(Router);

export default new Router({
  mode: 'history',
  bae: __dirname,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/questions',
      name: 'questions',
      component: () =>
        import(/* webpackChunkName: "questions" */ './Question.vue'),
    },
    {
      path: '*',
      redirect: '/',
      // TODO: Add 404 page
    },
  ],
});
