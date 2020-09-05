<template>
  <div class="content">
    <div class="pages-header">
      <div>文章列表</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">添加文章</el-button>
    </div>
    <div class="table-content">

      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="标题">
          <el-input v-model="formInline.doc_name" placeholder="标题"></el-input>
        </el-form-item>

        <el-form-item label="已解决数" class="demo-input-suffix">
          <el-col :span="11">
            <el-input v-model="formInline.start_solved" type="number" min="0" placeholder="开始值"></el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input v-model="formInline.end_solved" type="number" min="0" placeholder="结束值"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="未解决数" class="demo-input-suffix">
          <el-col :span="11">
            <el-input v-model="formInline.start_unsolved" type="number" min="0" placeholder="开始值"></el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input v-model="formInline.end_unsolved" type="number" min="0" placeholder="结束值"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="总投票数" class="demo-input-suffix">
          <el-col :span="11">
            <el-input v-model="formInline.start_vote" type="number" min="0" placeholder="开始值"></el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input v-model="formInline.end_vote" type="number" min="0" placeholder="结束值"></el-input>
          </el-col>
        </el-form-item>


        <el-form-item label="类型">
          <el-select v-model="formInline.doc_type" placeholder="状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="FAQ" :value="0"></el-option>
            <el-option label="帮助" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="formInline.status" placeholder="状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="显示" :value="0"></el-option>
            <el-option label="屏蔽" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="买家分类">
          <el-input v-model="formInline.buy_doc_type_name" placeholder="买家分类"></el-input>
        </el-form-item>

        <el-form-item label="商家分类">
          <el-input v-model="formInline.seller_doc_type_name" placeholder="商家分类"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getDocList()">查询</el-button>
        </el-form-item>
      </el-form>


      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="doc_id" label="序号" width="80"></el-table-column>
        <el-table-column prop="doc_name" label="问题" width="150"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column prop="solved_num" sortable label="已解决数" width="100"></el-table-column>
        <el-table-column prop="unsolved_num" sortable label="未解决数" width="100"></el-table-column>
        <el-table-column prop="vote_num" sortable label="总投票数" width="100"></el-table-column>
        <el-table-column prop="doc_type" label="类型">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-button type="success" size="mini" v-if="scope.row.doc_type==0" plain>FAQ</el-button>
              <el-button type="info" size="mini" v-else plain>帮助</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="添加用户"></el-table-column>
        <el-table-column prop="create_time" sortable label="添加时间"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-button type="success" size="mini" v-if="!scope.row.status" plain>显示</el-button>
              <el-button type="info" size="mini" v-else plain>屏蔽</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="setEdit(scope.row.doc_id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="显示" placement="top" v-if="scope.row.status==1">
              <el-button type="success" icon="el-icon-check" size="mini" circle
                         @click="showDocShop(scope.$index,0)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="隐藏" placement="top" v-else>
              <el-button type="warning" icon="el-icon-minus" size="mini" circle
                         @click="showDocShop(scope.$index,1)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" circle
                         @click="delDocShop(scope.row.doc_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages-style">
        <el-pagination background layout="prev, pager, next" :total="count" :page-size="size"
                       @current-change="handleCurrentChange"></el-pagination>
      </div>

    </div>

    <el-dialog :title="this.$route.query.doc_id ? '' : ((form.doc_id ? '修改' : '添加')+'帮助')"
               :visible.sync="showEdit" width="60%" :fullscreen="this.$route.query.doc_id ? true : false"
               :show-close="this.$route.query.doc_id ? false : true"
               :close-on-press-escape="this.$route.query.doc_id ? false : true">
      <el-form ref="formss" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="类型" prop="doc_type">
          <el-select placeholder="类型" v-model="form.doc_type">
            <el-option label="FAQ" :value="0"></el-option>
            <el-option label="帮助" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="doc_name">
          <el-input v-model="form.doc_name"></el-input>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="form.keywords"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <vue-editor :content.sync="form.content" ref="vueEditor"></vue-editor>
        </el-form-item>

        <!--        <el-form-item label="备注">-->
        <!--          <el-input v-model="form.remarks" type="textarea"></el-input>-->
        <!--        </el-form-item>-->
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
                helpDoc: [],
                formInline: {
                    doc_name: '',
                    doc_type: '',
                    status: '',
                    page: 1,
                    start_solved: '',
                    end_solved: '',
                    start_unsolved: '',
                    end_unsolved: '',
                    start_vote: '',
                    buy_doc_type_name: '',
                    seller_doc_type_name: '',
                    end_vote: ''
                },
                form: {
                    doc_name: '',
                    content: '',
                    keywords: '',
                    remarks: '',
                    doc_type: '',
                    user_id: ''
                },
                tableData: [],
                rules: {
                    doc_name: [
                        {required: true, message: '请输入问题名称', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '请输入答案', trigger: 'blur'}
                    ],
                    doc_type: [
                        {required: true, message: '请选择类型', trigger: 'change'}
                    ]
                },
                count: 0,
                size: 10
            }
        },
        async created () {
            if (this.$route.query.doc_id) {
                this.setEdit(this.$route.query.doc_id)
            }
            this.form.user_id = this.$common.getNowUserId()
            this.getDocList()
        },
        methods: {
            async getDocList () {
                this.loading = true
                let {data} = await this.$request.get(this.$API.common_api, this.formInline, 'main', {
                    router_path: 'help/doc',
                    request_host: 'HELP_CATEGORY'
                })
                this.tableData = data.result
                data.result.forEach(async (item, index) => {
                    data.result[index]['user_name'] = await this.$common.getUserName(item.user_id, this)
                })
                this.count = data.count
                this.loading = false
            },
            async setEdit (id) {
                let {data} = await this.$request.get(this.$API.common_api, {}, 'main', {
                    router_path: 'help/doc',
                    request_host: 'HELP_CATEGORY',
                    extra_url: `${id}`
                })
                this.form = data
                this.showEdit = true
                this.$common.iframePostMessage({}, 'loading')
                this.$refs.vueEditor.setContent(this.form.content)
            },
            submitData () {
                let _this = this
                this.$refs.formss.validate(async (valid) => {
                    if (valid) {
                        let isEdit = this.form.doc_id || false
                        let data = await _this.$request.request(_this.$API.common_api, _this.form, 'main', isEdit ? 'PUT' : 'POST', {
                            router_path: 'help/doc',
                            request_host: 'HELP_CATEGORY',
                            extra_url: isEdit ? `${this.form.doc_id}/` : ''
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
                    extra_url: `${item.doc_id}/`
                })
                SendMessage({message: '操作成功', type: 'success'})
                this.getDocList()
            },
            async delDocShop (id) {
                try {
                    const checkHelp = async (id) => {
                        if (this.helpDoc.length <= 0) {
                            let {data} = await this.$request.get(this.$API.common_api, {}, 'main', {
                                router_path: 'navigation/help',
                                request_host: 'CATEGORY_SERVER_HOST',
                            })
                            this.helpDoc = data
                        }
                        let exist = false
                        aidenli :for (let index = 0; index < this.helpDoc.length; index++) {
                            for (let key = 0; key < this.helpDoc[index]['grouplist'].length; key++) {
                                let item = this.helpDoc[index]['grouplist'][key]
                                if (item['doc_url'].indexOf('http://') >= 0 || item['doc_url'].indexOf('https://') >= 0) {
                                    let arr = item['doc_url'].split('/')
                                    exist = parseInt(arr[arr.length - 1]) == id || false
                                    console.log(arr)
                                    console.log(exist)
                                    if (exist) break aidenli
                                }
                                if (exist) break
                            }
                        }
                        return exist
                    }

                    if (!await checkHelp(id)) {
                        await this.$confirm('你是否删除该文章？删除后不可恢复', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                        await this.$request.request(this.$API.common_api, {}, 'main', 'DELETE', {
                            router_path: 'help/doc',
                            request_host: 'HELP_CATEGORY',
                            extra_url: `${id}/`
                        })
                        SendMessage({message: '操作成功', type: 'success'})
                        this.getDocList()
                    } else {
                        SendMessage({message: '该文章正在被使用，无法删除', type: 'warning'})
                    }
                } catch (e) {

                }
            },
            unForm () {
                this.form = {
                    doc_name: '',
                    content: '',
                    keywords: '',
                    remarks: '',
                    doc_type: '',
                    user_id: '',
                    buy_doc_type_name: '',
                    seller_doc_type_name: ''
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
                this.$common.iframePostMessage({state: o})
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
