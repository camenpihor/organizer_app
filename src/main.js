import Vue from 'vue'
import App from './App.vue'
import SuiVue from 'semantic-ui-vue'
import 'semantic-ui-css/semantic.min.css';
import router from './routes/_router.js'
import store from './store.js'

Vue.config.productionTip = false
Vue.use(SuiVue);


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
