<template>
  <div class="content">
    <div class="pages-header">
      <div>优惠券领取列表</div>
    </div>
    <div class="content-cont">

      <div class="table-content">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="id" label="序号" width="100"></el-table-column>
          <el-table-column prop="comment_user" label="用户名" width="200"></el-table-column>
          <el-table-column prop="goods_id" label="领取时间"width="200"></el-table-column>
          <el-table-column prop="comment_content" label="优惠券状态"width="200"></el-table-column>
          <el-table-column prop="comment_content" label="使用时间"width="200"></el-table-column>
          <el-table-column prop="comment_time" label="订单号" width="200"></el-table-column>
          <el-table-column prop="operate_content" label="支付金额" ></el-table-column>
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
        pageSize: 5,
        total: 0,
        tableData: [],
      }
    },
    created() {
      this.get_goods_comment_list()
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      async handleCurrentChange(val) {
        this.pageNo = val;
        this.get_goodsLog_list()
      },
      async get_goods_comment_list() {

        let res = await this.$request.get(this.$API.goods_comment);
        console.log(res.data.data);
        this.tableData=res.data.data;


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
