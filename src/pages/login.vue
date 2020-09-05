<template>
  <div>
    <div class="login-container">
      <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-position="left" label-width="0px"
               class="demo-ruleForm login-page">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="name" required>
          <el-input type="text" class="login-input" prefix-icon="el-icon-user-solid" v-model="ruleForm.name" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" required>
          <el-input type="password" class="login-input" show-password prefix-icon="el-icon-lock" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="success" class="login-but" style="width:100%;margin-top: 20px" @click="onSubmit('ruleForm')"
                     @keyup.enter.native="loginEnter('ruleForm')">登录
          </el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" class="login-but login-but-pass" style="width:100%;" @click="findPassword">重置密码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <video autoplay="" class="video-box" type="video/mp4" muted
           src="https://res.wx.qq.com/a/wx_fed/wechat-main-page-frontend/res/static/res/1QzwDFl.mp4" loop=""></video>
    <footer class="footer-box text-center " style="width: 100%">
      <div>
        <a href="#" target="_blank">拍拍印</a>
        <a  href="#" target="_blank">点传印</a>
        <a  href="#" target="_blank">使用小程序</a>
        <a  href="#" target="_blank">下载APP</a>
      </div>
      <div>© 2019-2020 <span>paipaiyin.cn</span> Inc. All Rights Reserved</div>
    </footer>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                ruleForm: {
                    name: '',
                    password: '',
                },
                rules: {
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                }
            }
        },
        created () {
            var _self = this
            document.onkeydown = function (e) {
                if (window.event == undefined) {
                    var key = e.keyCode
                } else {
                    var key = window.event.keyCode
                }
                if (key == 13) {
                    _self.loginEnter('loginData')
                }
            }
        },
        methods: {
            async loginEnter (formName) {
                let result = await this.$request.post(this.$API.login, {
                    username: this.ruleForm.name,
                    password: this.ruleForm.password
                })
                if (result.code === 200) {
                    //请求成功取消回车事件
                    document.onkeydown = undefined
                    this.$request.post(this.$API.get_access_token, {
                        username: result.data.user_name,
                        app_key: result.data.app_key
                    }).then((res1) => {
                        sessionStorage.setItem('MENU_LIST', JSON.stringify(res1.data.node_list))
                        // alert(JSON.stringify(res1.data.client));
                        sessionStorage.setItem('token', res1.data.access_token_info.access_token)
                        sessionStorage.setItem('clientInfo', JSON.stringify(res1.data.access_token_info.client))

                        SendMessage({
                            message: '登录成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.$router.push({
                                path: '/'
                            })
                        }, 1000)
                    }).catch(() => {
                        SendMessage({
                            message: '网络错误，请稍后再试',
                            type: 'error'
                        })
                    })
                }
            },
            onSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                      this.loginEnter(formName)

                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },

            findPassword () {
                this.$router.push({
                    path: '/findPwd'
                })
            }
        }
    }


</script>
<style lang="less" scoped>
  .login-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.5);
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
  }
  .footer-box {
    position: fixed;
    bottom: 20px;
    width: calc(100% - 110px) !important;
    height: 30px;
    padding: 0 55px;
    z-index: 2;
    color: #666666;
    >div {
      flex: 1;
      font-size: 12px;
      a{
        text-decoration: none;
        color: #666666;
        width: 60px;
        display: table;
        float: left;
        position: relative;
        text-align: center;
      }
      &:last-child {
        text-align: right;
      }
    }
  }

  video {
    position: fixed;
    left: -10vw;
    top: -10vh;
    z-index: 0;
    width: 120vw;
    height: 120vh;
    object-fit: cover;
  }

  .login-page {
    position: relative;
    width: 300px;
    max-width: 100%;
    padding: 55px 35px;
    margin: 5% auto 0;
    overflow: hidden;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0px 0px 30px #999999;
  }
</style>
