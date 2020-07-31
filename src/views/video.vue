<template>
  <div>
    <div class="d-left">
      <div class="media-wrapper">
        <div class="media-player">
          <div class="playwrap">
            <div id="tcplayer" />
            <!-- <video src="../assets/demo.mp4" textcaption="" fileid="655352622883841" filename="乘风破浪的姐姐20200616.mp4" filetype="video" commit="true" showcutbtn="1" operate="2" preload="auto" duration="4155" isready="1" style="width: auto; height: 100%; background: rgb(0, 0, 0); padding-top: 50px;" downloadfileid="655356197143552"></video> -->
<!--             <div class="slider-wrapper"></div>
            <div class="progress-wrapper">
              <div class="media-control-group media-control-group--seek">
                <progress class="media-control media-control--progress" max="100" value="100"></progress>
                <input type="range" step="any" max="4155.3920" class="media-control media-control--seekbar" value="0" style="background-size: 0% 100%;">
                <div class="label-sign-box"></div>
              </div>
            </div>
            <div class="media-controls">
              <div class="controls-left">
                <div class="video-controll-palypasue--play"></div>
                <time class="media-control media-control--current-time">00:16:04</time><span>/</span><time class="media-control media-control--duration">01:09:15</time>
              </div>
              <div class="controls-right">
                <div class="constom-volume">
                  <svg width="36px" height="36px" viewBox="0 0 36 36" class="media-player-control-mute">
                    <polygon fill="#ecedf2" points="11,14.844 11,21.442 14.202,21.442 17.656,25 17.656,11 14.074,14.844"></polygon>
                    <g><path fill="#ecedf2" d="M24.024,14.443c-0.607-1.028-1.441-1.807-2.236-2.326c-0.405-0.252-0.796-0.448-1.153-0.597c-0.362-0.139-0.682-0.245-0.954-0.305c-0.058-0.018-0.104-0.023-0.158-0.035v1.202c0.2,0.052,0.421,0.124,0.672,0.22c0.298,0.125,0.622,0.289,0.961,0.497c0.662,0.434,1.359,1.084,1.864,1.94c0.26,0.424,0.448,0.904,0.599,1.401c0.139,0.538,0.193,0.903,0.216,1.616c-0.017,0.421-0.075,1.029-0.216,1.506c-0.151,0.497-0.339,0.977-0.599,1.401c-0.505,0.856-1.202,1.507-1.864,1.94c-0.339,0.209-0.663,0.373-0.961,0.497c-0.268,0.102-0.489,0.174-0.672,0.221v1.201c0.054-0.012,0.1-0.018,0.158-0.035c0.272-0.06,0.592-0.166,0.954-0.305c0.358-0.149,0.748-0.346,1.153-0.597c0.795-0.519,1.629-1.298,2.236-2.326C24.639,20.534,24.994,19.273,25,18C24.994,16.727,24.639,15.466,24.024,14.443z" style="transform: scale(1);"></path></g>
                    <g><path fill="#ecedf2" d="M21.733,18c0-1.518-0.91-2.819-2.211-3.402v6.804C20.824,20.818,21.733,19.518,21.733,18z" style="transform: scale(1);"></path></g>
                    <g></g>
                  </svg>
                  <input type="range" step="any" min="0" max="1" class="media-control media-control--volume constom-ipt" value="1" style="background-size: 100% 100%;">
                </div>
              </div>
            </div> -->
          </div>
          <div class="cut_catalog_dropdown">
            <ul class="cut_catalog_list">
              <li class="cut_catalog_item">
                <span class="title">设置起点 :</span>
                <input name="min" title="时间格式为 00:00:00" maxlength="8" autocomplete="off" type="text" class="ant-input" value="00:00:00">
              </li>
              <li class="cut_catalog_item">
                <span class="title">设置终点 :</span>
                <input name="max" title="时间格式为 00:00:00" maxlength="8" autocomplete="off" type="text" class="ant-input" value="00:00:00">
              </li>
              <li class="cut_catalog_item">
                <i class="anticon anticon-close"></i>
                <span>
                  <span class="btn btn_ok" style="pointer-events: none; opacity: 0.3;">预览</span>
                  <span class="btn btn_cancale" style="pointer-events: none; opacity: 0.3;">确认</span>
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
    <div class="d-right">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="基本信息">
          <Setting/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="人脸识别">
          <Face :taskresult="taskResult" @videofixed="videoFixed" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import api from '../api'
