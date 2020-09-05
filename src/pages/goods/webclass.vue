<template>
    <div class="content">
            <div class="pages-header" style="height: 70px;">
                <div>运营分类</div>
                <el-button round style="float: right;margin-top: 15px;margin-right: 40px;" type="primary" id="add-class" class="add-class" icon="el-icon-plus" size="medium" @click="add_class()">添加一级分类</el-button>
            </div>
            <el-container>
                <el-aside width="40%" class="el-aside">
                    <div class="">
                    <!--Tree区-->
                        <el-menu :default-active="category_device" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                            <el-menu-item index="0" @click="category('0')">PC端</el-menu-item>
                            <el-menu-item index="1" @click="category('1')">手机端</el-menu-item>
                        </el-menu>
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
                                v-loading="loading"
                                element-loading-text="加载中.."
                                :data="data_list"
                                :props="defaultProps"
                                node-key="id"
                                :default-expanded-keys=expanded_keys
                                @node-click="handleNodeClick"
                                :load="loadNode"
                                :filter-node-method="filterNode"
                                :render-content="renderContent">
                        </el-tree>
                </div>
                </el-aside>
                <!--分类编辑区-->
                <el-main class="el-main" v-loading="loadings"
                         element-loading-text="加载中..">
                    <el-form ref="form_edit" :model="form" label-width="100px" v-if="show_edit" class="form-edit">
                        <el-row class="form-edit-row">
                            <el-form-item label="上级分类">
                                <el-input v-model="form.parent_name" disabled style="width: 300px;"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-form-item label="分类名称"  prop="class_name" :rules="[{ required: true, message: '请输入分类名称'}]">
                            <el-input v-model="form.class_name" style="width: 300px;" maxlength="30" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="Banner" v-if="category_device == 1 && form.parent_id == 0"  prop="banner_img">
                            <preview-image v-if="form.banner_img" :image="form.banner_img" :height="'100px'"  style="margin-bottom: 10px;"></preview-image>
                            <upload-img v-if="is_uploade_banner" :keystr="'banner_img'" @uploaded="uploaded" :maxsize="255.5 * 1204"></upload-img>
                            <el-button v-else type="danger" size="small" @click="del('banner')" icon="el-icon-delete">删除</el-button>
                        </el-form-item>
                        <el-form-item label="分类图标" style="width: 40%;" prop="class_img">
                            <img v-if="form.class_img" :src="form.class_img" class="avatar" style="margin-bottom: 10px;width: 100px;height: 100px;">
                            <upload-img v-if="is_uploade" :keystr="'class_img'" @uploaded="uploaded" :maxsize="255.5 * 1204"></upload-img>
                            <el-button v-else type="danger" size="small" @click="del('class')" icon="el-icon-delete">删除</el-button>
                        </el-form-item>
                        <el-form-item>
                            <label style="color: #F56C6C;font-size: 10px">( 图片：宽255pt，高90pt )</label>
                        </el-form-item>
                        <el-form-item label="链接至" prop="link_value" :rules="[{ required: true, message: '请选择连接方式'}]">
                            <el-select
                                    suffix-icon="el-icon-search"
                                    v-model="form.link_value"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请选择"
                                    @change="selectChange"
                                    :filter-method="search_select"
                                    style="width: 300px;">
                                <el-option
                                        v-for="(item,index) in link_options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="index">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键字" v-if="show_search" prop="link_mark"  :rules="[{ required: true, message: '请输入关键字'}]">
                            <el-input maxlength="30" show-word-limit v-model="form.link_mark" style="width: 300px;" placeholder="请输入关键字"></el-input>
                        </el-form-item>
                        <el-form-item label="自定义连接" v-if="show_self" prop="link_self" :rules="[{ required: true, message: '请输入自定义连接'}]">
                            <el-input maxlength="1024" show-word-limit v-model="form.link_self" style="width: 300px;" placeholder="例如：https://www.paipaiyin.cn"></el-input>
                        </el-form-item>
                        <el-form-item label="专题名称" v-if="show_special" prop="topic_name"  :rules="[{ required: true, message: '选择专题名称'}]">
                            <el-input v-model="form.topic_name" style="width: 300px;" @focus="is_show('show_specialData')" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="商品名称" v-if="show_goodsname" prop="goods_name" :rules="[{ required: true, message: '选择商品名称'}]">
                            <el-input v-model="form.goods_name" style="width: 300px;" @focus="is_show('show_goodsData')" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="活动标题" v-if="show_active" prop="activity_name" :rules="[{ required: true, message: '选择活动标题'}]">
                            <el-input v-model="form.activity_name" style="width: 300px;" @focus="is_show('show_active')" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="平台分类"  v-if="form.link_value == 0" prop="admin_class" :rules="[{required: true, message: '请选择平台分类', trigger: 'blur,change'}]">
                            <el-cascader style="width: 300px"
                                    :options="options"
                                    change-on-select
                                    v-model="form.admin_class"
                                    @change="handleChange">
                            </el-cascader>
                        </el-form-item>

                        <el-form-item label="打开方式"  v-if="category_device == 0" prop="open_value" :rules="[{ required: true, message: '请选择打开方式'}]">
                            <el-select
                                    suffix-icon="el-icon-search"
                                    v-model="form.open_value"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请选择"
                                    @change="selectChanges"
                                    style="width: 300px;">
                                <el-option
                                        v-for="(item,index) in open_options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="index">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注" class="form-textarea" prop="desc" >
                            <el-input maxlength="100" show-word-limit type="textarea" :autosize="{ minRows: 4}" v-model="form.desc" style="width: 90%;"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onsubmit()">立即提交</el-button>
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
                    <el-input v-model="form.parent_id" style="width: 50%;" disabled></el-input>
                </el-form-item>
                <el-form-item label="父级分类"
                              prop="parent_name">
                    <el-input v-model="form.parent_name" style="width: 50%;" disabled=""></el-input>
                </el-form-item>
                <el-form-item label="新建分类名称"
                              prop="class_name" :rules="[{ required: true, message: '分类名称不能为空'}]">
                    <el-input v-model="form.class_name" style="width: 50%;" maxlength="30" show-word-limit></el-input>
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
                <el-form-item label="一级分类名称"
                              prop="class_name" :rules="[{ required: true, message: '请输入分类名称'}]">
                    <el-input v-model="form.class_name" style="width: 50%;" maxlength="30" show-word-limit></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onsubmit_form(form,0)">立即提交</el-button>
                    <el-button @click="edit_one_class=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--专题页-->

        <el-dialog title="链接至：专题页" :visible.sync="show_specialData" class="special-window" width="60%">
            <el-form :inline="true" :model="form" ref="searchForm" class="demo-form-inline" style="height: 45px">
                <el-form-item label="标题" prop="search_topic_name" style="margin-left: 10px;">
                    <el-input v-model="form.search_topic_name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="special_search()">查询</el-button>
                    <label style="color: #E6A23C;font-size: 10px;margin-left: 20px;">(注：双击当前行即可选中数据)</label>
                </el-form-item>
            </el-form>
            <div>
                <el-table
                        ref="special"
                        :data="specialData"
                        @cell-dblclick="handleCurrentChangerows"
                        stripe style="width: 100%;min-height: 420px"
                        v-loading="loading"
                        element-loading-text="加载中.."
                        highlight-current-row>
                    <el-table-column fixed prop="id" label="编号"></el-table-column>
                    <el-table-column prop="topic_name" label="标题"></el-table-column>
                    <el-table-column prop="create_time" label="创建时间"></el-table-column>
                </el-table>
                <div class="table-page">
                    <div class="block">
                        <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage4"
                                :page-sizes="pageSizes"
                                :page-size="pagesize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total=total>
                        </el-pagination>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!--商品列表-->
        <el-dialog title="链接至：商品" :visible.sync="show_goodsData"  width="75%" class="goods-window">
            <el-form :inline="true" :model="form" ref="searchForm" class="demo-form-inline" style="height: 45px">
                <el-form-item label="商品名称" prop="search_goods_name" style="margin-left: 10px;">
                    <el-input v-model="form.search_goods_name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="店铺ID" prop="shop_id" style="margin-left: 10px;">
                    <el-input v-model="form.shop_id" placeholder="请输入" type="number" min="0"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="goods_search(form)">查询</el-button>
                    <label style="color: #E6A23C;font-size: 10px;margin-left: 20px;">(注：双击当前行即可选中数据)</label>
                </el-form-item>
            </el-form>
            <div>
                <el-table
                        ref="special"
                        :data="goodsData"
                        @cell-dblclick="handleCurrentChangerow"
                        stripe style="width: 100%;min-height: 420px"
                        v-loading="loading"
                        element-loading-text="加载中.."
                        highlight-current-row>
                    <el-table-column fixed="left" prop="goods_id" label="商品ID">

                    </el-table-column>
                    <el-table-column label="商品图片" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <img :src="scope.row.goods_thumb_image" class="avatar" style="max-height: 50px;max-width: 50px">
                        </template>
                    </el-table-column>
                    <el-table-column fixed prop="shop_id" label="店铺ID"></el-table-column>
                    <el-table-column fixed prop="goods_name" label="商品名称" show-overflow-tooltip></el-table-column>
                    <el-table-column fixed prop="goods_price" label="商品价格" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="create_time" label="创建时间" show-overflow-tooltip></el-table-column>
                </el-table>
                <div class="table-page">
                    <div class="block">
                        <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage4"
                                :page-sizes="pageSizes"
                                :page-size="pagesize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total=total>
                        </el-pagination>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!--活动模板页-->

        <el-dialog title="链接至：活动模板页" :visible.sync="show_activitylData" class="special-window" width="60%">
            <el-form :inline="true" :model="form" ref="searchForm" class="demo-form-inline" style="height: 45px">
               <!-- <el-form-item label="活动名称" prop="search_activity_name" style="margin-left: 10px;">
                    <el-input v-model="form.search_activity_name" placeholder="请输入"></el-input>
                </el-form-item>-->
                <el-form-item>
                   <!-- <el-button type="primary" @click="activity_search()">查询</el-button>-->
                    <label style="color: #E6A23C;font-size: 10px;margin-left: 20px;">(注：双击当前行即可选中数据)</label>
                </el-form-item>
            </el-form>
            <div>
                <el-table
                        ref="special"
                        :data="activitylData"
                        @cell-dblclick="handleCurrentChangerowss"
                        stripe style="width: 100%;min-height: 420px"
                        v-loading="loading"
                        element-loading-text="加载中.."
                        highlight-current-row>
                    <el-table-column fixed prop="activity_id" label="编号" width="300"></el-table-column>
                    <el-table-column prop="activity_name" label="活动名称"></el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import UploadImg from '@/components/UplodaImg'
    import PreviewImage from '@/components/PreviewImage'
    export default {
        data() {
            return {
                edit_class: false,
                add_info: false,
                edit_one_class: false,
                show_edit: false,
                loading: false,
                uploading: false,
                loadings: false,
                show_search: false,
                show_self: false,
                show_specialData: false,
                show_activitylData: false,
                show_special: false,
                show_goodsData: false,
                show_goodsname: false,
                show_banner: false,
                show_active: false,
                expanded_keys:[],
                show_class: '',
                category_device:'0',
                data: [],
                pageSizes: [5],
                pagesize: 5,
                currentPage4: 1,
                total:0,
                goodsData:[],
                specialData:[],
                activitylData:[],
                options: [],
                radio: '1',
                num1: 1,
                is_uploade: 1,
                is_uploade_banner: 1,
                filterText:'',
                link_options: [{
                        value: '1',
                        label: '平台分类'
                    }, {
                        value: '2',
                        label: '搜索页'
                    }, {
                        value: '3',
                        label: '商品'
                    }, {
                        value: '4',
                        label: '专题页'
                    }, {
                        value: '5',
                        label: '自定义连接'
                    }, {
                        value: '6',
                        label: '活动模板页'
                    }
                ],
                open_options: [{
                    value: '0',
                    label: '当页跳转'
                }, {
                    value: '1',
                    label: '新开标签页'
                }],
                form: {
                    parent_id: '',
                    class_name: '',
                    parent_name: '',
                    link_value: '',
                    open_value: '',
                    search_class: '',
                    desc: '',
                    class_img: '',
                    link_mark: '',
                    link_self: '',
                    title:'',
                    special_name:'',
                    goods_name:'',
                    goods_id:0,
                    store_name:'',
                    class_ids:'',
                    banner_img:'',
                    admin_class:[],
                    search_goods_name:'',
                    search_topic_name: '',
                    search_activity_name:'',
                    shop_id:'',
                    topic_name:'',
                    activity_name:'',
                    activity_id:'',
                },
                data_list:  [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        created () {
            this.class_list();
            if (this.category_device === '0') this.show_banner = false;
        },
        methods: {
            async class_list(val){
                this.loading = true;
                let category_device = val ? val : this.category_device;
                let result = await this.$request.request(this.$API.common_api, {
                    category_device: category_device,
                    category_type: 1,
                }, 'main', 'GET', {
                    router_path: 'goods/goods_category',
                    request_host:'GOODS_CATEGORY',
                    handle_desc:"运营分类列表;"
                });
                this.loading =false;
                if (result.code === 400){
                    SendMessage({message: '获取分类信息失败', type: 'warning'});
                }
                this.data_list = result.data
            },
            handleSelect(val){
                this.class_list(val);
                this.category_device = val;
            },
            async handleCurrentChange(val) {
                this.currentPage4 = val;
                let param = {};
                param['page'] = val;
                let router_path = '';
                let request_host = '';
                if (this.show_specialData){
                     router_path = 'help/topic';
                     request_host = 'HELP_CATEGORY';
                     param['topic_name'] = this.form.topic_name ? this.form.topic_name : ''
                }
                if(this.show_goodsData){
                    router_path = 'goods/goods';
                    request_host = 'GOODS_SERVER_HOST';
                    param['goods_name'] = this.form.search_goods_name ? this.form.search_goods_name : ''
                }
                /*if(this.show_activitylData){
                    router_path = 'pcadmin/actemplate';
                    request_host = 'ACTIVE_SERVER_HOST';
                    param['activity_name'] = this.form.search_activity_name ? this.form.search_activity_name : ''
                }*/
                let result = await this.$request.get(this.$API.common_api, param ,'main',{
                    router_path: router_path,
                    request_host: request_host,
                    handle_desc:"运营分类专题/商品列表;"
                });
                if (this.show_specialData) {
                    this.specialData = result.data.result;
                }else {
                    this.goodsData =  result.data;
                }
            },
            async handleSizeChange (val) {
                this.pagesize = val;
            },
            async handleCurrentChangerow(val){
                if (val){
                    this.form.goods_id = val.goods_id;
                    this.form.shop_id = val.shop_id;
                    this.form.goods_name = val.goods_name;
                    this.show_goodsData = false;
                    this.form.search_goods_name = '';
                }
            },
            async handleCurrentChangerows(val){
                if (val){
                    this.form.topic_name = val.topic_name;
                    this.form.topic_id = val.id;
                    this.show_specialData = false;
                }
            },
            async handleCurrentChangerowss(val){
                if (val){
                    this.show_activitylData = false;
                    this.form.activity_name = val.activity_name;
                    this.form.activity_id = val.activity_id;
                }
            },
            async selectChanges(data){
                this.form.open_value = data;
            },
            async selectChange(data){
                this.form.link_value = data;
                this.loadings = false;
                this.show_class = false;
                this.show_goodsData = false;
                this.show_search = false;
                this.show_self = false;
                this.show_goodsname = false;
                this.show_special = false;
                this.show_active = false;
                if (data === 0){
                    this.show_class = true;
                    //平台分类
                    let data = await this.class_information();
                    this.options = data;
                }
                if (data === 1){this.show_search = true;}
                if (data === 4){this.show_self = true;}
                if (data === 2){
                    this.show_goodsData = true;
                    this.show_goodsname = true;
                    let result = await this.$request.get(this.$API.common_api, {} ,'main',{
                        router_path: 'goods/goods',
                        request_host: 'GOODS_SERVER_HOST',
                    });
                    this.goodsData = result.code === 200 ? result.data : [];
                    this.$refs.special.setCurrentRow(result['data'][1]);
                    this.total = result.total;
                }
                if (data === 3){
                    this.show_specialData = true;
                    let result = await this.$request.get(this.$API.common_api, {} ,'main',{
                        router_path: 'help/topic',
                        request_host: 'HELP_CATEGORY',
                        handle_desc:"专题页列表;"
                    });
                    this.specialData = result.code === 200 ? result.data.result : [];
                    this.total = result.data.count;
                    this.show_special = true;
                }
                if (data === 5){
                    this.show_activitylData = true;
                    let result = await this.$request.get(this.$API.common_api, {} ,'main',{
                        router_path: 'pcadmin/actemplate',
                        request_host: 'ACTIVE_SERVER_HOST',
                    });
                    this.activitylData = result.code === 200 ? result.data : [];
                    this.show_active = true;
                    this.$refs.special.setCurrentRow(result['data'][1]);
                    this.total = result.total;
                }
            },
            async category(val){
              this.category_device = val;
              this.show_edit = false;
              if (val === '1') this.link_options.splice(4);
              if (val === '1') this.show_self = false;
              if (val === '0') this.link_options.push({
                  value: '5',
                  label: '自定义连接'
              });

            },
            is_show(str){
                if (str === 'show_goodsData') this.selectChange(2);
                if (str === 'show_specialData') this.selectChange(3);
                if (str === 'show_active') this.selectChange(5);
            },
            async goods_search(data){
                let result = await this.$request.get(this.$API.common_api, {
                    goods_name:data.search_goods_name ? data.search_goods_name : '',
                    shop_id:data.shop_id ? data.shop_id : ''
                } ,'main',{
                    router_path: 'goods/goods',
                    request_host: 'GOODS_SERVER_HOST',
                    handle_desc:"运营分类商品搜索;"
                });
                this.loadings = false;
                this.goodsData = result.code === 200 ? result.data : [];
                this.total = result.total;
            },
           /* async activity_search(){
                let result = await this.$request.get(this.$API.common_api, {
                    activity_name:this.form.search_goods_name ? data.search_goods_name : '',
                } ,'main',{
                    router_path: 'pcadmin/actemplate',
                    request_host: 'ACTIVE_SERVER_HOST',
                    handle_desc:"运营分类活动搜索;"
                });
                this.activitylData = result.code === 200 ? result.data : [];
                this.total = result.total;
            },*/
            handleChange(value) {
                this.form.class_ids = value
            },
            append(data) {
                this.onclearForm();
                this.data=data;
                this.edit_class = true;
                this.show_edit = false;
                this.form.class_name = '';
                this.form.parent_id = data.id;
                this.form.parent_name = data.label;
            },
            async search_select(val){
                let result = await this.$request.request(this.$API.common_api, {
                    attr_alias_name: val,
                }, 'main', 'GET', {
                    router_path: 'operationattr/search',
                    request_host:'EDIT_CATEGORY_HOST',
                });
                //this.j_options = result.value_list;
            },
            async onsubmit_form(form,type){
                if (type === 0){
                    this.$refs.form_one.validate(async (valid) => {
                        if (valid) {
                            let param = {};
                            param['category_device'] = this.category_device ? this.category_device : 0;
                            param['category_name'] = form.class_name;
                            param['category_type'] = 1;
                            param['parent_id'] = type === 0 ? 0 : form.parent_id;
                            let result = await this.$request.request(this.$API.common_api, param, 'main', 'POST', {
                                router_path: 'goods/goods_category',
                                request_host:'GOODS_CATEGORY',
                                handle_desc:"保存运营分类名称;"+form.parent_id
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
                }
                this.$refs.form_other.validate(async (valid) => {
                    if (valid) {
                        let param = {};
                        param['category_device'] = this.category_device ? this.category_device : 0;
                        param['category_name'] = form.class_name;
                        param['category_type'] = 1;
                        param['parent_id'] = type === 0 ? 0 : form.parent_id;
                        let result = await this.$request.request(this.$API.common_api, param, 'main', 'POST', {
                            router_path: 'goods/goods_category',
                            request_host:'GOODS_CATEGORY',
                            handle_desc:"保存运营分类名称;"+form.parent_id
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
            async onsubmit(){
                this.$refs.form_edit.validate(async (valid) => {
                    if (valid) {
                        this.loadings =true;
                        let param = {};
                        //param['category_id'] = this.form.class_id;
                        param['category_name'] = this.form.class_name;
                        param['remark'] = this.form.desc;
                        param['parent_id'] = this.form.parent_id ? this.form.parent_id : 0;
                        param['category_status'] = 0;
                        param['pic_url'] = this.form.class_img;
                        param['category_link'] = this.form.link_self;
                        param['category_type'] = 1;
                        param['category_device'] = this.category_device ? this.category_device : 0;
                        param['link_type_id'] = this.form.link_value;
                        param['banner'] = this.form.banner_img;
                        param['open_type'] = this.form.open_value;
                        if (this.form.link_value === 0){
                            let class_arr = this.form.class_ids ? this.form.class_ids : this.form.admin_class;
                            let class_ids = '';
                            for (let i = 0; i < class_arr.length; i++){
                                if (i >= class_arr.length-1){
                                    class_ids+= class_arr[i];
                                } else{
                                    class_ids+= class_arr[i]+',';
                                }
                            }
                            param['link_type_value'] = class_ids;
                        }
                        if (this.form.link_value === 1){
                            param['link_type_value'] = this.form.link_mark;
                        }
                        if (this.form.link_value === 2){
                            param['link_type_value'] = this.form.goods_id && this.form.goods_name ? this.form.goods_name+','+this.form.goods_id : '';
                            param['shop_id'] = this.form.shop_id;
                        }
                        if (this.form.link_value === 3){
                            param['link_type_value'] = this.form.topic_name && this.form.topic_id ? this.form.topic_name+','+this.form.topic_id : '';
                        }
                        if (this.form.link_value === 4){
                            param['link_type_value'] = this.form.link_self;
                        }
                        if (this.form.link_value === 5){
                            param['link_type_value'] = this.form.activity_name && this.form.activity_id ? this.form.activity_name+','+this.form.activity_id : '';
                        }
                        console.log(param);
                        let result = await this.$request.request(this.$API.common_api, param, 'main', 'PUT', {
                            router_path: 'goods/goods_category',
                            request_host:'GOODS_CATEGORY',
                            extra_url: `${this.form.class_id}/`,
                            handle_desc:"保存运营分类详情;"+this.form.class_id
                        });
                        if (result.code === 200){
                            this.loadings = false;
                            this.show_edit = false;
                            this.class_list();
                            this.expanded_keys = [this.form.class_id];
                            SendMessage({message: '编辑成功', type: 'success'});
                        }else {
                            SendMessage({message: '编辑失败', type: 'warning'});
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                await this.$common.wait(100);
                this.loadings =false;
            },
            async add_class(){
                this.form.class_name = '';
                this.edit_one_class = true;
                this.show_edit = false;
            },
            async edits(data,note){
                this.show_search = false;
                this.show_goodsname = false;
                this.show_special = false;
                this.show_self = false;
                this.show_class = false;
                this.show_active = false;
                this.show_edit = true;
                this.form.class_name = data.label;
                this.form.class_id = data.id;
                if (data.parent_id){
                    this.form.parent_name = note.parent.data.label;
                    this.show_banner = false;
                }else {
                    if (this.category_device == 1){
                        this.show_banner = true;
                    }
                    this.form.parent_name = '无';
                }
                this.form.parent_id = data.parent_id;
                let result = await this.$request.request(this.$API.common_api, {
                    category_device: this.category_device,
                    category_type: 1,
                }, 'main', 'GET', {
                    router_path: 'goods/goods_category',
                    request_host:'GOODS_CATEGORY',
                    extra_url: `${this.form.class_id}/`,
                    handle_desc:"运营分类获取分类详情信息;"+this.form.class_id
                });
                console.log(result);
                if (result.code === 200){
                    this.loadings = false;
                    this.form.class_img = result.data.pic_url;
                    result.data.pic_url ? this.is_uploade = '' : this.is_uploade = 1;
                    this.form.desc = result.data.remark;
                    this.form.link_value = result.data.link_type_id;
                    if (result.data.link_type_id == 2) this.form.shop_id = result.data.shop_id;
                    this.form.link_mark= result.data.link_type_id == 2 ? (result.data.link_type_value.split(','))[0] : result.data.link_type_value;
                    this.form.open_value = result.data.open_type;
                    if (this.category_device > 0 && result.data.banner.length > 0){
                        this.form.banner_img = result.data.banner[0]['pic_url'];
                        result.data.banner[0]['pic_url'] ? this.is_uploade_banner = '' : this.is_uploade_banner = 1;
                    }else{
                        this.form.banner_img = '';
                        this.is_uploade_banner = 1
                    }
                    if (result.data.link_type_id < 1){
                        this.show_class = true;
                        let arr = result.data.link_type_value.split(',');
                        for (let i = 0; i < arr.length; i++){
                            arr[i] = parseInt(arr[i])
                        }
                        this.form.admin_class = arr;
                        //平台分类
                        this.options = await this.class_information();
                    }
                    if (result.data.link_type_id === 1){
                        this.show_search = true;
                        this.form.link_mark = result.data.link_type_value;
                    }
                    if (result.data.link_type_id === 2){
                        this.show_goodsname = true;
                        this.form.goods_name = result.data.link_type_value.split(',')[0];
                        this.form.goods_id = result.data.link_type_value.split(',')[1];
                        this.form.shop_id = result.data.shop_id;
                    }
                    if (result.data.link_type_id === 3){
                        this.show_special = true;
                        this.form.special_name = result.data.link_type_value;
                        this.form.topic_name = result.data.link_type_value.split(',')[0];
                        this.form.topic_id = result.data.link_type_value.split(',')[1];
                    }
                    if (result.data.link_type_id === 4){
                        this.show_self = true;
                        this.form.link_self = result.data.link_type_value;
                    }
                    if (result.data.link_type_id === 5){
                        this.show_active = true;
                        this.form.activity_name = result.data.link_type_value.split(',')[0];
                        this.form.activity_id = result.data.link_type_value.split(',')[1];
                    }
                }
            },
            async hiden (data ,type){
                this.onclearForm();
                this.show_edit = false;
                if(!data.id){
                    SendMessage({message: '参数错误', type: 'warning'});
                    return false;
                }
                let msg = type === 1 ? '是否屏蔽此分类信息？' : '是否开启此分类信息？';
                let param = {};
                param['category_id'] = data.id;
                param['category_type'] = 1;
                param['category_device'] = this.category_device ? this.category_device : 0;
                param['select'] = type;
                this.$confirm(msg, '确认信息', {
                    distinguishCancelAndClose: false,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(async () => {
                    let result = await this.$request.request(this.$API.common_api, param, 'main', 'PUT', {
                        router_path: 'goods_category/category_shield',
                        request_host:'GOODS_CATEGORY',
                        handle_desc:"屏蔽运营分类;"+data.id
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
                        handle_desc:"删除运营分类;"+data.id
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
            async special_search(){
                let result = await this.$request.get(this.$API.common_api, {
                    topic_name:this.form.search_topic_name
                } ,'main',{
                    router_path: 'help/topic',
                    request_host: 'HELP_CATEGORY',
                });
                this.specialData = result.code === 200 ? result.data.result : [];
                this.total = result.data.count;
            },
            handleNodeClick(data) {
            },
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([{name: 'region1'}, {name: 'region2'}]);
                }
                if (node.level > 3) return resolve([]);

                let hasChild;
                if (node.data.name === 'region1') {
                    hasChild = true;
                } else if (node.data.name === 'region2') {
                    hasChild = false;
                } else {
                    hasChild = Math.random() > 0.5;
                }

            },
            uploaded (data,strkey) {
               if (strkey === 'banner_img'){
                   this.form.banner_img = data.imageOssUrl;
                   this.is_uploade_banner = '';
               } else{
                   this.form.class_img = data.imageOssUrl;
                   this.is_uploade = '';
               }
            },
            del(str){
                if (str === 'banner'){
                    this.form.banner_img = '';
                    this.is_uploade_banner = 1;
                } else {
                    this.form.class_img = '';
                    this.is_uploade = 1;
                }
            },
            onclearForm(){
                this.form.class_name = '';
                this.form.parent_name = '';
                this.form.desc = '';
            },
            filterNode (value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            async sort(data,type){
                let result = await this.$request.request(this.$API.common_api, {
                    category_device: this.category_device,
                    category_type: 1,
                    category_id:data.id,
                    parent_id:data.parent_id,
                    move:type
                }, 'main', 'PUT', {
                    router_path: 'goods_category/category_move',
                    request_host:'GOODS_CATEGORY',
                });
                if (result.code === 200){
                    if (data.parent_id > 0) this.expanded_keys = [data.id];
                    this.class_list();
                    SendMessage({message: '操作成功', type: 'success'});
                }else{
                    SendMessage({message: '操作失败', type: 'error'});
                }
            },
            async class_information(){
                let {data} = await this.$request.request(this.$API.common_api, {
                    category_device: 0,
                    category_type: 0,
                }, 'main', 'GET', {
                    router_path: 'goods/goods_category',
                    request_host:'GOODS_CATEGORY',
                    handle_desc:"运营分类平台分类信息;"
                });
                data.forEach((item,index)=>{
                    data[index].value = item.id
                    if(item.status){
                        data[index].disabled = (item.status === 1 ? true : false);
                    }
                    if(item.children && item.children.length){
                        item.children.forEach((item2,index2)=>{
                            data[index]['children'][index2].value = item2.id
                            if(item2.status){
                                data[index]['children'][index2].disabled = (item2.status === 1 ? true : false)
                            }
                            if(item2.children && item2.children.length){
                                item2.children.forEach((item3,index3)=>{
                                    data[index]['children'][index2]['children'][index3].value = item3.id
                                    if(item3.status){
                                        data[index]['children'][index2]['children'][index3].disabled = (item3.status === 1 ? true : false)
                                    }
                                    delete data[index]['children'][index2]['children'][index3]['children']
                                })
                            }
                        })
                    }
                });
                return data;
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
                        <el-button icon="el-icon-edit" disabled style="font-size: 8px;" type="primary" plain  circle   circle size="mini" ></el-button>
                        <el-button icon="el-icon-success"  style="font-size: 8px;" type="info"  plain  circle  size="mini"  on-click={ () => this.hiden(data,0) }></el-button>
                        <el-button icon="el-icon-delete"  style="font-size: 8px;" type="danger"  plain  circle  size="mini"  on-click={ () => this.remove(node, data) }></el-button>
                        </span>
                        </span>
                    );
                }
            },
        },
        components: {
            UploadImg,
            PreviewImage
        },
        watch:{
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
        border-bottom: 1px #eeeeee solid;
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
        min-height: calc(~"100vh - 210px");
        background: #ffffff;
        box-shadow: @contentBoxShadow;
        border-radius: @contentBorderRadius;
    }
    .form-edit{
        padding-left: 10px;
    }
    .table-page {
        float: right;
        margin-right: 15px;
        margin-top: 15px;
    }

   //==============
</style>