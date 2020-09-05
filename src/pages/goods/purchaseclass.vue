<template>
    <div class="content">
        <div class="pages-header" style="height: 70px;">
            <div>采购分类</div>
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
                        node-key="category_id"
                        :default-expanded-keys=expanded_keys
                        :props="defaultProps"
                        :load="loadNode"
                        :filter-node-method="filterNode"
                        :render-content="renderContent">
                </el-tree>
            </el-aside>
            <!--分类编辑区-->
            <el-main class="el-main" v-loading="loadings" element-loading-text="玩命加载中..">
                <el-form ref="form_edit" :model="form" label-width="80px" v-if="show_edit"  :rules="rules" class="form-edit">
                    <el-form-item label="上级分类">
                        <el-input style="width: 220px;" v-model="form.parent_name" disabled placeholder="无" ></el-input>
                    </el-form-item>
                    <el-form-item label="分类名称" prop="class_name" :rules="[{ required: true, message: '分类名称不能为空'}]">
                        <el-input style="width: 220px;" v-model="form.class_name" placeholder="请输入" maxlength="50" show-word-limit></el-input>
                    </el-form-item>
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
                                            :key="item.id"
                                            :label="item.attr_alias_name"
                                            :value="index" v-if="checkData(item.id,2)">
                                    </el-option>
                                </el-select>
                                <el-button @click="$router.push({name:'/goods/attribute',params:{class_name:form.class_name}})" size="small" type="primary" plain style="margin-left: 10px;"  icon="el-icon-share">新增属性</el-button>
                            </el-row>
                            <el-table :data="g_attr_item" border style="width: 100%">
                                <el-table-column  label="ID">
                                    <template slot-scope="scope">
                                        <el-input  v-if="scope.row.id" v-model="scope.row.id" disabled></el-input>
                                        <el-input  v-if="scope.row.attr_id" v-model="scope.row.attr_id" disabled></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="attr_value" label="属性名称">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.attr_name" disabled></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="param_key_value" label="属性别名">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.attr_alias_name" disabled></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column  label="排序">
                                    <template slot-scope="scope">
                                        <el-button :disabled=is_disabled size="mini" type='text'  icon="el-icon-top"  @click.stop="sortUp(scope.$index, scope.row)">向上</el-button>
                                        <el-button :disabled=is_disabled size="mini" type='text' icon="el-icon-bottom" @click.stop="sortDown(scope.$index, scope.row)">向下</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column  label="是否必填">
                                    <template slot-scope="scope">
                                        <el-radio :disabled=is_disabled v-model="scope.row.is_must" label="1">是</el-radio>
                                        <el-radio :disabled=is_disabled v-model="scope.row.is_must" label="0">否</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="operation" label="操作" width="100">
                                    <template slot-scope="scope">
                                        <!--<el-button type="primary" icon="el-icon-edit" circle size="mini" :disabled=is_disabled @click="$router.push({name:'/goods/attribute',query:{attr_id:scope.row.attr_id}})"></el-button>-->
                                        <el-button type="primary" icon="el-icon-edit" circle size="mini" :disabled=is_disabled @click="openWindow(scope.row.attr_id)"></el-button>
                                        <el-button type="danger" circle size="mini" :disabled=is_disabled @click="delAttrItem(scope.$index,'g')" icon="el-icon-delete"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-form-item>
                    <open-window ref="openwindow" @closeOpenWindow="closeOpenWindow"></open-window>
                    <el-form-item label="单位"  prop="unit" >
                        <el-select v-model="form.units" placeholder="请选择" >
                            <el-option
                                    v-for="item in unit_options"
                                    :key="item.id"
                                    :label="item.unit"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" class="form-textarea" prop="desc">
                        <el-input :disabled=is_disabled maxlength="500" show-word-limit type="textarea" :autosize="{ minRows: 4}" v-model="form.desc" style="width: 95%"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onsubmit(form)">立即提交</el-button>
                        <el-button @click="show_edit=false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>

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
    import Vue from 'vue'
    import OpenWindow from '../../components/OpenWindow.vue'

    export default {
        data() {
            return {
                edit_class: false,
                add_info:false,
                edit_one_class:false,
                data:[],
                show_edit:false,
                loading: false,
                loadings: false,
                is_edit: false,
                expanded_keys: [],
                unit_options:[],
                editData:[],
                editNote:[],
                template_id: '',
                filterText: '',
                num1:1,
                is_end:'',
                is_disabled:false,
                form: {
                    units:'',
                    parent_id: '',
                    class_name: '',
                    class_id: '',
                    parent_name:'',
                    g_value:'',
                    is_must: '0',
                    desc: '',
                },
                rules:{
                    unit: [
                        { required: true, message: '请选择单位名称', trigger: 'blur' },
                    ],
                },
                g_attr_item:[],
                template_value:[],
                j_options: [],
                g_options: [],
                data_list: [],
                defaultProps: {
                    children: 'children',
                    label: 'category_name'
                }
            }

        },
        created () {
            this.loading = true;
            this.class_list();
            this.unitsOptions();
        },
        methods: {
            async class_list(){
                let result = await this.$request.request(this.$API.common_api, {
                    type:1
                }, 'main', 'GET', {
                    router_path: 'server_purchase/cat',
                    request_host:'PURCHASE_CATEGORY_HOST',
                    handle_desc:"采购分类列表;"
                });
                await this.$common.wait(100);
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
                this.form.parent_id = data.category_id;
                this.form.parent_name = data.category_name;
            },
            async sort(data,type){
                let result = await this.$request.request(this.$API.common_api, {
                    category_id:data.category_id,
                    move:type,
                }, 'main', 'PUT', {
                    router_path: 'server_purchase/cat',
                    request_host:'PURCHASE_CATEGORY_HOST',
                    handle_desc:"采购分类排序;"
                });
                if (result.code === 200){
                    if (data.parent_id.category_id > 0) this.expanded_keys = [data.category_id];
                    this.class_list();
                    SendMessage({message: '排序采购分类成功', type: 'success'});
                }else{
                    SendMessage({message: '排序采购分类失败', type: 'error'});
                }
            },
            async remoteMethod_g(val){
                let result = await this.$request.request(this.$API.common_api, {
                    keyword: val,
                }, 'main', 'GET', {
                    router_path: 'server_purchase/goods_attr',
                    request_host:'PURCHASE_CATEGORY_HOST',
                });
                this.form.g_value='';
                this.g_options = result.data;
            },
            async onsubmit_form(form,type){
                let form_name = type === 0 ? this.$refs.form_one : this.$refs.form_other;
                form_name.validate(async (valid) => {
                    if (valid) {
                        let param = {};
                        param['category_name'] = form.class_name;
                        param['parent_id'] = {'category_id':type === 0 ? 0 : form.parent_id};
                        let result = await this.$request.request(this.$API.common_api, param, 'main', 'POST', {
                            router_path: 'server_purchase/cat',
                            request_host:'PURCHASE_CATEGORY_HOST',
                            handle_desc: '添加采购分类信息,父级ID：'+form.parent_id
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
                let index = _.findIndex(this.g_attr_item,(o)=>{
                    return o.id == id
                });
                return index>=0 ? false : true
            },

            async onsubmit(data){
                if (!this.form.class_id || !this.form.class_name){
                    SendMessage({message: '请输入分类名称', type: 'warning'});
                    return false;
                }
                if (this.g_attr_item.length < 1){
                    SendMessage({message: '请选择规格属性', type: 'warning'});
                    return false;
                }
                if (!this.form.units){
                    SendMessage({message: '请选择单位名称', type: 'warning'});
                    return false;
                }
                let attr_ids = [];
                let checkIsmust = false;
                this.g_attr_item.forEach((item,index)=>{
                    if (item.is_must == 1) checkIsmust = true;
                    if (item.id) {
                        attr_ids.push({attr_id:item.id,is_must:parseInt(item.is_must)});
                    }else{
                        attr_ids.push({attr_id:item.attr_id,is_must:parseInt(item.is_must)});
                    }
                });
                if (!checkIsmust) {
                    SendMessage({message: '至少有一项规格属性为必填', type: 'error'});
                    return false;
                }
                let request_type = this.is_edit ? 'PUT' : 'POST';
                let submit_data = {
                    "attr_value":attr_ids,
                    "category_name":this.form.class_name,
                    "remark":this.form.desc,
                    "unit":this.form.units+'_'+this.unit_options[this.form.units-1]['unit'],
                    "cat_id":this.form.class_id,
                    "category_id":this.form.class_id
                };
                let result = await this.$request.request(this.$API.common_api, submit_data, 'main', request_type, {
                    router_path: 'server_purchase/operate_quoted',
                    request_host:'PURCHASE_TEM_HOST',
                    extra_url: this.is_edit ? '?category_id='+`${this.form.class_id}` : '',
                    handle_desc: '保存采购分类信息,分类ID;'+this.form.class_id
                });
                if(result.code === 200){
                    this.show_edit = false;
                    this.g_attr_item = [];
                    this.class_list();
                    this.expanded_keys = [this.form.class_id];
                    SendMessage({message: '提交成功', type: 'success'});
                }else{
                    SendMessage({message: '提交失败', type: 'error'});
                }
            },
            addAttr_g (data,index) {
                let res = false;
                if (this.g_attr_item.length > 0){
                    this.g_attr_item.forEach((item,index)=>{
                        if (item['attr_id'] === data['id']){
                            SendMessage({message: '属性信息已存在', type: 'warning'});
                            res = true;
                        }
                    });
                }
                if (!res && data){
                    let end = this.g_attr_item[this.g_attr_item.length - 1];
                    let arr = {
                        attr_alias_name: data.attr_alias_name,
                        sort: end ? end.sort + 1 : 1,
                        attr_name: data.attr_name,
                        attr_id:data.id,
                        type_id:1,
                        is_must:'1'
                    };
                    this.g_attr_item.push(arr);
                }
            },
            delAttrItem (index,type) {
                if (this.g_attr_item[index]) {
                    this.$confirm('你是否删除该属性值？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        this.g_attr_item.splice(index, 1);
                        this.form.g_value='';
                    }).catch((e) => {
                    })
                }
            },
            sortUp(index, row){
                if (index === 0) {
                    SendMessage({message: '已经是第一个了，不要再点了。。', type: 'warning'});
                } else {
                    let temp = this.g_attr_item[index - 1];
                    this.$set(this.g_attr_item, index - 1, this.g_attr_item[index]);
                    this.$set(this.g_attr_item, index, temp)
                    SendMessage({message: '上移成功', type: 'success'});
                }
            },
            sortDown (index, row) {
                if (index === (this.g_attr_item.length - 1)) {
                    SendMessage({message: '已经是最后一个了，不要再点了。。', type: 'warning'});
                } else {
                    let temp = this.g_attr_item[index + 1];
                    this.$set(this.g_attr_item, index + 1, this.g_attr_item[index]);
                    this.$set(this.g_attr_item, index, temp);
                    SendMessage({message: '下移成功', type: 'success'});
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
                this.loadings = true;
                this.show_edit= true;
                this.form.class_name = data.category_name;
                this.form.class_id = data.category_id;
                this.form.parent_name = note.parent.data.category_name;
                this.g_attr_item = [];
                this.form.g_value = '';
                this.is_end = data.is_end;
                if (data.is_end == 0)this.is_disabled = true;
                if (data.is_end == 1)this.is_disabled = false;
                let result = await this.$request.request(this.$API.common_api, {
                    keyword: '',
                }, 'main', 'GET', {
                    router_path: 'server_purchase/goods_attr',
                    request_host:'PURCHASE_TEM_HOST',
                });
                this.g_options = result.data ? result.data : [];
                this.loadings = false;
                let attrs = await this.$request.request(this.$API.common_api, {
                    category_id: data.category_id,
                }, 'main', 'GET', {
                    router_path: 'server_purchase/operate_quoted',
                    request_host:'PURCHASE_TEM_HOST',
                    handle_desc:"采购分类属性模板;"+data.id
                });

                if (attrs.code === 200 && attrs.data){
                    this.form.desc = attrs.data[0]['remark'] ? attrs.data[0]['remark'] : '';
                    this.form.units = attrs.data[0]['unit'] ? parseInt(attrs.data[0]['unit'].split('_')[0]) : '';
                    let attr = attrs.data ? attrs.data : [];
                    attrs.data !== null ? this.is_edit = true : this.is_edit = false;
                    for (let i = 0; i < attr.length; i++){
                        attr[i].is_must = String(attr[i].is_must);
                        this.g_attr_item.push(attr[i]);
                    }
                }else{
                    this.is_edit = false;
                }
                this.show_edit = true;
            },
            async hiden (data ,type){
                this.loadings =false;
                this.onclearForm();
                this.show_edit = false;
                if(!data.category_id){
                    SendMessage({message: '参数错误', type: 'warning'});
                    return false;
                }
                let msg = type === 1 ? '是否屏蔽此分类信息？' : '是否开启此分类信息？';
                let param = {};
                param['category_id'] = data.category_id;
                param['category_status'] = type;
                this.$confirm(msg, '确认信息', {
                    distinguishCancelAndClose: false,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(async () => {
                    let result = await this.$request.request(this.$API.common_api, param, 'main', 'PUT', {
                        router_path: 'server_purchase/cat',
                        request_host:'PURCHASE_CATEGORY_HOST',
                        handle_desc:msg+";"+data.category_id
                    });
                    let type_message = result.code === 200 ? 'success' : 'error';
                    if(result.code === 200){
                        let message = type === 1 ? '屏蔽采购分类成功' : '开启采购分类成功';
                        SendMessage({message: message, type: type_message});
                    }
                    this.expanded_keys = [data.category_id];
                    this.class_list();
                });
            },
            remove(node, data) {
                this.loadings =false;
                this.onclearForm();
                this.show_edit = false;
                if(!data.category_id){
                    SendMessage({message: '参数错误', type: 'warning'});
                    return false;
                }
                this.$confirm('是否删除此分类信息？', '确认信息', {
                    distinguishCancelAndClose: false,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(async () => {
                    let result = await this.$request.request(this.$API.common_api, {}, 'main', 'DELETE', {
                        router_path: 'server_purchase/del',
                        request_host:'PURCHASE_CATEGORY_HOST',
                        extra_url: `${data.category_id}`,
                        handle_desc:"删除采购分类;"+data.category_id
                    });
                    let type_message = result.code === 200 ? 'success' : 'error';
                    SendMessage({message:'删除采购分类成功', type: type_message});
                    if(type_message === 'success'){
                        this.expanded_keys = [data.parent_id];
                        const parent = node.parent;
                        const children = parent.data.children || parent.data;
                        const index = children.findIndex(d => d.category_id === data.category_id);
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
                this.form.desc = '';

            },
            filterNode (value, data) {
                if (!value) return true;
                return data.category_name.indexOf(value) !== -1;
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
            async unitsOptions(){
                this.unit_options = await this.$common.getClassnuit(this);
            },
            renderContent(h, { node, data, store }) {
                if (data.category_status === 0){
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