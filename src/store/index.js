import Vue from 'vue'
import Vuex from 'vuex'
import authentication from './modules/authentication'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    facegroups: [],
    faces: [],
    faceTotal: 0,
    hosturl: (window.localStorage && window.localStorage.getItem('KS_host')) || '182.92.115.19:8001'
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
    setFaceTotal (state, total) {
      state.faceTotal = total
    },
    setHosturl (state, url) {
      state.hosturl = url
      var storage = window.localStorage
      storage.setItem('KS_host', url)
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