import { TcPlayer } from 'tcplayer'
import Setting from '../components/Setting'
import Face from '../components/Face'
export default {
  components: { Setting, Face },
  data () {
    return {
      datavideo: {
        play_url: 'https://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f40.mp4'
      },
      taskResult: [
        {
          'faceId': '1-AAABczbmMnw9SqFvAAAAAg==',
          'name': '张含韵',
          'time': '1分1秒',
          '上身纹理': '横条纹:0.82310396',
          '下身尺寸': '长:0.9772702',
          '下身类型': '短裙:0.8407891',
          '下身颜色': '黑色:0.9499273',
          '人朝向': '前:0.97419655',
          '体形': '正常:0.99434173',
          '发型': '长:0.9999629',
          '头发': '长发',
          '年龄': '18-30岁:0.9642571',
          '性别': '女性:0.9999788',
          '有无带包': '是:0.89711547',
          '肤色': '黄皮肤'
        },
        {
          'faceId': '2-AAABczbmMnw9SqFvAAAAAg==',
          'name': '张含韵',
          'time': '53秒',
          '上身纹理': '横条纹:0.82310396',
          '下身尺寸': '长:0.9772702',
          '下身类型': '短裙:0.8407891',
          '下身颜色': '黑色:0.9499273',
          '人朝向': '前:0.97419655',
          '体形': '正常:0.99434173',
          '发型': '长:0.9999629',
          '头发': '长发',
          '年龄': '18-30岁:0.9642571',
          '性别': '女性:0.9999788',
          '有无带包': '是:0.89711547',
          '肤色': '黄皮肤'
        }
      ]
    }
  },
  mounted () {
    api.getVideos().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    var widthPlayer = document.querySelector('#tcplayer').offsetWidth
    this.widthPlayer = widthPlayer
    this.heightPlayer = widthPlayer * 9 / 16
    document.querySelector('#tcplayer').style.height = this.heightPlayer + 'px'
    this.createPlayer()
  },
  methods: {
    callback (key) {
      console.log(key)
    },
    createPlayer () {
      var url = this.datavideo.play_url

      var player = new TcPlayer('tcplayer', {
        mp4: url,
        autoplay: false,
        width: 'auto',
        height: '100%',
        wording: {
          1001: '网络错误，请检查网络配置或者播放链接是否正确',
          1002: '获取视频失败，请检查播放链接是否有效',
          2032: '获取视频失败，请检查播放链接是否有效',
          2048: '无法加载视频文件，跨域访问被拒绝'
        },
        listener: function (msg) {
          console.log('listener:', msg)
          // if (msg.type === 'play') {
          //   self.videoPlay()
          // }
          // if (msg.type === 'loadeddata') {
          //   player.play()
          // }
        }
      })
      window.player = player
    },
    videoFixed (params) {
      var timeStr = params.currentTime
      var h = 0
      var m = 0
      var s = 0
      if (timeStr.indexOf('时') !== -1) {
        h = timeStr.substring(0, timeStr.indexOf('时'))
        timeStr = timeStr.replace(timeStr.substring(0, timeStr.indexOf('时') + 1), '')
      }
      if (timeStr.indexOf('分') !== -1) {
        m = timeStr.substring(0, timeStr.indexOf('分'))
        timeStr = timeStr.replace(timeStr.substring(0, timeStr.indexOf('分') + 1), '')
      }
      if (timeStr.indexOf('秒') !== -1) {
        s = timeStr.substring(0, timeStr.indexOf('秒'))
      }
      var time = parseInt(h * 3600) + parseInt(m * 60) + parseInt(s)
      // console.log(h + ':' + m + ':' + s + ':::' + time)
      window.player.currentTime(time)
    }
  }
}
</script>
<style scoped>
.d-left {
  width: 50%;
  height: 100%;
  float: left;
}
.d-right {
  width: 50%;
  height: 100%;
  float: right;
}
.media-wrapper {
  height: 50%;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
}
.media-wrapper .media-player {
  text-align: center;
  width: 100%;
  height: 100%;
  position: relative;
}
.playwrap {
  padding: 0 5px;
}
/*.slider-wrapper {
  height: 4px;
  width: 100%;
  position: absolute;
  bottom: 58px;
  z-index: 9999;
  left: 0;
  opacity: 0.8;
  color: #fff;
  display: block;
}
.progress-wrapper {
  height: 4px;
  width: 100%;
  position: absolute;
  bottom: 46px;
  z-index: 9999;
  left: 0;
  background-color: #232323;
  opacity: 0.8;
  color: #fff;
  display: block;
}
.media-control-group {
  margin: 0;
  display: flex;
  align-items: center;
  position: relative;
}
.media-control-group--seek {
  flex: 1;
}
.media-control--progress {
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  margin: 0;
  border: 0;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #232323;
  color: #232323;
}
.media-control--seekbar {
  position: absolute;
  z-index: 5;
  top: -8px;
  left: 0;
  padding: 0 !important;
  margin: 0 !important;
}
progress {
  vertical-align: baseline;
}
input[type="range"] {
  display: block;
  width: 100%;
  height: 20px;
  background-color: transparent;
  cursor: pointer;
}
.media-controls {
  position: absolute;
  padding: 0 5px;
  display: flex;
  align-items: center;
  background-color: #171819;
  opacity: 0.8;
  color: #fff;
  width: 100%;
  margin-top: -39px;
  bottom: 0;
  font-size: 14px;
  justify-content: space-between;
}
.media-controls .controls-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.media-controls .controls-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.video-controll-palypasue--play {
  width: 36px;
  height: 36px;
  display: inline-block;
  background: url(../assets/play.png) no-repeat center;
  background-size: contain;
}
.media-control {
  margin: 0 6px;
}
.media-control--duration {
  font-size: 14px;
  color: #878a8f;
}
.constom-volume {
  position: relative;
  width: 152px;
  text-align: left;
  margin-right: 8px;
}
.constom-volume svg {
  padding-top: 5px;
  width: 40px;
  height: 40px;
  transform-origin: 50% 50%;
}
svg:not(:root) {
  overflow: hidden;
}
.constom-ipt {
  position: absolute;
  right: 2px;
  top: 12px;
  z-index: 2;
  width: 120px !important;
  padding-left: 0 !important;
  background-color: #171819 !important;
  border-radius: 0px 2px 2px 0px;
}
.media-control--volume {
  max-width: 120px;
}*/

