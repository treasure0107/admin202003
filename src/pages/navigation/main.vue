<template>
  <div>
    <div class="pages-header">
      <div>{{position_list[entrance_position]}}</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">
        添加{{position_list[entrance_position]}}
      </el-button>
    </div>
    <div class="table-content">
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="entrance_id" label="序号" width="80"></el-table-column>
        <el-table-column prop="entrance_name" label="名称" width="150"></el-table-column>
        <el-table-column prop="entrance_url" label="跳转地址"></el-table-column>
        <el-table-column prop="entrance_attribute" label="属性"></el-table-column>
        <el-table-column prop="entrance_attribute" label="图标" v-if="entrance_position==1">
          <template slot-scope="scope">
            <img :src="scope.row.navigation_icon" alt="" width="50" height="50">
          </template>
        </el-table-column>
        <el-table-column prop="entrance_sort" label="排序" width="200">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.entrance_sort" size="mini" @change="editOrder(scope.$index)"
                             :min="0"></el-input-number>
          </template>
        </el-table-column>
        <!--<el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-button type="success" size="mini" v-if="scope.row.status==1" plain>开启</el-button>
              <el-button type="info" size="mini" v-else plain>关闭</el-button>
            </div>
          </template>
        </el-table-column>-->
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="setEdit(scope.$index)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" circle
                         @click="delNav(scope.row.entrance_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加修改-->
    <el-dialog :title="'添加'+position_list[entrance_position]" :visible.sync="showEdit" width="60%" :show-close="false" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="名称" prop="entrance_name">
          <el-input v-model="form.entrance_name"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="entrance_url">
          <el-input v-model="form.entrance_url"></el-input>
        </el-form-item>

        <el-form-item label="图标" v-if="entrance_position==1">
          <upload-img @uploaded="uploaded"></upload-img>
          <img v-if="form.navigation_icon" :src="form.navigation_icon" class="avatar" style="margin-top: 20px;width: 80px;">
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitData()">立即提交</el-button>
          <el-button @click="unForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加修改-->
  </div>
</template>
<script>
    import UploadImg from '@/components/UplodaImg'

    let _this = this
    export default {
        data () {
            return {
                showEdit: false,
                entrance_position: '',
                loading: false,
                position_list: ['功能导航', '主导航', '底部导航', '友情链接'],
                form: {
                    entrance_name: '',
                    entrance_url: '',
                    entrance_attribute: '属性',
                    entrance_sort: 1,
                    navigation_icon:''
                },
                tableData: [],
                rules: {
                    entrance_name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                    entrance_url: [
                        {required: true, message: '请输入跳转地址', trigger: 'blur'},
                    ]
                }
            }
        },
        created () {
            this.query_type()
        },

        methods: {
            query_type () {
                let type = this.$route.query.type
                if (![1, 1, 2, 3][type]) {
                    SendMessage({message: '类型错误', type: 'error'})
                    return false
                }
                this.entrance_position = type
                _this = this
                this.nav_list()
            },

            uploaded (data) {
                this.form.navigation_icon = data.imageOssUrl
            },

            async nav_list () {
                this.loading = true
                let {data} = await this.$request.get(this.$API.common_api, {position: this.entrance_position}, 'main', {
                    router_path: 'navigation/main',
                    request_host: 'CATEGORY_SERVER_HOST',
                })
                this.tableData = data
                this.loading = false
            },

            unForm () {
                this.form = {
                    entrance_name: '',
                    entrance_url: '',
                    entrance_attribute: '属性',
                    entrance_sort: 1
                }
                this.showEdit = false
            },

            submitData () {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let param = this.form
                        param['entrance_position'] = this.entrance_position
                        let is_edit = param.entrance_id || false
                        await this.$request.request(this.$API.common_api, param, 'main', is_edit ? 'PUT' : 'POST', {
                            router_path: is_edit ? 'navigation/main/position' : 'navigation/main',
                            request_host: 'CATEGORY_SERVER_HOST',
                            extra_url: is_edit ? `?position=${this.entrance_position}&id=${param.entrance_id}` : ''
                        })
                        this.unForm()
                        this.nav_list()
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },

            editOrder: _.debounce(async (index) => {
                let param = _this.tableData[index]
                await _this.$request.request(_this.$API.common_api, param, 'main', 'PUT', {
                    router_path: 'navigation/main/position',
                    request_host: 'CATEGORY_SERVER_HOST',
                    extra_url: `?position=${_this.entrance_position}&id=${param.entrance_id}`
                })
                _this.nav_list()
            },300),

            setEdit (index) {
                this.form = JSON.parse(JSON.stringify(this.tableData[index]))
                this.showEdit = true
            },

            async delNav (id) {
                try {
                    await this.$confirm(`你是否删除该${this.position_list[this.entrance_position]}？删除后不可恢复', '提示`, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    await this.$request.request(this.$API.common_api, {is_delete: 1}, 'main', 'DELETE', {
                        router_path: 'navigation/main/position',
                        request_host: 'CATEGORY_SERVER_HOST',
                        extra_url: `?position=${this.entrance_position}&id=${id}`
                    })
                    SendMessage({message: '删除成功', type: 'success'})
                    this.nav_list()
                } catch (e) {

                }
            },

        },

        watch: {
            '$route' (to, from) {
                this.query_type()
            }
        },
        components:{
            UploadImg
        }
    }
</script>
<style lang="less" scoped>
  @import "../../assets/pageHeader";

  .table-content {
    width: calc(~"100% - 30px");
    margin: 15px;
  }
</style>
