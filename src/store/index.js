import Vue from 'vue'
import Vuex from 'vuex'
import authentication from './modules/authentication'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    facegroups: [],
    faces: [],
    hosturl: ''
  },
  getters: {},
  mutations: {
    increment (state) {
      state.count++
    },
    setFacegroups (state, list) {
      state.facegroups = list || []
    },
    setFaces (state, list) {
      state.faces = list || []
    },
    setHosturl (state, url) {
      state.hosturl = url
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  },
  modules: {
    authentication
  }
})

export default store
