<template>
  <div class="faceGroupContainer">
    <div class="tableWrap">
      <a-button type="primary" ghost class="editable-add-btn" @click="addVisible = true">新增人脸库</a-button>
      <a-table :columns="columns" :data-source="datalist" rowKey="id" size="middle">
        <p slot="time" slot-scope="text, record">
          <span>创建时间：{{ record.create_time | dateFormat }}</span><br>
          <span>更新时间：{{ record.update_time | dateFormat }}</span>
        </p>
        <span slot="action" slot-scope="text, record, index">
          <a-popconfirm
            title="确定要删除该人脸库吗?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="delFacegroup(record.id, index)"
          >
            <a href="#">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <router-link :to="'/face/' + record.id">查看人脸</router-link>
        </span>
      </a-table>
    </div>
    <a-modal
      title="创建人脸库"
      :visible="addVisible"
    >
      <div>
        <a-form-model :model="addForm" :label-col="{span:4}" :wrapper-col="{span:14}">
          <a-form-model-item label="名称">
            <a-input v-model="addForm.name" />
          </a-form-model-item>
          <a-form-model-item label="描述">
            <a-input v-model="addForm.description" />
          </a-form-model-item>
          <a-form-model-item label="类型">
            <a-select v-model="addForm.group_type">
              <a-select-option value="STATIC">
                STATIC
              </a-select-option>
              <a-select-option value="MONITOR">
                MONITOR
              </a-select-option>
            </a-select>
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
var moment = require('moment')

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '时间',
    key: 'time',
    scopedSlots: { customRender: 'time' }
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  data () {
    return {
      datalist: [],
      pageOffset: 0,
      pageSize: 10,
      nextPageToken: '',
      columns,
      addVisible: false,
      addLoading: false,
      addForm: {
        name: '',
        description: '',
        group_type: ''
      }
    }
  },
  filters: {
    dateFormat (val) {
      if (val === '') return ''
      return moment(val).format('YYYY-MM-DD hh:mm:ss')
    }
  },
  mounted () {
    this.getFacegroups()
  },
  methods: {
    getFacegroups () {
      var params = {
        pageOffset: this.pageOffset,
        pageSize: this.pageSize,
        nextPageToken: this.nextPageToken
      }
      api.getFacegroups(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist = this.datalist.concat(res.data.faceGroups)
          this.nextPageToken = res.data.nextPageToken || ''
          if (res.data.faceGroups.length && res.data.nextPageToken) {
            this.getFacegroups()
          }
        }
      }).catch(error => {
        console.log('error:')
        console.log(error)
      })
    },
    handleOk (e) {
      if (this.addForm.name === '') {
        this.$message.error('请填写名称！')
        return
      }
      if (this.addForm.description === '') {
        this.$message.error('请填写描述！')
        return
      }
      if (this.addForm.group_type === '') {
        this.$message.error('请选择类型！')
        return
      }
      var params = {
        name: this.addForm.name,
        description: this.addForm.description,
        group_type: this.addForm.group_type
      }
      this.confirmLoading = true
      api.addFacegroup(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist.unshift(res.data)
          this.addVisible = false
          this.confirmLoading = false
          this.$message.success('人脸库创建成功')
        }
      }).catch(error => {
        this.confirmLoading = false
        console.log(error.response)
        this.$message.error(error.response.data.message || '创建出错！')
      })
    },
    handleCancel (e) {
      this.addVisible = false
    },
    delFacegroup (id, idx) {
      var params = {
        id: id
      }
      api.delFacegroup(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist.splice(idx, 1)
          this.$message.success('人脸库删除成功')
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
.faceGroupContainer {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #fff;
}
.tableWrap {
  width: 100%;
}
</style>
