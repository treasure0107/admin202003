<!--成交动态-->
<template>
  <div class="settled-in">
    <div class="pages-header">
      <div>成交动态</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">新建虚拟动态</el-button>
    </div>
    <div class="settled-in-search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="求购日期">
          <el-date-picker
            v-model="formInline.create_time_start"
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
            v-model="formInline.fixture_date_start"
            type="daterange"
            align="left"
            value-format="timestamp"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>


        <el-form-item label="成交店铺" prop="shop_id">
          <el-select v-model="formInline.success_seller_id" :remote-method="remoteMethod" remote filterable
                     placeholder="输入名称可搜索">
            <el-option
              v-for="item in shop_list"
              :key="item.shop_id"
              :label="item.shop_name"
              :value="item.shop_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="虚拟店铺昵称" prop="virtual_shop">
          <el-input v-model="formInline.virtual_shop" placeholder="虚拟店铺昵称"></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="formInline.status" placeholder="类型">
            <el-option :label="item" :value="index" v-for="(item,index) in productType" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dataList(true)">筛选</el-button>
          <el-button @click="unDataList()">清空筛选条件</el-button>
        </el-form-item>
      </el-form>
    </div>


    <div class="table-content">
      <el-table :data="tableData" style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column prop="Id" label="序号" width="100">
        </el-table-column>
        <el-table-column prop="CreateTime" label="求购时间" width="180">
        </el-table-column>
        <el-table-column prop="GoodsName" label="求购内容" width="280">
        </el-table-column>
        <el-table-column prop="shop_name" label="成交店铺" width="190">
          <template slot-scope="scope">
            {{scope.row.VirtualShop ? scope.row.VirtualShop : scope.row.shop_name}}
          </template>
        </el-table-column>
        <el-table-column prop="FixtureDate" label="成交日期" width="180">
        </el-table-column>

        <el-table-column prop="OrderSn" label="订单号" width="180">
        </el-table-column>

        <el-table-column prop="VirtualOrderUser" label="类型" width="180">
          <template slot-scope="scope">
            {{scope.row.VirtualShop ? '虚拟' : '真实'}}
          </template>
        </el-table-column>

        <el-table-column prop="VirtualOrderUser" label="添加人" width="180">
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="scope.row.VirtualShop">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="editData(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="scope.row.VirtualShop">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteFloor(scope.row.Id)"
                         circle></el-button>
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
          :total="count">
        </el-pagination>
      </div>
    </div>


    <el-dialog title="添加虚拟成交动态" :visible.sync="showEdit" width="50%">
      <el-form ref="formss" :model="form" label-width="120px">
        <el-form-item label="求购时间" prop="create_time" :rules="{required: true, message: '请选择求购时间', trigger: 'blur'}">
          <el-date-picker v-model="form.create_time"
                          type="datetime"
                          value-format="timestamp"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="求购内容" prop="goods_name" :rules="{required: true, message: '请输入求购内容', trigger: 'blur'}">
          <el-input v-model="form.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="成交店铺" prop="success_seller_id"
                      :rules="{required: true, message: '请输入成交店铺', trigger: 'blur'}">
          <el-input v-model="form.success_seller_id"></el-input>
        </el-form-item>
        <el-form-item label="成交日期" prop="fixture_date" :rules="{required: true, message: '请输选择成交日期', trigger: 'blur'}">
          <el-date-picker v-model="form.fixture_date"
                          type="datetime"
                          value-format="timestamp"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitData">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>
