<template>
  <div class="content-home-help">
    <div class="home-help-cont content-width">
      <el-menu :default-active="category_form.category_type" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="0" @click="category_form.category_type='0'">首页买家帮助</el-menu-item>
        <el-menu-item index="1" @click="category_form.category_type='1'">首页卖家帮助</el-menu-item>
      </el-menu>

      <div class="content-help-cont">
        <div class="tag-group">
          <el-tag v-for="item in category" :key="item.label" closable
                  :type="now_category==item.category_id ? '' : 'info'"
                  class="tag-list"
                  @click="getItemCategory(item)" @close="closeCategory(item)">
            <i class="el-icon-edit tag-group-icon" @click.stop="openEdit(item)"></i>
            {{ item.label }}
          </el-tag>
          <el-tag type="primary" class="tag-list" effect="dark" @click="showAdd=true">设置显示区域</el-tag>
        </div>
      </div>
    </div>

    <!--添加分类-->
    <el-dialog title="添加分类" :visible.sync="showAdd" width="40%">
      <el-form ref="add_form" :model="category_form" label-width="120px" v-if="showAdd">

        <el-form-item label="分类名称">
          <el-input v-model="category_form.category_name"></el-input>
        </el-form-item>

        <el-form-item label="排序值">
          <el-input v-model="category_form.category_order" min="0"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitAdd">立即提交</el-button>
          <el-button @click="showAdd=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加分类-->
    <div class="help-table content-width">
      <div class="help-table-top">
        <span style="font-size: 13px">帮助：</span>
        <el-select v-model="nowFAQ" filterable remote reserve-keyword placeholder="请输入关键词搜索"
                   :remote-method="search_select">
          <el-option :label="item.doc_name" :value="index+''" :key="index" v-for="(item,index) in FAQList"></el-option>
        </el-select>
      </div>
      <el-table :data="tableData" stripe style="width: 100%;margin-top: 20px" v-loading="loading">
        <el-table-column fixed prop="doc_id" label="序号" width="80"></el-table-column>
        <el-table-column prop="doc_name" label="问题"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-button type="success" size="mini" v-if="!scope.row.status" plain>显示</el-button>
              <el-button type="info" size="mini" v-else plain>屏蔽</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="user_id" label="排序值" width="200">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.order" size="mini" @change="delHomeHelp()" :min="0"></el-input-number>
          </template>
        </el-table-column>
        <!--<el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column prop="solved_num" label="已解决数" width="100"></el-table-column>
        <el-table-column prop="unsolved_num" label="未解决数" width="100"></el-table-column>
        <el-table-column prop="vote_num" label="总投票数" width="100"></el-table-column>
        <el-table-column prop="doc_type" label="类型" width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-button type="success" size="mini" v-if="scope.row.doc_type==0" plain>FAQ</el-button>
              <el-button type="info" size="mini" v-else plain>帮助</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="user_id" label="排序值" width="200">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.order" size="mini" @change="delHomeHelp()" :min="0"></el-input-number>
          </template>
        </el-table-column>-->
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="openWindow(scope.row.doc_id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" circle
                         @click="delHomeHelp(scope.$index)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <open-window ref="openwindow" @closeOpenWindow="closeOpenWindow"></open-window>

  </div>
</template>

