<template>
    <div class="content">
        <div class="pages-header">
            <el-page-header @back="goBack" content="详情页面"></el-page-header>
        </div>
        <div class="table-content" :data="orderInfo">
            <el-row>
                <el-col :span="24"><div class="grid-content">
                    <div>
                        <span class="demonstration"><span class="font_red">*</span> 用户在商品未发货状态申请退款，同意申请后订单取消，平台将款项按支付方式原路返回至买家付款账户</span>
                    </div>
                </div></el-col>
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>退款信息</span></div>
                <el-col :span="24"><div class="grid-content">
                    <div><span>退款原因:{{ orderInfo.reason }}</span></div>
                    <div><span>退款理由:{{ orderInfo.cause }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div v-for="image in orderInfo.images" class="images">
                        <el-image
                                style="width: 100px; height: 100px"
                                :src="image.image_path"
                                :fit="fit"></el-image>
                    </div>
                </div></el-col>
            </el-row>
            <el-row class="tab-border" v-if="orderInfo.status==1">
                <div class="order_tag"><span>操作信息</span></div>
                <el-col :span="8"><div class="grid-content">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="80px">
                        <el-input type="textarea" v-model="formInline.desc"></el-input>
                        <el-form-item>
                            <el-button type="primary" @click="primary = true" size="mini">同意申请</el-button><el-button @click="danger = true" size="mini">拒绝申请</el-button>
                        </el-form-item>
                    </el-form>
                </div></el-col>
            </el-row>
            <el-dialog
                    title="同意申请"
                    :visible.sync="primary"
                    width="30%">
                <span>确认同意取消订单申请？</span>
                <span>同意申请后，平台将款项按支付方式原路返回至买家付款账号</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="primary = false">取 消</el-button>
                    <el-button type="primary" @click="primaryReturn">确 定</el-button>
                    </span>
            </el-dialog>
            <el-dialog
                    title="拒绝申请"
                    :visible.sync="danger"
                    width="30%">
                <span>确认拒绝取消订单申请？</span>
                <el-form ref="form" :model="formInline" label-width="80px">
                    <el-input type="textarea" v-model="formInline.cause" placeholder="拒绝理由 0/200字"></el-input>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="danger = false">取 消</el-button>
                    <el-button type="primary" @click="dangerReturn">确 定</el-button>
                    </span>
            </el-dialog>
            <el-row class="tab-border">
                <div class="order_tag"><span>商品信息</span></div>
                <el-table :data="orderInfo.order_goods" border style="width: 100%">
                    <el-table-column label="商品信息">
                        <template slot-scope="scope">
                            <div class="goods-info-child goods-img">
                                <el-image
                                        style="width: 110px; height: 110px"
                                        :src="scope.row.goods_img"
                                        :fit="fit"></el-image>
                            </div>
                            <div class="goods-info-child goods-name">
                                <p :title="scope.row.goods_name" class="string-show-tow">{{ scope.row.goods_name }}</p>
                                <p :title="scope.row.goods_classify" class="string-show-tow">{{ scope.row.goods_classify }}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品单价">
                        <template slot-scope="scope">
                            <span>¥{{ scope.row.unit_price }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品数量">
                        <template slot-scope="scope">
                            <span v-if="scope.row.goods_number >0">x{{ scope.row.goods_number }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品总价">
                        <template slot-scope="scope">
                            <span>¥{{ scope.row.total_price }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>基本信息</span></div>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>付款时间:</span></div>
                    <div class="order_value"><span>{{ orderInfo.order_chargs.pay_time }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>下单时间:</span></div>
                    <div class="order_value"><span>{{ orderInfo.create_time }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>配送费用:</span></div>
                    <div class="order_value"><span>¥{{ orderInfo.order_chargs.shop_coupons }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>流水号:</span></div>
                    <div class="order_value"><span>{{ orderInfo.pay_sn }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>购货人:</span></div>
                    <div class="order_value"><span>{{ orderInfo.buyer_id }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>申请时间:</span></div>
                    <div class="order_value"><span>{{ orderInfo.create_time }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>申请原因:</span></div>
                    <div class="order_value"><span>{{ orderInfo.cause }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>申请理由:</span></div>
                    <div class="order_value"><span>{{ orderInfo.reason }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>订单号:</span></div>
                    <div class="order_value"><span>{{ orderInfo.order_sn }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>订单金额:</span></div>
                    <div class="order_value"><span>¥{{ orderInfo.order_chargs.paid_money }}</span></div>
                </div></el-col>
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>收货人信息</span></div>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>收货人:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.consignee }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>手机号码:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.mobile }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>送货时间:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.create_time }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>收货地址:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.address }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>电子邮件:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.email }}</span></div>
                </div></el-col>
<!--                <el-col :span="4"><div class="grid-content">-->
<!--                    <div class="order_attr"><span>电话号码:</span></div>-->
<!--                    <div class="order_value"><span>{{ orderInfo.shopping_info.consignee }}</span></div>-->
<!--                </div></el-col>-->
<!--                <el-col :span="4"><div class="grid-content">-->
<!--                    <div class="order_attr"><span>地址别名:</span></div>-->
<!--                    <div class="order_value"><span>家</span></div>-->
<!--                </div></el-col>-->
<!--                <el-col :span="4"><div class="grid-content">-->
<!--                    <div class="order_attr"><span>买家留言:</span></div>-->
<!--                    <div class="order_value"><span>买家留言</span></div>-->
<!--                </div></el-col>-->
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>操作日志</span></div>
                <el-table :data="orderInfo.traces" border style="width: 100%">
                    <el-table-column prop="creator_id" label="操作人ID"></el-table-column>
                    <el-table-column prop="create_time" label="操作时间"></el-table-column>
                    <el-table-column prop="operation" label="操作"></el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                </el-table>
            </el-row>
            <el-row class="tab-border" v-if="orderInfo.status ==2">
                <div class="order_tag"><span>退款进度</span></div>
                <el-col :span="24"><div class="grid-content">
                    <div><span>退款进度: {{ returnStatus[orderInfo.status] }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>退回账户: {{ payType[orderInfo.pay_type] }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>退款进度:</span></div>
                </div></el-col>
                <el-col :span="7"><div class="grid-content">
                    <div class="block">
                        <el-timeline :reverse="reverse">
                            <el-timeline-item
                                    v-for="(trace, index) in orderInfo.traces"
                                    :key="index"
                                    :timestamp="trace.remark">
                                {{ trace.operation }}
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div></el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import { PAY_TYPE, RETURN_STATUS } from "../../config/order";

    export default {
        data () {
            return {
                returnStatus: RETURN_STATUS,
                payType: PAY_TYPE,
                errorMessage: '',
                formInline: {
                    danger_reason: '',
                    desc: '',
                    cause: ''
                },
                danger: false,
                primary: false,
                orderInfo: {
                    order_sn: '',
                    cause: '',
                    images: [],
                    order_chargs:{
                        pay_time: '',
                        shopping_money: '',
                        pay_sn: ''
                    },
                    shopping_info: {},
                    order_goods: [],
                    traces: []
                },
                reverse: false,
                fit: 'contain'
            }
        },
        created(){
            this.order_detail()
        },
        methods: {
            //获取订单详情
            async order_detail(){
                let parameter = {'order_sn': this.$route.query.order_sn,'refund_id': this.$route.query.refund_id};
                let data = await this.$request.get(this.$API.common_api,parameter,'main',{
                    router_path: 'orders/return',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: '查看退款订单;' + this.$route.query.refund_id
                })
                if( data.code == 200 ){
                    this.orderInfo = data.data
                    this.orderInfo.order_sn = this.$route.query.order_sn
                }else{
                    this.errorMessage = data.msg
                    this.fail()
                }
            },
            //同意退款申请
            async primaryReturn(){
                let parameter = {'order_sn':this.$route.query.order_sn};
                let data = await this.$request.post(this.$API.common_api,parameter,'main',{
                    router_path: 'orders/confirmRefund',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: '同意退款申请;' + this.orderInfo.id
                })
                if( data.code == 200 ){
                    this.order_detail()
                    this.success();
                }else{
                    this.errorMessage = data.msg
                    this.fail();
                }
                this.primary = false
            },
            //拒绝退款申请
            async dangerReturn(){
                if(this.formInline.cause){
                    let parameter = {order_sn: this.$route.query.order_sn, cause: this.formInline.cause};
                    let data = await this.$request.request(this.$API.common_api,parameter,'main','PUT',{
                        router_path: 'orders/cancelRefund',
                        request_host: 'ORDERS_SERVER_HOST',
                        handle_desc: '拒绝退款申请;' + this.orderInfo.id
                    })
                    if( data.code == 200 ){
                        this.success();
                        this.order_detail()
                    }else{
                        this.errorMessage = data.msg
                        this.fail();
                    }
                    this.danger = false
                }else{
                    this.errorMessage = '请填写拒绝理由'
                    this.fail();
                }

            },
            goBack() {
                if (window.history.length <= 1) {
                    this.$router.push({path:'/'})
                    return false
                } else {
                    this.$router.go(-1)
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
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/pageHeader";

    .content {

        .table-content {
            .tab-border {
                border: 1px solid #EDEDED;
                padding: 15px;
                margin-top: 20px;
            }
            .order_attr {
                color: #8c939d;
                margin-bottom: 5px;
            }
        }

        .white {
            background: #ffffff;
        }
        .order_tag {
            margin: 0 0 10px;
        }
        .bg-purple {
            margin-bottom: 20px;
        }

        .bg-purple-light {
            margin-bottom: 20px;
        }
        .grid-content {
            margin-bottom: 15px;
        }
        .order_attr {
            color: #8c939d;
            margin-bottom: 5px;
        }
        .order_value {
            height: 24px;
            line-height: 24px;
        }
        /* goods-info css   start */
        .goods_img {
            width: 110px;
        }
        .goods-name {
            width: 220px;
        }

        .goods-info-child {
            height: 110px;
            float: left;
            margin-right: 10px;
            p {
                margin: 0;
            }
        }
        .goods-info-child:first-child {
            margin-top: 0;
        }
        .goods-info:first-child{
            padding-top: 0;
            padding-right: 10px;
            margin-top: 0;
            border-top: 0;
        }
        /* goods-info css   start */
        .images {
            float: left;
        }
        .font_red {
            color: #FF422C;
        }
    }
</style>
