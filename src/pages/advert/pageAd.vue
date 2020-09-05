<template>
  <div class="content">
    <div class="pages-header">
      <div>页面广告</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">添加广告</el-button>
    </div>

    <div class="table-content">

      <el-tabs v-model="ad_type" type="card">
        <el-tab-pane label="PC设置" name="0"></el-tab-pane>
        <el-tab-pane label="APP设置" name="1"></el-tab-pane>
        <el-tab-pane label="H5设置" name="2"></el-tab-pane>
        <el-tab-pane label="小程序设置" name="3"></el-tab-pane>
      </el-tabs>

      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="页面类型" prop="ad_page">
          <el-select v-model="formInline.ad_page" placeholder="请选择" prop="ad_page">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in ad_page" :key="index" :label="item" :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告位置" prop="ad_position">
          <el-select v-model="formInline.ad_position" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in ad_position" :key="index" :label="item" :value="index">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="广告名称">
          <el-input v-model="formInline.ad_name" placeholder="广告名称"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="formInline.is_show" placeholder="状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="显示" value="0"></el-option>
            <el-option label="屏蔽" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="AdList(1)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="unFormInline">清空筛选条件</el-button>
        </el-form-item>
      </el-form>


      <el-table :data="tableData" stripe style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column fixed prop="ad_id" label="序号" width="80"></el-table-column>
        <el-table-column prop="ad_name" label="广告名称" width="200"></el-table-column>
        <el-table-column prop="ad_page" label="显示页面" width="150">
          <template slot-scope="scope">
            {{ad_page[scope.row.ad_page]}}
          </template>
        </el-table-column>
        <el-table-column prop="ad_position" label="广告位置" width="150">
          <template slot-scope="scope">
            {{ad_position[scope.row.ad_position]}}
          </template>
        </el-table-column>

        <el-table-column prop="ad_img" label="广告图片" width="150px">
          <template slot-scope="scope">
            <preview-image :key="scope.$index" :image="scope.row.ad_img" height="50px"></preview-image>
          </template>
        </el-table-column>
        <el-table-column prop="ad_url" label="广告地址" v-if="ad_type==0" width="550px"></el-table-column>
        <el-table-column prop="jump_to" label="跳转类型" v-else width="550px">
          <
          <template slot-scope="scope">
            <el-tag style="width: 70px;text-align: center;">{{ad_link[scope.row.jump_to]}}</el-tag>
            =>
            <el-tag type="warning">{{scope.row.jump_lower}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="is_show" label="状态" width="100px">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-button type="success" size="mini" v-if="scope.row.is_show==0" plain>显示</el-button>
              <el-button type="info" size="mini" v-else plain>屏蔽</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="openEdit(scope.$index)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="显示" placement="top" v-if="scope.row.is_show==1">
              <el-button type="success" icon="el-icon-check" size="mini" circle
                         @click="showAdShop(scope.$index,0)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="屏蔽" placement="top" v-else>
              <el-button type="warning" icon="el-icon-minus" size="mini" circle
                         @click="showAdShop(scope.$index,1)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" circle
                         @click="delAdShop(scope.row.ad_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pages-style"
                     :current-page="page"
                     @current-change="(res)=>{this.AdList(res)}"
                     background
                     @size-change="(res)=>{this.size=res;this.AdList(1)}"
                     :page-size="size"
                     :page-sizes="[10,20,50,100,200]"
                     layout="sizes,total,prev, pager, next"
                     :total="total">
      </el-pagination>
    </div>

    <!--pc添加修改-->
    <el-dialog :title="(form.ad_id ? '修改' : '添加') + '广告'" :visible.sync="showEdit" width="60%">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">

        <el-form-item label="页面类型" prop="ad_page">
          <el-select v-model="form.ad_page" placeholder="请选择" prop="ad_page">
            <el-option v-for="(item,index) in ad_page" :key="index" :label="item" :value="index">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="广告位置" prop="ad_position">
          <el-select v-model="form.ad_position" placeholder="请选择">
            <el-option v-for="(item,index) in ad_position" :key="index" :label="item" :value="index">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="广告名称" prop="ad_name">
          <el-input v-model="form.ad_name"></el-input>
        </el-form-item>
        <el-form-item label="广告图" prop="ad_img">
          <upload-img @uploaded="uploaded" :maxsize="300 * 1024"></upload-img>
          <img v-if="form.ad_img" :src="form.ad_img" class="avatar" style="max-height:200px;margin-top: 15px">
        </el-form-item>

        <el-form-item label="跳转地址" v-if="ad_type==0">
          <el-input v-model="form.ad_url"></el-input>
        </el-form-item>

        <el-form-item label="跳转地址" prop="jump_to" v-else>
          <el-select v-model="linkType" placeholder="请选择">
            <el-option @click.native="selectTo(index)" v-for="(item,index) in ad_link" :key="index" :label="item"
                       :value="index">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="跳转地址"
                      :rules="{required: true, message: '请输跳转地址', trigger: 'blur'}"
                      prop="jump_value" v-if="ad_type!=0 && form.jump_to==3">
          <el-input v-model="form.jump_value" maxlength="255"></el-input>
        </el-form-item>

        <el-form-item label="选择平台分类" v-if="form.jump_to==0" prop="jump_value">
          <el-cascader-panel :props="{ checkStrictly: true }" v-model="groupValue"
                             :options="groupData"></el-cascader-panel>
        </el-form-item>

        <el-form-item :label="'选择'+(form.jump_to==1 ? '商品' : '专题')" prop="jump_value"
                      v-if="form.jump_to==2 || form.jump_to==1">
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

        <el-form-item label="选择活动" v-if="form.jump_to==4" prop="jump_value">
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

        <el-form-item>
          <el-button type="primary" @click="submitData">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--pc添加修改-->

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
    import DialogActivity from '../../components/DialogActivity'

    const PATH_LIST = [
        {
            'all': 'main_page/ad',
            'one': 'main_page/ad',
            'up': 'main_page/ad',
            'down': 'main_page/ad',
            'title': 'PC'
        },
        {
            'all': 'app/main_page/ad',
            'one': 'app/main_page/onead',
            'up': 'app/ad/up',
            'down': 'app/ad/down',
            'title': 'APP'
        },
        {
            'all': 'ad/html5',
            'one': 'ad/one/html5',
            'up': 'ad/up/html5',
            'down': 'ad/down/html5',
            'title': 'H5'
        },
        {
            'all': 'ad/wechat',
            'one': 'ad/one/wechat',
            'up': 'ad/up/wechat',
            'down': 'ad/down/wechat',
            'title': '小程序'
        }
    ]

    import UploadImg from '@/components/UplodaImg'
    import PreviewImage from '@/components/PreviewImage'

    export default {
        data () {
            return {
                ad_type: '0',
                showEdit: false,
                showGoods: false,
                showSpecial: false,
                loading: false,
                goodsLoading: false,
                specialLoading: false,
                groupValue: [],
                formInline: {
                    ad_page: '',
                    ad_position: '',
                    ad_name: '',
                    is_show: ''
                },
                dialogForm: {
                    goods_name: '',
                    topic_name: ''
                },
                form: {
                    ad_page: '',
                    ad_position: '',
                    ad_name: '',
                    ad_img: '',
                    ad_url: '',
                    jump_to: null,
                    jump_lower: '',
                    jump_value: '',
                },
                dialog: {
                    page: 1,
                    size: 5,
                    total: 0,
                },
                special_size: 10,
                ad_page: ['首页', '搜索', '商品列表', '商品详情', '购物车', '注册', '登录', '个人中心首页', '帮助首页', '搜索帮助', '帮助列表', '帮助详情'],
                ad_position: ['头部广告', '左上广告', '左下广告', '右上广告', '右下广告', '底部广告', '弹窗广告', '浮窗广告'],
                ad_link: ['平台分类', '商品', '专题页', '自定义连接', '活动模版页'],
                groupData: [],
                goodsData: [],
                specialData: [],
                linkType: '',
                tableData: [],
                page: 1,
                total: 0,
                size: 10,
                rules: {
                    ad_page: [
                        {required: true, message: '页面类型必须', trigger: 'blur'},
                    ],
                    ad_position: [
                        {required: true, message: '广告位置必须', trigger: 'blur'}
                    ],
                    ad_name: [
                        {required: true, message: '广告名称必须', trigger: 'blur'}
                    ],
                    ad_img: [
                        {required: true, message: '广告图片必须', trigger: 'blur'}
                    ],
                    jump_to: [
                        {required: true, message: '跳转地址不能为空', trigger: 'blur'}
                    ],
                    jump_value: [
                        {required: true, message: '跳转内容不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        created () {
            this.AdList()
            this.group_list()
        },
        methods: {

            async AdList (page = 0) {
                page && (this.page = page)
                this.loading = true
                let param = this.formInline
                param['page'] = this.page
                param['page_size'] = this.size
                let data = await this.$request.get(this.$API.common_api, param, 'main', {
                    router_path: PATH_LIST[this.ad_type]['all'],
                    request_host: 'CATEGORY_SERVER_HOST'
                })
                this.tableData = data.data.result
                this.total = data.data.count
                this.loading = false
            },

            openEdit (index) {
                this.form = JSON.parse(JSON.stringify(this.tableData[index]))
                if (this.form.jump_to == 0 && this.ad_type != 0) {
                    let value = this.form.jump_value.split(','),
                        names = this.form.jump_lower.split('>')
                    value.forEach((item, index) => {
                        this.groupValue.push(item + '|' + names[index])
                    })
                }
                this.linkType = this.form.jump_to
                this.showEdit = true
            },

            unForm () {
                this.form = {
                    ad_page: '',
                    ad_position: '',
                    ad_name: '',
                    ad_img: '',
                    ad_url: '',
                    jump_to: null,
                    jump_lower: '',
                    jump_value: '',
                }
                this.groupValue = []
                this.linkType = null
                this.showEdit = false
            },

            async delAdShop (id) {
                if (await this.$common.confirmDialog(this, '你是否删除该广告？删除后不可恢复')) {
                    await this.$request.request(this.$API.common_api, {is_delete: 1}, 'main', 'DELETE', {
                        router_path: PATH_LIST[this.ad_type]['one'],
                        request_host: 'CATEGORY_SERVER_HOST',
                        extra_url: this.ad_type == 0 ? `${id}/` : `?ad=${id}`,
                        handle_desc: PATH_LIST[this.ad_type]['title'] + `删除广告;${id}`
                    })
                    this.AdList()
                }
            },

            async showAdShop (index, state) {
                let param = JSON.parse(JSON.stringify(this.tableData[index]))
                param.is_show = state
                await this.$request.request(this.$API.common_api, param, 'main', this.ad_type == 0 ? 'PUT' : 'DELETE', {
                    router_path: state ? PATH_LIST[this.ad_type]['down'] : PATH_LIST[this.ad_type]['up'],
                    request_host: 'CATEGORY_SERVER_HOST',
                    extra_url: this.ad_type == 0 ? `${param.ad_id}/` : `?ad=${param.ad_id}`
                })
                this.AdList()
            },

            submitData () {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let param = this.form
                        param.jump_to == 3 && (param.jump_lower = '自定义连接')
                        await this.$request.request(this.$API.common_api, param, 'main', this.form.ad_id ? 'PUT' : 'POST', {
                            router_path: this.form.ad_id ? PATH_LIST[this.ad_type]['one'] : PATH_LIST[this.ad_type]['all'],
                            request_host: 'CATEGORY_SERVER_HOST',
                            extra_url: this.form.ad_id ? (this.ad_type == 0 ? `${this.form.ad_id}/` : `?ad=${this.form.ad_id}`) : '',
                            handle_desc: PATH_LIST[this.ad_type]['title'] + `${this.form.ad_id ? '修改' : '添加'}广告;${this.form.ad_id ? this.form.ad_id : ''}`
                        })
                        this.unForm()
                        this.AdList()
                    } else {
                    }
                })
            },

            /**
             * 平台分类列表
             * @returns {Promise<void>}
             */
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
            selectActivity(id,lower){
                this.form.jump_value = id
                this.form.jump_lower = lower
                console.log(id,lower)
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

            selectTo (index) {
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

            uploaded (data) {
                this.form.ad_img = data.imageOssUrl
            },
            unFormInline () {
                this.page = 1
                this.size = 10
                this.formInline = {
                    ad_page: '',
                    ad_position: '',
                    ad_name: '',
                    is_show: ''
                }
                this.AdList()
            }
        },
        watch: {
            showEdit (res) {
                !res && this.unForm()
            },
            ad_type (res) {
                this.page = 1
                this.size = 10
                this.total = 0
                this.formInline = {
                    ad_page: '',
                    ad_position: '',
                    ad_name: '',
                    is_show: ''
                }
                this.AdList()
            },

            showGoods (res) {
                !res && (() => {
                    this.dialog = {
                        page: 1,
                        size: 5,
                        total: 0,
                    }
                    this.special_size = 10
                })()
            },

            showSpecial (res) {
                !res && (() => {
                    this.dialog = {
                        page: 1,
                        size: 5,
                        total: 0,
                    }
                    this.special_size = 10
                })()
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

  .demo-form-inline {
    margin: 15px 0;
  }

  .table-content {
    width: calc(~"100% - 30px");
    margin: 15px;
  }

  .submit-cont {
    margin-top: 15px;
    padding-right: 20px;
    text-align: right;
  }
</style>