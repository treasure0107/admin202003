<!--采购列表 ainde.li-->
<template>
  <div class="settled-in">

    <div class="settled-in-search">
      <div style="float: left;width: 100%;height: 50px">
        <div style="float: left;width: calc(100% - 200px)">
          <el-tabs v-model="formInline.status">
            <el-tab-pane label="状态" name="all" disabled></el-tab-pane>
            <el-tab-pane :label="item" :name="index" v-for="(item,index) in statusList" :key="index"></el-tab-pane>
          </el-tabs>
        </div>
        <div style="float: right;width: 100px;text-align: center;line-height: 50px;font-size: 13px;"
             @click="$router.push('/purchase/email')">
          <el-button size="mini">通知管理</el-button>
        </div>
        <div style="float: right;width: 100px;text-align: center;line-height: 50px;font-size: 13px;"
             @click="$router.push('/purchase/turnList')">
          <el-button size="mini">转单列表</el-button>
        </div>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="发布日期">
          <el-date-picker
            v-model="formInline.createStart"
            type="daterange"
            align="left"
            value-format="timestamp"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交货日期">
          <el-date-picker
            v-model="formInline.deliveryStart"
            type="daterange"
            align="left"
            value-format="timestamp"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="报价截止">
          <el-date-picker
            v-model="formInline.quoteStart"
            type="daterange"
            align="left"
            value-format="timestamp"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="成交日期">
          <el-date-picker
            v-model="formInline.fixtureStart"
            type="daterange"
            align="left"
            value-format="timestamp"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="会员">
          <el-input v-model="formInline.userInfo" placeholder="会员"></el-input>
        </el-form-item>

        <el-form-item label="采购单号">
          <el-input v-model="formInline.purchaseSn" placeholder="采购单号"></el-input>
        </el-form-item>

        <el-form-item label="产品类型">
          <el-select v-model="formInline.purchaseType" placeholder="产品类型">
            <el-option :label="item" :value="index" v-for="(item,index) in productType" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购数量" class="demo-input-suffix">
          <el-col :span="11">
            <el-input v-model="formInline.qtyStart" placeholder="开始数量"></el-input>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center">-</el-col>
          <el-col :span="11">
            <el-input v-model="formInline.qtyEnd" placeholder="结束数量"></el-input>
          </el-col>
        </el-form-item>
        <!--<el-form-item label="状态">
          <el-select v-model="formInline.status" placeholder="状态">
            <el-option :label="item" :value="index" v-for="(item,index) in statusList" :key="index"></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="purchaseList(true)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="unFormInline">清空筛选条件</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-content">
      <el-table :data="tableData" style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column prop="Id" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="PurchaseSn" label="采购单号" width="200">
        </el-table-column>

        <el-table-column prop="BuyerId" label="会员" width="150">
          <template slot-scope="scope">
            {{scope.row.User ? scope.row.User.Mobile : ''}} <br/>
            {{scope.row.User ? scope.row.User.Email : ''}}
          </template>
        </el-table-column>

        <el-table-column prop="PurchaseType" label="产品类型" width="100">
          <template slot-scope="scope">
            {{scope.row.PurchaseType==1 ? scope.row.CatName : productType[scope.row.PurchaseType]}}
          </template>
        </el-table-column>
        <el-table-column prop="GoodsQty" label="采购数量">
        </el-table-column>


        <el-table-column prop="QuoteCount" label="报价商家数" width="100">
          <template slot-scope="scope">
            <div style="color: #409EFF;" @click="$router.push('/purchase/listInfo?id='+scope.row.Id+'&tab=second')">
              {{scope.row.QuoteCount}}
              <span style="font-size: 12px;color: #333">家</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTimes" label="发布时间" width="170">

        </el-table-column>
        <el-table-column prop="QuotedEndTimes" label="报价截止" width="170">
        </el-table-column>

        <el-table-column prop="DeliveryEndTimes" label="交货日期" width="170">
        </el-table-column>
        <el-table-column prop="Status" label="状态">
          <template slot-scope="scope">
            {{statusList['a'+scope.row.Status]}}
          </template>
        </el-table-column>
        <el-table-column prop="OrderSn" label="成交订单">
        </el-table-column>
        <el-table-column prop="FixtureDates" label="成交时间" width="170">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button type="success" icon="el-icon-view" size="mini" circle
                         @click="$router.push('/purchase/listInfo?id='+scope.row.Id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="转单" placement="top" v-if="formInline.status=='a0'">
              <el-button type="danger" icon="el-icon-refresh" size="mini" circle
                         @click="showTurn = true;turnInfo=scope.row;"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages-style">
        <el-pagination
          background :page-size="formInline.pageSize" @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="formInline.pageIndex"
          layout="sizes,total,prev, pager, next"
          :page-sizes="[10, 20, 50, 100,200]"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="采购转单" :visible.sync="showTurn" width="45%">
      <div v-if="!isSuccess">
        <div class="dialog-turn">
          <div>采购单号：<span>{{turnInfo.PurchaseSn}}</span></div>
          <div>
            会员：<span>{{turnInfo.User ? turnInfo.User.Mobile : ''}} {{turnInfo.User ? turnInfo.User.Email : ''}}</span>
          </div>
        </div>

        <div>转单给：
          <el-select v-model="turnUser" filterable remote reserve-keyword placeholder="输入邮箱或手机搜索"
                     :remote-method="remoteMethod" :loading="turnLoading">

            <el-option
              v-for="(item,index) in options"
              :key="item.id"
              :label="item.user_id+'：'+item.nick_name"
              :value="index">
            </el-option>
          </el-select>
        </div>
        <div style="color: red;margin: 10px 0 0 65px;font-size: 13px"
             v-if="options[turnUser] && options[turnUser].user_id==turnInfo.BuyerId">
          请选择其他用户
        </div>
      </div>
      <div v-else style="font-size: 24px;color: #6ce26c;text-align: center;height: 80px;line-height: 80px;padding-bottom: 40px;">转单成功</div>
      <span slot="footer" class="dialog-footer" v-if="!isSuccess">
          <el-button @click="showTurn = false">取 消</el-button>
          <el-button type="primary" @click="submitTurn()">确 定</el-button>
        </span>
    </el-dialog>


  </div>
