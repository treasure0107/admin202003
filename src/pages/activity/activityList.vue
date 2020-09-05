<template>
  <div class="content">
    <div class="pages-header">
      <div>活动模板列表</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="add_activity()">添加模板</el-button>
    </div>
    <div class="table-content">
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="activity_id" label="活动ID" ></el-table-column>
        <el-table-column prop="activity_name" label="活动名称" ></el-table-column>
        <el-table-column prop="pc_navigation_map" label="PC楼层导航图" >
          <template slot-scope="scope">
              <preview-image :key="scope.$index" :image="scope.row.pc_navigation_map" height="50px"></preview-image>
          </template>
        </el-table-column>
        <el-table-column prop="pc_head" label="pc专题头图">
          <template slot-scope="scope">
            <preview-image :key="scope.$index" :image="scope.row.pc_head" height="50px"></preview-image>
          </template>
        </el-table-column>
        <el-table-column prop="mobile_head" label="移动专题头图">
          <template slot-scope="scope">
            <preview-image :key="scope.$index" :image="scope.row.mobile_head" height="50px"></preview-image>
          </template>
        </el-table-column>
        <el-table-column prop="coupons_number" label="可领优惠券数"></el-table-column>
        <el-table-column prop="floor_number" label="楼层数"></el-table-column>
        <el-table-column prop="shop_number" label="推荐店铺数"></el-table-column>
        <el-table-column prop="special_base_map" label="底部图片">
          <template slot-scope="scope">
            <preview-image :key="scope.$index" :image="scope.row.special_base_map" height="50px"></preview-image>
          </template>
        </el-table-column>
        <el-table-column prop="shop_recommendation" label="店铺推荐图">
          <template slot-scope="scope">
            <preview-image :key="scope.$index" :image="scope.row.shop_recommendation" height="50px"></preview-image>
          </template>
        </el-table-column>
        <el-table-column prop="background_color" label="专题页背景图值"></el-table-column>
        <el-table-column prop="" label="操作" width="300px">
          <template slot-scope="scope" fixed="right" >
            <el-tooltip class="item" effect="dark" content="H5 链接" placement="top-start">
              <el-button  class="copy-link" icon="el-icon-link" type="success" circle size="mini" @click="copyLink(scope.row.activity_id,'H5')" :data-clipboard-text=TextLink></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="PC 链接" placement="top-start">
              <el-button class="copy-link" icon="el-icon-connection" type="success" circle size="mini" @click="copyLink(scope.row.activity_id,'PC')" :data-clipboard-text=TextLink></el-button>
            </el-tooltip>
            <el-button size="mini" @click="clickJump({ path:'/activity/activityFloor?activity_id='+scope.row.activity_id })" >楼层列表</el-button>
            <el-button size="mini"  @click="editActivity(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-page">
        <div class="block">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--添加修改-->
    <el-dialog :title="form.activity_id ? '修改活动模板' : '添加活动模板'":visible.sync="showEdit" width="70%">
      <el-form ref="form" :model="form" :rules="rules"  tatus-icon label-width="120px">
        <el-form-item label="活动名称" prop="activity_name" >
          <el-input  v-model="form.activity_name"  maxlength="30" show-word-limit ></el-input>
        </el-form-item>
        <el-form-item label="专题页头图" prop="pc_head">
          <upload-img @uploaded="uploaded" :keystr="'pc_head'"></upload-img>
          <img v-if="form.pc_head" :src="form.pc_head" height="100px"  class="avatar">
        </el-form-item>
        <el-form-item label="专题页头图(移动端)" prop="mobile_head">
          <upload-img @uploaded="uploaded" :keystr="'mobile_head'"></upload-img>
          <img  :src="form.mobile_head" height="100px" class="avatar" style="max-height:200px;margin-top: 15px">
        </el-form-item>
        <el-form-item label="是否使用优惠券" prop="is_coupon">
          <template>
            <el-radio v-model="use_coupon" @change="setCouponChange" label="0">是</el-radio>
            <el-radio v-model="use_coupon" @change="setCouponChange"  label="1">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item v-if="use_coupon==0" label="已选优惠券ID" prop="shop_id_list">
             <span v-for="(item,i) in coupon_ids">
              {{item}}
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCouponId(i)" circle></el-button>
            </span>
        </el-form-item>
        <el-form-item v-if="use_coupon==0">
          <el-button type="primary" title="选择优惠券"  @click="check_coupon()">新增优惠券</el-button>
          <el-dialog :visible.sync="showCoupon" append-to-body width="60%">
            <el-form>
              <div class="form-search">
                <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline" label-width="100px">
                  <el-row>
                    <el-form-item label="优惠券名称" prop="coupon_name">
                      <el-input v-model="searchForm.coupon_name" placeholder="优惠券名称" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="领取时间" prop="receive_time">
                      <el-date-picker
                        v-model="searchForm.receive_time"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm:ss"
                        style="width: 400px"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="发送方式" prop="receive_way">
                      <el-select
                        suffix-icon="el-icon-search"
                        v-model="searchForm.receive_way"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请选择"
                        @change="receiveWay"
                        style="width: 300px">
                        <el-option
                          v-for="(item,index) in receive_way"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item label="优惠券类型" prop="coupon_type">
                      <el-select
                        suffix-icon="el-icon-search"
                        v-model="searchForm.coupon_type"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请选择"
                        @change="couponType"
                        style="width: 300px;">
                        <el-option
                          v-for="(item,index) in coupon_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="使用时间" prop="use_time">
                      <el-date-picker
                        v-model="searchForm.use_time"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="timestamp"
                        style="width: 400px"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button style="margin-left: 30px;" type="primary" @click="searchList()" >筛选</el-button>
                      <el-button @click="resetForm1('searchForm')">清空筛选</el-button>
                    </el-form-item>
                  </el-row>
                </el-form>
              </div>
              <div>
                <el-table  ref="multipleTable1" :height="tableHeight" :data="couponData" @selection-change="handleSelectionChange1">
                  <el-table-column type="selection" width="50"></el-table-column>
                  <el-table-column prop="coupon_id" fixed label="序号" width="100"></el-table-column>
                  <el-table-column prop="coupon_name" label="优惠券名称" width="200" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="coupon_type" label="优惠券类型" width="100">
                    <template slot-scope="scope">
                      <label v-if="scope.row.coupon_type == 0">满减</label>
                      <label v-if="scope.row.coupon_type == 1">折扣</label>
                    </template>
                  </el-table-column>
                  <el-table-column prop="use_requirement" label="使用条件" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <label v-if="scope.row.use_requirement == 0 && scope.row.coupon_type == 0">满{{scope.row.start_price}}, 减{{scope.row.discount_price}}</label>
                      <label v-if="scope.row.use_requirement == 1 && scope.row.coupon_type == 0">满{{scope.row.start_price}}, 减{{scope.row.discount_price}}, 最多减{{scope.row.most_offer}}</label>
                      <label v-if="scope.row.coupon_type == 1">满{{scope.row.start_price}}, 折{{scope.row.discount_price}}, 最多折{{scope.row.most_offer}}</label>
                    </template>
                  </el-table-column>
                  <el-table-column prop="quantity" label="发行量" width="100"></el-table-column>
                  <!--         <el-table-column prop="coupon_receive_num" label="领取量" width="100"></el-table-column>
                           <el-table-column prop="coupon_use_num" label="使用量" width="100"></el-table-column>-->
                  <el-table-column prop="requirement" label="领取条件" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <label v-if="scope.row.requirement == 0">无条件</label>
                      <label v-if="scope.row.requirement == 1">按任务赠送</label>
                      <label v-if="scope.row.requirement == 2">按消费金额赠送</label>
                      <label v-if="scope.row.requirement == 3">按用户赠送</label>
                    </template>
                  </el-table-column>
                  <el-table-column prop="receive_way" label="发放方式" width="100">
                    <template slot-scope="scope">
                      <label v-if="scope.row.receive_way == 0">系统发放</label>
                      <label v-if="scope.row.receive_way == 1">用户领取</label>
                    </template>
                  </el-table-column>
                  <el-table-column  label="使用范围" width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <label v-if="scope.row.use_limit_type == 0">全平台使用</label>
                      <label v-if="scope.row.use_limit_type == 1">某店铺使用</label>
                    </template>
                  </el-table-column>
                  <el-table-column label="领取时间" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div style="width: 180px;">{{scope.row.receive_start_time | formatDate}}</div>
                      <div style="width: 180px;">{{scope.row.receive_end_time | formatDate}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="使用时间" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div style="width: 180px;" v-if="scope.row.use_time_type_id === 0">{{scope.row.use_start_time | formatDate}}</div>
                      <div style="width: 180px;" v-if="scope.row.use_time_type_id === 0">{{scope.row.use_end_time | formatDate}}</div>
                      <div style="width: 180px;" v-if="scope.row.use_time_type_id === 1">{{scope.row.use_days_time/86400}}天</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="goods_status" label="优惠券状态" width="120">
                    <template slot-scope="scope">
                      <label v-if="scope.row.coupons_status == 1">进行中</label>
                      <label v-if="scope.row.coupons_status == 2">未开始</label>
                      <label v-if="scope.row.coupons_status == 3">结束</label>
                      <label v-if="scope.row.coupons_status == 4">草稿</label>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="table-page">
                  <div class="block">
                    <el-pagination
                      background
                      @size-change="handleSizeChange1"
                      @current-change="handleCurrentChange1"
                      :current-page="pageNo1"
                      :page-sizes="pageSizes1"
                      :page-size="pageSize1"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total1">
                    </el-pagination>
                  </div>
                </div>
              </div>
              <el-form-item>
                <el-button type="primary" @click="submit_coupon()">确定</el-button>
                <el-button @click="showCoupon=false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-form-item>
        <el-form-item label="是否推荐店铺" prop="is_shop">
          <el-radio v-model="set_shop"  @change="setShopChange"  label="0">是</el-radio>
          <el-radio v-model="set_shop" @change="setShopChange"  label="1">否</el-radio>
        </el-form-item>
        <el-form-item v-if="set_shop==0"  label="已选店铺ID" prop="coupon_id_list">
            <span v-for="(shop,key) in shop_ids">
              {{shop}}
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteShopId(key)" circle></el-button>
            </span>
        </el-form-item>
        <el-form-item v-if="set_shop==0" >
          <el-button type="primary" @click="check_shop()">新增推荐店铺</el-button>
          <el-dialog :visible.sync="showShop" append-to-body title="选择店铺" width="60%">
            <el-form>
              <div class="form-search">
                <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item label="店铺名称" prop="shop_name">
                    <el-input v-model="formInline.shop_name" placeholder="店铺名称" size="mini"></el-input>
                  </el-form-item>
                  <el-form-item label="公司名称" prop="company_name">
                    <el-input v-model="formInline.company_name" placeholder="公司名称" size="mini"></el-input>
                  </el-form-item>
                  <el-form-item label="店铺类型" prop="open_status">
                    <el-select v-model="formInline.open_status" size="mini">
                      <el-option
                        v-for="(item,index) in openStatusOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="店铺等级" prop="rank_status">
                    <el-select v-model="formInline.rank_status" size="mini">
                      <el-option
                        v-for="(item,index) in rankStatusOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="任务完成情况" prop="task_status">
                    <el-select v-model="formInline.task_status" size="mini">
                      <el-option label="已完成" value="1"></el-option>
                      <el-option label="未完成" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="入驻时间" prop="create_time">
                    <el-date-picker
                      v-model="formInline.create_time"
                      value-format="yyyy-MM-dd"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      size="mini">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">筛选</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="text" size="mini" @click="resetForm2('formInline')">清空筛选条件</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="table-content">
                <el-table :data="shopData.result" :height="tableHeight" ref="multipleTable"  style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange2">
                  <el-table-column type="selection"  selected="true" width="50"></el-table-column>
                  <el-table-column prop="shop_id" label="序号" width="50"></el-table-column>
                  <el-table-column label="店铺名称/类型">
                    <template slot-scope="scope">
                      <p>{{ scope.row.shop_name }}</p>
                      <p>{{ openStatus[scope.row.open_status] }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="company_name" label="公司名称"></el-table-column>
                  <el-table-column prop="rank_status" label="店铺等级">
                    <template slot-scope="scope">
                      {{ rankStatus[scope.row.rank_status] }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="create_time" label="入驻时间" width="155"></el-table-column>
                  <el-table-column prop="create_time" label="店铺状态">
                    <template slot-scope="scope">
                      <span :class="scope.row.shop_close == 1?'icon-correct':'icon-error'">{{ shopClose[scope.row.shop_close] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="table-page">
                  <div class="block">
                    <el-pagination
                      background
                      @size-change="handleSizeChange2"
                      @current-change="handleCurrentChang2"
                      :current-page="shopData.current_pages"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="formInline.size"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="shopData.count">
                    </el-pagination>
                  </div>
                </div>
              </div>
              <el-form-item>
                <el-button type="primary" @click="submit_shop()">确定</el-button>
                <el-button @click="showShop=false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-form-item>
        <el-form-item v-if="set_shop==0"  label="店铺推荐图(选是必传)" prop="shop_recommendation">
          <upload-img @uploaded="uploaded" :keystr="'shop_recommendation'"></upload-img>
          <img v-if="form.shop_recommendation && set_shop==0" :src="form.shop_recommendation" height="100px" class="avatar" style="max-height:200px;margin-top: 15px">
        </el-form-item>
        <el-form-item label="pc楼层导航图" prop="pc_navigation_map">
          <upload-img @uploaded="uploaded"  :keystr="'pc_navigation_map'"></upload-img>
          <img v-if="form.pc_navigation_map" :src="form.pc_navigation_map" height="100px" class="avatar" style="max-height:200px;margin-top: 15px">
        </el-form-item>
        <el-form-item label="专题页底图" prop="special_base_map">
          <upload-img @uploaded="uploaded" :keystr="'special_base_map'"></upload-img>
          <img v-if="form.special_base_map" :src="form.special_base_map" height="100px" class="avatar" style="max-height:200px;margin-top: 15px">
        </el-form-item>
        <el-form-item label="专题页背景图值" prop="background_color" >
          <el-input    type="text" v-model="form.background_color" placeholder="如 #99999" ></el-input>
        </el-form-item>
        分享活动落地页内容设置
        <el-form-item label="主标题" prop="main_title" >
          <el-input    type="textarea" v-model="form.main_title"  maxlength="50" show-word-limit   ></el-input>
        </el-form-item>
        <el-form-item label="副文案" prop="subheading" >
          <el-input   type="textarea" v-model="form.subheading"   maxlength="60" show-word-limit  ></el-input>
        </el-form-item>
        <el-form-item label="图标icon" prop="share_icon">
          <upload-img @uploaded="uploaded"  :keystr="'share_icon'"></upload-img>
          <img v-if="form.share_icon" :src="form.share_icon" height="100px" class="avatar" style="max-height:200px;margin-top: 15px">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add_edit_activity('form')">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加修改-->
  </div>

</template>

<script>
  import Clipboard from 'clipboard'
  import UploadImg from '@/components/UplodaImg'
  import PreviewImage from '../../components/PreviewImage'
  import { AFTER_TYPE, AFTER_STATUS } from "../../config/order";
  import { RANK_STATUS, SHOP_CLOSE, OPEN_STATUS, RANK_STATUS_OPTION, SHOP_CLOSE_OPTION, OPEN_STATUS_OPTION } from "../../config/seller";

  export default {
    data() {
      return {
        tableHeight: window.innerHeight * 0.9,
        pageNo: 1,
        pageSizes: [5, 30, 50],
        pageSize: 10,
        total: 0,
        pageNo1: 1,
        pageSizes1:[10,20,50],
        pageSize1:10,
        total1:0,
        pageNo2: 1,
        pageSizes2:[10,20,50],
        pageSize2:10,
        total2:0,
        couponData: [],
        tableData: [],
        showEdit:false,
        showShop:false,
        showCoupon:false,
        searchForm:{
          receive_time:'',
          use_time:'',
          coupon_name:'',
          coupon_type:'',
          receive_way:'',
          platform:['1','2','3','4'],
          platforms:'',
        },
        use_coupon:'1',
        set_shop:'1',
        ppy_host:CUSTOM_CONFIG.PPY_HOST,
        activeName: 'all',
        afterType: AFTER_TYPE,
        afterStatus: AFTER_STATUS,
        rankStatus: RANK_STATUS,
        shopClose: SHOP_CLOSE,
        openStatus: OPEN_STATUS,
        rankStatusOption: RANK_STATUS_OPTION,
        shopCloseOption: SHOP_CLOSE_OPTION,
        openStatusOption: OPEN_STATUS_OPTION,
        shopData: {
          total_pages: 0,
          count: 0,
          current_pages: 1,
          result: []
        },
        loading: false,
        shop_ids:[],
        coupon_ids:[],
        formInline:{
          shop_name: '',
          user: '',
          open_status: '',
          company_name: '',
          shop_close: 1,
          rank_status: '',
          task_status: '',
          create_time: [],
          size: 10,
          page: 1
        },
        coupon_type:[
          {
            value: '',
            label: '请选择'
          },
          {
            value: '0',
            label: '满减'
          },
          {
            value: '1',
            label: '折扣'
          },
        ],
        receive_way:[
          {
            value: '',
            label: '请选择'
          },
          {
            value: '0',
            label: '系统发放'
          },
          {
            value: '1',
            label: '用户领取'
          },
        ],
        searchForm:{
          receive_time:'',
          use_time:'',
          coupon_name:'',
          coupon_type:'',
          receive_way:'',
          platform:['1','2','3','4'],
          platforms:'',
        },
        CouponLink:'',
        LinkParam:'',
        TextLink:'',
        form:{
          activity_id:'',
          activity_name:'',
          coupon_id_list:'',
          shop_id_list:'',
          is_coupon:'1',
          is_shop:'1',
          main_title:'',
          subheading:'',
          pc_head:'',
          mobile_head:'',
          pc_navigation_map:'',
          special_base_map:'',
          shop_recommendation:'',
          background_color:'',
          share_icon:'',
        },
        rules:{
          activity_name: [
            {required: true, message: '请填写活动名称', trigger: 'blur'},
          ],
          pc_head: [
            {required: true, message: '请上传pc专题页头图', trigger: 'blur'}
          ],
          mobile_head: [
            {required: true, message: '请上传移动端专题页头图', trigger: 'blur'}
          ],
          pc_navigation_map: [
            {required: true, message: '请上传pc楼层导航图', trigger: 'blur'}
          ],
          special_base_map: [
            {required: true, message: '请上传专题页底图', trigger: 'blur'}
          ],
          background_color: [
            {required: true, message: '请填写专题页背景图值', trigger: 'blur'}
          ],
          main_title: [
            {required: true, message: '请填写分享主标题', trigger: 'blur'}
          ],
          subheading: [
            {required: true, message: '请填写分享副文案',trigger: 'blur'}
          ],
          share_icon: [
            {required: true, message: '请上传分享图标icon', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      this.get_activity_list();
    },
    methods: {
      async handleCurrentChange(val) {
        this.pageNo = val;
        this.get_activity_list()
      },
      async handleSizeChange(val) {
        this.pageSize = val;
        this.get_activity_list()
      },
      clickJump(url){
        this.$router.push(url)
      },
      async get_activity_list() {
        let res = await this.$request.get(this.$API.common_api,
          {
            'page':this.pageNo,
            'size':this.pageSize,
          },'main',
          {
            router_path: 'activity/activityList',
            request_host:'CATEGORY_SERVER_HOST',
            handle_desc:'查看活动模板列表;'
          });
        console.log(res)
        this.tableData=res.data;
        this.total=res.total
      },
      resetForm2(formName) {
        this.$refs[formName].resetFields();
      },
      uploaded (data, key) {
        key === 'pc_head' && (this.form.pc_head = data.imageOssUrl);
        key === 'mobile_head' && (this.form.mobile_head = data.imageOssUrl);
        key === 'pc_navigation_map' && (this.form.pc_navigation_map = data.imageOssUrl);
        key === 'special_base_map' && (this.form.special_base_map = data.imageOssUrl);
        key === 'shop_recommendation' && (this.form.shop_recommendation = data.imageOssUrl);
        key === 'share_icon' && (this.form.share_icon = data.imageOssUrl);
      },
      resetForm1(formName) {
        this.searchForm.receive_time = '';
        this.searchForm.use_time = '';
        this.searchForm.coupon_name = '';
        this.searchForm.coupon_type = '';
        this.searchForm.receive_way = '';
        this.searchForm.platform = [];
        this.searchForm.platforms = '';
        this.couponList();
      },
      async searchList(){
        this.couponList();
      },
      check_coupon(){
        this.showCoupon=true;
        this.couponList()
      },

      submit_coupon(){
        console.log(this.coupon_ids);
        if(this.coupon_ids.length>0){
          this.form.coupon_id_list=this.coupon_ids.join(',')
        }
        this.showCoupon=false;
      },
      async couponType(val){
        this.searchForm.coupon_type = val;
      },
      async receiveWay(val){
        this.searchForm.receive_way = val;
      },

      async handleSizeChange1(val) {
        this.pageSize1 = val;
        this.couponList()
      },
      async handleCurrentChange1(val) {
        this.pageNo1=val;
        this.couponList()
      },
      async handleSelectionChange1(coupons) {
        this.coupon_ids = [];
        if(coupons.length != 0){
          coupons.forEach((item) => {
            this.coupon_ids.push(item.coupon_id)
          })
        }
      },

      onSubmit() {
        this.formInline.page = 1
        this.shop_list(this.formInline)
      },
      handleSizeChange2(val) {
        this.formInline.size = val
        this.shop_list(this.formInline)
      },
      deleteCouponId(index){
        this.coupon_ids.splice(index,1)
      },
      deleteShopId(index){

        this.shop_ids.splice(index,1)
      },
      handleCurrentChang2(val) {
        this.formInline.page = val
        this.shop_list(this.formInline)
      },

      handleSelectionChange2(shops) {
        console.log(shops);
        if(shops.length != 0){
          shops.forEach((item) => {
            if(this.shop_ids.indexOf(item.shop_id)==-1){
              this.shop_ids.push(item.shop_id)
            }
          })
        }
      },

      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },

      check_shop(){
        this.showShop=true;
        this.shop_list(this.formInline)
      },
      submit_shop(){
        console.log(this.shop_ids);
        if(this.shop_ids.length>0){
          this.form.shop_id_list=this.shop_ids.join(',')
        }
        this.showShop=false;
      },


      async couponList(){
        let use_start_time = this.searchForm.use_time ? this.searchForm.use_time[0] / 1000 : '';//使用时间开始
        let use_end_time = this.searchForm.use_time ? this.searchForm.use_time[1] / 1000 : '';//使用时间结束
        let receive_start_time = this.searchForm.receive_time ? this.searchForm.receive_time[0] / 1000 : '';//使用时间开始
        let receive_end_time = this.searchForm.receive_time ? this.searchForm.receive_time[1] / 1000  : '';//使用时间结束
        let param = {
          'page':this.pageNo1 ? this.pageNo1 : 1,
          'size':this.pageSize1 ? this.pageSize1 : 10,
          'receive_start_time':receive_start_time,
          'receive_end_time':receive_end_time,
          'use_start_time':use_start_time,
          'use_end_time':use_end_time,
          'coupon_name': this.searchForm.coupon_name,
          'receive_way': this.searchForm.receive_way,
          'platform': this.searchForm.platforms.length > 0 ? this.searchForm.platforms.join(',') : '',
          'coupon_type':this.searchForm.coupon_type
        };

        let result = await this.$request.request(this.$API.coupon_server_list,param, 'main', 'GET',{handle_desc:""});

        this.downloadhost = result.downloadhost;
        this.couponData = result.data.data;
        let that = this;
        console.log(this.coupon_ids);
        this.couponData.forEach((item,index)=>{
          if(this.coupon_ids.indexOf(item.coupon_id)!=-1){
            that.$nextTick(()=>{
              that.$refs.multipleTable1.toggleRowSelection(item,true);
            })

          }
        });
        this.total1 = result.data.count;
      },
      async shop_list(parameter){
        this.loading = true
        let params =  JSON.parse(JSON.stringify(parameter))
        if(params.create_time && params.create_time.length == 2){
          params.start_date = params.create_time[0]
          params.end_date = params.create_time[1]
          delete params.create_time
        }
        if(parameter.user){
          let user_param = {}
          if(this.isPhone(parameter.user)){
            user_param = { 'mobile': parameter.user }
          }else if(this.isEmail(parameter.user)){
            user_param = { 'email': parameter.user }
          }else{
            this.shopData= {
              total_pages: 0,
              count: 0,
              current_pages: 1,
              result: []
            };
            this.loading = false
            return false
          }
        }
        let data = await this.$request.get(this.$API.common_api,params,'main',{
          router_path: 'seller/shops',
          request_host: 'APP_SELLER_SERVER_HOST',
          handle_desc: ''
        });
        if( data.code == 200 ){
          this.shopData = data.data;

        }

        let that = this;
        this.shopData.result.forEach((item,index)=>{
          if(this.shop_ids.indexOf(item.shop_id)!=-1){
            that.$nextTick(()=>{
              that.$refs.multipleTable.toggleRowSelection(item,true);
            });
          }
        });
        this.loading = false
      },

      editActivity(data){
        this.showEdit = true;
        this.$nextTick(()=>{
          this.$refs.form.clearValidate();
          let rowData = JSON.parse(JSON.stringify(data));
          this.form = rowData;
          this.use_coupon= rowData.is_coupon==0?'0':'1';
          this.set_shop= rowData.is_shop==0?'0':'1';
          if(this.form.coupon_id_list!=''){
            let coupon_ids=JSON.parse(JSON.stringify(this.form.coupon_id_list));
            this.coupon_ids = coupon_ids.split(',').map(s=>+s);
          }
          if(this.form.shop_id_list!=''){
            let shop_ids=JSON.parse(JSON.stringify(this.form.shop_id_list));
            this.shop_ids = shop_ids.split(',').map(s=>+s);
          }
        });
      },
      add_activity(){
        this.showEdit = true;
        this.$nextTick(()=>{
          this.shop_ids=[];
          this.coupon_ids=[];
          this.form.activity_id='',
          this.form.activity_name='',
          this.form.coupon_id_list='',
          this.form.shop_id_list='',
          this.form.is_coupon='1',
          this.form.is_shop='1',
          this.form.main_title='',
          this.form.subheading='',
          this.form.pc_head='',
          this.form.mobile_head='',
          this.form.pc_navigation_map='',
          this.form.shop_recommendation='',
          this.form.special_base_map='',
          this.form.background_color='',
          this.form.share_icon=''

        });
      },
      async add_edit_activity(form){
        this.$refs[form].validate(async (valid) => {
          if(valid){
            let param=this.form;
            if(param.is_coupon=='0' || param.is_coupon==0){
              if(this.coupon_ids.length>0){
                param.coupon_id_list=this.coupon_ids.join(',')
              }else{
                SendMessage({
                  message:'请选择优惠券',
                  type:'error'
                });
                return false
              }
            }
            if(param.is_shop==0){
              if(this.shop_ids.length>0){
                param.shop_id_list=this.shop_ids.join(',')
              }else{
                SendMessage({
                  message:'请选择推荐店铺',
                  type:'error'
                });
                return false
              }
              if(param.shop_recommendation==''){
                SendMessage({
                  message:'请上传店铺推荐图',
                  type:'error'
                });
                return false
              }
            }
            let type = this.form.activity_id?'PUT':'POST';
            let handle_desc = this.form.activity_id?'编辑活动模板;'+this.form.activity_id:'新增活动模板';
            let router_path = this.form.activity_id?'activity/editActivity':'activity/addActivity';
            let extra_url = this.form.activity_id?`?activity_id=${this.form.activity_id}`:'';
            let result = await this.$request.request(this.$API.common_api,param, 'main', type,
              {
                router_path: router_path,
                request_host: 'CATEGORY_SERVER_HOST',
                handle_desc:handle_desc,
                extra_url: extra_url,
              }
            );
            if(result.code==200){
              SendMessage({
                message:'操作成功',
                type:'success'
              });
              this.showEdit=false;
              this.get_activity_list();
            }else{
              SendMessage({
                message:'操作失败，请稍后重试',
                type:'error'
              });
            }
          }
        });

      },

      setShopChange(val){
        this.is_shop=val;
        this.form.is_shop=parseInt(val);
        if(this.form.is_shop==1){
          this.form.shop_id_list='';
        }
      },
      setCouponChange(val){
        console.log(val);
        this.use_coupon=val;
        this.form.is_coupon=parseInt(val);
        if(this.form.is_coupon==1){
          this.form.coupon_id_list='';
        }
      },
      async copyLink(activity_id,type){
        console.log(type);
        this.CouponLink = type === 'PC' ?  CUSTOM_CONFIG.PPY_HOST : CUSTOM_CONFIG.H5_HOST;
        this.LinkParam  = type === 'PC' ? '/customer/activity/'+activity_id : '/activity/'+activity_id;
        this.TextLink = this.CouponLink + this.LinkParam;
        let clipboard = new Clipboard('.copy-link');
        clipboard.on('success', e => {
          SendMessage({message: '链接复制成功', type: 'success'});
          this.LinkParam = '';
          clipboard.destroy()
        });
        clipboard.on('error', e => {
          SendMessage({message: '此浏览器不支持自动复制！', type: 'error'});
          clipboard.destroy()
        });
      },
    },
    filters:{
      filterT(str){
        if(str){
          return str.replace('T', ' ')
        }else{
          return  '';
        }

      },
      formatDate(time) {
        let times = time * 1000;
        let date = new Date(times);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s
      }
    },
    components: {
      UploadImg,
      PreviewImage,
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/pageHeader";

  .content-cont {
    width: calc(~"100% - 30px");
    margin: 15px;
    min-height: 10px;
    background: #ffffff;
  }

</style>
