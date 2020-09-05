<template>
    <div class="content">
        <div class="pages-header">
            <el-page-header @back="goBack" content="交易纠纷详情"></el-page-header>
        </div>
        <div class="table-content white" :data="orderInfo">
            <el-row class="tab-border">
                <el-col :span="24"><div class="grid-content after-info">
                    <div><span>售后编号：  <el-button type="text" @click="link_blank(orderInfo.after.after_id,orderInfo.buyer_id)">{{ orderInfo.after.after_sn }}</el-button></span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>纠纷编号：  {{ orderInfo.dispute_sn }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>申请时间：  {{ orderInfo.create_time }}</span></div>
                </div></el-col>
                <el-col :span="24"><div class="grid-content">
                    <div><span>完成时间：  {{ orderInfo.done_time }}</span></div>
                </div></el-col>
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>申诉售后订单</span></div>
                <el-col :span="24"><div class="grid-content">
                    <el-row class="tab-border">
                        <el-col :span="4"><div class="grid-content">{{ orderInfo.after.after_sn }}</div></el-col>
                        <el-col :span="4"><div class="grid-content">{{ afterType[orderInfo.after.after_type] }}</div></el-col>
                        <el-col :span="8"><div class="grid-content">{{ orderInfo.order_goods.goods_name }}</div></el-col>
                        <el-col :span="4"><div class="grid-content">¥ {{ orderInfo.after.money }}</div></el-col>
                        <el-col :span="4"><div class="grid-content">{{ returnStatus[orderInfo.after.status] }}</div></el-col>
                    </el-row>
                </div></el-col>
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>问题描述:</span></div>
                <el-col :span="24"><div class="grid-content">{{ orderInfo.reason }}</div></el-col>
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>联系电话:</span></div>
                <el-col :span="24"><div class="grid-content">{{ orderInfo.mobile }}</div></el-col>
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>处理状态</span></div>
                <el-col :span="24"><div class="grid-content">{{ disputeStatus[orderInfo.status] }}</div></el-col>
            </el-row>
            <el-row class="tab-border">
                <div class="order_tag"><span>处理反馈</span></div>
                <el-form ref="form" :model="form">
                    <el-col :span="24"><div class="grid-content">
                        <span class="font_red">*用户可见，请使用官方话术回复</span>
                    </div></el-col>
                    <el-col :span="12"><div class="grid-content">
                        <span v-if="orderInfo.status == 1">{{ orderInfo.feed_back.feed_back_user }}</span>
                        <el-form-item label="" prop="" v-if="orderInfo.status == 0">
                            <el-input type="textarea" v-model="form.feed_back_user" placeholder="用户端可看" size="mini"></el-input>
                        </el-form-item>
                    </div></el-col>
                    <el-col :span="24"><div class="grid-content">
                        <span class="font_red">仅管理员可见</span>
                    </div></el-col>
                    <el-col :span="12"><div class="grid-content">
                        <span v-if="orderInfo.status == 1">{{ orderInfo.feed_back.feed_back_super }}</span>
                        <el-form-item label="" prop="" v-if="orderInfo.status == 0">
                            <el-input type="textarea" v-model="form.feed_back_super" placeholder="仅管理员可见" size="mini"></el-input>
                        </el-form-item>
                    </div></el-col>
                    <el-col :span="24"><div class="grid-content">
                        <el-form-item v-if="orderInfo.status == 0">
                            <el-button type="primary" @click="onSubmit" size="mini">提交为已处理</el-button>
                        </el-form-item>
                    </div></el-col>
                </el-form>
            </el-row>
        </div>
    </div>
</template>
<script>

    import { DISPUTE_STATUS, RETURN_STATUS, AFTER_TYPE } from "../../config/order";

    export default {
        data () {
            return {
                disputeStatus: DISPUTE_STATUS,
                returnStatus: RETURN_STATUS,
                afterType: AFTER_TYPE,
                errorMessage: '',
                formInline: {
                    danger_reason: '',
                },
                danger: false,
                primary: false,
                orderResult: '售后成功',
                orderStepCode: 1,
                orderInfo: {
                    dispute_sn: '',
                    done_time: '',
                    cause: '',
                    reason: '',
                    can_confirm: 0,
                    after: {
                        after_type: '',
                        after_sn: ''
                    },
                    feed_back: {
                        feed_back_user: '',
                        feed_back_super: ''
                    },
                    order_goods: {
                        goods_name: ''
                    }
                },
                form: {
                    feed_back_user: '',
                    feed_back_super: '',
                    dispute_id: ''
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
                let parameter = {'dispute_id': this.$route.query.dispute_id };
                let data = await this.$request.get(this.$API.common_api,parameter,'main',{
                    router_path: 'orders/disputeDetail',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: '查看交易纠纷详情;' + this.orderInfo.id
                });
                if( data.code == 200 ){
                    this.orderInfo = data.data;
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
            //处理交易纠纷订单
            async onSubmit() {
                this.form.dispute_id = this.orderInfo.id;
                let data = await this.$request.post(this.$API.common_api,this.form,'main',{
                    router_path: 'orders/disputeConfirm',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: '确认交易纠纷;' + this.orderInfo.id
                })
                if( data.code == 200 ){
                    this.success()
                    this.order_detail()
                }else{
                    this.errorMessage = data.msg
                    this.fail();
                }
            },
            link_blank(after_id,buyer_id) {
                const link = this.$router.resolve({name: '/orders/aftermarketDetail', query:{after_id: after_id,buyer_id: buyer_id}});
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
                width: 100px;
            }
            .goods-name {
                width: 220px;
            }

            .goods-info-child {
                height: 100px;
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
            color: #DD0919;
        }


    }
</style>
