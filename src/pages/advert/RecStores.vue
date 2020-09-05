<template>
  <div class="content">
    <div class="pages-header">
      <div>推荐店铺</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">添加推荐</el-button>
    </div>
    <div class="table-content">
      <el-table :data="tableData" stripe style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column fixed prop="recommend_id" label="序号" width="150"></el-table-column>
        <el-table-column prop="shop_name" label="店铺名称" width="120"></el-table-column>
        <el-table-column prop="shop_url" label="跳转链接"></el-table-column>
        <el-table-column prop="order_id" label="排序值"></el-table-column>
        <el-table-column prop="is_show" label="状态">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-button type="success" size="mini" v-if="scope.row.is_show==0" plain>开启</el-button>
              <el-button type="info" size="mini" v-else plain>关闭</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="editRecShop(scope.$index)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="开启" placement="top" v-if="scope.row.is_show==1">
              <el-button type="success" icon="el-icon-check" size="mini" circle
                         @click="showRecShop(scope.row.recommend_id,0)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="关闭" placement="top" v-else>
              <el-button type="warning" icon="el-icon-minus" size="mini" circle
                         @click="showRecShop(scope.row.recommend_id,1)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" circle
                         @click="delRecShop(scope.row.recommend_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加修改-->
    <el-dialog title="添加店铺推荐" :visible.sync="showEdit" width="60%">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="店铺名称" prop="shop_name">
          <el-input v-model="form.shop_name"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="shop_url">
          <el-input v-model="form.shop_url"></el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input v-model="form.order_id" type="number"></el-input>
        </el-form-item>

        <el-form-item label="店铺图片" prop="shop_img">
          <upload-img @uploaded="uploaded"></upload-img>
          <img v-if="form.shop_img" :src="form.shop_img" class="avatar" style="max-width: 200px;margin-top: 10px">
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitData">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加修改-->

  </div>
</template>

<script>
    import UploadImg from '@/components/UplodaImg'

    export default {
        data () {
            return {
                showEdit: false,
                nowEdit: null,
                form: {
                    recommend_id: 0,
                    shop_name: '',
                    shop_url: '',
                    order_id: 0,
                    is_show: 0,
                    shop_img: 0,
                },
                tableData: [],
                rules: {
                    shop_name: [
                        {required: true, message: '店铺昵称必须', trigger: 'blur'},
                    ],
                    shop_url: [
                        {required: true, message: '店铺地址必须', trigger: 'blur'}
                    ],
                    shop_img: [
                        {required: true, message: '店铺图片必须', trigger: 'blur'}
                    ],
                }
            }
        },
        created () {
            this.shop_list()
        },
        methods: {
            async shop_list () {
                this.loading = true
                let {data} = await this.$request.get(this.$API.common_api, {}, 'main', {
                    router_path: 'common/recommendshop',
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: '推荐店铺列表;'
                })
                this.tableData = data
                this.loading = false
            },
            async delRecShop (id) {
                let {data} = await this.$request.request(this.$API.common_api, {}, 'main', 'DELETE', {
                    router_path: 'common/recommendshop',
                    request_host: 'CATEGORY_SERVER_HOST',
                    extra_url: `${id}/`,
                    handle_desc: `删除推荐店铺;${id}`
                })
                SendMessage({message: '删除成功', type: 'success'})
                this.shop_list()
            },
            async showRecShop (id, is_show) {
                let {data} = await this.$request.request(this.$API.common_api, {
                    is_show: is_show
                }, 'main', 'DELETE', {
                    router_path: is_show ? 'common/recommendshop/down' : 'common/recommendshop/up',
                    request_host: 'CATEGORY_SERVER_HOST',
                    extra_url: `${id}/`,
                    handle_desc: `${is_show ? '下架' : '下架'}推荐店铺;${id}`
                })
                SendMessage({message: is_show ? '下架成功' : '下架成功', type: 'success'})
                this.shop_list()
            },

            editRecShop (index) {
                let item = this.tableData[index]
                this.form = item
                this.showEdit = true
            },

            async submitData () {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let param = this.form

                        await this.$request.request(this.$API.common_api, param, 'main', this.form.recommend_id ? 'PUT' : 'POST', {
                            router_path: 'common/recommendshop',
                            request_host: 'CATEGORY_SERVER_HOST',
                            extra_url: this.form.recommend_id ? `${this.form.recommend_id}/` : '',
                            handle_desc: `${this.form.recommend_id ? '修改' : '添加'}推荐店铺;${this.form.recommend_id}`
                        })
                        SendMessage({message: this.form.recommend_id ? '编辑成功' : '添加成功', type: 'success'})
                        this.showEdit = false
                        this.form = {
                            recommend_id: 0,
                            shop_name: '',
                            shop_url: '',
                            order_id: 0,
                            is_show: 0,
                            shop_img: 0,
                        }
                        this.shop_list()
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },

            uploaded (data) {
                this.form.shop_img = data.imageOssUrl
            }
        },
        components: {
            UploadImg
        },
        watch: {
            showEdit (res) {
                if (!res) {
                    this.form = {
                        recommend_id: 0,
                        shop_name: '',
                        shop_url: '',
                        order_id: 0,
                        is_show: 0,
                        shop_img: 0,
                    }
                }
            }
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