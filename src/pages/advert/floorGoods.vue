<template>
  <div class="content">
    <div class="pages-header">
      <el-page-header @back="$router.back(-1)" content="设置楼层商品">
      </el-page-header>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showSelect=true">添加商品</el-button>
    </div>

    <div class="select-param">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="商品ID" class="form-item">
          <el-input v-model="formInline.goods_id" placeholder="商品ID"></el-input>
        </el-form-item>


        <el-form-item label="商品名称" class="form-item">
          <el-input v-model="formInline.goods_name" placeholder="商品名称"></el-input>
        </el-form-item>

        <el-form-item label="所属店铺" class="form-item">
          <el-input v-model="formInline.shop_id" placeholder="所属店铺"></el-input>
        </el-form-item>

        <el-form-item class="form-item">
          <el-button type="primary" @click="floor_goods(true)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-content">
      <el-table
        :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="goods_id" label="商品ID" width="180">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品图片" width="180">
          <template slot-scope="scope">
            <preview-image :image="scope.row.goods_thumb_image" :height="'50px'" :key="scope.$index"></preview-image>
          </template>
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格">
        </el-table-column>
        <el-table-column prop="goods_status" label="商品状态">
          <template slot-scope="scope">
            {{['上架','下架'][scope.row.goods_status]+' ('+['待审核','已审核'][scope.row.audit_status]+')'}}
          </template>
        </el-table-column>
        <el-table-column prop="shop_id" label="所属店铺">
        </el-table-column>
        <el-table-column prop="is_order" label="排序">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.is_order" size="mini" step-strictly
                             @change="orderChange(scope.$index)"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="移出" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" circle
                         @click="delGoods(scope.row.goods_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pages-style" background
                     @size-change="(res)=>{this.size = res;}"
                     @current-change="(res)=>{this.page = res;}"
                     :current-page.sync="page"
                     :page-sizes="[10, 20, 30,50]"
                     :page-size="size"
                     layout="total,sizes, prev, pager, next"
                     :total="total">
      </el-pagination>

      <!--选择商品-->
      <el-dialog title="设置商品" :visible.sync="showSelect" width="60%">
        <el-form :inline="true" :model="selectInline" class="demo-form-inline">
          <el-form-item label="商品ID" class="form-item">
            <el-input v-model="selectInline.goods_id" placeholder="商品ID"></el-input>
          </el-form-item>


          <el-form-item label="商品名称" class="form-item">
            <el-input v-model="selectInline.goods_name" placeholder="标题"></el-input>
          </el-form-item>

          <el-form-item label="所属店铺" class="form-item">
            <el-input v-model="selectInline.shop_id" placeholder="标题"></el-input>
          </el-form-item>

          <el-form-item class="form-item">
            <el-button type="primary" @click="goods_list(true)">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="goodsAll" stripe style="width: 100%" ref="multipleTable" v-loading="goods_loading"
          @select="handleSelectionChange" @select-all="handleSelectionChange">
          <el-table-column type="selection" :selectable='checkboxT' width="55" disabled='false'>
          </el-table-column>
          <el-table-column prop="goods_id" label="商品ID" width="80">
          </el-table-column>
          <el-table-column prop="goods_name" label="商品昵称" width="180">
          </el-table-column>
          <el-table-column prop="name" label="商品图片" width="180">
            <template slot-scope="scope">
              <preview-image :image="scope.row.goods_thumb_image" :key="'goods'+scope.$index"
                             :height="'50px'"></preview-image>
            </template>
          </el-table-column>
          <el-table-column prop="goods_price" label="商品价格" width="150">
          </el-table-column>
          <el-table-column prop="goods_status" label="商品状态" width="150">
            <template slot-scope="scope">
              {{['上架','下架'][scope.row.goods_status]+' ('+['待审核','已审核'][scope.row.audit_status]+')'}}
            </template>
          </el-table-column>
          <el-table-column prop="shop_id" label="所属店铺">
          </el-table-column>

        </el-table>

        <el-pagination class="pages-style"
                       :current-page="selectParam.page"
                       @current-change="(res)=>{this.selectParam.page = res;}"
                       background
                       :page-size="selectParam.size"
                       layout="prev, pager, next"
                       :total="selectParam.total">
        </el-pagination>

        <div class="submit-cont">
          <el-badge :value="selectLength" class="item">
            <el-button type="primary" @click="submitGoods">立即提交</el-button>
          </el-badge>
          <el-button @click="showSelect=false" style="margin-left: 20px">取消</el-button>
        </div>

      </el-dialog>
      <!--选择商品-->

    </div>

  </div>
