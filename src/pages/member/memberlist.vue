<template>
    <div class="content" v-loading="loading">
        <div class="pages-header">
            <div>会员列表</div>
            <el-button round style="float: right;margin-top: 15px;margin-right: 40px;" type="primary"  icon="el-icon-collection-tag" size="medium"  @click="setLabelWindow()">设置标签</el-button>
            <el-button round style="float: right;margin-top: 15px;margin-right: 40px;" type="primary" id="add-logistics" icon="el-icon-download" size="medium"  @click="memberList('download')">导出 Excel</el-button>
        </div>
        <div class="pages-header" style="margin-top: 15px;line-height: 180px;height: 220px">
            <el-form ref="form" :model="form" class="searchForm">
                <el-row :gutter="20">
                    <el-col :span="10" style="margin-top: 15px">
                        <div class="grid-content bg-purple">
                            <el-form-item label="会员注册时间" prop="value3" label-width="100px">
                                <el-date-picker
                                        v-model="form.value3"
                                        style="width: 100%"
                                        type="datetimerange"
                                        :picker-options="pickerOptions"
                                        value-format="timestamp"
                                        range-separator="至">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6" style="margin-top: 15px">
                        <div class="grid-content bg-purple">
                            <el-form-item label="邮箱" prop="email" label-width="60px">
                                <el-input v-model="form.email" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="会员状态" label-width="70px"  prop="status" style="margin-top: 15px">
                                <el-select
                                        suffix-icon="el-icon-search"
                                        v-model="form.status"
                                        filterable
                                        remote
                                        reserve-keyword
                                        placeholder="请选择"
                                        @change="selectChange"
                                        style="width: 100%;">
                                    <el-option
                                            v-for="(item,index) in optionStatus"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top: 10px;">
                    <el-col :span="10">
                        <div class="grid-content bg-purple">
                            <el-form-item label="最后登录时间" prop="value2" label-width="100px">
                                <el-date-picker
                                        v-model="form.value2"
                                        style="width: 100%"
                                        type="datetimerange"
                                        :picker-options="pickerOptions"
                                        value-format="timestamp"
                                        range-separator="至">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="手机" prop="mobile" label-width="60px">
                                <el-input v-model="form.mobile" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="注册平台" label-width="70px" prop="register">
                                <el-select
                                        suffix-icon="el-icon-search"
                                        v-model="form.register"
                                        filterable
                                        remote
                                        reserve-keyword
                                        placeholder="请选择"
                                        @change="selectChange"
                                        style="width: 100%;">
                                    <el-option
                                            v-for="(item,index) in optionRegister"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top: 10px;">
                    <el-col :span="5">
                        <div class="grid-content bg-purple-light">
                            <el-form-item label="会员等级" prop="level" label-width="100px">
                                <el-select v-model="form.level"  placeholder="请选择">
                                    <el-option
                                            v-for="item in levelOption"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="grid-content bg-purple-light">
                            <el-form-item label="会员属性" prop="attribute" label-width="115px">
                                <el-select v-model="form.attribute"  placeholder="请选择">
                                    <el-option
                                            v-for="item in optionAttribute"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <el-form-item label="邀请码" prop="inviteCode" label-width="60px">
                                <el-input v-model="form.inviteCode" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-light">
                        <div class="grid-content bg-purple-light">
                            <el-form-item label="用户标签" prop="inviteCode" label-width="70px">
                                <el-select
                                        v-model="label_name"
                                        remote
                                        reserve-keyword
                                        filterable
                                        style="width: 100%;">
                                    <el-option
                                            v-for="item in form.labelData"
                                            :key="item.id"
                                            :label="item.label_name"
                                            :value="item.label_name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top: 10px;">
                    <el-col :span="10">
                        <div class="grid-content bg-purple-light">
                            <el-form-item label="注册来源" prop="level" label-width="100px">
                                <el-input v-model="form.utm_source" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item>
                            <el-button  type="primary" @click="memberList('search')">查询</el-button>
                            <el-button  @click="onClear('form')">清空筛选</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table-content">
            <el-table
                    :data="tableData"
                    fixed
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column prop="user_id" label="序号"></el-table-column>
                <el-table-column prop="member_img" label="头像" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <img v-if="scope.row.header" :src="scope.row.header" class="avatar" style="margin-bottom: -10px;height: 30px;">
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机" width="120px;" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.mobile">{{scope.row.mobile}}</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="220px;" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.email">{{scope.row.email}}</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column prop="nick_name" label="昵称" width="120px;" show-overflow-tooltip></el-table-column>
                <el-table-column prop="member_type" label="会员类型" width="100px;" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === 0">买家</span>
                        <span v-else>卖家</span>
                    </template>
                </el-table-column>
                <el-table-column label="会员等级" width="100px;" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ level[scope.row.level] }}
                    </template>
                </el-table-column>
                <el-table-column label="用户标签" width="100px;" prop="users_label" :width="250">
                    <template slot-scope="scope">
                        <span v-for="(item,key) in scope.row.users_label"><i style="color: #00b7ee;font-size: 14px;" class="el-icon-s-flag"></i>{{item.label_name}}&nbsp;&nbsp;</span>
                    </template>
                </el-table-column>
                <el-table-column label="会员属性" width="100px;" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.identity === 2">企业用户</span>
                        <span v-else>个人用户</span>
                    </template>
                </el-table-column>
                <el-table-column label="邀请码" width="100px;" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.invitation_code">{{scope.row.invitation_code}}</span>
                        <span v-else>无邀请码</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="order_count" label="成交次数" width="120px;">
                    <template slot-scope="scope">
                        <span v-if="scope.row.order_count">{{scope.row.order_count}} 笔</span>
                        <span v-else>0 笔</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total_account" label="成交总额" width="120px;">
                    <template slot-scope="scope">
                        <span v-if="scope.row.total_account">{{scope.row.total_account}} 元</span>
                        <span v-else>0 元</span>
                    </template>
                </el-table-column>
                <el-table-column prop="avg_price" label="客单价(元)" width="120px;">
                    <template slot-scope="scope">
                        <span v-if="scope.row.avg_price">{{scope.row.avg_price}} 元</span>
                        <span v-else>0 元</span>
                    </template>
                </el-table-column>
                <el-table-column prop="order_time" label="上次消费时间" width="160"></el-table-column>-->
                <el-table-column prop="last_login_time" label="最后登录时间" width="160" show-overflow-tooltip></el-table-column>
                <el-table-column prop="register_source" label="注册平台" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.register_source === 1">拍拍印-PC</span>
                        <span v-if="scope.row.register_source === 2">拍拍印-Android</span>
                        <span v-if="scope.row.register_source === 3">拍拍印-IOS</span>
                        <span v-if="scope.row.register_source === 4">拍拍印-H5</span>
                        <span v-if="scope.row.register_source === 5">拍拍印-小程序</span>
                        <span v-if="scope.row.register_source === 6">H5-拍拍快印终端机</span>
                        <span v-if="scope.row.register_source === 7">企业印微应用</span>
                        <span v-if="scope.row.register_source === 8">H5-私域店</span>
                    </template>
                </el-table-column>
                <el-table-column label="注册来源" width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.user_promotion[0]">{{scope.row.user_promotion[0].utm_source}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="reg_time" label="注册时间" width="160" show-overflow-tooltip></el-table-column>
                <el-table-column prop="member_status" label="状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.status"
                                :active-value="1"
                                :inactive-value="2"
                                @change="changSwitch(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="operation" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-row >
                            <el-button type="success" circle size="mini" @click="$router.push({name:'/member/memberInfo',query:{user_id:scope.row.user_id}})" icon="el-icon-view"></el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pages-style">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-sizes=pageSizes
                        :page-size=pagesize
                        layout="total, sizes, prev, pager, next, jumper"
                        :total=total
                        background>
                </el-pagination>
            </div>
        </div>
        <!--设置标签-->
        <el-dialog title="设置标签" :visible.sync="setLabels" top="100px" width="40%">
            <el-form ref="form_other" :model="form" label-width="120px">
                <el-form-item label="用户标签"
                              prop="labelName">
                    <el-select
                            v-model="labelId"
                            remote
                            reserve-keyword
                            placeholder="请输入关键词搜索"
                            filterable
                            :remote-method="setLabel"
                            style="width: 295px;">
                        <el-option
                                v-for="item in form.labelData"
                                :key="item.id"
                                :label="item.label_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="height: 100px"></el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="submitLabel('add')" style="margin-top: 20px">添加</el-button>
                    <el-button type="primary" icon="el-icon-delete" @click="submitLabel('del')">移除</el-button>
                    <el-button icon="el-icon-close" @click="setLabels=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {LEVEL, LEVEL_OPTION} from '../../config/user'
    export default {
        data () {
            return {
                pageSizes: [10,20,50],
                pagesize: 10,
                currentPage4: 1,
                total:10,
                loading:false,
                levelOption: LEVEL_OPTION,
                level: LEVEL,
                selectLabel:'',
                setLabels:false,
                labelId:'',
                label_name:'',
                form:{
                    status:'',
                    register:'',
                    email:'',
                    mobile:'',
                    value1:'',
                    value2:'',
                    value3:'',
                    level: '',
                    attribute:'',
                    inviteCode:'',
                    labelId:'',
                    labelData:[],
                    utm_source:'',
                },
                optionRegister:[
                    {
                        value: '1',
                        label: '拍拍印-PC'
                    },
                    {
                        value: '2',
                        label: '拍拍印-Android'
                    },
                    {
                        value: '3',
                        label: '拍拍印-IOS'
                    },
                    {
                        value: '4',
                        label: '拍拍印-H5'
                    },
                    {
                        value: '5',
                        label: '拍拍印-小程序'
                    },
                    {
                        value: '6',
                        label: 'H5-拍拍快印终端机'
                    },
                    {
                        value: '7',
                        label: '企业印微应用'
                    },
                    {
                        value: '8',
                        label: 'H5-私域店'
                    }
                ],
                optionStatus:[
                    {
                        value: '2',
                        label: '停用'
                    }, {
                        value: '1',
                        label: '启用'
                    }
                ],
                optionAttribute:[
                    {
                        value: '1',
                        label: '个人用户'
                    },
                    {
                        value: '2',
                        label: '企业用户'
                    }
                ],
                tableData: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            }
        },
        created () {
            this.memberList();
            this.setLabel();
        },
        methods: {
            async memberList (str) {
                this.loading = true;

                let param = {};
                if (str === 'search') this.currentPage4 = 1;
                param['page'] = this.currentPage4 ? this.currentPage4 : '';
                param['page_size'] = this.pagesize ? this.pagesize : '';
                param['email'] = this.form.email ? this.form.email : '';
                param['mobile'] = this.form.mobile ? this.form.mobile : '';
                param['status'] = this.form.status ? this.form.status : '';
                param['level'] = this.form.level ? this.form.level : '';
                param['identity'] = this.form.attribute ? this.form.attribute : '';
                param['invitation_code'] = this.form.inviteCode ? this.form.inviteCode : '';
                param['register_source'] = this.form.register ? this.form.register : '';
                param['login_start_time'] = this.form.value2[0] ? this.form.value2[0] / 1000 : '';
                param['login_end_time'] = this.form.value2[1] ? this.form.value2[1] / 1000 + 86399 : '';
                param['reg_start_time'] = this.form.value3[0] ? this.form.value3[0] / 1000 : '';
                param['reg_end_time'] = this.form.value3[1] ? this.form.value3[1] / 1000 + 86399 : '';
                param['users_label'] = this.label_name ? this.label_name : '';
                param['utm_source'] = this.form.utm_source ? this.form.utm_source : '';
                if (str === 'download'){
                    let excelInfo = await this.$request.request(this.$API.common_api,param, 'main', 'GET', {
                        router_path: 'users/ex',
                        request_host:'MEMBER_USER_HOST',
                        handle_class: 'Download',
                        handle_desc:"会员列表;"
                    });
                    if (excelInfo.code !== 200)  SendMessage({message: '下载失败', type: 'error'});
                    window.location.href = excelInfo.host+'?file_name='+excelInfo.data
                }else{
                    let {data} = await this.$request.request(this.$API.common_api,param, 'main', 'GET', {
                        router_path: 'zt/users',
                        request_host:'MEMBER_USER_HOST',
                    });
                    console.log(data);
                    console.log(1111111111111111);
                    data.data.forEach( function (item,index,input) {
                        if(item['su_user'][0]){
                            data.data[index]['level']  = item['su_user'][0]['level'];
                        }
                        if(item['enterprise_user_info'][0]){
                            data.data[index]['invitation_code']  = item['enterprise_user_info'][0].invitation_code;
                        }
                    });
                    this.tableData = data.data;
                    this.total = data.total;
                }
                this.loading = false;
            },
            async memberView (id) {
                this.$router.push('/member/memberInfo?id='+id);
            },
            async handleCurrentChange(val) {
                this.currentPage4 = val;
                this.memberList();
            },
            async handleSelectionChange(val){
                let data = [];
                val.length > 0 && val.forEach((item,index)=>{ data.push(item['user_id'])});
                this.selectLabel = data;
            },
            async setLabelWindow(){
                if (this.selectLabel.length < 1){
                    SendMessage({message: '请选择用户', type: 'error'})
                    return false;
                }else{
                    this.setLabels = true;
                }
            },
            async setLabel(label_name){
                let {data} = await this.$request.get(this.$API.common_api,{
                    label_name:label_name ? label_name : ''
                }, 'main', {
                    router_path: 'label/name',
                    request_host:'MEMBER_USER_HOST',
                    handle_desc:"获取用户标签;"
                });
                this.form.labelData  = data ?  data : [];
            },
            async submitLabel(val){
                if (!this.labelId) {
                    SendMessage({message: '请选择标签', type: 'error'})
                    return false;
                }
                if (this.selectLabel.length < 1){
                    SendMessage({message: '请选择用户', type: 'error'})
                    return false;
                }
                let requestType = val === 'add' ? 'POST' : 'PUT';
                let successMsg = val === 'add' ? '批量添加用户标签成功' : '批量移除用户标签成功';
                let errorMsg = val === 'add' ? '批量添加用户标签失败' : '批量移除用户标签失败';
                let {code} = await this.$request.request(this.$API.common_api,{
                    user_ids:this.selectLabel,
                    label_id:this.labelId,
                }, 'main', requestType, {
                    router_path: 'operating/label',
                    request_host:'MEMBER_USER_HOST',
                    handle_desc:"添加用户标签;"+this.labelId
                });
                this.setLabels = false;
                this.memberList();
                code == 200 ? SendMessage({message: successMsg, type: 'success'}) : SendMessage({message: errorMsg, type: 'error'});
            },
            async handleSizeChange (val) {
                this.pagesize = val;
                this.memberList();
            },
            async changSwitch (data){
                let {code} = await this.$request.request(this.$API.common_api,{
                    user_id:data.user_id,
                    action:data.status === 1 ? 'activation' : 'freeze',
                }, 'main', 'POST', {
                    router_path: 'user/status',
                    request_host:'MEMBER_USER_HOST',
                    handle_desc:"修改会员状态;"+data.user_id
                });
                SendMessage({message: '操作成功', type: 'success'})
            },
            async selectChange(val){

            },
            onClear(form){
                this.$refs[form].resetFields();
                this.label_name = '';
                this.form.utm_source = '';
                this.memberList();
            },
        },
        components: {}
    }
</script>
<style lang="less" scoped>
    @import "../../assets/pageHeader";
    .searchForm{
        .el-col{
            margin-top: 0px;
        }
    }
    .el-row {
        margin-bottom: 0px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .grid-content {
        border-radius: 4px;
        height:30px;
    }
    .el-form-item{
        margin-bottom: 5px!important;
    }
</style>
