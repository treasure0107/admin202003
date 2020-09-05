<template>
  <div class="content">
    <div class="pages-header">
      <div>参数设置</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">添加参数</el-button>
    </div>
    <div class="table-content">
      <el-table :data="tableData" stripe style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column fixed prop="param_id" label="序号" width="100"></el-table-column>
        <el-table-column prop="param_name" label="参数"></el-table-column>
        <el-table-column prop="sys_param" label="系统参数"></el-table-column>
        <el-table-column prop="use_status" label="状态" width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-button type="success" size="mini" v-if="scope.row.use_status==0" plain>使用中</el-button>
              <el-button type="info" size="mini" v-else plain>关闭</el-button>
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="开启" placement="top" v-if="scope.row.use_status==1">
              <el-button type="success" icon="el-icon-check" size="mini" circle
                         @click="setListItem(scope.row.param_id,'up')"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="关闭" placement="top" v-else>
              <el-button type="warning" icon="el-icon-minus" size="mini" circle
                         @click="setListItem(scope.row.param_id,'down')"></el-button>
            </el-tooltip>
          </template>`
        </el-table-column>-->
      </el-table>
      <div class="table-page" style="background: #ffffff;padding: 10px;text-align: right">
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

    <!--添加修改-->
    <el-dialog title="添加参数" :visible.sync="showEdit" width="40%">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="参数昵称" prop="param_name">
          <el-input v-model="form.param_name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="系统参数" prop="param_name">
          <el-input v-model="form.sys_param" maxlength="50"></el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitForm">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加修改-->

  </div>
</template>

<script>
    import UploadImg from '@/components/UplodaImg'

    export default {
        data () {
            return {
                pageNo: 1,
                pageSizes: [5, 30, 50],
                pageSize: 10,
                total: 0,
                showEdit: false,
                loading: false,
                form: {
                    param_name: '',
                    sys_param: '',
                    use_status: 0
                },
                tableData: [],
                rules: {
                    param_name: [
                        {required: true, message: '参数昵称必填', trigger: 'blur'}
                    ],
                    sys_param: [
                        {required: true, message: '系统参数必填', trigger: 'blur'}
                    ]
                }
            }
        },
        created () {
            this.param_list()
        },
        methods: {
            async param_list (id = 0) {
                this.loading = true
                let result = await this.$request.get(this.$API.attr_param, {page: this.pageNo, size: this.pageSize})
                console.log(result)
                this.tableData = result.data
                this.total = result.total
                this.loading = false
            },

            async submitForm () {
                const check = () => {
                    if (!this.form.param_name || !this.form.sys_param) {
                        SendMessage({message: '内容不能为空', type: 'warning'})
                        return false
                    }
                    return true
                }

                if (check()) {
                    let _this = this
                    this.$confirm('是否要添加该参数，添加后不可做任何操作?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        await _this.$request.post(_this.$API.attr_param, _this.form)
                        _this.form.sys_param = _this.form.param_name = ''
                        _this.param_list()
                        _this.showEdit = false
                    }).catch(() => {
                    })
                }

            },

            async setListItem (id) {
                // await this.$request
            },
            async handleCurrentChange (val) {
                this.pageNo = val
                this.param_list()
            },
        },
        watch: {
            showEdit (res) {
                !res && (this.form = {
                    param_name: '',
                    sys_param: '',
                    use_status: 0
                })
            }
        },
        components: {
            UploadImg
        }
    }
</script>

<style scoped lang="less">
  @import "../../assets/pageHeader";

  .table-content {
    width: calc(~"100% - 30px");
    margin: 15px;
  }
</style>
