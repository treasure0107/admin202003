<template>
    <div class="content">
<!--        <div class="pages-header">-->
<!--            <div>店铺管理</div>-->
<!--        </div>-->
        <div class="form-search">
            <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="商家名称" prop="shop_name">
                    <el-input v-model="formInline.shop_name" placeholder="商家名称" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="店铺类型" prop="shop_type">
                    <el-select v-model="formInline.shop_type" size="mini">
                        <el-option
                                v-for="(item,index) in openStatusOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">筛选</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="text" size="mini" @click="resetForm('formInline')">清空筛选条件</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-content">
            <el-table :data="tableData.data" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
<!--                <el-table-column type="selection" width="50"></el-table-column>-->
                <el-table-column prop="shop_id" label="序号" width="50"></el-table-column>
                <el-table-column prop="shop_name" label="商家名称" width="165"></el-table-column>
                <el-table-column prop="user_name" label="申请人"></el-table-column>
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column label="申请时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.create_time>0">{{ scope.row.create_time | formatDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="train_content" label="培训通知内容"></el-table-column>
                <el-table-column prop="notice_man" label="通知人"></el-table-column>
                <el-table-column label="通知时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.notice_time>0">{{ scope.row.notice_time | formatDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.operation == 0" type="text" size="mini" @click="setNotice(scope.row.shop_id)">培训通知</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pages_footer white" v-if="tableData.count > 0">
                <el-row>
                    <el-col :span="24">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="tableData.current_pages"
                            :page-size="formInline.size"
                            layout="total, prev, pager, next, jumper"
                            :total="tableData.count">
                        </el-pagination>
                    </el-col>
                    <el-col :span="2"></el-col>
                </el-row>
            </div>
            <el-dialog title="培训通知" :visible.sync="dialogVisible" width="30%">
                <el-form ref="form" :rules="rules" :model="form">
                    <el-form-item label="" prop="train_content">
                        <el-input type="textarea" v-model="form.train_content" placeholder="请输入通知内容"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="trainNotice" size="mini">保存</el-button>
                        <el-button @click="dialogVisible = false" size="mini">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { AFTER_TYPE, AFTER_STATUS } from "../../config/order";
    import { RANK_STATUS, SHOP_CLOSE, OPEN_STATUS, RANK_STATUS_OPTION, SHOP_CLOSE_OPTION, OPEN_STATUS_OPTION } from "../../config/seller";

    export default {
        data () {
            return {
                ppy_host:CUSTOM_CONFIG.PPY_HOST,
                activeName: 'all',
                afterType: AFTER_TYPE,
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
                rules: {
                    train_content: [
                        {required: true, message: '请输入通知内容', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                },
                loading: false,
                formInline:{
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
                    train_content: '',
                    notice_man: '',
                    shop_id: '',
                    admin_id: ''
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
                dialogVisible: false,
                shopId: ''
            }
        },
        created(){
            this.join_list(this.formInline)
        },
        methods: {
            setNotice(shopId){
                this.form.shop_id = shopId
                this.form.notice_man = this.$common.getNowUserId(false)['user_name']
                this.form.admin_id = parseInt(this.$common.getNowUserId(false)['admin_id'])
                this.dialogVisible = true
            },
            async join_list(parameter){
                this.loading = true
                let params =  JSON.parse(JSON.stringify(parameter))
                if(params.create_time && params.create_time.length == 2){
                    params.start_date = params.create_time[0]
                    params.end_date = params.create_time[1]
                    delete params.create_time
                }
                let data = await this.$request.get(this.$API.common_api,params,'main',{
                    router_path: 'seller/joinTrain',
                    request_host: 'APP_SELLER_SERVER_HOST',
                    handle_desc: '查看培训报名列表;'
                });
                if( data.code == 200 ){
                    this.tableData = data.data
                }
                this.loading = false
            },
            onSubmit() {
                this.formInline.page = 1
                this.join_list(this.formInline)
            },

            handleSizeChange(val) {
                this.formInline.size = val
                this.join_list(this.formInline)
            },

            handleCurrentChange(val) {
                this.formInline.page = val
                this.join_list(this.formInline)
            },
            clickJump(url){
                this.$router.push(url)
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.join_list(this.formInline)
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
            trainNotice(){
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let data = await this.$request.post(this.$API.common_api,this.form,'main',{
                            router_path: 'seller/setJoinTrain',
                            request_host: 'APP_SELLER_SERVER_HOST',
                            handle_desc: '设置培训通知内容;' + this.form.shop_id
                        })
                        if( data.code == 200 ){
                            this.dialogVisible = false
                            this.success()
                            this.join_list(this.formInline)
                        }
                    } else {
                        return false;
                    }
                });

            },
        },
        filters:{
            /**
             * 时间转化
             * @param time
             * @returns {string}
             */
            formatDate (time) {
                let times = time * 1000
                let date = new Date(times)
                let Y = date.getFullYear() + '-'
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
                let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
                let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
                let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
                let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
                return Y + M + D + h + m + s
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
