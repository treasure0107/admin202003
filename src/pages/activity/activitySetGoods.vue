<template>
  <div class="content">
    <div class="pages-header">
      <div>
        <router-link to="/activity/activityList" style="text-decoration:none;color:#000000;">活动模板列表</router-link>
        /
        <span @click="jumpLast()">活动模板楼层</span>/商品
      </div>
      <el-button style="float: right;margin-top: 15px;margin-right: 40px;" type="primary" id="add-logistics"
                 size="medium" @click="addGood()">添加商品
      </el-button>

    </div>
    <div class="form-search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="商品ID">
          <el-input v-model="formInline.good_id" placeholder="商品ID" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="formInline.good_name" placeholder="商品名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺">
          <el-select v-model="formInline.affiliated_shop" filterable placeholder="店铺名称,输入名称可搜索">
            <el-option
              v-for="item in shop_list"
              :key="item.shop_id"
              :label="item.shop_name"
              :value="item.shop_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchGoods" size="mini">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <div class="order_tabs white" v-loading="loading">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="goid" label="序号"></el-table-column>
          <el-table-column prop="good_id" label="商品ID"></el-table-column>
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <preview-image :image="scope.row.good_image" :height="'50px'"></preview-image>
            </template>
          </el-table-column>
          <el-table-column prop="good_name" label="商品名称"></el-table-column>
          <el-table-column label="商品价格">
            <template slot-scope="scope">
              ¥ {{ scope.row.goods_price}}
            </template>
          </el-table-column>
          <el-table-column label="商品角标">
            <template slot-scope="scope">
              {{ scope.row.desc }}
            </template>
          </el-table-column>
          <el-table-column prop="affiliated_shop" label="所属店铺"></el-table-column>
          <el-table-column prop="is_show"  label="状态">
            <template slot-scope="scope" >
              {{ scope.row.is_show==1?'隐藏':'显示' }}
            </template>
          </el-table-column>
          <el-table-column prop="is_order" label="排序(越大越靠前)"></el-table-column>
          <el-table-column prop="operation" label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button type="success" size="mini" plain @click="editGood(scope.$index)">编辑</el-button>
                <el-button type="danger" size="mini" plain @click="deleteGood(scope.row.goid)">移除</el-button>
                <el-dialog title="编辑商品 （填写的商品信息仅在该专题页展示）" :visible.sync="dialog">
                  <el-form ref="form" :rules="rules" :model="form" label-width="120px">
                    <el-row>
                      <el-col :span="24">
                        <div class="form-item">
                          <el-form-item label="商品图" prop="good_image">
                            <el-row>
                              <el-col :span="4">
                                <el-image style="width: 100px; height: 100px" :src="form.good_image" :fit="fit"
                                          v-if="form.good_image"></el-image>
                              </el-col>
                              <el-col :span="8">
                                <upload-img @uploaded="uploadedGoodImage"></upload-img>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="24">
                                <el-button @click="form.good_image = ''" type="text" v-if="form.good_image">删除
                                </el-button>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="14">
                        <div class="form-item">
                          <el-form-item label="商品名称" prop="good_name">
                            <el-input v-model="form.good_name"></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <div class="form-item">
                          <el-form-item label="排序值(越大越靠前)" prop="is_order">
                            <el-input v-model="form.is_order" v-model.number="form.is_order"></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="14">
                        <div class="form-item">
                          <el-form-item label="促销角标文本" prop="desc">
                            <el-input v-model="form.desc" placeholder="若有多个以中文逗号间隔"></el-input>
                            (每个角标文本请不要超过四个中文/字符)
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="form-item">
                          <el-form-item label="状态" prop="is_show">
                            <el-switch v-model="form.is_show"></el-switch>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="20" :offset="4">
                        <div class="form-item">
                          <el-button type="primary" @click="onSubmit(form)">保存</el-button>
                          <el-button @click="dialog = false">取消</el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-dialog>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages_footer white" v-if="pageData.total > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.page_index"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="formInline.size"
          layout="total, prev, pager, next, jumper"
          :total="pageData.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="添加商品(仅支持当前页，或翻页后的当前页)" width="60%" :visible.sync="addGoods">
      <el-row>
        <el-rol>
          <div class="form-search">
            <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
              <el-form-item label="商品ID" prop="goods_name">
                <el-input v-model="searchForm.goods_id" placeholder="商品ID"></el-input>
              </el-form-item>
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="searchForm.goods_name" placeholder="商品名称"></el-input>
              </el-form-item>
              <el-form-item label="店铺名称" prop="shop_id">
                <el-select v-model="searchForm.shop_id" filterable placeholder="店铺名称,输入名称可搜索">
                  <el-option
                    v-for="item in shop_list"
                    :key="item.shop_id"
                    :label="item.shop_name"
                    :value="item.shop_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search">筛选</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="">
            <el-table ref="multipleTable" :data="goodsList" tooltip-effect="dark" style="width: 100%"
                      @selection-change="handleSelectionChange">>
              <el-table-column type="selection" prop="goods_id" label="序号" width="100"></el-table-column>
              <el-table-column prop="goods_id" label="序号" width="100"></el-table-column>
              <el-table-column label="商品" s width="200">
                <template slot-scope="scope">
                  <el-row>
                    <preview-image :image="scope.row.goods_thumb_image" key="key" width="70px"
                                   style="float: left"></preview-image>
                    <span style="margin-left: 10px">
                                               {{scope.row.goods_name}}
                                               <br>
                                               {{scope.row.goods_qty}}
                                            </span>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="goods_price" label="价格"></el-table-column>
              <el-table-column prop="shop_id" label="所属店铺"></el-table-column>
              <el-table-column prop="create_time" label="上传时间" width="150"></el-table-column>
            </el-table>
            <div class="table-page">
              <div class="block">
                <el-pagination
                  background
                  @current-change="handleCurrentChangeGoods"
                  :current-page="pageNo"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-rol>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="4">
          <div class="form-item">
            <el-button type="primary" @click="addGoodsSubmit(form)">保存</el-button>
            <el-button @click="addGoods = false">取消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {RETURN_STATUS} from "../../config/order";
  import PreviewImage from '@/components/PreviewImage'
  import UploadImg from '@/components/UplodaImg'
  // import custom_config from '@/../custom_config.js'

  export default {
    data() {
      return {
        ppy_host: CUSTOM_CONFIG.PPY_HOST,
        loading: false,
        returnStatus: RETURN_STATUS,
        activeName: 'all',
        dialog: false,
        addGoods: false,
        activity_id: '',
        floor_id: '',
        tableData: [],
        goodsList: [],
        add_goods_list: [],
        pageData: {
          total: 0,
          page_index: 1,
          size: 10
        },
        pageNo: 1,
        pageSize: 10,
        total: 0,
        formInline: {
          good_id: '',
          good_name: '',
          shop_id: '',
          size: 10,
          page: 1
        },
        shop_list: [],
        form: {
          good_image: '',
          good_name: '',
          is_order: '',
          desc: '',
          is_show: true
        },
        searchForm: {
          goods_id: '',
          goods_name: '',
          affiliated_shop: '',
        },
        rules: {
          good_name: [
            {min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur'}
          ],
          is_order: [
            {type: 'number', message: '排序值必须为数字值'}
          ]
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              data.data.forEach(async item => {
                if (item.operator_id) {
                  item.operator_id = await this.$common.getUserName(item.operator_id, this);
                } else {
                  item.operator_id = '';
                  item.operator_time = '';
                }
                if (item.shop_id) {
                  this.$request.get(this.$API.common_api, {shop_id: item.shop_id}, 'main',
                    {
                      router_path: 'shop/get_shop_name',
                      request_host: 'APP_SELLER_SERVER_HOST',
                    }).then((res) => {
                    item.shop_id1 = item.shop_id;
                    if (JSON.stringify(res.data) != "{}") {
                      item.shop_id = res.data[0]['shop_name'];
                    } else {
                      item.shop_id = '未知店铺'
                    }
                  });
                }
              });
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        currentPage: 1,
        fit: 'contain',
        errorMessage: '',
        orderExportParams: {
          refund_id_list: '',
        }
      }
    },
    created() {
      this.goods_list(this.formInline);
      this.activity_id = this.$route.query.activity_id;
      this.floor_id = this.$route.query.floor_id;
      this.get_shop_list();
    },
    methods: {
      search() {
        this.get_goods_list()
      },
      searchGoods() {
        this.goods_list()
      },
      uploadedGoodImage(data) {
        this.form.good_image = data.imageOssUrl
      },
      async goods_list() {
        this.loading = true;
        let parameter=this.formInline;
        parameter['page'] = this.pageData.page_index;
        parameter['floor_id'] = this.$route.query.floor_id;
        parameter['page_size'] = this.pageData.size;
        let data = await this.$request.get(this.$API.common_api, parameter, 'main', {
          router_path: 'activity/activityFloorGoods',
          request_host: 'CATEGORY_SERVER_HOST',
          handle_desc: '查看模板楼层商品列表;'
        });

        if (data.code == 200) {
          if(data.data.result.length>0){
            data.data.result.forEach(async item => {
              if (item.affiliated_shop) {
                this.$request.get(this.$API.common_api, {shop_id: item.affiliated_shop}, 'main',
                  {
                    router_path: 'shop/get_shop_name',
                    request_host: 'APP_SELLER_SERVER_HOST',
                  }).then((res) => {
                  item.shop_id1 = item.affiliated_shop;
                  if (JSON.stringify(res.data) != "{}") {
                    item.affiliated_shop = res.data[0]['shop_name'];
                  } else {
                    item.affiliated_shop = '未知店铺'
                  }
                });
              }
            });
          }
          this.tableData = data.data.result;
          this.pageData.total = data.data.count;
        }
        this.loading = false
      },
      addGood() {
        this.get_goods_list()
        this.addGoods = true
      },
      editGood(index) {
        this.form= JSON.parse(JSON.stringify(this.tableData[index]));
        this.form.affiliated_shop=this.form.shop_id1;
        this.form.is_show = this.form.is_show == 0 ? true : false
        this.dialog = true
      },
      async get_goods_list() {
        let param = {};
        param['page'] = this.pageNo;
        param['goods_id'] = this.searchForm.goods_id;
        param['shop_id'] = this.searchForm.shop_id;
        param['goods_name'] = this.searchForm.goods_name;
        param['goods_status'] = 0;
        param['audit_status'] = 1;
        let data = await this.$request.get(this.$API.common_api, param, 'main',
          {
            router_path: 'goods/goods',
            request_host: 'GOODS_SERVER_HOST',
            handle_desc: '查看商品列表;'
          });
        data.data.forEach(async item => {
          if (item.shop_id) {
            this.$request.get(this.$API.common_api, {shop_id: item.shop_id}, 'main',
              {
                router_path: 'shop/get_shop_name',
                request_host: 'APP_SELLER_SERVER_HOST',
              }).then((res) => {
              item.shop_id1 = item.shop_id;
              if (JSON.stringify(res.data) != "{}") {
                item.shop_id = res.data[0]['shop_name'];
              } else {
                item.shop_id = '未知店铺'
              }
            });
          }
        });
        this.goodsList = data.data;
        this.total = data.total;
      },
      onSubmit() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            let params = this.form;
            params['is_show'] = params['is_show'] == true ? 0 : 1
            let data = await this.$request.request(this.$API.common_api, params, 'main', 'PUT', {
              router_path: 'activity/editActivityFloorGoods',
              request_host: 'CATEGORY_SERVER_HOST',
              handle_desc: '编辑模版楼层商品;' + params.goid,
              extra_url: '?goid=' + params.goid
            })
            if (data.code == '200' && data.data) {
              this.goods_list()
              this.dialog = false
              this.success()
            } else {
              this.errorMessage = '更新失败'
              this.fail()
            }
          } else {
            return false;
          }
        });
      },
      async deleteGood(goid) {
        let params = {goid: goid}
        let data = await this.$request.request(this.$API.common_api, params, 'main', 'DELETE', {
          router_path: 'activity/deleteActivityFloorGoods',
          request_host: 'CATEGORY_SERVER_HOST',
          handle_desc: '删除模版楼层商品;' + params.goid,
          extra_url: '?goid=' + params.goid
        })
        if (data.code == '200' && data.data) {
          this.goods_list()
          this.success()
        } else {
          this.errorMessage = '更新失败'
          this.fail()
        }
      },
      async get_shop_list() {
        let res = await this.$request.get(this.$API.common_api, '', 'main',
          {
            router_path: 'shop/get_shop_name_list',
            request_host: 'APP_SELLER_SERVER_HOST',
            handel_class: ''
          });
        this.shop_list = res.data;
      },
      handleSizeChange(val) {
        this.formInline.size = val
        this.goods_list(this.formInline)
      },
      handleSelectionChange(goods) {
        console.log(goods);
        this.add_goods_list = goods;
        //初始化参数数组
      },
      async addGoodsSubmit() {
        if (this.add_goods_list.length > 0) {
          let param_list = [];
          this.add_goods_list.forEach((item, index) => {
            let param = {};
            param['floor_id'] = this.floor_id;
            param['good_id'] = item['spu_id'];
            param['good_image'] = item['goods_thumb_image'];
            param['good_name'] = item['goods_name'];
            param['goods_price'] = item['goods_price'];
            param['goods_status'] = 0;
            param['is_show'] = 0;
            param['affiliated_shop'] = item['shop_id1'];
            param_list.push(param)
          });
          let data = await this.$request.request(this.$API.common_api, param_list, 'main', 'POST', {
            router_path: 'activity/addActivityFloorGoods',
            request_host: 'CATEGORY_SERVER_HOST',
            handle_desc: '新增模板楼层商品;'
          });

          if (data.code == 200) {
            SendMessage({
              message: '操作成功',
              type: 'success'
            });
            this.addGoods = false;
            this.goods_list();
          } else {
            SendMessage({
              message: '操作失败，请稍后重试',
              type: 'error'
            });
          }
        } else {
          SendMessage({
            message: '请在当前页码选择商品',
            type: 'error'
          });
          return false
        }
      },

      handleCurrentChangeGoods(val) {
        this.pageNo = val
        this.get_goods_list()
      },
      handleCurrentChange(val) {
        this.pageData.page_index = val
        this.goods_list()
      },
      clickJump(url) {
        this.$router.push(url)
      },
      jumpLast() {
        this.$router.push({
          path: '/activity/activityFloor',
          query: {activity_id: this.activity_id}
        })
      },
      success() {
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success'
        });
      },
      fail() {
        this.$message({
          showClose: true,
          message: this.errorMessage,
          type: 'error'
        });
      }
    },
    components: {
      PreviewImage,
      UploadImg
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/pageHeader";

  .content {
    width: 100%;
    background: #eeeeee;
    border-bottom: 1px #eeeeee solid;
    border-radius: 5px;

  /*------表单搜索-----*/
  .form-search {
    width: calc(100% - 60px);
    margin: 17px 15px;
    padding: 15px;
    background: #fff;
    border-radius: @contentBorderRadius;
    box-shadow: @contentBoxShadow;

  .el-form-item {
    margin-bottom: 10px;
  }

  }
  .table-content {
    margin: 0 15px;

  .order_tabs {
    padding: 5px 10px;
  }

  }

  .white {
    background: #ffffff;
  }

  .goods-img {
    width: 100px;
    display: inline-block;
    background: #ffffff;
  }

  .goods-info {
    width: 214px;
    display: inline-block;

  span {
    float: left;
    margin-left: 10px;
    width: 100%;
    display: block;
  }

  }
  .pages_footer {
    padding: 10px;
    text-align: center;
  }

  .form-item {
    margin-bottom: 20px;
  }

  .form-search {
    margin: 15px;
  }

  }
</style>
