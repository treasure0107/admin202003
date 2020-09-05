<template>
    <div class="content">
        <div class="pages-header">
                <div>订单详情</div>
        </div>
        <div class="table-content white" v-loading="loading">
            <el-row v-if="orderInfo.order_type == 3">
                <el-table :data="orderInfo.child_orders" border style="width: 100%" :show-header="false">
                    <el-table-column>
                        <template slot-scope="scope">
                            <p>{{ scope.row.remark }}</p>
                            <p v-if="scope.row.order_type == 4 && orderInfo.status <=2">需在<span class="font_red">{{ scope.row.down_payment_expired }}</span>前支付</p>
                            <p v-if="scope.row.order_type == 5 && orderInfo.status >=5 && orderInfo.status !=7">需在<span class="font_red">{{ scope.row.balance_payment_expired }}</span>前支付</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            订单号：{{ scope.row.order_sn }}
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            ¥{{ scope.row.should_money }}
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <span class="font_red" v-if="scope.row.status > 2">已付款</span>
                            <span class="font_red" v-if="scope.row.status <= 2">待付款</span>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <span v-if="scope.row.status > 2"><span class="font_red">{{ scope.row.pay_time }}</span>已付</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row class="tab-border" v-if="orderInfo.order_type != 8">
                <!--普通生产类订单步骤-->
                <el-steps :active="orderFlow.status" align-center v-if="isProduction == 1 && orderInfo.order_type != 3 && orderInfo.order_type != 7">
                    <el-step title="待付款" :description = orderFlow.wait_payment></el-step>
                    <el-step title="待确认印刷" :description = orderFlow.wait_confirm_print></el-step>
                    <el-step title="待发货" :description=orderFlow.wait_ship></el-step>
                    <el-step title="待收货" :description=orderFlow.wait_shipping></el-step>
                    <el-step title="待评价" :description=orderFlow.wait_evaluate></el-step>
                    <el-step title="交易成功" :description=orderFlow.transaction_success></el-step>
                </el-steps>
                <!--自提类订单步骤-->
                <el-steps :active="orderFlow.status" align-center v-if="isProduction == 1 && orderInfo.order_type == 7">
                    <el-step title="待付款" :description = orderFlow.wait_payment></el-step>
                    <el-step title="待确认印刷" :description = orderFlow.wait_confirm_print></el-step>
                    <el-step title="待核销" :description=orderFlow.wait_write_off></el-step>
                    <el-step title="待评价" :description=orderFlow.wait_evaluate></el-step>
                    <el-step title="交易成功" :description=orderFlow.transaction_success></el-step>
                </el-steps>
                <!--分期类订单步骤-->
                <el-steps :active="orderFlow.status" align-center v-if="isProduction == 1 && orderInfo.order_type == 3">
                    <el-step title="待付款" :description = orderFlow.wait_payment></el-step>
                    <el-step title="待确认印刷" :description = orderFlow.wait_confirm_print></el-step>
                    <el-step title="待发货" :description=orderFlow.wait_ship></el-step>
                    <el-step title="待收货" :description=orderFlow.wait_shipping></el-step>
                    <el-step title="待付尾款" :description=orderFlow.tail_wait_payment></el-step>
                    <el-step title="交易成功" :description=orderFlow.transaction_success></el-step>
                </el-steps>
                <!--库存类订单步骤-->
                <el-steps :active="orderFlow.status" align-center v-if="isProduction == 0">
                    <el-step title="待付款" :description = orderFlow.wait_payment></el-step>
                    <el-step title="待发货" :description=orderFlow.wait_ship></el-step>
                    <el-step title="待收货" :description=orderFlow.wait_shipping></el-step>
                    <el-step title="待评价" :description=orderFlow.wait_evaluate></el-step>
                    <el-step title="交易成功" :description=orderFlow.transaction_success></el-step>
                </el-steps>
            </el-row>
            <el-row class="tab-border" v-if="orderInfo.order_type == 8">
                <div class="font_red under_the_line">已完成</div>
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>基本信息</span></div>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>订单号:</span></div>
                    <div class="order_value"><span>{{ orderInfo.order_sn }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>用户名:</span></div>
                    <div class="order_value"><span>{{ orderInfo.username }}</span><el-button type="text" size="mini" @click="$router.push('/member/memberInfo?user_id='+orderInfo.buyer_id)">查看会员信息</el-button></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>支付方式:</span></div>
                    <div class="order_value"><span>{{ payType[orderInfo.order_charge.pay_type] }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>订单来源:</span></div>
                    <div class="order_value"><span>{{ fromSource[orderInfo.from_source] }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>订单状态:</span></div>
                    <div class="order_value"><span>{{ orderStatus[orderInfo.status] }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>下单时间:</span></div>
                    <div class="order_value"><span>{{ orderInfo.create_time }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>付款时间:</span></div>
                    <div class="order_value"><span>{{ orderInfo.order_charge.pay_time }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>发货时间:</span></div>
                    <div class="order_value"><span>{{ orderFlow.shipping_time }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>配送方式:</span></div>
                    <div class="order_value"><span v-if="orderInfo.order_type != 8">{{ expressType[orderInfo.shopping_info.express_type] }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>发货单号:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.express_sn }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>订单类型:</span></div>
                    <div class="order_value"><span>{{ orderType[orderInfo.order_type] }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>店铺名称:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shop_name }}</span><el-button type="text" size="mini" @click="clickJump('/seller/shopDetail?tag=shopInfo&shop_id='+orderInfo.shop_id)">查看店铺信息</el-button></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>店铺类型:</span></div>
                    <div class="order_value"><span>{{ openStatus[orderInfo.open_status] }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>支付流水号:</span></div>
                    <div class="order_value"><span>{{ orderInfo.order_charge.pay_sn }}</span></div>
                </div></el-col>
            </el-row>
            <el-row class="tab-border" v-if="orderInfo.order_type != 7 && orderInfo.order_type != 8">
                <div class="order_tag"><span>收件人信息</span></div>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>收件人姓名:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.consignee }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>手机号码:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.mobile }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>收货地址:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.addressInfo }}</span></div>
                </div></el-col>
            </el-row>
            <el-row class="tab-border" v-if="orderInfo.order_type == 7">
                <div class="order_tag"><span>取货人信息</span></div>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>取货码:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.pick_up_code }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>手机号码:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.mobile }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>自提地址:</span></div>
                    <div class="order_value"><span>{{ orderInfo.shopping_info.pick_up_address }}</span></div>
                </div></el-col>
            </el-row>
            <el-row class="tab-border" v-if="orderInfo.invoice_id">
                <div class="order_tag"><span>发票信息</span></div>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>发票类型:</span></div>
                    <div class="order_value"><span>{{ invoiceNature[invoiceInfo.invoice_nature] }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>单位名称:</span></div>
                    <div class="order_value"><span>{{ invoiceInfo.invoice_title }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>纳税人识别号:</span></div>
                    <div class="order_value"><span>{{ invoiceInfo.tax_registration_certificate_sn }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>注册地址:</span></div>
                    <div class="order_value"><span>{{ invoiceInfo.receiving_address }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>注册电话:</span></div>
                    <div class="order_value"><span>{{ invoiceInfo.company_registered_telephone }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>开户银行:</span></div>
                    <div class="order_value"><span>{{ invoiceInfo.bank_name }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>银行账号:</span></div>
                    <div class="order_value"><span>{{ invoiceInfo.bank_account }}</span></div>
                </div></el-col>
            </el-row>
            <el-row class="tab-border" v-if="orderInfo.invoice_id">
                <div class="order_tag"><span>发票地址</span></div>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>收件人姓名:</span></div>
                    <div class="order_value"><span>{{ invoiceInfo.addressee }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>手机号码:</span></div>
                    <div class="order_value"><span>{{ invoiceInfo.phone }}</span></div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                    <div class="order_attr"><span>收货地址:</span></div>
                    <div class="order_value"><span>{{ invoiceInfo.register_address }}</span></div>
                </div></el-col>
                <!--                <el-col :span="4"><div class="grid-content">-->
                <!--                    <div class="order_attr"><span>邮政编号:</span></div>-->
                <!--                    <div class="order_value"><span>无</span></div>-->
                <!--                </div></el-col>-->
            </el-row>
            <el-row class="tab-border" v-if="orderInfo.order_type != 8">
                <div class="order_tag"><span>商品信息</span></div>
                <el-col :span="24"><div class="grid-content-dark">
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
                                    <el-col :span="24"><div :title="scope.row.goods_name" class="string-show-tow">{{ scope.row.goods_name }}</div></el-col>
                                    <el-col :span="24"><div :title="scope.row.goods_classify" class="string-show-tow">{{ scope.row.goods_classify }}</div></el-col>
                                    <el-col :span="24"><div class="string-show-one">SKU:{{ scope.row.sku_id }}</div></el-col>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品单价">
                            <template slot-scope="scope">
                                ¥{{scope.row.unit_price}}
                            </template>
                        </el-table-column>
                        <el-table-column label="商品数量">
                            <template slot-scope="scope">
                                x{{scope.row.goods_number}}
                            </template>
                        </el-table-column>
                        <el-table-column label="商品总价">
                            <template slot-scope="scope">
                                ¥{{scope.row.total_price}}
                            </template>
                        </el-table-column>
                    </el-table>
                </div></el-col>
                <el-col :span="3" :offset="21"><div class="grid-content">商品总价:<span class="font_red">￥{{ orderInfo.order_charge.total_account }}</span></div></el-col>
            </el-row>

            <el-row class="tab-border">
                <div class="order_tag"><span>费用信息</span></div>
                <el-col :span="6"><div class="grid-content">
                    <div class="order_attr"><span>商品总价:</span></div>
                    <div class="order_value"><span>￥{{ orderInfo.order_charge.total_account }}</span></div>
                </div></el-col>
                <el-col :span="6"><div class="grid-content">
                    <div class="order_attr"><span>店铺优惠:</span></div>
                    <div class="order_value"><span>-￥{{ orderInfo.order_charge.shop_coupons }}</span></div>
                </div></el-col>
                <el-col :span="6"><div class="grid-content">
                    <div class="order_attr"><span>平台优惠:</span></div>
                    <div class="order_value"><span>-￥{{ orderInfo.order_charge.coupons }}</span></div>
                </div></el-col>
                <el-col :span="6"><div class="grid-content">
                    <div class="order_attr"><span>折扣</span></div>
                    <div class="order_value"><span>-￥{{ orderInfo.order_charge.discount }}</span></div>
                </div></el-col>
                <el-col :span="6"><div class="grid-content">
                    <div class="order_attr"><span>配送费用:</span></div>
                    <div class="order_value"><span>+￥{{ orderInfo.order_charge.shopping_money }}</span></div>
                </div></el-col>
                <el-col :span="6"><div class="grid-content">
                    <div class="order_attr"><span>税费:</span></div>
                    <div class="order_value"><span>￥{{ orderInfo.order_charge.tax }}</span></div>
                </div></el-col>
                <el-col :span="6"><div class="grid-content">
                    <div class="order_attr"><span>应付金额:</span></div>
                    <div class="order_value"><span>￥{{ orderInfo.order_charge.should_money }}</span></div>
                </div></el-col>
                <el-col :span="6"><div class="grid-content">
                    <div class="order_attr"><span>实付金额</span></div>
                    <div class="order_value"><span>￥{{ orderInfo.order_charge.paid_money }}</span></div>
                </div></el-col>
                <el-col v-if="orderInfo.order_type == 9" :span="6"><div class="grid-content">
                    <div class="order_attr"><span>预计分销佣金:</span></div>
                    <div class="order_value"><span>￥{{ orderInfo.order_charge.shop_order_profile }}</span></div>
                </div></el-col>
                <el-col v-if="orderInfo.order_type == 9 && (orderInfo.status==6 || orderInfo.status==7)" :span="6"><div class="grid-content">
                    <div class="order_attr"><span>实际分销佣金</span></div>
                    <div class="order_value"><span>￥{{ orderInfo.order_charge.brokerage }}</span></div>
                </div></el-col>
            </el-row>
            <el-row class="tab-border" v-if="orderInfo.status > 4 && orderInfo.order_type != 8">
                <div class="order_tag"><span>物流信息</span></div>
                <el-col :span="24"><div class="grid-content">
                    <div><span>发货方式：{{ expressType[orderInfo.shopping_info.express_type] }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>物流公司：{{ orderInfo.shopping_info.express_company }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>物流单号：{{ orderInfo.shopping_info.express_sn }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>物流追踪：</span></div>
                    <div>
                        <el-timeline :reverse="reverse">
                            <el-timeline-item
                                v-for="(activity, index) in orderInfo.shopping_info.order_trace"
                                :key="index">
                                {{activity.remark}}
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div></el-col>
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>操作信息</span></div>

                <el-col :span="12" v-if="this.orderFlow.status >=2 && this.orderFlow.status < 4">
                    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                        <el-form-item label="操作备注">
                            <el-input type="textarea" v-model="form.desc"></el-input>
                        </el-form-item>
                        <el-dialog
                            title="退款"
                            :visible.sync="dialogVisible"
                            width="30%"
                            :before-close="handleClose">
                            <el-form-item label="退款金额" prop="money">
                                <el-input v-model="form.money" style="width: 70%" placeholder="¥" @input="oninput"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <span>确认退款后，平台将款项按支付方式原路返回至买家付款账户</span>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="dialogVisible = false">取 消</el-button>
                                <el-button type="danger" @click="refund">确认退款</el-button>
                            </el-form-item>
                        </el-dialog>
                        <el-form-item>
                            <el-button type="primary" @click="dialogVisible = true" size="mini">退款</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="24"><div class="grid-content-dark">
                    <el-table :data="orderInfo.order_trance" border style="width: 100%">
                        <el-table-column prop="creator_id" label="作者"></el-table-column>
                        <el-table-column prop="create_time" label="操作时间"></el-table-column>
                        <el-table-column prop="operation" label="操作"></el-table-column>
                        <el-table-column label="订单状态">
                            <template slot-scope="scope">
                                <p>{{orderStatus[scope.row.value]}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注">
                            <template slot-scope="scope">
                                <p>{{scope.row.remark}}</p>
                                <p v-if="orderInfo.cancel_val!='' && scope.row.value==0">原因: {{ orderInfo.cancel_val }}</p>
                            </template>
                        </el-table-column>
                    </el-table>
                </div></el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import { ORDER_STATUS, ORDER_TYPE, PAY_TYPE, FROM_SOURCE, EXPRESS_TYPE, INVOICE_NATURE} from "../../config/order";
    import { OPEN_STATUS} from "../../config/seller";

    export default {
        data () {
            let isFloat = ( str ) => {
                for(let i=0;i<str.length;i++)  {
                    if ((str.charAt(i)<"0" || str.charAt(i)>"9")&& str.charAt(i) != '.'){
                        return false;
                    }
                }
                return true;
            };
            let checkFloat = (rule, value, callback) => {
                if (value < 0) {
                    callback(new Error('金额必须大于或等于0'));
                }
                if (value > this.orderInfo.order_charge.paid_money) {
                    callback(new Error('输入金额不合规'));
                }
                setTimeout(() => {
                    if (!isFloat(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        callback();
                    }
                }, 1000);
                let checkMoney = (rule, value, callback) => {
                    if (value > this.orderInfo.order_charge.paid_money) {
                        return callback(new Error('退款金额不能大于实付金额'));
                    }
                };
            }
            return {
                loading: false,
                orderStatus: ORDER_STATUS,
                orderType: ORDER_TYPE,
                fromSource: FROM_SOURCE,
                payType: PAY_TYPE,
                expressType: EXPRESS_TYPE,
                invoiceNature: INVOICE_NATURE,
                openStatus: OPEN_STATUS,
                dialogVisible: false,
                refund: false,
                orderFlow: {
                    status: 0,
                    wait_payment: '',
                    wait_confirm_print: '',
                    wait_ship: '',
                    wait_shipping: '',
                    transaction_success: '',
                    tail_wait_payment: '',
                    shipping_time: '',
                    wait_write_off: ''
                },
                form: {
                    desc: ''
                },
                rules: {
                    money: [
                        { required: true, message: '请输入退款金额', trigger: 'blur'  },
                        { validator: checkFloat, trigger: 'blur' }
                    ],
                },
                orderInfo:{
                    id: 0,
                    has_refunded: 0,
                    order_trance: [{
                        creator_id: '',
                        create_time: '',
                        operation: '',
                        order_status: '',
                        remark: ''
                    }],
                    shopping_info: {
                        id: 0,
                        consignee: "",
                        mobile: "",
                        country_id: "",
                        province_id: "",
                        city_id: "",
                        area_id: "",
                        street_id: "",
                        address: "",
                        express_id: "",
                        express_sn: "",
                        create_time: "",
                        express_type: "",
                        estimated_time: "",
                        send_time: "",
                        express_company: "",
                        email: "",
                        addressInfo: "",
                        pick_up_code: "",
                        pick_up_address: ""
                    },
                    order_goods: [{
                        id: 0,
                        upload_img_url: "",
                        goods_name: "",
                        goods_classify: "",
                        goods_number: 0,
                        price: 0.00,
                        goods_img: "",
                        comment_id: "",
                        goods_id: 0,
                        should_money: 0.00,
                        shop_coupons: "",
                        pt_coupons: "",
                        sku_id: 0,
                        order: 0,
                        ship_time: ''
                    }],
                    order_charge: {
                        id: 0,
                        total_account: 0.00,
                        coupons_id: 0,
                        coupons: 0.00,
                        shop_coupons_id: 0,
                        shop_coupons: 0.00,
                        discount: 0.00,
                        shopping_money: 0.00,
                        tax: 0.00,
                        should_money: 0.00,
                        paid_money: 0.00,
                        pay_sn: "",
                        pay_type: "",
                        pay_time: ""
                    },
                    buyer_id: 0,
                    shop_id: 0,
                    parent_id: 0,
                    order_sn: "",
                    order_type: 0,
                    status: 0,
                    goods_count: 0,
                    is_frozen: 0,
                    from_source: 0,
                    create_time: "",
                    remark: "",
                    resource: "",
                    charge: 0,
                    shopping:0,
                    refund:""
                },
                reverse: false,
                fit: 'contain',
                invoiceInfo: {
                    invoice_nature: '',
                    invoice_title: '',
                    tax_registration_certificate_sn: '',
                    receiving_address: '',
                    company_registered_telephone: '',
                    bank_name: '',
                    bank_account: '',
                    addressee: '',
                    phone: '',
                    register_address: ''
                },
                logisticsInfo: {},
                isProduction: 0
            }
        },
        created(){
            this.order_detail()
        },
        methods: {
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
            },
            is_production(order_type){//是否为生产商品的订单 现在order_type（1生产类 3分期类 6采购类 7自提类）为生产商品
                let production_order_type = [1,3,6,7];//
                this.isProduction = production_order_type.includes(order_type) ? 1 : 0;
            },
            async order_detail(){
                this.loading = true;
                let router_path = '';
                if(this.$route.query.order_type == 3){
                    router_path = 'orders/installment_order'//采购订单详情接口
                }else{
                    router_path = 'orders/detail'
                }
                let parameter = {'order_sn':this.$route.query.order_sn};
                let data = await this.$request.get(this.$API.common_api,parameter,'main',{
                    router_path: router_path,
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: '查看订单详情;' + this.$route.query.id
                })
                if( data.code == 200 ){
                    this.orderInfo = data.data
                    this.is_production(this.orderInfo.order_type)
                    if(this.orderInfo.shopping_info){
                        let province = this.orderInfo.shopping_info.province_id.split('_')
                        let city = this.orderInfo.shopping_info.city_id.split('_')
                        let area = this.orderInfo.shopping_info.area_id.split('_')
                        this.orderInfo.shopping_info.addressInfo = province[1] + city[1] + area[1] + this.orderInfo.shopping_info.address
                    }
                    if(this.orderInfo.create_time){
                        this.orderFlow.wait_payment = '下单时间:'+this.orderInfo.create_time;
                        this.orderFlow.status = 1;

                        if(this.isProduction){
                            //生产类商品
                            if(this.orderInfo.status >= 3){//待确认印刷
                                if(this.orderInfo.order_type == 3){
                                    let child_orders = this.orderInfo.child_orders[0]
                                    this.orderFlow.wait_confirm_print = '付款时间:'+child_orders.pay_time;
                                    this.orderInfo.order_charge.pay_time = child_orders.pay_time
                                }else{
                                    this.orderFlow.wait_confirm_print = '付款时间:'+this.orderInfo.order_charge.pay_time;
                                }

                                this.orderFlow.status = 2;
                            }
                            if(this.orderInfo.order_type != 7){//判断是否为自提类订单
                                if(this.orderInfo.status >= 4){//待发货
                                    this.orderInfo.order_trance.forEach(trance => {
                                        if (trance.value == 4) {
                                            this.orderFlow.wait_ship = '确认印刷:' + trance.create_time;
                                        }
                                    })
                                    this.orderFlow.status = 3;
                                }
                                if(this.orderInfo.status >= 5){//待收货
                                    this.orderInfo.order_trance.forEach(trance => {
                                        if (trance.value == 5) {
                                            this.orderFlow.wait_shipping = '发货时间:'+trance.create_time;
                                            this.orderFlow.shipping_time = trance.create_time;
                                        }
                                    })
                                    this.orderFlow.status = 4;
                                }
                                if(this.orderInfo.order_type == 3){
                                    //分期订单 需多个待付尾款步骤
                                    if(this.orderInfo.status >= 7){
                                        this.orderInfo.order_trance.forEach(trance => {
                                            if (trance.value == 8) {
                                                this.orderFlow.tail_wait_payment = '确认收货:'+trance.create_time;
                                            }
                                        })
                                        this.orderFlow.status = 5;
                                        if(this.orderInfo.status == 7){
                                            let child_orders = this.orderInfo.child_orders[1]
                                            this.orderFlow.transaction_success = '尾款支付:'+child_orders.pay_time;
                                            this.orderFlow.status = 6;
                                        }
                                    }
                                }else{
                                    //正常生产商品
                                    if(this.orderInfo.status >= 6){//评价
                                        this.orderInfo.order_trance.forEach(trance => {
                                            if (trance.value == 6) {
                                                this.orderFlow.wait_evaluate = '确认收货:'+trance.create_time;
                                            }
                                        })
                                        this.orderFlow.status = 5;
                                    }
                                    if(this.orderInfo.status >= 7){
                                        this.orderInfo.order_trance.forEach(trance => {
                                            if (trance.value == 7) {
                                                this.orderFlow.transaction_success = '评价时间:'+trance.create_time;
                                            }
                                        })
                                        this.orderFlow.status = 6;
                                    }
                                }
                            }else{
                                //自提类订单步骤流程
                                if(this.orderInfo.status == 9){//待核销
                                    this.orderInfo.order_trance.forEach(trance => {
                                        if (trance.value == 9) {
                                            this.orderFlow.wait_write_off = '确认印刷:' + trance.create_time;
                                        }
                                    })
                                    this.orderFlow.status = 3;
                                }else if(this.orderInfo.status == 6){
                                    this.orderInfo.order_trance.forEach(trance => {
                                        if (trance.value == 9) {
                                            this.orderFlow.wait_write_off = '确认印刷:' + trance.create_time;
                                        }
                                        if (trance.value == 6) {
                                            this.orderFlow.wait_evaluate = '核销时间:'+trance.create_time;
                                        }
                                    })
                                    this.orderFlow.status = 4;
                                }
                                if(this.orderInfo.status == 7){
                                    this.orderInfo.order_trance.forEach(trance => {
                                        if (trance.value == 9) {
                                            this.orderFlow.wait_write_off = '确认印刷:' + trance.create_time;
                                        }
                                        if (trance.value == 6) {
                                            this.orderFlow.wait_evaluate = '核销时间:'+trance.create_time;
                                        }
                                        if (trance.value == 7) {
                                            this.orderFlow.transaction_success = '评价时间:'+trance.create_time;
                                        }
                                    })
                                    this.orderFlow.status = 5;
                                }
                            }
                        }else{
                            //库存类商品
                            if(this.orderInfo.status >= 4){//待发货
                                this.orderFlow.wait_ship = '付款时间:'+this.orderInfo.order_charge.pay_time;
                                this.orderFlow.status = 2;
                            }
                            if(this.orderInfo.status >= 5){//待收货
                                this.orderInfo.order_trance.forEach(trance => {
                                    if (trance.value == 5) {
                                        this.orderFlow.wait_shipping = '发货时间:' + trance.create_time;
                                        this.orderFlow.shipping_time = trance.create_time;
                                    }
                                })
                                this.orderFlow.status = 3;
                            }
                            if(this.orderInfo.status >= 6){//待评价
                                this.orderInfo.order_trance.forEach(trance => {
                                    if (trance.value == 6) {
                                        this.orderFlow.wait_evaluate = '确认收货:' + trance.create_time;
                                    }
                                })
                                this.orderFlow.status = 4;
                            }
                            if(this.orderInfo.status >= 7){//交易成功
                                this.orderInfo.order_trance.forEach(trance => {
                                    if (trance.value == 7) {
                                        this.orderFlow.transaction_success = '评价时间:' + trance.create_time;
                                    }
                                })
                                this.orderFlow.status = 5;
                            }
                        }
                    }
                    if(this.orderInfo.invoice_id){
                        let invoiceInfo = await this.$request.get(this.$API.common_api,{'invoice_id': this.orderInfo.invoice_id},'main',{
                            router_path: 'orders/invoiceInfo',
                            request_host: 'APP_SELLER_SERVER_HOST',
                            handle_desc: '查看订单详情;' + this.$route.query.id
                        })
                        if(invoiceInfo.code == 200){
                            this.invoiceInfo = invoiceInfo.data
                        }
                    }
                }
                this.loading = false
            },
            floatTwoReturnMoney() {
                // 通过正则过滤小数点后两位
                this.form.money = (this.form.money.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
            },
            async onSubmit() {
                this.form.order_sn = this.orderInfo.order_sn;
                let data = await this.$request.post(this.$API.common_api,this.form,'main',{
                    router_path: 'orders/disputeRefund',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: '交易纠纷退款;' + this.orderInfo.order_sn
                })
                if( data.code == 200 ){
                    this.success()
                    this.refund = false
                    this.order_detail()
                }else{
                    this.errorMessage = data.msg
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
            oninput() {
                // 通过正则过滤小数点后三位
                this.form.money = (this.form.money.match(/^\d*(\.?\d{0,3})/g)[0]) || null
            },
            clickJump(url){
                this.$router.push(url)
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
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
            .order_value {
                height: 24px;
                line-height: 24px;
            }
            .goods-img {
                margin-right: 10px;
                display: inline-block;
                background: #ffffff;
            }
            .goods-name {
                width: 260px;
            }

            .goods-info-child {
                height: 110px;
                float: left;
            }
        }

        .white {
            background: #ffffff;
        }
        .order_tag {
            margin: 0 0 10px;
        }

        .grid-content {
            margin-bottom: 15px;
        }

        .font_red {
            color: #FF422C;
        }
        .under_the_line {
            height: 100px;
            line-height: 100px;
        }
        p{
            margin: 0;
        }
    }
</style>
