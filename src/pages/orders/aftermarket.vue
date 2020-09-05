<template>
    <div class="content">
        <!--        <div class="pages-header">-->
        <!--            <div>售后订单</div>-->
        <!--        </div>-->
        <div class="form-search">
            <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="订单号" prop="order_sn">
                    <el-input v-model="formInline.order_sn" placeholder="订单号" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="用户ID" prop="buyer_id">
                    <el-input v-model="formInline.buyer_id" placeholder="用户ID" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="售后类型" prop="after_type">
                    <el-select v-model="formInline.after_type" placeholder="售后类型" size="mini">
                        <el-option label="仅退款" value="0"></el-option>
                        <el-option label="退款退货" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下单时间" prop="create_time">
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
            <el-tabs v-model="activeName" @tab-click="handleClick" class="white order_tabs">
                <el-tab-pane label="全部订单" name="all">
                    <el-table :data="tableData.data" border style="width: 100%" v-loading="loading"
                              @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号"></el-table-column>
                        <el-table-column prop="after_type" label="申请类型">
                            <template slot-scope="scope">
                                {{ afterType[scope.row.after_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="order_goods.goods_name" label="申请商品"></el-table-column>
                        <el-table-column label="申请金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="申请状态">
                            <template slot-scope="scope">
                                {{ afterStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="申请时间"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/aftermarketDetail',query: {after_id:scope.row.id,buyer_id:scope.row.buyer_id}}))">查看详情</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="处理中" name="processing">
                    <el-table :data="tableData.data" border style="width: 100%" v-loading="loading"
                              @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号"></el-table-column>
                        <el-table-column prop="after_type" label="申请类型">
                            <template slot-scope="scope">
                                {{ afterType[scope.row.after_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="order_goods.goods_name" label="申请商品"></el-table-column>
                        <el-table-column label="申请金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="申请状态">
                            <template slot-scope="scope">
                                {{ afterStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="申请时间"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/aftermarketDetail',query: {after_id:scope.row.id,buyer_id:scope.row.buyer_id}}))">查看详情</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="售后成功" name="afterSuccess">
                    <el-table :data="tableData.data" border style="width: 100%" v-loading="loading"
                              @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号"></el-table-column>
                        <el-table-column prop="after_type" label="申请类型">
                            <template slot-scope="scope">
                                {{ afterType[scope.row.after_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="order_goods.goods_name" label="申请商品"></el-table-column>
                        <el-table-column label="申请金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="申请状态">
                            <template slot-scope="scope">
                                {{ afterStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="申请时间"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/aftermarketDetail',query: {after_id:scope.row.id,buyer_id:scope.row.buyer_id}}))">查看详情</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="售后失败" name="afterFail">
                    <el-table :data="tableData.data" border style="width: 100%" v-loading="loading"
                              @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号"></el-table-column>
                        <el-table-column prop="after_type" label="申请类型">
                            <template slot-scope="scope">
                                {{ afterType[scope.row.after_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="order_goods.goods_name" label="申请商品"></el-table-column>
                        <el-table-column label="申请金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="申请状态">
                            <template slot-scope="scope">
                                {{ afterStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="申请时间"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/aftermarketDetail',query: {after_id:scope.row.id,buyer_id:scope.row.buyer_id}}))">查看详情</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
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
    import {AFTER_TYPE, AFTER_STATUS} from '../../config/order'
    // import custom_config from '@/../custom_config.js';

    export default {
        data() {
            return {
                ppy_host: CUSTOM_CONFIG.PPY_HOST,
                activeName: 'all',
                afterType: AFTER_TYPE,
                afterStatus: AFTER_STATUS,
                activeList: {
                    'all': '',
                    'processing': 1, //处理中
                    'afterSuccess': 4, //售后成功
                    'afterFail': 0, //售后失败
                },
                tableData: {
                    page_total: 0,
                    total: 0,
                    page_index: 1,
                    data: []
                },
                loading: false,
                formInline: {
                    order_sn: '',
                    buyer_id: '',
                    after_type: '',
                    create_time: [],
                    start_time: '',
                    end_time: '',
                    size: 10,
                    page: 1
                },
                orderExportParams: {
                    after_id_list: '',
                },
                after_id_list: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                },
                fit: 'contain',
                multipleSelection: [],
                exportOrderUrl: ''
            }
        },
        created() {
            this.order_list(this.formInline)
        },
        methods: {
            async order_list(parameter) {
                this.loading = true
                let params = JSON.parse(JSON.stringify(parameter))
                if (params.create_time && params.create_time.length == 2) {
                    params.start_time = Math.round(new Date(params.create_time[0]).getTime() / 1000)
                    params.end_time = Math.round(new Date(params.create_time[1]).getTime() / 1000)
                }
                let data = await this.$request.get(this.$API.common_api, params, 'main', {
                    router_path: 'orders/afterMarker',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: '查看售后订单;'
                })
                if (data.code == 200) {
                    this.tableData = data.data
                }
                this.loading = false
            },
            onSubmit() {
                this.formInline.page = 1
                this.order_list(this.formInline)
            },

            handleClick(tab, event) {
                this.formInline.status = this.activeList[tab.name]
                this.formInline.page = 1
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
            clickJump(routeUrl){
                window.open(routeUrl .href, '_blank');
            },
            handleSelectionChange(orders) {
                //初始化参数数组
                this.after_id_list = []

                if (orders.length == 0) {
                    //不做操作
                } else {
                    for (let order of orders) {
                        this.after_id_list.push(order.id)
                    }
                }
            },
            async exportOrder() {
                if (this.after_id_list.length == 0) {
                    this.errorMessage = '请选择需要导出的数据'
                    this.fail()
                } else {
                    this.orderExportParams.after_id_list = '[' + this.after_id_list.join(',') + ']'
                    let data = await this.$request.get(this.$API.common_api, this.orderExportParams, 'main', {
                        router_path: 'orders/afterExport',
                        request_host: 'ORDERS_SERVER_HOST',
                        handle_desc: '导出售后订单;'
                    })
                    if (data.code == 200) {
                        window.location.href = this.ppy_host + '/api/server_order/export_excel?file_name=' + data.data
                    } else {
                        this.errorMessage = '导出失败'
                        this.fail()
                    }
                }
            },
            success() {
                this.$message({
                    showClose: true,
                    message: '操作成功',
                    type: 'success'
                })
            },
            fail() {
                this.$message({
                    showClose: true,
                    message: this.errorMessage,
                    type: 'error'
                })
            },
            resetForm(formName) {
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

        /*------表单搜索-----*/

        .form-search {
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

            .order_tabs {
                padding: 0 10px;
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
                width: 100%;
                display: block;
            }
        }

        .pages_footer {
            padding: 10px;
            text-align: center;
        }
    }
</style>
