<template>
  <div class="content">
    <div class="pages-header">
      <div>首页Banner</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">添加banner</el-button>
    </div>
    <div class="table-content">

      <el-tabs v-model="banner_type" type="card">
        <el-tab-pane label="PC设置" name="pc"></el-tab-pane>
        <el-tab-pane label="APP设置" name="app"></el-tab-pane>
        <el-tab-pane label="H5设置" name="h5"></el-tab-pane>
        <el-tab-pane label="小程序设置" name="wechat"></el-tab-pane>
      </el-tabs>

      <el-table :data="tableData" stripe style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column fixed prop="banner_id" label="序号" width="150"></el-table-column>
        <el-table-column prop="banner_name" label="广告名称" width="120"></el-table-column>
        <el-table-column prop="img_url" label="广告图片" width="200">
          <template slot-scope="scope">
            <preview-image :image="scope.row.img_url" :height="'50px'"></preview-image>
          </template>
        </el-table-column>
        <el-table-column prop="img_link" label="跳转链接" v-if="banner_type=='pc'"></el-table-column>
        <el-table-column prop="jump_lower" label="跳转地址" v-else>
          <
          <template slot-scope="scope">
            <el-tag style="width: 70px;text-align: center;">{{ad_link[scope.row.jump_to]}}</el-tag>
            =>
            <el-tag type="warning">{{scope.row.jump_lower}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_show" label="状态">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-button type="success" size="mini" v-if="scope.row.is_show==0" plain>开启</el-button>
              <el-button type="info" size="mini" v-else plain>关闭</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="位置" width="300">
          <template slot-scope="scope">
            {{position[scope.row.position]}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="small" circle
                         @click="editBanner(scope.$index)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="上架" placement="top" v-if="scope.row.is_show==1">
              <el-button type="success" icon="el-icon-check" size="small" circle
                         @click="setListItem(scope.row.banner_id,'up')"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下架" placement="top" v-else>
              <el-button type="warning" icon="el-icon-minus" size="small" circle
                         @click="setListItem(scope.row.banner_id,'down')"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="small" circle
                         @click="setListItem(scope.row.banner_id,'delete')"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加修改-->
    <el-dialog :title="form.banner_id?'修改':'添加'+'Banner广告'" :visible.sync="showEdit" width="60%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="广告名称" :rules="{required: true, message: '请输广告名称', trigger: 'blur'}" prop="banner_name">
          <el-input v-model="form.banner_name"></el-input>
        </el-form-item>
        <el-form-item label="排序值" :rules="{required: true, message: '请输排序值', trigger: 'blur'}" prop="img_order">
          <el-input v-model="form.img_order" type="number"></el-input>
        </el-form-item>
        <el-form-item label="广告跳转地址" v-if="banner_type=='pc'"
                      :rules="{required: true, message: '请输广告跳转地址', trigger: 'blur'}" prop="img_link">
          <el-input v-model="form.img_link"></el-input>
        </el-form-item>

        <!--非pc-->
        <el-form-item label="跳转地址" :rules="{required: true, message: '请选择跳转地址', trigger: 'blur'}" prop="jump_to" v-else>
          <el-select v-model="linkType" placeholder="请选择">
            <el-option @click.native="selectTo(index)" v-for="(item,index) in ad_link" :key="index" :label="item"
                       :value="index">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="跳转地址" :rules="{required: true, message: '请输跳转地址', trigger: 'blur'}"
                      prop="jump_value"
                      v-if="banner_type!='pc' && form.jump_to==3">
          <el-input v-model="form.jump_value" maxlength="255"></el-input>
        </el-form-item>

        <el-form-item label="选择平台分类" :rules="{required: true, message: '请选择平台分类', trigger: 'blur'}"
                      v-if="banner_type!='pc' && form.jump_to==0" prop="jump_value">
          <el-cascader-panel :props="{ checkStrictly: true }" v-model="groupValue"
                             :options="groupData"></el-cascader-panel>
        </el-form-item>

        <el-form-item :label="'选择'+(form.jump_to==1 ? '商品' : '专题')"
                      :rules="{required: true, message: '请选择', trigger: 'blur'}"
                      prop="jump_value" v-if="banner_type!='pc' && (form.jump_to==2 || form.jump_to==1)">
          <el-button round type="primary" size="medium" plain v-if="!form.jump_value"
                     @click="form.jump_to==1 ? goods_list() : special_list()">
            <i class="el-icon-search"></i>
            {{'选择'+(form.jump_to==1 ? '商品' : '专题')}}
          </el-button>

          <div v-else-if="form.jump_to==1" @click="goods_list(true)" style="font-weight: bold">
            【{{form.jump_lower}}】
            <el-button type="primary" plain size="mini" icon="el-icon-search" circle></el-button>
          </div>
          <div v-else-if="form.jump_to==2" @click="special_list(true)" style="font-weight: bold">
            【{{form.jump_lower}}】
            <el-button type="primary" plain size="mini" icon="el-icon-search" circle></el-button>
          </div>
        </el-form-item>

        <el-form-item label="选择活动" v-if="form.jump_to==4" prop="jump_value"
                      :rules="{required: true, message: '选择活动', trigger: 'blur'}">
          <el-button round type="primary" size="medium" plain v-if="!form.jump_value"
                     @click="set_activity(true)">
            <i class="el-icon-search"></i>
            选择活动
          </el-button>
          <div @click="set_activity(true)" style="font-weight: bold" v-if="form.jump_lower">
            【{{form.jump_lower}}】
            <el-button type="primary" plain size="mini" icon="el-icon-search" circle></el-button>
          </div>
        </el-form-item>

        <!--非pc-->

        <el-form-item label="广告位置" prop="position" :rules="{required: true, message: '请选择广告位置', trigger: 'blur'}">
          <el-select v-model="form.position" placeholder="请选择活动区域">
            <el-option label="请选择" value="0"></el-option>
            <el-option :label="item" :value="index" v-for="(item,index) in position" :key="index"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="广告图" prop="img_url" :rules="{required: true, message: '请上传广告图', trigger: 'blur'}">
          <upload-img @uploaded="uploaded"></upload-img>
          <img v-if="form.img_url" :src="form.img_url" class="avatar" style="margin-top: 20px;width: 150px;">
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="upBannerInfo">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加修改-->

    <!--活动模版-->
    <dialog-activity ref="activity" @selectActivity="selectActivity"></dialog-activity>
    <!--活动模版-->

    <!--选择商品-->
    <el-dialog title="选择商品" :visible.sync="showGoods" width="45%" :close-on-click-modal="false"
               :close-on-press-escape="false" :show-close="false">
      <el-form :inline="true" :model="form" ref="searchForm" class="demo-form-inline" style="height: 45px">
        <el-form-item label="商品名称" prop="area_name" style="margin-left: 10px;">
          <el-input v-model="dialogForm.goods_name" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="goods_list()">查询</el-button>
          <label style="color: #E6A23C;font-size: 10px;margin-left: 20px;">(注：点击当前行即可选中数据)</label>
        </el-form-item>
      </el-form>
      <el-table
        ref="special"
        :data="goodsData"
        @current-change="currentChange"
        style="width: 100%;min-height:420px"
        v-loading="goodsLoading"
        highlight-current-row>
        <el-table-column fixed="left" label="商品(图片)">
          <template slot-scope="scope">
            <img :src="scope.row.goods_thumb_image" class="avatar" style="height: 50px;max-width: 100px">
          </template>
        </el-table-column>
        <el-table-column fixed prop="goods_name" label="商品(名称)"></el-table-column>
        <el-table-column fixed prop="goods_price" label="商品(价格)"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
      </el-table>
      <div class="pages-style">
        <el-pagination
          background
          @current-change="(res)=>{this.dialog.page=res;this.goods_list()}"
          :page-size="dialog.size"
          layout="total, prev, pager, next"
          :total=dialog.total>
        </el-pagination>
      </div>
      <div class="submit-cont">
        <el-badge :value="form.jump_value ? 1 : 0" class="item">
          <el-button type="primary" @click="showGoods=false">确认选择{{form.jump_lower ?
            '（'+form.jump_lower+'）' : ''}}
          </el-button>
        </el-badge>
      </div>
    </el-dialog>
    <!--选择商品-->


    <!--选择专题-->
    <el-dialog title="专题列表" :visible.sync="showSpecial" class="special-window" width="60%" :close-on-click-modal="false"
               :close-on-press-escape="false" :show-close="false">
      <el-form :inline="true" :model="dialogForm" ref="searchForm" class="demo-form-inline" style="height: 45px">
        <el-form-item label="专题名称" prop="area_name" style="margin-left: 10px;">
          <el-input v-model="dialogForm.topic_name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="special_list()">查询</el-button>
          <label style="color: #E6A23C;font-size: 10px;margin-left: 20px;">(注：点击当前行即可选中数据)</label>
        </el-form-item>
      </el-form>
      <el-table
        ref="special"
        :data="specialData"
        @current-change="currentChange"
        stripe style="width: 100%"
        v-loading="specialLoading"
        element-loading-text="玩命加载中.."
        highlight-current-row>
        <el-table-column fixed prop="id" label="序号" width="80"></el-table-column>
        <el-table-column fixed prop="topic_name" label="专题名称"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
      </el-table>
      <div class="pages-style">
        <el-pagination
          background
          @current-change="(res)=>{this.dialog.page=res;this.special_list()}"
          :page-size="dialog.size"
          :page-sizes="[10,20,50,100,200]"
          @size-change="(res)=>{this.special_size=res;this.dialog.page=1;this.special_list()}"
          layout="sizes,total, prev, pager, next"
          :total=dialog.total>
        </el-pagination>
      </div>

      <div class="submit-cont">
        <el-badge :value="form.jump_value ? 1 : 0" class="item">
          <el-button type="primary" @click="showSpecial=false;dialogForm.topic_name=''">确认选择{{form.jump_lower ?
            '（'+form.jump_lower+'）' : ''}}
          </el-button>
        </el-badge>
      </div>

    </el-dialog>
    <!--选择-->


  </div>
</template>

<script>
    import UploadImg from '@/components/UplodaImg'
    import PreviewImage from '@/components/PreviewImage'
    import DialogActivity from '@/components/DialogActivity'

    const URL_LIST = {
        h5: {
            list: 'banner/list/h5',
            one: 'banner/edit/h5',
            down: 'banner/down/h5',
            up: 'banner/up/h5'
        },
        wechat: {
            list: 'banner/list/wechat',
            one: 'banner/edit/wechat',
            down: 'banner/down/wechat',
            up: 'banner/up/wechat'
        },
        app: {
            list: 'banner/list/app',
            one: 'banner/edit/app',
            down: 'banner/down/app',
            up: 'banner/up/app'
        }
    }

    export default {
        data () {
            return {
                showEdit: false,
                banner_type: 'pc',
                form: {
                    banner_id: 0,
                    banner_name: '',
                    img_link: '',
                    img_order: 0,
                    position: '0',
                    img_url: 0,
                    jump_to: 0,
                    jump_value: '',
                    jump_lower: '',
                    is_delete: 0
                },
                ad_link: ['平台分类', '商品', '专题页', '自定义连接', '活动模版页'],
                linkType: 0,
                groupData: [],
                groupValue: [],
                dialog: {
                    page: 1,
                    size: 5,
                    total: 0,
                },
                dialogForm: {
                    goods_name: '',
                    topic_name: ''
                },
                specialData: [],
                specialLoading: false,
                showSpecial: false,
                goodsLoading: false,
                showGoods: false,
                goodsData: [],
                page: 1,
                size: 10,
                total: 0,
                position: {
                    '1': '首页',
                    '2': '商家入驻页',
                    '3': '定制印'
                },
                tableData: []
            }
        },
        created () {
            this.request_list()
            this.group_list()
        },
        methods: {
            request_list () {
                this.banner_type === 'pc' ? this.banner_list() : this.banner_get()
            },

            async group_list () {
                let {data} = await this.$request.get(this.$API.common_api, {}, 'main', {
                    router_path: 'goods/goods_category',
                    request_host: 'GOODS_CATEGORY'
                })
                data.forEach((item, index) => {
                    data[index].value = item.id + '|' + item.label
                    item.status && (data[index].disabled = true)
                    if (item.children && item.children.length) {
                        item.children.forEach((item2, index2) => {
                            data[index]['children'][index2].value = item2.id + '|' + item2.label
                            item2.status && (data[index]['children'][index2].disabled = true)
                            if (item2.children && item2.children.length) {
                                item2.children.forEach((item3, index3) => {
                                    data[index]['children'][index2]['children'][index3].value = item3.id + '|' + item3.label
                                    item3.status && (data[index]['children'][index2]['children'][index3].disabled = true)
                                    delete data[index]['children'][index2]['children'][index3]['children']
                                })
                            }
                        })
                    }
                })
                this.groupData = data
            },

            async setListItem (id, type) {
                let state = true
                let exp = {
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: `${this.banner_type}${{up: '上架', down: '下架', delete: '删除'}}banner;${id}`
                }
                let is_pc = this.banner_type === 'pc' || false
                if (!is_pc) {
                    let urls = {
                        up: URL_LIST[this.banner_type]['up'],
                        down: URL_LIST[this.banner_type]['down'],
                        delete: URL_LIST[this.banner_type]['one']
                    }
                    exp['router_path'] = urls[type]
                    exp['extra_url'] = `?banner_id=${id}`
                }
                if (type === 'up') {
                    await this.$request.request(is_pc ? this.$API.banner_up : this.$API.common_api, {id: id}, 'main', is_pc ? 'GET' : 'DELETE', exp)
                } else if (type === 'down') {
                    await this.$request.request(is_pc ? this.$API.banner_down : this.$API.common_api, {id: id}, 'main', is_pc ? 'GET' : 'DELETE', exp)
                } else if (type === 'delete') {
                    if (await this.$common.confirmDialog(this, '此操作将永久删除该banner, 是否继续?')) {
                        await this.$request.request(is_pc ? this.$API.banner_set : this.$API.common_api, {id: id}, 'main', 'DELETE', exp)
                    } else {
                        state = false
                    }
                }
                state && ((e) => {
                    this.request_list()
                    SendMessage({message: '执行成功', type: 'success'})
                })()
            },

            unForm () {
                this.form = {
                    banner_id: 0,
                    banner_name: '',
                    img_link: '',
                    img_order: 0,
                    position: '0',
                    img_url: 0,
                    jump_to: 0,
                    jump_value: '',
                    jump_lower: '',
                    is_delete: 0
                }
                this.groupValue = []
                this.linkType = 0
                this.showEdit = false
            },

            async upBannerInfo () {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let is_edit = this.form.banner_id || false
                        if (this.banner_type === 'pc') {
                            let data = await this.$request.request(this.$API.banner_set, this.form, 'main', is_edit ? 'PUT' : 'POST', {
                                handle_desc: is_edit ? `pc修改banner;${this.form.banner_id}` : 'pc添加banner;'
                            })
                        } else {
                            this.form.jump_to == 3 && (this.form.jump_lower = '自定义连接')
                            await this.$request.request(this.$API.common_api, this.form, 'main', is_edit ? 'PUT' : 'POST', {
                                request_host: 'CATEGORY_SERVER_HOST',
                                router_path: is_edit ? URL_LIST[this.banner_type]['one'] : URL_LIST[this.banner_type]['list'],
                                extra_url: is_edit ? `?banner_id=${this.form.banner_id}` : '',
                                handle_desc: is_edit ? `${this.banner_type}修改banner;${this.form.banner_id}` : `${this.banner_type}添加banner;`
                            })
                        }
                        this.request_list()
                        this.showEdit = false
                    }
                })
            },

            async editBanner (index) {
                this.form = JSON.parse(JSON.stringify(this.tableData[index]))
                this.form.position += ''
                if (this.form.jump_to == 0 && this.banner_type != 'pc') {
                    await this.$common.wait(100)
                    let value = this.form.jump_value.split(','),
                        names = this.form.jump_lower.split('>')
                    value.forEach((item, index) => {
                        this.groupValue.push(item + '|' + names[index])
                    })
                }
                this.linkType = this.form.jump_to
                console.log(this.form)
                this.showEdit = true
            },

            /**
             * 切换跳转地址
             */
            selectTo (index) {
                console.log(this.form.jump_to, index)
                if (this.form.jump_to != index) {
                    this.form.jump_lower = ''
                    this.form.jump_value = ''
                    this.groupValue = []
                }
                this.dialog.page = 1
                this.dialog.total = 0
                index == 1 && (this.dialogForm.goods_name = this.form.jump_lower)
                this.form.jump_to = index
            },

            /**
             * 表格单选改变
             */
            currentChange (row) {
                if (row) {
                    switch (this.form.jump_to) {
                        case 1:
                            this.form.jump_lower = row.goods_name
                            this.form.jump_value = row.spu_id + ',' + row.shop_id
                            break
                        case 2:
                            this.form.jump_lower = row.topic_name
                            this.form.jump_value = row.id
                            //TODO专题
                            break
                        default:
                            break
                    }
                }
            },

            /**
             * 打开活动模版选择
             */
            set_activity (state) {
                this.$refs['activity'].setData(state, {
                    id: this.form.jump_value,
                    lower: this.form.jump_lower
                })
            },

            /**
             * 设置选择活动模版数据
             * param id
             * param lower
             */
            selectActivity (id, lower) {
                this.form.jump_value = id
                this.form.jump_lower = lower
            },

            /**
             * 商品列表
             * @returns {Promise<void>}
             */
            async goods_list (search) {
                this.showGoods = true
                this.goodsLoading = true
                this.dialog.size = 5

                search && (this.dialogForm.goods_name = this.form.jump_lower)
                const selectGoods = async () => {
                    await this.$common.wait(100)
                    this.goodsData.forEach(item => {
                        item.goods_id == this.form.jump_value && this.$refs.special.setCurrentRow(item)
                    })
                }

                let data = await this.$request.get(this.$API.common_api, {
                    page: this.dialog.page,
                    goods_name: this.dialogForm.goods_name,
                    size: this.dialog.size
                }, 'main', {
                    router_path: 'goods/goods',
                    request_host: 'GOODS_SERVER_HOST'
                })
                this.dialog.total = data.total
                this.goodsData = data.data
                selectGoods()
                this.goodsLoading = false
            },

            /**
             * 专题列表
             */
            async special_list (search = false) {
                this.specialLoading = true
                search && (this.dialogForm.topic_name = this.form.jump_lower)
                let {data} = await this.$request.get(this.$API.common_api, {
                    page: this.dialog.page,
                    topic_name: this.dialogForm.topic_name,
                    page_size: this.special_size
                }, 'main', {
                    router_path: 'help/topic',
                    request_host: 'HELP_CATEGORY'
                })
                this.dialog.total = data.count
                this.specialData = data.result
                this.specialLoading = false
                this.showSpecial = true
            },

            /**
             * 获取非pc列表
             * @returns {Promise<void>}
             */
            async banner_get () {
                this.loading = true
                let {data} = await this.$request.request(this.$API.common_api, {}, 'main', 'GET', {
                    request_host: 'CATEGORY_SERVER_HOST',
                    router_path: URL_LIST[this.banner_type]['list'],
                    handle_desc: 'banner列表;'
                })
                this.loading = false
                this.tableData = data
            },

            /**
             * 获取pc列表
             * @returns {Promise<void>}
             */
            async banner_list () {
                this.loading = true
                let {data} = await this.$request.get(this.$API.banner_info, {}, 'main', {
                    handle_desc: 'banner列表;'
                })
                this.tableData = data
                this.loading = false
            },
            uploaded (data) {
                this.form.img_url = data.imageOssUrl
            }
        },
        watch: {
            showEdit (res) {
                !res && this.unForm()
            },
            banner_type (res) {
                this.tableData = []
                this.page = 1
                this.total = 0
                this.request_list()
            },
            groupValue (res) {
                let ids = [],
                    name = []
                res.forEach(item => {
                    let arr = item.split('|')
                    ids.push(arr[0])
                    name.push(arr[1])
                })
                this.form.jump_value = ids.join(',')
                this.form.jump_lower = name.join('>')
            }
        },
        components: {
            UploadImg, PreviewImage, DialogActivity
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