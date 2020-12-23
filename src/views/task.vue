<template>
  <div class="taskContainer">
    <!--搜索-->
    <div class="searchWrap" :style="smallLayout? 'flex-direction: column;': ''">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <!-- <a-form-model-item label="任务类型" prop="type">
          <a-select v-model="searchForm.type" :dropdownMatchSelectWidth="false">
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option :value="key" v-for="(val,key) in typeArr_search" v-bind:key="key">
              {{val}}
            </a-select-option>
          </a-select>
        </a-form-model-item> -->
        <a-form-model-item label="任务名称" prop="name">
          <a-input v-model="searchForm.name" />
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
      <a-table :columns="columns" :data-source="datalist" :scroll="{ x: true }" rowKey="ID" :pagination="false">
        <span slot="status" slot-scope="status" style="color: #87d068;">
          {{status === 0? '新建': status === 1? '进行中': '完成'}}
        </span>
        <span slot="type" slot-scope="type">
          {{type === '0'? '实时rtsp视频流': type === '1'? '用户上传视频文件': '用户平台录像文件'}}
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
      <div style="margin: 15px 0;text-align: right;">
        <a-pagination
          v-model="pageNum"
          :page-size-options="pageSizeOptions"
          :total="dataTotal"
          show-size-changer
          :page-size="pageSize"
          @showSizeChange="onShowSizeChange"
          @change="onPageChange"
        >
          <template slot="buildOptionText" slot-scope="props">
            <span v-if="props.value !== dataTotal">{{ props.value }}条/页</span>
            <span v-if="props.value === dataTotal">全部</span>
          </template>
        </a-pagination>
      </div>
    </div>

    <AddTask tag="offline" :datalist="datalist" :add-visible="addVisible" :faces-data="facesDatalist" :target-keys="targetKeys" :selected-keys="selectedKeys" :small-layout="smallLayout" @updateData="updateData" @getList="getTasks" />
    <EditTask tag="offline" :datalist="datalist" :edit-visible="editVisible" :faces-data="facesDatalist" :target-keys="targetKeys" :selected-keys="selectedKeys" :small-layout="smallLayout" :edit-tag="editTag" :edit-form="editForm" :edit-item="editItem" :edit-key="editKey" @updateData="updateData" @getList="getTasks" />

  </div>
</template>
<script>
import api from '../api'
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

var stars = [
  {
    ID: 10,
    CreatedAt: '2020-12-21T11:21:39.893+08:00',
    UpdatedAt: '2020-12-21T11:21:39.897+08:00',
    GroupID: 'default_base_group',
    FaceID: 'be27bd02-d2b6-43a1-ad16-dbb907784eb9',
    Name: 'test3',
    Gender: '1',
    Birthday: '2000-12-01',
    FullURI: 'http://10.122.94.101:8080/v5/resources/data?uri=weed%3A%2F%2F543%2C01bc78d9cb95f13c\u0026contentType=image/jpeg',
    Features: [
      {
        ID: 10,
        CreatedAt: '2020-12-21T11:21:39.895+08:00',
        UpdatedAt: '2020-12-21T11:21:39.895+08:00',
        GroupID: 'default_base_group',
        FaceID: 'be27bd02-d2b6-43a1-ad16-dbb907784eb9',
        FullURI: 'http://10.122.94.101:8080/v5/resources/data?uri=weed%3A%2F%2F543%2C01bc78d9cb95f13c\u0026contentType=image/jpeg'
      }
    ]
  }
]

export default {
  components: { AddTask, EditTask },
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      stream_type: 'offline',
      smallLayout: false,
      spinning: false,
      searchForm: {
        name: ''
      },
      datalist: [],
      dataTotal: 0,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      pageNum: 1,
      pageSize: 20,
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
      editTag: '', // 'edit' || 'copy'
      facesDatalist: []
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
    this.getAllFaces()
  },
  methods: {
    onPageChange (current) {
      this.pageNum = current
      this.getTasks()
    },
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getTasks()
    },
    searchHandleOk () {
      this.pageNum = 1
      // if (this.searchForm.name !== '') {
      //   this.getTasksByName()
      // } else {
      //   this.getTasks()
      // }
      this.getTasks()
    },
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
    },
    getTasks () {
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        stream_type: this.stream_type
      }
      if (this.searchForm.name !== '') {
        params.name = this.searchForm.name
      }
      this.spinning = true
      api.getTasks(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist = res.data.data
          if (this.pageNum === 1) {
            this.dataTotal = res.data.count
          }
          this.spinning = false
        }
      }).catch(error => {
        this.spinning = false
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '获取任务列表出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    delTask (record, idx) {
      api.delTask({id: record.ID}).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.datalist.splice(idx, 1)
          this.$message.success('任务删除成功')
          this.getTasks()
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '删除出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
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
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '任务重启出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
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
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '任务停止出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    updateData (params) {
      this[params.key] = params.val
    },
    getTasksByName () {
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.searchForm.name !== '') {
        params.name = this.searchForm.name
      }
      this.spinning = true
      api.getTasksByName(params).then(res => {
        console.log(res)
        if (res.status >= 200 && res.status < 300) {
          this.datalist = res.data.data
          if (this.pageNum === 1) {
            this.dataTotal = res.data.count || res.data.data.length
          }
          this.spinning = false
        }
      }).catch(error => {
        this.spinning = false
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '获取任务出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
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
        console.log(error)
        // if (error.response && error.response.data) {
        //   this.$message.error(error.response.data.message || '获取明星列表出错！')
        // } else {
        //   this.$message.error('接口调用失败！')
        // }
      })
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
