import axios from 'axios'
axios.defaults.baseURL = '/apis'

// const host = 'http://127.0.0.1:8001'
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
      faceBase64: params.faceBase64
    })
    return res
  },

  async delFace (params) {
    var res = await axios.delete('/api/v1/face/' + params.id)
    return res
  },

  async getFaces (params) {
    var res = await axios.get('/api/v1/face', {
      params: {
        pageOffset: params.pageOffset,
        pageSize: params.pageSize,
        nextPageToken: params.nextPageToken,
        faceGroupId: params.faceGroupId
      }
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