</template>
<script>

    import PreviewImage from '../../components/PreviewImage'

    const PATH_LIST = {
        '1': {
            'goods': 'app/allfloor/allgoods',
            'del': 'app/floor/deletegoods',
            'title': 'APP'
        },
        '2': {
            'goods': 'floor/goods/html5',
            'del': 'floor/delgoods/html5',
            'title': 'H5'
        },
        '3': {
            'goods': 'floor/goods/wechat',
            'del': 'floor/delgoods/wechat',
            'title': '小程序'
        }
    }

    let _this = {}
    export default {
        data () {
            return {
                formInline: {
                    goods_id: '',
                    goods_name: '',
                    shop_id: '',
                },
                floor_type: '',
                loading: false,
                goods_loading: false,
                floor_id: '',
                showSelect: false,
                page: 1,
                size: 10,
                total: 10,
                selectParam: {
                    page: 1,
                    size: 5,
                    total: 10,
                },
                selectInline: {
                    goods_id: '',
                    goods_name: '',
                    shop_id: '',
                },
                goodsAll: [],
                tableData: [],
                expGoodsAll: [],
                nowSelect: {},
                selectLength: 0,
                selectLoading: false
            }
        },
        async created () {
            _this = this
            let query = this.$route.query
            if (!query.id || !query.type || (query.type && (query.type != 1 && query.type != 2 && query.type != 3))) {
                SendMessage({message: '参数错误', type: 'error'})
                this.$router.go(-1)
            }
            this.floor_type = query.type
            this.floor_id = query.id
            this.floor_goods()
        },
        methods: {
            async floor_goods (init_page = false) {
                init_page && (this.page = 1)
                this.loading = true
                let param = this.formInline
                param.floor_id = this.floor_id
                param.page = this.page
                param.size = this.size
                let data = await this.$request.get(this.$API.common_api, param, 'main', {
                    router_path: PATH_LIST[this.floor_type]['goods'],
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: PATH_LIST[this.floor_type]['title'] + '楼层商品列表;'
                })
                this.tableData = data.data
                this.expGoodsAll = data.key
                this.total = data.number
                this.loading = false
            },

            async goods_list (init_page = false) {
                init_page && (this.selectParam.page = 1)

                const select_goods = async () => {
                    this.selectLoading = true
                    await this.$common.wait(100)
                    this.goodsAll.forEach((item) => {
                        (this.nowSelect[this.selectParam.page] && this.nowSelect[this.selectParam.page][item.goods_id]) && this.$refs.multipleTable.toggleRowSelection(item)
                        this.expGoodsAll[item.goods_id] && this.$refs.multipleTable.toggleRowSelection(item)
                    })
                    this.selectLoading = false
                }

                this.goods_loading = true
                let data = await this.$request.get(this.$API.common_api, {
                    page: this.selectParam.page,
                    size: this.selectParam.size,
                    goods_id: this.selectInline.goods_id,
                    goods_name: this.selectInline.goods_name,
                    shop_id: this.selectInline.shop_id
                }, 'main', {
                    router_path: 'flool/allgoods',
                    request_host: 'CATEGORY_SERVER_HOST'
                })
                this.selectParam.total = data.total
                this.goodsAll = data.data
                //选择选择框
                select_goods()
                this.goods_loading = false
            },

            getSelectGoods () {
                let goods = []
                _.mapKeys(this.nowSelect, (item) => {
                    _.mapKeys(item, (key, index) => {
                        goods.push(index)
                    })
                })
                return goods
            },

            async submitGoods () {
                let goods = this.getSelectGoods()
                if (!goods.length) {
                    SendMessage({message: '没有选择商品', type: 'error'})
                    return false
                }

                await this.$request.post(this.$API.common_api, {goods_id: goods, floor_id: this.floor_id}, 'main', {
                    router_path: PATH_LIST[this.floor_type]['goods'],
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: PATH_LIST[this.floor_type]['title'] + `添加楼层商品;${this.floor_id}`
                })

                SendMessage({message: '添加成功', type: 'success'})
                this.showSelect = false
                this.floor_goods()
            },

            orderChange: _.debounce(async (index) => {
                let now = _this.tableData[index]
                await _this.$request.request(_this.$API.common_api, {
                    is_order: now.is_order,
                    goods_id: now.goods_id,
                    floor: _this.floor_id
                }, 'main', 'PUT', {
                    router_path: PATH_LIST[_this.floor_type]['del'],
                    request_host: 'CATEGORY_SERVER_HOST',
                    extra_url: `?goods_id=${now.goods_id}&floor_id=${_this.floor_id}`,
                    handle_desc: PATH_LIST[_this.floor_type]['title'] + `楼层商品排序;${_this.floor_id}`
                })
                _this.floor_goods()
            }, 300),

            async delGoods (goods_id) {
                if (await this.$common.confirmDialog(this, '你是否删除该商品？删除后不可恢复')) {
                    await this.$request.request(this.$API.common_api, {}, 'main', 'DELETE', {
                        router_path: PATH_LIST[this.floor_type]['del'],
                        request_host: 'CATEGORY_SERVER_HOST',
                        extra_url: `?goods_id=${goods_id}&floor_id=${this.floor_id}`,
                        handle_desc: PATH_LIST[this.floor_type]['title'] + `删除楼层商品;${this.floor_id}`
                    })
                    this.floor_goods()
                }
            },

            /**
             * table是否可选择
             * @param row
             * @param index
             * @returns {boolean}
             */
            checkboxT (row, index) {
                if (this.expGoodsAll[row.goods_id]) {
                    return false
                } else if (row.goods_status == 0 && row.audit_status == 1) {
                    return true
                } else {
                    return false
                }
            },

            handleSelectionChange (event) {
                if (!this.selectLoading) {
                    let obj = {}
                    event.forEach(item => {
                        // if(item.goods)
                        !this.expGoodsAll[item.goods_id] && (obj[item.goods_id] = 1)
                    })
                    this.nowSelect[this.selectParam.page] = obj
                    this.selectLength = this.getSelectGoods().length
                }
            }
        },

        components: {
            PreviewImage
        },

        watch: {
            'selectParam.page' () {
                this.goods_list()
            },
            size () {
                this.floor_goods()
            },
            page () {
                this.floor_goods()
            },
            showSelect (res) {
                if (res) {
                    this.goods_list()
                } else {
                    this.selectParam.page = 1
                    this.nowSelect = {}
                    this.selectLength = 0
                    this.$refs.multipleTable.clearSelection()
                }
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

  .table-content {
    width: @bodyWidth !important;
    background: #ffffff;
    padding: 0 9px;
    margin: 15px;

    .page-css {
      margin: 20px 0;
      padding-bottom: 20px;
    }
  }

  .submit-cont {
    margin-top: 15px;
    padding-right: 20px;
    text-align: right;
  }
</style>
