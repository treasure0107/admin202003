<template>
  <div class="content">
    <div class="pages-header">
      <el-page-header @back="$router.back(-1)" content="优选楼层商品">
      </el-page-header>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showSelect=true">设置平台分类</el-button>
    </div>

    <div class="select-param">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="商品ID" class="form-item">
          <el-input v-model="formInline.goods_id" placeholder="商品ID"></el-input>
        </el-form-item>


        <el-form-item label="商品名称" class="form-item">
          <el-input v-model="formInline.goods_name" placeholder="商品名称"></el-input>
        </el-form-item>

        <!--
                <el-form-item label="所属店铺" class="form-item">
                  <el-input v-model="formInline.shop_id" placeholder="所属店铺"></el-input>
                </el-form-item>
        -->
        <el-form-item label="所属店铺" prop="shop_id">
          <el-select v-model="formInline.shop_id" :remote-method="remoteMethod" remote filterable
                     placeholder="输入名称可搜索">
            <el-option
              v-for="item in shop_list"
              :key="item.shop_id"
              :label="item.shop_name"
              :value="item.shop_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="form-item">
          <el-button type="primary" @click="floor_goods(true)">查询</el-button>
        </el-form-item>
         <el-form-item class="form-item">
          <el-button @click="un_form()">清空条件</el-button>
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
         <template slot-scope="scope">
            <div>¥{{scope.row.goods_price}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goods_status" label="商品状态">
          <template slot-scope="scope">
            {{['上架','下架'][scope.row.goods_status]+' ('+['待审核','已审核'][scope.row.audit_status]+')'}}
          </template>
        </el-table-column>
        <el-table-column prop="ShopName" label="所属店铺">
        </el-table-column>
        <el-table-column prop="is_order" width='200' label="排序">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.is_order" size="mini" step-strictly
                             @change="orderChange(scope.$index)"></el-input-number>
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
      <el-dialog title="设置平台分类" :visible.sync="showSelect" width="70%" top="50px">

        <div class="tree-jingxuan" style="min-height: 300px;width: 100%" v-loading="goods_loading">
          <div style="margin-bottom: 20px">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
          </div>
          <div style="height: 60vh;overflow-y: scroll;">
          <el-tree
            :data="catList"
            show-checkbox
            node-key="id"
            :default-checked-keys="selectCat"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>
          </div>
        </div>
        <div class="submit-cont">
          <el-button type="primary" @click="submitGoods">立即提交</el-button>
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
                filterText: '',
                loading: false,
                goods_loading: false,
                floor_id: '',
                showSelect: false,
                page: 1,
                size: 10,
                total: 10,
                tableData: [],
                shop_list: [],
                catList: [],
                selectCat: [],
                selectLoading: false,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        async created () {
            _this = this
            let query = this.$route.query
            this.floor_id = query['id']
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
                let {data} = await this.$request.get(this.$API.common_api, param, 'main', {
                    router_path: 'floor/youxuan/goods',
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: '优选楼层商品列表;'
                })
                var datas = data['data'] ? data['data'] : [];
                for (let i = 0; i < datas.length; i++) {
                    datas[i]['ShopName'] = await this.$common.sellerName(datas[i]['shop_id'], this);
                  } 
                
                this.tableData = datas
                this.total = data.total
                this.loading = false
                this.selectCat = data['category_id_list'] && data['category_id_list']  ? JSON.parse(data['category_id_list']) : [];
            },

            un_form(){
              this.formInline = {
                    goods_id: '',
                    goods_name: '',
                    shop_id: '',
                };
                this.page = 1
                this.size = 10
                this.floor_goods(true);
            },

            async goods_category (init_page = false) {
                this.goods_loading = true
                let {data} = await this.$request.get(this.$API.common_api, {
                    category_device: 0,
                    category_type: 0,
                    category_k: 1,
                }, 'main', {
                    router_path: 'goods/goods_category',
                    request_host: 'GOODS_CATEGORY'
                })
                this.catList = data
                this.goods_loading = false
            },

            async submitGoods () {
                let node = this.$refs.tree.getCheckedNodes()
                let param = []
                node.forEach((item) => {
                    item.children.length == 0 && param.push(item['id'])
                })
                if (param.length) {
                    await this.$request.request(this.$API.common_api, {
                        floor_id: this.floor_id,
                        category_id_list: param
                    }, 'main', 'POST', {
                        router_path: 'floor/youxuan/goods',
                        request_host: 'CATEGORY_SERVER_HOST',
                        handle_desc: '添加楼层商品列表;'
                    })
                    this.showSelect = false;
                    this.floor_goods();
                } else {
                    SendMessage({message: '请选择分类', type: 'error'})
                }
            },

            filterNode (value, data) {
                if (!value) return true
                return data.label.indexOf(value) !== -1
            },

            async remoteMethod (e) {
                let {data} = await this.$request.get(this.$API.common_api, {shop_name: e}, 'main', {
                    router_path: 'seller/shops',
                    request_host: 'APP_SELLER_SERVER_HOST',
                })
                this.shop_list = data.result
            },

            orderChange: _.debounce(async (index) => {
                let now = _this.tableData[index]
                await _this.$request.request(_this.$API.common_api, {
                    is_order: now.is_order,
                    goods_id: now.goods_id,
                    floor: _this.floor_id
                }, 'main', 'PUT', {
                    router_path: 'floor/youxuan/goods_sort',
                    request_host: 'CATEGORY_SERVER_HOST',
                    extra_url: `?goods_id=${now.goods_id}&floor_id=${_this.floor_id}`,
                    handle_desc: `优选楼层商品排序;${_this.floor_id}`
                })
                _this.floor_goods()
            }, 300),

        },

        components: {
            PreviewImage
        },

        watch: {
            size () {
                this.floor_goods()
            },
            page () {
                this.floor_goods()
            },
            filterText (val) {
                this.$refs.tree.filter(val)
            },
            showSelect (res) {
                if (res) {
                    this.goods_category()
                } else {
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
<style lang="less">
  @color: #eeeeee;
  .tree-jingxuan .el-tree-node__content {
    height: 35px !important;
    /*border-bottom: 1px #eeeeee dashed;*/
    /*color: #FFFFFF!important;*/
  }

  .tree-jingxuan .is-checked {
    /*color: #3f9eff!important;*/
  }

  .tree-jingxuan {
    .el-tree-node {
      > .el-tree-node__content {
        /*background: #f2837e;*/
        position: relative;
        /*
                border-left: 1px @color dashed;
        */

        &:after {
          position: absolute;
          content: '';
          width: 18px;
          left: 0;
          height: 1px;
          /*
                    border-bottom: 1px @color dashed;
          */
        }
      }

      .el-tree-node {
        > .el-tree-node__content {
          margin-left: 18px;
          /*
                    border-left: 1px @color dashed;
          */
          padding-left: 10px !important;
          position: relative;

          &:after {
            position: absolute;
            content: '';
            width: 18px;
            left: 0;
            height: 1px;
            /*
                        border-bottom: 1px @color dashed;
            */
          }

          &:last-child {
            &:before {
              position: absolute;
              content: '';
              width: 18px;
              left: 0;
              bottom: 0;
              height: 1px;
              /*
                            border-bottom: 1px #00a0e9 dashed;
              */
            }
          }

          /*background: #ffceaa;*/
        }

        .el-tree-node {
          > .el-tree-node__content {
            /*background: #9db898;*/
            padding-left: 18px !important;
            margin-left: 36px;
            /*
                        border-left: 1px @color dashed;
            */
            position: relative;

            &:after {
              position: absolute;
              content: '';
              width: 36px;
              height: 1px;
              /*
                            border-bottom: 1px @color dashed;
              */
            }
          }
        }
      }
    }
  }
</style>
