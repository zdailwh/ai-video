<template>
  <div class="liveWrap">
    <div class="videoWrap" :style="smallLayout? 'display: block;': ''">
      <div class="d-left" :style="smallLayout? 'width: 100%;height: auto;': ''">
        <div class="media-wrapper">
          <div class="media-player">
            <div class="playwrap">
              <div ref="videoobj"></div>
            </div>
          </div>
        </div>
        <div v-if="taskResItem.face_name" class="locationDetailWrap">
          <h4>人脸详情</h4>
          <div class="locDetail" :class="smallLayout? 'inlineDetail': ''">
            <ResDetail :res-item="taskResItem" />
          </div>
        </div>
      </div>
      <div class="d-right" :style="smallLayout? 'width: 100%;height: auto;': ''">
        <a-tabs v-model="activeTab" size="small" @change="tabChange" @tabClick="tabClick">
          <a-tab-pane key="1" tab="任务结果">
            <div class="searchWrap_video">
              <a-form-model ref="demoForm" :model="demoForm" layout="inline">
                <a-form-model-item label="rtsp">
                  <a-input v-model="demoForm.rtsp" placeholder="rtsp视频流地址" allow-clear style="width: 245px;" />
                </a-form-model-item>
                <a-form-model-item>
                  <a-popconfirm
                      title="确定要启动该任务吗?"
                      ok-text="启动"
                      cancel-text="取消"
                      @confirm="start"
                    >
                    <a-button type="primary" :disabled="demoForm.rtsp === '' || task.status === 'VIDEO_PROCESSING'">启动任务</a-button>
                  </a-popconfirm>
                  <a-popconfirm
                      title="确定要暂停该任务吗?"
                      ok-text="暂停"
                      cancel-text="取消"
                      @confirm="pause"
                    >
                    <a-button type="danger" :disabled="task === {} || task.url === '' || task.status === 'VIDEO_PAUSED'" style="margin-left: 10px;">暂停任务</a-button>
                  </a-popconfirm>
                </a-form-model-item>
              </a-form-model>
            </div>
            <div class="searchWrap_video">
              <a-form-model ref="searchForm" :model="searchForm" layout="inline">
                <a-form-model-item label="明星">
                  <a-input v-model="searchForm.name" placeholder="姓名" allow-clear style="width: 110px;" />
                </a-form-model-item>
                <a-form-model-item label="表情">
                  <a-select v-model="searchForm.expression" :dropdownMatchSelectWidth="false" placeholder="表情筛选">
                    <a-select-option :value="item.value" v-for="(item,key) in expressionArr" v-bind:key="key">
                      {{item.name}}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item>
                  <a-button type="primary" ghost @click="searchHandleOk">搜索</a-button>
                </a-form-model-item>
              </a-form-model>
            </div>
            <div v-if="task && task.id && !resDatalist.length" class="loadingWrap"><img src="static/loading_.gif"></div>
            <Face :taskresult="filtedResDatalist" :smalllayout="smallLayout" @videofixed="videoFixed" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="任务基本信息">
            <DemoSetting :taskinfo="task"/>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

  </div>
</template>
<script>
import api from '../api'
// import { TcPlayer } from 'tcplayer'
import DemoSetting from '../components/DemoSetting'
import Face from '../components/Face'
import ResDetail from '../components/ResDetail'

