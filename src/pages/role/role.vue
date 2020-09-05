<template>
  <div class="content">
    <div class="pages-header">
      <div>角色管理</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="add_role_form">添加角色</el-button>
    </div>
    <div class="table-content">
      <el-table :data="tableData" stripe border  row-key="id"  default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}" style="width: 100%">
        <el-table-column fixed prop="role_id" label="角色id" ></el-table-column>
        <el-table-column prop="role_name" label="角色名称" ></el-table-column>
        <el-table-column prop="user_name" label="添加人" ></el-table-column>
        <el-table-column prop="add_time" label="添加时间" >
          <template slot-scope="scope">
          {{scope.row.add_time | filterT}}
        </template></el-table-column>
        <el-table-column prop="remark" label="备注" ></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit_role(scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger"  @click="delete_role(scope.row.role_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加修改-->
    <el-dialog :title="form_name" :visible.sync="showEdit" width="60%">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules"  tatus-icon label-width="120px">
        <el-form-item label="角色名称" required>
          <el-input v-model="ruleForm.role_name"  ></el-input>
        </el-form-item>
        <el-form-item label="备注" >
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="ruleForm.remark">
          </el-input>
        </el-form-item>
        <el-form-item label="角色权限" required>
          <el-tree
            class="admin-tree"
            :data="node_list"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="default_checked"
            :expand-on-click-node="false"
            ref="tree"
            @check="UpdateLabel"
          >
          </el-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add_role('ruleForm')">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加修改-->
  </div>

</template>
<script>
  import tagList from '../../components/TagList'
  export default {
    data () {
      return {
        showEdit: false,
        form_name: '添加角色',
        ruleForm: {
          rule: [],
          role_name: '',
          remark:''
        },
        tableData: [],
        node_list: [],
        defaultProps: {
          children: 'children',
          label: 'node_name'
        },
        rules: {
          role_name: [
            {required: true, message: '请填写角色名称', trigger: 'blur'},
          ],
          rule: [
            {required: true, message: '请勾选角色权限菜单', trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '请勾选角色权限菜单', trigger: 'blur'}
          ],
        },
        default_checked: []
      }
    },
    created(){
      this.get_role_list()
    },
    methods: {
      async get_role_list(){
        let {data} = await this.$request.post(this.$API.role_list, '','main',{handle_desc:'查看角色列表;'});
        this.tableData = data
      },

      add_role_form(){
        this.form_name='新增角色';
        this.ruleForm={};
        this.default_checked=[];
        this.showEdit=true;
        this.get_node_list()
      },

      add_role(ruleForm){
        this.$refs[ruleForm].validate(async (valid) => {
          if (valid) {
            if(typeof this.ruleForm.rule!='string'){
               this.ruleForm.rule = this.ruleForm.rule.join(',');
            }
            let result='';
            if(this.ruleForm.role_id){
               result =  await this.$request.post(this.$API.edit_role, this.ruleForm,'',{handle_desc:'编辑角色;'+this.ruleForm.role_id});
            }else{
              this.ruleForm.add_user=JSON.parse(sessionStorage.getItem('clientInfo')).admin_id;
               result =  await this.$request.post(this.$API.add_role, this.ruleForm,'',{handle_desc:'新增角色;'});
            }

            let type = result.code==200 ? 'success': 'error';
              SendMessage({
                message: result.msg,
                type:type
              });
              if(type =='success'){
                this.showEdit=false;
                this.get_role_list()
              }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      UpdateLabel(data,node){
        let prentKeys=this.$refs.tree.getHalfCheckedKeys();
        let checkedKeys = node.checkedKeys;
        this.ruleForm.rule= checkedKeys.concat(prentKeys);
      },

      async get_node_list(){
        let {data} = await this.$request.post(this.$API.node_list, {pageSize:10, pageNo:1});
        this.node_list = data;
      },

      async delete_role(id){
        if(id==1){
          SendMessage({
            message: '超级管理员，无法删除',
            type:'error'
          });
          return false;
        }
        await this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let result = await this.$request.post(this.$API.del_role, {role_id: id},'',{handle_desc:'删除角色;'+id});
          let type = result.code==200 ? 'success': 'error';
            SendMessage({
              message: result.msg,
              type:type
            });
            if(type =='success'){
              this.get_role_list()
          }
          return new Promise.resolve(true)
        }).catch(() => {

        })
      },

      async edit_role (index) {
        this.form_name='编辑角色';
        this.default_checked = [];
        this.ruleForm.rule=[];
        this.ruleForm.remark='';
        this.ruleForm.role_name='';
        let ruleFormData = JSON.parse(JSON.stringify(this.tableData[index]));
        this.ruleForm = ruleFormData;
        if(this.ruleForm.role_id==1){
          SendMessage({
            message: '超级管理员，无法编辑',
            type:'error'
          });
          return false;
        }
        this.showEdit = true;
        await this.get_node_list();
        let idListArr = this.ruleForm.rule;

        let idList = idListArr.split(',');
        let _arr = idList.filter( tag => {
          return this.node_list.findIndex(item => item.id==tag) >-1
        });
        let difference = idList.filter(function(v){ return _arr.indexOf(v) === -1 });
        console.log(difference);
        this.default_checked=difference;
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
    },
    components: {
      tagList
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
  }
</style>
