<template>
  <div class="taskContainer">
    <div class="searchWrap">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="任务类型">
          <a-select v-model="searchForm.type" :dropdownMatchSelectWidth="false">
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option :value="key" v-for="(val,key) in typeArr" v-bind:key="key">
              {{val}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="任务ID">
          <a-input v-model="searchForm.taskId" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="searchHandleOk">搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <a-divider />
    <div class="tableWrap">
      <a-button type="primary" ghost class="editable-add-btn" @click="addVisible = true">新增任务</a-button>
      <a-table :columns="columns" :data-source="data" rowKey="id">
        <span slot="action" slot-scope="text, record">
          <a>删除任务</a>
          <a-divider type="vertical" />
          <router-link :to="'/video/'+record.id+'/123'">查看任务结果</router-link>
        </span>
      </a-table>
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
              action="//jsonplaceholder.typicode.com/posts/"
              name="videoFile"
              @change="uploadVideoChange"
            >
              <a-button> <a-icon type="upload" /> 选择视频文件 </a-button>
            </a-upload>
          </a-form-model-item>
          <a-form-model-item label="任务地址">
            <a-input v-model="addForm.url" />
          </a-form-model-item>
          <a-form-model-item label="任务名称">
            <a-input v-model="addForm.name" />
          </a-form-model-item>
          <a-form-model-item label="人脸库ID">
            <a-input v-model="addForm.repoId" />
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

const data = [
  {
    id: '12',
    name: 'group1',
    description: 'group-desc',
    status: 'VIDEO_PROCESSING',
    monitors: ['8f89058b-7cdc-4a29-93b5-8f89e8d6ecca']
  },
  {
    id: '13',
    name: 'group2',
    description: 'group-desc',
    status: 'VIDEO_PROCESSING',
    monitors: ['8f89058b-7cdc-4a29-93b5-8f89e8d6ecca']
  },
  {
    id: '14',
    name: 'group3',
    description: 'group-desc',
    status: 'VIDEO_PROCESSING',
    monitors: ['8f89058b-7cdc-4a29-93b5-8f89e8d6ecca']
  }
]
export default {
  data () {
    return {
      data,
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
      typeArr: [ '实时rtsp视频流', '用户上传视频文件', '用户平台录像文件' ]
    }
  },
  methods: {
    handleOk (e) {
      var self = this
      this.confirmLoading = true
      setTimeout(() => {
        const { data } = self
        const newData = {
          id: '15',
          name: 'group4',
          description: 'group-desc',
          status: 'VIDEO_PROCESSING',
          monitors: ['8f89058b-7cdc-4a29-93b5-8f89e8d6ecca']
        }
        self.data = [...data, newData]

        self.addVisible = false
        self.confirmLoading = false
      }, 2000)
    },
    handleCancel (e) {
      this.addVisible = false
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
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
    },
    uploadVideoChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 文件上传成功`)
        console.log(info.event)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败.`)
      }
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
</style>