var timer = null
export default {
  beforeRouteEnter (to, from, next) {
    next()
  },
  beforeRouteLeave (to, from, next) {
    this.continueCircle = false
    window.clearTimeout(timer)
    next()
  },
  components: { DemoSetting, Face, ResDetail },
  data () {
    return {
      smallLayout: false,
      spinning: false,
      prevTab: '',
      activeTab: '1',
      pageSize: 10,
      task: {},
      taskId: '',
      resDatalist: [],
      filtedResDatalist: [],
      taskResItem: {},
      searchForm: {
        name: '',
        expression: '全部'
      },
      expressionArr: [
        { name: '全部', value: '全部' },
        { name: '惊吓', value: 'surprise' },
        { name: '反感', value: 'disgust' },
        { name: '悲伤', value: 'sad' },
        { name: '高兴', value: 'happy' },
        { name: '中性', value: 'neutral' }
      ],
      demoForm: {
        rtsp: ''
      },
      continueCircle: true // 是否继续轮循
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

    this.getPlayurl()
  },
  methods: {
    tabChange (tab) {
    },
    tabClick () {
      this.prevTab = this.activeTab
    },
    getPlayurl () {
      api.getDemo().then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.task = res.data
          if (this.task && this.task.id) {
            this.getTaskResults()
          }
          if (this.task && this.task.url) {
            this.demoForm.rtsp = this.task.url
            this.createPlayer()
          }
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '获取任务详情出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    getTaskResults () {
      var that = this
      var params = {
        pageSize: this.pageSize
      }
      api.getDemoMessages(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.resDatalist = this.resDatalist.concat(res.data.data)
          this.filtedResDatalist = this.resDatalist
          window.clearTimeout(timer)
          if (this.continueCircle && this.task.status === 'VIDEO_PROCESSING') {
            timer = window.setTimeout(function () {
              that.getTaskResults()
            }, 1000)
          }
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '获取任务结果出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    start () {
      var formdata = new FormData()
      formdata.append('rtsp', this.demoForm.rtsp)
      api.demoStart(formdata).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.$message.success('任务已启动')
          this.getPlayurl()
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '任务启动出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    pause () {
      api.demoPause().then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.$message.success('任务已暂停')
          this.getPlayurl()
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '任务暂停出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    createPlayer () {
      var url = this.task.url
      // var url = 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov'

      let obj = document.createElement('OBJECT')
      obj.setAttribute('id', 'vlc')
      obj.setAttribute('classid', 'clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921')
      obj.setAttribute('codebase', 'http://comic.sjtu.edu.cn/vlc/cab/axvlc.cab')
      obj.setAttribute('type', 'application/x-vlc-plugin')
      obj.setAttribute('events', true)

      let param1 = document.createElement('param')
      param1.setAttribute('name', 'mrl')
      param1.setAttribute('value', url)
      obj.appendChild(param1)

      let param2 = document.createElement('param')
      param2.setAttribute('name', 'src')
      param2.setAttribute('value', url)
      obj.appendChild(param2)

      let param3 = document.createElement('param')
      param3.setAttribute('name', 'controls')
      param3.setAttribute('value', true)
      obj.appendChild(param3)

      let param4 = document.createElement('param')
      param4.setAttribute('name', 'autoplay')
      param4.setAttribute('value', true)
      obj.appendChild(param4)

      let embed = document.createElement('embed')
      embed.setAttribute('type', 'application/x-vlc-plugin')
      embed.setAttribute('version', 'VideoLAN.VLCPlugin.3.0.11')
      embed.setAttribute('autoplay', 'yes')
      embed.setAttribute('loop', 'no')
      embed.setAttribute('width', '100%')
      embed.setAttribute('height', '480')
      embed.setAttribute('target', url)
      obj.appendChild(embed)

      obj.setAttribute('width', '100%')
      obj.setAttribute('height', '480')
      this.$refs['videoobj'].appendChild(obj)
      // 在这里通过ocxTest的id来寻找到ocx控件
      // this.vlc = document.getElementById('vlc')
    },
    videoFixed (params) {
      this.taskResItem = params.item
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
      // // console.log(h + ':' + m + ':' + s + ':::' + time)
      // window.player.currentTime(time)
    },
    searchHandleOk () {
      var filterName = this.searchForm.name
      var filterExp = this.searchForm.expression
      if (filterName === '' && filterExp === '全部') {
        // this.filtedResDatalist = this.resDatalist
        this.continueCircle = true
        this.getTaskResults()
      } else {
        this.continueCircle = false
        window.clearTimeout(timer)
        var arr = this.resDatalist
        arr = arr.filter((item, val, array) => {
          if (filterName === '') {
            if (item.data.Expression && item.data.Expression.name && item.data.Expression.name === filterExp) {
              return true
            } else {
              return false
            }
          } else if (filterExp === '全部') {
            if (item.face_name && item.face_name === filterName) {
              return true
            } else {
              return false
            }
          } else {
            if (item.face_name && item.face_name === filterName && item.data.Expression && item.data.Expression.name && item.data.Expression.name === filterExp) {
              return true
            } else {
              return false
            }
          }
        })
        this.filtedResDatalist = arr
      }
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
  width: 120px;
  color: #cecece;
  margin-right: 10px;
}
.locationDetailWrap .locDetail.inlineDetail {
  display: flex;
  flex-wrap: wrap;
}
</style>
