<template>
    <div class="content">
<!--        <div class="pages-header">-->
<!--            <div>退款订单</div>-->
<!--        </div>-->
        <div class="form-search">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="订单号">
                    <el-input v-model="formInline.order_sn" placeholder="订单号" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="申请用户">
                    <el-input v-model="formInline.buyer_id" placeholder="用户ID" size="mini"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" @click="exportOrder">导出订单</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-content">
            <div class="order_tabs white" v-loading="loading">
                <el-table :data="tableData.data" border style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="order_sn" label="订单号"></el-table-column>
                    <el-table-column label="申请金额">
                        <template slot-scope="scope">
                            ¥{{ scope.row.money }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="buyer_id" label="申请用户"></el-table-column>
                    <el-table-column prop="reason" label="申请原因"></el-table-column>
                    <el-table-column prop="cause" label="申请理由"></el-table-column>
                    <el-table-column prop="create_time" label="申请时间"></el-table-column>
                    <el-table-column label="处理状态">
                        <template slot-scope="scope">
                            {{ returnStatus[scope.row.status] }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="operation" label="操作">
                        <template slot-scope="scope">
                            <el-row>
                                <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/returnDetail',query: {order_sn:scope.row.order_sn,refund_id:scope.row.refund_id}}))">查看详情</el-button>
                            </el-row>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
    import { RETURN_STATUS } from "../../config/order";
    // import custom_config from '@/../custom_config.js'

    export default {
        data () {
            return {
                ppy_host:CUSTOM_CONFIG.PPY_HOST,
                loading: false,
                returnStatus: RETURN_STATUS,
                activeName: 'all',
                tableData: {
                    page_total: 0,
                    total: 0,
                    page_index: 1,
                    data: [{
                        id: '',
                        pay_sn: '',
                        order_id: 0,
                        buyer_id: 0,
                        reason: '',
                        cause: '',
                        create_time: '',
                        status: '',
                        money: 0.00,
                    }]
                },
                formInline:{
                    order_sn: '',
                    buyer_id: '',
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
                value1: [new Date(2018, 9, 1, 0, 0), new Date()],
                value2: '',
                currentPage: 1,
                fit: 'contain',
                errorMessage: '',
                orderExportParams:{
                    refund_id_list: '',
                },
                refund_id_list: []
            }
        },
        created(){
            this.order_list(this.formInline)
        },
        methods: {
            async order_list(parameter){
                this.loading = true
                let data = await this.$request.get(this.$API.common_api,parameter,'main',{
                    router_path: 'orders/refunds',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: '查看退款订单列表;'
                })
                if( data.code == 200 ){
                    this.tableData = data.data
                }
                this.loading = false
            },
            onSubmit() {
                this.formInline.page = 1
                this.order_list(this.formInline)
            },
            handleSizeChange(val) {
                this.formInline.size = val
                this.order_list(this.formInline)
            },
            handleSelectionChange(orders) {
                //初始化参数数组
                this.refund_id_list = []

                if(orders.length == 0){
                    //不做操作
                }else{
                    for( let order of orders){
                        this.refund_id_list.push(order.id)
                    }
                }
            },
            async exportOrder(){
                if(this.refund_id_list.length==0){
                    this.errorMessage = '请选择需要导出的数据'
                    this.fail()
                }else {
                    this.orderExportParams.refund_id_list = '[' + this.refund_id_list.join(',') + ']'
                    let data = await this.$request.get(this.$API.common_api, this.orderExportParams, 'main', {
                        router_path: 'orders/refundExport',
                        request_host: 'ORDERS_SERVER_HOST',
                        handle_desc: '导出退款订单;'
                    });
                    if (data.code == 200) {
                        window.location.href = this.ppy_host+'/api/server_order/export_excel?file_name='+data.data
                    }else{
                        this.errorMessage = '导出失败'
                        this.fail()
                    }
                }
            },
            handleCurrentChange(val) {
                this.formInline.page = val
                this.order_list(this.formInline)
            },
            clickJump(routeUrl){
                window.open(routeUrl .href, '_blank');
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
        .table-content {
            margin: 0 15px;
            .order_tabs{
                padding: 5px 10px;
            }
        }

        .white {
            background: #ffffff;
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
