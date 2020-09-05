<!--采购列表 ainde.li-->
<template>
  <div class="settled-in">

    <div class="settled-in-search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.type" placeholder="请选择">
            <el-option label="转单日期" :value="0"></el-option>
            <el-option label="交货日期" :value="1"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="">
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


        <el-form-item label="当前用户">
          <el-input v-model="formInline.userInfo" placeholder="会员名"></el-input>
        </el-form-item>

        <el-form-item label="采购单号">
          <el-input v-model="formInline.purchaseSn" placeholder="采购单号"></el-input>
        </el-form-item>

        <el-form-item label="原采购单用户">
          <el-input v-model="formInline.originalUserInfo" placeholder="会员名"></el-input>
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
        <el-form-item>
          <el-button @click="$router.push('/purchase/list')">返回采购单管理</el-button>
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

        <el-table-column prop="DeliveryEndTimes" label="交货日期" width="170">
        </el-table-column>

        <el-table-column prop="QuotedEndTimes" label="报价截止" width="170">
        </el-table-column>
        <el-table-column prop="TurnUserId" label="转单会员">
          <template slot-scope="scope">
            {{scope.row.OriginalUser ? scope.row.OriginalUser.Mobile : ''}} <br/>
            {{scope.row.OriginalUser ? scope.row.OriginalUser.Email : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="ExchangeTimes" label="转单时间" width="170">
        </el-table-column>
        <el-table-column prop="admin" label="转单操作人" width="170">
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button type="success" icon="el-icon-view" size="mini" circle
                         @click="$router.push('/purchase/listInfo?id='+scope.row.QuoteId)"></el-button>
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

  </div>
</template>
<script lang='ts'>
    import {Vue, Component} from "vue-property-decorator"

    @Component()
    export default class ListComponent extends Vue {
        // data
        data: string = "";
        data1: string = "";
        formInline: any = {
            type: 0,
            quoteStart: [],
            quoteEnd: '',
            originalUserInfo: '',
            purchaseSn: '',
            userInfo: '',
            pageIndex: 1,
            pageSize: 10,
        };
        total: number = 0;
        options: any = [];
        turnLoading: boolean = false;

        loading: boolean = false;
        tableData: any = [];
        productType: object = {'-1': '全部', 1: '一种印刷品', 2: '多种印刷品', 3: '企业印'};

        // computed
        get sum(): number {
            return parseInt(this.data + this.data1, 10)
        }


        // lifecycle hook
        mounted() {
            this.purchaseList().then()
        }

        async purchaseList(search = false): Promise<void> {
            this.loading = true;
            let param = JSON.parse(JSON.stringify(this.formInline));
            const setTimes = (time: any): any => {
                return time && time.length ? [time[0] / 1000, time[1] / 1000 + 60 * 60 * 24 - 1] : ['', '']
            };
            if (this.formInline.type == 0) {
                [param.changeStart, param.changeEnd] = setTimes(param.quoteStart);
            } else {
                [param.deliveryStart, param.deliveryEnd] = setTimes(param.quoteStart);
            }
            if (search) {
                param.pageIndex = 1;
                this.formInline.pageIndex = 1;
            }
            let data = await this.$request.get(this.$API.common_api, param, 'main', {
                router_path: 'purchase/exchange_list',
                request_host: 'PURCHASE_CATEGORY_HOST',
                handle_desc: '采购转单列表;'
            });
            let datas = data.data;
            datas.forEach(async (item, index) => {
                datas[index]['admin'] = await this.$common.getUserName(item['OperatorId'], this)
            });
            this.loading = false;
            this.tableData = datas;
            console.log(this.tableData)
            this.total = data.total;
        }

        async remoteMethod(query, type) {
            if (query != '') {
                type == 1 ? this.formInline.user = '' : this.formInline.tuser = '';
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

        handleCurrentChange(event: number): void {
            this.formInline.page = event;
            this.purchaseList().then()
        }

        handleSizeChange(event: number): void {
            this.formInline.page = 1;
            this.formInline.size = event;
            this.purchaseList().then()
        }

        unFormInline(): void {
            this.formInline = {
                type: 0,
                quoteStart: [],
                quoteEnd: '',
                originalUserInfo: '',
                purchaseSn: '',
                userInfo: '',
                pageIndex: 1,
                pageSize: 10,
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