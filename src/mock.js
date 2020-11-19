const Mock = require('mockjs')

const Random = Mock.Random
Random.datetime('yyyy-MM-dd HH:mm:ss')
Random.date('yyyy-MM-dd')
Random.string('lower', 3, 7)
Random.cname()
Random.province()
Random.city()
Random.county()
Random.cword()
Random.natural()

let templateFace = {
  'ID|2-10000': 2,
  'CreatedAt': '2020-10-15T17:54:52.43+08:00',
  'UpdatedAt': '2020-10-15T17:54:52.43+08:00',
  'GroupID': 'default_base_group',
  'FaceID': '5fc3ef8c-05fd-4ee5-b5fd-99c08cc8347f',
  'Name': '张雨绮',
  'Gender': '',
  'Birthday': '',
  'FullURI': 'http://10.122.94.101:8080/v5/resources/data?uri=weed%3A%2F%2F2%2C0b63915c1ec4b1\u0026contentType=image/jpeg',
  'Features': ['http://aicore.evereasycom.cn/ai-video/static/img/u1.998d5c7.png', 'http://aicore.evereasycom.cn/ai-video/static/img/u1.998d5c7.png']
}

let templateFaces = {
  'data|1-10': [templateFace]
}

let templateVideo = {
  'ID|2-10000': 2,
  'create_time': '@datetime',
  'update_time': '@datetime',
  'DeletedAt': {
    'Time': '@datetime',
    'Valid': false
  },
  'name': '任务名称',
  'description': '任务描述',
  'status|1': [0, 1, 2], // 0新建，1进⾏中，2完成
  'type|0-2': 0,
  'url': '',
  'repoId|2-10000': 2,
  'rate|0-100': 50
}

let templateVideos = {
  'data|1-10': [templateVideo]
}

let user = {
  'id': '@id',
  'class': 'app\\user\\admin\\User',
  'class_name': '系统管理员',
  'model_name': '用户',
  'create_time': '@datetime',
  'update_time': '@datetime',
  'status|1': [1, 2],
  'statusstr|1': ['活跃', '禁用'],
  'path': '/api/admin/v1/users/2',
  'username': '@sentence(5, 10)',
  'mobile': '',
  'activity': '@integer(100, 500)'
}

let authentication = {
  'id': 965,
  'class': 'app\\user\\admin\\Authentication',
  'class_name': '登录认证',
  'model_name': '认证',
  'create_time': '2019-08-22 16:29:18',
  'update_time': '2019-08-22 16:49:40',
  'status|1': [0, 1, 2],
  'statusstr|1': ['活跃', '过期', '下线'],
  'path': '/api/admin/v1/authentications/965',
  'session': 'ej89fobjl830eoo8pdqhi63cmq',
  'clientip': '111.199.84.127',
  'expiretime': '2019-08-22 18:49:40',
  'user': user
}

let face = Mock.mock(templateFace)
let faces = Mock.mock(templateFaces)
let video = Mock.mock(templateVideo)
let videos = Mock.mock(templateVideos)

module.exports = {
  face,
  faces,
  video,
  videos,
  authentication
}