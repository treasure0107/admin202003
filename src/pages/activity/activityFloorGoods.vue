<template>
  <div class="content">
    <div class="pages-header">
      <div>活动模板楼层商品</div>
    </div>
    <!--    <div class="content-cont table-content">
          <div class="form-search">
            <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
              <el-form-item label="操作时间" prop="operator_time">
                <el-date-picker
                  v-model="searchForm.operator_time"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="操作人" prop="admin_id">
                <el-select v-model="searchForm.admin_id" filterable placeholder="操作人,输入名称可搜索" >
                  <el-option
                    v-for="item in member_name_list"
                    :key="item.admin_id"
                    :label="item.user_name"
                    :value="item.admin_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search" >筛选</el-button>
                <el-button @click="resetForm('searchForm')">清空筛选条件</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>-->
    <div class="table-content">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="lid" label="序号" ></el-table-column>
        <el-table-column prop="user_name" label="商品ID" ></el-table-column>
        <el-table-column prop="object_id" label="商品图片" ></el-table-column>
        <el-table-column prop="node_name" label="商品名称"></el-table-column>
        <el-table-column prop="node_name" label="商品价格"></el-table-column>
        <el-table-column prop="node_name" label="商品角标"></el-table-column>
        <el-table-column prop="node_name" label="所属店铺"></el-table-column>
        <el-table-column prop="handle_desc" label="排序值"></el-table-column>
        <el-table-column prop="" label="操作" fixed="right" width="300px" >
          <template slot-scope="scope" >
            <el-button size="mini">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
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
        pageSizes: [5, 30, 50],
        pageSize: 10,
        total: 0,
        tableData: [],
        searchForm:{
          operator_time: '',
          admin_id: '',
        },
        operator_time_start:'',
        operator_time_end:'',
        member_name_list:[]
      }
    },
    created() {
      this.get_member_log_list();
      this.get_member_name_list();
    },
    methods: {
      async handleCurrentChange(val) {
        this.pageNo = val;
        this.get_member_log_list()
      },
      async get_member_name_list(){
        let {data} = await this.$request.get(this.$API.get_name_list);
        this.member_name_list=data;
      },
      async get_member_log_list() {
        let res = await this.$request.post(this.$API.get_member_log,
          {
            admin_id: this.searchForm.admin_id,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            operator_time_start: this.operator_time_start,
            operator_time_end: this.operator_time_end,
          },'main',
          {
            handle_desc:'查看日志列表;'
          });
        this.tableData=res.data;
        this.total=res.total
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.get_member_log_list()
      },
      search(){
        if(this.searchForm.operator_time){
          console.log(this.searchForm.operator_time);
          this.operator_time_start=this.searchForm.operator_time[0];
          this.operator_time_end=this.searchForm.operator_time[1];
        }
        this.get_member_log_list()
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
