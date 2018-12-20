
import Vue from 'vue'
import 'es6-promise/auto'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    coreObject: 'questions',
    apiURL: 'http://127.0.0.1:8000'
  },
  getters: {
    currentCoreObject: state => {
      return state.coreObject
    },
    apiURL: state => {
      return state.apiURL
    }
  },
  mutations: {
    updateCoreObject(state, newCoreObject) {
      state.coreObject = newCoreObject
    }
  },
});