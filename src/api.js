import axios from 'axios'
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://aicore.evereasycom.cn'
} else {
  axios.defaults.baseURL = 'apis'
}

export default {
  async addFacegroup (params) {
    var res = await axios.post('/api/v1/facegroup', {
      name: params.name,
      description: params.description,
      group_type: params.group_type
    })
    return res
  },

  async delFacegroup (params) {
    var res = await axios.delete('/api/v1/facegroup/' + params.id)
    return res
  },

  async getFacegroups (params) {
    var res = await axios.get('/api/v1/facegroup', {
      params: {
        pageOffset: params.pageOffset,
        pageSize: params.pageSize,
        nextPageToken: params.nextPageToken
      }
    })
    return res
  },

  async addFace (params) {
    var res = await axios.post('/api/v1/face', {
      faceGroupId: params.faceGroupId,
      name: params.name,
      desc: params.desc,
      sex: params.sex,
      birthday: params.birthday,
      faceBase64: params.faceBase64
    })
    return res
  },

  async editFace (params) {
    var res = await axios.put('/api/v1/face/' + params.id, {
      name: params.name,
      desc: params.desc,
      sex: params.sex,
      birthday: params.birthday,
      faceBase64: params.faceBase64
    })
    return res
  },

  async delFace (params) {
    var res = await axios.delete('/api/v1/face/' + params.id)
    return res
  },

  async getFaces (params) {
    var opts = {
      pageOffset: params.pageOffset,
      pageSize: params.pageSize,
      nextPageToken: params.nextPageToken,
      faceGroupId: params.faceGroupId
    }
    if (params.name) {
      opts.name = params.name
    }
    var res = await axios.get('/api/v1/face', {
      params: opts
    })
    return res
  },

  async addTask (params) {
    var res = await axios.post('/api/v1/task', {
      type: params.type,
      url: params.url,
      name: params.name,
      repoId: params.repoId,
      rate: params.rate
    })
    return res
  },

  async delTask (params) {
    var res = await axios.delete('/api/v1/task/' + params.id + '?type=0')
    return res
  },

  async getTasks (params) {
    var res = await axios.get('/api/v1/task', {
      params: {
        type: params.type,
        taskId: params.taskId,
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        nextPageToken: params.nextPageToken
      }
    })
    return res
  },

  async getTaskResults (params) {
    var res = await axios.get('/api/v1/new_task_result/' + params.taskId)
    return res
  }
}
