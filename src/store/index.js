import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    facegroups: [],
    faces: []
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
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})

export default store
