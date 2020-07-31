<template>
  <div id="app">
    <div class="lager-layout">
      <div class="header">
        <div class="opt">
          <div class="logo"><img src="./assets/logo_zght.png"><span class="logo_title">智能内容管理系统</span></div>
          <div class="go_box"><div class="back"></div></div>
          <div class="go"></div>
        </div>
        <div class="opt">
          <div class="person-info">
            <div class="avatar"><img src="./assets/user.png" alt=""></div>
            <div class="my-name">
              <span class="userName_title" title="" v-on:mouseover="showMenus=true">测试用户</span>
              <ul class="my-opt" v-show="showMenus">
                <li><span>退出登录</span></li>
              </ul>
            </div>
          </div>
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
      showMenus: false
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
  background-color: #171819;
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
  padding: 0 40px 0 0;
  justify-content: space-between;
}
.header .opt {
  display: flex;
}
.header .logo {
  display: flex;
  align-items: center;
  width: 400px;
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
  letter-spacing: 1px;
}

.header .opt .go_box {
  display: flex;
  justify-content: center;
  margin-right: 20px;
}
.header .opt .go_box .back {
  margin-top: 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: url(./assets/back.png) no-repeat center center;
  background-size: cover;
  width: 34px;
  height: 30px;
  border-radius: 6px;
  background-color: #464646;
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
  background-color: #171819;
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
  background-color: #171819;
  overflow: auto;
  padding: 0 0 20px 0px;
}

/* 覆盖ant样式 */
.ant-input {
  background-color: #161616 !important;
  border: 1px solid #3c3c3c !important;
  border-radius: 4px;
  font-size: 14px;
  color: #fff !important;
}
.ant-descriptions-item-label {
  color: #fff !important;
}
</style>