<script>
    import OpenWindow from '../../components/OpenWindow.vue'
    let _this = {}
    export default {
        data () {
            return {
                tableData: [],
                showAdd: false,
                selectDia: false,
                FAQList: [],
                nowFAQ: '',
                selectFAQ: [],
                category: [],
                loading: false,
                now_category: '',
                category_form: {
                    parent: null,
                    home_show: 1,
                    category_name: '',
                    category_url: '',
                    category_type: '0',
                    category_order: 1,
                    doc_data: []
                },
                edit_category_id:0,
            }
        },
        created () {
            this.category_list()
            _this = this
        },
        methods: {
            async category_list (id = '') {
                id && (this.loading = true)
                let {data} = await this.$request.get(this.$API.common_api, {
                    category_type: this.category_form.category_type,
                    home_show: 1
                }, 'main', {
                    router_path: 'help/category',
                    request_host: 'HELP_CATEGORY',
                    extra_url: id ? `${id}/` : ''
                })
                this.loading = false
                id ? this.tableData = data.doc : this.category = data
            },

            openWindow(id){
                this.$refs.openwindow.setShow({
                    url:'/help/FAQ?doc_id='+id,
                    title:'修改FAQ',
                    loading:true,
                    number:2
                })
            },

            closeOpenWindow(param){
                param && this.category_list(this.edit_category_id);
            },

            getItemCategory (event) {
                this.edit_category_id =event.category_id
                this.category_list(event.category_id)
                this.now_category = event.category_id
            },

            closeCategory (event) {
                let _this = this
                this.$confirm('你是否删除该分类？删除后不可恢复', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async (res) => {
                    await _this.$request.request(_this.$API.common_api, {}, 'main', 'DELETE', {
                        router_path: 'help/category',
                        request_host: 'HELP_CATEGORY',
                        extra_url: `${event.category_id}/`
                    })
                    SendMessage({message: '删除成功', type: 'success'})
                    _this.category_list()
                }).catch((e) => {

                })
            },

            async submitAdd () {
                let param = JSON.parse(JSON.stringify(this.category_form))
                let id = param.category_id ? param.category_id : ''
                id && (param['flag'] = 1)
                let data = await this.$request.request(this.$API.common_api, param, 'main', id ? 'PATCH' : 'POST', {
                    router_path: 'help/category',
                    request_host: 'HELP_CATEGORY',
                    extra_url: id ? `${id}/` : ''
                })
                this.category_list()
                this.unForm(this.category_form.category_type)
            },

            unForm (type = '0') {
                this.category_form = {
                    parent: null,
                    home_show: 1,
                    category_name: '',
                    category_url: '',
                    category_type: type,
                    category_order: 1,
                    doc_data: []
                }
                this.showAdd = false
            },

            search_select (event) {
                if (!this.now_category) {
                    SendMessage({message: '没有选择分类', type: 'warning'})
                    return false
                }
                event && this.getDocList(event)
            },

            async upHelpDoc (param) {
                let data = await this.$request.request(this.$API.common_api, {doc_data: param}, 'main', 'PATCH', {
                    router_path: 'help/category',
                    request_host: 'HELP_CATEGORY',
                    extra_url: `${this.now_category}/`
                })
                this.category_list(this.now_category)
            },

            openEdit(item){
                this.category_form.category_name = item.label
                this.category_form.category_order = item.category_order
                this.category_form['category_id'] = item.category_id
                console.log(item)
                this.showAdd=true
            },

            delHomeHelp: _.debounce((index = -1) => {
                index >= 0 && _this.tableData.splice(index, 1)
                let doc_list = []
                _this.tableData.forEach(item => {
                    doc_list.push({id: item.doc_id, order: item.order})
                })
                _this.upHelpDoc(doc_list)
            }, 300),

            selectChange (event) {
                this.selectFAQ = event
            },

            async getDocList (name) {
                let {data} = await this.$request.get(this.$API.common_api, {
                    status: 0,
                    page: 1,
                    doc_name: name
                }, 'main', {
                    router_path: 'help/doc',
                    request_host: 'HELP_CATEGORY',
                })
                this.FAQList = data.result
            }
        },
        watch: {
            nowFAQ (res) {
                let items = this.FAQList[res]
                if (items) {
                    let doc_list = [],
                        state = true
                    this.tableData.forEach(item => {
                        if (item.doc_id == items.doc_id) {
                            state = false
                            return false
                        }
                        doc_list.push({id: item.doc_id, order: item.order})
                    })

                    if (state) {
                        doc_list = doc_list.concat({id: items.doc_id, order: items.order})
                        this.tableData.push(items)
                        this.upHelpDoc(doc_list)
                    }
                    this.nowFAQ = ''
                }
            },
            'category_form.category_type' (res) {
                this.category_list()
                this.unForm(res)
                this.now_category = ''
                this.FAQList = []
                this.tableData = []
            }
        },
        components:{
            OpenWindow
        }
    }
</script>

<style lang="less">
  @import "../../assets/variable";
  @miniHeight: calc(~"100vh - 135px");

  .content-home-help {
    width: calc(~"100% - 30px");
    margin: 15px;
    min-height: @miniHeight;
    .home-help-cont{
      background: #ffffff;
      border-radius: @contentBorderRadius;
      box-shadow: @contentBoxShadow;
    }
    .content-help-cont {
      width: 100%;
      background: #ffffff;

      .tag-group {
        width: calc(~"100% - 20px");
        padding: 20px 10px;
      }

      .tag-group__title {
        font-size: 13px;
      }

      .tag-list {
        margin-left: 10px;
      }
    }

    .help-table {
      background: #ffffff;
      padding: 15px;
      width: calc(~"100% - 30px");
      margin-top: 20px;
      border-radius: @contentBorderRadius;
      box-shadow: @contentBoxShadow;
    }
    .tag-group-icon{
      border-radius: 50%;
      text-align: center;
      position: relative;
      cursor: pointer;
      font-size: 12px;
      height: 16px;
      width: 16px;
      line-height: 16px;
      vertical-align: middle;
      top: -1px;
      right: 0px;
      &:hover{
        background: #666666;
        color: #ffffff;
      }
    }
  }
</style>