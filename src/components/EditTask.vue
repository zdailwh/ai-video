<template>
  <a-modal
    :title="editTag === 'edit'? '编辑任务': '创建任务'"
    width="700px"
    v-model="editVisible"
  >
    <div>
      <a-form-model :model="editForm" :label-col="{span:4}" :wrapper-col="{span:14}">
        <a-form-model-item label="任务类型">
          <a-select v-model="editForm.type">
            <a-select-option :value="key" v-for="(val,key) in typeArr" v-bind:key="key">
              {{val}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="上传视频" v-if="editForm.type === 1">
          <a-upload
            list-type="picture"
            :beforeUpload="beforeUpload"
            @change="uploadVideoChange"
          >
            <a-button> <a-icon type="upload" /> 选择视频文件 </a-button>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="任务地址">
          <a-input v-model="editForm.url" :disabled="editForm.type === 1" />
        </a-form-model-item>
        <a-form-model-item label="任务名称">
          <a-input v-model="editForm.name" />
        </a-form-model-item>
        <a-form-model-item label="任务描述">
          <a-input v-model="editForm.description" />
        </a-form-model-item>
        <a-form-model-item label="选择名人" :wrapperCol="{span: 20}">
          <a-transfer
            :data-source="mockData"
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
              <template slot="fullUri" slot-scope="url">
                <img :src="url" style="max-width: 50px;max-height: 50px;">
              </template>
              </a-table>
            </template>
          </a-transfer>

        </a-form-model-item>
      </a-form-model>
    </div>
    <template slot="footer">
      <a-button key="back" @click="handleCancel_edit">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="editLoading" @click="handleEdit">
        {{editTag === 'edit'? '更新': '创建'}}
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
    title: '姓名'
  },
  {
    dataIndex: 'fullUri',
    title: '头像',
    width: '50px',
    scopedSlots: { customRender: 'fullUri' }
  }
]
const rightTableColumns = [
  {
    dataIndex: 'title',
    title: '姓名'
  }
]
export default {
  props: [ 'datalist', 'editVisible', 'mockData', 'targetKeys', 'selectedKeys', 'smallLayout', 'editTag', 'editForm', 'editKey', 'editItem' ],
  data () {
    return {
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      editLoading: false,
      // editForm: {
      //   type: '',
      //   url: '',
      //   name: '',
      //   description: ''
      // },
      // editItem: {},
      // editKey: '',
      typeArr: [ '实时rtsp视频流', '用户上传视频文件', '用户平台录像文件' ]
    }
  },
  methods: {
    handleEdit () {
      if (this.editForm.type === '') {
        this.$message.error('请选择任务类型！')
        return
      }
      if (this.editForm.type === 1) {
        if (!this.videoFile) {
          this.$message.error('请选择上传视频文件！')
          return
        }
      } else {
        if (this.editForm.url === '') {
          this.$message.error('请填写任务地址！')
          return
        }
      }
      if (this.editForm.name === '') {
        this.$message.error('请填写任务名称！')
        return
      }
      if (this.editForm.description === '') {
        this.$message.error('请填写任务描述！')
        return
      }
      var params = {
        type: this.editForm.type,
        name: this.editForm.name,
        description: this.editForm.description
      }
      if (this.editForm.type === 1) {
        params.file = this.videoFile
      } else {
        params.url = this.editForm.url
      }
      console.log(params)
      this.editLoading = true
      if (this.editTag === 'edit') { // 编辑
        params.id = this.editItem.id
        api.editTask(params).then(res => {
          if (res.status >= 200 && res.status < 300) {
            // this.datalist.splice(this.editKey, 1, res.data)
            this.updateParentData('datalist', [])
            this.updateParentData('pageNum', 0)
            this.$emit('getList')

            this.updateParentData('editVisible', false)
            this.editLoading = false
            this.updateParentData('editForm', {})
            this.$message.success('任务编辑成功')
          }
        }).catch(error => {
          this.editLoading = false
          console.log(error.response)
          this.$message.error(error.response.data.message || '编辑出错！')
        })
      } else if (this.editTag === 'copy') { // 复制
        api.addTask(params).then(res => {
          if (res.status >= 200 && res.status < 300) {
            // this.datalist.splice(this.editKey, 1, res.data)
            this.updateParentData('datalist', [])
            this.updateParentData('pageNum', 0)
            this.$emit('getList')

            this.updateParentData('editVisible', false)
            this.editLoading = false
            this.updateParentData('editForm', {})
            this.$message.success('任务复制成功')
          }
        }).catch(error => {
          this.editLoading = false
          console.log(error.response)
          this.$message.error(error.response.data.message || '复制出错！')
        })
      }
    },
    handleCancel_edit () {
      // this.editVisible = false
      this.updateParentData('editVisible', false)

      this.updateParentData('editForm', {})
      this.updateParentData('editKey', '')
      this.updateParentData('editItem', {})
    },
    beforeUpload (file, fileList) {
      return false
    },
    uploadVideoChange (info) {
      this.videoFile = info.file
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
      this.targetKeys = nextTargetKeys

      console.log('targetKeys: ', nextTargetKeys)
      console.log('direction: ', direction)
      console.log('moveKeys: ', moveKeys)
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]

      console.log('sourceSelectedKeys: ', sourceSelectedKeys)
      console.log('targetSelectedKeys: ', targetSelectedKeys)
    },
    updateParentData (key, val) {
      this.$emit('updateData', { key: key, val: val })
    }
  }
}
</script>

<style scoped>
</style>
