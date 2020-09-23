<template>
  <div class="liveWrap">
    <div class="sliderWrap">
      <a-tabs
        :default-active-key="1"
        tab-position="left"
        style="height:90vh"
      >
        <a-tab-pane v-for="i in 10" :key="i" :tab="`频道${i}`"></a-tab-pane>
      </a-tabs>
    </div>
    <div class="videoWrap" :style="smallLayout? 'display: block;': ''">
      <div class="d-left" :style="smallLayout? 'width: 100%;height: auto;': ''">
        <div class="media-wrapper">
          <div class="media-player">
            <div class="playwrap">
              <div id="tcplayer"></div>
            </div>
          </div>
        </div>
        <div class="locationDetailWrap">
          <h4>人脸详情</h4>
          <div class="locDetail" :class="smallLayout? 'inlineDetail': ''">
            <p v-for="(val, k) in taskResItem" v-bind:key="k"><label>{{k}}：</label>{{val.indexOf(':') !== -1 ? val.substring(0, val.indexOf(':')) : val}}</p>
          </div>
        </div>
      </div>
      <div class="d-right" :style="smallLayout? 'width: 100%;height: auto;': ''">
        <a-tabs :default-active-key="1" size="small" @change="callback">
          <a-tab-pane key="add">
            <span slot="tab">
              <a-icon type="plus" />
              创建任务
            </span>
          </a-tab-pane>
          <a-tab-pane v-for="i in 3" :key="i" :tab="`任务${i}`">
            <div class="oprateWrap">
              <a-button type="primary" size="small">编辑</a-button>
              <a-button type="primary" size="small">删除</a-button>
              <a-button type="primary" size="small">复制</a-button>
              <a-button type="primary" size="small">执行</a-button>
              <a-button type="primary" size="small">停止</a-button>
            </div>
            <Face :taskresult="datalist" :smalllayout="smallLayout" @videofixed="videoFixed" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../api'
import { TcPlayer } from 'tcplayer'
import Setting from '../components/Setting'
import Face from '../components/Face'

var assetsBaseurl = ''
if (process.env.NODE_ENV === 'production') {
  assetsBaseurl = 'http://aicore.evereasycom.cn:8001'
} else {
  assetsBaseurl = 'http://127.0.0.1:8001'
}

export default {
  beforeRouteEnter (to, from, next) {
    next()
  },
  components: { Setting, Face },
  data () {
    return {
      smallLayout: false,
      datalist: [],
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
      taskResult: [
        {
          'faceId': '1-AAABczbmMnw9SqFvAAAAAg==',
          'name': '张含韵',
          'time': '1分1秒',
          '上身纹理': '横条纹:0.82310396',
          '下身尺寸': '长:0.9772702',
          '下身类型': '短裙:0.8407891',
          '下身颜色': '黑色:0.9499273',
          '人朝向': '前:0.97419655',
          '体形': '正常:0.99434173',
          '发型': '长:0.9999629',
          '头发': '长发',
          '年龄': '18-30岁:0.9642571',
          '性别': '女性:0.9999788',
          '有无带包': '是:0.89711547',
          '肤色': '黄皮肤'
        },
        {
          'faceId': '2-AAABczbmMnw9SqFvAAAAAg==',
          'name': '张含韵',
          'time': '53秒',
          '上身纹理': '横条纹:0.82310396',
          '下身尺寸': '长:0.9772702',
          '下身类型': '短裙:0.8407891',
          '下身颜色': '黑色:0.9499273',
          '人朝向': '前:0.97419655',
          '体形': '正常:0.99434173',
          '发型': '长:0.9999629',
          '头发': '长发',
          '年龄': '18-30岁:0.9642571',
          '性别': '女性:0.9999788',
          '有无带包': '是:0.89711547',
          '肤色': '黄皮肤'
        }
      ]
    }
  },
  mounted () {
    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 768) {
      this.smallLayout = true
    }

    // this.taskId = this.$route.params.taskId
    // if (this.taskId) {
    //   this.getTasks()
    //   this.getTaskResults()
    // }
    this.datalist = this.taskResult
    this.createPlayer()

    var ele = document.querySelectorAll('.file-main')
    if (ele.length) {
      ele[0].style.backgroundColor = '#171819'
    }
  },
  methods: {
    getTasks () {
      var params = {
        taskId: this.taskId
      }
      api.getTasks(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          var task = res.data.data
          task.url = task.url.replace('http://172.16.44.101:8001', assetsBaseurl)
          this.task = task

          var widthPlayer = document.querySelector('#tcplayer').offsetWidth
          this.widthPlayer = widthPlayer
          this.heightPlayer = widthPlayer * 9 / 16
          document.querySelector('#tcplayer').style.height = this.heightPlayer + 'px'
          this.createPlayer()
        }
      }).catch(error => {
        console.log('error:')
        console.log(error)
      })
    },
    getTaskResults () {
      var params = {
        taskId: this.taskId
      }
      api.getTaskResults(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          res.data.map((value, index, array) => {
            value.fullUri = value.fullUri.replace('http://172.16.44.101:8001', assetsBaseurl)
          })
          this.datalist = res.data || []
        }
      }).catch(error => {
        console.log('error:')
        console.log(error.response)
      })
    },
    callback (key) {
      console.log(key)
    },
    createPlayer () {
      var url = this.datavideo.play_url
      // var url = this.task.url

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
          console.log('listener:', msg)
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
      var timeStr = params.currentTime
      var h = 0
      var m = 0
      var s = 0
      if (timeStr.indexOf('时') !== -1) {
        h = timeStr.substring(0, timeStr.indexOf('时'))
        timeStr = timeStr.replace(timeStr.substring(0, timeStr.indexOf('时') + 1), '')
      }
      if (timeStr.indexOf('分') !== -1) {
        m = timeStr.substring(0, timeStr.indexOf('分'))
        timeStr = timeStr.replace(timeStr.substring(0, timeStr.indexOf('分') + 1), '')
      }
      if (timeStr.indexOf('秒') !== -1) {
        s = timeStr.substring(0, timeStr.indexOf('秒'))
      }
      var time = parseInt(h * 3600) + parseInt(m * 60) + parseInt(s)
      // console.log(h + ':' + m + ':' + s + ':::' + time)
      window.player.currentTime(time)

      console.log(params.item)
      this.taskResItem = params.item
    }
  }
}
</script>
<style scoped>
.liveWrap {
  display: flex;
}
.liveWrap .sliderWrap {
  width: 91px;
}
.oprateWrap {
  margin: 0 15px 15px;
}
.videoWrap {
  flex: 1;
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
</style>