.cut_catalog_dropdown {
  position: absolute;
  right: 5px;
  bottom: -153px;
  width: 210px;
  height: 153px;
  z-index: 1000;
  border-radius: 4px;
  background: #2d2f31;
  box-shadow: 0 0 1px 0 rgba(10, 31, 68, 0.08), 0 8px 10px 0 rgba(10, 31, 68, 0.1);
}
.cut_catalog_dropdown .cut_catalog_list {
  padding: 10px;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item:first-child {
  margin-top: 0;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item {
  height: 24px;
  margin: 10px 0;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item span.title {
  width: 78px;
  font-size: 12px;
  color: #acb0b7;
  text-align: right;
  padding-right: 10px;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item input {
  width: 100px;
  font-size: 12px;
}
input[type="text"], textarea {
  -webkit-appearance: none;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item span.title, .cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item input {
  height: 24px;
  line-height: 24px;
  float: left;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item .anticon-close {
  position: absolute;
  top: 2px;
  right: 2px;
  color: #a5aab3;
  cursor: pointer;
  font-size: 13px;
  background: #3c3c3c;
  border-radius: 50%;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item .btn {
  display: inline-block;
  width: 78px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background-color: #3c3c3c;
  border-radius: 4px;
  color: #fff;
  margin: 0 5px;
  font-size: 12px;
  cursor: pointer;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item .btn.btn_ok {
  background-color: #2a92fe;
}
</style>
