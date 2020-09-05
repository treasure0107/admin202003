<template>
    <div class="content">
<!--        <div class="pages-header">-->
<!--            <div>店铺管理</div>-->
<!--        </div>-->
        <div class="form-search">
            <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="会员" prop="user">
                    <el-input v-model="formInline.user" placeholder="会员手机号或邮箱号" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="店铺名称" prop="shop_name">
                    <el-input v-model="formInline.shop_name" placeholder="店铺名称" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="公司名称" prop="company_name">
                    <el-input v-model="formInline.company_name" placeholder="公司名称" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="店铺类型" prop="open_status">
                    <el-select v-model="formInline.open_status" size="mini">
                        <el-option
                                v-for="(item,index) in openStatusOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="店铺标签" prop="label">
                    <el-select v-model="formInline.label" size="mini">
                        <el-option
                            v-for="(item,index) in shopLogsOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="店铺状态" prop="shop_close">
                    <el-select v-model="formInline.shop_close" size="mini">
                        <el-option
                                v-for="(item,key) in shopCloseOption"
                                :key="item.value"
                                :label="item.label"
                                :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="店铺等级" prop="rank_status">
                    <el-select v-model="formInline.rank_status" size="mini">
                        <el-option
                                v-for="(item,index) in rankStatusOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务完成情况" prop="task_status">
                    <el-select v-model="formInline.task_status" size="mini">
                        <el-option label="已完成" value="1"></el-option>
                        <el-option label="未完成" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入驻时间" prop="create_time">
                    <el-date-picker
                            v-model="formInline.create_time"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            size="mini">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">筛选</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" @click="exportShop">导出店铺</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="text" size="mini" @click="resetForm('formInline')">清空筛选条件</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-content">
            <el-table :data="tableData.result" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="shop_id" label="序号" width="50"></el-table-column>
                <el-table-column label="会员" width="165">
                    <template slot-scope="scope">
                        <p>{{ scope.row.user_mobile | isNull }}</p>
                        <p>{{ scope.row.user_email | isNull }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="店铺名称/类型">
                    <template slot-scope="scope">
                        <p>{{ scope.row.shop_name }}</p>
                        <p>{{ openStatus[scope.row.open_status] }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="company_name" label="公司名称"></el-table-column>
                <el-table-column prop="rank_status" label="店铺等级">
                    <template slot-scope="scope">
                        {{ rankStatus[scope.row.rank_status] }}
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="入驻时间" width="155"></el-table-column>
                <el-table-column prop="create_time" label="任务完成情况">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="24"><div class="grid-content task-info">基本资料 <span><i :class="scope.row.shop_info == 1?'el-icon-check icon-correct':'el-icon-close icon-error'"></i></span></div></el-col>
                            <el-col :span="24"><div class="grid-content task-info">设置物流 <span><i :class="scope.row.shop_express == 1?'el-icon-check icon-correct':'el-icon-close icon-error'"></i></span></div></el-col>
                            <el-col :span="24"><div class="grid-content task-info">发布商品 <span><i :class="scope.row.shop_goods == 1?'el-icon-check icon-correct':'el-icon-close icon-error'"></i></span></div></el-col>
                            <el-col :span="24"><div class="grid-content task-info">店铺装修 <span><i :class="scope.row.shop_decoration == 1?'el-icon-check icon-correct':'el-icon-close icon-error'"></i></span></div></el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="店铺标签">
                    <template slot-scope="scope">
                        {{ handleLabel(scope.row.label) }}
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="店铺状态">
                    <template slot-scope="scope">
                        <span :class="scope.row.shop_close == 1?'icon-correct':'icon-error'">{{ shopClose[scope.row.shop_close] }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="175">
                    <template slot-scope="scope">
                        <el-row>
                            <el-tooltip class="item" effect="dark" content="查看" placement="top">
                                <el-button type="success" icon="el-icon-view" size="mini" circle
                                           @click="$router.push('/seller/shopDetail?tag=shopInfo&shop_id='+scope.row.shop_id)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <el-button type="primary" icon="el-icon-edit" circle @click="$router.push('/seller/shopDetail?tag=shopInfo&type=edit&shop_id='+scope.row.shop_id)" size="mini"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="入驻信息" placement="top">
                                <el-button type="danger" icon="el-icon-s-shop" size="mini" circle
                                           @click="$router.push('/seller/storeJoinInfo?id='+scope.row.shop_id)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="店铺日志" placement="top">
                                <el-button icon="el-icon-document" circle @click="$router.push('/seller/shopDetail?tag=storeShopLog&shop_id='+scope.row.shop_id)" size="mini"></el-button>
                            </el-tooltip>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pages_footer white" v-if="tableData.count > 0">
                <el-row>
                    <el-col :span="2">
                        <el-button plain size="mini" @click="setLevel">设置店铺等级</el-button>
                    </el-col>
                    <el-col :span="20">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="tableData.current_pages"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="formInline.size"
                            layout="total, prev, pager, next, jumper"
                            :total="tableData.count">
                        </el-pagination>
                    </el-col>
                    <el-col :span="2"></el-col>
                </el-row>
            </div>
            <el-dialog title="设置店铺等级" :visible.sync="dialogVisible" width="30%">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="店铺等级" prop="rank_status">
                        <el-select v-model="form.rank_status" size="mini">
                            <el-option
                                    v-for="(item,index) in rankStatusOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="editLevel" size="mini">保存</el-button>
                        <el-button @click="dialogVisible = false" size="mini">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { AFTER_TYPE, AFTER_STATUS } from "../../config/order";
    import { RANK_STATUS, SHOP_CLOSE, OPEN_STATUS, RANK_STATUS_OPTION, SHOP_CLOSE_OPTION, OPEN_STATUS_OPTION, SHOP_LOGS, SHOP_LOGS_OPTION } from "../../config/seller";

    export default {
        data () {
            return {
                ppy_host:CUSTOM_CONFIG.PPY_HOST,
                activeName: 'all',
                afterType: AFTER_TYPE,
                shopLogs: SHOP_LOGS,
                shopLogsOption: SHOP_LOGS_OPTION,
                afterStatus: AFTER_STATUS,
                rankStatus: RANK_STATUS,
                shopClose: SHOP_CLOSE,
                openStatus: OPEN_STATUS,
                rankStatusOption: RANK_STATUS_OPTION,
                shopCloseOption: SHOP_CLOSE_OPTION,
                openStatusOption: OPEN_STATUS_OPTION,
                tableData: {
                    total_pages: 0,
                    count: 0,
                    current_pages: 1,
                    result: []
                },
                loading: false,
                formInline:{
                    label: '',
                    shop_name: '',
                    user: '',
                    open_status: '',
                    company_name: '',
                    shop_close: '',
                    rank_status: '',
                    task_status: '',
                    create_time: [],
                    size: 10,
                    page: 1
                },
                form: {
                    rank_status: ''
                },
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
                },
                fit: 'contain',
                errorMessage: '',
                shop_ids: [],
                dialogVisible: false
            }
        },
        created(){
            this.shop_list(this.formInline)
        },
        methods: {
            async shop_list(parameter){
                this.loading = true
                let params =  JSON.parse(JSON.stringify(parameter))
                if(params.create_time && params.create_time.length == 2){
                    params.start_date = params.create_time[0]
                    params.end_date = params.create_time[1]
                    delete params.create_time
                }
                if(parameter.user){
                    let user_param = {}
                    if(this.isPhone(parameter.user)){
                        user_param = { 'mobile': parameter.user }
                    }else if(this.isEmail(parameter.user)){
                        user_param = { 'email': parameter.user }
                    }else{
                        this.tableData= {
                            total_pages: 0,
                                count: 0,
                                current_pages: 1,
                                result: []
                        }
                        this.loading = false
                        return false
                    }
                    //获取用户id
                    let userInfo = await this.$request.get(this.$API.common_api,user_param,'main',{
                        router_path: 'zt/users',
                        request_host: 'MEMBER_USER_HOST',
                    });
                    if( userInfo.code == 200 ){
                        params.user_id = userInfo.data.data[0].user_id
                    }else{
                        this.loading = false
                        return false
                    }
                }
                let data = await this.$request.get(this.$API.common_api,params,'main',{
                    router_path: 'seller/shops',
                    request_host: 'APP_SELLER_SERVER_HOST',
                    handle_desc: '查看店铺列表;'
                });
                if( data.code == 200 ){
                    this.tableData = data.data
                }
                this.loading = false
            },
            /*电话号码正则表达式*/
            isPhone(str){
                let reg= 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
                if(reg.test(str)){
                    return true
                }else{
                    return false
                }
            },
            /*邮箱正则表达式*/
            isEmail(str){
                let regEmail= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if(regEmail.test(str)){
                    return true
                }else{
                    return false
                }
            },
            onSubmit() {
                this.formInline.page = 1
                this.shop_list(this.formInline)
            },

            handleSizeChange(val) {
                this.formInline.size = val
                this.shop_list(this.formInline)
            },

            handleCurrentChange(val) {
                this.formInline.page = val
                this.shop_list(this.formInline)
            },
            clickJump(url){
                this.$router.push(url)
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.shop_list(this.formInline)
            },
            handleSelectionChange(shops) {
                if(this.dialogVisible == false){
                    this.shop_ids = []
                    if(shops.length != 0){
                        shops.forEach((item) => {
                            this.shop_ids.push(item.shop_id)
                        })
                    }
                }
            },
            success() {
                this.$message({
                    showClose: true,
                    message: '操作成功',
                    type: 'success'
                });
            },
            fail() {
                this.$message({
                    showClose: true,
                    message: this.errorMessage,
                    type: 'error'
                });
            },
            async setLevel(){
                if(this.shop_ids.length == 0) {
                    this.errorMessage = '请勾选需要设置等级的店铺'
                    this.fail()
                    return false
                }
                this.dialogVisible = true
            },
            async editLevel(){
                let data = await this.$request.request(this.$API.common_api, this.form, 'main', 'PUT', {
                    router_path: 'store/editShopLevel',
                    request_host: 'STORE_SERVER_HOST',
                    extra_url: '?shop=[' + this.shop_ids.join(',') + ']',
                    handle_desc: '修改店铺等级shop_ids=[' + this.shop_ids.join(',') + '];'
                })
                if( data.code == 200 ){
                    this.dialogVisible = false
                    this.success()
                    this.shop_list(this.formInline)
                }
            },
            async exportShop(){
                if(this.shop_ids.length==0){
                    this.errorMessage = '请选择需要导出的数据'
                    this.fail()
                }else {
                    window.location.href = this.ppy_host+'/api/application_seller/se_store/exportbaseinfo/?shop_id_list=' + '[' + this.shop_ids.join(',') + ']'
                }
            },
            handleLabel(value){
                if(value){
                    let labelArr = value.split(',');
                    let labels = []

                    labelArr.forEach(item => {
                        labels.push(this.shopLogs[item])
                    })
                    return labels.join(',')
                }
                return '无'
            }
        },
        filters:{
            isNull(value){
                if(value){
                    return value;
                }
                return '无';
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/pageHeader";

    .content {
        width: 100%;
        background: #eeeeee;
        border-bottom: 1px #eeeeee solid;
        border-radius: 5px;

        .table-content {
            margin: 0 15px;
            .order_tabs{
                padding: 0 10px;
            }
            .task-info {
                line-height: 20px;
            }
            p {
                margin: 0;
            }
        }
        /*------表单搜索-----*/
        .form-search{
            width: calc(100% - 60px);
            margin: 17px 15px;
            padding: 15px;
            background: #fff;
            border-radius: @contentBorderRadius;
            box-shadow: @contentBoxShadow;
            .el-form-item {
                margin-bottom: 10px;
            }
        }
        .white {
            background: #ffffff;
        }

        .pages_footer {
            padding: 10px;
            text-align: center;
        }
        .icon-correct{
            color: #2A904C;
        }
        .icon-error{
            color: #DD0919;
        }
    }
</style>
