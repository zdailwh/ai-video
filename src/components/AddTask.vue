<template>
  <a-modal
    title="创建任务"
    width="700px"
    v-model="addVisible"
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
  >
    <div>
      <a-form-model :model="addForm" :label-col="{span:4}" :wrapper-col="{span:14}">
        <a-form-model-item label="任务类型">
          <a-select v-model="addForm.type">
            <a-select-option v-if="(tag === 'online' && item.text === '实时rtsp视频流') || (tag === 'offline' && item.text !== '实时rtsp视频流')" :value="item.value" v-for="item in typeArr" v-bind:key="item.value">
              {{item.text}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="上传视频" v-if="addForm.type === 1">
          <a-upload
            list-type="picture"
            :beforeUpload="beforeUpload"
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
        <a-form-model-item label="任务描述">
          <a-input v-model="addForm.description" />
        </a-form-model-item>
        <a-form-model-item label="选择名人" :wrapperCol="{span: 20}">
          <a-transfer
            :data-source="facesData"
            :filter-option="filterOption"
            :showSelectAll="false"
            :showSearch="true"
            :locale="{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }"
            :titles="['名人库', '目标']"
            :target-keys="targetKeys"
            :selected-keys="selectedKeys"
            :list-style="{width: smallLayout?'100%':'200px', height: '260px'}"
            @change="handleChange"
            @selectChange="handleSelectChange">
            <template
              slot="children"
              slot-scope="{
                props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
                on: { itemSelectAll, itemSelect },
              }"
            >
              <a-table
                :row-selection="
                  getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
                "
                :columns="direction === 'left' ? leftColumns : rightColumns"
                :data-source="filteredItems"
                :pagination="{ pageSize: 10 }"
                size="small"
                :style="{ pointerEvents: listDisabled ? 'none' : null }"
                :custom-row="
                  ({ key, disabled: itemDisabled }) => ({
                    on: {
                      click: () => {
                        if (itemDisabled || listDisabled) return;
                        itemSelect(key, !selectedKeys.includes(key));
                      },
                    },
                  })
                "
              >
              <template slot="FullURI" slot-scope="FullURI">
                <img :src="FullURI" style="max-width: 50px;max-height: 50px;">
              </template>
              </a-table>
            </template>
          </a-transfer>

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
</template>

<script>
import difference from 'lodash/difference'
import api from '../api'
const leftTableColumns = [
  {
    dataIndex: 'title',
    title: '姓名',
    scopedSlots: { customRender: 'Name' }
  },
  {
    dataIndex: 'FullURI',
    title: '头像',
    width: '50px',
    scopedSlots: { customRender: 'FullURI' }
  }
]
const rightTableColumns = [
  {
    dataIndex: 'title',
    title: '姓名',
    scopedSlots: { customRender: 'Name' }
  },
  {
    dataIndex: 'FullURI',
    title: '头像',
    width: '50px',
    scopedSlots: { customRender: 'FullURI' }
  }
]
export default {
  props: [ 'tag', 'datalist', 'addVisible', 'facesData', 'targetKeys', 'selectedKeys', 'smallLayout' ],
  data () {
    return {
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      addLoading: false,
      addForm: {
        type: '',
        url: '',
        name: '',
        description: '',
        files: []
      },
      typeArr: [
        { value: 1, text: '用户上传视频文件' },
        { value: 2, text: '实时rtsp视频流' }
      ],
      targetFaceIds: []
    }
  },
  methods: {
    handleOk (e) {
      if (this.addForm.type === '') {
        this.$message.error('请选择任务类型！')
        return
      }
      if (this.addForm.type === 1) {
        if (!this.addForm.files.length) {
          this.$message.error('请选择上传视频文件！')
          return
        }
      } else {
        if (this.addForm.url === '') {
          this.$message.error('请填写任务地址！')
          return
        }
      }
      if (this.addForm.name === '') {
        this.$message.error('请填写任务名称！')
        return
      }
      if (this.addForm.description === '') {
        this.$message.error('请填写任务描述！')
        return
      }
      if (!this.targetFaceIds.length) {
        this.$message.error('请选择任务关联的人脸！')
        return
      }

      var formdata = new FormData()
      formdata.append('type', this.addForm.type)
      formdata.append('name', this.addForm.name)
      formdata.append('description', this.addForm.description)
      if (this.addForm.type === 1) {
        this.addForm.files.map((item, key, arr) => {
          formdata.append('file', item.originFileObj, item.originFileObj.name)
        })
      } else {
        formdata.append('url', this.addForm.url)
      }
      formdata.append('face_ids', this.targetFaceIds.join(','))

      this.addLoading = true
      api.addTask(formdata).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.updateParentData('pageNum', 1)
          this.$emit('getList')

          this.updateParentData('addVisible', false)
          this.addLoading = false
          this.addForm = {
            type: '',
            url: '',
            name: '',
            description: '',
            files: []
          }
          this.targetFaceIds = []
          this.$message.success('任务创建成功')
        }
      }).catch(error => {
        this.addLoading = false
        console.log(error.response)
        this.$message.error(error.response.data.message || '创建出错！')
      })
    },
    handleCancel (e) {
      // this.addVisible = false
      this.updateParentData('addVisible', false)
    },
    beforeUpload (file, fileList) {
      return false
    },
    uploadVideoChange ({ fileList }) {
      this.addForm.files = fileList
    },
    filterOption (inputValue, option) {
      return option.title.indexOf(inputValue) > -1
    },
    getRowSelection ({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll (selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key)
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect ({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
      }
    },
    handleChange (nextTargetKeys, direction, moveKeys) {
      // this.targetKeys = nextTargetKeys
      this.updateParentData('targetKeys', nextTargetKeys)
      this.targetFaceIds = nextTargetKeys

      // console.log('targetKeys: ', nextTargetKeys)
      // console.log('direction: ', direction)
      // console.log('moveKeys: ', moveKeys)
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      // this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
      this.updateParentData('selectedKeys', [...sourceSelectedKeys, ...targetSelectedKeys])

      // console.log('sourceSelectedKeys: ', sourceSelectedKeys)
      // console.log('targetSelectedKeys: ', targetSelectedKeys)
    },
    updateParentData (key, val) {
      this.$emit('updateData', { key: key, val: val })
    }
  }
}
</script>

<style scoped>
</style>
