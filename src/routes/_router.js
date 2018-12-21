import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store.js'
import { coreObjectDetail } from "@/api.js"

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
      meta: { coreObject: 'questions' },
      component: () =>
        import('./question/Home.vue'),
    },
    {
      path: '/questions/archive',
      meta: { coreObject: 'questions' },
      component: () =>
        import('./question/Archive.vue'),
    },
    {
      path: '/questions/stats',
      meta: { coreObject: 'questions' },
      component: () =>
        import('./question/Stats.vue'),
    },
    {
      path: '/questions/:id',
      meta: { coreObject: 'questions' },
      component: () =>
        import('./question/Detail.vue'),
      beforeEnter: (to, from, next) => {
        coreObjectDetail("question", to.params.id)
          .get()
          .then(() => next())
          .catch(() => next("/404"))
      }
    },
    {
      path: '/404',
      component: () =>
        import('./NotFound.vue'),
    },
    {
      path: '*',
      redirect: '/404'
    },
  ],
});

router.beforeEach((to, from, next) => {
  var newCoreObject = to.meta.coreObject
  if (newCoreObject && newCoreObject !== from.meta.coreObject) {
    store.commit("updateCoreObject", newCoreObject)
  }
  next()
})

export default router
