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
  'FullURI': 'http://aicore.evereasycom.cn/ai-video/static/img/u1.998d5c7.png',
  'Features': ['http://aicore.evereasycom.cn/ai-video/static/img/u1.998d5c7.png', 'http://aicore.evereasycom.cn/ai-video/static/img/u1.998d5c7.png']
}

let templateFaces = {
  'count': 54,
  'data|1-54': [templateFace]
}

let templateVideo = {
  'ID|2-10000': 2,
  'CreatedAt': '2020-10-15T18:43:24.842+08:00',
  'UpdatedAt': '2020-10-15T18:43:24.842+08:00',
  'DeletedAt': {
    'Time': '0001-01-01T00:00:00Z',
    'Valid': false
  },
  'name': 'test20200915-4',
  'description': 'hank-test',
  'status|1': [0, 1, 2], // 0新建，1进⾏中，2完成
  'stream_type': 'offline',
  'threshold': 90,
  'type': '1'
}

let templateVideos = {
  'count': 54,
  'data|1-10': [templateVideo]
}

let templateFeature = {
  'CreatedAt': '2020-10-15T18:43:24.842+08:00',
  'UpdatedAt': '2020-10-15T18:43:24.842+08:00',
  'GroupID': 'default_base_group',
  'FaceID': 'fa4e41ac-ac78-4a94-b9bc-49ffadbf2400',
  'FullURI': 'http://10.122.94.101:8080/v5/resources/data?uri=weed%3A%2F%2F2%2C0135388d4b60&contentType=image/jpeg'
}

let templateFeatures = [templateFeature]

let templateResultItem = {
  'AgeNum': {
    'confidence': '0.5508909453637898',
    'value': '⻘年'
  },
  'DressLowerColor': {
    'confidence': '0.6308667659759521',
    'value': '⿊'
  },
  'DressLowerStyle': {
    'confidence': '0.9552142918109894',
    'value': '⻓裤'
  },
  'DressUpperCoat': {
    'confidence': '0.975117564201355',
    'value': '⽆'
  },
  'DressUpperColor': {
    'confidence': '0.6354866623878479',
    'value': '⿊'
  },
  'DressUpperSize': {
    'confidence': '0.9683660864830017',
    'value': '⻓'
  },
  'Gender': {
    'confidence': '0.8621735572814941',
    'value': '⼥性'
  },
  'Orientation': {
    'confidence': '0.9972658157348633',
    'value': '前'
  },
  'WearHat': {
    'confidence': '0.9996252059936523',
    'value': '⽆'
  },
  'HatColor': {
    'confidence': '0.9996252059936523',
    'value': '⿊'
  },
  'attributes': [],
  'beard': {
    'confidence': '0.9999998807907104',
    'value': 'bread_no_beard'
  },
  'expression': {
    'confidence': '0.54018754',
    'value': '中性'
  },
  'expression_three': {
    'confidence': '[1, 2]',
    'value': 'unknown'
  },
  'faceImageUri': 'http://10.122.94.101:8001/v5/resources/data?uri=weed%3A%2F%2F16%2C0bbfbb6616a9e2&contentType=image/jpeg',
  'faceRect': '[472.4103698730469,218.06553649902344,720.6224365234375,456.7046813964844]',
  'face_id': '5fc3ef8c-05fd-4ee5-b5fd-99c08cc8347f',
  'glasses': {
    'confidence': '0.9962349534034729',
    'value': '没有'
  },
  'hair': {
    'confidence': '0.999660849571228',
    'value': '⻓发'
  },
  'humanImageUri': 'http://10.122.94.101:8001/v5/resources/data?uri=weed%3A%2F%2F16%2C0bbfb8eacbe33c&contentType=image/jpeg',
  'humanRect': '',
  'name': '张⾬绮',
  'time': '12秒'
}

let templateResult = [templateResultItem]

let templateDemo = {
  'id': 'aa-bb-cc',
  'name': 'demo',
  'description': 'demo',
  'url': 'rtsp://xxxx.xx.x.x/xx',
  'status': 'VIDEO_PROCESSING' // VIDEO_PREPARING，VIDEO_PROCESSING，VIDEO_PAUSED，VIDEO_ERROR
}
let templateDemoMessages = {
  'data|1-10': [templateResultItem]
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
let feature = Mock.mock(templateFeature)
let features = Mock.mock(templateFeatures)
let result = Mock.mock(templateResult)
let demo = Mock.mock(templateDemo)
let demoMessages = Mock.mock(templateDemoMessages)

module.exports = {
  face,
  faces,
  video,
  videos,
  feature,
  features,
  result,
  demo,
  demoMessages,
  authentication
}
