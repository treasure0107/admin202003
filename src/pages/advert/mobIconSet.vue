<template>
  <div class="content">
    <div class="pages-header">
      <div>移动端运营位配置</div>
    </div>

    <div class="table-content">

      <el-tabs v-model="ad_type" type="card">
        <el-tab-pane label="APP设置" name="0"></el-tab-pane>
        <el-tab-pane label="H5设置" name="1"></el-tab-pane>
        <el-tab-pane label="小程序设置" name="2"></el-tab-pane>
      </el-tabs>


      <el-table :data="tableData" stripe style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column fixed prop="id" label="序号" width="80"></el-table-column>
        <el-table-column prop="icon_url" label="icon" width="200">
          <template slot-scope="scope">
            <preview-image :key="scope.$index" :image="scope.row.icon_url" height="50px"></preview-image>
          </template>
        </el-table-column>
        <el-table-column prop="icon_name" label="icon名称" width="200"></el-table-column>
        <el-table-column prop="jump_value" label="跳转至" ></el-table-column>
        <el-table-column prop="jump_to" label="跳转类型" >
          <template slot-scope="scope">
            <el-tag style="width: 120px;text-align: center;">{{ad_link[scope.row.jump_to]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="openEdit(scope.$index)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--pc添加修改-->
    <el-dialog :title="(form.id ? '修改' : '添加') + '运营位'" :visible.sync="showEdit" width="60%">
      <el-form :model="form" label-width="120px"  :rules="rules" ref="form" >
        <el-form-item label="icon" prop="icon_url">
          <upload-img @uploaded="uploaded" :maxsize="300 * 1024"></upload-img>
          <img v-if="form.icon_url" :src="form.icon_url" class="avatar" style="max-height:200px;margin-top: 15px">
        </el-form-item>
        <el-form-item label="icon名称" prop="icon_name" required>
          <el-input v-model="form.icon_name" maxlength="4" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="跳转至" prop="jump_to" >
          <el-select v-model="form.jump_to" placeholder="请选择">
            <el-option @click.native="selectTo(index)" v-for="(item,index) in ad_link" :key="index" :label="item"
                       :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转地址" :rules="{required: true, message: '请输跳转地址', trigger: 'blur'}" prop="jump_value" v-if="form.jump_to==3">
          <el-input v-model="form.jump_value" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="跳转值" :rules="{required: true, message: '请输跳转值', trigger: 'blur'}" prop="jump_value" v-if="form.jump_to!=3">
          <el-input v-model="form.jump_value" placeholder="请分别填写对应跳转类型的ID，如商品，请填写商品的SPU ID" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks" >
          <el-input
            type="textarea"
            placeholder="请输入内容"
            maxlength="100"
            show-word-limit
            v-model="form.remarks">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitData('form')">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--pc添加修改-->


  </div>
</template>

<script>
    const  PATH_LIST = [
        {
            'all': 'app/icon/get_icon_list',
            'one': 'app/icon/update_icon_list',
            'title': 'APP'
        },
        {
            'all': 'h5/icon/get_icon_list',
            'one': 'h5/icon/update_icon_list',
            'title': 'H5'
        },
        {
            'all': 'wechat/icon/get_icon_list',
            'one': 'wechat/icon/update_icon_list',
            'title': '小程序'
        }
    ]

    import UploadImg from '@/components/UplodaImg'
    import PreviewImage from '@/components/PreviewImage'

    export default {
        data () {
            return {
                ad_type: '0',
                showEdit: false,
                showGoods: false,
                showSpecial: false,
                loading: false,
                goodsLoading: false,
                specialLoading: false,
                groupValue: [],
                formInline: {
                    ad_page: '',
                    ad_position: '',
                    ad_name: '',
                    is_show: ''
                },
                dialogForm: {
                    goods_name: '',
                    topic_name: ''
                },
                form: {
                  id: '',
                  icon_name: '',
                  icon_url: '',
                  jump_to: null,
                  jump_lower: '',
                  jump_value: '',
                  remarks: '',
                },
                dialog: {
                    page: 1,
                    size: 5,
                    total: 0,
                },
                special_size: 10,
                ad_link: ['平台分类', '商品', '专题页', '自定义连接','活动模板页'],
                linkType: '',
                tableData: [],
                page: 1,
                total: 0,
                size: 10,
                rules: {
                      icon_name: [
                          {required: true, message: 'icon名称必须', trigger: 'blur'},
                      ],
                      icon_url: [
                          {required: true, message: 'icon图片必须', trigger: 'blur'}
                      ],
                      jump_to: [
                          {required: true, message: '跳转类型不能为空', trigger: 'blur'}
                      ],
                      jump_value: [
                          {required: true, message: '跳转值或者链接不能为空', trigger: 'blur'}
                      ],
                  }
            }
        },
        created () {
            this.AdList()
        },
        methods: {
            async AdList (page = 0) {
                page && (this.page = page);
                this.loading = true;
                let param = this.formInline;
                let data = await this.$request.get(this.$API.common_api, param, 'main', {
                    router_path: PATH_LIST[this.ad_type]['all'],
                    request_host: 'CATEGORY_SERVER_HOST'
                })
                this.tableData = data.data;
                this.loading = false
            },

            openEdit (index) {
                this.form = JSON.parse(JSON.stringify(this.tableData[index]))
                if (this.form.jump_to == 0 && this.ad_type != 0) {
                    let value = this.form.jump_value.split(','),
                        names = this.form.jump_lower.split('>')
                    value.forEach((item, index) => {
                        this.groupValue.push(item + '|' + names[index])
                    })
                }
                this.linkType = this.form.jump_to
                this.showEdit = true
            },

            unForm () {
                this.form = {
                  icon_name: '',
                  icon_url: '',
                  jump_to: null,
                  jump_lower: '',
                  jump_value: '',
                  remarks: '',
                }
                this.groupValue = []
                this.linkType = null
                this.showEdit = false
            },

            async showAdShop (index, state) {
                let param = JSON.parse(JSON.stringify(this.tableData[index]))
                param.is_show = state
                await this.$request.request(this.$API.common_api, param, 'main', this.ad_type == 0 ? 'PUT' : 'DELETE', {
                    router_path: state ? PATH_LIST[this.ad_type]['down'] : PATH_LIST[this.ad_type]['up'],
                    request_host: 'CATEGORY_SERVER_HOST',
                    extra_url: this.ad_type == 0 ? `${param.ad_id}/` : `?ad=${param.ad_id}`
                })
                this.AdList()
            },

            submitData (formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        let param = this.form;
                        await this.$request.request(this.$API.common_api, param, 'main', this.form.id ? 'PUT' : 'POST', {
                            router_path: this.form.id ? PATH_LIST[this.ad_type]['one'] : PATH_LIST[this.ad_type]['all'],
                            request_host: 'CATEGORY_SERVER_HOST',
                            extra_url: this.form.id ? `?id=${this.form.id}` : '',
                            handle_desc: PATH_LIST[this.ad_type]['title'] + `${this.form.id ? '修改' : '添加'}运营广告位;${this.form.id ? this.form.id : ''}`
                        })
                        this.unForm()
                        this.AdList()
                    } else {
                    }
                })
            },




            selectTo (index) {
                if (this.form.jump_to != index) {
                    this.form.jump_lower = ''
                    this.form.jump_value = ''
                    this.groupValue = []
                }
                this.dialog.page = 1
                this.dialog.total = 0
                index == 1 && (this.dialogForm.goods_name = this.form.jump_lower)
                this.form.jump_to = index
            },

            /**
             * 专题列表
             */
            async special_list (search = false) {
                this.specialLoading = true
                search && (this.dialogForm.topic_name = this.form.jump_lower)
                let {data} = await this.$request.get(this.$API.common_api, {
                    page: this.dialog.page,
                    topic_name: this.dialogForm.topic_name,
                    page_size: this.special_size
                }, 'main', {
                    router_path: 'help/topic',
                    request_host: 'HELP_CATEGORY'
                })
                this.dialog.total = data.count
                this.specialData = data.result
                this.specialLoading = false
                this.showSpecial = true
            },

            uploaded (data) {
                this.form.icon_url = data.imageOssUrl
            },
            unFormInline () {
                this.page = 1
                this.size = 10
                this.formInline = {
                    ad_page: '',
                    ad_position: '',
                    ad_name: '',
                    is_show: ''
                }
                this.AdList()
            }
        },
        watch: {
            showEdit (res) {
                !res && this.unForm()
            },
            ad_type (res) {
                this.page = 1
                this.size = 10
                this.total = 0
                this.formInline = {
                    ad_page: '',
                    ad_position: '',
                    ad_name: '',
                    is_show: ''
                }
                this.AdList()
            },

            showGoods (res) {
                !res && (() => {
                    this.dialog = {
                        page: 1,
                        size: 5,
                        total: 0,
                    }
                    this.special_size = 10
                })()
            },

            showSpecial (res) {
                !res && (() => {
                    this.dialog = {
                        page: 1,
                        size: 5,
                        total: 0,
                    }
                    this.special_size = 10
                })()
            },

            groupValue (res) {
                let ids = [],
                    name = []
                res.forEach(item => {
                    let arr = item.split('|')
                    ids.push(arr[0])
                    name.push(arr[1])
                })
                this.form.jump_value = ids.join(',')
                this.form.jump_lower = name.join('>')
            }
        },
        components: {
            UploadImg, PreviewImage
        }
    }
</script>

<style scoped lang="less">
  @import "../../assets/pageHeader";

  .demo-form-inline {
    margin: 15px 0;
  }

  .table-content {
    width: calc(~"100% - 30px");
    margin: 15px;
  }

  .submit-cont {
    margin-top: 15px;
    padding-right: 20px;
    text-align: right;
  }
</style>
