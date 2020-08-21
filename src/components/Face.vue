<template>
  <div class="faceWrap" :style="smalllayout? 'height: auto;': ''">
    <ul class="listWrap">
      <li class="list-item" v-for="(fItem,fId) in taskresult" v-bind:key="fId" @click="$emit('videofixed', { currentTime: fItem.time, item: fItem })">
        <div class="img-box">
          <img v-if="fItem.fullUri" :src="fItem.fullUri || '../assets/user.png'" alt="人脸图">
          <img v-else src="../assets/user.png" alt="人脸图" style="width:32px;height:32px;">
          <!-- <p>{{fId}}</p> -->
        </div>
        <div class="desc-box">
          <div class="timeWrap">
            <p>{{fItem.name}}</p>
            <p v-if="fItem['性别']">性别：{{fItem['性别'].indexOf(':') !== -1 ? fItem['性别'].substring(0, fItem['性别'].indexOf(':')): fItem['性别']}}</p>
            <p>头发：{{fItem['头发']}}</p>
            <p>时间：{{fItem.time}}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: [ 'taskresult', 'smalllayout' ],
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
    }
  }
}
</script>
<style scoped>
.faceWrap {
  height: calc(100vh - 112px);
  overflow-y: scroll;
  padding: 0 10px;
}
.listWrap {
  display: flex;
  flex-wrap: wrap;
}
.list-item {
  width: 220px;
  height: 130px;
  border: 1px solid #555;
  margin: 0 5px 10px;
  color: #ddd;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.list-item .img-box {
  width: 100px;
  position: relative;
  text-align: center;
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.list-item .img-box img {
  max-width: 100px;
  max-height: 120px;
  border: 0;
}
.list-item .img-box p {
  line-height: 50px;
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
.desc-box .timeWrap {
  display: flex;
  margin: 8px 0;
  flex-direction: column;
}
</style>
