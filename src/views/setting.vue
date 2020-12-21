<template>
  <div class="settingContainer">
    <div class="setFormWrap">
      <a-form-model :model="form" :label-col="{span:8}" :wrapper-col="{span:16}">
        <a-form-model-item label="服务器地址">
          <a-input v-model="form.hosturl" placeholder="请填写旷视服务器地址" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 16, offset: 8 }">
          <a-button type="primary" @click="updateUrl">修改</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        smallLayout: false,
        hosturl: ''
      }
    }
  },
  mounted () {
    this.form.hosturl = this.$store.state.hosturl

    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }

    var storage = window.localStorage
    var url = storage.getItem('KS_host')
    if (url) {
      this.form.hosturl = url
      this.$store.commit('setHosturl', this.form.hosturl)
    }
  },
  methods: {
    updateUrl () {
      this.$store.commit('setHosturl', this.form.hosturl)
      this.$message.success('配置修改成功')
    }
  }
}
</script>
<style scoped>
.settingContainer {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding-top: 100px;
}
.setFormWrap {
  width: 340px;
  margin: 0 auto;
}
</style>
