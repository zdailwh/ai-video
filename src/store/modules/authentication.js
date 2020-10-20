import api from '../../api'
import { getToken, setToken, removeToken } from '../../utils/auth'

const state = {
  token: getToken() ? JSON.parse(getToken()) : null,
  info: getToken() ? JSON.parse(getToken()) : {}
}

const mutations = {
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      api.login({ username: username.trim(), password: password }).then(response => {
        const item = response.data
        commit('SET_INFO', item.user)
        commit('SET_TOKEN', item.user)
        setToken(JSON.stringify(item.user))
        resolve(item)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.logout().then(() => {
        commit('SET_INFO', {})
        commit('SET_TOKEN', null)
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_INFO', {})
      commit('SET_TOKEN', null)
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
