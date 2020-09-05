<template>
  <div class="content">
    <div class="pages-header">
      <div>优选楼层</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">新建楼层</el-button>
    </div>
    <div class="table-content">
      <el-table :data="tableData" stripe style="width: 100%;min-height: 300px" v-loading="loading">
        <el-table-column fixed prop="floor_id" label="楼层ID" width="150"></el-table-column>
        <el-table-column prop="floor_name" label="楼层名称"></el-table-column>
        <el-table-column prop="advertising_picture" label="广告图片" width="180">
          <template slot-scope="scope">
            <preview-image :image="scope.row.advertising_picture" :height="'50px'" :key="scope.$index"></preview-image>
          </template>
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量"></el-table-column>
        <el-table-column prop="is_order" label="排序值" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.is_order" type="number" min="0"
                      @blur="(res)=>{editFloorOrder(scope.$index).then()}" placeholder="排序值"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="is_show" label="状态" width="200">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_show"
                       @change="(res)=>{changeSwitch(res,scope.row.floor_id,scope.$index)}">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="设置商品" placement="top">
              <el-button type="success" icon="el-icon-goods" size="mini"
                         @click="$router.push('/advert/youxuanGoods?id='+scope.row.floor_id)"
                         circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle
                         @click="editFloor(scope.$index)"></el-button>
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

      <el-dialog :title="form.floor_id ? '修改楼层' : '添加楼层'" :visible.sync="showEdit" width="40%">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="楼层名称" prop="floor_name" :rules="{required: true, message: '楼层名称不能为空', trigger: 'blur'}">
            <el-input v-model="form.floor_name"  maxlength="20" ></el-input>
          </el-form-item>

          <el-form-item label="广告图片" prop="advertising_picture"
                        :rules="{required: true, message: '广告图片不能为空', trigger: 'blur'}">
            <upload-img @uploaded="uploaded"></upload-img>
            <img v-if="form.advertising_picture" :src="form.advertising_picture" class="avatar" width="80">
            <div style="font-size: 12px;color: #ccc;">400*200px，大小不超过300K</div>
          </el-form-item>


          <el-form-item label="排序值" prop="is_order" placeholder="按从小到大排序，只允许输入数字"
                        :rules="{required: true, message: '排序值不能为空', trigger: 'blur'}">
            <el-input v-model="form.is_order" type="number"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitMini">立即提交</el-button>
            <el-button @click="showEdit=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator"
    import PreviewImage from '@/components/PreviewImage'
    import UploadImg from '@/components/UplodaImg'

    @Component({
        components: {PreviewImage, UploadImg}
    })

    export default class YouxuanFloorComponent extends Vue {
        showEdit: boolean = false;
        tableData: any = [];
        loading: boolean = false;
        form: any = {
            floor_name: "",
            advertising_picture: "",
            is_order: 1,
            is_show: 1
        };

        mounted() {
            this.getFloorList().then();
        }

        async getFloorList(): Promise<void> {
            this.loading = true;
            let {data} = await this.$request.get(this.$API.common_api, {}, 'main', {
                router_path: 'floor/youxuan',
                request_host: 'CATEGORY_SERVER_HOST',
                handle_desc: '优选楼层列表;'
            });
            data.forEach((item, index) => {
                data[index]['is_show'] = item['is_show'] == 1 || false;
            });
            this.loading = false;
            this.tableData = data;
        }

        async changeSwitch(res, floor_id, index) {
            this.loading = true;
            try {
                await this.$request.request(this.$API.common_api, {is_show: res ? 1 : 0}, 'main', 'DELETE', {
                    router_path: 'floor/youxuan/edit',
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: `${res ? '开启' : '关闭'}优选楼层;${floor_id}`,
                    extra_url: '?floor_id=' + floor_id
                });
                this.loading = false;
            } catch (e) {
                this.loading = false;
                SendMessage({message: '操作失败', type: 'error'});
                this.tableData[index]['is_show'] = !res;
            }
        }

        submitMini() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    await this.$request.request(this.$API.common_api, this.form, 'main', this.form.floor_id ? 'PUT' : 'POST', {
                        router_path: !this.form.floor_id ? 'floor/youxuan' : 'floor/youxuan/edit',
                        request_host: 'CATEGORY_SERVER_HOST',
                        handle_desc: this.form.floor_id ? `修改优选楼层${this.form.floor_id}` : '添加优选楼层',
                        extra_url: this.form.floor_id ? '?floor_id=' + this.form.floor_id : ''
                    });
                    SendMessage({message: '操作成功', type: 'success'});
                    this.getFloorList().then();
                    this.showEdit = false;
                }
            });
        }

        async editFloorOrder(index) {
            this.loading = true;
            let param = this.tableData[index];
            param['is_show'] = param['is_show'] ? 1 : 0;
            this.$request.request(this.$API.common_api, param, 'main', 'PUT', {
                router_path: 'floor/youxuan/edit',
                request_host: 'CATEGORY_SERVER_HOST',
                handle_desc: `修改优选楼层${param.floor_id}`,
                extra_url: '?floor_id=' + param.floor_id
            }).then(res=>{
                this.loading = false;
                SendMessage({message: '操作成功', type: 'success'});
                this.getFloorList().then();
            }).catch(e=>{
                this.loading = false;
            });
        }

        async deleteFloor(floor_id){
            if(await this.$common.confirmDialog(this,'是否删除该楼层，删除后不可恢复')){
                await this.$request.request(this.$API.common_api, {}, 'main', 'DELETE', {
                    router_path: 'floor/youxuan/remove',
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: `删除优选楼层;${floor_id}`,
                    extra_url: '?floor_id=' + floor_id
                });
                SendMessage({message: '操作成功', type: 'success'});
                this.getFloorList().then();
            }
        }

        editFloor(index) {
            this.form = JSON.parse(JSON.stringify(this.tableData[index]));
            this.form['is_show'] = this.form['is_show'] ? 1 : 0;
            this.showEdit = true;
        }

        uploaded(data, key) {
            this.form.advertising_picture = data.imageOssUrl
        }

        @Watch('showEdit', {immediate: true, deep: true})
        onPersonChanged(val: Person, oldVal: Person) {
            if (!val) {
                this.form = {
                    floor_name: "",
                    advertising_picture: "",
                    is_order: 1,
                    is_show: 1
                };
            }
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
  }

</style>