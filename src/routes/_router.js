/* eslint-disable implicit-arrow-linebreak */
import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/questions'
    },
    {
      path: '/questions',
      name: 'questions',
      component: () =>
        import(/* webpackChunkName: "questions" */ './question/Home.vue'),
    },
    {
      path: '/questions/archive',
      name: 'questions-archive',
      component: () =>
        import(/* webpackChunkName: "questions-archive" */ './question/Archive.vue'),
    },
    {
      path: '/questions/stats',
      name: 'questions-stats',
      component: () =>
        import(/* webpackChunkName: "questions-stats" */ './question/Stats.vue'),
    },
    {
      path: '/404',
      component: () =>
        import(/* webpackChunkName: "404" */ './NotFound.vue'),
    },
    {
      path: '*',
      redirect: '/404'
    },
  ],
});
