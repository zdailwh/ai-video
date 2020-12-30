// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

import './styles/reset.css'

import { getToken } from './utils/auth'

Vue.use(Antd)
Vue.use(VueLazyload, {
  error: 'static/error.png', // 这个是请求失败后显示的图片
  loading: 'static/loading.gif', // 这个是加载的loading过渡效果
  try: 2 // 这个是加载图片数量
})

Vue.config.productionTip = false

const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  // set page title
  document.title = to.meta.title

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
