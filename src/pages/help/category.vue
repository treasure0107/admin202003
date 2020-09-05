<template>
  <div class="contents">
    <div class="content-cont">
      <el-menu :default-active="add_form.category_type" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="0" @click="add_form.category_type='0'">买家帮助</el-menu-item>
        <el-menu-item index="1" @click="add_form.category_type='1'">卖家帮助</el-menu-item>
      </el-menu>
      <div class="tree-left help-tree" v-loading="loading">
        <el-button type="primary" icon="el-icon-plus" size="medium" style="margin: 10px 0" @click="setAdd" class="add_caty">添加分类</el-button>
        <el-input style="margin: 10px 0"
          placeholder="关键字搜索"
          v-model="filterText">
        </el-input>
        <el-tree :data="data" :props="defaultProps" ref="tree" :filter-node-method="filterNode"
                 @current-change="currentChange" :render-content="renderContent"></el-tree>
      </div>
      <div class="tree-right" v-loading="loading1">
        <div class="add-category">
          <el-form ref="add_form" :model="add_form" label-width="120px" v-if="showAdd">
            <el-form-item label="上级分类" v-if="!add_form.category_id">
              <el-select v-model="add_form.parent" placeholder="请选择" @change="parentChange">
                <el-option label="顶级分类" :value="null">
                </el-option>
                <el-option v-for="item in allowAddSon" :key="item.category_id" :label="item.label"
                           :value="item.category_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类名称">
              <el-input v-model="add_form.category_name"></el-input>
            </el-form-item>


            <el-form-item label="文章列表" v-if="showAddFAQ">

              <el-select v-model="nowFAQ" filterable remote reserve-keyword placeholder="请输入关键词搜索" :remote-method="search_select">
                <el-option :label="item.doc_name" :value="index+''" :key="index" v-for="(item,index) in FAQList"></el-option>
              </el-select>

              <el-table :data="add_form.doc_data" border stripe style="width: 100%;margin-top: 10px">
                <el-table-column fixed prop="order" label="排序" width="120">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.order" type="number" min="0"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="doc_name" label="文章类型"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle
                               @click="openWindow(scope.row.doc_id)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle
                               @click="deleteDoc(scope.$index)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <!--<el-form-item label="文档url">
              <el-input v-model="add_form.category_url"></el-input>
            </el-form-item>-->
            <el-form-item label="排序值">
              <el-input v-model="add_form.category_order"></el-input>
            </el-form-item>


            <el-form-item>
              <el-button type="primary" @click="submitAdd">立即提交</el-button>
              <el-button @click="showAdd=false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <open-window ref="openwindow" @closeOpenWindow="closeOpenWindow"></open-window>
    <!--$router.push({path: '/help/FAQ',query:{doc_id:scope.row.doc_id}})-->

  </div>
