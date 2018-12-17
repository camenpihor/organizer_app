/* eslint-disable implicit-arrow-linebreak */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store.js'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active",
  routes: [
    {
      path: '/',
      redirect: '/questions'
    },
    {
      path: '/questions',
      name: 'questions',
      meta: { coreObject: 'questions' },
      component: () =>
        import(/* webpackChunkName: "questions" */ './question/Home.vue'),
    },
    {
      path: '/questions/archive',
      name: 'questions-archive',
      meta: { coreObject: 'questions' },
      component: () =>
        import(/* webpackChunkName: "questions-archive" */ './question/Archive.vue'),
    },
    {
      path: '/questions/stats',
      name: 'questions-stats',
      meta: { coreObject: 'questions' },
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

router.beforeEach((to, from, next) => {
  var newCoreObject = to.meta.coreObject
  if (newCoreObject && newCoreObject !== store.state.coreObject) {
    store.commit("updateCoreObject", newCoreObject)
  }
  next()
})

export default router