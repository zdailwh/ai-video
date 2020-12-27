import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import Video from '@/views/video'
import Login from '@/views/login'
import Facegroup from '@/views/facegroup'
import Face from '@/views/face'
import Task from '@/views/task'
import Star from '@/views/star'
import Live from '@/views/live'
import Setting from '@/views/setting'
import Demo from '@/views/demo'
import LiveTest from '@/views/liveTest'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/star'
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/video/:taskId',
      name: 'Video',
      component: Video,
      meta: {
        title: '查看任务结果'
      }
    },
    {
      path: '/facegroup',
      name: 'Facegroup',
      component: Facegroup
    },
    {
      path: '/face/:facegroupId',
      name: 'Face',
      component: Face
    },
    {
      path: '/task',
      name: 'Task',
      component: Task,
      meta: {
        title: '离线任务'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/star',
      name: 'Star',
      component: Star,
      meta: {
        title: '明星库'
      }
    },
    {
      path: '/live',
      name: 'Live',
      component: Live,
      meta: {
        title: '直播流'
      }
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting,
      meta: {
        title: '设置'
      }
    },
    {
      path: '/demo',
      name: 'Demo',
      component: Demo,
      meta: {
        title: '陌生人Demo'
      }
    },
    {
      path: '/livetest',
      name: 'LiveTest',
      component: LiveTest,
      meta: {
        title: '直播流测试'
      }
    }
  ]
})
