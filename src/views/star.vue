<template>
  <div class="faceContainer">
    <!--搜索-->
    <div class="searchWrap" :style="smallLayout? 'flex-direction: column;': ''">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="名称" prop="Name">
          <a-input v-model="searchForm.Name" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="searchHandleOk"><a-icon key="search" type="search"/>搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
        </a-form-model-item>
      </a-form-model>
      <div>
        <a-button type="primary" @click="addVisible = true"><a-icon key="plus" type="plus"/>添加明星</a-button>
        <!-- <a-button type="primary" @click="importVisible = true"><a-icon key="import" type="import"/>批量导入</a-button> -->
      </div>
    </div>
    <!--搜索 end-->
    <div class="tableWrap">
      <a-table :columns="columns" :data-source="datalist" :scroll="{ x: true }" rowKey="ID" :pagination="false">
        <span slot="Gender" slot-scope="Gender">
          {{!Gender? '':(Gender === '1' || Gender === 1)? '男': '女'}}
        </span>
        <span slot="FullURI" slot-scope="FullURI">
          <a-popover title="">
            <template slot="content">
              <img class="tablePopImg" :src="FullURI" />
            </template>
            <img class="tableImg" :src="FullURI" />
          </a-popover>
        </span>
        <span slot="Features" slot-scope="Features">
          <a-popover title="" v-for="(i,k) in Features" :key="k">
            <template slot="content">
              <img class="tablePopImg" :src="i.FullURI" />
            </template>
            <img class="tableImg" :src="i.FullURI" />
          </a-popover>
        </span>
        <span slot="CreatedAt" slot-scope="CreatedAt">
          {{CreatedAt | dateFormat}}
        </span>
        <span slot="action" slot-scope="record, index, idx">
          <a @click="toEdit(record, idx)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定要删除该明星吗?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="delFace(record, idx)"
          >
            <a>删除</a>
          </a-popconfirm>
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
    <!--创建人脸-->
    <a-modal
      title="创建人脸"
      v-model="addVisible"
    >
      <div>
        <a-form-model :model="addForm" :label-col="{span:4}" :wrapper-col="{span:14}">
          <a-form-model-item label="名称">
            <a-input v-model="addForm.Name" />
          </a-form-model-item>
          <a-form-model-item label="性别">
            <a-radio-group name="Gender" v-model="addForm.Gender">
              <a-radio value="1">男</a-radio><a-radio value="2">女</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="出生日期">
            <a-date-picker :locale="locale" format="YYYY-MM-DD" v-model="addForm.Birthday" />
          </a-form-model-item>
          <a-form-model-item label="人脸图">
            <a-upload
              list-type="picture-card"
              :multiple="true"
              :beforeUpload="beforeUpload_add"
              :file-list="fileList_add"
              :remove="handleRemove_add"
              @preview="handlePreview"
              @change="handleChange_add"
            >
              <div>
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
    <!--编辑人脸-->
    <a-modal
      title="编辑人脸"
      v-model="editVisible"
    >
      <div>
        <a-form-model :model="editForm" :label-col="{span:4}" :wrapper-col="{span:14}">
          <a-form-model-item label="名称">
            <a-input v-model="editForm.Name" />
          </a-form-model-item>
          <a-form-model-item label="性别">
            <a-radio-group name="Gender" v-model="editForm.Gender">
              <a-radio value="1">男</a-radio><a-radio value="2">女</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="出生日期">
            <a-date-picker :locale="locale" format="YYYY-MM-DD" v-model="editForm.Birthday" />
          </a-form-model-item>
          <a-form-model-item label="人脸图">
            <a-upload
              list-type="picture-card"
              :multiple="true"
              :beforeUpload="beforeUpload_edit"
              :file-list="fileList_edit"
              :default-file-list="defaultFileList_edit"
              :remove="handleRemove_edit"
              @preview="handlePreview"
              @change="handleChange_edit"
            >
              <div>
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
    dataIndex: 'ID',
    key: 'ID'
  },
  {
    title: '名称',
    dataIndex: 'Name',
    key: 'Name'
  },
  {
    title: '生日',
    dataIndex: 'Birthday',
    key: 'Birthday'
  },
  {
    title: '性别',
    dataIndex: 'Gender',
    key: 'Gender',
    scopedSlots: { customRender: 'Gender' }
  },
  {
    title: '人脸图',
    dataIndex: 'FullURI',
    key: 'FullURI',
    scopedSlots: { customRender: 'FullURI' }
  },
  {
    title: '特征图',
    dataIndex: 'Features',
    key: 'Features',
    scopedSlots: { customRender: 'Features' }
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

export default {
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      locale,
      smallLayout: false,
      spinning: false,
      datalist: [],
      dataTotal: 0,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      pageNum: 1,
      pageSize: 20,
      columns,
      addForm: {
        Name: '',
        Gender: '',
        Birthday: '',
        files: []
      },
      addLoading: false,
      fileList_add: [],
      addVisible: false,
      searchForm: {
        Name: ''
      },
      importForm: {
      },
      importVisible: false,
      editForm: {
        // Name: '',
        // Gender: '',
        // Birthday: '',
        // files: []
      },
      editLoading: false,
      editItem: {},
      editKey: '',
      fileList_edit: [],
      defaultFileList_edit: [],
      editVisible: false,
      previewVisible: false,
      previewImage: ''
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

    this.getFaces()
  },
  methods: {
    onPageChange (current) {
      this.pageNum = current
      this.getFaces()
    },
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getFaces()
    },
    searchHandleOk () {
      this.pageNum = 1
      if (this.searchForm.Name !== '') {
        this.getFacesByName()
      } else {
        this.getFaces()
      }
    },
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
    },
    getFaces () {
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.spinning = true
      api.getFaces(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist = res.data.data
          if (this.pageNum === 1) {
            this.dataTotal = res.data.count
            this.$store.commit('setFaceTotal', res.data.count)
          }
          this.spinning = false
        }
      }).catch(error => {
        this.spinning = false
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '获取明星库出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    beforeUpload_add (file, fileList) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isImg) {
        this.$message.error('请选择图片文件!')
        return false
      }
      // var arr = this.addForm.files || []
      // arr.push(file)
      // this.addForm.files = arr

      // var self = this
      // getBase64_(file, imageUrl => {
      //   self.addForm.faceBase64.push(imageUrl.substring(imageUrl.indexOf(',') + 1))
      // })
      return false
    },
    handleChange_add ({ fileList }) {
      this.fileList_add = fileList
      this.addForm.files = fileList
    },
    handleRemove_add (file) {
      // this.addForm.files = []
    },
    handleCancel_add () {
      this.addVisible = false
      this.fileList_add = []
      this.addForm = {
        Name: '',
        Gender: '',
        Birthday: '',
        files: []
      }
    },
    handleAdd (e) {
      if (this.addForm.Name === '') {
        this.$message.error('请填写名称！')
        return
      }
      // if (this.addForm.Gender === '') {
      //   this.$message.error('请选择性别！')
      //   return
      // }
      // if (this.addForm.Birthday === '') {
      //   this.$message.error('请选择出生日期！')
      //   return
      // }
      if (!this.addForm.files.length) {
        this.$message.error('请上传明星图片！')
        return
      }
      var formdata = new FormData()
      formdata.append('name', this.addForm.Name)
      formdata.append('gender', this.addForm.Gender)
      formdata.append('birthday', this.addForm.Birthday ? moment(this.addForm.Birthday).format('YYYY-MM-DD') : '')
      this.addForm.files.map((item, key, arr) => {
        formdata.append('files[]', item.originFileObj, item.originFileObj.name)
      })

      this.addLoading = true
      api.addFace(formdata).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.pageNum = 1
          this.getFaces()

          this.addVisible = false
          this.addLoading = false
          this.fileList_add = []
          this.addForm = {
            Name: '',
            Gender: '',
            Birthday: '',
            files: []
          }
          this.$message.success('明星创建成功')
        }
      }).catch(error => {
        this.addLoading = false
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '创建出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    toEdit (item, key) {
      this.editVisible = true
      this.editItem = item
      this.editKey = key
      this.editForm = item
      this.editForm.files = []
      // this.fileList_edit = item.Features.map((i, k, arr) => {
      //   var item_ = i
      //   item_.url = i.FullURI
      //   item_.uid = i.ID
      //   return item_
      // })
    },
    beforeUpload_edit (file, fileList) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isImg) {
        this.$message.error('请选择图片文件!')
        return false
      }
      // var arr = this.editForm.files || []
      // arr.push(file)
      // this.editForm.files = arr

      // var self = this
      // self.editForm.faceBase64 = []
      // getBase64_(file, imageUrl => {
      //   self.editForm.faceBase64.push(imageUrl.substring(imageUrl.indexOf(',') + 1))
      // })
      return false
    },
    handleChange_edit ({ fileList }) {
      this.fileList_edit = fileList
      this.editForm.files = fileList
    },
    handleRemove_edit (file) {
      // this.editForm.files = []
    },
    handleCancel_edit () {
      this.editVisible = false
      this.fileList_edit = []
      this.editForm = {}
      this.editItem = {}
      this.editKey = ''
    },
    handleEdit () {
      if (this.editForm.Name === '') {
        this.$message.error('请填写名称！')
        return
      }
      // if (this.editForm.Gender === '') {
      //   this.$message.error('请选择性别！')
      //   return
      // }
      // if (this.editForm.Birthday === '') {
      //   this.$message.error('请选择出生日期！')
      //   return
      // }
      if (!this.editForm.files.length) {
        this.$message.error('请上传明星图片！')
        return
      }

      var formdata = new FormData()
      formdata.append('name', this.editForm.Name)
      formdata.append('gender', this.editForm.Gender)
      formdata.append('birthday', this.editForm.Birthday ? moment(this.editForm.Birthday).format('YYYY-MM-DD') : '')
      this.editForm.files.map((item, key, arr) => {
        formdata.append('files[]', item.originFileObj, item.originFileObj.name)
      })
      // 先删除 后新建
      api.delFace({FaceID: this.editItem.FaceID}).then(resDel => {
        if (resDel.status >= 200 && resDel.status < 300) {
          this.editLoading = true
          api.addFace(formdata).then(res => {
            if (res.status >= 200 && res.status < 300) {
              this.pageNum = 1
              this.getFaces()

              this.editVisible = false
              this.editLoading = false
              this.fileList_edit = []
              this.editForm = {}
              this.$message.success('明星编辑成功')
            }
          }).catch(error => {
            this.editLoading = false
            if (error.response && error.response.data) {
              this.$message.error(error.response.data.message || '创建出错！')
            } else {
              this.$message.error('接口调用失败！')
            }
          })
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '删除出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
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
    delFace (record, idx) {
      api.delFace({FaceID: record.FaceID}).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist.splice(idx, 1)
          this.$message.success('明星删除成功')
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '删除出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    getFacesByName () {
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.searchForm.Name !== '') {
        params.name = this.searchForm.Name
      }
      this.spinning = true
      api.getFacesByName(params).then(res => {
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
          this.$message.error(error.response.data.message || '获取明星出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    }
  }
}

// function getBase64_ (img, callback) {
//   const reader = new FileReader()
//   reader.addEventListener('load', () => callback(reader.result))
//   reader.readAsDataURL(img)
// }
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
  margin-top: 20px;
}
.tableImg {
  max-width: 50px;
}
.tableImg + .tableImg {
  margin-left: 5px;
}
.tablePopImg {
  max-width: 280px;
}

.searchWrap {
  display: flex;
  justify-content: space-between;
}
</style>
