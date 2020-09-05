<template>
    <div class="content">
        <div class="pages-header">
            <div>使用数据</div>
        </div>
        <div class="form-search">
            <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="使用时间" prop="create_time">
                    <el-date-picker
                            v-model="formInline.create_time"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right" size="mini">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">筛选</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" @click="exportOrder">导出订单</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="text" @click="resetForm('formInline')" size="mini">清空筛选条件</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-content">
            <el-table ref="all" :data="tableData.data" height="750" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
<!--                <el-table-column type="selection" width="40"></el-table-column>-->
                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="mobile" label="手机号码"></el-table-column>
                <el-table-column prop="pay_time" label="使用时间"></el-table-column>
                <el-table-column prop="order_sn" label="订单号"></el-table-column>
                <el-table-column label="优惠金额">
                    <template slot-scope="scope">
                        ¥{{ scope.row.coupons }}
                    </template>
                </el-table-column>
                <el-table-column label="支付金额">
                    <template slot-scope="scope">
                        ¥{{ scope.row.should_money }}
                    </template>
                </el-table-column>
                <el-table-column prop="shop_name" label="门店"></el-table-column>
            </el-table>
            <div class="pages_footer white" v-if="tableData.total > 0">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="tableData.page_index"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="formInline.size"
                        layout="total, prev, pager, next, jumper"
                        :total="tableData.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {AFTER_TYPE, AFTER_STATUS, PAY_TYPE, PAY_TYPE_OPTION, PAY_RESULT} from "../../config/order";
    import { SETTLEMENT_STATUS, SETTLEMENT_STATUS_TAB } from "../../config/seller";

    export default {
        data () {
            return {
                activeName: 'all',
                ppy_host:CUSTOM_CONFIG.PPY_HOST,
                afterType: AFTER_TYPE,
                afterStatus: AFTER_STATUS,
                payType: PAY_TYPE,
                payTypeOption: PAY_TYPE_OPTION,
                settlementStatus: SETTLEMENT_STATUS,
                settlementStatusTab: SETTLEMENT_STATUS_TAB,
                payResult: PAY_RESULT,
                tableData: {
                    page_total: 0,
                    total: 0,
                    page_index: 1,
                    data: []
                },
                loading: false,
                formInline:{
                    order_sn: '',
                    shop_name: '',
                    pay_type: '',
                    create_time: [],
                    start_time: '',
                    end_time: '',
                    pay_status: '',
                    size: 10,
                    page: 1
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
                id_list: [],
                current_page_id_list: [],
                errorMessage: '',
                tabAll: '',
                tabName: {},
            }
        },
        created(){
            this.order_list(this.formInline)
        },
        methods: {
            checked(){
                this.tableData.data.forEach((item,index) => {
                    if (this.id_list.includes(item.id)){
                        this.$nextTick(()=>{
                            this.$refs[this.activeName].toggleRowSelection(this.tableData.data[index],true)
                        })
                    }
                })
            },
            async order_list(parameter){
                this.loading = true
                // 初始化当前页的id列表
                this.current_page_id_list = []
                let params =  JSON.parse(JSON.stringify(parameter))
                if(params.create_time && params.create_time.length == 2){
                    params.create_start_time = Math.round(new Date(params.create_time[0]).getTime()/1000)
                    params.create_end_time = Math.round(new Date(params.create_time[1]).getTime()/1000)
                }
                let data = await this.$request.get(this.$API.common_api,params,'main',{
                    router_path: 'operate/preferentialPayment',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: '查看优惠买单列表;'
                });
                if( data.code == 200 ){
                    this.tableData = data.data
                    this.tabName =  JSON.parse(JSON.stringify(this.settlementStatus))
                    this.tableData.data.forEach((item,index) => {
                        this.current_page_id_list.push(item.id)
                    })
                    this.checked()
                }
                this.loading = false
            },
            onSubmit() {
                this.formInline.page = 1
                this.id_list = []
                this.order_list(this.formInline)
            },

            handleSizeChange(val) {
                this.formInline.size = val
                this.order_list(this.formInline)
            },

            handleCurrentChange(val) {
                this.formInline.page = val
                this.order_list(this.formInline)
            },
            clickJump(url){
                this.$router.push(url)
            },
            //乘法运算
            floatMul(arg1,arg2){
                let m=0,s1=arg1.toString(),s2=arg2.toString();
                try{m+=s1.split(".")[1].length}catch(e){}
                try{m+=s2.split(".")[1].length}catch(e){}
                return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
            },
            handleSelectionChange(orders) {
                let page_id_list = JSON.parse(JSON.stringify(this.current_page_id_list))
                if(orders.length){
                    orders.forEach((item) => {
                        this.arrayRemoveItem(page_id_list,item.id)
                        if(!this.id_list.includes(item.id)){
                            this.id_list.push(item.id)
                        }
                    })
                    if (page_id_list.length){
                        page_id_list.forEach((item) => {
                            this.arrayRemoveItem(this.id_list,item)
                        })
                    }
                }else{
                    page_id_list.forEach((item) => {
                        this.arrayRemoveItem(this.id_list,item)
                    })
                }
            },
            arrayRemoveItem(arr, delVal) {
                if (arr instanceof Array) {
                    var index = arr.indexOf(delVal);
                    if (index > -1) {
                        arr.splice(index, 1);
                    }
                }
            },
            fail() {
                this.$message({
                    showClose: true,
                    message: this.errorMessage,
                    type: 'error'
                });
            },
            async exportOrder(){
                // if(this.id_list.length==0){
                    let params =  JSON.parse(JSON.stringify(this.formInline))
                    if(params.create_time && params.create_time.length == 2){
                        params.create_start_time = Math.round(new Date(params.create_time[0]).getTime()/1000)
                        params.create_end_time = Math.round(new Date(params.create_time[1]).getTime()/1000)
                    }
                    let data = await this.$request.get(this.$API.common_api, params, 'main', {
                        router_path: 'operate/preferentialPaymentExport',
                        request_host: 'ORDERS_SERVER_HOST',
                        handle_desc: '导出优惠买单;'
                    });
                    if (data.code == 200) {
                        window.location.href = this.ppy_host+'/api/server_order/export_excel?file_name='+data.data
                    }
                // }else {
                //     this.orderExportParams.order_list = '[' + this.id_list.join(',') + ']'
                //     let data = await this.$request.get(this.$API.common_api, this.orderExportParams, 'main', {
                //         router_path: 'operate/preferentialPaymentExport',
                //         request_host: 'ORDERS_SERVER_HOST',
                //         handle_desc: '导出优惠买单;'
                //     });
                //     if (data.code == 200) {
                //         window.location.href = this.ppy_host+'/api/server_order/export_excel?file_name='+data.data
                //     }
                // }
            },
            resetForm(formName) {
                this.id_list = []
                this.$refs[formName].resetFields();
                this.order_list(this.formInline)
            }
        },
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
        }

        .white {
            background: #ffffff;
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

        .goods-img {
            width: 100px;
            display: inline-block;
            background: #ffffff;
        }

        .goods-info {
            width: 214px;
            display: inline-block;
            span {
                float: left;
                margin-left: 10px;
                width:100%;
                display: block;
            }
        }
        .pages_footer {
            padding: 10px;
            text-align: center;
        }
    }
</style>
