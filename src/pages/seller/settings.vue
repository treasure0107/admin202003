<template>
  <div>
    <div class="pages-header">
      <div>店铺通用设置</div>
    </div>

    <div class="table-content">
      <el-form ref="form" class="form-info" label-width="200px" :model="form" v-loading="loading"
               :element-loading-text="loadingText">
        <el-form-item label="是否开启自动审核企业信息">
          <el-select placeholder="请选择" v-model="form.auto_check_company_info">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否开启敏感词自动识别">
          <el-select placeholder="请选择" v-model="form.auto_reg_sensitive_words">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否开启智能鉴黄">
          <el-select placeholder="请选择" v-model="form.auto_reg_pron">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否开启自动审核对公账号">
          <el-select placeholder="请选择" v-model="form.auto_check_bank_info">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="统一客服系统">
          <el-select placeholder="请选择" v-model="form.cust_service">
            <el-option label="网易云信" :value="1"></el-option>
            <el-option label="QQ" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="店铺类型">
          <el-select placeholder="请选择" v-model="nowType">
            <el-option :label="item" :value="index" :key="index" v-for="(item,index) in sellerType"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入驻商家类型">
          <div class="seller-type">
            <div class="seller-type-item" v-for="(item,index) in typeList[nowType]" :key="index"
                 v-if="typeList[nowType]">
              <div class="type-title">{{item.seller_name}}</div>
              <div class="items">1.保证金：{{item.sys_deposit}}元/店</div>
              <div class="items">2.店铺租金：{{item.sys_rent}}元/店</div>
              <div class="items">3.交易服务佣金：{{item.commission}}%(按单计算)</div>
              <div class="type-button">
                <el-button type="warning" plain icon="el-icon-edit" size="mini" circle
                           @click="setEdit(item)"></el-button>
                <el-button type="primary" plain icon="el-icon-delete" size="mini" circle
                           @click="deleteType(item.id)"></el-button>
              </div>
            </div>
            <div class="seller-type-item add-tem" @click="showEdit=true"
                 v-if="nowType==0 || (nowType!=0 && ((typeList[nowType] && !typeList[nowType].length) || !typeList[nowType]))">
              <div class="add-icon el-icon-plus"></div>
              <div>添加类型</div>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="入驻押金" prop="sys_deposit"
                       :rules="{required: true, message: '押金不能为空', trigger: 'blur'}">
           <el-input type="number" v-model="form.sys_deposit"></el-input>
         </el-form-item>

         <el-form-item label="入驻押金描述">
           <el-input v-model="form.deposit_remark"></el-input>
         </el-form-item>

         <el-form-item label="入驻租金" prop="sys_rent"
                       :rules="{required: true, message: '租金不能为空', trigger: 'blur'}">
           <el-input type="number" v-model="form.sys_rent"></el-input>
         </el-form-item>

         <el-form-item label="入驻租金描述">
           <el-input v-model="form.rent_remark"></el-input>
         </el-form-item>

         <el-form-item label="交易佣金" prop="commission" :rules="{required: true, message: '佣金不能为空', trigger: 'blur'}">
           <el-input v-model="form.commission"></el-input>
         </el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即保存</el-button>
        </el-form-item>
      </el-form>

      <el-dialog :title="(itemInfo.id ? '修改' : '添加')+'商家类型'" :visible.sync="showEdit" width="50%">
        <el-form ref="formss" :model="typeForm" label-width="120px">
          <el-form-item label="商家类型" prop="seller_name"
                        :rules="{required: true, message: '请输入商家类型', trigger: 'change'}">
            <el-input v-model="typeForm.seller_name" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="英文标示" prop="seller_en"
                        :rules="{required: true,pattern: /^[a-zA-Z]{1,20}$/,message: '请输入英文标示最多20个字符', trigger: 'change'}">
            <el-input v-model="typeForm.seller_en" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="保证金" prop="sys_deposit"
                        :rules="{required: true,pattern: /^(\d|[0-9]\d{1,9})(\.\d{1,2})?$/, message: '请输入正确的保证金(0-100000000的数字，最多两位小数)', trigger: 'change'}">
            <el-input v-model="typeForm.sys_deposit"></el-input>
          </el-form-item>
          <el-form-item label="店铺租金" prop="sys_rent"
                        :rules="{required: true,pattern: /^(\d|[0-9]\d{1,9})(\.\d{1,2})?$/, message: '请输入正确的店铺租金(0-100000000的数字，最多两位小数)', trigger: 'change'}">
            <el-input v-model="typeForm.sys_rent"></el-input>
          </el-form-item>
          <el-form-item label="店铺租金说明" prop="sys_rent_desc"
                        :rules="{required: true, message: '请输入店铺租金说明', trigger: 'change'}">
            <el-input v-model="typeForm.sys_rent_desc"></el-input>
          </el-form-item>
          <el-form-item label="交易服务佣金" prop="commission"
                        :rules="{required: true,pattern: /^(\d|[1-9]\d|100)(\.\d{1,2})?$/, message: '请输入正确的交易服务佣金(0-100的数字，最多两位小数)', trigger: 'change'}">
            <el-input v-model="typeForm.commission"></el-input>
          </el-form-item>

          <el-form-item label="商家协议" prop="treaty" :rules="{required: true, message: '请输入商家协议', trigger: 'change'}">
            <vue-editor :content.sync="typeForm.treaty" ref="vueeditor"></vue-editor>
          </el-form-item>
          <el-form-item label="排序" prop="content">
            <el-input v-model="typeForm.sort"></el-input>
          </el-form-item>

          <!--        <el-form-item label="备注">-->
          <!--          <el-input v-model="form.remarks" type="textarea"></el-input>-->
          <!--        </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="submitType">立即提交</el-button>
            <el-button @click="showEdit=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
    import Editor from '@/components/Editor'

    export default {
        data () {
            return {
                form: {},
                loading: false,
                typeList: [],
                itemInfo: [],
                loadingText: '正在加载',
                showEdit: false,
                nowType: 0,
                sellerType: ['公司公有店', '公司私有店', '个人公有店', '企业私域店', '个人私域店', '个人私有店'],
                typeForm: {
                    seller_name: '',
                    seller_en: '',
                    sys_deposit: '',
                    sys_rent: '',
                    sys_rent_desc: '',
                    commission: '',
                    treaty: '',
                    type: 0,
                    sort: 1
                }
            }
        },
        created () {
            this.settings_info()
        },
        methods: {
            onSubmit () {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        await this.$request.request(this.$API.seller_setting_info, this.form, 'main', 'PUT', {
                            handle_desc: '修改店铺配置;'
                        })
                        SendMessage({message: '修改成功', type: 'success'})
                    }
                })
            },

            submitType () {
                this.$refs.formss.validate(async (valid) => {
                    if (valid) {
                        let is_edit = this.typeForm.id || false
                        await this.$request.request(this.$API.seller_type, this.typeForm, 'main', is_edit ? 'PUT' : 'POST', {
                            handle_desc: is_edit ? `修改店铺类型;${this.typeForm.id}` : '添加店铺类型'
                        })
                        this.showEdit = false
                        this.settings_info()
                    }
                })
            },

            async deleteType (id) {
                if (await this.$common.confirmDialog(this, '是否要删除该商家分类？删除后果自负。')) {
                    await this.$request.request(this.$API.seller_type, {id: id}, 'main', 'DELETE', {
                        handle_desc: '删除商家分类:' + id
                    })
                    SendMessage({message: '删除成功', type: 'success'})
                    this.settings_info()
                }
            },

            async settings_info () {
                this.loading = true
                let {data} = await this.$request.get(this.$API.seller_setting_info)
                this.form = data.info
                this.typeList = data.type
                if (data.info && data.info.cust_service) {
                    this.loading = false
                } else {
                    SendMessage({message: '请先设置默认数据', type: 'error'})
                    this.loadingText = '请先设置默认数据'
                }
            },
            async setEdit (item) {
                this.showEdit = true
                this.typeForm = JSON.parse(JSON.stringify(item))
                await this.$common.wait(200)
                this.$refs.vueeditor.setContent(item.treaty)
            },
            async unForm () {
                this.typeForm = {
                    seller_name: '',
                    seller_en: '',
                    sys_deposit: '',
                    sys_rent: '',
                    commission: '',
                    treaty: '',
                    type: this.nowType,
                    sort: 1
                }
                await this.$common.wait(200)
                this.$refs.vueeditor.setContent('')
            }
        },
        watch: {
            showEdit (res) {
                !res && this.unForm()
            },
            nowType (res) {
                this.typeForm.type = res
            }
        },
        components: {
            vueEditor: Editor
        }
    }
</script>
<style lang="less" scoped>
  @import "../../assets/pageHeader";

  .seller-type {
    width: 100%;

    .seller-type-item {
      /*width: 250px;*/
      height: 180px;
      float: left;
      border-radius: 5px;
      border: 1px #eeeeee solid;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
      margin-right: 15px;
      padding: 10px;
      margin-top: 10px;
      position: relative;

      &:hover {
        background: #f5f5f5;
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.14) 0px 1px 10px 0px;

        &::after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          content: '';
          border-radius: 5px;
          border: 2px #60aeff solid;
        }
      }

      .type-title {
        font-size: 16px;
        font-weight: bold;
      }

      .items {
        line-height: 30px;
      }

      .type-button {
        position: absolute;
        width: 100%;
        bottom: 10px;
        left: 0;
        z-index: 100;
        padding-left: 20px;
      }
    }

    .add-tem {
      width: 200px;
      text-align: center;

      .add-icon {
        font-size: 30px;
        margin-top: 50px;
      }
    }

    .activity {
      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        border-radius: 5px;
        border: 2px #60aeff solid;
      }
    }
  }
</style>
