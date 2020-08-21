<template>
  <div class="faceContainer">
    <!--搜索-->
    <div class="searchWrap">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="searchForm.name" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="searchHandleOk"><a-icon key="search" type="search"/>搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
        </a-form-model-item>
      </a-form-model>
      <a-button type="primary" @click="addVisible = true"><a-icon key="plus" type="plus"/>添加名人</a-button>
    </div>
    <a-divider />
    <!--搜索 end-->
    <div class="tableWrap">
      <a-spin :spinning="spinning">
        <div class="cardList">
          <div class="cardItem" v-for="(item, key) in datalist" :key="key">
            <a-card hoverable>
              <img slot="cover" alt="example" :src="item.fullUri" />
              <a-card-meta :title="item.name">
                <template slot="description">
                  <p class="desc">{{item.description}}</p>
                  <p class="date">({{item.create_time | dateFormat}})</p>
                </template>
              </a-card-meta>
              <template slot="actions" class="ant-card-actions">
                <a-icon key="edit" type="edit" title="编辑" />
                <a-popconfirm
                  title="确定要删除该名人吗?"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="delFace(item.id, key)"
                >
                  <a-icon key="delete" type="delete" title="删除" />
                </a-popconfirm>
              </template>
            </a-card>
          </div>
        </div>
      </a-spin>
    </div>
    <a-modal
      title="创建名人"
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
          <!-- <a-form-model-item label="名人库ID">
            <a-input v-model="addForm.faceGroupId" />
          </a-form-model-item> -->
          <a-form-model-item label="名人图片">
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
    title: '名人库ID',
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

var assetsBaseurl = ''
if (process.env.NODE_ENV === 'production') {
  assetsBaseurl = 'http://aicore.evereasycom.cn:8001'
} else {
  assetsBaseurl = 'http://127.0.0.1:8001'
}

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
      },
      searchForm: {
        name: ''
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

    this.facegroupId = this.$route.params.facegroupId || '163a28d9-bc6c-44a3-832f-9f07939d2265'

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
            value.fullUri = value.fullUri.replace('http://172.16.44.101:8001', assetsBaseurl)
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
        this.$message.error('无效名人库ID！')
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
        this.$message.error('请上传名人图片！')
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
          this.$message.success('名人创建成功')
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
          this.$message.success('名人删除成功')
        }
      }).catch(error => {
        console.log(error.response)
        this.$message.error(error.response.data.message || '删除出错！')
      })
    },
    searchHandleOk () {
      this.datalist = []
      this.nextPageToken = ''
      this.getFaces()
    },
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
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

.desc {
  color: #555;
}
.date {
  font-size: .8em;
  color: #aaa;
}

.searchWrap {
  display: flex;
  justify-content: space-between;
}
</style>
