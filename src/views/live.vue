<template>
  <div class="liveWrap">
<!--     <div class="sliderWrap">
      <a-tabs
        :default-active-key="1"
        tab-position="left"
        style="height:90vh"
      >
        <a-tab-pane v-for="i in 10" :key="i" :tab="`频道${i}`"></a-tab-pane>
      </a-tabs>
    </div> -->
    <div class="videoWrap" :style="smallLayout? 'display: block;': ''">
      <div class="d-left" :style="smallLayout? 'width: 100%;height: auto;': ''">
        <div class="media-wrapper">
          <div class="media-player">
            <div class="playwrap">
              <div id="tcplayer"></div>
            </div>
          </div>
        </div>
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
        <a-tabs v-model="activeTab" size="small" @change="tabChange" @tabClick="tabClick">
          <a-tab-pane key="add">
            <span slot="tab">
              <a-icon type="plus" />
              创建任务
            </span>
          </a-tab-pane>
          <a-tab-pane v-for="(record, idx) in datalist" :key="record.ID" :tab="record.name">
            <div class="oprateWrap">
              <a-button type="primary" size="small" @click="toEdit(record, idx, 'edit')">编辑</a-button>
              <a-button type="primary" size="small" v-if="record.status === 1" :disabled="true">删除</a-button>
              <a-popconfirm
                v-else
                title="确定要删除该任务吗?"
                ok-text="删除"
                cancel-text="取消"
                @confirm="delTask(record, idx)"
              >
                <a-button type="primary" size="small">删除</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="toEdit(record, idx, 'copy')">复制</a-button>
              <a-popconfirm
                  v-if="record.status === 1"
                  title="确定要停止该任务吗?"
                  ok-text="停止"
                  cancel-text="取消"
                  @confirm="stop(record, idx)"
                >
                <a-button type="danger" size="small">停止</a-button>
              </a-popconfirm>
              <a-popconfirm
                  v-else
                  title="确定要执行该任务吗?"
                  ok-text="执行"
                  cancel-text="取消"
                  @confirm="start(record, idx)"
                >
                <a-button type="primary" size="small">执行</a-button>
              </a-popconfirm>
            </div>
            <!--结果筛选-->
            <div class="searchWrap_video">
              <a-form-model ref="searchForm" :model="searchForm" layout="inline">
                <a-form-model-item label="表情">
                  <a-select v-model="searchForm.expression" :dropdownMatchSelectWidth="false" placeholder="表情筛选">
                    <a-select-option :value="val" v-for="(val,key) in expressionArr" v-bind:key="key">
                      {{val}}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item>
                  <a-button type="primary" @click="searchHandleOk">搜索</a-button>
                </a-form-model-item>
              </a-form-model>
            </div>
            <Face :taskresult="filtedResDatalist" :smalllayout="smallLayout" @videofixed="videoFixed" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <AddTask tag="online" :datalist="datalist" :add-visible="addVisible" :faces-data="facesDatalist" :target-keys="targetKeys" :selected-keys="selectedKeys" :small-layout="smallLayout" @updateData="updateData" @getList="getTasks" />
    <EditTask tag="online" :datalist="datalist" :edit-visible="editVisible" :faces-data="facesDatalist" :target-keys="targetKeys" :selected-keys="selectedKeys" :small-layout="smallLayout" :edit-tag="editTag" :edit-form="editForm" :edit-item="editItem" :edit-key="editKey" @updateData="updateData" @getList="getTasks" />

  </div>
</template>
<script>
import api from '../api'
import { TcPlayer } from 'tcplayer'
import Setting from '../components/Setting'
import Face from '../components/Face'
import AddTask from '../components/AddTask.vue'
import EditTask from '../components/EditTask.vue'

import nj from '../assets/u3.jpg'
import zyq from '../assets/u1.png'
import wlk from '../assets/u5.jpg'
import wq from '../assets/u4.jpg'

