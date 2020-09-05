<template>
  <div class="content">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="form-input login-page">
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="ruleForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode" required class="get-code-parent">
          <el-input v-model="ruleForm.checkCode"></el-input>
          <el-button  type="success"  v-show="show"  @click="getEmailCode()" class="get-code">{{codeText}}</el-button>
          <el-button  type="info" v-show="!show"  class="get-code">{{count}} s</el-button>
        </el-form-item>
        <el-form-item label="新密码" prop="password" required>
          <el-input type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button  type="success" style="width: 100%" @click="onSubmit('ruleForm')">确认修改</el-button>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button  type="primary" class="forget-password"  @click="toLogin">立即登录</el-button>
        </el-form-item>

      </el-form>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        timer: null,
        codeText:"发送验证码",
        count: '',
        show: true,
        ruleForm: {
          email: '',
          checkCode: '',
          password: '',
        },
        rules: {
          email: [
            {required: true, message: '请输入员工邮箱', trigger: 'blur'},
          ],
          checkCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      getEmailCode(){
        this.$request.post(this.$API.login_send_email, {email:this.ruleForm.email}).then((res)=>{
          if(res.code==200){
            const TIME_COUNT = 60;
            if (!this.timer) {
              this.count = TIME_COUNT;

              this.show = false;

              this.timer = setInterval(() => {

                if (this.count > 0 && this.count <= TIME_COUNT) {

                  this.count--;

                } else {

                  this.show = true;

                  clearInterval(this.timer);

                  this.timer = null;

                }

              }, 1000)

            }
          }else{
            SendMessage({
              message:res.msg,
              type:'error'
            })
          }

        }).catch(()=>{

        })

      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$request.post(this.$API.login_find_password, {email:this.ruleForm.email,code:this.ruleForm.checkCode,password:this.ruleForm.password}).then((res)=>{
              if(res.code==200){
                SendMessage({
                  message:res.msg,
                  type:'success'
                }),
                setTimeout( () =>{
                  this.$router.push({
                    path: '/login'
                  })
                },1000)
              }else{
                SendMessage({
                  message:res.msg,
                  type:'error'
                })
              }

            }).catch(()=>{
              SendMessage({
                message:'网络错误，请稍后再试',
                type:'error'
              })
            })


          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      toLogin(){
        this.$router.push({
          path: '/login'
        })
      }
    }
  }


</script>
<style lang="less" scoped>
  .content {
    width: 100%;
    background-color: #ffffff;
    overflow: hidden;
    min-height: 100vh;
  }
  .login-page {
    position: relative;
    width: 420px;
    max-width: 100%;
    padding: 60px 35px;
    margin: 180px auto 0;
    overflow: hidden;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0px 0px 30px #ccc;
  }
  .forget-password{
    padding-right: 10px;
    width: 100%;
  }
  .get-code-parent{
    position: relative;
  }
  .get-code-parent .info{
    padding: 11px 20px;
  }
  .get-code{
    position: absolute;
    right: 0;
    top: 2px;
  }
</style>
