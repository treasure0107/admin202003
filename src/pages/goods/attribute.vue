<template>
  <div class="content">
    <div class="pages-header">
      <div>商品属性</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">添加属性</el-button>
    </div>

    <div class="settled-in-search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="属性名称">
          <el-input v-model="formInline.attr_name" placeholder="属性名称"></el-input>
        </el-form-item>
        <el-form-item label="属性别名">
          <el-input v-model="formInline.attr_alias_name" placeholder="属性别名"></el-input>
        </el-form-item>
        <el-form-item label="属性类型">
          <el-select v-model="formInline.attr_type" placeholder="属性类型">
            <el-option label="全部" value=""></el-option>
            <el-option :label="item" :value="index" v-for="(item,index) in attr_type" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属分类">
          <el-select v-model="formInline.cat_id" placeholder="所属分类">
            <el-option :label="item" :value="item" v-for="(item,index) in typeList" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="-">
          <el-input v-model="formInline.cat_name" placeholder="分类名称"></el-input>
        </el-form-item>

        <el-form-item label="审核状态">
          <el-select v-model="formInline.attr_status" placeholder="审核状态">
            <el-option label="全部" value=""></el-option>
            <el-option :label="item" :value="index" v-for="(item,index) in statusList" :key="index"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="attr_list(false,true)">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="unFormInline">清空筛选条件</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-content">
      <el-table :data="tableData.data" stripe style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column fixed prop="attr_id" label="序号" width="80"></el-table-column>
        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
        <el-table-column prop="attr_alias_name" label="属性别名"></el-table-column>

        <el-table-column prop="remark" label="备注"></el-table-column>

        <el-table-column prop="attr_type" sortable label="属性类型">
          <template slot-scope="scope">
            {{attr_type[scope.row.attr_type]}}
          </template>
        </el-table-column>
        <el-table-column prop="attribute_state" label="使用状态" width="200">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <template v-if="scope.row.attribute_state==1">
                <el-button type="success" size="mini" plain>使用中</el-button>
                <el-button type="text" @click="getTypeList(scope.row.attr_id)">分类明细</el-button>
              </template>
              <el-button type="info" size="mini" v-else plain>未使用</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="add_user" sortable label="添加人" width="100">
        </el-table-column>
        <el-table-column prop="create_time" sortable label="添加时间" width="160"></el-table-column>

        <el-table-column prop="attr_status" label="状态" width="100">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-button type="success" size="mini" v-if="scope.row.attr_status==0" plain>启用</el-button>
              <el-button type="info" size="mini" v-else plain>停用</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle
                       @click="setOpenEdit(scope.row.attr_id)"></el-button>
            <el-button type="success" icon="el-icon-check" @click="showAdShop(scope.$index,0)" size="mini"
                       circle v-if="scope.row.attr_status"></el-button>
            <el-button type="warning" icon="el-icon-minus" size="mini" circle
                       @click="showAdShop(scope.$index,1)" v-else></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle
                       @click="deleteAttr(scope.row.attr_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="background: #ffffff;padding: 10px;text-align: right">
        <el-pagination background layout="total,prev, pager, next" :total="tableData.total" :page-size="size"
                       @current-change="handleCurrentChange"></el-pagination>
      </div>

    </div>
    <!--添加修改-->
    <el-dialog :title="(form.attr_id?'编辑':'添加')+'属性'" :visible.sync="showEdit"
               :fullscreen="this.$route.query.attr_id ? true : false"
               :show-close="this.$route.query.attr_id ? false : true"
               :close-on-press-escape="this.$route.query.attr_id ? false : true"
               width="80%" top="50px">
      <el-form ref="forms" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="属性名称" prop="attr_name">
          <el-input v-model="form.attr_name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="属性别名" prop="attr_alias_name">
          <el-input v-model="form.attr_alias_name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="属性类型" prop="attr_type">
          <el-select v-model="form.attr_type" placeholder="请选择属性类型">
            <el-option :label="type" :value="key" v-for="(type,key) in attr_type" :key="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="使用情况" v-if="form.attr_id">
          <el-button :type="form.attribute_state==1 ? 'success' : 'info'" size="mini" plain>
            {{form.attribute_state==1 ? '使用中' : '未使用'}}
          </el-button>
          <el-button type="text" @click="getTypeList(form.attr_id)" v-if="form.attribute_state==1">分类明细</el-button>
        </el-form-item>

        <el-form-item label="属性值">
          <el-button :type="form.attribute_state!=1 ? 'primary' : 'info'"
                     size="mini" plain @click="form.attribute_state!=1 ? showStandard = true : null">
            定义参数标准
          </el-button>
          <div class="attr-value-list">
            <el-table :data="attr_item" border style="width: 100%">
              <el-table-column fixed prop="attr_value_id" label="序号" width="80"></el-table-column>
              <el-table-column prop="attr_value" label="属性值" width="250">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.attr_value" maxlength="20"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="attr_value" label="属性图片(240*240像素)" width="180">
                <template slot-scope="scope">
                  <preview-image :image="scope.row.image" :width="'60px'"></preview-image>
                  <upload-img @uploaded="uploaded" :keystr="scope.$index" :maxsize="100 * 1024"
                              :buttonSize="'mini'"></upload-img>
                  <el-button style="margin-top: 5px" type="danger" size="mini" @click="scope.row.image=''"
                             v-if="scope.row.image">
                    删除<i class="el-icon-delete el-icon--right"></i>
                  </el-button>
                </template>
              </el-table-column>

              <el-table-column prop="attr_value" label="固定属性" width="90" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.fixed" true-label="1" false-label="0"
                               :checked="scope.row.fixed==1 || false"></el-checkbox>
                </template>
              </el-table-column>

              <el-table-column prop="attr_value" label="属性描述" width="250">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.desc" maxlength="100"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="param_key_value" label="参数" width="200">
                <template slot-scope="scope">
                  <el-button round size="mini" @click="addItemValues(scope.$index)" v-if="!scope.row.param_key_value">
                    设置参数值
                  </el-button>
                  <div v-else>
                    <div v-for="(values,index_x) in scope.row.param_key_value">
                      <span style="font-size: 13px;font-weight: bold;color: #409EFF">[{{itemValueKye(index_x)}}]:</span>
                      <span style="color: #333333;font-size: 13px;">{{values}}</span>
                    </div>
                    <div style="padding-top: 5px">
                      <el-tooltip class="item" effect="dark" content="修改" placement="top">
                        <el-button icon="el-icon-edit-outline" size="mini" circle
                                   @click="addItemValues(scope.$index,true)"></el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="清空" placement="top">
                        <el-button icon="el-icon-scissors" size="mini" circle
                                   @click="delItemValues(scope.$index)"></el-button>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="sort" label="排序值" width="70" align="center"></el-table-column>

              <el-table-column prop="operation" label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-top" @click="setAttrOrder(scope.$index,'top')" size="mini"
                             circle></el-button>
                  <el-button type="success" icon="el-icon-bottom" @click="setAttrOrder(scope.$index,'bottom')"
                             size="mini"
                             circle></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="delAttrItem(scope.$index)"
                             circle></el-button>
                </template>
              </el-table-column>
            </el-table>

            <div style="width: 100%;margin-top: 10px">
              <el-checkbox v-model="form.is_limit_seller">除设置的属性值之外，允许商家自定义</el-checkbox>
              <el-checkbox v-model="form.is_limit_user">允许买家自定义，需商家设定参数范围</el-checkbox>
            </div>
            <el-button size="medium" style="margin-top: 20px" @click="addAttr">添加属性值</el-button>
          </div>
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" rows="4" v-model="form.remark" maxlength="50"></el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitData()">提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--设置参数-->
    <el-dialog title="设置参数" :visible.sync="showSetValue" width="40%">
      <el-table :data="values" border style="width: 100%">
        <el-table-column fixed prop="name" label="参数" width="200">
          <template slot-scope="scope">
            {{scope.row.def ? scope.row.def.split('|c|')[1] : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="sy_name" label="系统参数">
          <template slot-scope="scope">
            {{scope.row.def ? scope.row.def.split('|c|')[2] : ''}}
          </template>
        </el-table-column>

        <el-table-column prop="sy_name" label="值类型">
          <template slot-scope="scope">
            {{scope.row.value_type_id>=0 ? value_type[scope.row.value_type_id] : ''}}
          </template>
        </el-table-column>

        <el-table-column prop="value" label="值" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" v-if="scope.row.value_type_id==0" maxlength="50" type="text"></el-input>
            <el-input v-model="scope.row.value" v-if="scope.row.value_type_id==4" type="text" disabled></el-input>
            <el-input-number v-model="scope.row.value" :step="2" step-strictly
                             v-else-if="scope.row.value_type_id==2" :max="999999999" :min="0"></el-input-number>
            <el-input-number v-model="scope.row.value" :step="4" :min="0" :max="999999999" step-strictly
                             v-else-if="scope.row.value_type_id==3"></el-input-number>
            <el-input v-model="scope.row.value" v-if="scope.row.value_type_id==1" @blur="checkInput(scope.$index)"
                      type="number" :min="0"></el-input>
          </template>
        </el-table-column>

      </el-table>
      <div style="margin-top: 20px;text-align: right">
        <el-button type="primary" @click="confirmValues()">确定</el-button>
        <el-button @click="showSetValue=false">取消</el-button>
      </div>
    </el-dialog>
    <!--设置参数-->

    <!--定义标准参数-->
    <el-dialog title="定义参数标准" :visible.sync="showStandard" width="60%" :close-on-click-modal="false"
               :show-close="false">
      <el-table :data="values" border style="width: 100%">
        <el-table-column fixed prop="def" label="参数">
          <template slot-scope="scope">
            <el-select :loading="methodLoading" placeholder="输入关键字搜索" v-model="scope.row.def" filterable remote
                       :remote-method="remoteMethod">
              <el-option :label="item.param_id+'|c|'+item.param_name+'|c|'+item.sys_param"
                         :value="item.param_id+'|c|'+item.param_name+'|c|'+item.sys_param"
                         v-for="(item,index) in sy_values" :key="index+'keys'">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="sys_param" label="系统参数">
          <template slot-scope="scope">
            {{scope.row.def ? scope.row.def.split('|c|')[2] : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="value_type_id" label="值类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.value_type_id" placeholder="请选择"
                       @change="(res)=>{changeValueType(res,scope.$index)}">
              <el-option :label="val" :value="index_v" v-for="(val,index_v) in value_type" :key="index_v"></el-option>
            </el-select>
            <el-input v-model="scope.row.value" maxlength="50" v-if="scope.row.value_type_id==4" type="text"
                      placeholder="请输入默认值"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delValues(scope.$index)"
                       circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button size="medium" style="margin-top: 20px" @click="addValues">添加参数</el-button>
      <div style="margin-top: 20px;text-align: right">
        <el-button type="primary" @click="confirmStandard">确定</el-button>
      </div>
    </el-dialog>
    <!--定义标准参数-->

    <!--分类明细-->
    <el-dialog title="分类明细" :visible.sync="showType" width="50%">
      <div>
        <div style="font-weight: bold;">平台分类：</div>
        <div v-for="(item,index) in pingtaiType" style="margin-top: 10px;font-size: 13px">
          <span style="font-weight: bold;margin-right: 10px;color: #409EFF">{{index+1}}.</span>{{item.category_name}}{{item.children
          ? ' > '+item.children.category_name : ''}}
          {{item.children && item.children.children ? ' > '+item.children.children.category_name : ''}}
        </div>

        <div style="font-weight: bold;margin-top: 20px">采购分类：</div>
        <div v-for="(item,index) in caigouType" style="margin-top: 10px;font-size: 13px">
          <span style="font-weight: bold;margin-right: 10px;color: #409EFF">{{index+1}}.</span>
          {{item.category_name}}{{item.children ? ' > '+item.children.category_name : ''}}
          {{item.children && item.children.children ? ' > '+item.children.children.category_name : ''}}
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
    import UploadImg from '@/components/UplodaImg'
    import PreviewImage from '@/components/PreviewImage'

    export default {
        data () {
            return {
                showEdit: false,
                showType: false,
                showSetValue: false,
                showStandard: false,
                methodLoading: false,
                loading: false,
                addValueIndex: null,
                form: {
                    attr_name: '',
                    is_limit_seller: 0,
                    is_limit_user: 0,
                    attr_type: '',
                    attr_alias_name: '',
                    remark: '',
                    attribute_state: 0
                },
                formInline: {
                    attr_alias_name: '',
                    attr_name: '',
                    attr_status: '',
                    attr_type: '',
                    cat_id: '平台分类',
                    cat_name: ''
                },
                statusList: ['启用', '停用'],
                typeList: ['平台分类', '采购分类'],
                page: 1,
                size: 5,
                id: 0,
                value_type: ['文本', '自然数', '2的倍数', '4的倍数', '固定值'],
                attr_type: ['名片类', '装订类', '海报类'],
                nowEditValueIndex: null,
                values: [],   //标注属性列表
                sy_values: [],    //系统属性列表
                attr_item: [],  //属性值列表
                tableData: [],
                userList: {},
                upValueType: {},
                upValues: [],
                pingtaiType: [],
                caigouType: [],
                rules: {
                    attr_name: [
                        {required: true, message: '属性名称必填', trigger: 'blur'}
                    ],
                    attr_alias_name: [
                        {required: true, message: '属性别名必填', trigger: 'blur'}
                    ],
                    attr_type: [
                        {required: true, message: '请选择属性类型', trigger: 'change'}
                    ]
                }
            }
        },
        created () {
            this.attr_list()
            if (this.$route.params.class_name) this.showEdit = true
            if (this.$route.query.attr_id) this.setOpenEdit(this.$route.query.attr_id)
        },
        methods: {
            async attr_list (id = 0, isPage = false) {
                isPage && (this.page = 1)
                this.loading = true
                let param = this.formInline
                param.page = this.page
                param.size = this.size
                param['shop_id'] = 0
                id && (param['id'] = id)
                let data = []
                if (this.formInline.cat_id === '采购分类') {
                    data = await this.$request.get(this.$API.common_api, param, 'main', {
                        router_path: 'purchase/get_attr_name_cat',
                        request_host: 'PURCHASE_TEM_HOST'
                    })
                } else {
                    data = await this.$request.get(this.$API.goods_attr, param)
                }

                data.data.forEach(async (item, index) => {
                    data.data[index]['add_user'] = await this.$common.getUserName(item.add_user_id, this)
                })
                this.tableData = data
                console.log(this.tableData)
                this.loading = false
            },

            getTypeList (id) {
                this.showType = true
                this.$request.get(this.$API.common_api, {attr_id: id}, 'main', {
                    router_path: 'goods/get_attr_link_cat',
                    request_host: 'GOODS_SERVER_HOST'
                }).then(res => {
                    this.pingtaiType = res.data
                })
                this.$request.get(this.$API.common_api, {attr_id: id}, 'main', {
                    router_path: 'purchase/get_attr_cat',
                    request_host: 'PURCHASE_TEM_HOST'
                }).then(res => {
                    this.caigouType = res.data
                })
            },

            uploaded (url, index) {
                this.$set(this.attr_item[index], 'image', url.imageOssUrl)
            },

            unFormInline () {
                this.formInline = {
                    attr_alias_name: '',
                    attr_name: '',
                    attr_status: '',
                    attr_type: ''
                }
                this.attr_list()
            },

            async getUserInfo (id) {
                let {data} = await this.$request.post(this.$API.get_member_name, {admin_id: id})
                return data.user_name
            },

            /**
             * 搜索标准参数
             */
            remoteMethod (name) {
                if (name) {
                    this.methodLoading = true
                    this.$request.get(this.$API.attr_param, {
                        page: this.form.page,
                        size: 100,
                        param_name: name
                    }).then((res) => {
                        let list = []
                        res.data.forEach((item, keys) => {
                            let key = item.param_id + '|c|' + item.param_name + '|c|' + item.sys_param
                            let index = _.findIndex(this.values, (o) => {
                                return o.def == key
                            })
                            index < 0 && list.push(item)
                        })
                        this.sy_values = list
                        this.methodLoading = false
                    })
                }
            },

            changeValueType (value, index) {
                this.upValueType[index] = value
            },

            checkInput (index) {
                if (this.values[index].value < 0) {
                    this.values[index].value = 0
                } else if (this.values[index].value > 999999999) {
                    this.values[index].value = 999999999
                }
            },

            /**
             * 确认修改标准参数
             */
            confirmStandard () {
                const checkValues = () => {
                    let state = true
                    for (let i = 0; i < this.values.length; i++) {
                        if (this.values[i].value_type_id == 4 && this.values[i].value == '') {
                            state = false
                            break
                        }
                    }
                    !state && SendMessage({message: '固定值不能为空', type: 'error'})
                    return state
                }
                if (!checkValues()) return false

                Object.keys(this.upValueType).forEach((key) => {
                    let find = this.values[key],
                        last = this.upValues[key]
                    if (find && last && find.value_type_id != last.value_type_id) {
                        this.attr_item.forEach((item, keys) => {
                            if (item.param_key_value[find.param_id]) {
                                this.$set(this.attr_item[keys].param_key_value, find.param_id, find.value_type_id == 4 ? find.value : '')
                            }
                        })
                        find.value_type_id != 4 && (this.values[key].value = '')
                    }
                })
                this.showStandard = false
            },

            /**
             * 删除标准参数
             * @param index
             */
            delValues (index) {
                this.attr_item.forEach((item, keys) => {
                    delete this.attr_item[keys].param_key_value[this.values[index].param_id]
                })
                this.values.splice(index, 1)
            },

            submitData () {

                const setParam = () => {
                    //attr
                    let param = {}
                    this.form.add_user_id = this.$common.getNowUserId()
                    param['attr'] = this.form
                    param['attr']['is_limit_seller'] = param['attr']['is_limit_seller'] ? 1 : 0
                    param['attr']['is_limit_user'] = param['attr']['is_limit_user'] ? 1 : 0
                    //标准规格
                    param['param_key_value'] = []
                    this.values.forEach(item => {
                        let arr = item['def'].split('|c|')
                        param['param_key_value'].push({
                            param_id: arr[0],
                            param_name: arr[1],
                            sys_param: arr[2],
                            value: item['value'],
                            value_type_id: item['value_type_id']
                        })
                    })
                    //参数列表
                    param['attr_value'] = this.attr_item
                    let _this = this,
                        state = true
                    param['attr_value'].forEach((item, index) => {
                        let param_define = ''

                        //判断是否填写完了
                        let length = Object.keys(item.param_key_value).length
                        if (!item.attr_value || length != param['param_key_value'].length) {
                            state = false
                            return false
                        }

                        _.mapKeys(item['param_key_value'], function (value, key) {
                            if (value == '') {
                                state = false
                                return false
                            }
                            param_define += ((!param_define ? '' : '|') + (_this.itemValueKye(key) + ':' + value))
                        })
                        param['attr_value'][index]['param_define'] = param_define
                    })
                    return !state ? state : param
                }

                this.$refs.forms.validate(async (valid) => {
                    if (valid) {
                        if (!this.attr_item.length) {
                            SendMessage({message: '请先设置属性', type: 'warning'})
                            return false
                        }
                        let param = setParam()
                        if (!param) {
                            SendMessage({message: '请先填写完整参数', type: 'warning'})
                            return false
                        }
                        if (param['attr']['attr_id']) {
                            await this.$request.request(this.$API.goods_attr, param, 'main', 'PUT')
                        } else {
                            await this.$request.post(this.$API.goods_attr, param)
                        }
                        this.unitData()
                        this.showEdit = false
                        this.attr_list()
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },

            deleteAttr (attr_id) {
                this.$confirm('你是否删除该属性？删除后不可恢复', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$request.request(this.$API.goods_attr, {attr_id: attr_id}, 'main', 'DELETE')
                    SendMessage({message: '删除成功', type: 'success'})
                    this.attr_list()
                }).catch(e => {

                })
                console.log(attr_id)
            },

            async showAdShop (index, status) {
                await this.$request.request(this.$API.goods_attr, {
                    attr: {
                        attr_id: this.tableData.data[index].attr_id,
                        attr_status: status,
                        add_user_id: this.$common.getNowUserId()
                    }
                }, 'main', 'PUT')
                SendMessage({message: status ? '禁用成功' : '启用成功', type: 'success'})
                this.attr_list()
            },

            unitData () {
                this.form = {
                    attr_name: '',
                    is_limit_seller: 0,
                    is_limit_user: 0,
                    attr_type: '',
                    attr_alias_name: '',
                    remark: ''
                }
                this.values = []
                this.attr_item = []
            },

            handleCurrentChange (event) {
                this.page = event
                this.attr_list()
            },

            setAttrOrder (index, desc) {
                const setSort = () => {
                    let end = null
                    if (desc === 'top') {
                        end = this.attr_item[index - 1] ? this.attr_item[index - 1] : null
                        if (end) {
                            this.attr_item[index - 1].sort += 1
                            this.attr_item[index].sort -= 1
                        }
                    } else {
                        end = this.attr_item[index + 1] ? this.attr_item[index + 1] : null
                        if (end) {
                            this.attr_item[index + 1].sort -= 1
                            this.attr_item[index].sort += 1
                        }
                    }
                    return end
                }
                setSort() && (res => {
                    this.attr_item = _.orderBy(this.attr_item, 'sort', 'asc')
                })()
            },

            addItemValues (index, is_edit = false) {
                const setEditInfo = () => {
                    let itemInfo = this.attr_item[index]['param_key_value']
                    this.values.forEach((item, key) => {
                        let arr = item.def.split('|c|')
                        itemInfo[arr[0]] && (this.values[key]['value'] = itemInfo[arr[0]])
                    })
                }

                is_edit && setEditInfo()

                this.showSetValue = true
                this.addValueIndex = index
            },

            delItemValues (index) {
                this.attr_item[index].param_key_value = ''
            },

            async setOpenEdit (id) {
                this.showEdit = true
                this.id = id
                let {data} = await this.$request.get(this.$API.goods_attr, {id: id})
                const setAttr = () => {
                    this.form.attr_name = data.attr.attr_name
                    this.form.attr_alias_name = data.attr.attr_alias_name
                    this.form.is_limit_seller = data.attr.is_limit_seller ? true : false
                    this.form.is_limit_user = data.attr.is_limit_user ? true : false
                    this.form.attr_type = data.attr.attr_type
                    this.form.attribute_state = data.attr.attribute_state
                    this.form.remark = data.attr.remark
                    this.form['attr_id'] = data.attr.attr_id
                }
                const setAttrItem = () => {
                    data.attr_value.forEach((item) => {
                        this.attr_item.push({
                            attr_value_id: item['attr_value_id'],
                            attr_value: item['attr_value'],
                            sort: item['sort'],
                            desc: item['desc'],
                            fixed: item['fixed'],
                            image: item['image'],
                            param_key_value: item['param_key_value'] ? JSON.parse(item['param_key_value']) : ''
                        })
                    })
                }

                const setValue = () => {
                    let param = data.attr.param_key_value ? JSON.parse(data.attr.param_key_value) : []
                    param.forEach((item) => {
                        this.values.push({
                            def: `${item['param_id']}|c|${item['param_name']}|c|${item['sys_param']}`,
                            param_id: item['param_id'],
                            param_name: item['param_name'],
                            sys_param: item['sys_param'],
                            value_type_id: item['value_type_id'],
                            value: item['value'] ? item['value'] : ''
                        })
                    })
                }
                setAttr()
                setAttrItem()
                setValue()
                if (data) this.$common.iframePostMessage({},'loading')
            },

            //确认添加参数
            confirmValues () {
                let items = {}
                let state = true
                this.values.forEach((item, index) => {
                    let arr = item.def.split('|c|')
                    if (arr.length < 3 || !item['value']) {
                        state = false
                        return false
                    }
                    items[arr[0]] = item['value']
                    console.log(item)
                    item['value_type_id'] != 4 && (this.values[index]['value'] = '')
                })
                if (state) {
                    this.attr_item[this.addValueIndex]['param_key_value'] = items
                    this.showSetValue = false
                } else {
                    SendMessage({
                        message: '设置格式错误',
                        type: 'warning'
                    })
                }
            },

            delAttrItem (index) {
                if (this.attr_item[index]['attr_value_id']) {
                    this.$confirm('你是否删除该属性值？删除后不可恢复', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        await this.$request.request(this.$API.goods_attr, {
                            attr_value_id: this.attr_item[index]['attr_value_id']
                        }, 'main', 'DELETE')
                        this.attr_item.splice(index, 1)
                    }).catch((e) => {
                    })
                } else {
                    this.attr_item.splice(index, 1)
                }
            },

            addValues () {
                this.sy_values = []
                this.values.push({
                    def: '',
                    param_id: '',
                    param_name: '',
                    sys_param: '',
                    value_type_id: 0,
                    value: ''
                })
            },

            addAttr () {
                if (this.attr_item.length >= 8) {
                    SendMessage({type: 'warning', message: '属性值最多不能超过8个'})
                    return false;
                }
                let end = this.attr_item[this.attr_item.length - 1]
                this.attr_item.push({
                    // attr_value_id: end ? end.attr_value_id + 1 : 1,
                    attr_value: '',
                    sort: end ? end.sort + 1 : 1,
                    param_key_value: '',
                    fixed: 0,
                    desc: '',
                    image: ''
                })
            },
            itemValueKye (id) {
                let name = ''
                this.values.forEach(item => {
                    let arr = item.def.split('|c|')
                    if (arr[0] == id) {
                        name = arr[1]
                        return false
                    }
                })
                return name
            }
        },

        filters: {},

        watch: {
            showStandard (res) {
                this.upValues = JSON.parse(JSON.stringify(this.values))
            },
            showEdit (res) {
                !res && this.unitData()
                this.$common.iframePostMessage({state:res})
            },
            showType (res) {
                if (!res) {
                    this.pingtaiType = []
                    this.caigouType = []
                }
            },
            showSetValue (res) {
                if (!res) {
                    this.values.forEach((item, index) => {
                        item['value_type_id'] != 4 && (this.values[index]['value'] = '')
                    })
                }
            },
        },
        components: {
            UploadImg,
            PreviewImage,
        }
    }
</script>

<style scoped lang="less">
  @import "../../assets/pageHeader";

  .content {
    width: 100%;
    border-radius: 5px;

    .table-content {
      margin: 15px;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

  .settled-in-search {
    width: calc(~"100% - 60px");
    padding: 15px;
    margin: 15px 15px 15px 15px;
    background: #ffffff;
    box-shadow: @contentBoxShadow;
    border-radius: @contentBorderRadius;

    .demo-form-inline {
      padding-top: 22px;
    }
  }
</style>