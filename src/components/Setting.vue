<template>
  <div class="settingWrap">
    <ul>
      <li><p class="title">ID：</p><p class="cont">{{taskinfo.id}}</p></li>
      <li><p class="title">任务名称：</p><p class="cont">{{taskinfo.name}}</p></li>
      <li><p class="title">任务描述：</p><p class="cont">{{taskinfo.description}}</p></li>
      <li><p class="title">状态：</p><p class="cont">{{taskinfo.status}}</p></li>
      <li><p class="title">monitors：</p><p class="cont" v-for="(item, key) in taskinfo.monitors" :key="key">{{item}}</p></li>
    </ul>
  </div>
</template>
<script>
export default {
  props: [ 'taskinfo' ],
  data () {
    return {
    }
  },
  filters: {
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
  width: 70px;
  margin-right: 15px;
}
.settingWrap .cont {
  flex: 1;
  color: #fff;
}
</style>
