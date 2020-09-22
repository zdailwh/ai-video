<template>
  <div class="faceContainer">
    <!--搜索-->
    <div class="searchWrap" :style="smallLayout? 'flex-direction: column;': ''">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="searchForm.name" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="searchHandleOk"><a-icon key="search" type="search"/>搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
        </a-form-model-item>
      </a-form-model>
      <div>
        <a-button type="primary" @click="addVisible = true"><a-icon key="plus" type="plus"/>添加明星</a-button>
        <a-button type="primary" @click="importVisible = true"><a-icon key="import" type="import"/>批量导入</a-button>
      </div>
    </div>
    <a-divider />
    <!--搜索 end-->
    <div class="tableWrap">
      <a-spin :spinning="spinning">
        <div class="cardList">
          <div class="cardItem" v-for="(item, key) in datalist" :key="key">
            <a-card hoverable>
              <!-- <img slot="cover" alt="example" :src="item.fullUri" /> -->
              <img slot="cover" alt="example" src="../assets/u1.png" />
              <a-card-meta :title="item.name">
                <template slot="description">
                  <p class="desc">{{item.sex === 1? '男': '女'}}</p>
                  <p class="desc">{{item.description}}</p>
                  <p class="date">({{item.create_time | dateFormat}})</p>
                </template>
              </a-card-meta>
              <template slot="actions" class="ant-card-actions">
                <a-button type="link" icon="edit" title="编辑" @click="toEdit(item, key)" />
                <a-popconfirm
                  title="确定要删除该明星吗?"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="delFace(item.id, key)"
                >
                  <a-button type="link" icon="delete" title="删除" />
                </a-popconfirm>
              </template>
            </a-card>
          </div>
        </div>
      </a-spin>
    </div>
    <!--创建明星-->
    <a-modal
      title="创建明星"
      v-model="addVisible"
    >
      <div>
        <a-form-model :model="addForm" :label-col="{span:4}" :wrapper-col="{span:14}">
          <a-form-model-item label="名称">
            <a-input v-model="addForm.name" />
          </a-form-model-item>
          <a-form-model-item label="性别">
            <a-radio-group name="sex" v-model="addForm.sex">
              <a-radio :value="1">男</a-radio><a-radio :value="2">女</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="出生日期">
            <a-date-picker :locale="locale" format="YYYY-MM-DD" v-model="addForm.birthday" />
          </a-form-model-item>
          <a-form-model-item label="明星图片">
            <a-upload
              list-type="picture-card"
              :beforeUpload="beforeUpload_add"
              :file-list="fileList_add"
              :remove="handleRemove_add"
              @preview="handlePreview"
              @change="handleChange_add"
            >
              <div v-if="fileList_add.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  上传图片
                </div>
              </div>
            </a-upload>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template slot="footer">
        <a-button key="back" @click="handleCancel_add">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="addLoading" @click="handleAdd">
          创建
        </a-button>
      </template>
    </a-modal>
    <!--编辑明星-->
    <a-modal
      title="编辑明星"
      v-model="editVisible"
    >
      <div>
        <a-form-model :model="editForm" :label-col="{span:4}" :wrapper-col="{span:14}">
          <a-form-model-item label="名称">
            <a-input v-model="editForm.name" />
          </a-form-model-item>
          <a-form-model-item label="性别">
            <a-radio-group name="sex" v-model="editForm.sex">
              <a-radio :value="1">男</a-radio><a-radio :value="2">女</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="出生日期">
            <a-date-picker :locale="locale" format="YYYY-MM-DD" v-model="editForm.birthday" />
          </a-form-model-item>
          <a-form-model-item label="明星图片">
            <a-upload
              list-type="picture-card"
              :beforeUpload="beforeUpload_edit"
              :file-list="fileList_edit"
              :remove="handleRemove_edit"
              @preview="handlePreview"
              @change="handleChange_edit"
            >
              <div v-if="fileList_edit.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  上传图片
                </div>
              </div>
            </a-upload>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template slot="footer">
        <a-button key="back" @click="handleCancel_edit">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="editLoading" @click="handleEdit">
          更新
        </a-button>
      </template>
    </a-modal>
    <!--图片预览-->
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <!--批量导入-->
    <a-modal
      title="批量导入"
      v-model="importVisible"
    >
      <div>
        <a-form-model :model="importForm" :label-col="{span:8}" :wrapper-col="{span:16}">
          <a-form-model-item label="明星压缩文件">
            <a-upload
              list-type="picture"
              :beforeUpload="beforeImport"
            >
              <a-button> <a-icon type="upload" /> 选择压缩包文件 </a-button>
            </a-upload>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template slot="footer">
        <a-button key="back" @click="importVisible = false">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="handleImport">
          上传
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
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

