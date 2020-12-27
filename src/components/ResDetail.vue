<template>
  <div>
    <p><label>姓名：</label>{{ resItem.face_name }}</p>
    <p><label>时间：</label>{{ resItem.time }}</p>
    <p><label>faceID：</label>{{ resItem.face_id }}</p>
    <p><label>人脸表情：</label>{{ resItem.data.Expression.name | toDict('Expression') }}({{ resItem.data.Expression.confidence | myToFixed }})</p>
    <p><label>人脸三分类表情：</label>{{ resItem.data.ExpressionThree.name | toDict('ExpressionThree') }}({{ resItem.data.ExpressionThree.confidence | filterVal('ExpressionThree') }})</p>
    <p><label>faceID：</label>{{ resItem.face_id }}</p>
    <p></p>
    <p><label>头发长度：</label>{{ resItem.data.FaceAttributes.hair.name | toDict('hair') }}({{ resItem.data.FaceAttributes.hair.confidence | myToFixed }})</p>
    <p><label>是否有胡子：</label>{{ resItem.data.FaceAttributes.beard.name | toDict('beard') }}({{ resItem.data.FaceAttributes.beard.confidence | myToFixed }})</p>
    <p><label>是否戴眼镜：</label>{{ resItem.data.FaceAttributes.glasses.name | toDict('glasses') }}({{ resItem.data.FaceAttributes.glasses.confidence | myToFixed }})</p>
    <p></p>
    <p><label>人体朝向：</label>{{ resItem.data.HumanAttributes.Orientation.name | toDict('Orientation') }}({{ resItem.data.HumanAttributes.Orientation.confidence | myToFixed }})</p>
    <p><label>是否穿大衣：</label>{{ resItem.data.HumanAttributes.DressUpperCoat.name | toDict('DressUpperCoat') }}({{ resItem.data.HumanAttributes.DressUpperCoat.confidence | myToFixed }})</p>
    <p><label>下衣服饰：</label>{{ resItem.data.HumanAttributes.DressLowerStyle.name | toDict('DressLowerStyle') }}({{ resItem.data.HumanAttributes.DressLowerStyle.confidence | myToFixed }})</p>
    <p><label>性别：</label>{{ resItem.data.HumanAttributes.Gender.name | toDict('Gender') }}({{ resItem.data.HumanAttributes.Gender.confidence | myToFixed }})</p>
    <p><label>是否戴帽子：</label>{{ resItem.data.HumanAttributes.WearHat.name | toDict('WearHat') }}({{ resItem.data.HumanAttributes.WearHat.confidence | myToFixed }})</p>
    <p><label>下身颜色：</label>{{ resItem.data.HumanAttributes.DressLowerColor.name | toDict('DressLowerColor') }}({{ resItem.data.HumanAttributes.DressLowerColor.confidence | myToFixed }})</p>
    <p><label>帽子颜色：</label>{{ resItem.data.HumanAttributes.HatColor.name | toDict('HatColor') }}({{ resItem.data.HumanAttributes.HatColor.confidence | myToFixed }})</p>
    <p><label>年龄：</label>{{ resItem.data.HumanAttributes.AgeNum.name | toDict('AgeNum') }}({{ resItem.data.HumanAttributes.AgeNum.confidence | myToFixed }})</p>
    <p><label>上身颜色：</label>{{ resItem.data.HumanAttributes.DressUpperColor.name | toDict('DressUpperColor') }}({{ resItem.data.HumanAttributes.DressUpperColor.confidence | myToFixed }})</p>
    <p><label>上衣服饰尺寸：</label>{{ resItem.data.HumanAttributes.DressUpperSize.name | toDict('DressUpperSize') }}({{ resItem.data.HumanAttributes.DressUpperSize.confidence | myToFixed }})</p>
    <p></p>
    <p><label>跟踪ID：</label>{{ resItem.data.TrackId }}</p>
    <p><label>PersonId：</label>{{ resItem.data.PersonId }}</p>
    <p><label>人脸模糊程度：</label>{{ resItem.data.Blur | myToFixed }}</p>
    <p><label>人脸侧偏角度：</label>{{ resItem.data.Yaw | filterVal('Yaw') }}°</p>
    <p><label>人脸俯仰角度：</label>{{ resItem.data.Pitch | filterVal('Pitch') }}°</p>
    <p><label>检测框置信度：</label>{{ resItem.data.PfScore | myToFixed }}</p>
    <p><label>人体完整置信度：</label>{{ resItem.data.Partial | myToFixed }}</p>
    <p><label>人体检测框：</label>{{ resItem.data.HumanRect | filterVal('HumanRect') }}</p>
    <p><label>人头检测框：</label>{{ resItem.data.HeadRect | filterVal('HeadRect') }}</p>
    <p><label>人脸检测框：</label>{{ resItem.data.FaceRect | filterVal('FaceRect') }}</p>
    <p></p>
    <p class="resImgs">
      人脸图：
      <img :src="'http://' + $store.state.hosturl + '/v5/resources/data?uri=' + resItem.data.FaceImageUri + '&content-type=image/jpeg'">
    </p>
    <p class="resImgs">
      人体图：
      <img :src="'http://' + $store.state.hosturl + '/v5/resources/data?uri=' + resItem.data.HumanImageUri + '&content-type=image/jpeg'">
    </p>
  </div>
</template>
<script>
import dict from '../dict.json'
export default {
  props: [ 'resItem' ],
  data () {
    return {
    }
  },
  filters: {
    toDict (val, label) {
      if (!val) return ''
      var k = `${label}_${val}`
      if (dict[k]) {
        return dict[k]
      } else {
        return val
      }
    },
    myToFixed (val) {
      if (!val) return ''
      return val.toFixed(3)
    },
    filterVal (val, key) {
      var huduArr = ['Yaw', 'Pitch']
      var listArr = ['ExpressionThree', 'HumanRect', 'HeadRect', 'FaceRect']
      if (!val) return ''
      if (huduArr.indexOf(key) !== -1) {
        return (val / 3.14 * 180).toFixed(3)
      } else if (listArr.indexOf(key) !== -1) {
        var fixedArr = val.map((item, idx, arr) => {
          return parseFloat(item).toFixed(3)
        })
        return fixedArr.join(' , ')
      } else {
        return val
      }
    }
  },
  mounted () {
  }
}
</script>
<style scoped>
p {
  color: #989898;
  font-size: 14px;
}
p label {
  display: inline-block;
  text-align: right;
  width: 120px;
  color: #cecece;
  margin-right: 10px;
}
.resImgs {
  float: left;
  color: #cecece !important;
  width: 100px;
  margin-right: 10px;
}
.resImgs img {
  max-width: 100px;
  border: 1px solid #ccc;
}
</style>
