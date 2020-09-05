<template>
  <div class="table-content">
    <div style="padding: 5px 0 10px 0">
      <el-page-header @back="$router.back()" content="">
      </el-page-header>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first"></el-tab-pane>
      <el-tab-pane :label="'报价明细（'+ledTotal+'）'" name="second"></el-tab-pane>
      <el-tab-pane label="日志信息" name="third"></el-tab-pane>
    </el-tabs>

    <div class="list-info" v-if="activeName==='first'">
      <div class="list-info-item" style="width: 100%">
        <div class="item-left">采购单号</div>
        <div class="item-right">{{dataInfo.PurchaseSn}}</div>
      </div>
      <div class="list-info-item" style="width: 250px">
        <div class="item-left">采购会员</div>
        <div class="item-right">
          {{dataInfo.User ? (dataInfo.User.Mobile + ' | ') : ''}}
          {{dataInfo.User ? dataInfo.User.Email : ''}}
        </div>
      </div>

      <div class="list-info-item" style="width: calc(100% - 250px)">
        <div class="item-left">收货信息</div>
        <div class="item-right user-info">
          <div>{{dataInfo.AddressInfo ? dataInfo.AddressInfo.consignee : ''}}</div>
          <div>{{dataInfo.AddressInfo ? dataInfo.AddressInfo.mobile : ''}}</div>
          <div>
            {{dataInfo.AddressInfo ?
            dataInfo.AddressInfo.province_id.split('_')[1]+dataInfo.AddressInfo.city_id.split('_')[1]+dataInfo.AddressInfo.area_id.split('_')[1]+dataInfo.AddressInfo.address
            : ''}}
          </div>
        </div>
      </div>

      <div class="list-info-item" style="width: 25%">
        <div class="item-left">采购商品</div>
        <div class="item-right">{{dataInfo.GoodsName}}</div>
      </div>

      <div class="list-info-item" style="width: 25%">
        <div class="item-left">总数量</div>
        <div class="item-right">{{dataInfo.GoodsQty}}</div>
      </div>

      <div class="list-info-item" style="width: 25%">
        <div class="item-left">交货日期</div>
        <div class="item-right">{{dataInfo.DeliveryEndTimes}}</div>
      </div>

      <div class="list-info-item" style="width: 25%;">
        <div class="item-left">报价截止</div>
        <div class="item-right">{{dataInfo.QuotedEndTimes}}</div>
      </div>

      <div class="border-bottom"></div>

      <div class="list-info-item" style="width: 100%">
        <div class="item-left">详情描述</div>
        <div class="item-right">{{dataInfo.DetailsDesc}}</div>
      </div>

      <div class="list-info-item" style="width: 100%">
        <div class="item-left">物料名称</div>
        <div class="item-right">{{dataInfo.MaterielName}}</div>
      </div>

      <div class="list-info-item" style="width: 100%">
        <div class="item-left">规格要求</div>
        <div class="item-right">
          <template v-for="(item,index) in dataInfo.AttrName">
            {{item}}
          </template>
        </div>
      </div>

      <div class="list-info-item" style="width: 100%;">
        <div class="item-left">采购描述</div>
        <div class="item-right">
            {{dataInfo.PurchaseListDesc}}
        </div>
      </div>

      <div class="list-info-item" style="width: 100%">
        <div class="item-left">成品图片</div>
        <div class="item-right">
          <preview-image :image="img.url" :download="true" :filename="img.imgName" :key="'GoodsPicture'+index"
                         :width="'50px'" v-for="(img,index) in dataInfo.GoodsPicture"></preview-image>
        </div>
      </div>

      <div class="list-info-item" style="width: 100%">
        <div class="item-left">设计文件</div>
        <div class="item-right">

          <div class="file-items" v-for="(img,index) in dataInfo.Documents">
            {{img.imgName}}
            <div class="download" @click="$common.downloadFile(img.url,img.imgName)">下载</div>
          </div>

          <!--<preview-image :image="img.url" :key="'Documents'+index"
                         :width="'50px'" v-for="(img,index) in dataInfo.Documents"></preview-image>-->
        </div>
      </div>

      <div class="list-info-item" style="width: 100%">
        <div class="item-left" style="min-width: 52px">QQ</div>
        <div class="item-right">{{dataInfo.QQ}}</div>
      </div>

      <div class="list-info-item" style="width: 100%">
        <div class="item-left" style="min-width: 52px">状态</div>
        <div class="item-right">{{statusList[dataInfo.Status]}}</div>
      </div>


      <div class="list-info-item" style="width: 100%">
        <div class="item-left">报价说明</div>
        <div class="item-right">
          {{['','普通发票','专用发票','不开发票'][dataInfo.Invoice]}}
          <template v-for="(item,i) in dataInfo.Include">
            |{{['含税','含运费','含打样','月结'][item]}}
          </template>
        </div>
      </div>


      <div class="list-info-item" style="width: 100%">
        <div class="item-left">特别说明</div>
        <div class="item-right">{{dataInfo.SpecialNote}}</div>
      </div>

      <div class="list-info-item" style="width: 100%">
        <div class="item-left">运费说明</div>
        <div class="item-right">{{dataInfo.ExpressDesc}}</div>
      </div>

      <div class="list-info-item" style="width: 100%">
        <div class="item-left">包装要求</div>
        <div class="item-right">{{dataInfo.PackingRequirements}}</div>
      </div>


      <div class="list-info-item" style="width: 100%">
        <div class="item-left">其它服务</div>
        <div class="item-right">{{dataInfo.OtherSupports}}</div>
      </div>
      <!--<div class="list-info-item">
        <div class="item-left">产品类型</div>
        <div class="item-right">{{['未知','一种印刷品','多种印刷品','企业印'][dataInfo.PurchaseType]}}</div>
      </div>

      <div class="list-info-item" v-if="dataInfo.PurchaseType==2">
        <div class="item-left">采购清单</div>
        <div class="item-right">
          <div class="file-items" v-for="(url,index) in dataInfo.PurchaseList">
            {{url.imgName}}
            <div class="download" @click="$common.downloadFile(url.url)">下载</div>
          </div>
        </div>
      </div>

      <div class="list-info-item" v-else>
        <div class="item-left">产品类别</div>
        <div class="item-right">
          <span v-for="(item,index) in dataInfo.CatList">{{item}} > </span>
        </div>
      </div>



      <div class="list-info-item">
        <div class="item-left">物料编码</div>
        <div class="item-right">{{dataInfo.Code}}</div>
      </div>



      <div class="list-info-item">
        <div class="item-left">采购数量</div>
        <div class="item-right">{{dataInfo.GoodsQty}}</div>
      </div>

      <div class="list-info-item">
        <div class="item-left">采购描述</div>
        <div class="item-right">
          <div class="file-items">
            {{dataInfo.PurchaseListDesc}}
          </div>
        </div>
      </div>

      <div class="list-info-item">
        <div class="item-left">采购描述文件</div>
        <div class="item-right">
          <div class="file-items" v-for="(img,index) in dataInfo.PurchaseList">
            {{img.imgName}}
            <div class="download" @click="$common.downloadFile(img.url)">下载</div>
          </div>
        </div>
      </div>










      <div class="list-info-item">
        <div class="item-left">手机号码</div>
        <div class="item-right">{{dataInfo.MobileNumber}}</div>
      </div>

      <div class="list-info-item">
        <div class="item-left">QQ</div>
        <div class="item-right">{{dataInfo.QQ}}</div>
      </div>



      <div class="list-info-item">
        <div class="item-left">状态</div>
        <div class="item-right">{{statusList[dataInfo.Status]}}</div>
      </div>

      <div class="list-info-item" v-if="dataInfo.Status==6">
        <div class="item-left">审核原因</div>
        <div class="item-right" style="color: red;">{{dataInfo.AuditMessage}}</div>
      </div>

      <div class="list-info-item">
        <div class="item-left">最终报价</div>
        <div class="item-right">{{dataInfo.Price}}</div>
      </div>

      <div class="list-info-item">
        <div class="item-left">成交订单</div>
        <div class="item-right">{{dataInfo.OrderSn}}</div>
      </div>

      <div class="list-info-item">
        <div class="item-left">成交日期</div>
        <div class="item-right">{{dataInfo.FixtureDates}}</div>
      </div>-->
 <div class="border-bottom"></div>
      <div class="list-info-item">
        <div class="item-left"></div>
        <div class="item-right" v-if="dataInfo.Status==5">
          <el-button type="success" size="medium" @click="submitForm(true)">审核通过</el-button>
          <el-button type="primary" size="medium" @click="openCheck=true">审核不通过</el-button>
          <el-button type="danger" @click="$router.push('/purchase/edit?id='+id+'&user='+dataInfo.BuyerId)" v-if="dataInfo.PurchaseType==1">代编采购单</el-button>
        </div>
      </div>
    </div>

    <!--审核-->
    <el-dialog title="审核不通过" :visible.sync="openCheck" width="40%">
      <el-form ref="form" :model="form" label-width="50px">
        <el-form-item label="原因">
          <el-input type="textarea" rows="5" v-model="form.AuditMessage"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(false)">确定</el-button>
          <el-button @click="openCheck=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--审核-->


    <!--报价明细-->
    <div class="baojia" v-if="activeName==='second'">
      <el-table :data="tableData" style="width: 100%;min-height: 300px" v-loading="loading" :key="3">
        <el-table-column prop="Id" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="ShopName" label="店铺" width="280">
        </el-table-column>
        <el-table-column prop="TotalPrice" label="报价" width="180">
          <template slot-scope="scope">
            ¥{{scope.row.TotalPrice}}
          </template>
        </el-table-column>
        <el-table-column prop="Remark" label="备注">
        </el-table-column>
        <el-table-column prop="QuotedTime" label="报价时间" width="250">
        </el-table-column>
      </el-table>
    </div>
    <!--报价明细-->

    <!--操作日志-->
    <div class="baojia" v-if="activeName==='third'">
      <div style="margin-top: 10px;padding-left: 8px;font-weight: 600;font-size: 14px">商家平台日志</div>
      <el-table :data="logsData" style="width: 100%;min-height: 300px" v-loading="loading" :key="1">
        <el-table-column prop="log_id" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="shop_name" label="操作人" width="180">
        </el-table-column>
        <el-table-column label="操作平台" width="180">
          {{'商家平台'}}
        </el-table-column>
        <el-table-column prop="operate_module" label="操作模块" width="180">
        </el-table-column>
        <el-table-column prop="operate_time" label="操作时间" width="180">
        </el-table-column>
        <el-table-column prop="operate_content" label="操作内容">
        </el-table-column>
      </el-table>

      <div style="margin-top: 40px;padding-left: 8px;font-weight: 600;font-size: 14px">运营平台日志</div>
      <el-table :data="syLogs" style="width: 100%;min-height: 300px" v-loading="loading" :key="2">
        <el-table-column prop="lid" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="user_name" label="操作人" width="180">
        </el-table-column>
        <el-table-column label="操作平台" width="180">
          {{'运营平台'}}
        </el-table-column>
        <el-table-column prop="operate_module" label="操作模块" width="180">
          {{'审核'}}
        </el-table-column>
        <el-table-column prop="add_time" label="操作时间" width="180">
          <template slot-scope="scope">
            {{scope.row.add_time.replace(/T/,' ')}}
          </template>
        </el-table-column>
        <el-table-column prop="handle_desc" label="操作内容">
        </el-table-column>
      </el-table>

    </div>
    <!--操作日志-->

  </div>
