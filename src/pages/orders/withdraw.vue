<template>
  <div class="content">
    <div class="settled-in-search">
      <el-tabs v-model="formInline.abnormal_state" type="card">
        <el-tab-pane label="正常" name="0"></el-tab-pane>
        <el-tab-pane label="异常" name="1"></el-tab-pane>
      </el-tabs>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="申请状态">
          <el-select v-model="formInline.apply_state" placeholder="申请状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option :label="item" :value="index" v-for="(item,index) in apply_state" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提现状态">
          <el-select v-model="formInline.execute_state" placeholder="提现状态">
            <el-option :label="item" :value="index" v-for="(item,index) in execute_state" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="formInline.company_name" placeholder="公司名称"></el-input>
        </el-form-item>
        <el-form-item label="平台流水">
          <el-input v-model="formInline.shop_cash_sn" placeholder="平台流水"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="formInline.bank_account" placeholder="银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="处理ID号">
          <el-input v-model="formInline.execute_admin_id" placeholder="处理ID号"></el-input>
        </el-form-item>

        <el-form-item label="申请时间">
          <el-date-picker
            v-model="formInline.apply_time"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="witch_list(false,true)">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="unFormInline">清空筛选条件</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-content">
      <el-table :data="result" stripe style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column fixed prop="id" label="序号" width="80"></el-table-column>
        <el-table-column prop="shop_id" label="商户ID" width="80"></el-table-column>
        <el-table-column prop="shop_cash_sn" label="平台流水号"></el-table-column>
        <el-table-column prop="company_name" label="公司名称"></el-table-column>
        <el-table-column prop="withdraw_money" label="提现金额"></el-table-column>
        <el-table-column prop="bank_name" label="提现银行"></el-table-column>
        <el-table-column prop="bank_account" label="银行账号"></el-table-column>
        <el-table-column prop="bank_union_number" label="银联号"></el-table-column>
        <el-table-column prop="bank_cash_sn" label="银行流水号"></el-table-column>
        <el-table-column prop="apply_state" label="申请状态" width="120">
          <template slot-scope="scope">
            {{apply_state[scope.row.apply_state]}}
          </template>
        </el-table-column>
        <el-table-column prop="execute_state" label="提现状态" width="120">
          <template slot-scope="scope">
            {{execute_state[scope.row.execute_state]}}
          </template>
        </el-table-column>
        <el-table-column prop="execute_bank_name" label="处理银行"></el-table-column>
        <el-table-column prop="execute_admin_id" label="处理ID"></el-table-column>
        <el-table-column prop="execute_admin_name" label="处理人"></el-table-column>
        <el-table-column prop="abnormal_info" label="异常信息"></el-table-column>
        <el-table-column prop="apply_time" label="申请时间"></el-table-column>
        <el-table-column prop="finish_time" label="完成时间"></el-table-column>

        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="驳回" placement="top"
                        v-if="scope.row.apply_state==0 && scope.row.execute_state==4">
              <el-button type="warning" icon="el-icon-close" size="mini" circle
                         @click="rejectApply(scope.$index)"></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="无异常处理" placement="top"
                        v-if="formInline.abnormal_state==1 && scope.row.apply_state==0">
              <el-button type="success" icon="el-icon-check" size="mini" circle
                         @click="drawAgain(scope.row.id)"></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="提现" placement="top"
                        v-if="formInline.abnormal_state==0 && scope.row.apply_state==0 && scope.row.execute_state==4">
              <el-button type="danger" icon="el-icon-check" size="mini" circle
                         @click="openWallet(scope.$index)"></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="流水记录" placement="top">
              <el-button icon="el-icon-view" size="mini" circle
                         @click="showMoneyLog(scope.row.shop_id,scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="操作记录" placement="top">
              <el-button icon="el-icon-link" size="mini" circle
                         @click="showLogs(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-page" style="background: #ffffff;padding: 10px;text-align: right">
        <div class="block">
          <el-pagination
            background
            @current-change="(val)=>{formInline.page=val;witch_list()}"
            :current-page="formInline.page"
            :page-size="formInline.size"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog title="商家流水记录" :visible.sync="moneyLog.showLog" width="70%">
      <el-table :data="moneyLog.list" stripe style="width: 100%;min-height: 300px">
        <el-table-column fixed prop="log_id" label="序号" width="80"></el-table-column>
        <el-table-column prop="order_id" label="订单id" width="200"></el-table-column>
        <el-table-column prop="amount" label="金额"></el-table-column>
        <el-table-column prop="frozen_money" label="冻结金额"></el-table-column>
        <el-table-column prop="log_type" label="操作类型">
          <template slot-scope="scope">
            {{['未知','提现','结算','充值','提现'][scope.row.log_type]}}
          </template>
        </el-table-column>
        <el-table-column prop="apply_sn" label="结算单号"></el-table-column>
        <el-table-column prop="is_paid" label="状态">
          <template slot-scope="scope">
            {{{'0':'未支付','1':'已支付','2':'待处理','3':'处理中','4':'已处理',10:'驳回'}[scope.row.is_paid]}}
          </template>
        </el-table-column>
        <el-table-column prop="frozen_money" label="操作时间">
          <template slot-scope="scope">
            {{scope.row.add_time |formatDate}}
          </template>
        </el-table-column>
      </el-table>
      <div class="table-page" style="background: #ffffff;padding: 10px;text-align: right">
        <div class="block">
          <el-pagination
            background
            @current-change="(val)=>{moneyLog.page=val;showMoneyLog()}"
            :current-page="moneyLog.page"
            :page-size="moneyLog.size"
            layout="total, prev, pager, next"
            :total="moneyLog.total">
          </el-pagination>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="操作日志" :visible.sync="logs.show" width="60%">
      <el-table :data="logs.list" stripe style="width: 100%;">
        <el-table-column fixed prop="handle_desc" label="操作描述">
          <template slot-scope="scope">
            {{scope.row.handle_desc.split(';')[0]}}
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="操作人"></el-table-column>
        <el-table-column prop="add_time" label="操作时间">
          <template slot-scope="scope">
            {{scope.row.add_time.replace('T',' ')}}
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="操作ip"></el-table-column>
      </el-table>
    </el-dialog>


    <el-dialog title="确认提现" :visible.sync="walletList.show" width="80%">
      <el-table :data="walletList.list" stripe style="width: 100%;">
        <el-table-column fixed prop="id" label="序号" width="80"></el-table-column>
        <el-table-column fixed prop="shop_id" label="商户ID" width="80"></el-table-column>
        <el-table-column prop="shop_cash_sn" label="平台流水号"></el-table-column>
        <el-table-column prop="company_name" label="公司名称"></el-table-column>
        <el-table-column prop="withdraw_money" label="提现金额"></el-table-column>
        <el-table-column prop="bank_name" label="提现银行"></el-table-column>
        <el-table-column prop="bank_account" label="银行账号"></el-table-column>
        <el-table-column prop="bank_union_number" label="银联号"></el-table-column>
        <el-table-column prop="bank_cash_sn" label="银行流水号"></el-table-column>
        <el-table-column prop="apply_state" label="申请状态" width="120">
          <template slot-scope="scope">
            {{apply_state[scope.row.apply_state]}}
          </template>
        </el-table-column>
        <el-table-column prop="execute_state" label="提现状态" width="120">
          <template slot-scope="scope">
            {{execute_state[scope.row.execute_state]}}
          </template>
        </el-table-column>
        <el-table-column prop="execute_bank_name" label="处理银行"></el-table-column>
        <el-table-column prop="execute_admin_id" label="处理ID"></el-table-column>
        <el-table-column prop="execute_admin_name" label="处理人"></el-table-column>
        <el-table-column prop="apply_time" label="申请时间"></el-table-column>
      </el-table>
      <el-form ref="form" label-width="100px" style="margin-top: 50px">
        <el-form-item label="选择处理银行">
          <el-select v-model="walletList.bankUrl" placeholder="选择处理银行">
            <el-option :label="temp.name" :value="temp.url" v-for="(temp,key) in bankList" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitWallet">确认提交</el-button>
          <el-button @click="walletList.show=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>
