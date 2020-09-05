<template>
  <div class="content">
    <div class="pages-header">
      <div>员工管理</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="add_form">添加员工</el-button>
    </div>
    <div class="content-cont table-content">
    <div class="form-search">
      <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
        <el-form-item label="账号" prop="user_name">
          <el-input v-model="searchForm.user_name" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item label="英文名" prop="english_name">
          <el-input v-model="searchForm.english_name" placeholder="英文名" ></el-input>
        </el-form-item>
        <el-form-item label="中文名" prop="real_name">
          <el-input v-model="searchForm.real_name" placeholder="中文名" ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="searchForm.role_id" filterable placeholder="角色名称,输入名称可搜索">
            <el-option
              v-for="item in role_list"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" >筛选</el-button>
          <el-button @click="resetForm('searchForm')">清空筛选条件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content" v-if="table_show">
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column fixed prop="admin_id" label="序号" width="50"></el-table-column>
        <el-table-column prop="user_name" label="账号" width="120"></el-table-column>
        <el-table-column prop="english_name" label="英文名"></el-table-column>
        <el-table-column prop="real_name" label="中文名"></el-table-column>
        <el-table-column prop="mobile" label="手机" width="250">
          <template slot-scope="scope">
            {{scope.row.area_code}} {{scope.row.mobile}}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" width="150"></el-table-column>
        <el-table-column prop="add_user" label="添加人"></el-table-column>
        <el-table-column prop="add_time" label="添加时间" width="200">
          <template slot-scope="scope">
            {{scope.row.add_time | filterT}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit_member(scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger"  @click="delete_member(scope.row.admin_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-page">
        <div class="block">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

  <!--修改-->
  <el-dialog title="编辑员工" :visible.sync="showForm" width="60%" :before-close='handleDialogClose'>
    <el-form ref="ruleForm"  :model="ruleForm" :rules="rules"  tatus-icon label-width="200px">
      <el-input v-model="ruleForm.admin_id"  type="hidden" ></el-input>
      <el-row>
        <el-col :span="10">
          <el-form-item label="账号" prop="user_name" required>
            <el-input v-model="ruleForm.user_name"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="密码">
            <el-input v-model="ruleForm.password" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="英文名" prop="english_name" required>
            <el-input v-model="ruleForm.english_name"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="中文名" prop="real_name" required>
            <el-input v-model="ruleForm.real_name"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="区号"  prop="area_code" required>
            <el-select v-model="ruleForm.area_code" placeholder="请选择">
              <el-option
                v-for="item in area_code_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="手机"  prop="mobile"  required>
            <el-input v-model="ruleForm.mobile"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="邮箱" prop="email"  required>
            <el-input v-model="ruleForm.email"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="角色权限" prop="role_id" required>
            <el-select v-model="ruleForm.role_id" placeholder="请选择">
              <el-option
                v-for="item in role_list"
                :key="item.role_id"
                :label="item.role_name"
                :value="item.role_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注"  >
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="ruleForm.remark">
          </el-input>
        </el-form-item>
      </el-row>
      <el-row>
          <el-form-item>
           <el-button type="primary" @click="submit_form('ruleForm')">立即提交</el-button>
           <el-button @click="activeCancel()">取消</el-button>
         </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
  <!--修改-->
      <!--添加-->
      <el-dialog title="添加员工" :visible.sync="showForm1" width="60%"  @open="openFun('ruleForm1')" :before-close='handleDialogClose1'>
        <el-form ref="ruleForm1"  :model="ruleForm1" :rules="rules"  tatus-icon label-width="200px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="账号" prop="user_name" required>
                <el-input v-model="ruleForm1.user_name"  ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="密码" prop="password" required>
                <el-input v-model="ruleForm1.password" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="英文名" prop="english_name" required>
                <el-input v-model="ruleForm1.english_name"  ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="中文名" prop="real_name" required>
                <el-input v-model="ruleForm1.real_name"  ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
            <el-form-item label="区号"  prop="area_code" required>
              <el-select v-model="ruleForm1.area_code" placeholder="请选择">
                <el-option
                  v-for="item in area_code_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="手机"  prop="mobile"  required>
                <el-input v-model="ruleForm1.mobile"  ></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="邮箱" prop="email"  required>
                <el-input v-model="ruleForm1.email"  ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="角色权限" prop="role_id" required>
                <el-select v-model="ruleForm1.role_id" placeholder="请选择">
                  <el-option
                    v-for="item in role_list"
                    :key="item.role_id"
                    :label="item.role_name"
                    :value="item.role_id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="备注" prop="remark" >
              <el-input
                type="textarea"
                :autosize="{ minRowarea_code_lists: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="ruleForm1.remark">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-button type="primary" @click="submit_form1('ruleForm1')">立即提交</el-button>
              <el-button @click="showForm1=false">取消</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
      <!--添加-->
  </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        showForm: false,
        showForm1: false,
        table_show:true,
        tableData: [],
        pageNo: 1,
        pageSizes:[5,10],
        pageSize:10,
        total:0,
        title_type:'个人信息',
        ruleForm: {
          admin_id:'',
          user_name: '',
          password: '',
          english_name: '',
          real_name: '',
          mobile: '',
          email: '',
          role_id:'',
          remark:'',
          area_code:'',
        },
        ruleForm1: {
          user_name: '',
          password: '',
          english_name: '',
          real_name: '',
          mobile: '',
          email: '',
          role_id:'',
          remark:'',
          area_code:'',
        },
        searchForm:{
          user_name:'',
          english_name:'',
          real_name:'',
          role_id:'',
        },
        area_code_list:[
          {
            value: '中国大陆+86',
            label: '中国大陆+86'
          },
          {
            value: '中国香港+852',
            label: '中国香港+852'
          }
        ],
        rules: {
          user_name: [
            {required: true, message: '请填写账号', trigger: 'blur'},
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
          ],
          english_name: [
            {required: true, message: '请填写英文名', trigger: 'blur'},
            { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' }
          ],
          real_name: [
            {required: true, message: '请填写中文名', trigger: 'blur'},
            { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' }
          ],
          mobile: [
            {required: true, message: '请填写手机号码', trigger: 'blur'},
            { min: 0, max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur' }
          ],
          area_code: [
            {required: true, message: '请选择区号', trigger: 'blur'},
          ],
          email: [
            {required: true, message: '请填写邮箱', trigger: 'blur'},
            { min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          role_id: [
            {required: true, message: '请选择角色', trigger: 'blur'}
          ],
        },
        role_list:[{

        }]
      }
    },
    created(){
      this.get_member_list(this.$route.query.nav_mean);
      this.get_role_list();
    },
    methods: {
      async get_member_list(val){
        let pageSize = this.pageSize;
        let pageNo = this.pageNo;
        let user_name =this.searchForm.user_name;
        let english_name =this.searchForm.english_name;
        let real_name =this.searchForm.real_name;
        let role_id =this.searchForm.role_id;
        let {data} = await this.$request.post(this.$API.member_list,
          {
            pageSize:pageSize,
            pageNo:pageNo,
            user_name:user_name,
            english_name:english_name,
            real_name:real_name,
            role_id:role_id,
          },'main',{handle_desc:'查看员工列表;'});
        if (data.data){
          data.data.forEach(async (item,index)=>{
            item.add_user = await this.$common.getUserName(item.add_user,this);
          });
        }
        this.tableData = data.data;
        this.total = data.count;

        if (val){
          let admin_id = this.$common.getNowUserId(false)['admin_id'];
          this.table_show = false;
          data.data.forEach((item,index)=>{
            if (item['admin_id'] == admin_id){
              this.edit_member(index)
            }
          });
        }
      },
      activeCancel(){
          this.showForm = false;
          this.table_show = true;
      },
      handleDialogClose() {
        this.showForm = false;
        this.table_show = true;
      },
      handleDialogClose1() {
        this.showForm1 = false;
        this.table_show = true;
      },
      async get_role_list(){
        let {data} = await this.$request.post(this.$API.role_list);
        this.role_list = data
      },

      async handleSizeChange(val) {
        this.pageSize = val;
        this.get_member_list()
      },
      async handleCurrentChange(val) {
        this.pageNo=val;
        this.get_member_list()
      },

      async edit_member(index) {
        this.ruleForm = this.tableData[index];
        this.showForm = true;
      },
      async delete_member(admin_id){
        await this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let result = await this.$request.post(this.$API.del_member, {admin_id: admin_id},'',{handle_desc:'删除员工;'+admin_id});
          let type= result.code==200 ? 'success': 'error';
          SendMessage({
            message: result.msg,
            type:type
          });
          if(type=='success'){
            this.get_member_list()
          }
        }).catch(() => {

        })
      },

      openFun(formName){
        console.log(formName);
        this.$nextTick(() => {
          if(this.$refs[formName]){
            this.$refs[formName].resetFields();
          }
        });

      },

      add_form(){
        this.showForm1=true;

      },

      submit_form(ruleForm){
        this.$refs[ruleForm].validate(async (valid) => {
          if (valid) {
            delete this.ruleForm.role_name;
            delete this.ruleForm.add_user;
            let res;
            if(this.ruleForm.admin_id){
               res = await this.$request.post(this.$API.edit_member, this.ruleForm,'',{handle_desc:'编辑员工;'+this.ruleForm.admin_id})
            }else{
              SendMessage({
                message: '缺少必须参数',
                type:type
              });
            }
            let type = res.code==200 ? 'success': 'error';
            SendMessage({
              message: res.msg,
              type:type
            });
            if(type =='success'){
              this.showForm=false;
              this.get_member_list()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submit_form1(ruleForm){
        this.$refs[ruleForm].validate(async (valid) => {
          if (valid) {
            delete this.ruleForm1.role_name;
            if(this.ruleForm1.password==''){
              SendMessage({
                message: '请输入密码',
                type:'error'
              });
              return false;
            }
            if(this.ruleForm1.role_id==''){
              SendMessage({
                message: '请选择角色',
                type:'error'
              });
              return false;
            }
            let res = await this.$request.post(this.$API.add_member, this.ruleForm1,'',{handle_desc:'新增员工;'});
            let type = res.code==200 ? 'success': 'error';
            SendMessage({
              message: res.msg,
              type:type
            });
            if(type =='success'){
              this.showForm1=false;
              this.get_member_list()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.get_member_list()
      },
      search(){
        this.get_member_list();
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
  .content {
    width: 100%;
    background: #f5f5f5;
    border-bottom: 1px #eeeeee solid;
    border-radius: 5px;

    .table-content {
      margin: 15px;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .table-page{
      float: right;
      margin: 15px 15px;
    }
    .form-search{
      margin: 15px;
    }
  }
</style>
