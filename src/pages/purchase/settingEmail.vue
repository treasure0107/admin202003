<template>
  <div class="content">
    <div class="pages-header">
      <div>通知管理</div>
    </div>
    <div class="table-content">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="邮箱设置">
          <el-input type="textarea" v-model="form.email"></el-input>
          <div style="font-size: 12px;color: #999999">买家发布采购单时通知以上人员，多个使用","逗号英文隔开</div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitData">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                form: {
                    id: '',
                    email: '',
                }
            }
        },
        created () {
            this.getSetting()
        },

        methods: {
            async getSetting () {
                let {data} = await this.$request.get(this.$API.common_api, {}, 'main', {
                    router_path: 'purchase/notice/manage',
                    request_host: 'CATEGORY_SERVER_HOST'
                })
                this.form.email = data['email_list'].join(',')
            },

            async submitData () {
                let email = this.form.email.split(',')
                await this.$request.request(this.$API.common_api, {email_list: email}, 'main', 'POST',{
                    router_path: 'purchase/notice/manage',
                    request_host: 'CATEGORY_SERVER_HOST'
                })
                SendMessage({'type': 'success', 'message': '操作成功'})
                this.getSetting();
            }

        }

    }
</script>
<style lang="less" scoped>
  @import "../../assets/pageHeader";
</style>
