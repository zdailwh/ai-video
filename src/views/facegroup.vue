<template>
  <div class="faceGroupContainer">
    <div class="tableWrap">
      <a-button type="primary" ghost class="editable-add-btn" @click="addVisible = true">新增人脸库</a-button>
      <a-table :columns="columns" :data-source="data" rowKey="id">
        <p slot="time" slot-scope="text, record">
          <span>创建时间：{{ record.create_time }}</span><br>
          <span>更新时间：{{ record.update_time }}</span>
        </p>
        <span slot="action" slot-scope="text, record">
          <a>删除人脸库</a>
          <a-divider type="vertical" />
          <a>人脸列表</a>
          <a-divider type="vertical" />
          <a>新增人脸</a>
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

const data = [
  {
    id: '0613a240-1a58-422d-a7bd-1aba11c6c31c',
    name: 'group1',
    description: 'group-desc',
    type: 'MONITOR',
    create_time: '2020-07-31 8: 30: 20',
    update_time: '2020-07-31 8: 30: 20'
  },
  {
    id: '0713a240-1a58-422d-a7bd-1aba11c6c31c',
    name: 'group2',
    description: 'group-desc',
    type: 'MONITOR',
    create_time: '2020-07-31 8: 30: 20',
    update_time: '2020-07-31 8: 30: 20'
  },
  {
    id: '0813a240-1a58-422d-a7bd-1aba11c6c31c',
    name: 'group3',
    description: 'group-desc',
    type: 'MONITOR',
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
        description: '',
        type: ''
      }
    }
  },
  methods: {
    handleOk (e) {
      var self = this
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
