<template>
  <div>
    <div class="pages-header">
      <div>帮助导航</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">添加子分类</el-button>
    </div>
    <div class="table-content">
      <el-menu :default-active="activeIndex" class="el-menu-demo help-menu" mode="horizontal" @select="handleSelect" style="min-height: 80px">
        <el-menu-item :index="index+''" v-for="(item,index) in list" :key="index">
          {{item.sort_name}}
          <i class="el-icon-edit edit-icon-s" v-if="typeItemEdit" @click="setTypeEdit(index)"></i>
          <i class="el-icon-delete edit-icon-s delete-s" v-if="typeItemEdit" @click="delTypeEdit(item.sort_id)"></i>
        </el-menu-item>
        <div class="pop-mey">
          <el-tooltip class="item" effect="dark" content="添加分类" placement="top">
            <el-button type="success" plain icon="el-icon-plus" size="mini" circle @click="typeEdit=true"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改分类" placement="top">
            <el-button type="primary" plain icon="el-icon-edit" size="mini" circle
                       @click="typeItemEdit=!typeItemEdit"></el-button>
          </el-tooltip>
        </div>
      </el-menu>
      <el-table :data="list[activeIndex] ? list[activeIndex]['grouplist'] : []" stripe style="width: 100%"
                v-loading="loading">
        <el-table-column fixed prop="id" label="序号" width="80"></el-table-column>
        <el-table-column prop="doc_name" label="名称" width="150"></el-table-column>
        <el-table-column prop="doc_url" label="跳转地址"></el-table-column>
        <el-table-column prop="doc_attribute" label="属性"></el-table-column>
        <el-table-column prop="doc_order" label="排序" width="200">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.doc_order" size="mini" @change="editOrder(scope.$index)"
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
                         @click="delHelp(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加修改-->
    <el-dialog :title="(form.sort_id ? '修改' : '添加')+'子分类'" :visible.sync="showEdit" width="40%" :show-close="false"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="名称" prop="doc_name">
          <el-input v-model="form.doc_name"></el-input>
        </el-form-item>
        <el-form-item label="选择分类" prop="sort_id">
          <el-select v-model="form.sort_id" placeholder="请选择">
            <el-option v-for="item in list" :key="item.sort_id" :label="item.sort_name" :value="item.sort_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转地址" prop="doc_url">
          <el-input v-model="form.doc_url"></el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input v-model="form.doc_order" type="number"></el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitData">立即提交</el-button>
          <el-button @click="unForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加修改-->

    <!--分类添加修改-->
    <el-dialog :title="(type_form.sort_id ? '修改' : '添加')+'分类'" :visible.sync="typeEdit" width="40%" :show-close="false"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-form ref="form" :model="type_form" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="type_form.sort_name"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址">
          <el-input v-model="type_form.sort_url"></el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input v-model="type_form.sort_order" type="number"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitType">立即提交</el-button>
          <el-button @click="unTypeForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--分类添加修改-->

  </div>
