<template>
  <div id="app">
    <div class="lager-layout">
      <div class="header">
        <div class="opt">
          <div class="logo"><img src="./assets/ks_logo.png"><span class="logo_title" v-show="smallLayout === false">智能内容管理系统</span></div>
        </div>
        <div class="opt mymenu" style="justify-content: center;">
          <a-menu theme="dark" v-model="current" mode="horizontal">
            <!-- <a-menu-item key="/facegroup"><router-link to="/facegroup">人脸库</router-link></a-menu-item> -->
            <a-menu-item key="/star"><router-link to="/star">明星库</router-link></a-menu-item>
            <a-menu-item key="/task"><router-link to="/task">任务</router-link></a-menu-item>
          </a-menu>
        </div>
        <div class="opt" style="justify-content: flex-end;">
          <!-- <div class="person-info">
            <div class="avatar"><img src="./assets/user.png" alt=""></div>
            <div class="my-name">
              <span class="userName_title" title="" v-on:mouseover="showMenus=true">测试用户</span>
              <ul class="my-opt" v-show="showMenus">
                <li><span>退出登录</span></li>
              </ul>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="container">
      <div class="file-page">
        <div class="file-slider">
          <ul></ul>
        </div>
        <div class="file-main">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: function () {
    return {
      smallLayout: false,
      showMenus: false
    }
  },
  computed: {
    current () {
      return [this.$route.path]
    }
  },
  mounted () {
    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /*background-color: #171819;*/
  overflow: hidden;
}
.header {
  height: 60px;
  width: 100%;
  background-color: #303234;
  display: flex;
  position: fixed;
  z-index: 1000;
  line-height: 60px;
  padding: 0;
  align-self: center;
}
.header .opt {
  display: flex;
}
.header .logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.header .logo img {
  height: 60px;
  margin-right: 10px;
}
.header .logo .logo_title {
  height: 60px;
  line-height: 60px;
  display: inline-block;
  font-size: 20px;
  color: #acb0b7;
  /*letter-spacing: 1px;*/
  margin-right: 10px;
}

.mymenu .ant-menu-horizontal {
  line-height: 58px !important;
  background-color: transparent !important;
  border-bottom: none;
}

.person-info {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.person-info .avatar {
  display: flex;
  justify-content: center;
}
.person-info .avatar img {
  width: 28px;
  height: 28px;
  margin-right: 5px;
}
.person-info .my-name {
  position: relative;
  font-size: 16px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  height: 60px;
  padding-right: 17px;
}
.person-info .my-name .userName_title {
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.person-info .my-name:after {
  content: "";
  position: absolute;
  right: 0;
  top: 28px;
  display: inline-block;
  height: 0;
  width: 0;
  border: 6px solid transparent;
  border-top-color: #fff;
}
.person-info .my-name .my-opt {
  width: 136px;
  position: absolute;
  right: 0;
  top: 60px;
  margin-left: -45px;
  background-color: #2a2c2e;
  box-shadow: 0 0 1px 0 rgba(10, 31, 68, 0.08), 0 8px 10px 0 rgba(10, 31, 68, 0.1);
  border-radius: 4px;
  padding: 6px 0;
}
.person-info .my-name .my-opt li {
  color: #fff;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  text-align: left;
}
.person-info .my-name .my-opt li:hover {
  background-color: #2a92fe;
}
.person-info .my-name .my-opt li span {
  display: block;
  margin: 0 10px;
  padding-left: 10px;
  border-bottom: 1px solid #434547;
}
.person-info .my-name .my-opt li:last-child span {
  border-bottom: none;
}
.container {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 0px;
  flex: 1;
  display: flex;
  position: relative;
  /*background-color: #171819;*/
}
.file-page {
  width: 100%;
  height: 100%;
  padding-top: 60px;
}
.file-slider {
  width: 0px;
  height: 100%;
  overflow: auto;
  background: #222426;
  color: #fff;
  position: fixed;
  left: 0;
  z-index: 9;
  padding-top: 70px;
  bottom: 0;
  letter-spacing: 1px;
}
.file-page .file-main {
  width: 100%;
  height: 100%;
  /*background-color: #171819;*/
  overflow: auto;
  padding: 0 0 0 0px;
}

/* 覆盖ant样式 */
/*.mymenu .ant-menu {
  color: #a2a2a2;
}
.mymenu .ant-menu-horizontal > .ant-menu-item > a {
  color: #a2a2a2;
}
.mymenu .ant-menu-horizontal > .ant-menu-item-selected > a {
  color: #1890ff;
}*/
.login-form .ant-input, .cut_catalog_dropdown .ant-input {
  background-color: #161616;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
}
.desc-box .ant-descriptions-item-label {
  color: #fff;
}
.desc-box .ant-descriptions-item-content {
  color: #a2a2a2;
}
.desc-box .ant-descriptions-row > th, .desc-box .ant-descriptions-row > td {
  padding-bottom: 5px;
}

.d-right .ant-tabs {
  color: #a2a2a2;
}
.d-right .ant-tabs-bar {
  border-bottom: 1px solid #555;
}
.d-right .ant-tabs-nav .ant-tabs-tab-active {
  color: #fff;
}
.d-right .ant-tabs-nav .ant-tabs-tab:hover {
  color: #fff;
}
.d-right .ant-tabs-ink-bar {
  background-color: #fff;
}
.searchWrap_video .ant-form-item-label > label {
  color: #fff;
}
.searchWrap_video .ant-select-selection {
  background-color: #161616;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
}
.searchWrap_video .ant-select-selection--multiple .ant-select-selection__choice {
  background-color: #000;
  color: #989898;
  border: 1px solid #989898;
}
.searchWrap_video .ant-select-selection--multiple .ant-select-selection__choice__remove {
  color: #989898;
}

.ant-card-cover {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 75%;
  overflow: hidden;
}
.taskContainer .ant-card-cover {
  padding-top: 57% !important;
}
.ant-card-cover img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  height: auto;
}
.ant-card-cover video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  height: auto;
}

.cardList {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.cardList .cardItem {
  width: 200px;
  height: auto;
  margin: 5px;
}

/* 定位时显示详细信息 */
.vcp-slider {
  opacity: 1;
}
.absDetailWrap {
  position: absolute;
  top: 0;
  left: 120%;
  padding: 15px;
  width: 250px;
  height: 300px;
  overflow-y: scroll;
  font-size: 14px;
  text-align: left;
  background-color: #fff;
  border-radius: 15px;
  z-index: 9999;
}
.absDetailWrap p {
  word-break: break-all;
}
/*穿梭框*/
.ant-transfer-customize-list {
  flex-wrap: wrap;
}
.ant-transfer-list-body-customize-wrapper {
  height: calc(260px - 40px - 44px);
  overflow-y: scroll;
}
</style>
