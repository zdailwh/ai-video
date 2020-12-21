<template>
  <div class="videoWrap" :style="smallLayout? 'display: block;': ''">
    <div class="d-left" :style="smallLayout? 'width: 100%;height: auto;': ''">
      <!-- <div class="media-wrapper">
        <div class="media-player">
          <div class="playwrap">
            <div id="tcplayer"></div>
          </div>
        </div>
      </div> -->
      <div v-if="taskResItem.name" class="locationDetailWrap">
        <h4>人脸详情</h4>
        <div class="locDetail" :class="smallLayout? 'inlineDetail': ''">
          <template v-for="(detail, k) in taskResItem">
            <p v-if="resLabel[k]" v-bind:key="k">
              <label>{{resLabel[k]}}：</label>
              <template v-if="typeof(detail) === 'object'">
                {{detail['value']}}（{{detail.confidence | myToFixed}}）
              </template>
              <template v-else>
                {{detail}}
              </template>
            </p>
          </template>
          <p class="resImgs">
            人脸图：
            <img :src="taskResItem.faceImageUri">
          </p>
          <p class="resImgs">
            人体图：
            <img :src="taskResItem.humanImageUri">
          </p>
        </div>
      </div>
    </div>
    <div class="d-right" :style="smallLayout? 'width: 100%;height: auto;': ''">
      <a-tabs default-active-key="1" size="small" @change="tabChange">
        <a-tab-pane key="1" tab="任务结果">
          <!-- <div class="searchWrap_video">
            <a-form-model ref="searchForm" :model="searchForm" layout="inline">
              <a-form-model-item label="人脸">
                <a-select v-model="searchForm.type" mode="multiple" :dropdownMatchSelectWidth="false">
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option :value="key" v-for="(val,key) in typeArr" v-bind:key="key">
                    {{val}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item>
                <a-button type="primary" @click="searchHandleOk">搜索</a-button>
              </a-form-model-item>
            </a-form-model>
          </div> -->
          <Face :taskresult="resDatalist" :smalllayout="smallLayout" @videofixed="videoFixed" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="任务基本信息">
          <Setting :taskinfo="task"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import api from '../api'
import { TcPlayer } from 'tcplayer'
import Setting from '../components/Setting'
import Face from '../components/Face'

// var assetsBaseurl = ''
// if (process.env.NODE_ENV === 'production') {
//   assetsBaseurl = 'http://aicore.evereasycom.cn:8001'
// } else {
//   assetsBaseurl = 'http://127.0.0.1:8001'
// }
var resLabel = {
  'AgeNum': '年龄',
  'DressLowerColor': '下身颜色',
  'DressLowerStyle': '下身类型',
  'DressUpperCoat': '上身外套',
  'DressUpperColor': '上身颜色',
  'DressUpperSize': '上身尺寸',
  'Gender': '性别',
  'Orientation': '人朝向',
  'WearHat': '戴帽子',
  'beard': '胡子',
  'expression': '表情',
  'glasses': '眼镜',
  'hair': '头发',
  // 'attributes': '',
  // 'faceImageUri': '明星人脸',
  // 'faceRect': '',
  'face_id': '明星ID',
  // 'humanImageUri': '人脸图',
  // 'humanRect': '',
  'name': '姓名',
  'time': '时间'
}
// var resDemo = [
//   {
//     'AgeNum': {
//       'confidence': '0.5508909453637898',
//       'value': '⻘年'
//     },
//     'DressLowerColor': {
//       'confidence': '0.6308667659759521',
//       'value': '⿊'
//     },
//     'DressLowerStyle': {
//       'confidence': '0.9552142918109894',
//       'value': '⻓裤'
//     },
//     'DressUpperCoat': {
//       'confidence': '0.975117564201355',
//       'value': '⽆'
//     },
//     'DressUpperColor': {
//       'confidence': '0.6354866623878479',
//       'value': '⿊'
//     },
//     'DressUpperSize': {
//       'confidence': '0.9683660864830017',
//       'value': '⻓'
//     },
//     'Gender': {
//       'confidence': '0.8621735572814941',
//       'value': '⼥性'
//     },
//     'Orientation': {
//       'confidence': '0.9972658157348633',
//       'value': '前'
//     },
//     'WearHat': {
//       'confidence': '0.9996252059936523',
//       'value': '⽆'
//     },
//     'attributes': [],
//     'beard': {
//       'confidence': '0.9999998807907104',
//       'value': 'bread_no_beard'
//     },
//     'expression': {
//       'confidence': '0.54018754',
//       'value': '中性'
//     },
//     'faceImageUri': 'http://10.122.94.101:8001/v5/resources/data?uri=weed%3A%2F%2F16%2C0bbfbb6616a9e2&contentType=image/jpeg',
//     'faceRect': '[472.4103698730469,218.06553649902344,720.6224365234375,456.7046813964844]',
//     'face_id': '5fc3ef8c-05fd-4ee5-b5fd-99c08cc8347f',
//     'glasses': {
//       'confidence': '0.9962349534034729',
//       'value': '没有'
//     },
//     'hair': {
//       'confidence': '0.999660849571228',
//       'value': '⻓发'
//     },
//     'humanImageUri': 'http://10.122.94.101:8001/v5/resources/data?uri=weed%3A%2F%2F16%2C0bbfb8eacbe33c&contentType=image/jpeg',
//     'humanRect': '',
//     'name': '张⾬绮',
//     'time': '12秒'
//   }
// ]

export default {
  beforeRouteEnter (to, from, next) {
    next()
  },
  components: { Setting, Face },
  filters: {
    myToFixed (val) {
      if (!val) return ''
      return parseFloat(val).toFixed(3)
    }
  },
  data () {
    return {
      smallLayout: false,
      resDatalist: [],
      task: {},
      taskId: '',
      taskResItem: {},
      searchForm: {
        type: ''
      },
      typeArr: [ '张含韵', '张雨绮', '宁静', '伊能静' ],
      datavideo: {
        play_url: 'https://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f40.mp4'
      },
      resLabel: resLabel
    }
  },
  mounted () {
    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 768) {
      this.smallLayout = true
    }
    var ele = document.querySelectorAll('.file-main')
    if (ele.length) {
      ele[0].style.backgroundColor = '#171819'
    }

    this.taskId = this.$route.params.taskId
    if (this.taskId) {
      // this.getPlayurl(this.taskId)
      this.getTaskResults(this.taskId)
    }
  },
  methods: {
    getPlayurl (tid) {
      var params = {
        taskId: tid
      }
      api.getTasksById(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datavideo = res.data.data || {}
          if (this.datavideo) {
            this.createPlayer()
          }
        }
      }).catch(error => {
        console.log(error.response)
        this.$message.error(error.response.data.message || '获取任务详情出错！')
      })
    },
    getTaskResults (tid) {
      var params = {
        taskId: tid
      }
      api.getTaskResults(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // res.data.map((value, index, array) => {
          //   value.fullUri = value.fullUri.replace('http://172.16.44.101:8001', assetsBaseurl)
          // })
          this.resDatalist = res.data || []
        }
      }).catch(error => {
        console.log(error.response)
        this.$message.error(error.response.data.message || '任务结果获取出错！')
      })
    },
    tabChange (key) {
      console.log(key)
    },
    createPlayer () {
      var url = this.datavideo.play_url || 'https://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f40.mp4'
      // var url = this.task.url
      document.querySelector('#tcplayer').innerHTML = ''
      var player = new TcPlayer('tcplayer', {
        mp4: url,
        autoplay: true,
        width: '100%',
        height: 'auto',
        wording: {
          1001: '网络错误，请检查网络配置或者播放链接是否正确',
          1002: '获取视频失败，请检查播放链接是否有效',
          2032: '获取视频失败，请检查播放链接是否有效',
          2048: '无法加载视频文件，跨域访问被拒绝'
        },
        listener: function (msg) {
          // console.log('listener:', msg)
          // if (msg.type === 'play') {
          //   self.videoPlay()
          // }
          // if (msg.type === 'loadeddata') {
          //   player.play()
          // }
        }
      })
      window.player = player
    },
    searchHandleOk () {
      this.$refs.searchForm.validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    videoFixed (params) {
      // var timeStr = params.currentTime
      // var h = 0
      // var m = 0
      // var s = 0
      // if (timeStr.indexOf('时') !== -1) {
      //   h = timeStr.substring(0, timeStr.indexOf('时'))
      //   timeStr = timeStr.replace(timeStr.substring(0, timeStr.indexOf('时') + 1), '')
      // }
      // if (timeStr.indexOf('分') !== -1) {
      //   m = timeStr.substring(0, timeStr.indexOf('分'))
      //   timeStr = timeStr.replace(timeStr.substring(0, timeStr.indexOf('分') + 1), '')
      // }
      // if (timeStr.indexOf('秒') !== -1) {
      //   s = timeStr.substring(0, timeStr.indexOf('秒'))
      // }
      // var time = parseInt(h * 3600) + parseInt(m * 60) + parseInt(s)
      // console.log(h + ':' + m + ':' + s + ':::' + time)
      // window.player.currentTime(time)

      this.taskResItem = params.item
    }
  }
}
</script>
<style scoped>
.videoWrap {
  display: flex;
  height: 100%;
}
.d-left {
  width: 50%;
  height: 100%;
}
.d-right {
  width: 50%;
  height: 100%;
  overflow-y: hidden;
}
.media-wrapper {
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
}
.media-wrapper .media-player {
  text-align: center;
  width: 100%;
  position: relative;
}
.playwrap {
  padding: 0 5px;
}

