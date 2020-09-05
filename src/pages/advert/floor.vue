<template>
  <div class="content">
    <div class="pages-header">
      <div>楼层广告</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">新建广告</el-button>
    </div>
    <div class="table-content">

      <el-tabs v-model="floor_type" type="card">
        <el-tab-pane label="PC楼层广告" name="0"></el-tab-pane>
        <el-tab-pane label="APP楼层广告" name="1"></el-tab-pane>
        <el-tab-pane label="H5楼层广告" name="2"></el-tab-pane>
        <el-tab-pane label="小程序楼层广告" name="3"></el-tab-pane>
      </el-tabs>

      <el-table :data="tableData" stripe style="width: 100%;min-height: 300px" v-loading="loading" v-if="floor_type==0">
        <el-table-column fixed prop="floor_id" label="序号" width="150"></el-table-column>
        <el-table-column prop="floor_name" label="楼层名称"></el-table-column>
        <el-table-column prop="floor_style" label="楼层模板" width="120">
          <template slot-scope="scope">
            {{tempList[scope.row.floor_style]}}
          </template>
        </el-table-column>
        <el-table-column prop="floor_order" label="排序值">
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
                         @click="editFloor(scope.row.floor_id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="开启" placement="top" v-if="scope.row.is_show==1">
              <el-button type="success" icon="el-icon-check" size="mini" circle
                         @click="showFloor(scope.row.floor_id,0)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="关闭" placement="top" v-else>
              <el-button type="warning" icon="el-icon-minus" size="mini" circle
                         @click="showFloor(scope.row.floor_id,1)"></el-button>
            </el-tooltip>
            <!--<el-button type="success" icon="el-icon-check" size="mini" circle></el-button>
            <el-button type="success" icon="el-icon-minus" size="mini" circle></el-button>-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteFloor(scope.row.floor_id)"
                         circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--非pc楼层配置-->
      <el-table :data="tableData2" stripe style="width: 100%;min-height: 300px" key="2" v-loading="loading" v-else>
        <el-table-column fixed prop="floor_id" label="楼层id" width="80"></el-table-column>
        <el-table-column prop="floor_name" label="楼层名称" width="130"></el-table-column>
        <el-table-column prop="floor_img" label="广告图片" width="180">
          <template slot-scope="scope">
            <preview-image :image="scope.row.floor_img" :height="'50px'" :key="scope.$index"></preview-image>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="grid_num" label="设置商品数">
         </el-table-column>-->

        <el-table-column prop="floor_style" label="显示样式">
          <template slot-scope="scope">
            {{appTemp[scope.row.floor_style]}}
          </template>
        </el-table-column>

        <el-table-column prop="floor_order" label="排序">
        </el-table-column>

        <el-table-column prop="is_show" label="状态" width="300">
          <template slot-scope="scope">
            <el-button type="success" size="mini" v-if="scope.row.is_show==0" plain>开启</el-button>
            <el-button type="info" size="mini" v-else plain>关闭</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="editFloor(scope.$index)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="设置商品" placement="top">
              <el-button type="info" icon="el-icon-goods" size="mini"
                         @click="$router.push('/advert/floorGoods?id='+scope.row.floor_id+'&type='+floor_type)"
                         circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="开启" placement="top" v-if="scope.row.is_show==1">
              <el-button type="success" icon="el-icon-check" size="mini" circle
                         @click="showFloor(scope.row.floor_id,0)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="关闭" placement="top" v-else>
              <el-button type="warning" icon="el-icon-minus" size="mini" circle
                         @click="showFloor(scope.row.floor_id,1)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteFloor(scope.row.floor_id)"
                         circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--非pc楼层配置-->
      <div class="pages-style">
        <el-pagination
          background :page-size="size" @current-change="handleCurrentChange"
          layout="total,prev, pager, next"
          :total="count">
        </el-pagination>
      </div>

    </div>

    <!--pc添加修改-->
    <el-dialog :title="form.floor_id ? '修改楼层广告' : '添加楼层广告'" :visible.sync="showEdit" width="60%" v-if="floor_type==0">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="楼层名称" prop="floor_name" :rules="{required: true, message: '请输楼层名称', trigger: 'blur'}">
          <el-input v-model="form.floor_name"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="floor_order" :rules="{required: true, message: '请输排序值', trigger: 'blur'}">
          <el-input v-model="form.floor_order" type="number"></el-input>
        </el-form-item>
        <el-form-item label="楼层样式" prop="floor_style" :rules="{required: true, message: '请选择楼层样式', trigger: 'blur'}">
          <el-select v-model="form.floor_style" placeholder="请选楼层样式">
            <el-option label="请选择模版" value=""></el-option>
            <el-option :label="temp" :value="key" v-for="(temp,key) in tempList" :key="key" v-if="temp"></el-option>
          </el-select>
        </el-form-item>
        <div class="images-list">
          <floor-template1 @changTempList="changTempList" :goodsList="form.goodsList"
                           v-if="form.floor_style==2"></floor-template1>
          <floor-template2 @changTempList="changTempList" :goodsList="form.goodsList"
                           v-else-if="form.floor_style==1"></floor-template2>
          <floor-template3 @changTempList="changTempList" :goodsList="form.goodsList"
                           v-else-if="form.floor_style===0"></floor-template3>
          <seckill-template v-else-if="form.floor_style===3" :status="3" ref="seckill"
                            :goodsList="form.goodsList"></seckill-template>
          <seckill-template v-else-if="form.floor_style===4" :status="4" ref="seckill"
                            :goodsList="form.goodsList"></seckill-template>
        </div>


        <el-form-item label="小标签">
          <el-table :data="form.floorGuide" stripe border style="width: 100%">
            <el-table-column prop="guide_name" label="链接名称" width="220">
              <template slot-scope="scope">
                <el-input placeholder="链接名称" v-model="scope.row.guide_name"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="guide_url" label="链接地址">
              <template slot-scope="scope">
                <el-input placeholder="链接地址" v-model="scope.row.guide_url"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="is_order" label="排序值" width="150">
              <template slot-scope="scope">
                <el-input placeholder="排序值" v-model="scope.row.is_order"></el-input>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <!--  <el-button type="primary" icon="el-icon-top" size="mini"
                             circle></el-button>
                  <el-button type="success" icon="el-icon-bottom"
                             size="mini"
                             circle></el-button>-->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGuide(scope.$index)"
                           circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="default" size="small" @click="pushGuide">添加标签</el-button>
        </el-form-item>


        <el-form-item label="头部广告图">
          <upload-img @uploaded="uploaded" :keystr="'adTop'"></upload-img>
          <img v-if="form.head_ad_img" :src="form.head_ad_img" class="avatar">
          <el-input v-model="form.head_ad_url" style="margin-top: 10px" placeholder="广告跳转地址"></el-input>
        </el-form-item>
        <el-form-item label="尾部广告图">
          <upload-img @uploaded="uploaded" :keystr="'adBottom'"></upload-img>
          <img v-if="form.tail_ad_img" :src="form.tail_ad_img" class="avatar">
          <el-input v-model="form.tail_ad_url" style="margin-top: 10px" placeholder="广告跳转地址"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitData">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--pc添加修改-->

    <!--非pc添加修改-->
    <el-dialog :title="miniForm.floor_id ? '修改楼层广告' : '添加楼层广告'" :visible.sync="showEdit" width="40%"
               v-if="floor_type!=0">
      <el-form ref="miniForm" :model="miniForm" label-width="120px">
        <el-form-item label="楼层名称" prop="floor_name" :rules="{required: true, message: '楼层名称不能为空', trigger: 'blur'}">
          <el-input v-model="miniForm.floor_name"></el-input>
        </el-form-item>
        <el-form-item label="楼层副标题" prop="subtitle_name"
                      :rules="{required: true, message: '楼层副标题不能为空', trigger: 'blur'}">
          <el-input v-model="miniForm.subtitle_name"></el-input>
        </el-form-item>
        <el-form-item label="广告图片" prop="floor_img" :rules="{required: true, message: '广告图片不能为空', trigger: 'blur'}">
          <upload-img @uploaded="uploaded" :keystr="'miniapp'"></upload-img>
          <img v-if="miniForm.floor_img" :src="miniForm.floor_img" class="avatar">
          <div style="font-size: 12px;color: #ccc;">400*200px，大小不超过300K</div>
        </el-form-item>

        <el-form-item label="显示样式" prop="floor_style"
                      :rules="{required: true, message: '显示样式不能为空', trigger: 'blur'}">
          <el-select placeholder="请选择" v-model="miniForm.floor_style">
            <el-option :label="item" :value="index" v-for="(item,index) in appTemp" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <!--  <el-form-item label="商品数量" prop="grid_num" :rules="{required: true, message: '商品数量不能为空', trigger: 'blur'}">
            <el-input v-model="miniForm.grid_num" type="number"></el-input>
          </el-form-item>-->

        <el-form-item label="排序值" prop="floor_order" :rules="{required: true, message: '排序值不能为空', trigger: 'blur'}">
          <el-input v-model="miniForm.floor_order" type="number"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitMini">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--非pc添加修改-->


  </div>
