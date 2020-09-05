<template>
    <div class="content">
        <div class="pages-header">
            <el-page-header @back="goBack" content="结算处理"></el-page-header>
        </div>
        <div class="table-content white">
            <div>系统结算订单</div>
            <template>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="order_sn" label="订单号"></el-table-column>
                    <el-table-column prop="shop_name" label="店铺名称"></el-table-column>
                    <el-table-column prop="create_time" label="订单结算时间" width="155">
                        <template slot-scope="scope">
                            {{ scope.row.create_time | getLocalTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="支付类型">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">{{ payType[scope.row.pay_type] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pay_sn" label="支付流水号"></el-table-column>
                    <el-table-column label="订单总金额" width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.order_money }}</span>
                            <span v-if="scope.$index==0">{{ scope.row.order_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="商家优惠金额" width="105">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.shop_coupons_money }}</span>
                            <span v-if="scope.$index==0">{{ scope.row.shop_coupons_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="平台优惠金额" width="105">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.mall_coupons_money }}</span>
                            <span v-if="scope.$index==0">{{ scope.row.mall_coupons_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="优惠合计" width="105">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.coupons_total_money }}</span>
                            <span v-if="scope.$index==0">{{ scope.row.coupons_total_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="买家应付金额" width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.should_pay_money }}</span>
                            <span v-if="scope.$index==0">{{ scope.row.should_pay_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="买家实付金额" width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.actual_pay_money }}</span>
                            <span v-if="scope.$index==0">{{ scope.row.actual_pay_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="平台补贴金额" width="105">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.mall_allowance_money }}</span>
                            <span v-if="scope.$index==0">{{ scope.row.mall_allowance_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="计算机服务费的交易金额" width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.service_total_money}}</span>
                            <span v-if="scope.$index==0">{{ scope.row.service_total_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="技术服务费比例">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">{{ floatMul(scope.row.commission,100) }}%</span>
                            <span v-if="scope.$index==0">{{ scope.row.commission }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="service_total_money" label="技术服务费金额" width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.service_money }}</span>
                            <span v-if="scope.$index==0">{{ scope.row.service_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="退款金额" width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.return_money }}</span>
                            <span v-if="scope.$index==0">{{ scope.row.return_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="分销佣金" width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.brokerage }}</span>
                            <span v-if="scope.$index==0">{{ scope.row.brokerage }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="系统结算金额" width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.$index > 0">¥{{ scope.row.settlement_money }}</span>
                            <span v-if="scope.$index==0">{{ scope.row.settlement_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pay_status" label="结算状态">
                        <template slot-scope="scope">
                            {{ settlementStatus[scope.row.pay_status] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="对账结果">
                        <template slot-scope="scope">
                            {{ payResult[scope.row.pay_result] }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                </el-table>
            </template>
            <template v-if="(pay_status == 3 || pay_status == 0) && type=='edit'">
                <el-form ref="form" :model="form" label-width="100px">
                    <div v-if="form.pay_status_type == 2">人工调账</div>
                    <el-table :data="tableData" style="width: 100%" v-if="form.pay_status_type == 2">
                        <el-table-column prop="order_sn" label="订单号"></el-table-column>
                        <el-table-column prop="shop_name" label="店铺名称"></el-table-column>
                        <el-table-column prop="create_time" label="订单结算时间" width="155">
                            <template slot-scope="scope">
                                {{ scope.row.create_time | getLocalTime }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="pay_type" label="支付类型">
                            <template slot-scope="scope">
                                <span v-if="scope.$index > 0">{{ payType[scope.row.pay_type] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="pay_sn" label="支付流水号"></el-table-column>
                        <el-table-column label="订单总金额" width="130">
                            <template slot-scope="scope">
                                <span v-if="scope.$index > 0">¥{{ scope.row.order_money }}</span>
                                <span v-if="scope.$index==0">{{ scope.row.order_money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="商家优惠金额" width="105">
                            <template slot-scope="scope">
                                <template v-if="scope.$index > 0"><el-input v-model="form.shop_coupons_money" size="mini" @input="floatTwoShopCouponsMoney" @blur="shopCouponsMoney"></el-input></template>
                                <span v-if="scope.$index==0">{{ scope.row.shop_coupons_money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="平台优惠金额" width="105">
                            <template slot-scope="scope">
                                <template v-if="scope.$index > 0"><el-input v-model="form.mall_coupons_money" size="mini" @input="floatTwoMallCouponsMoney" @blur="shopCouponsMoney"></el-input></template>
                                <span v-if="scope.$index==0">{{ scope.row.mall_coupons_money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="优惠合计" width="105">
                            <template slot-scope="scope">
                                <template v-if="scope.$index > 0"><el-input v-model="form.coupons_total_money" size="mini" disabled></el-input></template>
                                <span v-if="scope.$index==0">{{ scope.row.coupons_total_money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="买家应付金额" width="130">
                            <template slot-scope="scope">
                                <template v-if="scope.$index > 0"><el-input v-model="form.should_pay_money" size="mini" disabled></el-input></template>
                                <span v-if="scope.$index==0">{{ scope.row.should_pay_money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="买家实付金额" width="130">
                            <template slot-scope="scope">
                                <template v-if="scope.$index > 0"><el-input v-model="form.actual_pay_money" size="mini" disabled></el-input></template>
                                <span v-if="scope.$index==0">{{ scope.row.actual_pay_money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="平台补贴金额" width="105">
                            <template slot-scope="scope">
                                <template v-if="scope.$index > 0"><el-input v-model="form.mall_allowance_money" size="mini" disabled></el-input></template>
                                <span v-if="scope.$index==0">{{ scope.row.mall_allowance_money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="计算机服务费的交易金额" width="130">
                            <template slot-scope="scope">
                                <template v-if="scope.$index > 0"><el-input v-model="form.service_total_money" size="mini" disabled></el-input></template>
                                <span v-if="scope.$index==0">{{ scope.row.service_total_money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="技术服务费比例">
                            <template slot-scope="scope">
                                <template v-if="scope.$index > 0"><el-input v-model="form.commission" size="mini" @input="floatOne" @blur="shopCouponsMoney"></el-input></template>
                                <span v-if="scope.$index==0">{{ scope.row.commission }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="技术服务费金额" width="130">
                            <template slot-scope="scope">
                                <template v-if="scope.$index > 0"><el-input v-model="form.service_money" size="mini" disabled></el-input></template>
                                <span v-if="scope.$index==0">{{ scope.row.service_money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="退款金额" width="130">
                            <template slot-scope="scope">
                                <template v-if="scope.$index > 0"><el-input v-model="form.return_money" size="mini" @input="floatTwoReturnMoney" @blur="shopCouponsMoney"></el-input></template>
                                <span v-if="scope.$index==0">{{ scope.row.return_money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="系统结算金额" width="130">
                            <template slot-scope="scope">
                                <template v-if="scope.$index > 0"><el-input v-model="form.settlement_money" size="mini" disabled></el-input></template>
                                <span v-if="scope.$index==0">{{ scope.row.settlement_money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="结算状态">
                            <template slot-scope="scope">
                                {{ settlementStatus[scope.row.pay_status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="对账结果">
                            <template slot-scope="scope">
                                {{ payResult[scope.row.pay_result] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注"></el-table-column>
                    </el-table>
                    <div class="handle">
                        <el-form-item label="结算方式">
                            <el-radio-group v-model="form.pay_status_type">
                                <el-radio :label="1">按系统结算</el-radio>
                                <el-radio :label="4">不结算</el-radio>
                                <el-radio :label="2">人工调帐</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <span v-if="form.pay_status_type == 0">备注（用户可见）</span>
                            <span v-if="form.pay_status_type == 4"><span class="bot_agree">*</span>请输入不结算的理由，便于商家查看</span>
                            <span v-if="form.pay_status_type == 2"><span class="bot_agree">*</span>请输入人工调账的理由，便于商家查看（人工调账结算金额不得超过系统结算金额正负阀值为20）</span>
                            <el-input type="textarea" v-model="form.remark" class="text_input"></el-input>
                            <span class="bot_agree" v-if="settlementCheck == false">结算金额与系统结算金额差异超过20%</span>
                        </el-form-item>
                        <el-form-item size="large">
                            <el-button type="primary" @click="onSubmit" size="mini">提交</el-button>
                            <el-button size="mini">取消</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </template>
        </div>
    </div>
</template>
<script>
    import { SETTLEMENT_STATUS } from "../../config/seller";
    import { PAY_TYPE, PAY_RESULT} from "../../config/order";

    export default {
        data () {
            return {
                settlementStatus: SETTLEMENT_STATUS,
                payType: PAY_TYPE,
                payResult: PAY_RESULT,
                errorMessage: '',
                form: {
                    id: 0,
                    pay_status_type: 1,
                    shop_coupons_money: 0.00,
                    mall_coupons_money: 0.00,
                    coupons_total_money: 0.00,
                    should_pay_money: 0.00,
                    actual_pay_money: 0.00,
                    mall_allowance_money: 0.00,
                    service_money: 0.00,
                    commission: 0,
                    service_total_money: 0.00,
                    return_money: 0.00,
                    settlement_money: 0.00,
                    remark: ''
                },
                danger: false,
                primary: false,
                orderResult: '售后成功',
                orderStepCode: 1,
                tableData: [{
                    order_sn: '',
                    shop_name: '',
                    create_time: '',
                    pay_type: '',
                    pay_sn: '',
                    order_money: 'A',
                    shop_coupons_money: 'B',
                    mall_coupons_money: 'C',
                    coupons_total_money: 'D=B+C',
                    should_pay_money: 'E=A-D',
                    actual_pay_money: 'F=E',
                    mall_allowance_money: 'G=C',
                    service_money: 'J=H*I',
                    commission: 'I',
                    service_total_money: 'H=E+G',
                    return_money: 'K',
                    brokerage:'L',
                    settlement_money: 'L=H-J-K',
                    pay_status: '',
                    remark: '',
                }],
                settlementInfo:{},
                reverse: false,
                fit: 'contain',
                pay_status: 0,
                settlementCheck: true,
                type: ''
            }
        },
        created(){
            this.type = this.$route.query.type
            this.settlement_detail()
        },
        methods: {
            async settlement_detail(){
                let parameter = {'id':this.$route.query.id};
                let data = await this.$request.get(this.$API.common_api,parameter,'main',{
                    router_path: 'store/settlementDetail',
                    request_host: 'STORE_SERVER_HOST',
                    handle_desc: '查看结算订单详情;' + this.$route.query.id
                });
                if( data.code == 200 ){
                    this.tableData.push(data.data);
                    this.settlementInfo = data.data

                    this.form.order_money = data.data.order_money
                    this.form.shop_coupons_money = data.data.shop_coupons_money
                    this.form.mall_coupons_money = data.data.mall_coupons_money
                    this.form.coupons_total_money = data.data.coupons_total_money
                    this.form.should_pay_money = data.data.should_pay_money
                    this.form.actual_pay_money = data.data.actual_pay_money
                    this.form.mall_allowance_money = data.data.mall_allowance_money
                    this.form.service_money = data.data.service_money
                    this.form.commission = this.floatMul(data.data.commission,100) + ''
                    this.form.service_total_money = data.data.service_total_money
                    this.form.return_money = data.data.return_money
                    this.form.settlement_money = data.data.settlement_money
                    this.form.id = data.data.id
                    this.pay_status = data.data.pay_status
                    this.shopCouponsMoney()
                }
            },
            shopCouponsMoney(){
                //优惠合计 D
                this.form.coupons_total_money = this.floatAdd(parseFloat(this.form.shop_coupons_money),parseFloat(this.form.mall_coupons_money)) + ''
                this.form.should_pay_money = this.floatSub(parseFloat(this.form.order_money),parseFloat(this.form.coupons_total_money)) + ''
                //买家实付金额 F
                this.form.actual_pay_money = this.form.should_pay_money + ''
                //平台补贴金额 G
                this.form.mall_allowance_money = this.form.mall_coupons_money + ''
                //计算机服务费的交易金额 H
                this.form.service_total_money = this.floatAdd(parseFloat(this.form.should_pay_money),parseFloat(this.form.mall_allowance_money)) + ''

                //技术服务费金额 J
                this.form.service_money = this.floatMul(parseFloat(this.form.service_total_money),this.floatp(parseFloat(this.form.commission),100)).toFixed(2) + ''
                //系统结算金额 L
                this.form.settlement_money = this.floatSub(this.floatSub(parseFloat(this.form.service_total_money),parseFloat(this.form.service_money)),parseFloat(this.form.return_money)) + ''
            },
            goBack() {
                if (window.history.length <= 1) {
                    this.$router.push({path:'/'})
                    return false
                } else {
                    this.$router.go(-1)
                }
            },
            async onSubmit() {
                let params = JSON.parse(JSON.stringify(this.form))
                if(params.pay_status_type == 4 && params.remark==''){
                    this.errorMessage = '请输入不结算的理由，便于商家查看'
                    this.fail()
                    return false
                }
                if(params.pay_status_type == 2){
                    if(params.remark==''){
                        this.errorMessage = '请输入人工调账的理由，便于商家查看'
                        this.fail()
                        return false
                    }
                    //检验 结算金额与系统结算金额差异超过20%
                    let d_value = 0
                    if(this.settlementInfo.settlement_money > params.settlement_money){
                        d_value = this.floatSub(parseFloat(this.settlementInfo.settlement_money),parseFloat(params.settlement_money))
                    }else{
                        d_value = this.floatSub(parseFloat(params.settlement_money),parseFloat(this.settlementInfo.settlement_money))
                    }
                    let than = this.floatp(d_value,this.settlementInfo.settlement_money).toFixed(2)
                    if(than>0.2){
                        this.settlementCheck = false
                        return false
                    }
                    this.settlementCheck = true
                }
                //把数值转为字符串类型
                params.commission = this.floatp(parseFloat(params.commission),100)
                params.return_money = params.return_money + ''
                params.commission = params.commission + ''
                params.mall_coupons_money = params.mall_coupons_money + ''
                params.shop_coupons_money = params.shop_coupons_money + ''
                let data = await this.$request.request(this.$API.common_api, params, 'main', 'PUT', {
                    router_path: 'store/settlementHandle',
                    request_host: 'STORE_SERVER_HOST',
                    extra_url: `?id=${params.id}`,
                    handle_desc: '结算处理;' + this.$route.query.id
                })
                if( data.code == 200 ){
                    this.success()
                    this.$router.push('/store/settlement')
                }else{
                    this.errorMessage = data.msg
                    this.fail()
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
            floatTwoShopCouponsMoney() {
                // 通过正则过滤小数点后两位
                this.form.shop_coupons_money = (this.form.shop_coupons_money.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
            },
            floatTwoMallCouponsMoney() {
                // 通过正则过滤小数点后两位
                this.form.mall_coupons_money = (this.form.mall_coupons_money.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
            },
            floatTwoReturnMoney() {
                // 通过正则过滤小数点后两位
                this.form.return_money = (this.form.return_money.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
            },
            floatOne() {
                // 通过正则过滤小数点后一位
                this.form.commission = (this.form.commission.match(/^\d*(\.?\d{0,1})/g)[0]) || null;
            },
            //乘法运算
            floatMul(arg1,arg2){
                let m=0,s1=arg1.toString(),s2=arg2.toString();
                try{m+=s1.split(".")[1].length}catch(e){}
                try{m+=s2.split(".")[1].length}catch(e){}
                return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
            },
            //除法运算
            floatp(arg1,arg2){
                let t1=0,t2=0,r1,r2;
                try{t1=arg1.toString().split(".")[1].length}catch(e){}
                try{t2=arg2.toString().split(".")[1].length}catch(e){}
                r1=Number(arg1.toString().replace(".",""));
                r2=Number(arg2.toString().replace(".",""));
                return (r1/r2)*Math.pow(10,t2-t1);
            },
            //加法运算
            floatAdd(arg1,arg2){
                let r1,r2,m;
                try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
                try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
                m=Math.pow(10,Math.max(r1,r2));
                return (arg1*m+arg2*m)/m;
            },
            //减法运算
            floatSub(arg1,arg2){
                let r1,r2,m,n;
                try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
                try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
                m=Math.pow(10,Math.max(r1,r2));
                //动态控制精度长度
                n=(r1>=r2)?r1:r2;
                return ((arg1*m-arg2*m)/m).toFixed(n);
            }
        },
        filters: {
            //时间戳转为时间格式
            getLocalTime(value) {
                if(value){
                    let date = new Date(value*1000);
                    let y = date.getFullYear();
                    let MM = date.getMonth() + 1;
                    MM = MM < 10 ? ('0' + MM) : MM;
                    let d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    let h = date.getHours();
                    h = h < 10 ? ('0' + h) : h;
                    let m = date.getMinutes();
                    m = m < 10 ? ('0' + m) : m;
                    let s = date.getSeconds();
                    s = s < 10 ? ('0' + s) : s;
                    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
                }
                return ''
            },
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/pageHeader";

    .content {

        .table-content {
            .handle{
                width: 750px;
            }
        }

        .white {
            background: #ffffff;
        }
        .bot_agree {
            color: #FF422C;
        }
    }
</style>
