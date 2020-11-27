<template>
  <div class="taskContainer">
    <!--搜索-->
    <div class="searchWrap" :style="smallLayout? 'flex-direction: column;': ''">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="任务类型" prop="type">
          <a-select v-model="searchForm.type" :dropdownMatchSelectWidth="false">
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option :value="key" v-for="(val,key) in typeArr_search" v-bind:key="key">
              {{val}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="任务ID" prop="taskId">
          <a-input v-model="searchForm.taskId" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="searchHandleOk"><a-icon key="search" type="search"/>搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
        </a-form-model-item>
      </a-form-model>
      <div>
        <a-button type="primary" @click="addVisible = true;targetKeys = []"><a-icon key="plus" type="plus"/>添加任务</a-button>
      </div>
    </div>
    <!--搜索 end-->
    <div class="tableWrap">
      <a-table :columns="columns" :data-source="datalist" :scroll="{ x: true }" rowKey="ID">
        <span slot="status" slot-scope="status" style="color: #87d068;">
          {{status === 0? '新建': status === 1? '进行中': '完成'}}
        </span>
        <span slot="type" slot-scope="type">
          {{type === 0? '实时rtsp视频流': type === 1? '用户上传视频文件': '用户平台录像文件'}}
        </span>
        <span slot="CreatedAt" slot-scope="CreatedAt">
          {{CreatedAt | dateFormat}}
        </span>
        <span slot="action" slot-scope="record, index, idx">
          <a @click="toEdit(record, idx, 'edit')">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定要删除该任务吗?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="delTask(record, idx)"
          >
            <a :disabled="record.status === 1">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="toEdit(record, idx, 'copy')">复制</a>
          <a-divider type="vertical" />
          <template v-if="record.status === 1">
            <a-popconfirm
              title="确定要停止该任务吗?"
              ok-text="停止"
              cancel-text="取消"
              @confirm="stop(record, idx)"
            >
              <a>停止</a>
            </a-popconfirm>
          </template>
          <template v-else>
            <a-popconfirm
              title="确定要执行该任务吗?"
              ok-text="执行"
              cancel-text="取消"
              @confirm="start(record, idx)"
            >
              <a>执行</a>
            </a-popconfirm>
          </template>
          <a-divider type="vertical" />
          <router-link :to="'/video/' + record.ID">查看任务结果<a-icon type="right" /></router-link>
        </span>
      </a-table>
<!--       <a-spin :spinning="spinning">
        <div class="cardList">
          <div class="cardItem" v-for="(item, key) in datalist" :key="key">
            <a-card hoverable>
              <video slot="cover" :src="item.url"></video>
              <a-card-meta :title="item.name">
                <template slot="description">
                  <p class="desc">{{item.description}}</p>
                  <p style="display: flex;justify-content: space-between;align-items: center;">
                    <span style="color: #87d068;">{{item.status === 0? '新建': item.status === 1? '进行中': '完成'}}</span>
                    <a-button type="link" style="padding: 0;"><router-link :to="'/video/' + item.id">查看任务结果<a-icon type="right" /></router-link></a-button>
                  </p>
                </template>
              </a-card-meta>
              <template slot="actions" class="ant-card-actions">
                <a-button type="link" icon="edit" title="编辑" :disabled="item.status === 1" @click="toEdit(item, key, 'edit')" />
                <a-popconfirm
                  title="确定要删除该任务吗?"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="delTask(item.id, key)"
                >
                  <a-button type="link" icon="delete" title="删除" :disabled="item.status === 1" />
                </a-popconfirm>
                <a-button type="link" icon="copy" title="复制" @click="toEdit(item, key, 'copy')" />
                <template v-if="item.status === 1">
                  <a-popconfirm
                    title="确定要停止该任务吗?"
                    ok-text="停止"
                    cancel-text="取消"
                    @confirm="stop(item.id, key)"
                  >
                    <a-button type="link" icon="stop" title="停止" />
                  </a-popconfirm>
                </template>
                <template v-else>
                  <a-popconfirm
                    title="确定要执行该任务吗?"
                    ok-text="执行"
                    cancel-text="取消"
                    @confirm="start(item.id, key)"
                  >
                    <a-button type="link" icon="play-circle" title="执行" />
                  </a-popconfirm>
                </template>

              </template>
            </a-card>
          </div>
        </div>
      </a-spin> -->
    </div>

    <AddTask :datalist="datalist" :add-visible="addVisible" :mock-data="mockData" :target-keys="targetKeys" :selected-keys="selectedKeys" :small-layout="smallLayout" @updateData="updateData" @getList="getTasks" />
    <EditTask :datalist="datalist" :edit-visible="editVisible" :mock-data="mockData" :target-keys="targetKeys" :selected-keys="selectedKeys" :small-layout="smallLayout" :edit-tag="editTag" :edit-form="editForm" :edit-item="editItem" :edit-key="editKey" @updateData="updateData" @getList="getTasks" />

  </div>
</template>
<script>
import api from '../api'
import nj from '../assets/u3.jpg'
import zyq from '../assets/u1.png'
import wlk from '../assets/u5.jpg'
import wq from '../assets/u4.jpg'
import AddTask from '../components/AddTask.vue'
import EditTask from '../components/EditTask.vue'
var moment = require('moment')
const columns = [
  {
    title: 'ID',
    dataIndex: 'ID',
    key: 'ID'
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '流类型',
    dataIndex: 'stream_type',
    key: 'stream_type',
    scopedSlots: { customRender: 'stream_type' }
  },
  {
    title: '任务类型',
    dataIndex: 'type',
    key: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'CreatedAt',
    key: 'CreatedAt',
    scopedSlots: { customRender: 'CreatedAt' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

// var assetsBaseurl = ''
// if (process.env.NODE_ENV === 'production') {
//   assetsBaseurl = 'http://aicore.evereasycom.cn:8001'
// } else {
//   assetsBaseurl = 'http://127.0.0.1:8001'
// }

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

export default {
  components: { AddTask, EditTask },
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      smallLayout: false,
      spinning: false,
      searchForm: {
        type: '',
        taskId: ''
      },
      datalist: [],
      pageNum: 0,
      pageSize: 10,
      columns,
      addVisible: false,
      editVisible: false,
      typeArr_search: [ '在线视频任务', '离线视频任务' ],
      mockData: stars,
      targetKeys: [],
      selectedKeys: [],
      editForm: {},
      editItem: {},
      editKey: '',
      editTag: '' // 'edit' || 'copy'
    }
  },
  filters: {
    dateFormat (val) {
      if (val === '') return ''
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted () {
    var ele = document.querySelectorAll('.file-main')
    ele[0].style.backgroundColor = '#fff'

    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
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
        }
      }).catch(error => {
        this.spinning = false
        console.log('error:')
        console.log(error)
      })
    },
    searchHandleOk () {
      this.datalist = []
      this.pageNum = 0
      this.nextPageToken = ''
      this.getTasks()
    },
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
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
.taskContainer {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #fff;
}
.tableWrap {
  width: 100%;
  margin-top: 20px;
}
.searchWrap {
  display: flex;
  justify-content: space-between;
}
.desc {
  color: #555;
}
.date {
  font-size: .8em;
  color: #aaa;
}
</style>