</template>
<script>
    let _this = {}

    export default {
        data () {
            return {
                activeIndex: '0',
                showEdit: false,
                typeEdit: false,
                typeItemEdit: false,
                loading: false,
                type_form: {
                    sort_name: '',
                    sort_url: '',
                    sort_order: 1
                },
                form: {
                    sort_id: '',
                    doc_name: '',
                    doc_url: '',
                    doc_order: '1',
                    doc_attribute: '属性',
                },
                list: [],
                rules: {
                    sort_id: [
                        {required: true, message: '请输选择分类', trigger: 'blur'}
                    ],
                    doc_name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    doc_url: [
                        {required: true, message: '请输入跳转地址', trigger: 'blur'}
                    ]
                }
            }
        },
        created () {
            this.helpsort_list()
            _this = this
        },
        methods: {
            async helpsort_list () {
                this.loading = true
                let {data} = await this.$request.get(this.$API.common_api, {}, 'main', {
                    router_path: 'navigation/help',
                    request_host: 'CATEGORY_SERVER_HOST',
                })
                this.list = data
                this.loading = false
                this.form.sort_id = this.list[this.activeIndex] ? this.list[this.activeIndex].sort_id : ''
            },

            unTypeForm () {
                this.type_form = {
                    sort_name: '',
                    sort_url: '',
                    sort_order: 1
                }
                this.typeEdit = false
            },

            unForm () {
                this.form = {
                    sort_id: '',
                    doc_name: '',
                    doc_url: '',
                    doc_order: 1,
                    doc_attribute: '属性',
                }
                this.showEdit = false
            },

            async submitType () {
                let is_edit = this.type_form.sort_id || false
                if (!this.type_form.sort_name) {
                    SendMessage({message: '名称必须', type: 'warning'})
                    return false
                }
                await this.$request.request(this.$API.common_api, this.type_form, 'main', is_edit ? 'PUT' : 'POST', {
                    router_path: 'navigation/help',
                    request_host: 'CATEGORY_SERVER_HOST',
                    extra_url: is_edit ? `${this.type_form.sort_id}/` : ''
                })
                is_edit && (this.typeItemEdit = false)
                this.unTypeForm()
                this.helpsort_list()
            },

            submitData () {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let is_edit = this.form.id || false
                        await this.$request.request(this.$API.common_api, this.form, 'main', is_edit ? 'PUT' : 'POST', {
                            router_path: 'navigation/help/footdoc',
                            request_host: 'CATEGORY_SERVER_HOST',
                            extra_url: is_edit ? `${this.form.id}/` : ''
                        })
                        this.unForm()
                        this.helpsort_list()
                    } else {

                    }
                })
            },

            setTypeEdit (index) {
                let item = this.list[index]
                this.type_form = {
                    sort_name: item.sort_name,
                    sort_url: item.sort_url,
                    sort_order: 1,
                    sort_id: item.sort_id
                }
                this.typeEdit = true
            },

            setEdit (index) {
                let item = JSON.parse(JSON.stringify(this.list[this.activeIndex]))
                this.form = item.grouplist[index]
                this.showEdit = true
            },

            editOrder: _.debounce(async (index) => {
                let param = _this.list[_this.activeIndex]['grouplist'][index]
                await _this.$request.request(_this.$API.common_api, param, 'main', 'PUT', {
                    router_path: 'navigation/help/footdoc',
                    request_host: 'CATEGORY_SERVER_HOST',
                    extra_url: `${param.id}/`
                })
                _this.helpsort_list()
            }, 300),

            async delTypeEdit (id) {
                try {
                    await this.$confirm(`你是否删除该分类？删除后不可恢复', '提示`, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    await this.$request.request(this.$API.common_api, {is_delete: 1}, 'main', 'DELETE', {
                        router_path: 'navigation/help',
                        request_host: 'CATEGORY_SERVER_HOST',
                        extra_url: `${id}/`
                    })
                    SendMessage({message: '删除成功', type: 'success'})
                    this.helpsort_list()
                } catch (e) {

                }
            },

            async delHelp (id) {
                try {
                    await this.$confirm(`你是否删除该子分类？删除后不可恢复', '提示`, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    await this.$request.request(this.$API.common_api, {is_delete: 1}, 'main', 'DELETE', {
                        router_path: 'navigation/help/footdoc',
                        request_host: 'CATEGORY_SERVER_HOST',
                        extra_url: `${id}/`
                    })
                    SendMessage({message: '删除成功', type: 'success'})
                    this.helpsort_list()
                } catch (e) {

                }
            },

            handleSelect (event) {
                console.log(event)
                if (event == 'add') {
                    this.typeEdit = true
                } else {
                    this.activeIndex = event
                    this.form.sort_id = this.list[event].sort_id
                }
            }
        }
    }
</script>
<style lang="less" scoped>
  @import "../../assets/pageHeader";

  .table-content {
    width: calc(~"100% - 30px");
    margin: 15px;

    .help-menu {
      position: relative;

      .edit-icon-s {
        font-size: 11px;
        height: 18px;
        width: 18px;
        border-radius: 18px;
        text-align: center;
        line-height: 18px;
        color: #409EFF;
        background: #ecf5ff;
        border: 1px #b3d8ff solid;
      }

      .delete-s {
        color: #f56c6c;
        background: #fef0f0;
        border-color: #fbc4c4;
      }
    }

    .pop-mey {
      position: absolute;
      right: 30px;
      top: 15px;
    }
  }

</style>
