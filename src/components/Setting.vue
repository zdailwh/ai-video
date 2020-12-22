<template>
  <div class="settingWrap">
    <ul>
      <li><p class="title">ID：</p><p class="cont">{{ taskinfo.ID }}</p></li>
      <li><p class="title">任务名称：</p><p class="cont">{{ taskinfo.name }}</p></li>
      <li><p class="title">任务描述：</p><p class="cont">{{ taskinfo.description }}</p></li>
      <li><p class="title">任务类型：</p><p class="cont">{{ (taskinfo.type === 1 || taskinfo.type === '1')? '⽤户上传视频⽂件': (taskinfo.type === 2 || taskinfo.type === '2')? '实时rtsp视频流': '' }}</p></li>
      <li><p class="title">流类型：</p><p class="cont">{{ taskinfo.stream_type }}</p></li>
      <li><p class="title">状态：</p><p class="cont">{{ taskinfo.status === 0? '新建': taskinfo.status === 1? '进行中': '完成' }}</p></li>
      <li><p class="title">rtsp：</p><p class="cont">{{ taskinfo.rtsp }}</p></li>
      <li><p class="title">关联人脸ID：</p><p class="cont" v-for="(item, key) in taskinfo.face_ids" :key="key">{{ item }}</p></li>
      <li v-if="taskinfo.CreatedAt"><p class="title">创建时间：</p><p class="cont">{{ taskinfo.CreatedAt | dateFormat }}</p></li>
      <li v-if="taskinfo.UpdatedAt"><p class="title">更新时间：</p><p class="cont">{{ taskinfo.UpdatedAt | dateFormat }}</p></li>
      <li v-if="taskinfo.DeletedAt"><p class="title">删除时间：</p><p class="cont">{{ taskinfo.DeletedAt | dateFormat }}</p></li>
    </ul>
  </div>
</template>
<script>
var moment = require('moment')
export default {
  props: [ 'taskinfo' ],
  data () {
    return {
    }
  },
  filters: {
    dateFormat (val) {
      if (val === '') return ''
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  watch: {
    taskinfo (val, oldVal) {
    }
  }
}
</script>
<style scoped>
.settingWrap {
  padding: 0 10px;
}
.settingWrap li {
  display: flex;
  line-height: 35px;
}
.settingWrap .title {
  width: 90px;
  text-align: right;
  margin-right: 15px;
}
.settingWrap .cont {
  flex: 1;
  color: #fff;
}
</style>
