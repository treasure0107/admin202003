<template>
  <div class="content">
    <div class="pages-header">
      <div>区域设置</div>
      <el-button round style="float: right;margin-top: 15px;margin-right: 40px;" type="primary" id="add-logistics" icon="el-icon-plus" size="medium" @click="add_info()">添加区域
      </el-button>
    </div>
    <!--搜索区-->
    <div class="pages-header" style="margin-top: 15px">
      <el-form :inline="true" :model="formInline" ref="searchForm">
        <el-row>
          <el-form-item label="区域名称" prop="area_name">
            <el-input v-model="area_name" placeholder="请输入" style="margin-top: 14px"></el-input>
          </el-form-item>
          <el-form-item label="省/直辖市" prop="area_name">
            <el-input v-model="area_label" placeholder="请输入" style="margin-top: 14px"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 14px">
            <el-button type="primary" @click="area_list('',1)">查询</el-button>
            <el-button @click="onClear('searchForm')">清空筛选</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <!--表格区-->
    <div class="table-content">
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" element-loading-text="玩命加载中..">
        <el-table-column fixed prop="id" label="序号" width="60"></el-table-column>
        <el-table-column prop="area_name" label="区域"></el-table-column>
        <el-table-column prop="area_label" label="省/直辖市" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" circle size="mini " @click="edit_info(scope.row.parent_id)" icon="el-icon-edit"></el-button>
              <el-button type="danger" circle size="mini " @click="del_area(scope.row.parent_id)"
                         icon="el-icon-delete"></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages-style">
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="pageSizes"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total=total>
        </el-pagination>
      </div>
    </div>

    <!--添加-->
    <el-dialog title="添加区域" :visible.sync="add_area" top="100px" width="60%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="区域"
                      prop="area_name" :rules="[{ required: true, message: '区域名称不能为空'}]">
          <el-input v-model="form.area_name" style="width: 450px;"></el-input>
        </el-form-item>
        <el-form-item label="区域省/直辖市" prop="area_check" class="is-required">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" size="small">
            <el-checkbox border v-for="(city,index) in cities" :label="city.id" :key="index" name="city.label">{{city.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(form,'add')">立即提交</el-button>
          <el-button @click="add_area=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--编辑查看-->
    <el-dialog title="编辑区域" :visible.sync="edit_area" top="110px" width="70%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="区域"
                      prop="area_name" :rules="[{ required: true, message: '区域名称不能为空'}]">
          <el-input v-model="form.area_name" style="width: 600px;"></el-input>
        </el-form-item>
        <el-form-item label="区域省/直辖市" prop="area_check" class="is-required">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" size="small">
            <el-checkbox border v-for="(city,index) in cities" :label="city.id" :key="index" name="city.label">{{city.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(form,'edit')">立即提交</el-button>
          <el-button @click="edit_area=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    import UploadImg from '@/components/UplodaImg'
    let checked = '';
    export default {
        data () {
            return {
                add_area: false,
                edit_area: false,
                loading: false,
                currentPage4: 1,
                pageSizes: [10, 30, 50],
                pagesize: 10,
                total:0,
                checkAll: false,
                checkedCities: [],
                cities: [],
                isIndeterminate: true,
                area_name:'',
                area_label:'',
                form: {
                    id: '',
                    parent_id: '',
                    area_name: '',
                    area_label: '',
                    type: [1, 2, 3, 4],
                    name: 1,
                },
                formInline: {
                    user: '',
                    region: ''
                },
                tableData: []
            }
        },
        created () {
           this.area_list()
        },
        methods: {
           async area_list (id = 0,type = 0) {
             this.loading = true;
              let currentPage = type === 0 ? this.currentPage4 : 1;
              let data = await this.$request.request(this.$API.area_api, {
                 page_size: this.pagesize,
                 current_page:currentPage,
                 area_name:this.area_name,
                 area_label:this.area_label,
                 type:type
              }, 'main', 'GET',{handle_desc:"查看区域列表;"});//DELETE
              let _this = this;
              //setTimeout(function (){_this.loading = false;},"400");
              this.loading = false;
              this.total = data.total_page['count'];
              this.tableData = data.data;
           },
          async submitForm (data,type) {
            let is_change = checked ? 1 : "";
            if (!data.area_name) {
                 this.Message('请输入区域名称！', 'warning', 1000);
                 return false
            }
            let _this = this;
            if (type === 'edit'){
              let result =  await this.$request.request(this.$API.area_edit_api, {
                area_name:data.area_name,
                is_change:is_change,
                checked:checked,
                parent_id:data.parent_id,
              }, 'main', 'POST',{handle_desc:"修改区域信息;"+data.parent_id});//DELETE
              let type_message = result.code === 200 ? 'success' : 'error';
              SendMessage({message: result.msg, type: type_message});
              if (result.code === 200) {
                _this.edit_area = false;
                _this.area_list();
              }
            }else{
              let result = await this.$request.request(this.$API.area_add_api, {
                  area_name:data.area_name,
                  is_change:is_change,
                  checked:checked,
              }, 'main', 'POST',{handle_desc:"添加区域信息;"});//DELETE
              let type_message = result.code === 200 ? 'success' : 'error';
              SendMessage({message: result.msg, type: type_message});
              if (result.code === 200) {
                _this.add_area = false;
                _this.area_list();
              }
            }
            },
           async edit_info (parent_id) {
              this.edit_area = true;
              let data = await this.$request.request(this.$API.area_one_api, {
                parent_id: `${parent_id}`
              }, 'main', 'POST',{handle_desc:"修改区域信息;"+parent_id});
              this.cities = data.data;
              this.form.area_name = data.area_name;
              this.checkedCities = data.list;
              this.form.parent_id = parent_id;
            },
          async add_info () {
              this.add_area = true;
              let data = await this.$request.request(this.$API.area_one_api, {}, 'main', 'POST',{handle_desc:"添加区域信息;"});
              this.cities = data.data;
              this.form.area_name = '';
              this.checkedCities = [];
            },
            del_area (parent_id) {
                let _this = this;
                if (!parent_id) {
                    this.Message('参数错误！', 'warning', 1000)
                    return false;
                }
                this.$confirm('是否删除此记录信息？', '确认信息', {
                    distinguishCancelAndClose: false,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(async () => {
                  let data = await this.$request.request(this.$API.area_del_api, {
                    parent_id:parent_id
                  }, 'main', 'POST',{handle_desc:"删除区域信息;"+parent_id});//DELETE
                  let type_message = data.code === 200 ? 'success' : 'error';
                  SendMessage({message: data.msg, type: type_message});
                  _this.area_list()
                })
            },
            handleSizeChange (val) {
              this.pagesize = val;
              this.area_list()
            },
            handleCurrentChange (val) {
              this.currentPage4=val;
              this.area_list()
            },
            onClear () {
              this.area_label='';
              this.area_name='';
              this.area_list();
            },
            handleCheckedCitiesChange (value) {
             console.log(value)
                checked = value;
            },
            Message (msg = '这是一条提示信息', type = 'error', time = 3000) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: type,
                    duration: time
                })
            },
        },
        components: {}
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
            margin: 0px;
        }

    .table-content {
      margin-left: 15px;
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

    #add-logistics {
      float: left;
    }

    .search-content {
      margin-bottom: 0px;
      margin-left: 15px;
      margin-top: 15px;
      height: 52px;
    }

    .table-page {
      float: right;
      margin: 15px;
    }

    .el-checkbox {
      margin-left: 0px !important;
      width: 95px!important;
    }

    .el-checkbox-group {
      width: 700px;
    }


  }
</style>