<script>
    export default {
        data () {
            return {
                apply_state: ['已申请', '已处理', '已驳回'],
                execute_state: ['全部', '处理中', '转账成功', '转账失败', '待处理'],
                bankList: [
                    {
                        value: 1,
                        name: '工商银行',
                        url: 'wallet/pay_icbc'
                    },
                    {
                        value: 1,
                        name: '建设银行',
                        url: 'wallet/pay_ccb'
                    }
                ],
                showLog: true,
                loading: false,
                formInline: {
                    abnormal_state: '0',
                    apply_state: '-1',
                    execute_state: 0,
                    shop_cash_sn: '',
                    company_name: '',
                    bank_account: '',
                    execute_admin_id: '',
                    apply_time: '',
                    finish_time: '',
                    size: 7,
                    page: 1
                },
                moneyLog: {
                    shop_id: 0,
                    list: [],
                    showLog: false,
                    page: 1,
                    size: 10,
                    total: 0
                },
                logs: {
                    show: false,
                    list: []
                },
                walletList: {
                    list: [],
                    show: false,
                    bankUrl: ''
                },
                total: 0,
                result: []
            }
        },
        created () {
            this.witch_list()
        },
        methods: {
            async witch_list () {
                this.loading = true
                let param = JSON.parse(JSON.stringify(this.formInline))
                param.execute_state == 0 && (param.execute_state = '')
                // param.abnormal_state != 2 && (param.abnormal_state = '')
                param.apply_state == -1 && (param.apply_state = '')
                param.apply_time.length && (param.finish_time = param.apply_time[1])
                param.apply_time.length && (param.apply_time = param.apply_time[0])
                let {data} = await this.$request.get(this.$API.common_api, param, 'main', {
                    router_path: 'wallet/draw_list',
                    request_host: 'STORE_SERVER_HOST',
                    handle_desc: '提现列表;'
                })
                this.total = data.count
                this.result = data.result
                this.loading = false
            },

            /**
             * 驳回提现
             */
            async rejectApply (index) {
                if (await this.$common.confirmDialog(this, '是否要驳回该条提现？此操作不可回退')) {
                    let {id, shop_id} = this.result[index]
                    let userName = this.$common.getNowUserId('user_name')
                    let admin_id = this.$common.getNowUserId('admin_id')
                    await this.$request.request(this.$API.common_api, {
                        id: id, shop_id: shop_id,
                        execute_admin_name: userName,
                        execute_admin_id: admin_id
                    }, 'main', 'PUT', {
                        request_host: 'STORE_SERVER_HOST',
                        router_path: 'wallet/reject',
                        handle_desc: `驳回提现;${id}`
                    })
                    SendMessage({message: '驳回成功', type: 'success'})
                    this.witch_list()
                }
            },

            openWallet (index) {
                this.walletList.show = true
                this.walletList.list = [this.result[index]]
            },

            /**
             * 商家资金明细
             */
            async showMoneyLog (shop_id = 0, id = 0) {
                this.moneyLog.showLog = true
                shop_id && (this.moneyLog.shop_id = shop_id)
                let {data} = await this.$request.get(this.$API.common_api, {
                    shop_id: this.moneyLog.shop_id,
                    page: this.moneyLog.page,
                    size: this.moneyLog.size
                }, 'main', {
                    request_host: 'STORE_SERVER_HOST',
                    router_path: 'wallet/money_log'
                })
                this.moneyLog.total = data.count
                this.moneyLog.list = data.result
            },

            /**
             * 无异常处理订单
             * @param id
             * @returns {Promise<void>}
             */
            async drawAgain (id) {
                let userName = this.$common.getNowUserId('user_name')
                let admin_id = this.$common.getNowUserId('admin_id')
                if (await this.$common.confirmDialog(this, '是否无异常处理该笔提现？此操作无法回退，谨慎操作⚠️')) {
                    await this.$request.request(this.$API.common_api, {
                        id: id,
                        execute_admin_name: userName,
                        execute_admin_id: admin_id
                    }, 'main', 'PUT', {
                        request_host: 'STORE_SERVER_HOST',
                        router_path: 'wallet/draw_again',
                        handle_desc: `无异常处理;${id}`
                    })
                    SendMessage({message: '处理成功', type: 'success'})
                    this.witch_list()
                }
            },

            /**
             * 提现到银行
             * @returns {Promise<boolean>}
             */
            async submitWallet () {
                if (!this.walletList.bankUrl) {
                    SendMessage({message: '请选择处理银行', type: 'warning'})
                    return false
                }
                if (!this.walletList.list.length) {
                    SendMessage({message: '没有提现记录', type: 'warning'})
                    return false
                }
                let order_sn = this.walletList.list[0]['apply_cash_sn']
                if (!order_sn) {
                    SendMessage({message: '提现订单号为空', type: 'warning'})
                    return false
                }
                if (await this.$common.confirmDialog(this, '是否要提交到银行处理该笔提现？此操作会真实打款且无法回退，请谨慎操作')) {
                    let _this = this
                    let bankIndex = _.findIndex(this.bankList, function (o) {
                        return o.url == _this.walletList.bankUrl
                    })
                    let userName = this.$common.getNowUserId('user_name')
                    let {data} = await this.$request.post(this.$API.common_api, {
                        ReqNo: order_sn,
                        execute_admin_name: userName
                    }, 'main', {
                        request_host: 'WALLET_SERVER_HOST',
                        router_path: this.walletList.bankUrl,
                        handle_desc: `提现打款【${this.bankList[bankIndex].name}】;${this.walletList.list[0].id}`
                    })
                    this.walletList.show = false
                    SendMessage({message: data.iRetMsg, type: data.Result != 6 ? 'success' : 'error'})
                    this.walletList.bankUrl = ''
                    this.witch_list()
                }
            },

            async showLogs (id) {
                let {data} = await this.$request.post(this.$API.walletLogs, {object_id: id})
                this.logs.list = data
                this.logs.show = true
            },

            unFormInline () {
                this.formInline = {
                    abnormal_state: this.formInline.abnormal_state,
                    apply_state: '-1',
                    execute_state: 0,
                    shop_cash_sn: '',
                    company_name: '',
                    bank_account: '',
                    execute_admin_id: '',
                    apply_time: '',
                    finish_time: '',
                    pagesize: 7,
                    page: 1
                }
                this.witch_list()
            }
        },
        filters: {
            formatDate (time) {
                const checkValue = (value) => {
                    return value <= 9 ? '0' + value : value
                }
                let times = time * 1000
                let date = new Date(times)
                let Y = date.getFullYear()
                let M = date.getMonth()
                let D = date.getDate()
                let h = date.getHours()
                let m = date.getMinutes()
                let s = date.getSeconds()
                return Y + '-' + checkValue(M) + '-' + checkValue(D) + ' ' + checkValue(h) + ':' + checkValue(m) + ':' + checkValue(s)
            }
        },
        watch: {
            'formInline.abnormal_state' (e) {
                console.log(e)
                this.formInline.page = 1
                this.witch_list()
            },
            'moneyLog.showLog' (e) {
                !e && ((res) => {
                    this.moneyLog.page = 1
                    this.moneyLog.total = 0
                })()
            }
        }
    }
</script>
<style lang="less" scoped>
  @import "../../assets/pageHeader";
</style>