</template>
<script lang='ts'>
    import {Vue, Component, Watch} from "vue-property-decorator"

    /**
     * Vue Class用法参考：
     * https://github.com/vuejs/vue-class-component
     * https://github.com/kaorun343/vue-property-decorator
     * */
    @Component()
    export default class ListComponent extends Vue {
        // data
        data: string = "";
        data1: string = "";
        formInline: any = {
            quoteStart: [],
            quoteEnd: '',
            deliveryStart: [],
            deliveryEnd: '',
            createStart: [],
            createEnd: '',
            fixtureStart: [],
            fixtureEnd: '',
            qtyStart: '',
            qtyEnd: '',
            purchaseSn: '',
            status: 'a5',
            purchaseType: '-1',
            userInfo: '',
            pageSize: 10,
            pageIndex: 1,
        };
        showTurn: boolean = false;
        turnInfo: any = [];
        turnUser = '';
        turnLoading: boolean = false;
        options: any = [];
        total: number = 0;
        isSuccess: boolean = false;

        productType: object = {'-1': '全部', 1: '一种印刷品', 2: '多种印刷品', 3: '企业印'};
        statusList: any = {
            'a-1': '全部',
            'a5': '待审核',
            'a6': '审核未通过',
            'a0': '报价中',
            'a1': '已成交',
            'a2': '暂停采购',
            'a3': '已失效'
        };
        loading: boolean = false;
        tableData: any = [];
        count: number = 0;
        size: number = 0;

        // computed
        get sum(): number {
            return parseInt(this.data + this.data1, 10)
        }


        // lifecycle hook
        mounted() {
            this.data = "1";
            this.data1 = "2";
            // this.purchaseList().then()
        }

        async purchaseList(search = false): Promise<void> {
            this.loading = true;
            let param = JSON.parse(JSON.stringify(this.formInline));

            const setTimes = (time: any): any => {
                return time && time.length ? [time[0] / 1000, time[1] / 1000 + 60 * 60 * 24 - 1] : ['', '']
            };
            param['status'] = param['status'].replace('a', '');

            [param.createStart, param.createEnd] = setTimes(param.createStart);
            [param.quoteStart, param.quoteEnd] = setTimes(param.quoteStart);
            [param.deliveryStart, param.deliveryEnd] = setTimes(param.deliveryStart);
            [param.fixtureStart, param.fixtureEnd] = setTimes(param.fixtureStart);

            if (search) {
                param.pageIndex = 1;
                this.formInline.pageIndex = 1;
            }
            let data = await this.$request.get(this.$API.common_api, param, 'main', {
                router_path: 'purchase/list',
                request_host: 'PURCHASE_CATEGORY_HOST',
                handle_desc: '采购列表;'
            });
            if (param['status'] == 5) {
                this.$vuexStore.commit('changeMenu', {field: 'purchase', value: data.total})
            }
            this.loading = false;
            this.tableData = data.data;
            this.total = data.total;
        }

        async remoteMethod(query) {
            if (query != '') {
                this.turnUser = '';
                this.options = [];
                this.turnLoading = true;
                let isEmail: boolean = query.indexOf('@') > 0 ? true : false;
                let param: any = isEmail ? {'email': query, 'status': 1} : {'mobile': query, 'status': 1};
                let {data} = await this.$request.request(this.$API.common_api, param, 'main', 'GET', {
                    router_path: 'zt/users',
                    request_host: 'MEMBER_USER_HOST',
                });
                this.turnLoading = false;
                this.options = data.data;
            }
        }

        async submitTurn() {
            let user: object = this.options[this.turnUser];
            if (user && this.turnInfo['Status'] == 0) {
                if (user['user_id'] == this.turnInfo.BuyerId) {
                    SendMessage({type: 'warning', message: '请选择其他用户'});
                    return false;
                }
                await this.$request.request(this.$API.common_api, {
                        'ReceiveUserId': user['user_id'],
                        'QuoteId': this.turnInfo['Id'],
                        'OperatorId': this.$common.getNowUserId('admin_id')
                    }, 'main', 'PUT', {
                        router_path: 'purchase/change_owner',
                        request_host: 'PURCHASE_CATEGORY_HOST',
                        handle_desc: `采购转单;${this.turnInfo.Id}`
                    }
                );
                this.isSuccess = true;
                this.purchaseList().then();
            } else {
                SendMessage({type: 'warning', message: '没有选择用户'});
            }
        }

        handleCurrentChange(event: number): void {
            this.formInline.pageIndex = event;
            this.purchaseList().then()
        }

        handleSizeChange(event: number): void {
            this.formInline.pageIndex = 1;
            this.formInline.pageSize = event;
            this.purchaseList().then()
        }

        @Watch('formInline.status', {immediate: true, deep: true})
        onPersonChanged(val: Person, oldVal: Person) {
            this.purchaseList().then()
        }

        @Watch('showTurn', {immediate: true, deep: true})
        onShowTurn(val: Person, oldVal: Person) {
            if (!val) {
                this.turnUser = '';
                this.options = [];
                this.isSuccess = false;
                this.turnLoading = false;
            }
        }

        unFormInline(): void {
            this.formInline = {
                quoteStart: [],
                quoteEnd: '',
                deliveryStart: [],
                deliveryEnd: '',
                createStart: [],
                createEnd: '',
                fixtureStart: [],
                fixtureEnd: '',
                qtyStart: '',
                qtyEnd: '',
                purchaseSn: '',
                status: 'a-1',
                purchaseType: '-1',
                userInfo: '',
                pageSize: 10,
                pageIndex: 1,
            };
            this.purchaseList().then()
        }
    }
</script>
<style scoped lang="less">
  @import "../../assets/variable";

  .settled-in {
    .settled-in-search {
      width: calc(~"100% - 60px");
      padding: 15px;
      margin: 5px 15px 15px 15px;
      background: #ffffff;
      box-shadow: @contentBoxShadow;
      border-radius: @contentBorderRadius;

      .demo-form-inline {
        padding-top: 22px;
      }
    }
  }

  .dialog-turn {
    width: 100%;
    display: inline-table;
    margin-bottom: 20px;

    > div {
      float: left;
      margin-left: 20px;

      &:first-child {
        margin-left: 0;
      }

      > span {
        color: #333333;
        font-weight: 500;
      }
    }
  }
</style>