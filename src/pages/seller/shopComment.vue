<template>
  <div class="content">
    <div class="pages-header">
      <div>店铺评价</div>
    </div>
    <div class="content-cont">
      <div class="form-search">
        <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
          <el-form-item label="店铺名称" prop="create_time">
            <el-input v-model="searchForm.shop_name" placeholder="店铺名称" ></el-input>
          </el-form-item>
          <el-form-item label="公司名称" prop="company_name">
            <el-input v-model="searchForm.company_name" placeholder="店铺名称" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" >筛选</el-button>
            <el-button @click="resetForm('searchForm')">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-content">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="shop_id" label="序号" ></el-table-column>
          <el-table-column prop="shop_name" label="店铺" ></el-table-column>
          <el-table-column prop="company_name" label="公司名称" ></el-table-column>
          <el-table-column prop="express_comment" label="物流服务评分"></el-table-column>
          <el-table-column prop="server_comment" label="服务态度评分"></el-table-column>
          <el-table-column prop="desc_comment" label="描述评分" ></el-table-column>
          <el-table-column prop="all_comment"  label="总评分" >
            <template slot-scope="scope">
              {{scope.row.express_comment+scope.row.server_comment+scope.row.desc_comment}}
            </template>
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
            <el-button size="mini" @click="show_shop_comment_list(scope.$index)" >评价明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-page">
          <div class="block">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page="pageNo"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import tagList from '../../components/TagList'

  export default {
    data() {
      return {
        pageNo: 1,
        pageSizes: [5, 30, 50],
        pageSize: 10,
        total: 0,
        tableData: [],
        searchForm:{
           shop_name:'',
           company_name:'',
        },
      }
    },
    created() {
      this.get_shop_comment_list()
    },
    methods: {
      async handleCurrentChange(val) {
        this.pageNo = val;
        this.get_shop_comment_list()
      },
      async get_shop_comment_list() {

        let res = await this.$request.get(this.$API.common_api,
          {
            page:this.pageNo,
            page_size: this.pageSize,
            shop_name: this.searchForm.shop_name,
            company_name: this.searchForm.company_name,
          },'main',
          {
            router_path: 'shop/get_shop_comment',
            request_host: 'APP_SELLER_SERVER_HOST',
            handle_desc:'查看店铺评价;'
        });
        this.tableData=res.data.result;
        this.total=res.data.count
      },
      show_shop_comment_list(index){
        this.$router.push({
          path: '/seller/shopCommentInfo',
          query:{
            shop_id:this.tableData[index].shop_id,
            shop_name:this.tableData[index].shop_name,
            express_comment:this.tableData[index].express_comment,
            server_comment:this.tableData[index].server_comment,
            desc_comment:this.tableData[index].desc_comment,
            company_name:this.tableData[index].company_name,
            all_comment:this.tableData[index].server_comment+this.tableData[index].desc_comment+this.tableData[index].express_comment,
          }
        })
      },
      search(){
        this.get_shop_comment_list()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.get_shop_comment_list()
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/pageHeader";

  .content-cont {
    width: calc(~"100% - 30px");
    margin: 15px;
    min-height: 10px;
    background: #ffffff;
  }

  .form-search {
    margin: 15px;
  }
</style>
