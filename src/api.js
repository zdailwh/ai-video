import axios from 'axios'
import store from './store'

// const mock = (process.env.NODE_ENV === 'production') ? {} : require('./mock')
const mock = require('./mock')

function timeout (ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export default {
  // async addFacegroup (params) {
  //   var res = await axios.post('/api/v2/facegroup', {
  //     name: params.name,
  //     description: params.description,
  //     group_type: params.group_type
  //   })
  //   return res
  // },

  // async delFacegroup (params) {
  //   var res = await axios.delete('/api/v2/facegroup/' + params.id)
  //   return res
  // },

  // async getFacegroups (params) {
  //   var res = await axios.get('/api/v2/facegroup', {
  //     params: {
  //       pageOffset: params.pageOffset,
  //       pageSize: params.pageSize,
  //       nextPageToken: params.nextPageToken
  //     }
  //   })
  //   return res
  // },

  async addFace (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.post(`http://${store.state.hosturl}/api/v2/face`, params)
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.face)
    // data.Name = params.Name
    // data.Desc = params.Desc
    // data.Gender = params.Gender
    // data.Birthday = params.Birthday
    // return { status: 200, data: data }
    // }
  },

  async editFace (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.put(`http://${store.state.hosturl}/api/v2/face/${params.id}`, {
      ID: params.ID,
      name: params.Name,
      desc: params.Desc || '',
      gender: params.Gender || '',
      birthday: params.Birthday || '',
      files: params.files
    })
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.face)
    // data.Name = params.Name
    // data.Desc = params.Desc
    // data.Gender = params.Gender
    // data.Birthday = params.Birthday
    // return { status: 200, data: data }
    // }
  },

  async delFace (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.delete(`http://${store.state.hosturl}/api/v2/face/${params.FaceID}`)
    return res
    // } else {
    // return { status: 200 }
    // }
  },

  async getFaces (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var opts = {
      limit: params.pageSize,
      page_num: params.pageNum
    }
    var res = await axios.get(`http://${store.state.hosturl}/api/v2/face`, {
      params: opts
    })
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.faces)
    // return { status: 200, data: data }
    // }
  },

  async getFacesByName (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var opts = {
      limit: params.pageSize,
      page_num: params.pageNum
    }
    var res = await axios.get(`http://${store.state.hosturl}/api/v2/face/${params.name}`, {
      params: opts
    })
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.faces)
    // return { status: 200, data: data }
    // }
  },

  async addFeature (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.post(`http://${store.state.hosturl}/api/v2/feature`, {
      name: params.name,
      desc: params.desc
    })
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.feature)
    // data.name = params.name
    // data.desc = params.desc
    // return { status: 200, data: data }
    // }
  },

  async delFeature (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.delete(`http://${store.state.hosturl}/api/v2/feature/${params.id}`)
    return res
    // } else {
    // return { status: 200 }
    // }
  },

  async addTask (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.post(`http://${store.state.hosturl}/api/v2/video`, params)
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.video)
    // return { status: 200, data: data }
    // }
  },

  async editTask (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.put(`http://${store.state.hosturl}/api/v2/video`, params)
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.video)
    // return { status: 200, data: data }
    // }
  },

  async delTask (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.delete(`http://${store.state.hosturl}/api/v2/video/${params.id}`)
    return res
    // } else {
    // return { status: 200 }
    // }
  },

  async getTasks (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var opts = {
      limit: params.pageSize,
      page_num: params.pageNum,
      stream_type: params.stream_type
    }
    if (params.name) {
      opts.name = params.name
    }
    var res = await axios.get(`http://${store.state.hosturl}/api/v2/video`, {
      params: opts
    })
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.videos)
    // return { status: 200, data: data }
    // }
  },

  async getTasksById (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.get(`http://${store.state.hosturl}/api/v2/video/data/${params.taskId}`)
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.video)
    // return { status: 200, data: data }
    // }
  },

  async getTasksByName (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var opts = {
      limit: params.pageSize,
      page_num: params.pageNum
    }
    var res = await axios.get(`http://${store.state.hosturl}/api/v2/video/search/${params.name}`, {
      params: opts
    })
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.videos)
    // return { status: 200, data: data }
    // }
  },

  async taskStop (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.post(`http://${store.state.hosturl}/api/v2/video/stop/${params.id}`)
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.video)
    // return { status: 200, data: data }
    // }
  },

  async taskRestart (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.post(`http://${store.state.hosturl}/api/v2/video/restart/${params.id}`)
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.video)
    // return { status: 200, data: data }
    // }
  },

  async getTaskResults (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var opts = {
      page: params.pageNum,
      limit: params.pageSize
    }
    var res = await axios.get(`http://${store.state.hosturl}/api/v2/video/result/${params.taskId}`, {
      params: opts
    })
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.result)
    // return { status: 200, data: data }
    // }
  },

  async getDemo () {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.get(`http://${store.state.hosturl}/api/v2/demo`)
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.demo)
    // return { status: 200, data: data }
    // }
  },

  async demoStart (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.post(`http://${store.state.hosturl}/api/v2/demo`, params)
    return res
    // } else {
    // return { status: 200, data: {} }
    // }
  },

  async demoPause () {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var res = await axios.post(`http://${store.state.hosturl}/api/v2/demo/pause`)
    return res
    // } else {
    // return { status: 200, data: {} }
    // }
  },

  async getDemoMessages (params) {
    if (!store.state.hosturl) return
    // if (process.env.NODE_ENV === 'production') {
    var opts = {
      limit: params.pageSize
    }
    var res = await axios.get(`http://${store.state.hosturl}/api/v2/demo/message`, {
      params: opts
    })
    return res
    // } else {
    // const data = await await timeout(200).then(() => mock.demoMessages)
    // return { status: 200, data: data }
    // }
  },

  async login (params) {
    // if (process.env.NODE_ENV === 'production') {
    //   var res = await axios.post('/api/v2/login', {
    //     username: params.username,
    //     password: params.password
    //   })
    //   return res
    // } else {
    const data = await await timeout(200).then(() => mock.authentication)
    return { status: 200, data: data }
    // }
  },

  async logout (params) {
    // if (process.env.NODE_ENV === 'production') {
    //   var res = await axios.get('/api/v2/logout')
    //   return res
    // } else {
    const data = await await timeout(200).then(() => mock.authentication)
    return { status: 200, data: data }
    // }
  }
}
