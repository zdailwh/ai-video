<template>
  <div class="faceContainer">
    <div class="tableWrap">
      <a-button type="primary" ghost class="editable-add-btn" @click="addVisible = true">新增人脸</a-button>
      <a-table :columns="columns" :data-source="data" rowKey="id">
        <p slot="time" slot-scope="text, record">
          <span>创建时间：{{ record.create_time }}</span><br>
          <span>更新时间：{{ record.update_time }}</span>
        </p>
        <span slot="action" slot-scope="text, record">
          <a>删除人脸</a>
        </span>
      </a-table>
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
          <a-form-model-item label="人脸库ID">
            <a-input v-model="addForm.faceGroupId" />
          </a-form-model-item>
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
    dataIndex: 'attributes.age',
    key: 'age'
  },
  {
    title: '性别',
    dataIndex: 'attributes.gender',
    key: 'gender'
  },
  {
    title: 'livness',
    dataIndex: 'attributes.livness',
    key: 'livness'
  },
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

const data = [
  {
    id: '12',
    group_id: '0613a240-1a58-422d-a7bd-1aba11c6c31c',
    name: 'group1',
    description: 'group-desc',
    attributes: {
      age: 30,
      gender: '1',
      livness: 0,
      quality: 0
    },
    create_time: '2020-07-31 8: 30: 20',
    update_time: '2020-07-31 8: 30: 20'
  },
  {
    id: '13',
    group_id: '0713a240-1a58-422d-a7bd-1aba11c6c31c',
    name: 'group2',
    description: 'group-desc',
    attributes: {
      age: 30,
      gender: '1',
      livness: 0,
      quality: 0
    },
    create_time: '2020-07-31 8: 30: 20',
    update_time: '2020-07-31 8: 30: 20'
  },
  {
    id: '14',
    group_id: '0813a240-1a58-422d-a7bd-1aba11c6c31c',
    name: 'group3',
    description: 'group-desc',
    attributes: {
      age: 30,
      gender: '1',
      livness: 0,
      quality: 0
    },
    create_time: '2020-07-31 8: 30: 20',
    update_time: '2020-07-31 8: 30: 20'
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
        name: '',
        desc: '',
        faceGroupId: '',
        faceBase64: ''
      }
    }
  },
  methods: {
    handleOk (e) {
      var self = this
      var base64 = document.querySelectorAll('.ant-upload-list-item-image')[0].src
      console.log(base64)
      this.addForm.faceBase64 = base64
      this.confirmLoading = true
      setTimeout(() => {
        const { data } = self
        const newData = {
          id: '0913a240-1a58-422d-a7bd-1aba11c6c31c',
          name: 'group4',
          description: 'group-desc',
          type: 'MONITOR',
          create_time: '2020-07-31 8: 30: 20',
          update_time: '2020-07-31 8: 30: 20'
        }
        self.data = [...data, newData]

        self.addVisible = false
        self.confirmLoading = false
      }, 2000)
    },
    handleCancel (e) {
      this.addVisible = false
    },
    beforeUpload (file, fileList) {
      console.log('beforeUpload')
      console.log(file)
      console.log(fileList)
      return false
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
</style>
