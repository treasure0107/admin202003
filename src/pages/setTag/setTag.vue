<template>
  <div class="content">
    <div class="pages-header">
      <div>标签管理</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="dialogAdd()">添加标签</el-button>
    </div>
    <div class="content-cont table-content">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">商家标签</el-menu-item>
        <el-menu-item index="2">商品标签</el-menu-item>
        <el-menu-item index="3">用户标签</el-menu-item>
      </el-menu>
      <div class="">
        <el-table  v-if="activeIndex==1" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" >
          <el-table-column prop="seller_label_id"  fixed label="序号"></el-table-column>
          <el-table-column prop="label_name"  label="标签名称"></el-table-column>
          <el-table-column prop="sort"   label="展示优先级"></el-table-column>
          <el-table-column prop="description"  label="说明"></el-table-column>
          <el-table-column prop="is_use"  label="状态">
            <template slot-scope="scope">
              {{scope.row.is_use==0?'禁用中':'启用中'}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="300">
            <template slot-scope="scope">
              <el-button size="mini" @click="edit_shop_tag(scope.row)">编辑</el-button>
              <el-button size="mini" :type="scope.row.is_use==1?'danger':'success'"  @click="change_shop_tag_staus(scope.row.seller_label_id,scope.row.is_use)">{{scope.row.is_use==1?'禁用':'启用'}}</el-button>
              <el-button size="mini" type="danger"  v-if="scope.row.is_use==0" @click="delete_shop_tag(scope.row.seller_label_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table  v-if="activeIndex==2" ref="multipleTable" :data="tableData1" tooltip-effect="dark" style="width: 100%"  >
          <el-table-column prop="goods_label_id"  fixed label="序号" ></el-table-column>
          <el-table-column prop="label_name"  label="标签名称"></el-table-column>
          <el-table-column prop="sort"   label="展示优先级"></el-table-column>
          <el-table-column prop="user_description"   label="前端说明">
            <template slot-scope="scope">
              {{scope.row.user_description}}
            </template>
          </el-table-column>
          <el-table-column prop="seller_description"  label="商家端说明">
            <template slot-scope="scope">
              {{scope.row.seller_description}}
            </template>
          </el-table-column>
          <el-table-column prop="is_use"  label="状态">
            <template slot-scope="scope">
              {{scope.row.is_use==0?'禁用中':'启用中'}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="300">
            <template slot-scope="scope">
              <el-button size="mini" @click="edit_goods_tag(scope.row)">编辑</el-button>
              <el-button size="mini"  :type="scope.row.is_use==1?'danger':'success'"  @click="change_goods_tag_staus(scope.row.goods_label_id,scope.row.is_use)">{{scope.row.is_use==1?'禁用':'启用'}}</el-button>
              <el-button size="mini" type="danger"  v-if="scope.row.is_use==0" @click="delete_goods_tag(scope.row.goods_label_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table  v-if="activeIndex==3" ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%"  >
          <el-table-column prop="id"  fixed label="序号" ></el-table-column>
          <el-table-column prop="label_name"  label="标签名称"></el-table-column>
          <el-table-column prop="label_priority"   label="展示优先级"></el-table-column>
          <el-table-column prop="before_directions"   label="前端说明">
            <template slot-scope="scope">
              {{scope.row.before_directions}}
            </template>
          </el-table-column>
          <el-table-column prop="user_description"  label="用户说明">
            <template slot-scope="scope">
              {{scope.row.user_directions}}
            </template>
          </el-table-column>
          <el-table-column prop="is_use"  label="状态">
            <template slot-scope="scope">
              {{scope.row.label_status==0?'禁用中':'启用中'}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="300">
            <template slot-scope="scope">
              <el-button size="mini" @click="change_user_tag(scope.row,'','edit')">编辑</el-button>
              <el-button size="mini"  :type="scope.row.label_status == 1 ? 'danger' : 'success'"  @click="change_user_tag(scope.row.id,scope.row.label_status,'status')">{{scope.row.label_status==1?'禁用':'启用'}}</el-button>
              <el-button size="mini" type="danger"  v-if="scope.row.label_status == 0" @click="change_user_tag(scope.row.id,'','del')">删除</el-button>
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
    <!--添加-->
    <el-dialog :title="'添加'+titleTag" :visible.sync="showAddForm" width="60%" >
      <el-form ref="addForm" :model="addForm" label-width="120px">
        <el-form-item label="标签名称" required >
          <el-input v-model="addForm.label_name"  maxlength="6" show-word-limit  placeholder="限6字"></el-input>
        </el-form-item>
        <el-form-item label="展示优先级" required>
          <el-input-number v-model="addForm.sort" :min="1" :max="999999" controls-position="right"></el-input-number>
          <label style="color: #b4bccc;font-size: 12px">( 数字越大越靠前 )</label>
        </el-form-item>
        <el-form-item v-if="activeIndex==1" label="说明" required>
          <el-input v-model="addForm.description" maxlength="20" show-word-limit  placeholder="限20字"></el-input>
        </el-form-item>
        <el-form-item v-if="activeIndex!=1" label="前端说明" required>
          <el-input v-model="addForm.before_directions" maxlength="10" show-word-limit  placeholder="限10字"></el-input>
        </el-form-item>
        <el-form-item v-if="activeIndex==2" label="商家端说明" required>
          <el-input v-model="addForm.seller_description" maxlength="15" show-word-limit  placeholder="限15字"></el-input>
        </el-form-item>
        <el-form-item v-if="activeIndex==3" label="用户说明" required>
          <el-input v-model="addForm.user_directions" maxlength="15" show-word-limit  placeholder="限15字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="activeIndex != 3" type="primary" @click="submit_add_form">立即提交</el-button>
          <el-button v-else type="primary" @click="addUserLabel">立即提交</el-button>
          <el-button @click="showAddForm=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="'编辑'+titleTag"  :visible.sync="showForm" width="60%" >
      <el-form ref="form" :model="form" label-width="120px">
        <el-input type="hidden" v-model="form.seller_label_id" ></el-input>
        <el-input type="hidden" v-model="form.goods_label_id" ></el-input>
        <el-form-item label="标签名称" required >
          <el-input v-model="form.label_name"  maxlength="6" show-word-limit  placeholder="限6字"></el-input>
        </el-form-item>
        <el-form-item label="展示优先级" required>
          <el-input-number v-model="form.sort" placeholder="数字越大越靠前，请填写整数"></el-input-number>
        </el-form-item>
        <el-form-item v-if="activeIndex==1" label="说明" required>
          <el-input v-model="form.description" maxlength="20" show-word-limit  placeholder="限20字"></el-input>
        </el-form-item>
        <el-form-item v-if="activeIndex!=1" label="前端说明" required>
          <el-input v-model="form.before_directions" maxlength="10" show-word-limit  placeholder="限10字"></el-input>
        </el-form-item>
        <el-form-item v-if="activeIndex==3" label="用户说明" required>
          <el-input v-model="form.user_directions" maxlength="15" show-word-limit  placeholder="限15字"></el-input>
        </el-form-item>
        <el-form-item v-if="activeIndex==2" label="商家端说明" required>
          <el-input v-model="form.seller_description" maxlength="15" show-word-limit  placeholder="限15字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="activeIndex != 3" type="primary" @click="submit_form">立即提交</el-button>
          <el-button v-else type="primary" @click="editUserLabel">立即提交</el-button>
          <el-button @click="showForm=false">取消</el-button>
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
        pageSizes:[5,30,50],
        pageSize:5,
        total:0,
        activeIndex:'1',
        tableData:[],
        tableData1:[],
        tableData3:[],
        titleTag:'',
        label_id:0,
        form:{
          seller_label_id:'',
          goods_label_id:'',
          label_name:'',
          sort:'',
          description:'',
          user_description:'',
          seller_description:'',
        },
        addForm:{
          label_name:'',
          sort:'',
          description:'',
          user_description:'',
          seller_description:'',
        },

        showForm:false,
        showAddForm:false,
        rules:{

        },
        tags_list:[]
      }
    },
    created(){
      this.get_shop_tag();
    },

    methods: {
      handleSelect(key, keyPath) {
        this.audit_status='';
        this.goods_status='';
        this.pageNo=1;
        this.activeIndex=key;
        if(key==1){
          this.get_shop_tag()
        }
        if(key==2){
          this.get_goods_tag()
        }
        if(key==3){
          this.get_user_tag()
        }
      },
      dialogAdd(){
        this.showAddForm=true;
        this.addForm.label_name='';
        this.addForm.sort='';
        this.addForm.description='';
        this.addForm.user_description='';
        this.addForm.seller_description='';
      },
      async handleSizeChange(val) {
        this.pageSize = val;
        this.get_goods_list()
      },
      async handleCurrentChange(val) {
        this.pageNo=val;
        if(this.activeIndex==1){
          this.get_shop_tag();
        }
        if (this.activeIndex==2){
          this.get_goods_tag()
        }
        if (this.activeIndex==3){
          this.get_user_tag()
        }
      },
      async get_shop_tag(){
        this.titleTag = '商家标签';
        let data = await this.$request.get(this.$API.common_api,
          {
          'page':this.pageNo
          }
          ,'main',
          {
            router_path: 'shop/get_shop_tag_list',
            request_host: 'APP_SELLER_SERVER_HOST',
            handle_desc:'查看店铺标签;'
          });
        this.tableData=data.data;
        this.total=data.total;
      },
      async get_user_tag(){
        this.titleTag = '用户标签';
        let res = await this.$request.get(this.$API.common_api,
                {
                  page:this.pageNo,
                  page_size:5
                }, 'main', {
                  router_path: 'user/label',
                  request_host: 'MEMBER_USER_HOST',
                  handle_desc:'查看用户标签列表;'
                });
        this.tableData3=res.data.data;
        this.total = res.data.total;
      },
      async get_goods_tag(){
        this.titleTag = '商品标签';
        let data = await this.$request.get(this.$API.common_api,
          {
            'page':this.pageNo
          },
          'main',
          {
            router_path: 'goods/get_goods_tag_list',
            request_host: 'GOODS_SERVER_HOST',
            handle_desc:'查看商品标签;'
          });
        console.log(data.data);
        this.tableData1=data.data;
        this.total=data.total;
      },
      async addUserLabel(){
        if (!this.addForm.label_name || !this.addForm.before_directions || !this.addForm.user_directions) {
          SendMessage({message: '请填写完整标签资料',type: 'error'});
          return false;
        }
        let {code} = await this.$request.post(this.$API.common_api,
                {
                  "label_name": this.addForm.label_name,
                  "label_priority": this.addForm.sort,
                  "before_directions": this.addForm.before_directions,
                  "user_directions": this.addForm.user_directions,
                  "label_status": 1

                }, 'main', {
                  router_path: 'user/label',
                  request_host: 'MEMBER_USER_HOST',
                  handle_desc:'添加用户标签;'
                });
        this.showAddForm=false;
        if (code == 200)   SendMessage({message: '添加成功',type: 'success'});
        this.get_user_tag();
      },
      async editUserLabel(){
        if (!this.form.label_name || !this.form.before_directions || !this.form.user_directions) {
          SendMessage({message: '请填写完整标签资料',type: 'error'});
          return false;
        }
        let {code} = await this.$request.request(this.$API.common_api,
                {
                  "label_id": this.label_id ,
                  "label_priority": this.form.sort,
                  "before_directions": this.form.before_directions,
                  "user_directions": this.form.user_directions,
                  "label_status": this.form.label_status,
                  "label_name": this.form.label_name,

                }, 'main', 'put',{
                  router_path: 'user/label',
                  request_host: 'MEMBER_USER_HOST',
                  handle_desc:'编辑用户标签;'
                });
        this.showForm = false;
        if (code == 200)   SendMessage({message: '修改成功',type: 'success'});
        this.get_user_tag();
      },
      async submit_form(){
         let param={};
         let label_id;
         let handle_desc='';
         let router_path='';
         let request_host='';
         if(this.activeIndex==1){
            label_id=this.form.seller_label_id;
            param['label_name']=this.form.label_name;
            param['sort']=this.form.sort;
            param['description']=this.form.description;
            handle_desc='编辑商家标签;'+label_id;
            router_path='shop/edit_tag';
            request_host='APP_SELLER_SERVER_HOST';
           if(this.form.label_name=='' || this.form.description=='') {
             SendMessage({
               message: '请填写完整标签资料',
               type: 'error'
             });
             return false;
           }
         }else if(this.activeIndex==2) {
           label_id=this.form.goods_label_id;
           param['label_name']=this.form.label_name;
           param['sort']=this.form.sort;
           param['user_description']=this.form.before_directions;
           param['seller_description']=this.form.seller_description;
           handle_desc='编辑商品标签;'+label_id;
           router_path='goods/edit_tag';
           request_host='GOODS_SERVER_HOST';
           if(this.form.label_name=='' ||  this.form.user_description==''|| this.form.seller_description==''){
             SendMessage({
               message:'请填写完整标签资料',
               type:'error'
             });
             return false;
           }
         }
        let res = await this.$request.request(this.$API.common_api,param,'main','PUT',
          {
            router_path: router_path,
            request_host: request_host,
            extra_url:'?label_id='+label_id,
            handle_desc:handle_desc
          });
        if(res.code==200){
          SendMessage({
            message:'操作成功',
            type:'success'
          });
          this.showForm=false;
          if(this.activeIndex==1){
            this.get_shop_tag();
          }else{
            this.get_goods_tag();
          }
        }else{
          SendMessage({
            message:'操作失败，请刷新后再试',
            type:'error'
          });
        }

      },
      async submit_add_form(){
        let param={};
        let handle_desc='';
        let router_path='';
        let request_host='';
        param['label_name']=this.addForm.label_name;
        param['sort']=this.addForm.sort;
        if(this.activeIndex==1){
          param['description']=this.addForm.description;
          handle_desc='添加商家标签;';
          router_path='shop/add_tag';
          request_host='APP_SELLER_SERVER_HOST';
          if(this.addForm.label_name=='' || this.addForm.description=='') {
            SendMessage({
              message: '请填写完整标签资料',
              type: 'error'
            });
            return false;
          }
        }else{
          param['user_description']=this.addForm.before_directions;
          param['seller_description']=this.addForm.seller_description;
          handle_desc='添加商品标签;';
          router_path='goods/add_tag';
          request_host='GOODS_SERVER_HOST';
          if(this.addForm.label_name=='' || this.addForm.sort=='' || this.addForm.before_directions==''|| this.addForm.seller_description==''){
            SendMessage({
              message:'请填写完整标签资料',
              type:'error'
            });
            return false;
          }
        }
        let res = await this.$request.post(this.$API.common_api,param,'main',
          {
            router_path: router_path,
            request_host: request_host,
            handle_desc:handle_desc
          });
        if(res.code==200){
          SendMessage({
            message:'操作成功',
            type:'success'
          });
          this.showAddForm=false;
          if(this.activeIndex==1){
            this.get_shop_tag();
          }else{
            this.get_goods_tag();
          }
        }else{
          SendMessage({
            message:'操作失败，请刷新后再试',
            type:'error'
          });
        }
      },
      async delete_shop_tag(id){
        await this.$confirm('你确定要删除该商家标签吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await this.$request.request(this.$API.common_api,'','main','DELETE',
            {
              router_path: 'shop/delete_tag',
              request_host: 'APP_SELLER_SERVER_HOST',
              extra_url:'?label_id='+id,
              handle_desc:'删除商家标签;'+id
            });
          if(res.code==200){
            SendMessage({
              message:'操作成功',
              type:'success'
            });
            this.get_shop_tag();
          }else{
            SendMessage({
              message:'操作失败，请刷新后再试',
              type:'error'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });

      },
      async  delete_goods_tag(id){
        await this.$confirm('你确定要删除该商品标签吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await this.$request.request(this.$API.common_api,'','main','DELETE',
            {
              router_path: 'goods/delete_tag',
              request_host: 'GOODS_SERVER_HOST',
              extra_url:'?label_id='+id,
              handle_desc:'删除商品标签;'+id
            });
          if(res.code==200){
            SendMessage({
              message:'操作成功',
              type:'success'
            });
            this.get_goods_tag();
          }else{
            SendMessage({
              message:'操作失败，请刷新后再试',
              type:'error'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });

      },
      async change_shop_tag_staus(id,status){
        let is_use;
        let do_next=true;
        if(status==1){
           is_use=0;
          await this.$confirm('你确定要禁用该标签吗?禁用后，该标签将不在前端展示。', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
             do_next=true;
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
            do_next=false
          });
        }else{
           is_use=1
        }
        if(do_next){
          let res =   await this.$request.request(this.$API.common_api,'','main','PUT',
            {
              router_path: 'shop/change_tag_status',
              request_host: 'APP_SELLER_SERVER_HOST',
              extra_url:'?label_id='+id+'&is_use='+is_use,
              handle_desc:'修改店铺标签状态;'+id
            });
          if(res.code==200){
            SendMessage({
              message:'操作成功',
              type:'success'
            });
            this.get_shop_tag();
          }else{
            SendMessage({
              message:'操作失败，请刷新后再试',
              type:'error'
            });
          }
        }

      },
      async change_user_tag(data,status,type){
        let confirmMsg = '';
        let param = {};
        let requestType = 'get';
        if (type == 'edit') {
          this.showForm = true;
          this.form = data;
          this.form.sort = data.label_priority;
          this.label_id = data.id;
          this.form.label_status  = data.label_status;
        }
        if (type == 'del') {
          param = {"label_id": data,};
          requestType = 'delete';
          confirmMsg = '你确定要删除该标签吗?删除后，该标签不可恢复。';
        }
        if (type == 'status') {
          requestType = 'put';
          param = {"label_id": data, "label_status": status == 1 ? 0 : '1'};
          confirmMsg = status == 1 ? '你确定要禁用该标签吗?禁用后，该标签将不在前端展示。' : '你确定要开启该标签吗?';
        }
        if (type != 'edit') {
          await this.$confirm(confirmMsg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let {code} = await this.$request.request(this.$API.common_api,param, 'main', requestType,{
              router_path: 'user/label',
              request_host: 'MEMBER_USER_HOST',
              handle_desc:'添加用户标签;'
            });
            code == 200 && this.get_user_tag();
          }).catch(() => {});
        }
      },
     async change_goods_tag_staus(id,status){
        let is_use;
        let do_next=true;
        if(status==1){
          is_use=0;
          await this.$confirm('你确定要禁用该标签吗?禁用后，该标签将不在前端展示。', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
             do_next=true;
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
            do_next=false;
          });
        }else{
          is_use=1
        }
        if(do_next){
          let res =   await this.$request.request(this.$API.common_api,'','main','PUT',
            {
              router_path: 'goods/change_tag_status',
              request_host: 'GOODS_SERVER_HOST',
              extra_url:'?label_id='+id+'&is_use='+is_use,
              handle_desc:'修改商品标签状态;'+id
            });
          if(res.code==200){
            SendMessage({
              message:'操作成功',
              type:'success'
            });
            this.get_goods_tag();
          }else{
            SendMessage({
              message:'操作失败，请刷新后再试',
              type:'error'
            });
          }
        }

      },
      edit_shop_tag(data){
         let item = JSON.parse(JSON.stringify(data));
         console.log(item);
         this.showForm=true;
         this.form=item;
      },
      edit_goods_tag(data){
        let item = JSON.parse(JSON.stringify(data));
        console.log(item);
        this.showForm=true;
        this.form=item;
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
