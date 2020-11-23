import axios from 'axios'

// const mock = (process.env.NODE_ENV === 'production') ? {} : require('./mock')
const mock = require('./mock')

function timeout (ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://182.92.115.19:8001'
} else {
  axios.defaults.baseURL = ''
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
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post('/api/v2/face', {
        name: params.Name,
        desc: params.Desc,
        gender: params.Gender,
        birthday: params.Birthday,
        file: params.file
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.face)
      data.Name = params.Name
      data.Desc = params.Desc
      data.Gender = params.Gender
      data.Birthday = params.Birthday
      return { status: 200, data: data }
    }
  },

  async editFace (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.put('/api/v2/face/' + params.id, {
        name: params.Name,
        desc: params.Desc,
        gender: params.Gender,
        birthday: params.Birthday,
        file: params.file
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.face)
      data.Name = params.Name
      data.Desc = params.Desc
      data.Gender = params.Gender
      data.Birthday = params.Birthday
      return { status: 200, data: data }
    }
  },

  async delFace (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.delete('/api/v2/face/' + params.FaceID)
      return res
    } else {
      return { status: 200 }
    }
  },

  async getFaces (params) {
    if (process.env.NODE_ENV === 'production') {
      var opts = {
        limit: params.pageSize,
        page_num: params.pageNum
      }
      if (params.name) {
        opts.name = params.name
      }
      var res = await axios.get('/api/v2/face', {
        params: opts
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.faces)
      return { status: 200, data: data }
    }
  },

  async addFeature (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post('/api/v2/feature', {
        name: params.name,
        desc: params.desc
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.feature)
      data.name = params.name
      data.desc = params.desc
      return { status: 200, data: data }
    }
  },

  async delFeature (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.delete('/api/v2/feature/' + params.id)
      return res
    } else {
      return { status: 200 }
    }
  },

  async addTask (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post('/api/v2/video', params)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.video)
      return { status: 200, data: data }
    }
  },

  async editTask (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.put('/api/v2/video', params)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.video)
      return { status: 200, data: data }
    }
  },

  async delTask (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.delete('/api/v2/video/' + params.id)
      return res
    } else {
      return { status: 200 }
    }
  },

  async getTasks (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.get('/api/v2/video', {
        params: {
          type: params.type,
          taskId: params.taskId,
          page_num: params.pageNum,
          limit: params.pageSize
        }
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.videos)
      return { status: 200, data: data }
    }
  },

  async taskStop (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post('/api/v2/video/stop/' + params.id)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.video)
      return { status: 200, data: data }
    }
  },

  async taskRestart (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post('/api/v2/video/restart/' + params.id)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.video)
      return { status: 200, data: data }
    }
  },

  async getTaskResults (params) {
    var res = await axios.get('/api/v2/video/result/' + params.taskId)
    return res
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