</template>
<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator"
    import PreviewImage from '@/components/PreviewImage'

    @Component({
        components: {PreviewImage}
    })
    export default class ListInfoComponent extends Vue {
        activeName: string = 'first';
        statusList: object = {'-1': '全部', 0: '报价中', 1: '已成交', 2: '暂停采购', 3: '已失效', 5: '审核中', 6: '审核未通过'};
        loading: boolean = false;
        tableData: any = [];
        logsData: any = [];
        syLogs: any = [];
        openCheck: boolean = false;
        count: number = 0;
        size: number = 10;
        id: string = '';
        dataInfo: object = {};
        ledTotal: number = 0;
        form: any = {
            PurchaseId: this.id,
            AuditStatus: 2,
            AuditMessage: ''
        };

        get purchase() {
            return this.$vuexStore.state.menuData.purchase
        }

        mounted() {
            if (!this.$route.query.id) {
                SendMessage({message: '参数错误', type: 'error'});
                this.$router.go(-1);
                return false
            }
            this.$route.query.tab && (this.activeName = this.$route.query.tab);

            this.id = this.$route.query.id + '';
            this.purchaseInfo().then();
            this.detailed().then()
        }

        async purchaseInfo(): Promise<void> {
            let {data} = await this.$request.get(this.$API.common_api, {quote_id: this.id}, 'main', {
                router_path: 'purchase/detail',
                request_host: 'PURCHASE_CATEGORY_HOST',
                handle_desc: `采购详情;${this.id}`
            });
            this.dataInfo = data
        }

        async detailed(): Promise<void> {
            this.loading = true;
            let {data, total} = await this.$request.get(this.$API.common_api, {
                quoted_id: this.id,
                pageSize: 100
            }, 'main', {
                router_path: 'purchase/detailed',
                request_host: 'PURCHASE_CATEGORY_HOST',
                handle_desc: `采购报价详情;${this.id}`
            });

            this.ledTotal = total ? total : 0;
            data = data ? data : [];
            for (let i = 0; i < data.length; i++) {
                data[i]['ShopName'] = await this.$common.sellerName(data[i]['ShopId'], this);
            }
            this.tableData = data;
            this.loading = false
        }

        async logsList(): Promise<void> {
            this.$request.get(this.$API.common_api, {
                quoted_id: this.id,
                operate_platform: 7,
                size: 100
            }, 'main', {
                router_path: 'seller/shopLog',
                request_host: 'SELLER_SERVER_HOST',
            }).then(async res => {
                let {data} = res;
                for (let i = 0; i < data.length; i++) {
                    data[i]['shop_name'] = await this.$common.sellerName(data[i]['shop_id'], this);
                }
                this.logsData = data;
            });


            const commonLog = async () => {
                let {data} = await this.$request.post(this.$API.common_logs, {
                    object_id: this.id,
                    node_id: '308'
                }, 'main');
                return data
            };

            this.syLogs = await commonLog();

        }

        async submitForm(state: boolean = false) {
            const sendRequest = async (): Promise<void> => {
                this.form.PurchaseId = parseInt(this.id);
                this.form.AuditStatus = state ? 1 : 2;
                await this.$request.request(this.$API.common_api, this.form, 'main', 'PUT', {
                    router_path: 'purchase/auditStatus',
                    request_host: 'PURCHASE_CATEGORY_HOST',
                    handle_desc: state ? `采购审核通过;${this.id}` : `采购审核不通过;${this.id}`
                });
                let sms_param = {};
                sms_param['target_list'] = [{
                    'target': this.dataInfo.MobileNumber,
                    'content': {'purchaseOrderNo': this.dataInfo.PurchaseSn}
                }];
                sms_param['routing_key'] = state ? 'sms_25' : 'sms_26';
                sms_param['content'] = {'purchaseOrderNo': 1};
                if (this.dataInfo.MobileNumber && this.dataInfo.PurchaseSn) await this.$request.request(this.$API.send_sms, {
                    'data': JSON.stringify(sms_param),
                    'type': 1
                }, 'main', 'GET', {handle_desc: `采购审核短信;${this.id}`});
                this.openCheck = false;
                let num: number = this.purchase >= 2 ? this.purchase - 1 : 0;
                this.$vuexStore.commit('changeMenu', {field: 'purchase', value: num});
                SendMessage({message: '操作成功', type: 'success'});
                await this.purchaseInfo()
            };

            if (!state) {
                sendRequest().then();
            } else {
                if (await this.$common.confirmDialog(this, '确认审核通过？')) sendRequest().then();
            }
        }


        unForm(): void {
            this.form = {
                PurchaseId: this.id,
                AuditStatus: 2,
                AuditMessage: ''
            }
        }

        @Watch('openCheck', {immediate: true, deep: true})
        onPersonChanged(val: Person, oldVal: Person) {
            !val && this.unForm()
        }

        @Watch('activeName', {immediate: true, deep: true})
        onActiveName(val: Person, oldVal: Person) {
            val === 'third' && this.logsList().then()
        }

        handleCurrentChange(e) {
            console.log(e)
        }
    }


