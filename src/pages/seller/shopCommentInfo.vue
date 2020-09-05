<template>
  <div class="content">
    <div class="pages-header">
      <div><router-link to="/seller/shopComment" style="text-decoration:none;color:#000000;">店铺评价</router-link>--店铺评价明细</div>
    </div>
    <div class="content-cont">
      <div class="table-content">
        <el-table :data="showData" style="width: 100%">
          <el-table-column prop="date" label="" width="180"> </el-table-column>
          <el-table-column prop="shop_name" label="店铺" ></el-table-column>
          <el-table-column prop="company_name" label="公司名称"></el-table-column>
          <el-table-column prop="express_comment" label="物流服务评分"></el-table-column>
          <el-table-column prop="server_comment" label="服务态度评分"></el-table-column>
          <el-table-column prop="desc_comment" label="描述评分"></el-table-column>
          <el-table-column prop="all_comment" label="总评分">
          </el-table-column>
        </el-table>
      </div>
      <div class="table-content">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="id" label="序号" width="100"></el-table-column>
          <el-table-column prop="user_id" label="用户" width="200"></el-table-column>
          <el-table-column prop="order_sn" label="订单号"width="200"></el-table-column>
          <el-table-column prop="paid_money" label="订单金额"width="200"></el-table-column>
          <el-table-column prop="express_comment" label="物流服务评分"width="200"></el-table-column>
          <el-table-column prop="server_comment" label="服务态度评分"width="200"></el-table-column>
          <el-table-column prop="is_delete" label="状态" width="200">
            <template slot-scope="scope">

                <el-switch
                  @change="change_status(scope.row.is_delete,scope.row.id)"
                  v-model="scope.row.is_delete"
                  active-color="#ff4949"
                  inactive-color="#13ce66"
                  active-text="隐藏"
                  :active-value="1"
                  inactive-text="显示"
                  :inactive-value="0"
                  >
                </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="评价时间"width="200"></el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
            <el-button size="mini" @click="showDialog(scope.$index)">编辑</el-button>
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
      <el-dialog title="编辑评论" :visible.sync="showForm" >
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-dynamic">
          <el-input v-model="ruleForm.id"  type="hidden" ></el-input>
          <el-row>
            <el-col>
              <el-form-item label="物流服务"  prop="express_comment" required>
                <el-input-number v-model="ruleForm.express_comment" :min="1" :max="5"  ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="服务态度" prop="server_comment" required>
                <el-input-number v-model="ruleForm.server_comment" :min="1" :max="5"  ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item>
              <el-button type="primary" @click="edit_comment('ruleForm')">立即提交</el-button>
              <el-button @click="showForm=false">取消</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
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
        ruleForm:{
          express_comment:'',
          server_comment:'',
        },
        showData:[{
          shop_name:'',
          express_comment:'',
          server_comment:'',
          desc_comment:'',
          company_name:'',
          all_comment:'',
        }],
        showForm:false,
        is_delete:'',
        rules: {
          express_comment: [
            {required: true, message: '请填写物流服务评分', trigger: 'blur'},
          ],
          server_comment: [
            {required: true, message: '请填写服务态度评分', trigger: 'blur'},
          ],
        },
      }
    },
    created() {
      this.get_shop_comment_Info();
      this.showData[0].shop_name = this.$route.query.shop_name;
      this.showData[0].express_comment = this.$route.query.express_comment;
      this.showData[0].server_comment = this.$route.query.server_comment;
      this.showData[0].desc_comment = this.$route.query.desc_comment;
      this.showData[0].company_name = this.$route.query.company_name;
      this.showData[0].all_comment = this.$route.query.all_comment;
    },
    methods: {
      async handleCurrentChange(val) {
        this.pageNo = val;
        this.get_shop_comment_Info()
      },
      async get_shop_comment_Info() {
        let shop_id = this.$route.query.shop_id;
        let res = await this.$request.get(this.$API.common_api,{page:this.pageNo,page_size: this.pageSize,shop_id:shop_id},'main',
          {
            router_path: 'shop/get_shop_comment_list',
            request_host: 'APP_SELLER_SERVER_HOST',
            handle_desc:'查看店铺评价详情;'+shop_id
          });
        this.tableData=res.data.result;
        this.total=res.data.count
      },

      showDialog(index){
          this.showForm=true;
          this.ruleForm=this.tableData[index]
      },

      async edit_comment(ruleForm,id,status){
        let is_delete='';
        if(status!==''){
          is_delete=parseInt(status)
        }
        let express_comment = this.ruleForm.express_comment;
        let server_comment = this.ruleForm.server_comment;
        id = id?id:this.ruleForm.id;
        if(ruleForm){
          this.$refs[ruleForm].validate(async (valid) => {
            if (valid) {
              let res = await this.$request.post(this.$API.common_api,{express_comment:express_comment,server_comment:server_comment},'main',
                {
                  router_path: 'shop/edit_seller_comment',
                  request_host: 'APP_SELLER_SERVER_HOST',
                  extra_url: '/'+id,
                  handle_desc:'编辑店铺评价详情;'+id
                });
              if(res.code==200){
                this.showForm=false;
                this.get_shop_comment_Info()
              }

            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }else{
          let res = await this.$request.post(this.$API.common_api,{is_delete:is_delete},'main',
            {
              router_path: 'shop/edit_seller_comment',
              request_host: 'APP_SELLER_SERVER_HOST',
              extra_url: '/'+id,
              handle_desc:'编辑店铺评价详情;'+id
            });
        }
        this.get_shop_comment_Info()
      },

      change_status(status,id){
        console.log(status);
          this.ruleForm.express_comment='';
          this.ruleForm.server_comment='';
          this.edit_comment('',id,status)
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
