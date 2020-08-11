<template>
  <div class="faceWrap">
    <ul>
      <li class="list-item" v-for="(fItem,fId) in taskresult" v-bind:key="fId">
        <div class="img-box">
          <img v-if="fItem.fullUri" :src="fItem.fullUri || '../assets/user.png'" alt="人脸图">
          <img v-else src="../assets/user.png" alt="人脸图" style="width:32px;height:32px;">
          <!-- <p>{{fId}}</p> -->
          <p>{{fItem.name}}</p>
        </div>
        <div class="desc-box">
          <div class="timeWrap" v-for="(timeOne,timeIdx) in fItem.times" v-bind:key="timeIdx">
            <p style="width: 100px;" v-if="timeOne['性别']">性别：{{timeOne['性别'].indexOf(':') !== -1 ? timeOne['性别'].substring(0, timeOne['性别'].indexOf(':')): timeOne['性别']}}</p>
            <p style="width: 100px;">头发：{{timeOne['头发']}}</p>
            <p style="width: 100px;">时间：{{timeOne.time}}</p>
            <p style="margin: 0 20px;">
              <a-button type="primary" size="small" ghost @click="$emit('videofixed', { currentTime: timeOne.time })">定位</a-button>
            </p>
            <a-popover title="详情">
              <template slot="content">
                <p v-for="(item,key) in timeOne" v-bind:key="key" v-if="hideKey.indexOf(key) === -1">
                  {{key}}：{{ item.indexOf(':') !== -1 ? item.substring(0, item.indexOf(':')): item | filterVal(key) }}
                </p>
              </template>
              <a-button type="link" size="small">详情...</a-button>
            </a-popover>
          </div>
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
    }
  }
}
</script>
<style scoped>
.faceWrap {
  height: calc(100vh - 170px);
  overflow-y: scroll;
  padding: 0 10px;
}
.list-item {
  border: 1px solid #555;
  margin: 0 0 10px;
  color: #ddd;
  display: flex;
  align-items: center;
}
.list-item .img-box {
  width: 120px;
  position: relative;
  text-align: center;
  margin: 10px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.list-item .img-box img {
  width: 120px;
  height: 80px;
  max-width: 100%;
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
}
</style>
