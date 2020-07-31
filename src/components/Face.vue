<template>
  <div class="faceWrap">
    <ul>
      <li class="list-item" v-for="(face,index) in taskresult" v-bind:key="index">
        <div class="img-box">
          <img src="../assets/face.jpg" alt="video">
        </div>
        <div class="desc-box">
          <a-descriptions title="">
            <a-descriptions-item :label="key" v-for="(item,key) in face" v-bind:key="key" v-if="hideKey.indexOf(key) === -1">
              {{ item.indexOf(':') !== -1 ? item.substring(0, item.indexOf(':')): item | filterVal(key) }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div class="operate-box">
          <a-button type="primary" size="small" ghost @click="$emit('videofixed', { currentTime: face.time })">定位</a-button>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: [ 'taskresult' ],
  data () {
    return {
      hideKey: [ 'faceId' ]
    }
  },
  filters: {
    filterVal (val, key) {
      if (!val) {
        return ''
      }
      return val
    }
  },
  watch: {
    taskresult (val, oldVal) {
      console.log(val)
    }
  }
}
</script>
<style scoped>
.faceWrap {
  padding: 0 10px;
}
.list-item {
  border: 1px solid #222426;
  margin: 0 0 10px;
  color: #ddd;
  display: flex;
}
.list-item .img-box {
  width: 120px;
  position: relative;
  text-align: center;
  margin: 10px 15px;
  display: flex;
  align-items: center;
}
.list-item .img-box img {
  width: 120px;
  height: 80px;
  max-width: 100%;
  border: 0;
}
.desc-box {
  flex: 1;
  margin-top: 10px;
}
.operate-box {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
