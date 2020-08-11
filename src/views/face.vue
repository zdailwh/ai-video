<template>
  <div class="faceContainer">
    <div class="tableWrap">
      <a-spin :spinning="spinning">
        <a-row :gutter="16">
          <a-col :span="4">
            <a-card style="border: 1px solid #1890ff;">
              <p><a-icon type="plus-circle" class="plusWrap" title="新增人脸" @click="addVisible = true" /></p>
              <p style="color: #1890ff;font-size: 16px;text-align: center;">添加人脸</p>
            </a-card>
          </a-col>
          <a-col :span="4" style="padding-bottom: 15px;" v-for="(item, key) in datalist" :key="key">
            <a-card hoverable>
              <img slot="cover" alt="example" :src="item.fullUri" />
              <a-card-meta :title="item.name">
                <template slot="description">
                  <p class="desc">{{item.description}}</p>
                  <p class="date">({{item.create_time | dateFormat}})</p>
                </template>
              </a-card-meta>
              <template slot="actions" class="ant-card-actions">
                <a-popconfirm
                  title="确定要删除该人脸吗?"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="delFace(item.id, key)"
                >
                  <a-icon key="delete" type="delete" title="删除" />
                </a-popconfirm>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
    </div>
    <a-modal
      title="创建人脸"
      :visible="addVisible"
    >
      <div>
        <a-form-model :model="addForm" :label-col="{span:4}" :wrapper-col="{span:14}">
          <a-form-model-item label="名称">
            <a-input v-model="addForm.name" />
          </a-form-model-item>
          <a-form-model-item label="描述">
            <a-input v-model="addForm.desc" />
          </a-form-model-item>
          <!-- <a-form-model-item label="人脸库ID">
            <a-input v-model="addForm.faceGroupId" />
          </a-form-model-item> -->
          <a-form-model-item label="人脸图片">
            <a-upload
              list-type="picture"
              :beforeUpload="beforeUpload"
            >
              <a-button> <a-icon type="upload" /> 选择图片 </a-button>
            </a-upload>
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
    title: '人脸库ID',
    dataIndex: 'group_id',
    key: 'group_id'
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
    title: '年龄',
    dataIndex: 'attributes.Age',
    key: 'Age'
  },
  {
    title: '性别',
    dataIndex: 'attributes.Gender',
    key: 'Gender',
    scopedSlots: { customRender: 'Gender' }
  },
  // {
  //   title: 'livness',
  //   dataIndex: 'livness',
  //   key: 'attributes.livness'
  // },
  {
    title: 'quality',
    dataIndex: 'attributes.quality',
    key: 'quality'
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
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      spinning: false,
      facegroupId: '',
      datalist: [],
      pageOffset: 0,
      pageSize: 10,
      nextPageToken: '',
      columns,
      addVisible: false,
      addLoading: false,
      addForm: {
        name: '',
        desc: '',
        faceBase64: ''
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
    var ele = document.querySelectorAll('.file-main')
    ele[0].style.backgroundColor = '#fff'

    this.facegroupId = this.$route.params.facegroupId || ''

    if (this.facegroupId) {
      this.getFaces()
    }
  },
  methods: {
    getFaces () {
      var params = {
        pageOffset: this.pageOffset,
        pageSize: this.pageSize,
        nextPageToken: this.nextPageToken,
        faceGroupId: this.facegroupId
      }
      this.spinning = true
      api.getFaces(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          var faces = res.data.faces.map((value, index, array) => {
            value.fullUri = value.fullUri.replace('http://172.16.44.101:8001', 'http://127.0.0.1:8001')
            return value
          })
          this.datalist = this.datalist.concat(faces)
          this.nextPageToken = res.data.nextPageToken || ''
          if (res.data.faces.length && res.data.nextPageToken) {
            this.getFaces()
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
      if (this.facegroupId === '') {
        this.$message.error('无效人脸库ID！')
        return
      }
      if (this.addForm.name === '') {
        this.$message.error('请填写名称！')
        return
      }
      if (this.addForm.desc === '') {
        this.$message.error('请填写描述！')
        return
      }
      if (this.addForm.faceBase64 === '') {
        this.$message.error('请上传人脸图片！')
        return
      }

      var params = {
        faceGroupId: this.facegroupId,
        name: this.addForm.name,
        desc: this.addForm.desc,
        faceBase64: this.addForm.faceBase64
      }
      this.spinning = true
      api.addFace(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.datalist.unshift(res.data)
          this.datalist = []
          this.nextPageToken = ''
          this.getFaces()

          this.addVisible = false
          this.spinning = false
          this.addForm = {
            name: '',
            desc: '',
            faceBase64: ''
          }
          this.$message.success('人脸创建成功')
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
    beforeUpload (file, fileList) {
      console.log('beforeUpload')
      console.log(file)
      console.log(fileList)
      var self = this
      if (window.FileReader) {
        var fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onloadend = function (e) {
          var base64Data = e.target.result
          self.addForm.faceBase64 = base64Data.substring(base64Data.indexOf(',') + 1)
        }
      }
      return false
    },
    delFace (id, idx) {
      var params = {
        id: id
      }
      api.delFace(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist.splice(idx, 1)
          this.$message.success('人脸删除成功')
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
.faceContainer {
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
  margin: 50px auto;
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
