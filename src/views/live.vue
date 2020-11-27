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
        <a-tabs v-model="activeTab" size="small" @change="tabChange" @tabClick="tabClick">
          <a-tab-pane key="add">
            <span slot="tab">
              <a-icon type="plus" />
              创建任务
            </span>
          </a-tab-pane>
          <a-tab-pane v-for="(record, idx) in datalist" :key="record.ID" :tab="`任务${idx}`">
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
            <Face :taskresult="resDatalist" :smalllayout="smallLayout" @videofixed="videoFixed" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <AddTask :datalist="datalist" :add-visible="addVisible" :mock-data="mockData" :target-keys="targetKeys" :selected-keys="selectedKeys" :small-layout="smallLayout" @updateData="updateData" />
    <EditTask :datalist="datalist" :edit-visible="editVisible" :mock-data="mockData" :target-keys="targetKeys" :selected-keys="selectedKeys" :small-layout="smallLayout" :edit-tag="editTag" :edit-form="editForm" :edit-item="editItem" :edit-key="editKey" @updateData="updateData" />

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

var resDemo = [
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

export default {
  beforeRouteEnter (to, from, next) {
    next()
  },
  components: { Setting, Face, AddTask, EditTask },
  data () {
    return {
      smallLayout: false,
      spinning: false,
      prevTab: '',
      activeTab: '',
      searchForm: {
        type: '',
        taskId: ''
      },
      datalist: [],
      pageNum: 0,
      pageSize: 10,
      task: {},
      taskId: '',
      datavideo: {},
      resDatalist: [],
      taskResItem: {},
      addVisible: false,
      editVisible: false,
      mockData: stars,
      targetKeys: [],
      selectedKeys: [],
      editForm: {},
      editItem: {},
      editKey: '',
      editTag: '' // 'edit' || 'copy'
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
  },
  methods: {
    getTasks () {
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.searchForm.type !== '') {
        params.type = this.searchForm.type
      }
      if (this.searchForm.taskId !== '') {
        params.taskId = this.searchForm.taskId
      }
      this.spinning = true
      api.getTasks(params).then(res => {
        console.log(res)
        if (res.status >= 200 && res.status < 300) {
          // var tasks = res.data.data.map((value, index, array) => {
          //   value.url = value.url.replace('http://172.16.44.101:8001', assetsBaseurl)
          //   return value
          // })
          // this.datalist = this.datalist.concat(tasks)
          // this.pageNum = res.data.pageNum
          // this.pageSize = res.data.pageSize
          // this.nextPageToken = res.data.nextPageToken || ''
          // if (res.data.data.length && res.data.nextPageToken) {
          //   this.getTasks()
          // } else {
          //   this.spinning = false
          // }
          this.datalist = this.datalist.concat(res.data.data)
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
      api.getTasks(params).then(res => {
        console.log(res)
        if (res.status >= 200 && res.status < 300) {
          this.datavideo = res.data.data[0] || {}
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
          this.resDatalist = res.data.data || resDemo || []
        }
      }).catch(error => {
        console.log(error.response)
        this.$message.error(error.response.data.message || '任务结果获取出错！')
      })
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
    },
    delTask (record, idx) {
      var params = {
        id: record.ID
      }
      api.delTask(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist.splice(idx, 1)
          this.$message.success('任务删除成功')
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
      this.targetKeys = ['90-AAABc9vlwQmo265QAAAAAg==', '90-AAABc9uMGzuo265MAAAAAg==']
    },
    start (item, key) {
      // this.datalist[key].status = 1
      var params = {
        id: item.ID
      }
      api.taskRestart(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist[key].status = 1
          this.$message.success('任务已重启')
        }
      }).catch(error => {
        console.log(error.response)
        this.$message.error(error.response.data.message || '任务重启出错！')
      })
    },
    stop (item, key) {
      // this.datalist[key].status = 2
      var params = {
        id: item.ID
      }
      api.taskStop(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist[key].status = 2
          this.$message.success('任务已停止')
        }
      }).catch(error => {
        console.log(error.response)
        this.$message.error(error.response.data.message || '任务停止出错！')
      })
    },
    updateData (params) {
      this[params.key] = params.val
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
