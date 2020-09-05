<template>
  <div class="content">
    <div class="pages-header">
      <div>团购管理</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="addtg">创建团购</el-button>
    </div>
    <div class="content-cont table-content">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">全部</el-menu-item>
        <el-menu-item index="2">未开始</el-menu-item>
        <el-menu-item index="3">进行中</el-menu-item>
        <el-menu-item index="4">已结束</el-menu-item>
      </el-menu>
      <div class="form-search">
          <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="searchForm.goods_name" placeholder="商品名称" ></el-input>
            </el-form-item>
          <el-form-item label="店铺名称" prop="shop_id">
            <el-select v-model="searchForm.shop_id" filterable placeholder="店铺名称,输入名称可搜索" >
              <el-option
                v-for="item in shop_list"
                :key="item.shop_id"
                :label="item.shop_name"
                :value="item.shop_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" >筛选</el-button>
            <el-button @click="resetForm('searchForm')">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="">
        <el-table  ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"  @selection-change="handleSelectionChange">>
          <el-table-column type="selection" prop="aid" label="序号" width="100"></el-table-column>
          <el-table-column prop="aid" label="序号"></el-table-column>
          <el-table-column label="商品" >
            <template slot-scope="scope">
                {{scope.row.goods_name}}
              <el-button size="mini" v-if="scope.row.status != 2" @click="show_goods_info(scope.row.spu_id,scope.row.shop_id1,scope.row.aid)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="shop_id" label="店铺名称"></el-table-column>
          <el-table-column label="团购时间" >
            <template slot-scope="scope">
              {{scope.row.start_time|formatDate}}<br/>{{scope.row.end_time|formatDate}}
            </template>
          </el-table-column>
          <el-table-column prop="" label="团购状态">
            <template slot-scope="scope">
              <div v-if="scope.row.status==1">
                <span v-if="scope.row.start_time > now_time">未开始</span>
                <span v-else-if="scope.row.start_time <= now_time && scope.row.end_time >=now_time">进行中</span>
                <span v-else-if="scope.row.end_time < now_time">已结束</span>
              </div>
              <div v-if="scope.row.status==2">
                <span>草稿</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" >
            <template slot-scope="scope">
              <el-button size="mini" v-if="scope.row.start_time > now_time || scope.row.status == 2"  @click="show_edit_activity(scope.row.aid)">编辑</el-button>
              <el-button size="mini"  @click="show_activity_info(scope.row.aid)">查看详情</el-button>
              <el-button size="mini"  type="danger" v-if="scope.row.start_time <= now_time && scope.row.end_time >=now_time && scope.row.status==1" @click="end_activity(scope.row.aid)">结束团购</el-button>
              <el-button size="mini" @click="show_tg_log(scope.row.aid)">操作日志</el-button>
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
  // import custom_config from '@/../custom_config.js'

  export default {
    data () {
      return {
        pageNo: 1,
        ppy_host:CUSTOM_CONFIG.PPY_HOST,
        pageSizes:[5,30,50],
        pageSize:10,
        total:0,
        activeIndex:'1',
        tableData: [],
        multipleSelection: [],
        selectRows:[],
        searchForm:{
          shop_id: '',
          goods_name: '',
        },
        shop_list:[],
        showForm:false,
        now_time:Date.parse(new Date())/1000
      }
    },
    created(){
      this.get_tg_list();
      this.get_shop_list();
    },

    methods: {
      handleSelect(key, keyPath) {
        console.log(key);
        this.pageNo=1;
        this.activeIndex=key;
        this.resetForm('searchForm');
        this.get_tg_list()

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.get_tg_list()
      },
      removeDomain(item) {
        let index = this.dynamicValidateForm.domains.indexOf(item);
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
      },
      toggleSelection(rows) {
        this.selectRows=rows;
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.selectRows=[];
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.selectRows=val;
        this.multipleSelection = val;
      },
      async handleSizeChange(val) {
        this.pageSize = val;
        this.get_tg_list()
      },
      async handleCurrentChange(val) {
        this.pageNo=val;
        this.get_tg_list()
      },
      handleDialogClose() {
        this.showForm = false;
      },
      async get_tg_list(){
        let create_time = this.searchForm.create_time;
        if(create_time!=''){
          create_time = Math.round(new Date(create_time).getTime()/1000);
        }
        let param={};
        param['pageNo']=this.pageNo;
        param['shop_id']=this.searchForm.shop_id;
        param['goods_name']=this.searchForm.goods_name;
        param['status']=this.activeIndex;
        let {data} = await this.$request.post(this.$API.activity_tg_list,
          param
          ,'main',
          {
            handle_desc:'查看团购列表;'
          });

        if(data.data){
          data.data.forEach(async item=>{
            if(item.shop_id){
              this.$request.get(this.$API.common_api, {shop_id:item.shop_id}, 'main',
                {
                  router_path: 'shop/get_shop_name',
                  request_host: 'APP_SELLER_SERVER_HOST',
                }).then((res)=>{
                item.shop_id1=item.shop_id;
                if(JSON.stringify(res.data) != "{}"){
                  item.shop_id=res.data[0]['shop_name'];
                }else{
                  item.shop_id='未知店铺'
                }
              });
            }
          });
        }
        this.tableData=data.data;
        this.total=data.count;
      },

      search(){
        this.get_tg_list();
      },

      show_goods_info(goods_id,shop_id,aid){
        window.open(this.ppy_host+'/customer/shop/'+shop_id+'/goods/1/'+aid+'/'+goods_id,'_blank');
      },

      show_tg_log(aid){
        this.$router.push({
          path: '/activity/tgLog',
          query:{aid:aid}
        })
      },

      show_edit_activity(aid){
        this.$router.push({
          path: '/activity/editTg',
          query:{aid:aid}
        })
      },
      show_activity_info(aid){
        this.$router.push({
          path: '/activity/tgInfo',
          query:{aid:aid}
        })
      },

      addtg(){
        this.$router.push({
          path: '/activity/addtg',
        })
      },
      async end_activity(aid){
        await this.$confirm('你确定要结束该团购活动吗，请谨慎操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await this.$request.post(this.$API.end_tg,
            {aid:aid},
            'main',
            {
              handle_desc: '结束团购;'+aid
            });
          if(res.code==200) {
            SendMessage({
              message: '操作成功',
              type: 'success'
            });
            this.get_tg_list();
          }else{
            SendMessage({
              message: '操作失败',
              type: 'error'
            });
          }
        }).catch(() => {

        })

      },
      async get_shop_list(){
        let res = await this.$request.get(this.$API.common_api, '', 'main',
          {
            router_path: 'shop/get_shop_name_list',
            request_host: 'APP_SELLER_SERVER_HOST',
            handel_class: ''
          });
        this.shop_list=res.data;
      },

    },
    filters:{
      formatDate(time) {
        let times = time * 1000;
        let date = new Date(times);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s
      }
    },
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
  .form-search{
    margin: 15px;
  }
</style>
