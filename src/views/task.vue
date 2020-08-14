<template>
  <div class="taskContainer">
    <!-- <div class="searchWrap">
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
          <a-button type="primary" @click="searchHandleOk">搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <a-divider /> -->
    <div class="tableWrap">
      <a-spin :spinning="spinning">
        <a-row :gutter="16">
          <a-col :span="4">
            <a-card style="border: 1px solid #1890ff;">
              <p><a-icon type="plus-circle" class="plusWrap" title="新增任务" @click="addVisible = true" /></p>
              <p style="color: #1890ff;font-size: 16px;text-align: center;">添加任务</p>
            </a-card>
          </a-col>
          <a-col :span="4" style="padding-bottom: 15px;" v-for="(item, key) in datalist" :key="key">
            <a-card hoverable>
              <video slot="cover" :src="item.url"></video>
              <a-card-meta :title="item.name">
                <template slot="description">
                  <p class="desc">{{item.description}}</p>
                  <p class="date">({{item.status}})</p>
                </template>
              </a-card-meta>
              <template slot="actions" class="ant-card-actions">
                <a-popconfirm
                  title="确定要删除该任务吗?"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="delTask(item.id, key)"
                >
                  <a-icon key="delete" type="delete" title="删除" />
                </a-popconfirm>
                <router-link :to="'/video/' + item.id" title="查看任务结果"><a-icon type="solution" /></router-link>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
    </div>
    <a-modal
      title="创建任务"
      :visible="addVisible"
    >
      <div>
        <a-form-model :model="addForm" :label-col="{span:4}" :wrapper-col="{span:14}">
          <a-form-model-item label="任务类型">
            <a-select v-model="addForm.type">
              <a-select-option :value="key" v-for="(val,key) in typeArr" v-bind:key="key">
                {{val}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="上传视频" v-if="addForm.type === 1">
            <a-upload
              list-type="picture"
              action="/apis/api/v1/upload/file"
              name="videoFile"
              @change="uploadVideoChange"
            >
              <a-button> <a-icon type="upload" /> 选择视频文件 </a-button>
            </a-upload>
          </a-form-model-item>
          <a-form-model-item label="任务地址">
            <a-input v-model="addForm.url" :disabled="addForm.type === 1" />
          </a-form-model-item>
          <a-form-model-item label="任务名称">
            <a-input v-model="addForm.name" />
          </a-form-model-item>
          <!-- <a-form-model-item label="人脸库ID">
            <a-input v-model="addForm.repoId" />
          </a-form-model-item> -->
          <a-form-model-item label="人脸库">
            <a-select v-model="addForm.repoId">
              <a-select-option :value="val.id" v-for="(val,key) in facegroupArr" v-bind:key="key">
                {{val.name}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="报警阀值">
            <a-slider v-model="addForm.rate" :min="1" :tooltipVisible="addVisible" />
          </a-form-model-item>
        </a-form-model>
      </div>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="addLoading" @click="handleOk">
          创建
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import api from '../api'
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id'
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
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'monitors',
    dataIndex: 'monitors',
    key: 'monitors'
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

var assetsBaseurl = ''
if (process.env.NODE_ENV === 'production') {
  assetsBaseurl = 'http://aicore.evereasycom.cn:8001'
} else {
  assetsBaseurl = 'http://127.0.0.1:8001'
}

export default {
  beforeRouteEnter (to, from, next) {
    var ele = document.querySelectorAll('.file-main')
    ele[0].style.backgroundColor = '#fff'

    next()
  },
  data () {
    return {
      spinning: false,
      datalist: [],
      pageNum: 0,
      pageSize: 10,
      nextPageToken: '',
      columns,
      addVisible: false,
      addLoading: false,
      addForm: {
        type: '',
        url: '',
        name: '',
        repoId: '',
        rate: 1
      },
      searchForm: {
        type: '',
        taskId: ''
      },
      typeArr: [ '实时rtsp视频流', '用户上传视频文件', '用户平台录像文件' ],
      typeArr_search: [ '在线视频任务', '离线视频任务' ],
      facegroupArr: []
    }
  },
  mounted () {
    this.getTasks()
    this.facegroupArr = this.$store.state.facegroups
  },
  methods: {
    getTasks () {
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        nextPageToken: this.nextPageToken,
        faceGroupId: this.facegroupId
      }
      if (this.searchForm.type !== '') {
        params.type = this.searchForm.type
      }
      if (this.searchForm.taskId !== '') {
        params.taskId = this.searchForm.taskId
      }
      this.spinning = true
      api.getTasks(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          var tasks = res.data.data.map((value, index, array) => {
            value.url = value.url.replace('http://172.16.44.101:8001', assetsBaseurl)
            return value
          })
          this.datalist = this.datalist.concat(tasks)
          this.pageNum = res.data.pageNum
          this.pageSize = res.data.pageSize
          this.nextPageToken = res.data.nextPageToken || ''
          if (res.data.data.length && res.data.nextPageToken) {
            this.getTasks()
          } else {
            this.spinning = false
          }
        }
      }).catch(error => {
        this.spinning = false
        console.log('error:')
        console.log(error)
      })
    },
    handleOk (e) {
      if (this.addForm.type === '') {
        this.$message.error('请选择任务类型！')
        return
      }
      if (this.addForm.url === '') {
        this.$message.error('请填写任务地址！')
        return
      }
      if (this.addForm.name === '') {
        this.$message.error('请填写任务名称！')
        return
      }
      if (this.addForm.repoId === '') {
        this.$message.error('请填写布控人脸库ID！')
        return
      }
      if (this.addForm.rate === '') {
        this.$message.error('请填写报警阀值！')
        return
      }
      var params = {
        type: this.addForm.type,
        url: this.addForm.url + '',
        name: this.addForm.name,
        repoId: this.addForm.repoId,
        rate: this.addForm.rate
      }
      this.spinning = true
      api.addTask(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.datalist.unshift(res.data)
          this.datalist = []
          this.pageNum = 0
          this.nextPageToken = ''
          this.getTasks()

          this.addVisible = false
          this.spinning = false
          this.addForm = {
            type: '',
            url: '',
            name: '',
            repoId: '',
            rate: 1
          }
          this.$message.success('任务创建成功')
        }
      }).catch(error => {
        this.spinning = false
        console.log(error.response)
        this.$message.error(error.response.data.message || '创建出错！')
      })
    },
    handleCancel (e) {
      this.addVisible = false
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
    uploadVideoChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 文件上传成功`)
        var fileId = info.file.response.fileId
        this.addForm.url = fileId
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    delTask (id, idx) {
      var params = {
        id: id
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
}
.plusWrap {
  display: block;
  margin: 20px auto;
  font-size: 50px;
  color: #1890ff;
}
.desc {
  color: #555;
}
.date {
  font-size: .8em;
  color: #aaa;
}
</style>