var stars = [
  {
    create_time: '2020-08-24T07:04:42.427Z',
    description: '',
    fullUri: zyq,
    group_id: '163a28d9-bc6c-44a3-832f-9f07939d2265',
    key: '90-AAABdB9IjLv0dekZAAAAAQ==',
    id: '90-AAABdB9IjLv0dekZAAAAAQ==',
    Name: '张雨绮',
    title: '张雨绮'
  },
  {
    create_time: '2020-08-11T05:02:14.281Z',
    description: '宁静',
    fullUri: nj,
    group_id: '163a28d9-bc6c-44a3-832f-9f07939d2265',
    key: '90-AAABc9vlwQmo265QAAAAAg==',
    id: '90-AAABc9vlwQmo265QAAAAAg==',
    Name: '宁静',
    title: '宁静'
  },
  {
    create_time: '2020-08-11T05:01:52.489Z',
    description: '王丽坤',
    fullUri: wlk,
    group_id: '163a28d9-bc6c-44a3-832f-9f07939d2265',
    key: '90-AAABc9vla-mo265PAAAAAQ==',
    id: '90-AAABc9vla-mo265PAAAAAQ==',
    Name: '王丽坤',
    title: '王丽坤'
  },
  {
    create_time: '2020-08-11T03:24:19.131Z',
    description: '万茜',
    fullUri: wq,
    group_id: '163a28d9-bc6c-44a3-832f-9f07939d2265',
    key: '90-AAABc9uMGzuo265MAAAAAg==',
    id: '90-AAABc9uMGzuo265MAAAAAg==',
    Name: '万茜',
    title: '万茜'
  }
]
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
  'HatColor': '帽子颜色',
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
  components: { Setting, Face, AddTask, EditTask },
  filters: {
    myToFixed (val) {
      if (!val) return ''
      return parseFloat(val).toFixed(3)
    }
  },
  data () {
    return {
      stream_type: 'online',
      smallLayout: false,
      spinning: false,
      prevTab: '',
      activeTab: '',
      datalist: [],
      dataTotal: 0,
      pageNum: 1,
      pageSize: 20,
      task: {},
      taskId: '',
      resDatalist: [],
      filtedResDatalist: [],
      taskResItem: {},
      searchForm: {
        expression: '全部'
      },
      expressionArr: [ '全部', '惊吓', '反感', '悲伤', '高兴', '中性' ],
      addVisible: false,
      editVisible: false,
      mockData: stars,
      targetKeys: [],
      selectedKeys: [],
      editForm: {},
      editItem: {},
      editKey: '',
      editTag: '', // 'edit' || 'copy'
      resLabel: resLabel,
      facesDatalist: []
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

    this.getTasks()
    this.getAllFaces()
  },
  methods: {
    getTasks () {
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        stream_type: this.stream_type
      }
      this.spinning = true
      api.getTasks(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist = res.data.data
          if (this.pageNum === 1) {
            this.dataTotal = res.data.count
          }
          this.spinning = false
          if (this.datalist.length) {
            this.activeTab = this.datalist[0].ID
            this.getPlayurl(this.datalist[0].ID)
            this.getTaskResults(this.datalist[0].ID)
          }
        }
      }).catch(error => {
        this.spinning = false
        console.log('error:')
        console.log(error)
      })
    },
    tabChange (tab) {
      if (tab === 'add') {
        this.addVisible = true
        this.targetKeys = []
        this.activeTab = this.prevTab
      } else {
        this.getPlayurl(tab)
        this.getTaskResults(tab)
      }
    },
    tabClick () {
      this.prevTab = this.activeTab
    },
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
          this.filtedResDatalist = this.resDatalist
        }
      }).catch(error => {
        console.log(error.response)
        this.$message.error(error.response.data.message || '任务结果获取出错！')
      })
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
    videoFixed (params) {
      this.taskResItem = params.item
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
    },
    delTask (record, idx) {
      api.delTask({id: record.ID}).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.datalist.splice(idx, 1)
          this.$message.success('任务删除成功')
          this.getTasks()
        }
      }).catch(error => {
        console.log(error.response)
        this.$message.error(error.response.data.message || '删除出错！')
      })
    },
    toEdit (item, key, tag) {
      this.editTag = tag
      this.editVisible = true
      this.editItem = item
      this.editKey = key
      this.editForm = item
      this.editForm.type = parseInt(this.editForm.type)
      this.targetKeys = this.editForm.face_ids
    },
    start (item, key) {
      var params = {
        id: item.ID
      }
      api.taskRestart(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.datalist[key].status = 1
          this.$message.success('任务已重启')
          this.getTasks()
        }
      }).catch(error => {
        console.log(error.response)
        this.$message.error(error.response.data.message || '任务重启出错！')
      })
    },
    stop (item, key) {
      var params = {
        id: item.ID
      }
      api.taskStop(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.datalist[key].status = 2
          this.$message.success('任务已停止')
          this.getTasks()
        }
      }).catch(error => {
        console.log(error.response)
        this.$message.error(error.response.data.message || '任务停止出错！')
      })
    },
    updateData (params) {
      this[params.key] = params.val
    },
    getAllFaces () {
      var params = {
        pageNum: 1,
        pageSize: this.$store.state.faceTotal || 100
      }
      api.getFaces(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          var faceArr = res.data.data
          faceArr.map((item, key, arr) => {
            item.key = item.FaceID
            item.title = item.Name
          })
          this.facesDatalist = faceArr
        }
      }).catch(error => {
        console.log('error:')
        console.log(error)
      })
    },
    searchHandleOk () {
      var filterExp = this.searchForm.expression
      if (filterExp === '全部') {
        this.filtedResDatalist = this.resDatalist
      } else {
        var arr = this.resDatalist
        arr = arr.filter((item, val, array) => {
          if (item.expression && item.expression.value && item.expression.value === filterExp) {
            return true
          } else {
            return false
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
  max-width: 100px;
  border: 1px solid #ccc;
}
</style>
