<template>
  <div class="content">
    <div class="pages-header">
      <div><router-link to="/goods/goods" style="text-decoration:none;color:#000000;">商品列表</router-link>/商品日志</div>
    </div>
    <div class="content-cont table-content">
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="运营后台" name="1">
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
          <div class="table-content">
            <el-table ref="multipleTable" :data="tableData"   @sort-change="handleSortChange"  tooltip-effect="dark"  style="width: 100%;">
              <el-table-column prop="lid" label="序号" ></el-table-column>
              <el-table-column prop="admin_id" label="操作人" ></el-table-column>
              <el-table-column label="操作平台">运营后台</el-table-column>
              <el-table-column label="操作模块" >商品</el-table-column>
              <el-table-column prop="add_time"  sortable="custom" label="操作时间" >
                <template slot-scope="scope">
                  {{scope.row.add_time | filterT}}
                </template>
              </el-table-column>
              <el-table-column prop="handle_desc" label="操作内容" ></el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="商家后台" name="2">
          <div class="form-search">
            <el-form :inline="true" :model="searchForm1" ref="searchForm1" class="demo-form-inline">
              <el-form-item label="操作时间" prop="operator_time1">
                <el-date-picker
                  v-model="searchForm1.operator_time1"
                  type="datetimerange"
                  value-format="timestamp"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="操作人" prop="operator_name">
                  <el-input v-model="searchForm1.operator_name" placeholder="操作人" ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search1" >筛选</el-button>
                <el-button @click="resetForm1('searchForm1')">清空筛选条件</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table-content">
            <el-table ref="multipleTable" :data="tableData1" @sort-change="handleSortChange"  tooltip-effect="dark"   style="width: 100%;">
              <el-table-column prop="log_id" label="序号" ></el-table-column>
              <el-table-column prop="operator_name" label="操作人" ></el-table-column>
              <el-table-column  label="操作平台">商家后台</el-table-column>
              <el-table-column prop="operate_module" label="操作模块" >商品</el-table-column>
              <el-table-column prop="operate_time"  sortable="custom" label="操作时间" >
              </el-table-column>
              <el-table-column prop="operate_content" label="操作内容" ></el-table-column>
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
        </el-tab-pane>
      </el-tabs>

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
        activeIndex:'1',
        tableData: [],
        tableData1: [],
        member_name_list:[],
        searchForm:{
          operator_time: '',
          admin_id: '',
        },
        searchForm1:{
          operator_time1: '',
          operator_name: '',
        },
        operate_platform_list:[
          {
            value: 0,
            label: '运营后台'
          },
          {
            value: 1,
            label: '商家后台'
          }
        ],
        operator_time_start:'',
        operator_time_end:'',
        operator_time_start1:'',
        operator_time_end1:'',
        ordering:''
      }
    },
    created() {
      this.get_goodsLog_list();
      this.get_member_name_list();
    },
    methods: {
      handleClick(tab, event) {
        this.pageNo=1;
        if(this.activeIndex==1){
          this.get_goodsLog_list()
        }else{
          this.get_goodsLog_list1()
        }
      },
      async handleCurrentChange(val) {
        this.pageNo = val;
        if(this.activeIndex==1){
          this.get_goodsLog_list()
        }else{
          this.get_goodsLog_list1()
        }
      },
      async get_goodsLog_list() {
        let goods_id = this.$route.query.goods_id;

        let data = await this.$request.post(this.$API.goods_admin_log,
          {
            goods_id: goods_id,
            admin_id: this.searchForm.admin_id,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            operator_time_start: this.operator_time_start,
            operator_time_end: this.operator_time_end,
            ordering: this.ordering,
          }
          , 'main',{
            handle_desc:'查看运营后台商品日志列表;'+goods_id
          });
         data.data.forEach(async item=>{
          if(item.admin_id){
            item.admin_id=await this.$common.getUserName(item.admin_id,this);
          }else{
            item.admin_id='';
            item.add_time='';
          }
         });
          this.tableData=data.data;
          this.total=data.total;
      },
      async get_goodsLog_list1() {
        let goods_id = this.$route.query.goods_id;

        let data = await this.$request.get(this.$API.common_api,
          {
            goods_id: goods_id,
            page: this.pageNo,
            size: this.pageSize,
            start_time: this.operator_time_start1,
            end_time: this.operator_time_end1,
            operator_name: this.searchForm1.operator_name,
            ordering: this.ordering,
          }
          , 'main',
            {
              router_path: 'goods/goodsLog',
              request_host: 'APP_SELLER_SERVER_HOST',
              handle_desc:'查看商家后台商品日志列表;'+goods_id
            }
          );
        this.tableData1=data.data;
        this.total=data.total;
      },
      search(){
        if(this.searchForm.operator_time){
          console.log(this.searchForm.operator_time);
          this.operator_time_start=this.searchForm.operator_time[0];
          this.operator_time_end=this.searchForm.operator_time[1];
        }
        this.get_goodsLog_list()
      },
      search1(){
        if(this.searchForm1.operator_time1){
          this.operator_time_start1=this.searchForm1.operator_time1[0]/1000;
          this.operator_time_end1=this.searchForm1.operator_time1[1]/1000;
        }
        this.get_goodsLog_list1()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.operator_time_start='';
        this.operator_time_end='';
        this.get_goodsLog_list()
      },
      resetForm1(formName) {
        console.log('aaaa');
        this.$refs[formName].resetFields();
        this.operator_time_start1='';
        this.operator_time_end1='';
        this.get_goodsLog_list1()
      },
      async get_member_name_list(){
        let {data} = await this.$request.get(this.$API.get_name_list);
        this.member_name_list=data;
      },

      handleSortChange(val){
        console.log(val)
        if(val.prop=='operate_time'){
          this.ordering= val.order=="ascending"?val.prop:'-'+val.prop ;
          this.get_goodsLog_list1();
        }else{
          this.ordering= val.order=="ascending"?'asc':'desc' ;
          this.get_goodsLog_list();
        }


      }
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

  .form-search {
    margin: 15px;
  }
</style>