</script>
<style lang="less" scoped>
  @import "../../assets/variable";

  .list-info {
    width: 100%;
    min-height: 500px;
    display: inline-block;

    .list-info-item {
      font-size: 13px;
      float: left;
      margin-top: 20px;
      color: #333333;
      display: flex;

      &:first-child {
        margin-top: 20px;
      }

      .item-left {
        text-align: right;
        float: left;
        min-width: 52px;
      }

      .item-right {
        /*width: calc(~"100% - 150px");*/
        padding-left: 20px;
        float: left;
        word-break: break-all;
        font-weight: 500;
        font-size: 14px;
        .file-items {
          width: auto;
          float: left;
          margin-left: 10px;

          &:first-child {
            margin-left: 0;
          }
        }

        .download {
          width: 60px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FFFFFF;
          border-radius: 5px;
          margin-top: 5px;
          background: #409EFF;
        }

        > a {
          margin-left: 10px;

          &:first-child {
            margin-left: 0;
          }
        }

        img {
          width: 50px;
          height: 80px;
        }
      }
      .user-info{
        >div{
          float: left;
          margin-left: 10px;
        }
      }
    }
    .border-bottom{
      border-bottom: 1px #CCCCCC dashed;
      width: 100%;
      padding: 10px 0 10px 0;
      float: left;
    }
  }
</style>