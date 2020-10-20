<template>
  <div class="login_container">
    <div class="login-wrap" :style="smallLayout?'width:369px':''">
      <div class="login_bg" v-show="smallLayout === false">
        <span>智能内容管理系统</span>
      </div>
      <div class="login_box">
        <div class="login-form">
          <p class="login_title">账号登录</p>
          <a-form-model ref="loginForm" :model="loginForm" :rules="rules" v-bind="layout">
            <a-form-model-item has-feedback label="用户名" prop="username">
              <a-input v-model="loginForm.username" placeholder="请输入用户名" />
            </a-form-model-item>
            <a-form-model-item has-feedback label="密码" prop="password">
              <a-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
            </a-form-model-item>
            <a-form-model-item>
              <a-button type="primary" @click="submitForm('loginForm')">
                登录
              </a-button>
              <!-- <a-button style="margin-left: 10px" @click="resetForm('loginForm')">
                重置
              </a-button> -->
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setToken } from '../utils/auth'
export default {
  data () {
    let checkPending
    let checkUsername = (rule, value, callback) => {
      clearTimeout(checkPending)
      if (value === '') {
        return callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      smallLayout: false,
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        password: [{ validator: validatePass, trigger: 'change' }],
        username: [{ validator: checkUsername, trigger: 'change' }]
      },
      layout: {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 }
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted () {
    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.loginForm.username !== 'admin') {
            this.$message.error('用户名错误')
            return
          }
          if (this.loginForm.password !== 'admin') {
            this.$message.error('密码错误')
            return
          }

          setToken(JSON.stringify(this.loginForm))
          this.$router.push({ path: this.redirect || '/' })
          // this.loading = true
          // this.$store.dispatch('authentication/login', this.loginForm).then(() => {
          //   this.$router.push({ path: this.redirect || '/' })
          //   this.loading = false
          // }).catch(() => {
          //   this.loading = false
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
.login_container {
  height: 100%;
  width: 100%;
  overflow: auto;
  background-color: #000;
  font-family: "Microsoft yahei";
}
.login_container .login-wrap {
  width: 1000px;
  height: 434px;
  display: flex;
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: 50%;
  /*margin-left: -500px;
  margin-top: -217px;*/
  transform: translate(-50%, -50%);
}
.login_container .login-wrap .login_bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 789px;
  height: 434px;
  background: url(../assets/bg_login.png);
}
.login_container .login-wrap .login_bg span {
  display: block;
  margin: 235px 0 0 235px;
  font-size: 36px;
  color: #e9e9e9;
  letter-spacing: 0;
}
.login_container .login-wrap .login_box {
  position: absolute;
  top: 0;
  right: 0;
  width: 369px;
  height: 427px;
  background-image: linear-gradient(0deg, #22262F 0%, #181A1E 99%);
}
.login_container .login-wrap .login_box .login-form {
  position: absolute;
  width: 313px;
  height: 400px;
  margin: 90px 0 0 25px;
  text-align: left;
}
.login_container .login-wrap .login_box .login-form .login_title {
  height: 40px;
  line-height: 40px;
  margin-bottom: 20px;
  font-size: 24px;
  color: #a5aab3;
}
.login_container .login-wrap .login_box .login-form input {
  height: 36px;
  line-height: 36px;
}
</style>
