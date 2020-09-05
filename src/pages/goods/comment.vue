<template>
  <div class="content">
    <div class="pages-header">
      <div>商品评价</div>
    </div>
    <div class="content-cont">
      <div class="form-search">
        <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="searchForm.goods_name" placeholder="商品名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="评论时间" prop="create_time">
            <el-date-picker
              v-model="searchForm.create_time"
              type="datetimerange"
              range-separator="至"
              value-format="timestamp"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="评价人" prop="comment_user">
            <el-input v-model="searchForm.comment_user" placeholder="评价人" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="店铺名称" prop="shop_id">
            <el-select v-model="searchForm.shop_id" filterable placeholder="店铺名称,输入名称可搜索" size="mini">
              <el-option
                v-for="item in shop_list"
                :key="item.shop_id"
                :label="item.shop_name"
                :value="item.shop_id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="评价" prop="comment_status">
            <el-select v-model="searchForm.comment_status" placeholder="评价" size="mini">
              <el-option
                v-for="item in comment_status_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" >筛选</el-button>
            <el-button @click="resetForm('searchForm')">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
      <div class="table-content">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="id" label="序号" width="100"></el-table-column>
          <el-table-column prop="goods_name" label="商品"width="200">
            <template slot-scope="scope">
              <el-row v-if="scope.row.goods">
                <preview-image :image="scope.row.goods['goods_thumb_image']" key="key2" :height="'50px'" :width="'50px'"></preview-image>
              </el-row>
              <el-row v-if="scope.row.goods">{{scope.row.goods['goods_name']}}</el-row>
            </template>
          </el-table-column>
          <el-table-column prop="comment_user" label="评价人" width="200"></el-table-column>
          <el-table-column prop="shop_id" label="店铺名称"width="200">
          </el-table-column>
          <el-table-column prop="comment_content" label="评论内容" width="300">
            <template slot-scope="scope">
              <el-row>{{scope.row.comment_content}}</el-row>
              <el-row v-if="scope.row.comment_pic ">
                <div v-for="item in scope.row.comment_pic">
                  <preview-image :image="item.pic_url" key="key3" style="float: left;margin: 2px" :height="'50px'" width="50px"></preview-image>
                </div>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="comment_status" label="评价" >
            <template slot-scope="scope">
              {{scope.row.comment_status}}星
            </template>
          </el-table-column>
          <el-table-column prop="comment_time" label="评论时间" width="200"></el-table-column>
          <el-table-column prop="operate_content" label="操作" >
            <template slot-scope="scope">
              <el-button size="mini" @click="edit_comment(scope.$index)">编辑</el-button>
              <el-button size="mini" type="danger"  @click="delete_comment(scope.row.id)">删除</el-button>
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

    <el-dialog title="编辑评论" :visible.sync="showForm" width="60%">
      <el-form ref="ruleForm"  :model="ruleForm" :rules="rules"  tatus-icon label-width="200px">
        <el-row>
        <el-form-item label="商品信息"  >
        <el-input v-model="ruleForm.id"  type="hidden" ></el-input>
        <el-row>
          <el-col v-if="ruleForm.goods"> <img :src="ruleForm.goods.goods_thumb_image" min-width="70" height="70"/> </el-col>
          <el-col v-if="ruleForm.goods">{{ruleForm.goods.goods_name}}</el-col>
        </el-row>
        </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="评论内容"  >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="ruleForm.comment_content">
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="评价" prop="comment_status">
            <el-select v-model="ruleForm.comment_status" placeholder="评价" size="mini">
              <el-option
                v-for="item in comment_status_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="评论图片"  >
            <el-row v-if="ruleForm.comment_pic ">
                <div class="img_wrap" style="float: left;margin: 2px" v-for="(item1,idx) in ruleForm.comment_pic" >
                  <preview-image :image="item1.pic_url" key="k"
                                 :height="'50px'"></preview-image>
                  <span class="delete" @click="delImg(idx)" >X</span>
                </div>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button type="primary" @click="edit_comment_submit('ruleForm')">立即提交</el-button>
            <el-button @click="cancel_submit()">取消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import tagList from '../../components/TagList'
  import PreviewImage from '../../components/PreviewImage'

  export default {
    data() {
      return {
        pageNo: 1,
        pageSizes: [5, 30, 50],
        pageSize: 10,
        total: 0,
        tableData: [],
        showForm :false,
        ruleForm:{
          comment_content:'',
          comment_status:'',
          comment_pic:[],
        },
        comment_time_start:'',
        comment_time_end:'',
        edit_comment_pic:[],
        searchForm:{
          create_time: '',
          goods_name: '',
          comment_user: '',
          comment_status: '',
          shop_id: '',
        },
        rules: {
          comment_content: [
            {required: true, message: '请输入评价内容', trigger: 'blur'},
          ],
        },
        comment_status_list:[
          {
            value: 1,
            label: '1星'
          },
          {
            value: 2,
            label: '2星'
          },
          {
            value: 3,
            label: '3星'
          },
          {
            value: 4,
            label: '4星'
          },
          {
            value: 5,
            label: '5星'
          },
        ],
        shop_list:[],

      }
    },
    created() {
      this.get_goods_comment_list();
      this.get_shop_list();
    },
    methods: {
      //删除图片
      delImg(idx){
        console.log(idx,"idx");
        this.edit_comment_pic.push(this.ruleForm.comment_pic[idx]);
        this.ruleForm.comment_pic.splice(idx,1);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.get_goods_comment_list();
      },
      async handleCurrentChange(val) {
        this.pageNo = val;
        this.get_goods_comment_list()
      },
      async get_shop_list(){
        let res = await this.$request.get(this.$API.common_api, '', 'main',
          {
            router_path: 'shop/get_shop_name_list',
            request_host: 'APP_SELLER_SERVER_HOST',
            handel_class: '',
          });
        console.log(res);
        this.shop_list=res.data;
      },
      async get_goods_comment_list() {
        let comment_user=this.searchForm.comment_user;
        let goods_name=this.searchForm.goods_name;
        let comment_status=this.searchForm.comment_status;
        let shop_id=this.searchForm.shop_id;
        let comment_start_time=this.comment_time_start?this.comment_time_start:'';
        let comment_end_time=this.comment_time_end?this.comment_time_end:'';

        let data = await this.$request.get(this.$API.common_api,
          {
            page:this.pageNo,
            size:this.pageSize,
            comment_user:comment_user,
            goods_name:goods_name,
            comment_status:comment_status,
            shop_id:shop_id,
            comment_start_time:comment_start_time,
            comment_end_time:comment_end_time
          }
          , 'main',
          {
            router_path: 'goods/comment',
            request_host: 'GOODS_SERVER_HOST',
            handel_class: '',
            handle_desc:'查看商品评价列表;'
          });
        data.data.forEach(item=>{
          if(item.shop_id){
            this.$request.get(this.$API.common_api, {shop_id:item.shop_id}, 'main',
              {
                router_path: 'shop/get_shop_name',
                request_host: 'APP_SELLER_SERVER_HOST',
                handel_class: ''
              }).then((res)=>{

              item.shop_id = res.data[0]['shop_name'];
            });
          }
        });
        this.tableData=data.data;
        this.total=data.total
      },
      async handleSizeChange(val) {
        this.pageSize = val;
        this.get_goods_comment_list()
      },
      async handleCurrentChange(val) {
        this.pageNo=val;
        this.get_goods_comment_list()
      },

      async delete_comment(id){
        let idArr= [];
        idArr.push(id);
        await this.$confirm('您确定要删除该评论吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let result = await this.$request.request(this.$API.common_api, {"comment_set": idArr},'main','DELETE',
            {
            router_path: 'goods/del_comment',
            request_host: 'GOODS_SERVER_HOST',
            handel_class: '',
              handle_desc:'删除商品评价;'+idArr
          });
          let type= result.code==200 ? 'success': 'error';
          SendMessage({
            message: result.msg,
            type:type
          });
          if(type=='success'){
            this.get_goods_comment_list()
          }
        }).catch(() => {

        })
      },
      edit_comment(index){
        this.ruleForm = this.tableData[index];
        this.showForm=true;

      },
      async edit_comment_submit(){
       let result = await this.$request.request(this.$API.common_api,
         {
           comment_pic:this.edit_comment_pic,
           comment_content:this.ruleForm.comment_content,
           comment_status:this.ruleForm.comment_status,
           comment_id:this.ruleForm.id
         },
         'main',
         'PUT',
         {
           router_path: 'goods/edit_comment',
           request_host: 'GOODS_SERVER_HOST',
           handel_class: '',
           handle_desc:'编辑评价;'+this.ruleForm.id
         });
        if(result.code==200){
          SendMessage({
            message: '操作成功',
            type:'success'
          });
          this.showForm=false;
          this.get_goods_comment_list()
        }

      },

      cancel_submit(){
        this.showForm=false;
        this.get_goods_comment_list()
      },

      search(){
          this.pageNo = 1
        if(this.searchForm.create_time){
          this.comment_time_start=this.searchForm.create_time[0]/1000;
          this.comment_time_end=this.searchForm.create_time[1]/1000;
        }
        this.get_goods_comment_list();
      },
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

  .form-search {
    margin: 15px;
  }
  .img_wrap{
    position: relative;

    .delete{
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      width: 20px;
      height: 20px;
      background: rgba(255,255,255,.2);
      line-height: 6px;
      text-align: center;
      font-size: 18px;
    }
  }

</style>
