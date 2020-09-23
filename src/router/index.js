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
      component: Video
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
      component: Task
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/star',
      name: 'Star',
      component: Star
    },
    {
      path: '/live',
      name: 'Live',
      component: Live
    }
  ]
})
