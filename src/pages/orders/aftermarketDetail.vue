<template>
    <div class="content">
        <div class="pages-header">
            <el-page-header @back="goBack" content="售后详情"></el-page-header>
        </div>
        <div class="table-content white" :data="orderInfo">
            <el-row class="tab-border">
                <el-col :span="12" :offset="0">
                    <el-steps :active="orderStepCode" >
                        <el-step title="买家提交申请" description=""></el-step>
                        <el-step title="商家处理申请" description=""></el-step>
                        <el-step :title="orderResult" description=""></el-step>
                    </el-steps>
                </el-col>
                <el-col :span="24" v-if="orderInfo.status == 1" class="after-operation">
                    <el-button type="danger" size="mini" @click="primary = true">同意</el-button>
                    <el-button type="primary" size="mini" @click="danger = true">拒绝</el-button>
                </el-col>
                <el-col :span="24"><div class="grid-content after-info">
                    <div><span>订单号：  <el-button type="text" @click="link_blank(orderInfo.order_sn, orderInfo.order_id)">{{ orderInfo.order_sn }}</el-button></span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>售后编号：  {{ orderInfo.after_sn }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>申请类型：  {{ afterType[orderInfo.after_type] }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>申请金额：  <span class="font_red">￥{{ orderInfo.money }}</span></span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>申请原因：  {{ orderInfo.cause }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>申请理由：  {{ orderInfo.reason }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div class="aftermarket-img" v-for="image in orderInfo.images">
                        <el-image
                                style="width: 100px; height: 100px"
                                :src="image.image_path"
                                :fit="fit"></el-image>
                    </div>
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
                    <el-button type="primary" @click="primaryAfter">确 定</el-button>
                    </span>
            </el-dialog>
            <el-dialog
                    title="拒绝申请"
                    :visible.sync="danger"
                    width="30%">
                <span>确认拒绝取消订单申请？</span>
                <el-form ref="form" :model="formInline" label-width="80px">
                    <el-input type="textarea" v-model="formInline.danger_reason" placeholder="拒绝理由 0/200字"></el-input>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="danger = false">取 消</el-button>
                    <el-button type="primary" @click="dangerAfter">确 定</el-button>
                    </span>
            </el-dialog>
            <el-row class="tab-border">
                <div class="order_tag"><span>商品信息</span></div>
                <el-col :span="24"><div class="grid-content">
                    <el-table :data="orderGoods" border style="width: 100%">
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
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>操作日志</span></div>
                <el-col :span="24"><div class="grid-content">
                    <el-table :data="orderInfo.after_sale_trace" border style="width: 100%">
                        <el-table-column prop="id" label="操作ID" ></el-table-column>
                        <el-table-column prop="create_time" label="操作时间"></el-table-column>
                        <el-table-column prop="operation" label="操作"></el-table-column>
                        <el-table-column prop="remark" label="备注"></el-table-column>
                    </el-table>
                </div></el-col>
            </el-row>
            <el-row class="tab-border" v-if="orderInfo.status == 4">
                <el-col :span="24"><div class="grid-content">
                    <div><span>退款进度: {{ afterStatus[orderInfo.status] }}</span></div>
                </div></el-col>
                <el-col :span="24" ><div class="grid-content">
                    <div><span>退回账户：{{ payType[orderInfo.order_charge_refund.pay_type] }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>退款进度：</span></div>
                </div></el-col>
                <el-col :span="8"><div class="grid-content">
                    <div class="block">
                        <el-timeline :reverse="reverse">
                            <el-timeline-item
                                    v-for="(trace, index) in orderInfo.order_charge_refund.traces"
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

    import { AFTER_TYPE, PAY_TYPE, AFTER_STATUS} from "../../config/order";

    export default {
        data () {
            return {
                payType: PAY_TYPE,
                afterStatus: AFTER_STATUS,
                errorMessage: '',
                formInline: {
                    danger_reason: '',
                },
                danger: false,
                primary: false,
                orderResult: '售后成功',
                orderStepCode: 1,
                afterType: AFTER_TYPE,
                orderInfo: {
                    after_sn: '',
                    after_type: '',
                    money: '0.00',
                    cause: '',
                    reason: '',
                    after_sale_trace: [{
                        id: '',
                        create_time: '',
                        operation: '',
                        remark: ''
                    }],
                    images: [{
                        image_path: ''
                    }],
                    order_charge_refund: {
                        pay_type: ''
                    }
                },
                orderGoods: [],
                reverse: false,
                fit: 'contain',
            }
        },
        created(){
            this.order_detail()
        },
        methods: {
            async order_detail(){
                let parameter = {'after_id':this.$route.query.after_id,'buyer_id':this.$route.query.buyer_id};
                let data = await this.$request.get(this.$API.common_api,parameter,'main',{
                    router_path: 'orders/aftermarketDetail',
                    request_host: 'ORDERS_SERVER_HOST',
                });
                if( data.code == 200 ){
                    this.orderInfo = data.data;
                    this.orderGoods.push(this.orderInfo.order_goods);
                    if(this.orderInfo.status > 1){
                        this.orderStepCode = 2;
                        if(this.orderInfo.status == 4){
                            this.orderStepCode = 3;
                        }
                    }else if(this.orderInfo.status == 0){
                        this.orderStepCode = 3;
                        this.orderResult = '售后失败';
                    }
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
            //同意售后申请
            async primaryAfter(){
                let parameter = {'after_id':this.orderInfo.id,'buyer_id': this.orderInfo.buyer_id};
                let data = await this.$request.post(this.$API.common_api,parameter,'main',{
                    router_path: 'orders/primaryAfter',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: '同意售后申请;' + this.orderInfo.id
                })
                if( data.code == 200 ){
                    this.success();
                    this.order_detail()
                }else{
                    this.errorMessage = data.msg
                    this.fail();
                }
                this.primary = false
            },
            //拒绝售后申请
            async dangerAfter(){
                if(this.formInline.danger_reason == ''){
                    this.errorMessage = '请填写拒绝理由'
                    this.fail();
                }else{
                    let parameter = {'after_id':this.orderInfo.id,'buyer_id': this.orderInfo.buyer_id,'cause':this.formInline.danger_reason};
                    let data = await this.$request.post(this.$API.common_api,parameter,'main',{
                        router_path: 'orders/dangerAfter',
                        request_host: 'ORDERS_SERVER_HOST',
                        handle_desc: '拒绝售后申请;' + this.orderInfo.id
                    })
                    if( data.code == 200 ){
                        this.success()
                        this.order_detail()
                    }else{
                        this.errorMessage = data.msg
                        this.fail();
                    }
                    this.danger = false
                }
            },
            link_blank(order_sn, order_id) {
                const link = this.$router.resolve({name: '/orders/detail', query:{order_sn: order_sn,id: order_id}});
                window.open(link.href,'_blank')
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
            .after-info {
                margin-top: 20px;
            }
            .order_tag {
                margin: 20px 0 10px;
            }
            .grid-content {
                margin-bottom: 20px;
            }
            .after-operation {
                margin: 20px 0;
            }
            .aftermarket-img {
                width: 100px;
                margin-right: 10px;
                display: inline-block;
                background: #ffffff;
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
            .bot_agree {
                background: #FF422C;
            }
            .bot_refuse {
                background: #60aeff;
            }
            .bot_refuse ,.bot_agree {
                display: inline-block;
                padding: 0 4px;
                color: #ffffff;
            }
        }

        .white {
            background: #ffffff;
        }
        .font_red {
             color: #FF422C;
        }


    }
</style>
