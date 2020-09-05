<template>
  <div class="content">
    <div class="pages-header">
      <div>专题列表</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">添加专题</el-button>
    </div>

    <div class="table-content">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="主题标题">
          <el-input v-model="formInline.topic_name" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDocList()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="formInline={ topic_name: '',page: 1};getDocList()">清空筛选条件</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" stripe style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column fixed prop="id" label="序号" width="80"></el-table-column>
        <el-table-column prop="topic_name" label="主题标题"></el-table-column>
        <el-table-column prop="create_time" label="添加时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="setEdit(scope.$index)"></el-button>
            </el-tooltip>
           <!-- <el-tooltip class="item" effect="dark" content="显示" placement="top" v-if="scope.row.status==1">
              <el-button type="success" icon="el-icon-check" size="mini" circle
                         @click="showDocShop(scope.$index,0)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="隐藏" placement="top" v-else>
              <el-button type="warning" icon="el-icon-minus" size="mini" circle
                         @click="showDocShop(scope.$index,1)"></el-button>
            </el-tooltip>-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" circle
                         @click="delDocShop(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button type="success" icon="el-icon-view" size="mini" circle
                         @click="seeInfo(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages-style">
        <el-pagination background layout="prev, pager, next" :total="count" :current-page="formInline.page" :page-size="size"
                       @current-change="handleCurrentChange"></el-pagination>
      </div>

    </div>

    <el-dialog :title="(form.id ? '修改' : '添加')+'专题'" :visible.sync="showEdit" width="60%">
      <el-form ref="formss" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="主题标题" prop="topic_name">
          <el-input v-model="form.topic_name" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="主题内容" prop="topic_content">
          <vue-editor :content.sync="form.topic_content" ref="vueEditor"></vue-editor>
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
    import Editor from '@/components/Editor'

    export default {
        data () {
            return {
                showEdit: false,
                content: '',
                loading: false,
                formInline: {
                    topic_name: '',
                    page: 1
                },
                form: {
                    topic_name: '',
                    topic_content: ''
                },
                tableData: [],
                rules: {
                    topic_name: [
                        {required: true, message: '请输入问题名称', trigger: 'blur'}
                    ],
                    topic_content: [
                        {required: true, message: '请输入答案', trigger: 'blur'}
                    ]
                },
                count: 0,
                size: 10
            }
        },
        created () {
            this.form.user_id = this.$common.getNowUserId()
            this.getDocList()
        },
        methods: {
            async getDocList () {
                this.loading = true
                let {data} = await this.$request.get(this.$API.common_api, this.formInline, 'main', {
                    router_path: 'help/topic',
                    request_host: 'HELP_CATEGORY'
                })
                this.tableData = data.result
                this.count = data.count
                this.loading = false
            },
            async setEdit (index) {
                this.form = JSON.parse(JSON.stringify(this.tableData))[index]
                this.showEdit = true
                this.$refs.vueEditor.setContent(this.form.topic_content)
            },
            seeInfo(id){
                window.open(CUSTOM_CONFIG.PPY_HOST+'/customer/projectpage/detail/'+id)
            },
            submitData () {
                let _this = this
                this.$refs.formss.validate(async (valid) => {
                    if (valid) {
                        let isEdit = this.form.id || false
                        let data = await _this.$request.request(_this.$API.common_api, _this.form, 'main', isEdit ? 'PUT' : 'POST', {
                            router_path: 'help/topic',
                            request_host: 'HELP_CATEGORY',
                            extra_url: isEdit ? `${this.form.id}/` : ''
                        })
                        _this.showEdit = false
                        _this.getDocList()
                        SendMessage({message: '操作成功', type: 'success'})
                    } else {
                    }
                })
            },
            async showDocShop (index, status) {
                let item = JSON.parse(JSON.stringify(this.tableData))[index]
                item.status = status
                let data = await this.$request.request(this.$API.common_api, item, 'main', 'PUT', {
                    router_path: 'help/doc',
                    request_host: 'HELP_CATEGORY',
                    extra_url: `${item.id}/`
                })
                SendMessage({message: '操作成功', type: 'success'})
                this.getDocList()
            },
            async delDocShop (id) {
                try {
                    await this.$confirm('你是否删除该专题？删除后不可恢复', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    await this.$request.request(this.$API.common_api, {}, 'main', 'DELETE', {
                        router_path: 'help/topic',
                        request_host: 'HELP_CATEGORY',
                        extra_url: `${id}/`
                    })
                    SendMessage({message: '操作成功', type: 'success'})
                    this.getDocList()
                } catch (e) {

                }
            },
            unForm () {
                this.form = {
                    topic_name: '',
                    topic_content: '',
                }
                this.$refs.vueEditor.setContent('')
                this.form.user_id = this.$common.getNowUserId()
            },
            handleCurrentChange (event) {
                this.formInline.page = event
                this.getDocList()
            }
        },
        components: {
            VueEditor: Editor
        },
        watch: {
            showEdit (o) {
                !o && this.unForm()
            }
        }
    }
</script>
<style lang="less" scoped>
  @import "../../assets/pageHeader";

  .table-content {
    width: calc(~"100% - 30px");
    margin: 15px 15px;

    .demo-form-inline {
      background: #ffffff;
      padding: 20px 15px 10px 15px;
    }
  }
</style>
