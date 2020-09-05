<template>
  <div class="table-content store-join-info">
    <el-form ref="form" class="form-info" :model="form" label-width="150px" v-loading="loading">
      <div class="store-info">
        <div class="info-title-style">店铺信息</div>
        <el-form-item label="店铺类型" :rules="{required: true, message: '请输选择店铺类型', trigger: 'blur'}" prop="open_status">
          <el-select :disabled="disabled" v-model="form.open_status" placeholder="请选择">
            <el-option :label="item" :value="index" v-for="(item,index) in shop_type" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺名称" :rules="{required: true, message: '请输入店铺名称', trigger: 'change'}" prop="rz_shop_name">
          <el-input v-model="form.rz_shop_name" maxlength="20" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="审核状态" :rules="{required: true, message: '请选择审核状态', trigger: 'blur'}"
                      prop="merchants_audit">
          <el-select :disabled="disabled" v-model="form.merchants_audit" placeholder="审核状态">
            <el-option :label="item" :value="index" v-for="(item,index) in check_status" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="company_info" v-if="form.companyInfo">
        <div class="info-title-style">{{form.open_status!=2 ? '公司信息' : '姓名'}}</div>
        <el-form-item :label="form.open_status!=2 && form.open_status!=4 && form.open_status!=5 ? '公司信息' : '姓名'" :rules="{required: true, message: '请输入', trigger: 'change'}"
                      prop="companyInfo.company_name">
          <el-input maxlength="50" v-model="form.companyInfo.company_name" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item :label="form.open_status!=2 && form.open_status!=4 && form.open_status!=5 ? '统一社会代码' : '省份证'" :rules="{required: true, message: '请输入', trigger: 'change'}"
                      prop="companyInfo.business_license_id">
          <el-input maxlength="30" v-model="form.companyInfo.business_license_id" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="法人" :rules="{required: true, message: '请输入法人', trigger: 'change'}"
                      prop="companyInfo.legal_person" v-if="form.open_status!=2 && form.open_status!=4 && form.open_status!=5">
          <el-input maxlength="20" :disabled="disabled" v-model="form.companyInfo.legal_person">
          </el-input>
        </el-form-item>
        <el-form-item label="公司所在地" :rules="{required: true, message: '请选择地址', trigger: 'change'}"
                      prop="companyInfo.district">
          <!--<el-select :disabled="disabled" placeholder="请选择">
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in address_list" :key="index"></el-option>
          </el-select>
          <el-select :disabled="disabled" placeholder="请选择" style="margin-left: 10px">
            <el-option label="省份" value="省份"></el-option>
          </el-select>
          <el-select :disabled="disabled" placeholder="请选择" style="margin-left: 10px">
            <el-option label="省份" value="省份"></el-option>
          </el-select>-->
          <el-cascader-panel v-model="select_address" :options="address_list" :disabled="disabled"
                             v-loading="addressLading"></el-cascader-panel>
        </el-form-item>

        <el-form-item label="详细地址" :rules="{required: true, message: '请输入详细地址', trigger: 'change'}"
                      prop="companyInfo.company_address">
          <el-input maxlength="100" v-model="form.companyInfo.company_address" :disabled="disabled"></el-input>
        </el-form-item>

        <el-form-item :label="form.open_status!=2 && form.open_status!=4 && form.open_status!=5 ? '手持身份证' : '营业执照'" :rules="{required: true, message: '请输上传营业执照', trigger: 'blur'}"
                      prop="companyInfo.license_file_img">
          <upload-img @uploaded="uploaded" v-if="!disabled" :keystr="'license_file_img'"></upload-img>
          <div style="margin-top: 10px"></div>
          <preview-image :image="form.companyInfo.license_file_img" v-if="form.companyInfo.license_file_img"
                         :height="'100px'"></preview-image>
          <el-button @click="form.companyInfo.license_file_img=''"
                     v-if="form.companyInfo.license_file_img && form.merchants_audit!=3">删除
          </el-button>
        </el-form-item>

        <el-form-item label="法人身份证正面" :rules="{required: true, message: '请输上传法人身份证正面', trigger: 'blur'}"
                      prop="companyInfo.legal_person_img_pos">
          <upload-img @uploaded="uploaded" v-if="!disabled" :keystr="'legal_person_img_pos'"></upload-img>
          <div style="margin-top: 10px"></div>
          <preview-image :image="form.companyInfo.legal_person_img_pos" v-if="form.companyInfo.legal_person_img_pos"
                         :height="'100px'"></preview-image>
          <el-button @click="form.companyInfo.legal_person_img_pos=''"
                     v-if="form.companyInfo.legal_person_img_pos && form.merchants_audit!=3">删除
          </el-button>
        </el-form-item>

        <el-form-item label="法人身份证反面" :rules="{required: true, message: '请输上传法人身份证反面', trigger: 'blur'}"
                      prop="companyInfo.legal_person_img_neg">
          <upload-img @uploaded="uploaded" v-if="!disabled" :keystr="'legal_person_img_neg'"></upload-img>
          <div style="margin-top: 10px"></div>
          <preview-image :image="form.companyInfo.legal_person_img_neg" v-if="form.companyInfo.legal_person_img_neg"
                         :height="'100px'"></preview-image>
          <el-button @click="form.companyInfo.legal_person_img_neg=''"
                     v-if="form.companyInfo.legal_person_img_neg && form.merchants_audit!=3">删除
          </el-button>
        </el-form-item>

      </div>

      <div class="user_info">
        <div class="info-title-style">联系人信息</div>
        <el-form-item label="性别" :rules="{required: true, message: '请选择性别', trigger: 'blur'}" prop="sex">
          <el-select :disabled="disabled" v-model="form.sex" placeholder="请选择">
            <el-option label="女" :value="0"></el-option>
            <el-option label="男" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" :rules="{required: true, message: '请输入联系人', trigger: 'change'}"
                      prop="name">
          <el-input maxlength="20" :disabled="disabled" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话"
                      :rules="{required: true,pattern: /^1[3465789]\d{9}$/,message: '请输入正确的联系电话', trigger: 'change'}"
                      prop="mobile">
          <el-input :disabled="disabled" v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱" :rules="{required: true,type: 'email', message: '请输入正确的联系邮箱', trigger: 'change'}"
                      prop="email">
          <el-input maxlength="50" :disabled="disabled" v-model="form.email"></el-input>
        </el-form-item>
      </div>

      <div class="price_info" v-if="form.depositInfo">
        <div class="info-title-style">入驻费用</div>
        <el-form-item label="入驻身份">
          <el-select disabled v-model="form.open_status" placeholder="请选择">
            <el-option :label="item" :value="index" v-for="(item,index) in zizhi_type" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商家类型" v-if="form.open_status==0">
          <el-input v-model="form.seller_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="押金">
          <el-input v-model="form.depositInfo.deposit_money" disabled></el-input>
        </el-form-item>
        <el-form-item label="租金">
          <el-input v-model="form.depositInfo.rent_money" disabled></el-input>
        </el-form-item>
        <el-form-item label="交易佣金"
                      :rules="{required: true,pattern: /^(((\d|[1-9]\d)(\.\d{1,3})?)|100|100.0|100.00|100.000)$/, message: '请输入正确的交易佣金(0-100的数字，最多两位小数)', trigger: 'change'}"
                      prop="depositInfo.commission">
          <el-input v-model="form.depositInfo.commission" :disabled="disabled"></el-input>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="onSubmit()" v-if="!disabled">保存</el-button>
        <el-button type="primary" @click="disabled=false" v-else-if="form.merchants_audit!=3">编辑</el-button>
        <el-button type="primary" @click="onSubmit(3,form.merchants_audit)" v-if="form.merchants_audit!=3">审核通过
        </el-button>
        <el-button @click="onSubmit(4,form.merchants_audit)" v-if="form.merchants_audit!=3">审核不通过</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
    import uploadImg from '../../components/UplodaImg'
    import PreviewImage from '../../components/PreviewImage'

    export default {
        data () {
            return {
                loading: false,
                addressLading: false,
                disabled: false,
                shop_id: '',
                zizhi_type: ['企业', '企业', '个人','企业','个人','个人'],
                shop_type: ['公司公有店', '公司私有店', '个人公有店', '企业私域店', '个人私域店', '个人私有店'],
                check_status: ['待入驻', '待付款', '待审核', '入驻成功', '审核不通过'],
                form: {},
                select_address: [],
                address_list: [],
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
            this.shop_id = this.$route.query.id
            if (!this.shop_id) {
                SendMessage({message: '参数错误', type: 'error'})
                this.$router.back(-1)
                return false
            }
            this.disabled = this.$route.query.edit ? false : true
            this.address()
            this.findJoinInfo()
        },
        methods: {

            async address () {
                this.addressLading = true
                let {data} = await this.$request.get(this.$API.addressInfo)
                this.address_list = data
                this.addressLading = false
            },

            async findJoinInfo () {
                this.loading = true
                let {data} = await this.$request.get(this.$API.common_api, {shop_id: this.shop_id}, 'main', {
                    request_host: 'STORE_SERVER_HOST',
                    router_path: 'store/seller_check_shop',
                    handle_class: 'JoinInfo'
                })
                data.merchants_audit == 3 && (this.disabled = true)
                if (data.companyInfo) {
                    let province = data.companyInfo.province.split('_')
                    let city = data.companyInfo.city.split('_')
                    let district = data.companyInfo.district.split('_')
                    this.select_address = [province[0], city[0], district[0]]
                }

                this.loading = false
                this.form = data
            },

            uploaded (data, key) {
                this.form.companyInfo[key] = data.imageOssUrl
                console.log(key, data.imageOssUrl)
            },

            onSubmit (status = 0, last = 0) {

                const setAddress = () => {
                    let province = '',
                        city = '',
                        district = ''
                    let address = JSON.parse(JSON.stringify(this.select_address))
                    province = _.findIndex(this.address_list, (o) => {
                        return o.value == address[0]
                    })
                    if (province >= 0) {
                        address[0] += '_' + this.address_list[province].label
                        city = _.findIndex(this.address_list[province].children, (o) => {
                            return o.value == address[1]
                        })
                        if (city >= 0) {
                            address[1] += '_' + this.address_list[province].children[city].label
                            district = _.findIndex(this.address_list[province].children[city].children, (o) => {
                                return o.value == address[2]
                            })
                            district >= 0 && (address[2] += '_' + this.address_list[province].children[city].children[district].label)
                        }
                    } else {
                        return {state: false, address: address}
                    }
                    return {state: true, address: address}
                }

                let {state, address} = setAddress()
                if (!state) {
                    SendMessage({message: '地址错误', type: 'error'})
                    return false
                }

                status && (this.form.merchants_audit = status)
                this.form.companyInfo.province = address[0]
                this.form.companyInfo.city = address[1]
                this.form.companyInfo.district = address[2]
                let userInfo = this.$common.getNowUserId(false)
                this.form.reviewer = userInfo.user_name
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        if (!this.form.companyInfo.province || !this.form.companyInfo.city || !this.form.companyInfo.district) {
                            SendMessage({message: '地址必选', type: 'error'})
                            return false
                        }

                        let param = JSON.parse(JSON.stringify(this.form))
                        Object.keys(param).forEach(item => {
                            if (typeof param[item] === 'object') {
                                Object.keys(param[item]).forEach(item2 => {
                                    param[item][item2] === '' && delete param[item][item2]
                                })
                            } else if (param[item] === '') {
                                delete param[item]
                            }
                        })

                        let {data} = await this.$request.request(this.$API.common_api, param, 'main', 'PUT', {
                            request_host: 'STORE_SERVER_HOST',
                            router_path: 'store/seller_check_shop',
                            extra_url: `?shop_id=${this.shop_id}`
                        })
                        SendMessage({message: '修改成功', type: 'success'})
                        this.$router.push({path: '/seller/storeJoin'})
                    } else {
                        this.form.merchants_audit = last
                        console.log('error submit!!')
                        return false
                    }
                })
            }
        },
        components: {
            uploadImg, PreviewImage
        }
    }
</script>
<style lang="less" scoped>
  .store-join-info {
    background: #ffffff;
    margin-top: 5px !important;

    .info-title-style {
      width: calc(~"100% - 30px");
      height: 40px;
      background: #f5f5f5;
      line-height: 40px;
      padding: 0 15px;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 22px;
    }
  }
</style>
