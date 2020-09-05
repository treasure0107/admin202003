<template>
  <div class="settled-in">
    <div class="settled-in-search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="店铺名称">
          <el-input v-model="formInline.rz_shop_name" placeholder="店铺名称"></el-input>
        </el-form-item>
        <el-form-item label="店铺类型">
          <el-select v-model="formInline.open_status" placeholder="店铺类型">
            <el-option :label="item" :value="index" v-for="(item,index) in shop_type" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="公司名称">
          <el-input v-model="formInline.company_name" placeholder="公司名称"></el-input>
        </el-form-item>

        <el-form-item label="审核状态">
          <el-select v-model="formInline.merchants_audit" placeholder="审核状态">
            <el-option :label="item" :value="index" v-for="(item,index) in check_status" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="申请时间">
          <el-date-picker
            v-model="formInline.create_time"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="storeList(true)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-content">
      <el-table :data="tableData" style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column prop="shop_id" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="rz_shop_name" label="店铺名称" width="180">
        </el-table-column>

        <el-table-column prop="open_status" label="店铺类型">
          <template slot-scope="scope">
            {{shop_type[scope.row.open_status+1]}}
          </template>
        </el-table-column>

        <el-table-column prop="companyInfo.company_name" label="公司名称">
        </el-table-column>
        <el-table-column prop="depositInfo.deposit_money" label="押金">
        </el-table-column>
        <el-table-column prop="depositInfo.rent_money" label="租金">
        </el-table-column>
        <el-table-column prop="create_time" label="申请时间">
        </el-table-column>

        <el-table-column prop="merchants_audit" label="审核状态">
          <template slot-scope="scope">
            {{check_status[scope.row.merchants_audit+1]}}
          </template>
        </el-table-column>
        <el-table-column prop="reviewer" label="审核人">
        </el-table-column>
        <el-table-column prop="update_time" label="审核时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button type="success" icon="el-icon-view" size="mini" circle
                         @click="$router.push('/seller/storeJoinInfo?id='+scope.row.shop_id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="$router.push('/seller/storeJoinInfo?id='+scope.row.shop_id+'&edit=1')"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages-style">
        <el-pagination background layout="total,prev, pager, next" :total="count" :page-size="size"
                       @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
    export default {
        data () {
            return {
                loading: false,
                shop_type: ['全部', '公司公有店', '公司私有店', '个人公有店', '企业私域店', '个人私域店', '个人私有店'],
                check_status: ['全部', '待入驻', '待付款', '待审核', '入驻成功', '审核不通过'],
                count: 10,
                size: 20,
                page: 1,
                formInline: {
                    rz_shop_name: '',
                    open_status: '',
                    company_name: '',
                    merchants_audit: '',
                    create_time: []
                },
                tableData: []
            }
        },
        created () {
            this.storeList()
        },
        methods: {
            async storeList (page = false) {
                this.loading = true
                page && (this.page = 1)
                let param = JSON.parse(JSON.stringify(this.formInline))
                param.open_status = param.open_status == 0 ? '' : param.open_status - 1
                param.merchants_audit = param.merchants_audit == 0 ? '' : param.merchants_audit - 1
                param.page = this.page
                param.size = this.size

                if (param.create_time && param.create_time.length) {
                    param.start_time = new Date(param.create_time[0] + ' 00:00:00').getTime() / 1000
                    param.end_time = new Date(param.create_time[1] + ' 23:59:59').getTime() / 1000
                    delete param.create_time
                }

                let {data} = await this.$request.get(this.$API.common_api, param, 'main', {
                    request_host: 'STORE_SERVER_HOST',
                    router_path: 'store/seller_check'
                })
                this.tableData = data.data
                this.count = data.count
                this.loading = false
            },
            onSearch () {
                console.log(this.formInline)
            },
            handleCurrentChange (res) {
                this.page = res
                this.storeList()
            }
        }
    }
</script>
<style lang="less" scoped>
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
</style>
