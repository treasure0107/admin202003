<template>
    <div class="content">
            <div class="pages-header" style="height: 70px;">
                <div>平台分类</div>
                <el-button round style="float: right;margin-top: 15px;margin-right: 40px;" type="primary" icon="el-icon-plus" size="medium" @click="add_class()">添加一级分类</el-button>
            </div>
            <el-container>
                <el-aside width="40%" class="el-aside">
                    <!--Tree区-->
                        <!--Tree区-->
                            <!--分类搜索区-->
                            <el-input class="tree-input"
                                      placeholder="输入关键字进行过滤"
                                      v-model="filterText"
                                      clearable
                                      suffix-icon="el-icon-search">
                            </el-input>
                            <el-tree
                                    ref="tree2"
                                    class="admin-tree"
                                    style="width: 100%"
                                    :data="data_list"
                                    v-loading="loading"
                                    element-loading-text="玩命加载中.."
                                    node-key="id"
                                    :default-expanded-keys=expanded_keys
                                    :props="defaultProps"
                                    :load="loadNode"
                                    :filter-node-method="filterNode"
                                    :render-content="renderContent">
                            </el-tree>
                </el-aside>
                <!--分类编辑区-->
                <el-main class="el-main" v-loading="loadings" element-loading-text="加载中..">
                    <el-form ref="form_edit" :model="form" label-width="110px" v-if="show_edit"  class="form-edit">
                        <el-form-item label="上级分类">
                            <el-input style="width: 220px;" v-model="form.parent_name" disabled placeholder="无" ></el-input>
                        </el-form-item>
                        <el-form-item label="分类名称" prop="class_name" :rules="[{ required: true, message: '分类名称不能为空'}]">
                            <el-input style="width: 220px;" v-model="form.class_name" placeholder="请输入" maxlength="30" show-word-limit></el-input>
                        </el-form-item>

                        <el-form-item label="基本属性" style="width: 100%">
                            <div class="attr-value-list" >
                                <el-row style="width: 91%">
                                        <el-select
                                                suffix-icon="el-icon-search"
                                                v-model="form.j_value"
                                                remote
                                                :disabled=is_disabled
                                                reserve-keyword
                                                placeholder="请输入别名关键词搜索"
                                                filterable
                                                :remote-method="remoteMethod_j"
                                                style="width: 220px;">
                                            <el-option
                                                    v-for="(item,index) in j_options"
                                                    :key="item.attr_id"
                                                    :label="item.attr_alias_name"
                                                    :value="index" v-if="checkData(item.attr_id,1)">
                                            </el-option>
                                        </el-select>
                                    <el-button @click="$router.push({name:'/goods/attribute',params:{class_name:form.class_name}})" size="small" type="primary" plain style="margin-left: 10px;"  icon="el-icon-share">新增属性</el-button>
                                </el-row>
                                <el-table :data="j_attr_item" border style="width: 100%">
                                    <el-table-column  prop="attr_value" label="ID" width="70">
                                        <template slot-scope="scope">
                                            <el-input  v-model="scope.row.attr_id" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  prop="attr_value" label="排序" width="70">
                                        <template slot-scope="scope">
                                            <el-input  :disabled=is_disabled v-model="scope.row.sort"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="attr_value" label="属性名称" style="min-width: 120px;">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.attr_name" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="param_key_value" label="属性别名" style="min-width: 120px;">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.attr_alias_name" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="basic_is_null" label="是否必填">
                                        <template slot-scope="scope">
                                                <el-radio v-model="scope.row.is_must" :disabled=is_disabled label="1">是</el-radio>
                                                <el-radio v-model="scope.row.is_must" :disabled=is_disabled label="0">否</el-radio>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="operation" label="操作" width="100">
                                        <template slot-scope="scope">

                                            <!--el-button type="primary" icon="el-icon-edit" circle size="mini" :disabled=is_disabled @click="$router.push({name:'/goods/attribute',query:{attr_id:scope.row.attr_id}})"></el-button>-->
                                            <el-button type="primary" icon="el-icon-edit" circle size="mini"  :disabled=is_disabled @click="openWindow(scope.row.attr_id)"></el-button>
                                            <el-button type="danger" circle :disabled=is_disabled size="mini " @click="delAttrItem(scope.$index,'j')" icon="el-icon-delete"></el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-form-item>
                        <open-window ref="openwindow" @closeOpenWindow="closeOpenWindow"></open-window>
                        <el-form-item label="规格属性" style="width: 100%">
                            <div class="attr-value-list">
                                <el-row style="width: 91%">
                                        <el-select
                                                v-model="form.g_value"
                                                filterable
                                                remote
                                                :disabled=is_disabled
                                                reserve-keyword
                                                placeholder="请输入别名关键词搜索"
                                                :remote-method="remoteMethod_g"
                                                style="width: 220px;">
                                            <el-option
                                                    v-for="(item,index) in g_options"
                                                    :key="item.attr_id"
                                                    :label="item.attr_alias_name"
                                                    :value="index" v-if="checkData(item.attr_id,2)">
                                            </el-option>
                                        </el-select>
                                        <el-button @click="$router.push({name:'/goods/attribute',params:{class_name:form.class_name}})" size="small" type="primary" plain style="margin-left: 10px;"  icon="el-icon-share">新增属性</el-button>
                                </el-row>
                                <el-table :data="g_attr_item" border style="width: 100%">
                                    <el-table-column  prop="attr_value" label="ID" width="70">
                                        <template slot-scope="scope">
                                            <el-input  v-model="scope.row.attr_id" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  prop="attr_value" label="排序" width="70">
                                        <template slot-scope="scope">
                                            <el-input  :disabled=is_disabled v-model="scope.row.sort"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="attr_value" label="属性名称" style="min-width: 120px;">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.attr_name" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="param_key_value" label="属性别名" style="min-width: 120px;">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.attr_alias_name" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="standard_is_null" label="是否必填">
                                        <template slot-scope="scope">
                                                <el-radio :disabled=is_disabled v-model="scope.row.is_must" label="1">是</el-radio>
                                                <el-radio :disabled=is_disabled v-model="scope.row.is_must" label="0">否</el-radio>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="operation" label="操作" width="100">
                                        <template slot-scope="scope">
                                            <el-button type="primary" icon="el-icon-edit" circle size="mini" :disabled=is_disabled @click="openWindow(scope.row.attr_id)"></el-button>
                                            <el-button type="danger" circle size="mini" :disabled=is_disabled @click="delAttrItem(scope.$index,'g')" icon="el-icon-delete"></el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-form-item>
                        <el-form-item label="类型" prop="valid_id" :rules="{required: true, message: '请选择类型', trigger: 'blur'}">
                            <el-select v-model="form.valid_id" @change="setQuestionData" placeholder="请选择">
                                <el-option
                                        v-for="item in type_options"
                                        :key="item.id"
                                        :label="item.unit"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button circle  size="mini"  @click="showParammsg" icon="el-icon-question"></el-button>

                        </el-form-item>
                        <el-form-item label="单位" class="form-textarea" prop="unit" :rules="{required: true, message: '请选择单位', trigger: 'blur'}">
                            <el-select v-model="form.unit" placeholder="请选择">
                                <el-option
                                        v-for="item in units_options"
                                        :key="item.id"
                                        :label="item.unit"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="微创印模板地址" prop="wcy_url">
                            <el-input :disabled=is_disabled maxlength="1024" show-word-limit v-model="form.wcy_url" style="width: 95%;" placeholder="例如：https://www.tubangzhu.com/"></el-input>
                        </el-form-item>
                        <el-form-item label="微创印模板ID" prop="wcy_url">
                            <el-input :disabled=is_disabled maxlength="10" show-word-limit v-model="form.pid" style="width: 95%;" placeholder="请输入正确数字模板ID"></el-input>
                        </el-form-item>
                        <el-form-item label="点传印模板名" prop="wcy_url">
                            <el-select v-model="form.dian_id" placeholder="请选择">
                                <el-option
                                        v-for="item in dian_options"
                                        :key="item.jdf_temp_id"
                                        :label="item.jdf_temp_name"
                                        :value="item.jdf_temp_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注" class="form-textarea" prop="desc">
                            <el-input :disabled=is_disabled maxlength="100" show-word-limit type="textarea" :autosize="{ minRows: 4}" v-model="form.desc" style="width: 95%"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-checkbox v-model="form.update_msg">提醒商家修改此分类下的商品</el-checkbox>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-if="form.update_msg" @click="open(form)">立即提交</el-button>
                            <el-button type="primary" v-else @click="onsubmit(form)">立即提交</el-button>
                            <el-button @click="show_edit=false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-main>
            </el-container>
        <!--提示参数-->
        <el-dialog title="必填参数" :visible.sync="unit_class" top="50px" width="60%">
            <el-table :data="questionData">
                <el-table-column width="150" property="param" label="参数"></el-table-column>
                <el-table-column width="150" property="type" label="类型"></el-table-column>
                <el-table-column  property="detail" label="描述"></el-table-column>
            </el-table>
        </el-dialog>
        <!--添加次级分类-->
        <el-dialog title="添加分类" :visible.sync="edit_class" top="100px" width="40%">
            <el-form ref="form_other" :model="form" label-width="120px">
                <el-form-item label="父级ID"
                              prop="parent_id">
                    <el-input v-model="form.parent_id" style="width: 70%;" disabled></el-input>
                </el-form-item>
                <el-form-item label="父级分类"
                              prop="parent_name">
                    <el-input v-model="form.parent_name" style="width: 70%;" disabled=""></el-input>
                </el-form-item>
                <el-form-item label="新建分类名称"
                              prop="class_name" :rules="[{ required: true, message: '分类名称不能为空'}]">
                    <el-input v-model="form.class_name" style="width: 70%;" maxlength="30" show-word-limit></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onsubmit_form(form,1)" style="margin-top: 20px">立即提交</el-button>
                    <el-button @click="edit_class=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--添加一级分类-->
        <el-dialog title="添加一级分类" :visible.sync="edit_one_class" top="100px" width="40%">
            <el-form ref="form_one" :model="form" label-width="120px">
                <el-form-item label="一级分类名称" prop="class_name" :rules="{ required: true, message: '分类名称不能为空'}">
                    <el-input v-model="form.class_name" style="width: 70%;"  maxlength="30" show-word-limit></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onsubmit_form(form,0)">立即提交</el-button>
                    <el-button @click="edit_one_class=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    let id = 1000;
    import OpenWindow from '../../components/OpenWindow.vue'
    export default {
        data() {
            return {
                edit_class: false,
                add_info:false,
                edit_one_class:false,
                data:[],
                editData:[],
                editNote:[],
                show_edit:false,
                loading: false,
                loadings: false,
                is_edit: false,
                unit_class: false,
                expanded_keys: [],
                template_id: '',
                filterText: '',
                num1:1,
                is_end:'',
                is_disabled:false,
                dian_options:[],
                form: {
                    parent_id: '',
                    class_name: '',
                    class_id: '',
                    dian_id:'',
                    parent_name:'',
                    j_value:'',
                    g_value:'',
                    is_must: '',
                    desc: '',
                    wcy_url: '',
                    pid:'',
                    valid_id:'',
                    unit:'',
                    update_msg:false
                },
                j_attr_item:[],
                g_attr_item:[],
                units_options:[],
                type_options:[
                    {"id": 1, "unit": "单面单张类产品"},
                    {"id": 2, "unit": "双面单张类产品"},
                    {"id": 3, "unit": "自带封面书本画册类产品"},
                    {"id": 4, "unit": "独立封面书本画册类产品"},
                    {"id": 5, "unit": "非传统印刷产品"},
                ],
                questionData:[],
                dataTable1:[
                    {
                        param: 'width',
                        type: '自然数',
                        detail: '成品的宽度，单位mm'
                    },{
                        param: 'height',
                        type: '自然数',
                        detail: '成品的高度，单位mm'
                    },{
                        param: 'weight',
                        type: '自然数',
                        detail: '材质规格'
                    }, {
                        param: 'mediaType',
                        type: '文本',
                        detail: '材质类型，如“铜版纸”或“哑粉纸”，缺省：其他'
                    }, {
                        param: 'numberOfPages',
                        type: '自然数',
                        detail: '页数，缺省值：1'
                    }, {
                        param: 'frontColor',
                        type: '文本',
                        detail: '正面颜色，缺省值：CMYK'
                    }, {
                        param: 'backColor',
                        type: '文本',
                        detail: '背面颜色，缺省值：NONE'
                    }, {
                        param: 'bleed',
                        type: '自然数',
                        detail: '出血位，单位mm，缺省值：3'
                    },{
                        param: 'quantity',
                        type: '自然数',
                        detail: '单位数量，缺省：1'
                    }
                ],
                dataTable2:[
                    {
                        param: 'width',
                        type: '自然数',
                        detail: '成品的宽度，单位mm'
                    }, {
                        param: 'height',
                        type: '自然数',
                        detail: '成品的高度，单位mm'
                    },{
                        param: 'weight',
                        type: '自然数',
                        detail: '材质规格'
                    }, {
                        param: 'mediaType',
                        type: '文本',
                        detail: '材质类型，如“铜版纸”或“哑粉纸”，缺省：其他'
                    }, {
                        param: 'numberOfPages',
                        type: '2的倍数',
                        detail: '页数，缺省值：2'
                    }, {
                        param: 'frontColor',
                        type: '文本',
                        detail: '正面颜色，缺省值：CMYK'
                    }, {
                        param: 'backColor',
                        type: '文本',
                        detail: '背面颜色，缺省值：NONE'
                    }, {
                        param: 'bleed',
                        type: '自然数',
                        detail: '出血位，单位mm，缺省值：3'
                    },{
                        param: 'quantity',
                        type: '自然数',
                        detail: '单位数量，缺省：1'
                    }
                ],
                dataTable3:[
                    {
                        param: 'width',
                        type: '自然数',
                        detail: '成品的宽度，单位mm'
                    }, {
                        param: 'height',
                        type: '自然数',
                        detail: '成品的高度，单位mm'
                    },{
                        param: 'weight',
                        type: '自然数',
                        detail: '材质规格'
                    }, {
                        param: 'mediaType',
                        type: '文本',
                        detail: '材质类型，如“铜版纸”或“哑粉纸”，缺省：其他'
                    }, {
                        param: 'numberOfBodyPages',
                        type: '4的倍数',
                        detail: '内文页数，缺省值：4'
                    }, {
                        param: 'numberOfPages',
                        type: '4的倍数',
                        detail: '总页数，默认取numberOfBodyPages的值'
                    }, {
                        param: 'bodyColor',
                        type: '文本',
                        detail: '内文颜色，缺省值：CMYK'
                    }, {
                        param: 'bleed',
                        type: '自然数',
                        detail: '出血位，单位mm，缺省值：3'
                    }, {
                        param: 'side',
                        type: '文本',
                        detail: '装订位置，缺省值：LEFT'
                    }, {
                        param: 'type',
                        type: '文本',
                        detail: '装订方式，缺省值：SIDESTITCH'
                    }, {
                        param: 'quantity',
                        type: '自然数',
                        detail: '单位数量，缺省：1'
                    }
                ],
                dataTable4:[
                    {
                        param: 'width',
                        type: '自然数',
                        detail: '成品的宽度，单位mm'
                    }, {
                        param: 'height',
                        type: '自然数',
                        detail: '成品的高度，单位mm'
                    },{
                        param: 'weight',
                        type: '自然数',
                        detail: '材质规格'
                    }, {
                        param: 'mediaType',
                        type: '文本',
                        detail: '材质类型，如“铜版纸”或“哑粉纸”，缺省：其他'
                    }, {
                        param: 'coverMedia.mediaType',
                        type: '文本',
                        detail: '封面材质类型，如“铜版纸”或“哑粉纸”，缺省：其他'
                    }, {
                        param: 'coverMedia.weight',
                        type: '自然数',
                        detail: '封面材质规格，缺省值：99'
                    }, {
                        param: 'numberOfBodyPages',
                        type: '4的倍数',
                        detail: '内文页数，缺省值：4'
                    }, {
                        param: 'numberOfCoverPages',
                        type: '4的倍数',
                        detail: '内文页数，缺省值：4'
                    }, {
                        param: 'numberOfPages',
                        type: '4的倍数',
                        detail: '总页数，默认取numberOfCoverPages与numberOfBodyPages之和'
                    }, {
                        param: 'bodyColor',
                        type: '文本',
                        detail: '内文颜色，缺省值：CMYK'
                    }, {
                        param: 'coverOuterColor',
                        type: '文本',
                        detail: '封面正面颜色，缺省值：CMYK'
                    }, {
                        param: 'coverInnerColor',
                        type: '文本',
                        detail: '封面里面颜色，缺省值：CMYK'
                    }, {
                        param: 'bleed',
                        type: '自然数',
                        detail: '出血位，单位mm，缺省值：3'
                    }, {
                        param: 'side',
                        type: '文本',
                        detail: '装订位置，缺省值：LEFT'
                    }, {
                        param: 'type',
                        type: '文本',
                        detail: '装订方式，缺省值：SIDESTITCH'
                    }, {
                        param: 'quantity',
                        type: '自然数',
                        detail: '单位数量，缺省：1'
                    }
                ],
                template_value:[],
                j_options: [],
                g_options: [],
                data_list: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }

        },
        created () {
            this.loading = true;
            this.class_list();
            this.unitsOptions();
            this.getJdfTemp();
        },
        methods: {
            async class_list(){
                let result = await this.$request.request(this.$API.common_api, {
                    category_device: 0,
                    category_type: 0,
                    category_k:1
                }, 'main', 'GET', {
                    router_path: 'goods/goods_category',
                    request_host:'GOODS_CATEGORY',
                    handle_desc:"平台分类列表;"
                });
                await this.$common.wait(200);
                this.loading =false;
                if (result.code === 400){
                    SendMessage({message: '获取分类信息失败', type: 'warning'});
                }
                this.data_list = result.data
            },
            append(data) {
                this.onclearForm();
                this.data=data;
                this.edit_class = true;
                this.show_edit = false;
                this.loadings =false;
                this.form.class_name = '';
                this.form.parent_id = data.id;
                this.form.parent_name = data.label;
            },
            openWindow(id){
                this.$refs.openwindow.setShow({
                    url:'/goods/attribute?attr_id='+id,
                    title:'编辑属性',
                    number:2,
                    loading:true
                })
            },
            closeOpenWindow(param){
                this.edits(this.editData,this.editNote);
            },
            async sort(data,type){
               let result = await this.$request.request(this.$API.common_api, {
                    category_device: 0,
                    category_type: 0,
                    category_id:data.id,
                    parent_id:data.parent_id,
                    move:type
                }, 'main', 'PUT', {
                    router_path: 'goods_category/category_move',
                    request_host:'GOODS_CATEGORY',
                    handle_desc:"平台分类排序;"
                });
                if (result.code === 200){
                    if (data.parent_id > 0) this.expanded_keys = [data.id];
                    this.class_list();
                    SendMessage({message: '操作成功', type: 'success'});
                }else{
                    SendMessage({message: '操作失败', type: 'error'});
                }
            },
            async remoteMethod_j(val){
                let result = await this.$request.request(this.$API.common_api, {
                    attr_alias_name: val,
                    attr_status:0,
                    shop_id:0,
                }, 'main', 'GET', {
                    router_path: 'operationattr/search',
                    request_host:'EDIT_CATEGORY_HOST',
                    handle_desc:"平台分类下拉属性搜索;属性名称;"+val
                });
                this.form.j_value='';
                this.j_options = result.data;
            },
            async remoteMethod_g(val){
                let result = await this.$request.request(this.$API.common_api, {
                    attr_alias_name: val,
                    attr_status:0,
                    shop_id:0,
                }, 'main', 'GET', {
                    router_path: 'operationattr/search',
                    request_host:'EDIT_CATEGORY_HOST',
                });
                this.form.g_value='';
                this.g_options = result.data;
            },
            async onsubmit_form(form,type){
                let form_name = type === 0 ? this.$refs.form_one : this.$refs.form_other;
                form_name.validate(async (valid) => {
                    if (valid) {
                        let param = {};
                        param['category_device'] = 0;
                        param['category_name'] = form.class_name;
                        param['category_type'] = 0;
                        param['parent_id'] = type === 0 ? 0 : form.parent_id;
                        let result = await this.$request.request(this.$API.common_api, param, 'main', 'POST', {
                            router_path: 'goods/goods_category',
                            request_host:'GOODS_CATEGORY',
                            handle_desc: '添加平台分类信息,父级ID：'+this.form.parent_id
                        });
                        if (result.code === 400){
                            SendMessage({message: '添加失败', type: 'warning'});
                        }else{
                            SendMessage({message: '添加成功', type: 'success'});
                        }
                        this.expanded_keys = [form.parent_id];
                        this.class_list();
                        this.data=[];
                        this.form.class_name='';
                        this.edit_class = false;
                        this.edit_one_class = false;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            checkData(id,type){
                let index = _.findIndex(type==1 ? this.g_attr_item : this.j_attr_item,(o)=>{
                    return o.attr_id == id
                });
                return index>=0 ? false : true
            },
            async setQuestionData(val){
                if (val === 1) this.questionData = this.dataTable1;
                if (val === 2) this.questionData = this.dataTable2;
                if (val === 3) this.questionData = this.dataTable3;
                if (val === 4) this.questionData = this.dataTable4;
            },
            open(data) {
                this.$confirm('此操作将更新此分类下所有商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.onsubmit(data)
                }).catch(() => {

                });
            },
            async onsubmit(data){
                if (!this.form.class_id || !this.form.class_name){
                    SendMessage({message: '请输入分类名称', type: 'warning'});
                    return false;
                }
                let submit_data ={
                    template:{},
                    category:{},
                    template_value:{}
                };
                if(this.is_end == 0 ){
                    submit_data['category']['cat_id']=this.form.class_id;
                    submit_data['category']['category_name']=this.form.class_name;
                }else{
                    if (this.j_attr_item.length < 1){
                        SendMessage({message: '请添加基本属性', type: 'warning'});
                        return false;
                    }
                    if (this.g_attr_item.length < 1){
                        SendMessage({message: '请添加规格属性', type: 'warning'});
                        return false;
                    }
                    let reg = /((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
                    if (!this.form.wcy_url.match(reg) && this.form.wcy_url){
                        SendMessage({message: '请输入正确格式的模板地址', type: 'warning'});
                        return false;
                    }
                    let regs = /^[0-9]+[0-9]*]*$/;
                    if (!this.form.pid.match(regs) && this.form.pid){
                        SendMessage({message: '请输入正确数字模板ID', type: 'warning'});
                        return false;
                    }
                    if (!this.form.valid_id){
                        SendMessage({message: '请选择类型', type: 'warning'});
                        return false;
                    }
                    if (!this.form.unit){
                        SendMessage({message: '请选择单位', type: 'warning'});
                        return false;
                    }
                    this.dian_options.forEach((item,key)=>{
                        if (item.jdf_temp_id == this.form.dian_id)  submit_data['template']['jdf_temp_name']=item.jdf_temp_name;
                    });
                    submit_data['category']['cat_id']=this.form.class_id;
                    submit_data['category']['category_name']=this.form.class_name;
                    submit_data['template']['cat_id']=this.form.class_id;
                    submit_data['template']['category_name']=this.form.class_name;
                    submit_data['template']['ramark']=this.form.desc;
                    submit_data['template']['wcy_url']=this.form.wcy_url;
                    submit_data['template']['jdf_temp_id']=this.form.dian_id;
                    submit_data['template']['pid']=this.form.pid;
                    submit_data['template']['valid_id']=this.form.valid_id;
                    submit_data['template']['unit']=this.form.unit;
                    submit_data['template']['update_msg']=this.form.update_msg ? 1 : 0;
                    submit_data['template_value']= this.j_attr_item.concat(this.g_attr_item);
                    if (this.is_edit)  submit_data['template']['template_id']=this.template_id;
                }
                console.log(submit_data);
                let request_type = this.is_edit ? 'PUT' : 'POST';
                let result = await this.$request.request(this.$API.common_api, submit_data, 'main', request_type, {
                    router_path: 'server_goods/operationtemplate',
                    request_host:'EDIT_CATEGORY_HOST',
                    handle_desc: '保存平台分类信息,分类ID;'+this.form.class_id
                });
                if(result.code === 200){
                    this.show_edit = false;
                    this.form.update_msg = false;
                    this.j_attr_item = [];
                    this.g_attr_item = [];
                    this.class_list();
                    this.expanded_keys = [this.form.class_id];
                    SendMessage({message: '提交成功', type: 'success'});
                }else{
                    SendMessage({message: '提交失败', type: 'error'});
                }
            },
            addAttr_j (data,index) {
                /*this.j_options.splice(index,1);
                this.g_options = this.j_options;*/
                /*this.j_options = [];
                this.g_options = [];*/
                let res = false;
                if (this.j_attr_item.length > 0 || this.g_attr_item.length > 0){
                    this.j_attr_item.forEach((item,index)=>{
                        if (item['attr_id'] === data['attr_id']){
                            SendMessage({message: '属性信息已存在', type: 'warning'});
                            res = true;
                        }
                    });
                    this.g_attr_item.forEach((item,index)=>{
                        if (item['attr_id'] === data['attr_id']){
                            SendMessage({message: '属性信息已存在', type: 'warning'});
                            res = true;
                        }
                    });
                }
                if (!res && data){
                    let end = this.j_attr_item[this.j_attr_item.length - 1];
                    let arr = {
                        attr_alias_name: data.attr_alias_name,
                        sort: end ? end.sort + 1 : 1,
                        attr_name: data.attr_name,
                        is_must:data.is_must ? data.is_must : '1',
                        attr_id:data.attr_id,
                        type_id:0,
                    };
                    this.j_attr_item.push(arr);
                }
            },
            addAttr_g (data,index) {
                /*this.g_options.splice(index,1);
                this.j_options = this.g_options;*/
                /*this.j_options = [];
                this.g_options = [];*/
                let res = false;
                if (this.j_attr_item.length > 0 || this.g_attr_item.length > 0){
                    this.j_attr_item.forEach((item,index)=>{
                        if (item['attr_id'] === data['attr_id']){
                            SendMessage({message: '属性信息已存在', type: 'warning'});
                            res = true;
                        }
                    });
                    this.g_attr_item.forEach((item,index)=>{
                        if (item['attr_id'] === data['attr_id']){
                            SendMessage({message: '属性信息已存在', type: 'warning'});
                            res = true;
                        }
                    });
                }
                if (!res){
                    let end = this.g_attr_item[this.g_attr_item.length - 1];
                    let arr = {
                        attr_alias_name: data.attr_alias_name,
                        sort: end ? end.sort + 1 : 1,
                        attr_name: data.attr_name,
                        is_must:data.is_must ? data.is_must : '1',
                        attr_id:data.attr_id,
                        type_id:1,
                    };
                    this.g_attr_item.push(arr);
                }
            },
            delAttrItem (index,type) {
                if (type === 'j'){
                    if (this.j_attr_item[index]) {
                        this.$confirm('你是否删除该属性值？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(async () => {
                           this.j_attr_item.splice(index, 1);
                           this.form.j_value='';
                        }).catch((e) => {
                        })
                    }
                }else {
                    if (this.g_attr_item[index]) {
                        this.$confirm('你是否删除该属性值？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(async () => {
                           this.g_attr_item.splice(index, 1);
                            this.form.j_value='';
                        }).catch((e) => {
                        })
                    }
                }
            },
            async add_class(){
                this.loadings =false;
                this.form.class_name = '';
                this.edit_one_class = true;
                this.show_edit = false;
            },
            async edits(data,note){
                this.editData = data;
                this.editNote = note;
                this.form.update_msg = false;
                this.loadings = true;
                this.j_attr_item = [];
                this.g_attr_item = [];
                this.form.j_value = '';
                this.form.g_value = '';
                this.is_end = data.is_end;
                if (data.is_end == 0)this.is_disabled = true;
                if (data.is_end == 1)this.is_disabled = false;
                let j_search = await this.$request.request(this.$API.common_api, {
                    attr_alias_name: '',
                    attr_status:0,
                    shop_id:0
                }, 'main', 'GET', {
                    router_path: 'operationattr/search',
                    request_host:'EDIT_CATEGORY_HOST',
                });
                this.j_options = j_search.data;
                this.g_options = j_search.data;
                this.loadings = false;
                let attrs = await this.$request.request(this.$API.common_api, {
                    cat_id:data.id,
                }, 'main', 'GET', {
                    router_path: 'server_goods/operationtemplate',
                    request_host:'EDIT_CATEGORY_HOST',
                    handle_desc:"平台分类属性模板;"+data.id
                });
                if (attrs.code === 200 && JSON.stringify(attrs.data) !== '{}'){
                    this.form.wcy_url = attrs.data.wcy_url ? attrs.data.wcy_url : '';
                    this.form.pid = attrs.data.pid ? attrs.data.pid : '';
                    this.form.unit = attrs.data.unit ? attrs.data.unit : '';
                    this.form.valid_id = attrs.data.valid_id ? attrs.data.valid_id : '';
                    this.form.desc = attrs.data.ramark;
                    this.template_id = attrs.data.template_id;
                    this.form.dian_id = attrs.data.jdf_temp_id;
                    let attr = attrs.data.value_list;
                    if (attr.length > 0){
                        this.is_edit = true;
                    }
                    for (let i = 0; i < attr.length; i++){
                        if (attr[i]['type_id'] === 0) this.j_attr_item.push(attr[i]);
                        if (attr[i]['type_id'] === 1) this.g_attr_item.push(attr[i]);
                    }
                    if (attrs.data.valid_id > 0) this.setQuestionData(attrs.data.valid_id);
                }else{
                    this.is_edit = false;
                }
                this.show_edit = true;
                /*if (this.form.class_name) {
                    this.onclearForm();
                }*/
                this.form.class_name = data.label.match(/\((.+?)\)/g)[0] ? data.label.replace(data.label.match(/\((.+?)\)/g)[0],'') : data.label;
                this.form.class_id = data.id;
                this.form.parent_name = note.parent.data.label;
            },
            async hiden (data ,type){
                this.loadings =false;
                this.onclearForm();
                this.show_edit = false;
                if(!data.id){
                    SendMessage({message: '参数错误', type: 'warning'});
                    return false;
                }
                let msg = type === 1 ? '是否屏蔽此分类信息？' : '是否开启此分类信息？';
                let param = {};
                param['category_id'] = data.id;
                param['category_type'] = 0;
                param['category_device'] = 0;
                param['select'] = type;
                this.$confirm(msg, '确认信息', {
                    distinguishCancelAndClose: false,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(async () => {
                    let result = await this.$request.request(this.$API.common_api, param, 'main', 'PUT', {
                        router_path: 'goods_category/category_shield',
                        request_host:'GOODS_CATEGORY',
                        handle_desc:"屏蔽平台分类;"+data.id
                    });
                    let type_message = result.code === 200 ? 'success' : 'error';
                    if(result.code === 200){
                        let message = type === 1 ? '屏蔽成功' : '开启成功';
                        SendMessage({message: message, type: type_message});
                    }
                    this.expanded_keys = [data.id];
                    this.class_list();
                });
            },
            remove(node, data) {
                this.loadings =false;
                this.onclearForm();
                this.show_edit = false;
                if(!data.id){
                    SendMessage({message: '参数错误', type: 'warning'});
                    return false;
                }
                this.$confirm('是否删除此分类信息？', '确认信息', {
                    distinguishCancelAndClose: false,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(async () => {
                    let result = await this.$request.request(this.$API.common_api, {}, 'main', 'DELETE', {
                        router_path: 'goods/goods_category',
                        request_host:'GOODS_CATEGORY',
                        extra_url: `${data.id}/`,
                        handle_desc:"删除平台分类;"+data.id
                    });
                    let type_message = result.code === 200 ? 'success' : 'error';
                    SendMessage({message:'成功', type: type_message});
                    if(type_message === 'success'){
                        this.expanded_keys = [data.parent_id];
                        const parent = node.parent;
                        const children = parent.data.children || parent.data;
                        const index = children.findIndex(d => d.id === data.id);
                        children.splice(index, 1);
                    }
                });
            },
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([{name: 'region1'}, {name: 'region2'}]);
                }
                if (node.level > 3) return resolve([]);

                var hasChild;
                if (node.data.name === 'region1') {
                    hasChild = true;
                } else if (node.data.name === 'region2') {
                    hasChild = false;
                } else {
                    hasChild = Math.random() > 0.5;
                }

            },
            onclearForm(){
                this.form.class_name = '';
                this.form.parent_name = '';
                this.g_attr_item = [];
                this.j_attr_item = [];
                this.form.desc = '';

            },
            filterNode (value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            async unitsOptions(){
                this.units_options = await this.$common.getClassnuit(this);
            },
            async getJdfTemp(){
                let result = await this.$request.request(this.$API.common_api, {}, 'main', 'GET', {
                    router_path: 'sf/jdf_temp',
                    request_host:'SERVER_THIRDPARTY',
                    handle_desc:"获取JDF模板;"
                });
                if (result.data) this.dian_options = result.data;
                console.log(this.dian_options);
            },
            async showParammsg(){
                if (this.form.valid_id > 0 && this.form.valid_id < 5) this.unit_class = true;
            },
            renderContent(h, { node, data, store }) {
                if (data.status === 0){
                    return (
                        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 18px;">
                        <span>
                        <span>{node.label}</span>
                        </span>
                        <span>
                        <el-button icon="el-icon-top" circle  plain style="font-size: 8px;"  type="warning" size="mini"  on-click={ () => this.sort(data,1) }></el-button>
                        <el-button icon="el-icon-bottom"  circle plain style="font-size: 8px;"  type="warning" size="mini"  on-click={ () => this.sort(data,0) }></el-button>
                        {
                            node.level === 3 ?
                            '' :
                            <el-button icon="el-icon-plus" plain  circle  style="font-size: 8px;"  type="success" size="mini"  on-click={ () => this.append(data) }></el-button>
                        }
                        <el-button icon="el-icon-edit" plain  circle  style="font-size: 8px;"  type="primary" size="mini"  on-click={ () => this.edits(data,node) }></el-button>
                        <el-button icon="el-icon-remove-outline" plain  circle  type="info" style="font-size: 10px;"  size="mini"  on-click={ () => this.hiden(data,1) }></el-button>
                        <el-button icon="el-icon-delete" plain  circle  style="font-size: 8px;" type="danger" size="mini"  on-click={ () => this.remove(node, data) }></el-button>
                        </span>
                        </span>
                    );
                }else {
                    return (
                        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 18px;">
                        <span>
                        <span>{node.label}</span>
                        </span>
                        <span>
                        <el-button icon="el-icon-top" circle  plain style="font-size: 8px;"  type="warning" size="mini"  on-click={ () => this.sort(data,1) }></el-button>
                        <el-button icon="el-icon-bottom"  circle plain style="font-size: 8px;"  type="warning" size="mini"  on-click={ () => this.sort(data,0) }></el-button>
                        {
                            node.level === 3 ?
                            '' :
                            <el-button icon="el-icon-plus" plain  circle  style="font-size: 8px;"  disabled type="success" size="mini"  on-click={ () => this.append(data) }></el-button>
                        }
                        <el-button icon="el-icon-edit" plain  circle  style="font-size: 8px;"  type="primary" size="mini"  disabled on-click={ () => this.edits(data,node) }></el-button>
                        <el-button icon="el-icon-success" plain  circle  type="info" style="font-size: 10px;"  size="mini"  on-click={ () => this.hiden(data,0) }></el-button>
                        <el-button icon="el-icon-delete" plain  circle  style="font-size: 8px;" type="danger" size="mini"  on-click={ () => this.remove(node, data) }></el-button>
                        </span>
                        </span>
                    );
                }

            },

        },
        components:{
            OpenWindow
        },
        watch:{
            'form.g_value'(res){
                this.addAttr_g(this.g_options[res],res);
            },
            'form.j_value'(res){
                this.addAttr_j(this.j_options[res],res);
            },
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/pageHeader";
    @import "../../assets/variable";
    .content {
        width: 100%;
        background: #f5f5f5;
        border-bottom: 1px #eeeeee solid;
        border-radius: 5px;

        .el-aside {
            margin-top: 15px;
            margin-left: 15px;
            margin-right: 15px;
            background: #ffffff;
            min-height: calc(~"100vh - 240px");
            box-shadow: @contentBoxShadow;
            border-radius: @contentBorderRadius;
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

        #add-logistics {
            float: left;
        }



    }
    .el-tree{
        width: 700px;
    }

    .el-tree-node__content{
        height: 50px!important;
    }
    .el-form-item__content{
        height: 60px;
    }
    .el-textarea__inner{
        min-height: 150px;
    }
    .attr-value-list .el-row{
        margin-bottom: 20px;
    }
    .form-edit-row{
        padding-top: 15px;
    }
    .tree-input{
        font-size: 12px;
        padding-top: 15px;
        width: 95%;
        margin-left: 2.5%;

    }
    .el-main{
        margin-right: 15px;
        margin-top: 15px;
        min-height: calc(~"100% - 210px");
        background: #ffffff;
        box-shadow: @contentBoxShadow;
        border-radius: @contentBorderRadius;
    }
    .form-edit{
        padding-left: 10px;
    }
    .avatar-uploader .el-upload {
        border: 10px dashed #d9d9d9;
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
    .tree-input{
        .el-icon-search{
            font-size: 20px!important;
        }
    }
</style>