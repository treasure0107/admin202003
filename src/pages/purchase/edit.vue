<template>
  <div class="table-content">
    <div style="padding: 5px 0 10px 0">
      <el-page-header @back="$router.back(-1)" content="">
      </el-page-header>
    </div>
    <el-form label-width="80px">
      <div class="list-info">
        <div class="list-info-item" style="width: 100%">
          <div class="item-left">采购单号</div>
          <div class="item-right">{{dataInfo.PurchaseSn}}</div>
        </div>
        <div class="list-info-item" style="width: 100%">
          <div class="item-left">采购会员</div>
          <div class="item-right">
            {{User ? (User.Mobile + ' | ') : ''}}
            {{User ? User.Email : ''}}
          </div>
        </div>

        <el-form-item label="收货人">
          <el-input v-model="dataInfo.AddressInfo.consignee" disabled v-if="dataInfo.AddressInfo"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="dataInfo.AddressInfo.mobile" disabled v-if="dataInfo.AddressInfo"></el-input>
        </el-form-item>

        <div class="list-info-item" style="width: calc(100% - 250px)">
          <div class="item-left">收货信息</div>
          <div class="item-right user-info">
            <div>
              {{dataInfo.AddressInfo ?
              dataInfo.AddressInfo.province_id.split('_')[1]+dataInfo.AddressInfo.city_id.split('_')[1]+dataInfo.AddressInfo.area_id.split('_')[1]+dataInfo.AddressInfo.address
              : ''}}
            </div>
          </div>
        </div>
        <!--
                <el-form-item label="城市信息">
                  <el-cascader-panel v-model="select_address" :options="addressList" :disabled="true" ></el-cascader-panel>
                </el-form-item>
        -->

        <el-form-item label="详细地址">
          <el-input v-model="dataInfo.AddressInfo.address" disabled v-if="dataInfo.AddressInfo"></el-input>
        </el-form-item>

        <div class="list-info-item" style="width: 100%">
          <div class="item-left">采购商品</div>
          <div class="item-right">{{dataInfo.GoodsName}}</div>
        </div>

        <el-form-item label="总数量">
          <el-input v-model="dataInfo.GoodsQty" type="number"></el-input>
        </el-form-item>

        <el-form-item label="交货日期">
          <el-date-picker
            v-model="dataInfo.DeliveryEndTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:00:00"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="报价截止">
          <el-date-picker
            v-model="dataInfo.QuotedEndTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:00:00"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>

        <div class="border-bottom"></div>


        <el-form-item label="物料名称">
          <el-input v-model="dataInfo.MaterielName"></el-input>
        </el-form-item>

        <div class="list-info-item" style="width: 100%">
          <div class="item-left">规格要求</div>
          <div class="item-right">
            <template v-if="actTemplage.SpCatId!='-1'">
              <template v-for="(item,index) in AttrName">
                <span style="margin-bottom: 5px;display: block">{{item}}</span>
              </template>
            </template>
            <template v-else>
              {{PurchaseListDesc}}
            </template>
            <el-button type="primary" size="mini" @click="openShowAttr" icon="el-icon-edit" circle></el-button>
          </div>
        </div>

        <div class="list-info-item" style="width: 100%">
          <div class="item-left">成品图片</div>
          <div class="item-right">
            <div v-for="(img,index) in dataInfo.GoodsPicture" style="float: left;margin-right: 10px">
              <div style="width: 100px">
                <preview-image :image="img.url" :height="'69px'" :key="'GoodsPicture'+index"
                               :width="'100px'"></preview-image>
                <el-button size="mini" type="danger" style="margin-left: 20px;margin-top: 5px"
                           @click="$delete(dataInfo.GoodsPicture,index)">删除
                </el-button>
              </div>
            </div>
            <div
              style="float: left;text-align: center;width: 120px;border: 1px #CCCCCC dashed;height: 100px;line-height: 100px">
              <upload @uploaded="uploadImg" :keystr="'GoodsPicture'"></upload>
            </div>
          </div>
        </div>

        <div class="list-info-item" style="width: 100%;margin: 20px 0">
          <div class="item-left">设计文件</div>
          <div class="item-right">

            <div class="file-items" v-for="(img,index) in dataInfo.Documents">
              {{img.imgName}}
              <el-button icon="el-icon-delete" size="mini" @click="$delete(dataInfo.Documents,index)" circle
                         style="margin-left: 5px">
              </el-button>
            </div>
            <div class="file-items" v-if="dataInfo.Documents && dataInfo.Documents.length<=0">
              <upload @uploaded="uploadImg" :keystr="'Documents'" :buttonSize="'mini'"></upload>
            </div>
          </div>
        </div>

        <el-form-item label="特别说明" style="display: inline-block;width: 100%;">
          <el-input type="textarea" v-model="dataInfo.SpecialNote" maxlength="500" rows="3"></el-input>
        </el-form-item>

        <el-form-item label="发票">
          <el-radio-group v-model="dataInfo.Invoice">
            <el-radio :label="index2" v-for="(item2,index2) in ['','普通发票','专用发票','不开发票']" v-if="index2!=0"
                      :key="index2">{{item2}}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="报价说明">
          <el-checkbox-group v-model="dataInfo.Include" v-if="dataInfo.PurchaseSn">
            <el-checkbox :label="index" v-for="(item,index) in ['含税','含运费','含打样','月结']" v-if="index!=0" :key="index">
              {{item}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="运费说明">
          <el-input type="textarea" v-model="dataInfo.ExpressDesc" maxlength="100" rows="3"></el-input>
        </el-form-item>

        <el-form-item label="包装要求">
          <el-input type="textarea" v-model="dataInfo.PackingRequirements" maxlength="100" rows="3"></el-input>
        </el-form-item>

        <el-form-item label="其它服务">
          <el-input type="textarea" v-model="dataInfo.OtherSupports" maxlength="200" rows="3"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="submitData(false)">保 存</el-button>
          <el-button type="primary" @click="submitData(true)">提 交</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-dialog
      title="规格要求" :visible.sync="showAttr" width="60%">
      <div class="dialog-list">
        <div class="dialog-list-items bottom-border">
          <div class="list-items-left">产品类别：</div>
          <div class="list-items-right">
            <span v-for="(item,index) in CatList" :key="index">{{(index==0 ? '' : '/')+item}}</span>
            <!--
                        {{actTemplage.CatName? actTemplage.CatName : ''}}
            -->
          </div>
        </div>
        <div v-if="actTemplage.SpCatId!='-1'">
          <div class="dialog-list-items">
            <div class="list-items-left">说明：</div>
            <div class="list-items-right" style="font-size: 12px;color: #999999">
              选择'自定义'时，请参照该属性可选值的格式规范输入，不能为空（单击选中，双击取消选择）
            </div>
          </div>
          <div class="dialog-list-items" v-for="(item,index) in actTemplage.Attr" :key="index">
            <div class="list-items-left"><span v-if="item.IsMust">*</span>{{item.AttrName}}：</div>
            <div class="list-items-right">
              <template v-for="(item2,index2) in item.AttrValues">
                <el-tag :type="actSelect[index][item2['Id']] ? 'default' : 'info'" :key="index2" v-if="!item2.Customize"
                        @click="selectAttr(index,item2['Id'])"
                        :effect="actSelect[index][item2['Id']]  ? 'dark' : 'plain'"
                        @dblclick.native="selectAttr(index,item2['Id'],true)">
                  {{item2.AttrValue}}
                </el-tag>
                <span class="default-input" v-else>
                  <el-input placeholder="自定义" maxlength="20" size="small" v-model="item2.AttrValue"
                            :class="actSelect[index][item2['Id']] && 'hover-input'"
                            @click.native="selectAttr(index,item2['Id'])"
                            @dblclick.native="selectAttr(index,item2['Id'],true)">
                  </el-input>
                </span>
              </template>
            </div>
          </div>
        </div>
        <div v-else>
          <el-input type="textarea" maxlength="500" placeholder="请输入产品类型，详细规格要求" rows="4"
                    v-model="actPurchaseListDesc"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAttr = false">取 消</el-button>
        <el-button type="primary" @click="confirmAttr">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator"
    import PreviewImage from '@/components/PreviewImage'
    import Upload from '@/components/UplodaImg'

    @Component({
        components: {PreviewImage, Upload}
    })
    export default class EditPurchaseComponent extends Vue {
        dataInfo: any = {};
        id: string = '';
        user: string = '';
        AttrName: any = [];
        showAttr: boolean = false;
        select: any = [];
        actSelect: ary = [];
        Template: any = [];
        actTemplage: any = [];
        PurchaseListDesc: string = '';
        actPurchaseListDesc: string = '';
        CatList: any = [];
        select_address: any = [];
        addressList: any = [];
        province: any = [];
        User: any = [];

        async mounted() {
            this.id = this.$route.query.id + '';
            this.user = this.$route.query.user + '';
            // this.address();
            this.purchaseInfo().then();
        }

        get purchaseStore() {
            return this.$vuexStore.state.menuData.purchase
        }


        async purchaseInfo(): Promise<void> {
            let {data} = await this.$request.get(this.$API.common_api, {
                quote_id: this.id,
                user_id: this.user
            }, 'main', {
                router_path: 'purchase/editInfo',
                request_host: 'PURCHASE_CATEGORY_HOST',
                handle_desc: `采购编辑详情;${this.id}`
            });
            let purchase = data.Purchase;
            let pro: string = purchase.AddressInfo.province_id.split('_')[0];
            let area: string = purchase.AddressInfo.area_id.split('_')[0];
            let city: string = purchase.AddressInfo.city_id.split('_')[0];
            this.select_address = [pro, city, area];
            // this.form.mobile = purchase.AddressInfo.mobile;
            // this.form.consignee = purchase.AddressInfo.consignee;
            // this.form.address = purchase.AddressInfo.address;
            // this.form.GoodsQty = purchase.GoodsQty;
            data.Purchase.DeliveryEndTime = this.$common.formatDate(purchase.DeliveryEndTime);
            data.Purchase.QuotedEndTime = this.$common.formatDate(purchase.QuotedEndTime);
            // this.form.MaterielName = purchase.MaterielName;
            // this.form.GoodsPicture = purchase.GoodsPicture;
            // this.form.Documents = purchase.Documents;
            // this.form.GoodsName = purchase.GoodsName;
            // this.form.SpecialNote = purchase.SpecialNote;
            // this.form.Invoice = purchase.Invoice;
            data.Purchase.Include = purchase.Include.length ? purchase.Include : [];
            this.dataInfo = data.Purchase;
            this.AttrName = data.AttrName;
            this.User = data.User;
            let defSelect = {};
            (purchase.NormsRequirement ? purchase.NormsRequirement : []).forEach((item, index) => {
                defSelect[item] = true;
            });
            let select = [];
            if (data.Template['SpCatId'] > 0) {
                data.Template['Attr'].forEach((item, index) => {
                    let isCu: boolean = false;
                    select[index] = {};
                    item['AttrValues'].forEach((item2, index2) => {
                        select[index][item2['Id']] = defSelect[item2['Id']] ? defSelect[item2['Id']] : false;
                        item2['Customize'] && (isCu = true);
                    });
                    if (!isCu && item.IsLimitUser) {
                        data.Template['Attr'][index]['AttrValues'].push({
                            AttrValue: "",
                            Customize: 1,
                            Id: -(index + 1),
                            PurchaseSn: "",
                            Sort: 0,
                            UnitTypeId: 0,
                            ValueId: -(index + 1),
                        });
                        select[index][-(index + 1)] = false;
                    }
                });
            }

            this.select = select;
            this.actSelect = JSON.parse(JSON.stringify(select));
            this.Template = data.Template;
            this.actTemplage = JSON.parse(JSON.stringify(data.Template));
            this.PurchaseListDesc = purchase.PurchaseListDesc;
            this.actPurchaseListDesc = JSON.parse(JSON.stringify(purchase.PurchaseListDesc));
            this.CatList = data.CatList;
        }

        openShowAttr() {
            this.actSelect = JSON.parse(JSON.stringify(this.select));
            this.actTemplage = JSON.parse(JSON.stringify(this.Template));
            this.actPurchaseListDesc = JSON.parse(JSON.stringify(this.PurchaseListDesc));
            this.showAttr = true;
        }

        selectAttr(index: number, id, dblclick = false) {
            let key = _.findKey(this.actSelect[index], (o) => {
                return o == true;
            });
            if (key != undefined && (!dblclick || (dblclick && this.actTemplage.Attr[index].IsMust != 1))) {
                this.actSelect[index][key] = false
            }
            (!dblclick) && (this.actSelect[index][id] = true);
        }

        confirmAttr() {
            let AttrName: any = [];
            let check = '';
            console.log(this.Template.SpCatId > 0);
            if (this.Template.SpCatId > 0) {
                this.actTemplage['Attr'].forEach((item, index) => {
                    let bixu: boolean = false;
                    for (let i = 0; i < item['AttrValues'].length; i++) {
                        if (this.actSelect[index][item['AttrValues'][i]['Id']]) {
                            if (item.IsMust && !item['AttrValues'][i]['AttrValue']) {
                                check = '请先填写完整规格';
                                break;
                            }
                            bixu = true;
                            AttrName.push(`${item['AttrName']}：${item['AttrValues'][i]['AttrValue']}`);
                            break;
                        }
                    }
                    if (item.IsMust && !bixu) {
                        check = '必须规格不能为空';
                        return false;
                    }
                });
            } else {
                this.actPurchaseListDesc == '' && (check = '规格说明不能为空');
            }
            if (check) {
                SendMessage({message: check, type: 'warning'});
                return false;
            }
            this.select = JSON.parse(JSON.stringify(this.actSelect));
            this.Template = JSON.parse(JSON.stringify(this.actTemplage));
            this.AttrName = AttrName;
            this.PurchaseListDesc = JSON.parse(JSON.stringify(this.actPurchaseListDesc));
            this.showAttr = false;
        }

        async submitData(submit) {
            let purchase = JSON.parse(JSON.stringify(this.dataInfo));
            let select = [];
            this.select.forEach((item, index) => {
                let key = _.findKey(this.select[index], (o) => {
                    return o == true;
                });
                key != undefined && select.push(parseInt(key));
            });

            //获取省市区
            const setAddress = () => {
                let province = 0,
                    city = 0,
                    district = 0;
                let address = JSON.parse(JSON.stringify(this.select_address));
                province = _.findIndex(this.addressList, (o) => {
                    return o.value == address[0]
                });
                if (province >= 0) {
                    address[0] += '_' + this.addressList[province].label;
                    city = _.findIndex(this.addressList[province].children, (o) => {
                        return o.value == address[1]
                    });
                    if (city >= 0) {
                        address[1] += '_' + this.addressList[province].children[city].label;
                        district = _.findIndex(this.addressList[province].children[city].children, (o) => {
                            return o.value == address[2]
                        });
                        district >= 0 && (address[2] += '_' + this.addressList[province].children[city].children[district].label)
                    }
                } else {
                    return {state: false, address: address}
                }
                return {state: true, address: address}
            };
            /*let {state, address} = setAddress();
            if (state) {
                purchase.AddressInfo['province_id'] = address[0] ? address[0] : '';
                purchase.AddressInfo['city_id'] = address[1] ? address[1] : '';
                purchase.AddressInfo['area_id'] = address[2] ? address[2] : '';
            }*/

            //时间戳
            purchase.DeliveryEndTime = new Date(purchase.DeliveryEndTime).getTime() / 1000;
            purchase.QuotedEndTime = new Date(purchase.QuotedEndTime).getTime() / 1000;
            purchase['NormsRequirement'] = select;
            purchase['PurchaseListDesc'] = this.PurchaseListDesc;

            //清楚自定义模版没有填写内容的
            let template = JSON.parse(JSON.stringify(this.Template));
            if (template.SpCatId > 0) {
                template.Attr.forEach((item, index) => {
                    item.AttrValues.forEach((item2, index2) => {
                        (!item2['AttrValue'] && item2['Id'] <= 0) && template.Attr[index]['AttrValues'].splice(index2, 1)
                    })
                })
            }

            if (template.SpCatId > 0 && template.Attr.length <= 0) {
                SendMessage({message: '规格不能为空', type: 'warning'});
                return false
            } else if (purchase['PurchaseListDesc'] == '' && template.SpCatId < 0) {
                SendMessage({message: '规格说明不能为空', type: 'warning'});
                return false;
            }
            console.log(template);
            // return  false;
            purchase.GoodsQty = parseInt(purchase.GoodsQty);
            let param: any = {
                Id: parseInt(this.id),
                BuyerId: parseInt(this.user),
                Template: template,
                Purchase: purchase
            };
            await this.$request.request(this.$API.common_api, param, 'main', 'PUT', {
                router_path: submit ? 'purchase/edit/submit' : 'purchase/edit/save',
                request_host: 'PURCHASE_CATEGORY_HOST',
                handle_desc: `${submit ? '提交' : '保存'}代编采购单;${this.id}`
            });
            SendMessage({type: 'success', message: '操作成功'});
            if (submit) {
                //左侧菜单采购单数量
                let num: number = this.purchaseStore >= 2 ? this.purchaseStore - 1 : 0;
                this.$vuexStore.commit('changeMenu', {field: 'purchase', value: num});
                this.$router.back(-1);
            } else {
                this.purchaseInfo().then();
            }
        }

        uploadImg(val, key) {
            let arr = {
                'url': val.imageOssUrl,
                'imgName': val['filename'],
                'id': '',
                'status': "done"
            };
            if (key === 'GoodsPicture') {
                this.dataInfo.GoodsPicture.push(arr)
            } else if (key === 'Documents') {
                this.dataInfo.Documents.push(arr)
            }
        }

        async address() {
            let {data} = await this.$request.get(this.$API.addressInfo);
            this.addressList = data;
        }

    }
</script>
<style lang="less" scoped>
  .list-info {
    width: 100%;
    min-height: 500px;
    display: inline-block;

    .list-info-item {
      font-size: 13px;
      float: left;
      margin-bottom: 22px;
      color: #333333;

      &:nth-child(1) {
        margin-top: 20px;
      }

      .item-left {
        text-align: right;
        width: 68px;
        padding-right: 12px;
        font-size: 14px;
        color: #606266;
        float: left;
      }

      .item-right {
        /*width: calc(~"100% - 150px");*/
        float: left;
        line-height: 22px;
        font-size: 14px;
        word-break: break-all;

        .file-items {
          width: auto;
          float: left;
          margin-left: 10px;

          &:first-child {
            margin-left: 0;
          }
        }

        .download {
          width: 60px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FFFFFF;
          border-radius: 5px;
          margin-top: 5px;
          background: #409EFF;
        }

        > a {
          margin-left: 10px;

          &:first-child {
            margin-left: 0;
          }
        }

        img {
          width: 50px;
          height: 80px;
        }
      }

      .user-info {
        > div {
          float: left;
          margin-left: 10px;
        }
      }
    }

    .border-bottom {
      border-bottom: 2px #CCCCCC dashed;
      width: 100%;
      margin: 50px 0;
      float: left;
    }
  }

  .dialog-list {
    width: 100%;
    display: inline-table;

    .dialog-list-items {
      width: 100%;
      padding: 10px 0;
      display: inline-table;

      .list-items-left {
        width: 150px;
        float: left;
        text-align: right;
        padding-right: 22px;

        > span {
          color: red;
          font-size: 15px;
          padding-right: 1px;
        }
      }

      .list-items-right {
        float: left;
        width: calc(~"100% - 172px");

        > span {
          margin-bottom: 10px;
          margin-right: 6px;
          cursor: pointer;
          -moz-user-select: none; /*火狐*/
          -webkit-user-select: none; /*webkit浏览器*/
          -ms-user-select: none; /*IE10*/
          -khtml-user-select: none; /*早期浏览器*/
          user-select: none;
        }

        .default-input {
          width: 120px;
          display: inline-block;

          .hover-input {
            input {
              border-color: #409EFF;
            }
          }
        }
      }
    }

    .bottom-border {
      margin: 10px 0;
      border-bottom: 1px #eeeeee solid;
    }
  }
</style>
<style lang="less">
  .default-input {
    .hover-input {
      .el-input__inner {
        background-color: #409eff;
        border-color: #409eff;
        color: #fff;
      }
    }

    .el-input__inner {
      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webkit浏览器*/
      -ms-user-select: none; /*IE10*/
      -khtml-user-select: none; /*早期浏览器*/
      user-select: none;
    }
  }

  .list-info .el-form-item {
    margin-bottom: 22px;
    display: table;
    width: 100%;
  }
</style>