<script lang="ts">
    import {Vue, Component, Watch} from "vue-property-decorator"

    @Component
    export default class Deal extends Vue {
        loading: boolean = false;
        productType: any = ['全部', '虚拟', '真实'];
        showEdit: boolean = false;
        formInline: any = {
            create_time_start: [],
            create_time_end: '',
            fixture_date_start: [],
            virtual_shop: '',
            fixture_date_end: '',
            quoted_id: 0,
            success_seller_id: '',
            status: 0,
            pageIndex: 1,
            pageSize: 10
        };

        form: any = {
            create_time: '',
            goods_name: '',
            success_seller_id: '',
            virtual_order_user: this.$common.getNowUserId('user_name'),
            fixture_date: '',
        };
        tableData: any = [];
        count: number = 0;
        shop_list: object = {};
        size: number = 10;

        mounted() {
            this.dataList().then()
        }

        async dataList(search: boolean = false): Promise<void> {
            let param = JSON.parse(JSON.stringify(this.formInline));

            const setTimes = (time: any): any => {
                return time && time.length ? [time[0] / 1000, time[1] / 1000 + 60 * 60 * 24 - 1] : [0, 0]
            };

            [param.create_time_start, param.create_time_end] = setTimes(param.create_time_start);
            [param.fixture_date_start, param.fixture_date_end] = setTimes(param.fixture_date_start);
            !param.success_seller_id && (param.success_seller_id = 0)
            if (search) {
                param.pageIndex = 1;
                this.formInline.pageIndex = 1;
            }

            let data = await this.$request.get(this.$API.common_api, param, 'main', {
                router_path: 'purchase/admin_purchase_list',
                request_host: 'PURCHASE_CATEGORY_HOST',
                handle_desc: '成交动态;'
            });
            for (let i = 0; i < data.data.length; i++) {
                !data.data[i].VirtualShop && (data.data[i]['shop_name'] = await this.$common.sellerName(data.data[i]['SuccessSellerId'], this));

            }
            this.loading = false;
            this.tableData = data.data;
            this.count = data.total;
        }

        editData(row): void {
            this.form.create_time = row.CreateTime ? new Date(row.CreateTime).getTime() : '';
            this.form.goods_name = row.GoodsName;
            this.form.success_seller_id = row.VirtualShop;
            this.form.virtual_order_user = this.$common.getNowUserId('user_name');
            this.form.fixture_date = row.FixtureDate ? new Date(row.FixtureDate).getTime() : '';
            this.form.seller_quoted_id = row.Id;
            console.log(this.form);
            this.showEdit = true
        }

        async deleteFloor(id) {
            if (await this.$common.confirmDialog(this, '你是否删除该虚拟数据？删除后不可恢复')) {
                await this.$request.request(this.$API.common_api, {id: id}, 'main', 'DELETE', {
                    router_path: 'purchase/admin_purchase_content',
                    request_host: 'PURCHASE_CATEGORY_HOST',
                    extra_url: '?id=' + id,
                    handle_desc: `删除虚拟成交动态;${id}`
                });
                this.dataList().then()
            }
        }

        async remoteMethod(e) {
            let {data} = await this.$request.get(this.$API.common_api, {shop_name: e}, 'main', {
                router_path: 'seller/shops',
                request_host: 'APP_SELLER_SERVER_HOST',
            });
            this.shop_list = data.result
        }

        unDataList(): void {
            this.formInline = {
                create_time_start: [],
                create_time_end: '',
                fixture_date_start: [],
                quoted_id: 0,
                fixture_date_end: '',
                virtual_shop: '',
                success_seller_id: '',
                status: 0,
                pageIndex: 1,
                pageSize: 10
            };
            this.shop_list = [];
            this.dataList().then()
        }

        unForm() {
            this.form = {
                create_time: '',
                goods_name: '',
                success_seller_id: '',
                virtual_order_user: this.$common.getNowUserId('user_name'),
                fixture_date: ''
            };
        }

        submitData(): void {
            this.$refs.formss.validate(async (valid) => {
                if (valid) {
                    let param = JSON.parse(JSON.stringify(this.form));
                    param.create_time = param.create_time / 1000;
                    param.fixture_date = param.fixture_date / 1000;
                    await this.$request.request(this.$API.common_api, param, 'main',
                        param.seller_quoted_id ? 'PUT' : "POST", {
                            router_path: 'purchase/admin_purchase_content',
                            request_host: 'PURCHASE_CATEGORY_HOST',
                            handle_desc: param.seller_quoted_id ? '添加虚拟成交动态;' : `修改虚拟成交动态;${param.seller_quoted_id}`
                        });
                    this.showEdit = false;
                    this.dataList().then()
                }
            })
        }

        handleCurrentChange(event: number): void {
            this.formInline.pageIndex = event;
            this.dataList().then()
        }

        handleSizeChange(event: number): void {
            this.formInline.pageIndex = 1;
            this.formInline.pageSize = event;
            this.dataList().then()
        }

        @Watch('showEdit', {immediate: true, deep: true})
        onPersonChanged(val: Person, oldVal: Person) {
            !val && this.unForm()
        }
    }
</script>
<style scoped lang="less">
  @import "../../assets/variable";
  @import "../../assets/pageHeader";

  .settled-in {
    .settled-in-search {
      width: calc(~"100% - 60px");
      padding: 15px;
      margin: 15px 15px 15px 15px;
      background: #ffffff;
      box-shadow: @contentBoxShadow;
      border-radius: @contentBorderRadius;

      .demo-form-inline {
        padding-top: 22px;
      }
    }
  }
</style>