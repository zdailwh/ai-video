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
      <div v-if="taskResItem.face_name" class="locationDetailWrap">
        <h4>人脸详情</h4>
        <div class="locDetail" :class="smallLayout? 'inlineDetail': ''">
          <ResDetail :res-item="taskResItem" />
        </div>
      </div>
    </div>
    <div class="d-right" :style="smallLayout? 'width: 100%;height: auto;': ''">
      <a-tabs default-active-key="1" size="small" @change="tabChange">
        <a-tab-pane key="1" :tab="'任务结果（共' + resDataTotal + '条）'">
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
          <div v-if="resDataTotal === ''" class="loadingWrap"><img src="static/loading_.gif"></div>
          <Face :taskresult="filtedResDatalist" :smalllayout="smallLayout" @videofixed="videoFixed" />
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
  components: { Setting, Face, ResDetail },
  data () {
    return {
      smallLayout: false,
      pageNum: 1,
      pageSize: 500,
      resDatalist: [],
      filtedResDatalist: [],
      task: {},
      taskId: '',
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
      resDataTotal: '',
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

    this.taskId = this.$route.params.taskId
    if (this.taskId) {
      this.getPlayurl(this.taskId)
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
          this.task = res.data
          if (this.task && this.task.rtsp && this.task.rtsp !== 'undefined') {
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
    getTaskResults (tid) {
      var that = this
      var params = {
        taskId: tid,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      api.getTaskResults(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.resDatalist = this.resDatalist.concat(res.data.data)
          this.resDataTotal = res.data.count
          this.pageNum += 1
          this.filtedResDatalist = this.resDatalist

          window.clearTimeout(timer)
          if (this.continueCircle && res.data.data.length === this.pageSize) {
            timer = window.setTimeout(function () {
              that.getTaskResults(tid)
            }, 0)
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
    tabChange (key) {
    },
    createPlayer () {
      var url = this.task.rtsp
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
      var filterName = this.searchForm.name
      var filterExp = this.searchForm.expression
      if (filterName === '' && filterExp === '全部') {
        // this.filtedResDatalist = this.resDatalist
        this.continueCircle = true
        this.getTaskResults(this.taskId)
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
      // console.log(h + ':' + m + ':' + s + ':::' + time)
      // window.player.currentTime(time)
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
  width: 120px;
  color: #cecece;
  margin-right: 10px;
}
.locationDetailWrap .locDetail.inlineDetail {
  display: flex;
  flex-wrap: wrap;
}
</style>