</template>
<script>
    import UploadImg from '@/components/UplodaImg'
    import FloorTemplate1 from '@/components/FloorAd/FloorTemplate1'
    import FloorTemplate2 from '@/components/FloorAd/FloorTemplate2'
    import FloorTemplate3 from '@/components/FloorAd/FloorTemplate3'
    import SeckillTemplate from '@/components/FloorAd/SeckillTemplate'
    import PreviewImage from '@/components/PreviewImage'

    const PATH_LIST = [
        {
            'find': 'category/views/category_list',
            'down': 'mallfloor/down',
            'up': 'mallfloor/up',
            'title': 'PC'
        },
        {
            'all': 'app/mallfloor',
            'find': 'app/onefloor',
            'up': 'app/allfloor/upfloor',
            'down': 'app/allfloor/downfloor',
            'title': 'APP',
        },
        {
            'all': 'floor/html5',
            'find': 'floor/one/html5',
            'down': 'floor/down/html5',
            'up': 'floor/up/html5',
            'title': 'H5'
        },
        {
            'all': 'floor/wechat',
            'find': 'floor/one/wechat',
            'down': 'floor/down/wechat',
            'up': 'floor/up/wechat',
            'title': '小程序'
        }
    ]

    export default {
        data () {
            return {
                showEdit: false,
                loading: false,
                floor_type: '0',
                tempList: ['八图模板', '七图模板一', '七图模板二', '团购模版', '秒杀模版'], //, '团购模版', '秒杀模版'
                appTemp: ['滑动', '平铺A', '平铺B'],
                floor_id: 0,
                form: {
                    floor_name: '',
                    floor_style: 0,
                    floor_order: 0,
                    is_show: 0,
                    goodsList: [],
                    head_ad_img: '',
                    head_ad_url: '',
                    tail_ad_img: '',
                    tail_ad_url: '',
                    floorGuide: []
                },
                miniForm: {
                    floor_name: '',
                    floor_img: '',
                    subtitle_name: '',
                    floor_order: '',
                    grid_num: 0,
                    floor_style: ''
                },
                tableData: [],
                tableData2: [],
                count: 0,
                page: 1,
                size: 10
            }
        },
        created () {
            this.loading = true
            this.floor_list()
        },
        methods: {
            async floor_list () {
                let data = await this.$request.get(this.$API.common_api, {page: this.page}, 'main', {
                    router_path: 'category/views/category_list',
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: 'pc楼层列表;'
                })
                this.tableData = data.data
                this.count = data.number
                this.loading = false
            },

            async request_list (res) {
                let data = await this.$request.get(this.$API.common_api, {page: this.page}, 'main', {
                    router_path: PATH_LIST[this.floor_type]['all'],
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: PATH_LIST[this.floor_type]['title'] + '楼层列表;',
                })
                this.tableData2 = data.data
                this.loading = false
            },

            /**
             * 打开修改弹窗
             */
            async editFloor (id) {
                if (this.floor_type == 0) {
                    let {data} = await this.$request.get(this.$API.common_api, {}, 'main', {
                        router_path: 'category/views/category_list',
                        request_host: 'CATEGORY_SERVER_HOST',
                        extra_url: `${id}/`
                    })

                    /**
                     * 获取活动商品数据（团购、秒杀楼层）
                     * @param goods
                     * @param floor_style
                     * @returns {Promise<Array>}
                     */
                    const set_activity_goods = async (goods, floor_style) => {
                        let ids = []
                        goods.forEach((item) => {
                            ids.push(item.aid)
                        })

                        let result = await this.$request.get(this.$API.activity_list_web, {
                            type: floor_style === 3 ? 1 : 2,
                            status: 3,
                            aidArr: ids.join(',')
                        })

                        if (result.data.data) {
                            let goodsList = []
                            goods.forEach((item, index) => {
                                let indexs = _.findIndex(result.data.data, function (o) {
                                    return o.aid == item.aid
                                })
                                goodsList[index] = item
                                if (indexs >= 0) {
                                    let nowItem = result.data.data[indexs]
                                    nowItem['is_sort'] = item['is_sort']
                                    nowItem['floor_id'] = item['floor_id']
                                    nowItem['id'] = item['id']
                                    goodsList[index] = nowItem
                                }
                            })
                            return goodsList
                        }
                    }

                    if (data.floor_style === 3 || data.floor_style === 4) {
                        data.goodsList = await set_activity_goods(data.goodsList, data.floor_style)
                    }

                    this.form = data
                } else {
                    this.miniForm = JSON.parse(JSON.stringify(this.tableData2[id]))
                }
                this.showEdit = true
            },

            async delFloorGuide (id) {

                this.form.floorGuide.splice(index, 1)
            },

            /**
             * 删除楼层
             */
            async deleteFloor (id) {
                if (await this.$common.confirmDialog(this, '你是否删除该楼层？删除后不可恢复')) {
                    await this.$request.request(this.$API.common_api, {}, 'main', 'DELETE', {
                        router_path: PATH_LIST[this.floor_type]['find'],
                        request_host: 'CATEGORY_SERVER_HOST',
                        extra_url: this.floor_type == 0 ? `${id}/` : `?floor_id=${id}`,
                        handle_desc: PATH_LIST[this.floor_type]['title'] + `删除楼层;${id}`
                    })
                    SendMessage({message: '删除成功', type: 'success'})
                    this.floor_type == 0 ? this.floor_list() : this.request_list()
                }
            },

            async showFloor (floor_id, status) {
                let url = status ? PATH_LIST[this.floor_type]['down'] : PATH_LIST[this.floor_type]['up']
                await this.$request.request(this.$API.common_api, {}, 'main', 'DELETE', {
                    router_path: url,
                    request_host: 'CATEGORY_SERVER_HOST',
                    extra_url: this.floor_type == 0 ? `${floor_id}/` : `?floor_id=${floor_id}`,
                    handle_desc: PATH_LIST[this.floor_type]['title'] + `${status ? '下架' : '上架'}楼层;${floor_id}`
                })
                this.floor_type == 0 ? this.floor_list() : this.request_list()
                SendMessage({message: status ? '下架成功' : '上架成功', type: 'success'})
            },

            /**
             * pc楼层添加
             * @returns {Promise<void>}
             */
            async submitData () {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let param = JSON.parse(JSON.stringify(this.form))
                        let goodsList = []
                        if (this.form.floor_style == 3 || this.form.floor_style == 4) {
                            goodsList = this.$refs.seckill.goodsList
                        } else {
                            _.mapKeys(param.goodsList, (item, key) => {
                                goodsList.push(item)
                            })
                        }
                        param.goodList = goodsList
                        delete param.goodsList
                        console.log(param)
                        await this.$request.request(this.$API.common_api, param, 'main', param.floor_id ? 'PUT' : 'POST', {
                            router_path: 'category/views/category_list',
                            request_host: 'CATEGORY_SERVER_HOST',
                            extra_url: param.floor_id ? `${param.floor_id}/` : '',
                            handle_desc: param.floor_id ? `PC修改楼层;${param.floor_id}` : 'PC添加楼层;'
                        })
                        this.showEdit = false
                        this.floor_list()
                    }
                })
            },

            /**
             * 非pc楼层提交
             */
            submitMini () {
                this.$refs.miniForm.validate(async (valid) => {
                    if (valid) {
                        let is_edit = this.miniForm.floor_id || false
                        await this.$request.request(this.$API.common_api, this.miniForm, 'main', is_edit ? 'PUT' : 'POST', {
                            router_path: PATH_LIST[this.floor_type][is_edit ? 'find' : 'all'],
                            request_host: 'CATEGORY_SERVER_HOST',
                            extra_url: is_edit ? `?floor_id=${this.miniForm.floor_id}` : '',
                            handle_desc: PATH_LIST[this.floor_type]['title'] + `${is_edit ? '修改' : '添加'}楼层;${is_edit ? this.miniForm.floor_id : ''}`
                        })
                        this.showEdit = false
                        SendMessage({message: is_edit ? '修改成功' : '添加成功', type: 'success'})
                        this.request_list()
                    }
                })
            },

            handleCurrentChange (event) {
                this.page = event
                this.floor_list()
            },

            pushGuide () {
                this.form.floorGuide.push({
                    floor_id: this.form.floor_id ? this.form.floor_id : '',
                    guide_name: '',
                    guide_url: '',
                    is_order: '',
                })
            },

            async deleteGuide (index) {
                if (this.form.floorGuide[index].guide_id) {
                    let {data} = await this.$request.request(this.$API.common_api, {is_delete: 1}, 'main', 'DELETE', {
                        router_path: 'category/floorguide',
                        request_host: 'CATEGORY_SERVER_HOST',
                        extra_url: `${this.form.floorGuide[index].guide_id}/`,
                        handle_desc: 'PC删除楼层小标题;'
                    })
                }
                this.form.floorGuide.splice(index, 1)
            },

            uploaded (data, key) {
                key === 'adTop' && (this.form.head_ad_img = data.imageOssUrl)
                key === 'adBottom' && (this.form.tail_ad_img = data.imageOssUrl)
                key === 'miniapp' && (this.miniForm.floor_img = data.imageOssUrl)
            },
            changTempList (item) {
                this.form.goodsList = item
                console.log(this.form)
            },

            /**
             * 清空miniapp的数据
             */
            unMiniForm () {
                this.miniForm = {
                    floor_name: '',
                    subtitle_name: '',
                    grid_num: 0,
                    floor_img: '',
                    floor_order: '',
                    floor_style: ''
                }
            }
        },
        watch: {
            floor_type (res) {
                this.page = 1
                this.loading = true
                res == 0 ? this.floor_list() : this.request_list()
            },
            showEdit (res) {
                !res && ((res) => {
                    this.form = {
                        floor_name: '',
                        floor_style: 33,
                        floor_order: 0,
                        is_show: 0,
                        goodsList: [],
                        head_ad_img: '',
                        head_ad_url: '',
                        tail_ad_img: '',
                        tail_ad_url: '',
                        floorGuide: []
                    }
                    this.form.floor_style = ''
                    this.unMiniForm()
                })()
            }
        },
        components: {
            UploadImg,
            PreviewImage,
            FloorTemplate3,
            FloorTemplate1,
            FloorTemplate2,
            SeckillTemplate
        }
    }
</script>
<style lang="less" scoped>
  @import "../../assets/pageHeader";

  .content {
    width: 100%;
    border-radius: 5px;

    .table-content {
      margin: 15px;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      max-height: 178px;
      display: block;
      margin-top: 15px;
      max-width: 80%;
    }
  }
</style>