</template>
<script>
    import OpenWindow from '../../components/OpenWindow.vue'
    export default {
        data () {
            return {
                data: [],
                loading:false,
                loading1:false,
                loading2:false,
                selectDia: false,
                showAdd:false,
                filterText:'',
                showAddFAQ:true,   //是否可以操作FAQ
                home_show:0,
                add_form: {
                    parent: null,
                    home_show: 0,
                    category_name: '',
                    category_url: '',
                    category_type: '0',
                    category_order: 1,
                    doc_data: []
                },
                tableData: [],
                allowAddSon: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                FAQList: [],
                nowFAQ:'',
                page:1,
                size:10,
                count:0,
                edit_category_id:0,
            }
        },
        created () {
            this.category_list()
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            search_select(event){
                event && this.getDocList(event)
            },

            openWindow(id){
                this.$refs.openwindow.setShow({
                    url:'/help/FAQ?doc_id='+id,
                    title:'修改FAQ',
                    number:2,
                    loading:true
                })
            },

            closeOpenWindow(param){
                param && this.category_list(this.edit_category_id);
            },

            async getDocList (name) {
                let {data} = await this.$request.get(this.$API.common_api, {status: 0,page:1,doc_name:name}, 'main', {
                    router_path: 'help/doc',
                    request_host: 'HELP_CATEGORY',
                })
                this.FAQList = data.result
            },

            async category_list (id = '') {
                id ? this.loading1 = true : this.loading=true
                let {data} = await this.$request.get(this.$API.common_api, {category_type: this.add_form.category_type,home_show:this.home_show}, 'main', {
                    router_path: 'help/category',
                    request_host: 'HELP_CATEGORY',
                    extra_url: id ? `${id}/` : ''
                })
                if (!id) {
                    this.loading =false
                    this.data = data
                } else {
                    data['doc_data'] = data['doc']
                    delete data['doc']
                    data.category_type = data.category_type + ''
                    this.add_form = data
                    this.loading1 = false
                }
            },

            async getAllowAddSon () {
                let data = await this.$request.get(this.$API.common_api, {allow_add_son: 1,category_type:this.add_form.category_type,home_show:this.home_show}, 'main', {
                    router_path: 'help/category',
                    request_host: 'HELP_CATEGORY'
                })
                this.allowAddSon = data.data
            },

            deleteDoc (index) {
                let data = this.add_form.doc_data[index]
                this.add_form.doc_data.splice(index, 1)
            },

            selectChange (event) {
                console.log(event)
                this.add_form.doc_data = event
            },

            async submitAdd () {
                let param = JSON.parse(JSON.stringify(this.add_form))
                let id = param.category_id ? param.category_id : ''
                param.doc_data.forEach((item, index) => {
                    param.doc_data[index] = {id: item.doc_id, order: item.order}
                })
                //param.doc_data.length>0 && delete param['parent']
                let data = await this.$request.request(this.$API.common_api, param, 'main', id ? 'PATCH' : 'POST', {
                    router_path: 'help/category',
                    request_host: 'HELP_CATEGORY',
                    extra_url: id ? `${id}/` : ''
                })
                this.category_list()
                this.unForm(this.add_form.category_type)
                this.getAllowAddSon()
                //this.$refs.multipleTable.clearSelection()
            },


            parentChange (event) {
                this.add_form.parent = event
            },

            async removeTree(data){
                this.showAdd=false
                let _this = this
                this.$confirm('你是否删除该分类？删除后不可恢复', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async (res)=>{
                    await _this.$request.request(_this.$API.common_api,{},'main','DELETE',{
                        router_path: 'help/category',
                        request_host: 'HELP_CATEGORY',
                        extra_url: `${data.category_id}/`
                    })
                    SendMessage({message: '删除成功', type: 'success'})
                    _this.category_list()
                }).catch((e)=>{

                })

            },

            unForm(type='0'){
                this.add_form = {
                    parent: null,
                    home_show: 0,
                    category_name: '',
                    category_url: '',
                    category_type: type,
                    category_order: 1,
                    doc_data: []
                }
                this.showAddFAQ=true
                this.showAdd = false
            },

            setAdd(){
                this.unForm(this.add_form.category_type)
                this.showAdd = true
                this.add_form.parent = null
                this.getAllowAddSon()
            },

            handleNodeClick (data, node, obj) {
                this.showAdd = true
                if(node.data.children && node.data.children.length){
                    this.showAddFAQ = false
                }else {
                    this.showAddFAQ = true
                }
                this.edit_category_id = data.category_id
                this.category_list(data.category_id)
            },

            async setShow(node){
                let status = node.data.status ==0 ? 1 : 0
                let data = await this.$request.request(this.$API.common_api, {status:status}, 'main', 'PATCH', {
                    router_path: 'help/category',
                    request_host: 'HELP_CATEGORY',
                    extra_url: `${node.data.category_id}/`,
                    handle_desc:`${status ? '隐藏' : '开启'}帮助;${node.data.category_id}`
                })
                this.category_list()
                this.unForm(this.add_form.category_type)
                this.getAllowAddSon()
                // this.$refs.multipleTable.clearSelection()
            },
            showAdds(node){
                let {data} = node
                console.log(data)
                if(data.allow_add_son){
                    this.allowAddSon = [{category_id:data.category_id, label:data.label}]
                    this.add_form.parent = data.category_id
                    this.showAdd = true
                }
            },

            renderContent(h, { node, data, store }) {
                let {status} = node.data
                let icon = status ? 'el-icon-remove-outline' : 'el-icon-circle-check'
                let message = status ? '点击开启' : '点击隐藏'
                return (
                    <div class="custom-tree-node" style="width:100%">
                    <span style="font-size:13px">{node.label}</span>
                    <span>
                    <el-button type="" circle icon="el-icon-delete" size="mini" on-click={ () => this.removeTree(data) } style="float:right;margin-right:10px"></el-button>
                    <el-button type="" circle icon="el-icon-edit" size="mini" on-click={ () => this.handleNodeClick(data,node,store) } style="float:right;margin-right:10px"></el-button>
                    <el-tooltip class="item" effect="dark" content={message} placement="top">
                      <el-button type="" circle icon={icon} size="mini" on-click={ () => this.setShow(node) } style="float:right;"></el-button>
                    </el-tooltip>
                {node.data.allow_add_son ?
                    <el-tooltip class="item" effect="dark" content="添加下级" placement="top">
                    <el-button type="" circle icon="el-icon-plus" size="mini" on-click={ () => this.showAdds(node) } style="float:right;"></el-button>
                    </el-tooltip>
                : ''}
                </span>
                </div>);
            },

            currentChange (index) {
            }
        },
        watch:{
            nowFAQ(res){
                let item = this.FAQList[res]
                if(item){
                    let index = _.findIndex(this.add_form.doc_data, (o) => {return o.doc_id == item.doc_id})
                    index <0 && this.add_form.doc_data.push(item)
                    this.nowFAQ = ''
                }
            },
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            'add_form.category_type'(res){
                this.category_list()
                this.unForm(res)
                this.showAdd = false
                this.getAllowAddSon()
            }
        },
        components:{
            OpenWindow
        }
    }
</script>
<style lang="less" scoped>
  @import "../../assets/variable";
  @miniHeight: calc(~"100vh - 135px");
  .content-cont {
    width: calc(~"100% - 30px");
    margin: 15px;
    min-height: @miniHeight;
    background: #ffffff !important;
    box-shadow: @contentBoxShadow;
    border-radius: @contentBorderRadius;
    overflow: hidden;
    .tree-left {
      width: calc(~"400px - 20px");
      height: 100%;
      float: left;
      padding: 10px;
      .add_caty{
        margin-left: 10px;
      }
    }

    .tree-right {
      padding: 10px;
      width: calc(~"100% - 421px");
      border-left: 1px #eeeeee solid;
      float: right;

      .add-category {
        margin-top: 40px;
        width: 60%;
      }
    }
  }
</style>
