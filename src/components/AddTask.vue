<template>
  <a-modal
    title="创建任务"
    width="700px"
    v-model="addVisible"
  >
    <div>
      <a-form-model :model="addForm" :label-col="{span:4}" :wrapper-col="{span:14}">
        <a-form-model-item label="任务类型">
          <a-select v-model="addForm.type">
            <a-select-option :value="key" v-for="(val,key) in typeArr" v-bind:key="key">
              {{val}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="上传视频" v-if="addForm.type === 1">
          <a-upload
            list-type="picture"
            action="/apis/api/v1/upload/file"
            name="videoFile"
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
  props: [ 'datalist', 'addVisible', 'mockData', 'targetKeys', 'selectedKeys', 'smallLayout' ],
  data () {
    return {
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      addLoading: false,
      addForm: {
        type: '',
        url: '',
        name: '',
        repoId: '',
        rate: 1
      },
      typeArr: [ '实时rtsp视频流', '用户上传视频文件', '用户平台录像文件' ]
    }
  },
  methods: {
    handleOk (e) {
      if (this.addForm.type === '') {
        this.$message.error('请选择任务类型！')
        return
      }
      if (this.addForm.url === '') {
        this.$message.error('请填写任务地址！')
        return
      }
      if (this.addForm.name === '') {
        this.$message.error('请填写任务名称！')
        return
      }
      var params = {
        type: this.addForm.type,
        url: this.addForm.url + '',
        name: this.addForm.name,
        repoId: this.addForm.repoId,
        rate: this.addForm.rate
      }
      this.spinning = true
      api.addTask(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.datalist.unshift(res.data)
          this.datalist = []
          this.pageNum = 0
          this.nextPageToken = ''
          this.getTasks()

          // this.addVisible = false
          this.updateParentData('addVisible', false)
          this.spinning = false
          this.addForm = {
            type: '',
            url: '',
            name: '',
            repoId: '',
            rate: 1
          }
          this.$message.success('任务创建成功')
        }
      }).catch(error => {
        this.spinning = false
        console.log(error.response)
        this.$message.error(error.response.data.message || '创建出错！')
      })
    },
    handleCancel (e) {
      // this.addVisible = false
      this.updateParentData('addVisible', false)
    },
    uploadVideoChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 文件上传成功`)
        var fileId = info.file.response.fileId
        this.addForm.url = fileId
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败.`)
      }
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
