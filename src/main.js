import Vue from 'vue'
import App from './App.vue'
// import SuiVue from 'semantic-ui-vue'
// import '../semantic/dist/semantic.min.css'
import router from './routes/router.js'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// Vue.use(SuiVue);