.cut_catalog_dropdown {
  position: absolute;
  right: 5px;
  bottom: -153px;
  width: 210px;
  height: 153px;
  z-index: 1000;
  border-radius: 4px;
  background: #2d2f31;
  box-shadow: 0 0 1px 0 rgba(10, 31, 68, 0.08), 0 8px 10px 0 rgba(10, 31, 68, 0.1);
}
.cut_catalog_dropdown .cut_catalog_list {
  padding: 10px;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item:first-child {
  margin-top: 0;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item {
  height: 24px;
  margin: 10px 0;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item span.title {
  width: 78px;
  font-size: 12px;
  color: #acb0b7;
  text-align: right;
  padding-right: 10px;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item input {
  width: 100px;
  font-size: 12px;
}
input[type="text"], textarea {
  -webkit-appearance: none;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item span.title, .cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item input {
  height: 24px;
  line-height: 24px;
  float: left;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item .anticon-close {
  position: absolute;
  top: 2px;
  right: 2px;
  color: #a5aab3;
  cursor: pointer;
  font-size: 13px;
  background: #3c3c3c;
  border-radius: 50%;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item .btn {
  display: inline-block;
  width: 78px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background-color: #3c3c3c;
  border-radius: 4px;
  color: #fff;
  margin: 0 5px;
  font-size: 12px;
  cursor: pointer;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item .btn.btn_ok {
  background-color: #2a92fe;
}
.searchWrap_video {
  margin-bottom: 15px;
}

.locationDetailWrap {
  margin: 0 20px 20px;
}
.locationDetailWrap h4 {
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  margin: 10px 0;
}
.locationDetailWrap .locDetail p {
  color: #989898;
  font-size: 14px;
}
.locationDetailWrap .locDetail p label {
  display: inline-block;
  text-align: right;
  width: 80px;
  color: #cecece;
  margin-right: 10px;
}
.locationDetailWrap .locDetail.inlineDetail {
  display: flex;
  flex-wrap: wrap;
}
.resImgs {
  float: left;
  color: #cecece !important;
  width: 100px;
  margin-right: 10px;
}
.resImgs img {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
}
</style>
