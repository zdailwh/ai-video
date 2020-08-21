<template>
  <div class="faceGroupContainer">
    <!--搜索-->
    <div class="searchWrap" :style="smallLayout? 'flex-direction: column;': ''">
      <!-- <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="searchForm.name" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="searchHandleOk"><a-icon key="search" type="search"/>搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
        </a-form-model-item>
      </a-form-model> -->
      <div>
        <a-button type="primary" @click="addVisible = true"><a-icon key="plus" type="plus"/>添加人脸库</a-button>
      </div>
    </div>
    <a-divider />
    <!--搜索 end-->
    <div class="tableWrap">
      <a-spin :spinning="spinning">
        <div class="cardList">
          <div class="cardItem" v-for="(item, key) in datalist" :key="key">
            <a-card hoverable>
              <a-card-meta :title="item.name">
                <template slot="description">
                  <p class="desc">{{item.description}}</p>
                  <p class="date">({{item.create_time | dateFormat}})</p>
                </template>
              </a-card-meta>
              <template slot="actions" class="ant-card-actions">
                <a-popconfirm
                  title="确定要删除该人脸库吗?"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="delFacegroup(item.id, key)"
                >
                  <a-icon key="delete" type="delete" title="删除" />
                </a-popconfirm>
                <router-link :to="'/face/' + item.id" title="查看人脸"><a-icon key="team" type="team" /></router-link>
              </template>
            </a-card>
          </div>
        </div>
      </a-spin>
    </div>
    <a-modal
      title="创建人脸库"
      v-model="addVisible"
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
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      smallLayout: false,
      spinning: false,
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

    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }

    this.getFacegroups()
  },
  methods: {
    getFacegroups () {
      var params = {
        pageOffset: this.pageOffset,
        pageSize: this.pageSize,
        nextPageToken: this.nextPageToken
      }
      this.spinning = true
      api.getFacegroups(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist = this.datalist.concat(res.data.faceGroups)
          this.nextPageToken = res.data.nextPageToken || ''
          if (res.data.faceGroups.length && res.data.nextPageToken) {
            this.getFacegroups()
          } else {
            this.$store.commit('setFacegroups', this.datalist)
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
      this.spinning = true
      api.addFacegroup(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.datalist.unshift(res.data)
          this.datalist = []
          this.nextPageToken = ''
          this.getFacegroups()

          this.addVisible = false
          this.spinning = false
          this.addForm = {
            name: '',
            description: '',
            group_type: ''
          }
          this.$message.success('人脸库创建成功')
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
    },
    searchHandleOk () {
      this.datalist = []
      this.nextPageToken = ''
      this.getFacegroups()
    },
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
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
