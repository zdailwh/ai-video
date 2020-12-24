<template>
  <div class="settingWrap">
    <ul>
      <li><p class="title">ID：</p><p class="cont">{{ taskinfo.id }}</p></li>
      <li><p class="title">任务名称：</p><p class="cont">{{ taskinfo.name }}</p></li>
      <li><p class="title">任务描述：</p><p class="cont">{{ taskinfo.description }}</p></li>
      <li><p class="title">状态：</p><p class="cont">{{ taskinfo.status }}</p></li>
      <li><p class="title">rtsp：</p><p class="cont">{{ taskinfo.url }}</p></li>
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