// var assetsBaseurl = ''
// if (process.env.NODE_ENV === 'production') {
//   assetsBaseurl = 'http://aicore.evereasycom.cn:8001'
// } else {
//   assetsBaseurl = 'http://127.0.0.1:8001'
// }

export default {
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      locale,
      smallLayout: false,
      spinning: false,
      facegroupId: '',
      datalist: [],
      pageOffset: 0,
      pageSize: 10,
      nextPageToken: '',
      columns,
      addForm: {
        name: '',
        sex: 1,
        birthday: '',
        faceBase64: ''
      },
      addLoading: false,
      fileList_add: [],
      addVisible: false,
      searchForm: {
        name: ''
      },
      importForm: {
      },
      importVisible: false,
      editForm: {
        // name: '',
        // sex: '',
        // birthday: '',
        // faceBase64: ''
      },
      editLoading: false,
      editItem: {},
      editKey: '',
      fileList_edit: [],
      editVisible: false,
      previewVisible: false,
      previewImage: ''
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

    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }

    this.facegroupId = this.$route.params.facegroupId || '163a28d9-bc6c-44a3-832f-9f07939d2265'

    if (this.facegroupId) {
      this.getFaces()
    }
  },
  methods: {
    searchHandleOk () {
      this.datalist = []
      this.nextPageToken = ''
      this.getFaces()
    },
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
    },
    getFaces () {
      var params = {
        pageOffset: this.pageOffset,
        pageSize: this.pageSize,
        nextPageToken: this.nextPageToken,
        faceGroupId: this.facegroupId
      }
      if (this.searchForm.name !== '') {
        params.name = this.searchForm.name
      }
      this.spinning = true
      api.getFaces(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist = this.datalist.concat(res.data.data)
          this.spinning = false
        }
      }).catch(error => {
        this.spinning = false
        console.log('error:')
        console.log(error)
      })
    },
    // handleChange (info) {
    //   console.log(info.fileList.length)
    //   if (info.fileList.length > 1) {
    //     this.$message.error('只能上传一张图片!')
    //     return false
    //   } else {
    //     getBase64(info.file, imageUrl => {
    //       this.addForm.faceBase64 = imageUrl
    //     })
    //   }
    // },
    beforeUpload_add (file, fileList) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isImg) {
        this.$message.error('请选择图片文件!')
        return false
      }
      var self = this
      getBase64_(file, imageUrl => {
        self.addForm.faceBase64 = imageUrl.substring(imageUrl.indexOf(',') + 1)
      })
      return false
    },
    handleChange_add ({ fileList }) {
      this.fileList_add = fileList
    },
    handleRemove_add (file) {
      this.addForm.faceBase64 = ''
    },
    handleCancel_add () {
      this.addVisible = false
      this.addForm = {
        name: '',
        sex: 1,
        birthday: '',
        faceBase64: ''
      }
    },
    handleAdd (e) {
      if (this.facegroupId === '') {
        this.$message.error('无效明星库ID！')
        return
      }
      if (this.addForm.name === '') {
        this.$message.error('请填写名称！')
        return
      }
      if (this.addForm.sex === '') {
        this.$message.error('请选择性别！')
        return
      }
      if (this.addForm.birthday === '') {
        this.$message.error('请选择出生日期！')
        return
      }
      if (this.addForm.faceBase64 === '') {
        this.$message.error('请上传明星图片！')
        return
      }

      var params = {
        faceGroupId: this.facegroupId,
        name: this.addForm.name,
        sex: this.addForm.sex,
        birthday: moment(this.addForm.birthday).format('YYYY-MM-DD'),
        faceBase64: this.addForm.faceBase64
      }
      this.addLoading = true
      api.addFace(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist.unshift(res.data)
          // this.datalist = []
          // this.nextPageToken = ''
          // this.getFaces()

          this.addVisible = false
          this.addLoading = false
          this.addForm = {
            name: '',
            sex: 1,
            birthday: '',
            faceBase64: ''
          }
          this.$message.success('明星创建成功')
        }
      }).catch(error => {
        this.addLoading = false
        console.log(error.response)
        this.$message.error(error.response.data.message || '创建出错！')
      })
    },
    toEdit (item, key) {
      this.editVisible = true
      this.editItem = item
      this.editKey = key
      this.editForm = item
      var item_ = item
      item_.url = item.fullUri
      item_.uid = -1
      this.fileList_edit = [item_]
    },
    beforeUpload_edit (file, fileList) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isImg) {
        this.$message.error('请选择图片文件!')
        return false
      }
      var self = this
      getBase64_(file, imageUrl => {
        self.editForm.faceBase64 = imageUrl.substring(imageUrl.indexOf(',') + 1)
      })
      return false
    },
    handleChange_edit ({ fileList }) {
      this.fileList_edit = fileList
    },
    handleRemove_edit (file) {
      this.editForm.faceBase64 = ''
    },
    handleCancel_edit () {
      this.editVisible = false
      this.editForm = {}
      this.editItem = {}
      this.editKey = ''
    },
    handleEdit () {
      if (this.facegroupId === '') {
        this.$message.error('无效明星库ID！')
        return
      }
      if (this.editForm.name === '') {
        this.$message.error('请填写名称！')
        return
      }
      if (this.editForm.sex === '') {
        this.$message.error('请选择性别！')
        return
      }
      if (this.editForm.birthday === '') {
        this.$message.error('请选择出生日期！')
        return
      }
      if (this.editForm.faceBase64 === '') {
        this.$message.error('请上传明星图片！')
        return
      }

      var params = {
        faceGroupId: this.facegroupId,
        id: this.editForm.id,
        name: this.editForm.name,
        sex: this.editForm.sex,
        birthday: moment(this.editForm.birthday).format('YYYY-MM-DD'),
        faceBase64: this.editForm.faceBase64
      }
      this.editLoading = true
      api.editFace(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist.splice(this.editKey, 1, res.data)
          // this.datalist = []
          // this.nextPageToken = ''
          // this.getFaces()

          this.editVisible = false
          this.editLoading = false
          this.editForm = {}
          this.$message.success('明星编辑成功')
        }
      }).catch(error => {
        this.editLoading = false
        console.log(error.response)
        this.$message.error(error.response.data.message || '编辑出错！')
      })
    },
    beforeImport (file, fileList) {
      console.log(file)

      const isZip = file.type === 'application/x-zip-compressed'
      if (!isZip) {
        this.$message.error('请选择压缩包文件!')
      }
      return false
    },
    handleImport () {
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    delFace (id, idx) {
      var params = {
        id: id
      }
      api.delFace(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist.splice(idx, 1)
          this.$message.success('明星删除成功')
        }
      }).catch(error => {
        console.log(error.response)
        this.$message.error(error.response.data.message || '删除出错！')
      })
    }
  }
}

function getBase64_ (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
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
