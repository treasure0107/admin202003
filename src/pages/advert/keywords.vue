<template>
  <div class="content">
    <div class="pages-header">
      <div>关键词</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">关键词</el-button>
    </div>

    <div class="select-param">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="平台类型" class="form-item">
          <el-select v-model="formInline.type" placeholder="请选择平台类型">
            <el-option label="全部" value=""></el-option>
            <el-option :label="item" :value="index" v-for="(item,index) in type_platform" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button type="primary" @click="key_list()">筛选</el-button>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button @click="key_list(true,true)">清空筛选条件</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-content">
      <el-table :data="tableData" stripe style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column fixed prop="keyword_id" label="序号" width="150"></el-table-column>
        <el-table-column prop="name" label="关键词"></el-table-column>
        <el-table-column prop="clip_num" label="点击次数" width="120">
        </el-table-column>
        <el-table-column prop="order_by" label="排序值">
        </el-table-column>
        <el-table-column prop="type_platform" label="平台类型">
          <template slot-scope="scope">
            {{type_platform[scope.row.type_platform]}}
          </template>
        </el-table-column>
        <el-table-column prop="is_show" label="状态" width="200">
          <template slot-scope="scope">
            <el-button type="success" size="mini" v-if="scope.row.is_show==0" plain>开启</el-button>
            <el-button type="info" size="mini" v-else plain>关闭</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="editKey(scope.$index)"></el-button>
            </el-tooltip>
            <!--<el-tooltip class="item" effect="dark" content="开启" placement="top" v-if="scope.row.is_show==1">
              <el-button type="success" icon="el-icon-check" size="mini" circle
                         @click="showKey(scope.$index,0)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="关闭" placement="top" v-else>
              <el-button type="warning" icon="el-icon-minus" size="mini" circle
                         @click="showKey(scope.$index,1)"></el-button>
            </el-tooltip>-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteKey(scope.$index)"
                         circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="(form.keyword_id ? '修改' : '添加')+'关键词'" :visible.sync="showEdit" width="50%">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="关键词" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="order_by">
          <el-input v-model="form.order_by" type="number"></el-input>
        </el-form-item>
        <el-form-item label="平台类型">
          <el-select v-model="form.type_platform" placeholder="请选择平台类型">
            <el-option :label="item" :value="index" v-for="(item,index) in type_platform" :key="index"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitData">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
    export default {
        data () {
            return {
                loading: false,
                tableData: [],
                type: '',
                type_platform: ['PC', 'IOS', '小程序', 'H5', 'Android','商家帮助','买家帮助'],
                showEdit: false,
                form: {
                    name: '',
                    order_by: 1,
                    type_platform: 0
                },
                formInline: {
                    type: ''
                },
                rules: {
                    name: [
                        {required: true, message: '关键词必须', trigger: 'blur'},
                    ],
                    order_by: [
                        {required: true, message: '排序值必须', trigger: 'blur'}
                    ]
                }
            }
        },
        created () {
            this.key_list()
        },
        methods: {

            async submitData () {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let isEdit = this.form.keyword_id || false
                        await this.$request.request(this.$API.common_api, this.form, 'main', isEdit ? 'PUT' : 'POST', {
                            router_path: !isEdit ? 'home/keywords' : 'home/keywords/one',
                            request_host: 'CATEGORY_SERVER_HOST',
                            extra_url: `?type=${this.form.type_platform}` + (isEdit ? `&id=${this.form.keyword_id}` : ''),
                            handle_desc: `${isEdit ? '修改' : '添加'}关键词;${isEdit ? this.form.keyword_id : ''}`
                        })
                        SendMessage({message: isEdit ? '修改成功' : '添加成功', type: 'success'})
                        this.showEdit = false
                        this.key_list()
                    }
                })
            },

            editKey (index) {
                this.form = JSON.parse(JSON.stringify(this.tableData[index]))
                this.showEdit = true
            },

            async showKey (index, status) {
                let find = JSON.parse(JSON.stringify(this.tableData[index]))
                find.is_show = status
                await this.$request.request(this.$API.common_api, find, 'main', 'PUT', {
                    router_path: 'home/keywords/one',
                    request_host: 'CATEGORY_SERVER_HOST',
                    extra_url: `?type=${find.type_platform}&id=${find.keyword_id}`,
                    handle_desc: `${status ? '开启' : '关闭'}关键词;${find.keyword_id}`
                })
                SendMessage({message: status ? '开启成功' : '关闭成功', type: 'success'})
                this.key_list()
            },

            async deleteKey (index) {
                let find = this.tableData[index]
                if (await this.$common.confirmDialog(this, '是否要删除该关键字，删除后不可恢复')) {
                    await this.$request.request(this.$API.common_api, {}, 'main', 'DELETE', {
                        router_path: 'home/keywords/one',
                        request_host: 'CATEGORY_SERVER_HOST',
                        extra_url: `?type=${find.type_platform}&id=${find.keyword_id}`,
                        handle_desc: `删除关键词;${find.keyword_id}`
                    })
                    SendMessage({message: '删除成功', type: 'success'})
                    this.key_list()
                }
            },

            async key_list (isPage = false, unSearch = false) {
                this.loading = true
                unSearch && (this.formInline = {type: ''})
                let {data} = await this.$request.get(this.$API.common_api, this.formInline, 'main', {
                    router_path: 'home/keywords',
                    request_host: 'CATEGORY_SERVER_HOST',
                })
                this.tableData = data
                this.loading = false
            }
        },
        watch: {
            showEdit (e) {
                !e && (this.form = {
                    name: '',
                    order_by: 1,
                    type_platform: 0
                })
            }
        }
    }
</script>
<style lang="less" scoped>
  @import "../../assets/pageHeader";

  .select-param {
    width: @bodyWidth;
    padding-left: 18px;
    margin: 15px 15px 0;
    background: #ffffff;
    padding-top: 20px;
    padding-bottom: 20px;
    border-radius: @contentBorderRadius;
    box-shadow: @contentBoxShadow;

    .form-item {
      margin-bottom: 0;
    }
  }
</style>
