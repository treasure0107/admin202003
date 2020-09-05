<template>
  <div class="content">
     <div class="content-cont table-content">
       <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
         <el-menu-item index="1">全部({{goods_num}})</el-menu-item>
         <el-menu-item index="2">待审核({{passaudit}})</el-menu-item>
         <el-menu-item index="3">审核未通过({{toaudit}})</el-menu-item>
         <el-menu-item index="4">上架({{itemupshel}})</el-menu-item>
         <el-menu-item index="5">下架({{soldout}})</el-menu-item>
       </el-menu>
       <div class="form-search">
         <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
           <el-form-item label="上传时间" prop="create_time">
             <el-date-picker
               v-model="searchForm.create_time"
               type="datetimerange"
               range-separator="至"
               value-format="timestamp"
               start-placeholder="开始日期"
               end-placeholder="结束日期">
             </el-date-picker>
           </el-form-item>
           <el-form-item label="审核时间" prop="operator_time">
             <el-date-picker
               v-model="searchForm.operator_time"
               type="datetimerange"
               range-separator="至"
               value-format="timestamp"
               start-placeholder="开始日期"
               end-placeholder="结束日期">
             </el-date-picker>
           </el-form-item>
           <el-form-item label="商品名称" prop="goods_name">
             <el-input v-model="searchForm.goods_name" placeholder="商品名称" ></el-input>
           </el-form-item>
           <el-form-item label="商品类型" prop="goods_type">
             <el-select v-model="searchForm.goods_type" placeholder="商品类型" >
               <el-option
                 v-for="item in goods_type_list"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
             </el-select>
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
           <el-form-item label="审核人" prop="operator_id">
           <el-select v-model="searchForm.operator_id" filterable placeholder="审核人,输入名称可搜索" >
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
       <div class="">
         <el-table  ref="multipleTable" :data="tableData" @sort-change="handleSortChange" tooltip-effect="dark" style="width: 100%"  @selection-change="handleSelectionChange">>
           <el-table-column type="selection" prop="goods_id" label="序号" width="100"></el-table-column>
           <el-table-column prop="goods_id" label="序号" width="100"></el-table-column>
           <el-table-column label="商品" s width="200">
             <template slot-scope="scope">
               <el-row @click="show_goods_info(scope.row.goods_id,scope.row.shop_id1)">
                 <preview-image :image="scope.row.goods_thumb_image" key="key" width="70px" style="float: left"></preview-image>
                 <span style="margin-left: 10px">
                   {{scope.row.goods_name}}
                   <br>
                   {{scope.row.goods_qty}}
                 </span>
               </el-row>
             </template>
           </el-table-column>
           <el-table-column prop="goods_price" sortable="custom" label="价格"></el-table-column>
           <el-table-column label="平台分类/商品类型" width="200">
             <template slot-scope="scope">
               {{scope.row.category.parent_name}}/{{scope.row.category.category_name}}
               <label type="success" size="mini" v-if="scope.row.goods_type==1" plain>生产</label>
               <label type="danger" size="mini" v-else plain>库存</label>
             </template>
           </el-table-column>
           <el-table-column prop="shop_id" label="店铺名称"></el-table-column>
           <el-table-column prop="goods_status" label="商品状态" width="100">
             <template slot-scope="scope">
               <label type="success" size="mini" v-if="scope.row.goods_status==0" plain>上架</label>
               <label type="danger" size="mini" v-else plain>下架</label>
             </template>
           </el-table-column>
           <el-table-column prop="desc" label="标签" >
             <template slot-scope="scope" v-if="scope.row.desc">
               <label type="success" size="mini"  v-for="item in scope.row.desc">{{item}}<br></label>
             </template>
           </el-table-column>
           <el-table-column prop="create_time"  sortable="custom" label="上传时间" width="150"></el-table-column>
           <el-table-column prop="operator_id" label="审核人" width="80"></el-table-column>
           <el-table-column prop="operator_time" sortable="custom"  label="审核时间"></el-table-column>
           <el-table-column prop="remark" label="原因"></el-table-column>
           <el-table-column fixed="right" label="操作" width="200">
             <template slot-scope="scope">
               <el-button size="mini" @click="show_goods_info(scope.row.spu_id,scope.row.shop_id1)">商品详情</el-button>
               <el-button size="mini"  @click="show_goods_log(scope.row.goods_id)">日志</el-button>

               <el-button size="mini" v-if="scope.row.goods_status==0"  @click="select_goods(1,2,scope.row.goods_id)">下架</el-button>
               <el-button size="mini" v-else @click="select_goods(0,2,scope.row.goods_id)">上架</el-button>
             </template>
           </el-table-column>
         </el-table>
         <div style="margin-top: 20px" v-if="activeIndex==2">
           <el-button @click="toggleSelection(tableData)">当页全选</el-button>

           <el-button @click="select_goods(1,1)" >审核通过</el-button>
           <el-button @click="select_goods(2,1)" >审核不通过</el-button>
         </div>
         <div style="margin-top: 20px" v-else-if="activeIndex==3">
           <el-button @click="toggleSelection(tableData)">当页全选</el-button>

           <el-button @click="select_goods(1,1)" >审核通过</el-button>
         </div>
         <div style="margin-top: 20px" v-else-if="activeIndex==4">
           <el-button @click="toggleSelection(tableData)">当页全选</el-button>

           <el-button @click="select_goods(1,2)" >下架</el-button>
           <el-button @click="set_tag()" >打标签</el-button>
         </div>
         <div style="margin-top: 20px" v-else-if="activeIndex==5">
           <el-button @click="toggleSelection(tableData)">当页全选</el-button>
           <el-button @click="select_goods(0,2)" >上架</el-button>
           <el-button @click="set_tag()" >打标签</el-button>
         </div>
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
    <!--添加-->
    <el-dialog title="设置标签" :visible.sync="showForm" width="60%" :before-close='handleDialogClose'>
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :label="'标签'"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
        >
          <el-input v-model="domain.value"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
          <el-button @click="addDomain">新增</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import PreviewImage from '../../components/PreviewImage'
  import tagList from '../../components/TagList'
  // import custom_config from '@/../custom_config.js'

    export default {
      data () {
        return {
          pageNo: 1,
          ppy_host:CUSTOM_CONFIG.PPY_HOST,
          pageSizes:[5,30,50],
          pageSize:5,
          total:0,
          activeIndex:'1',
          audit_status:'',
          goods_status:'',
          goods_num:0,
          passaudit:0,
          toaudit:0,
          soldout:0,
          itemupshel:0,
          tableData: [],
          multipleSelection: [],
          selectRows:[],
          checkArray:[],
          shopIdArray:[],
          searchForm:{
            goods_type:'',
            create_time: '',
            operator_time: '',
            shop_id: '',
            goods_name: '',
            operator_id: '',
          },
          goods_type_list:[
            {
              value: 0,
              label: '库存'
            },
            {
              value: 1,
              label: '生产'
            }
          ],
          create_time_start:'',
          create_time_end:'',
          operator_time_start:'',
          operator_time_end:'',
          remark:'',
          shop_list:[],
          member_name_list:[],
          ordering:'',
          dynamicValidateForm: {
            domains: [{
              value: ''
            }],
          },
          showForm:false,
          rules:{

          },
          tags_list:[]
        }
      },
      created(){
        this.get_goods_list();
        this.get_shop_list();
        this.get_member_name_list();
        this.get_goods_status_num();
      },

      methods: {
        handleSelect(key, keyPath) {
          console.log(key);
          this.audit_status='';
          this.goods_status='';
          this.pageNo=1;

          this.activeIndex=key;
          if(key==2){
            this.audit_status=0   //待审核
          }
          if(key==3){
            this.audit_status=2   //审核未通过
          }
          if(key==4){
            this.goods_status=0; //上架状态
          }
          if(key==5){
            this.goods_status=1; //下架状态
          }
          this.resetForm('searchForm');
          this.get_goods_list()

        },
        resetForm(formName) {
          console.log(formName);
          this.$refs[formName].resetFields();
          this.create_time_start='';
          this.create_time_end='';
          this.operator_time_start='';
          this.operator_time_end='';
          this.get_goods_list()
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
          this.get_goods_list()
        },
        async handleCurrentChange(val) {
          this.pageNo=val;
          this.get_goods_list()
        },
        handleDialogClose() {
          this.showForm = false;
        },
        async get_goods_status_num(){

          let data = await this.$request.get(this.$API.common_api,
            {}
            ,'main',
            {
              router_path: 'goods/get_goods_status_num',
              request_host: 'GOODS_SERVER_HOST',
            });
          this.goods_num=data.data.goods_num;
          this.itemupshel=data.data.itemupshel;
          this.soldout=data.data.soldout;
          this.toaudit=data.data.toaudit;
          this.passaudit=data.data.passaudit;
        },
        async get_goods_list(){
          let create_time = this.searchForm.create_time;
          if(create_time!=''){
            create_time = Math.round(new Date(create_time).getTime()/1000);
          }
          let param={};
          param['page']=this.pageNo;
          param['shop_id']=this.searchForm.shop_id;
          param['operator_id']=this.searchForm.operator_id;
          param['goods_name']=this.searchForm.goods_name;
          param['goods_type']=this.searchForm.goods_type;
          param['goods_status']=this.goods_status;
          param['audit_status']=this.audit_status;
          param['create_time_start']=this.create_time_start;
          param['create_time_end']=this.create_time_end;
          param['operator_time_start']=this.operator_time_start;
          param['operator_time_end']=this.operator_time_end;
          param['ordering']=this.ordering;
          let data = await this.$request.get(this.$API.common_api,
            param
            ,'main',
            {
              router_path: 'goods/goods',
              request_host: 'GOODS_SERVER_HOST',
              handle_desc:'查看商品列表;'
          });
          data.data.forEach(async item=>{
              if(item.operator_id){
                  item.operator_id = await this.$common.getUserName(item.operator_id,this);
              }else{
                item.operator_id='';
                item.operator_time='';
              }
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
          this.tableData=data.data;
          this.total=data.total;
        },

        async check_goods(check_audit_status,check_goods_status){
          let goods_id = this.checkArray;
          let handle_desc='';
          if(check_audit_status==1){
            handle_desc='商品审核通过';
          }else if(check_audit_status==2){
            handle_desc='商品审核不通过';
          }
          if(check_goods_status===0){
            handle_desc='上架商品'
          }else if(check_goods_status==1){
            handle_desc='下架商品'
          }
          if(this.tags_list!=''){
            handle_desc='商品打标签'
          }
          let result = await this.$request.request(this.$API.common_api,
            {
              goods_id:goods_id,
              audit_status:check_audit_status,
              goods_status:check_goods_status,
              operator_id:JSON.parse(sessionStorage.getItem('clientInfo')).admin_id,
              remark:this.remark,
              desc:this.tags_list
            }
            ,'main','PUT',{
              router_path: 'goods/goods',
              request_host: 'GOODS_SERVER_HOST',
              handle_desc:handle_desc+';'+goods_id
          });
          if(result.code==200){
            SendMessage({
              message:'操作成功',
              type:'success'
            });
            this.showForm=false;
            this.get_goods_list();
            this.get_goods_status_num();
          }
        },

        async select_goods(status,type,goods_id){
          this.checkArray=[];
          console.log(goods_id);
          if(this.selectRows=='' && goods_id==''){
            SendMessage({
              message:'你还没有选择商品',
              type:'error'
            });
            return false;
          }
          if(this.selectRows!=''){
            this.selectRows.forEach((item,index) => {
              this.checkArray.push(item.goods_id)
            });
          }else{
            this.checkArray.push(goods_id)
          }
          let check_audit_status='';
          let check_goods_status='';
          if(type==1){         //审核商品
            check_audit_status=status;
            if(check_audit_status==2){
                this.$prompt('请输入不通过原因', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(({ value }) => {
                  this.remark=value;
                  this.check_goods(check_audit_status,check_goods_status);
                }).catch(() => {
                  return false
                });
              }else{
              this.check_goods(check_audit_status,check_goods_status);
            }
          }else{
            check_goods_status=status;
            this.check_goods(check_audit_status,check_goods_status);
          }
        },

        set_tag(){
          this.checkArray=[];
          this.tags_list=[];
          if(this.selectRows==''){
            SendMessage({
              message:'你还没有选择商品',
              type:'error'
            });
            return false;
          }
          this.selectRows.forEach((item,index) => {
            this.checkArray.push(item.goods_id)
          });
          this.dynamicValidateForm.domains.forEach((item)=>{
            item.value=''
          });
          this.showForm=true;
        },

        submitForm(val){
          this.tags_list=[];
          let tags=this.dynamicValidateForm.domains;
          let tag=true;
          if(tags.length>5){
            SendMessage({
              message:'最多只能5个标签',
              type:'error'
            });
            return false;
          }
          tags.forEach(item=>{
            if(item.value=='' || (item.value).length>10){
              tag=false;
            }
            this.tags_list.push(item.value);
          });
          if(!tag){
            SendMessage({
              message:'请传入正确的标签长度',
              type:'error'
            });
            return false;
          }
          this.check_goods('','');
        },

        search(){
            this.pageNo = 1
            if(this.searchForm.create_time){
              this.create_time_start=this.searchForm.create_time[0]/1000;
                this.create_time_end=this.searchForm.create_time[1]/1000;
            }
            if(this.searchForm.operator_time){
              this.operator_time_start=this.searchForm.operator_time[0]/1000;
              this.operator_time_end=this.searchForm.operator_time[1]/1000;
            }
            this.get_goods_list();
        },


        show_goods_info(goods_id,shop_id){
          window.open(this.ppy_host+'/customer/shop/'+shop_id+'/goods/'+goods_id,'_blank');
        },

        show_goods_log(goods_id){
          this.$router.push({
            path: '/goods/goodsLog',
            query:{goods_id:goods_id}
          })
        },

        async get_admin_name(admin_id){
          console.log(admin_id);
          admin_id=1;
          if(admin_id){
            let res =await this.$request.post(this.$API.get_member_name,{admin_id:admin_id});
            console.log(res.data,"res.data");
            return res.data;
          }else{
            return ''
          }
        },

        async get_shop_list(){
          let res = await this.$request.get(this.$API.common_api, '', 'main',
            {
              router_path: 'shop/get_shop_name_list',
              request_host: 'APP_SELLER_SERVER_HOST',
              handel_class: ''
            });
          console.log(res);
          this.shop_list=res.data;
        },

        async get_member_name_list(){
          let {data} = await this.$request.get(this.$API.get_name_list);
          this.member_name_list=data;
        },

        handleSortChange(val){
          this.ordering= val.order=="ascending"?val.prop:'-'+val.prop ;
          this.get_goods_list();
        }
      },
      components: {
        PreviewImage
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
  .form-search{
    margin: 15px;
  }
</style>
