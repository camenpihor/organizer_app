
import Vue from 'vue'
import 'es6-promise/auto'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    coreObject: 'questions'
  },
  getters: {
    currentCoreObject: state => {
      return state.coreObject
    }
  },
  mutations: {
    updateCoreObject(state, newCoreObject) {
      state.coreObject = newCoreObject
    }
  },
});