<template>
  <div class="faceWrap" :style="smalllayout? 'height: auto;': ''">
    <ul class="listWrap" v-if="taskresult.length">
      <li class="list-item" :class="{ currBox: currBoxKey === k }" v-for="(fItem,k) in taskresult" v-bind:key="k" @click="changeBox(fItem, k)">
        <div class="img-box">
          <img v-if="fItem.faceImageUri" :src="fItem.faceImageUri" alt="人脸图">
          <img v-else src="../assets/user.png" alt="人脸图" style="width:32px;height:32px;">
        </div>
        <div class="desc-box">
          <div class="timeWrap">
            <p>{{fItem.name}}</p>
            <p v-if="fItem['性别']">性别：{{fItem['性别'].indexOf(':') !== -1 ? fItem['性别'].substring(0, fItem['性别'].indexOf(':')): fItem['性别']}}</p>
            <p>性别：{{fItem.Gender.value}}</p>
            <p>头发：{{fItem.hair.value}}</p>
            <p>时间：{{fItem.time}}</p>
          </div>
        </div>
      </li>
    </ul>
    <div v-else><p>还没有识别结果！</p></div>
  </div>
</template>
<script>
export default {
  props: [ 'taskresult', 'smalllayout' ],
  data () {
    return {
      currBoxKey: 0
    }
  },
  watch: {
    taskresult (val, oldVal) {
      if (val.length) {
        this.currBoxKey = 0
        var fItem = val[0]
        this.$emit('videofixed', { currentTime: fItem.time, item: fItem })
      }
    }
  },
  methods: {
    changeBox (fItem, k) {
      this.$emit('videofixed', { currentTime: fItem.time, item: fItem })
      this.currBoxKey = k
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
.list-item.currBox {
  box-shadow: 0 0 10px 0 rgba(255,255,255,.7);
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
