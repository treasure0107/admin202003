<template>
  <div class="content">
    <div class="pages-header">
      <div>菜单管理</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showAdd=true">添加菜单</el-button>
    </div>
    <div class="table-content">
      <el-table :data="tableData" stripe border  row-key="id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}" style="width: 100%">
        <el-table-column fixed prop="id" label="序号" width="100"></el-table-column>
        <el-table-column prop="node_name" label="菜单名称" width="120"></el-table-column>
        <el-table-column prop="role_url" label="后端路由"></el-table-column>
        <el-table-column prop="request_type" label="请求方式"></el-table-column>
        <el-table-column prop="is_menu"  label="是否菜单" width="150">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <label type="success" size="mini" v-if="scope.row.is_menu==1" plain>是</label>
              <label type="danger" size="mini" v-else plain>否</label>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type_id" label="父菜单id" width="200"></el-table-column>
        <el-table-column prop="style" label="icon" width="150"></el-table-column>
        <el-table-column prop="web_url" label="前端路由" width="150"></el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit_node(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger"  @click="delete_node(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加修改-->
    <el-dialog title="添加菜单" :visible.sync="showAdd" width="60%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="菜单名称" required >
          <el-input v-model="form.node_name" ></el-input>
        </el-form-item>
        <el-form-item label="后端路由" required>
          <el-input v-model="form.role_url" placeholder="如： /api/login/login 请注意斜杠 子菜单必填"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" required>
          <el-select v-model="form.request_type" placeholder="请选择">
            <el-option
              v-for="item in options_request_type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否菜单" required>
          <el-select v-model="form.is_menu" placeholder="请选择">
            <el-option
              v-for="item in options_is_menu"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父菜单" required>
          <el-select v-model="form.type_id" placeholder="请选择">
            <el-option
              :key="0"
              :label="default_node"
              :value="0">
            </el-option>
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.node_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="icon样式">
          <el-input v-model="form.style" placeholder="只有菜单需要填写"></el-input>
        </el-form-item>
        <el-form-item label="前端url" required>
          <el-input v-model="form.web_url"   placeholder="如： /member/member 请注意斜杠"></el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input-number v-model="form.sort"  :min="0" placeholder="越大越靠前"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add_node">立即提交</el-button>
          <el-button @click="showAdd=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加修改-->

    <!--添加修改-->
    <el-dialog title="编辑菜单" :visible.sync="showEdit" width="60%">
      <el-form ref="form" :model="edit_form" label-width="120px">
        <el-input type="hidden" v-model="edit_form.id" ></el-input>
        <el-form-item label="菜单名称" required >
          <el-input v-model="edit_form.node_name" ></el-input>
        </el-form-item>
        <el-form-item label="后端路由" >
          <el-input v-model="edit_form.role_url" placeholder="如： /api/login/login 请注意斜杠 子菜单必填"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" required>
          <el-select v-model="edit_form.request_type" placeholder="请选择">
            <el-option
              v-for="item in options_request_type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否菜单" required>
          <el-select v-model="edit_form.is_menu" placeholder="请选择">
            <el-option
              v-for="item in options_is_menu"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父菜单" required>
          <el-select v-model="edit_form.type_id" placeholder="请选择">
            <el-option
              :key="0"
              :label="default_node"
              :value="0">
            </el-option>
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.node_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="icon样式">
          <el-input v-model="edit_form.style" placeholder="只有菜单需要填写"></el-input>
        </el-form-item>
        <el-form-item label="前端url" required>
          <el-input v-model="edit_form.web_url"   placeholder="如： /member/member 请注意斜杠"></el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input-number v-model="edit_form.sort"  :min="0" placeholder="越大越靠前"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit_node_submit">立即提交</el-button>
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
        showAdd: false,
        showEdit: false,
        default_node:'顶级菜单',
        form: {
          node_name: '',
          role_url: '',
          request_type: '',
          is_menu: 0,
          type_id: 0,
          style: '',
          web_url: '',
          sort: 0
        },
        edit_form: {
          id:'',
          node_name: '',
          role_url: '',
          request_type: '',
          is_menu: 0,
          type_id: 0,
          style: '',
          web_url: '',
          sort: 0
        },
        tableData: [],
        options_is_menu: [
          {
           value: 0,
           label: '否'
          },
          {
           value: 1,
           label: '是'
          }
         ],
        options_request_type:[
          {
            value: '',
            label: '空'
          },
          {
            value: 'get',
            label: 'get'
           },
          {
            value: 'post',
            label: 'post'
          },
          {
            value: 'put',
            label: 'put'
          },
          {
            value: 'delete',
            label: 'delete'
          },
        ]
      }
    },
    created(){
      this.get_node_list()
    },
    methods: {
      async get_node_list(){
        let {data} = await this.$request.post(this.$API.node_list, {pageSize:10, pageNo:1},'main',{handle_desc:'查看菜单列表;'});
        this.tableData = data
      },

      async add_node () {
        let result = await  this.$request.post(this.$API.add_node, this.form,'',{handle_desc:'新增菜单;'});
        let type= result.code==200 ? 'success': 'error';
        SendMessage({
          message: result.msg,
          type:type
        });
        if(type=='success'){
          this.showAdd=false;
          this.get_node_list()
        }
      },

      async delete_node(id){
        await this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
           let result = await this.$request.post(this.$API.delete_node, {id: id},'',{handle_desc:'删除菜单;'+id});
           let type= result.code==200 ? 'success': 'error';
           SendMessage({
             message: result.msg,
             type:type
           });
           if(type=='success'){
             this.get_node_list()
           }
        }).catch(() => {
          SendMessage({
            message:'网络错误，请稍后再试',
            type:'error'
          })
        })
      },

      async edit_node (index) {
        let {data} = await this.$request.post(this.$API.get_node_info, {id: index})
        this.edit_form = data;
        this.showEdit = true
      },

       edit_node_submit () {
        this.$request.post(this.$API.edit_node, this.edit_form,'',{handle_desc:'编辑菜单;'+this.edit_form.id}).then(
          (res)=>{
            let type = res.code==200 ? 'success': 'error';
            SendMessage({
              message: res.msg,
              type:type
            });
            if(type=='success'){
              this.showEdit = false;
              this.get_node_list()
            }
          }
        ).catch(()=>{
          SendMessage({
            message:'网络错误，请稍后再试',
            type:'error'
          })
        });

      },
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
