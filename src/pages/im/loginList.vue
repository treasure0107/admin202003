<template>
  <div class="content">
    <div class="pages-header">
      <div>
        <spam >IM-在线监控</spam>
        <span style="margin-left: 300px">在线：{{online}}</span>
        <span style="margin-left: 300px">离线：{{offline}}</span>
      </div>
    </div>
    <div class="table-content">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="lid" label="店铺ID" >
          <template slot-scope="scope">
            {{scope.row[0]}}
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="店铺" >
          <template slot-scope="scope">
            {{scope.row[1]}}
          </template>
        </el-table-column>
        <el-table-column prop="object_id" label="状态" >
          <template slot-scope="scope">
            {{scope.row[2]}}
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

</template>

<script>
  import tagList from '../../components/TagList'

  export default {
    data() {
      return {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        online:'',
        offline:'',
        operator_time_start:'',
        operator_time_end:'',
        member_name_list:[]
      }
    },
    created() {
      this.get_seller_login_list();
    },
    methods: {
      async handleCurrentChange(val) {
        this.pageNo = val;
        this.get_seller_login_list()
      },

      async get_seller_login_list() {
        let res = await this.$request.get(this.$API.common_api,
          {
            page: this.pageNo,
          },'main',
          {
            router_path: 'seller/imLoginStatus',
            request_host: 'SELLER_SERVER_HOST',
            handle_desc:''
          });
        console.log(res.data[0].statusData);
        this.tableData=res.data[0].statusData;
        this.online=res.data[0]['online'];
        this.offline=res.data[0]['offline'];
        this.total=res.data[0]['online']+res.data[0]['offline']
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.get_seller_login_list()
      },
      search(){
        if(this.searchForm.operator_time){
          console.log(this.searchForm.operator_time);
          this.operator_time_start=this.searchForm.operator_time[0];
          this.operator_time_end=this.searchForm.operator_time[1];
        }
        this.get_seller_login_list()
      },
    },
    filters:{
      filterT(str){
        if(str){
          return str.replace('T', ' ')
        }else{
          return  '';
        }

      }
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

</style>
