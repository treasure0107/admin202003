<template>
  <div class="content">
    <div class="pages-header">
      <div>优惠券管理</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="$router.push({name:'/coupon/addCouponinfo',query:{is_edit:0,is_add:1}})">添加优惠券</el-button>
    </div>
    <div class="content-cont table-content">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1" @click="activeIndexs('1')">平台优惠券</el-menu-item>
        <el-menu-item index="2" @click="activeIndexs('2')">店铺优惠券</el-menu-item>
      </el-menu>
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
            <!--<el-form-item label="使用平台" prop="platform">
              <el-checkbox-group v-model="searchForm.platform" @change="platformCheck">
                <el-checkbox label='1' style="width: 50px">PC</el-checkbox>
                <el-checkbox label='2' style="width: 50px">APP</el-checkbox>
                <el-checkbox label='3' style="width: 50px">H5</el-checkbox>
                <el-checkbox label='4' style="width: 50px">小程序</el-checkbox>
              </el-checkbox-group>
            </el-form-item>-->
            <el-form-item>
              <el-button style="margin-left: 30px;" type="primary" @click="searchList()" >筛选</el-button>
              <el-button @click="resetForm('searchForm')">清空筛选</el-button>
            </el-form-item>
        </el-row>
        </el-form>
      </div>
      <div>
        <el-table  ref="multipleTable" :height="tableHeight" :data="tableData">
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
          <el-table-column prop="coupon_receive_num" label="领取量" width="100"></el-table-column>
          <el-table-column prop="coupon_use_num" label="使用量" width="100"></el-table-column>
          <el-table-column prop="requirement" label="领取条件" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <label v-if="scope.row.requirement == 0">无条件</label>
              <label v-if="scope.row.requirement == 1">按消费金额赠送</label>
              <label v-if="scope.row.requirement == 2">按任务赠送</label>
              <label v-if="scope.row.requirement == 3">按用户赠送</label>
              <label v-if="scope.row.requirement == 4">按用户标签赠送</label>
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
          <el-table-column fixed="right" label="操作" width="280">
            <template slot-scope="scope">
              <el-row>
                <el-tooltip class="item" effect="dark" content="券码" placement="top-start">
                  <el-button  v-if="scope.row.is_draft === 0" class="copy-link" icon="el-icon-postcard"  circle size="mini" disabled="disabled" type="info"></el-button>
                  <el-button  v-if="scope.row.is_draft === 1 && scope.row.coupons_status != 2" class="copy-link"  :disabled="scope.row.exchange_code == 0 ? true : false" icon="el-icon-postcard"  circle type="info" size="mini" @click="copyLink(scope.row,'CODE')" :data-clipboard-text=TextLink></el-button>
                  <el-button  v-if="scope.row.is_draft === 1 && scope.row.coupons_status == 2" disabled="disabled" class="copy-link" icon="el-icon-postcard" type="info" circle size="mini"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="H5 链接" placement="top-start">
                  <el-button  v-if="scope.row.is_draft === 0" class="copy-link" icon="el-icon-link" type="info" circle size="mini" disabled="disabled"></el-button>
                  <el-button  v-if="scope.row.is_draft === 1 && scope.row.coupons_status != 2" class="copy-link" icon="el-icon-link" type="info" circle size="mini" @click="copyLink(scope.row,'H5')" :data-clipboard-text=TextLink></el-button>
                  <el-button  v-if="scope.row.is_draft === 1 && scope.row.coupons_status == 2" disabled="disabled" class="copy-link" icon="el-icon-link" type="info" circle size="mini"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="PC 链接" placement="top-start">
                  <el-button  v-if="scope.row.is_draft === 0" class="copy-link" icon="el-icon-connection" type="info" circle size="mini" disabled="disabled"></el-button>
                  <el-button  v-if="scope.row.is_draft === 1 && scope.row.coupons_status != 2" class="copy-link" icon="el-icon-connection" type="info" circle size="mini" @click="copyLink(scope.row,'PC')" :data-clipboard-text=TextLink></el-button>
                  <el-button  v-if="scope.row.is_draft === 1 && scope.row.coupons_status == 2" disabled="disabled" class="copy-link" icon="el-icon-connection" type="info" circle size="mini"></el-button>
                </el-tooltip>
                <el-button  v-if="scope.row.is_draft === 1" icon="el-icon-view" circle type="primary" size="mini" @click="$router.push({name:'/coupon/addCouponinfo',query:{is_edit:0,coupons_id:scope.row.coupon_id,give_user_list:scope.row.give_user_list}})"></el-button>
                <el-button  v-if="scope.row.is_draft === 1" icon="el-icon-tickets" circle type="warning" size="mini" @click="useCouponList(scope.row)"></el-button>
                <el-button  v-if="scope.row.coupons_status == 3 || activeIndex == 2" disabled="disabled" icon="el-icon-edit" circle  type="success" size="mini" ></el-button>
                <el-button  v-if="scope.row.is_draft === 0" icon="el-icon-view" circle type="primary" size="mini" disabled="disabled"></el-button>
                <el-button  v-if="scope.row.is_draft === 0" type="danger" icon="el-icon-delete" circle size="mini" @click="deleteCoupon(scope.row)"></el-button>
                <el-button  v-if="scope.row.coupons_status != 3 && activeIndex == 1" icon="el-icon-edit" circle  type="success" size="mini" @click="$router.push({name:'/coupon/addCouponinfo',query:{is_edit:1,coupons_id:scope.row.coupon_id,coupons_status:scope.row.coupons_status}})"></el-button>
              </el-row>
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
    </div>
    <el-dialog title="优惠券使用列表" :visible.sync="show_list"  width="68%" class="goods-window">
      <el-form ref="formList" :model="searchForm">
        <el-form-item label="使用时间" prop="use_time">
          <el-date-picker
                  v-model="use_time"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="timestamp"
                  style="width: 400px"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
          </el-date-picker>
          <el-button  style="margin-left: 15px;" type="primary" @click="searchUseList()">查询</el-button>
          <el-button  style="margin-left: 15px;" plain type="primary" icon="el-icon-download" @click="downUseList()">导出 Excel</el-button>
        </el-form-item>
        <el-row>
          <el-button style="min-width: 100px" plain size="mini" type="primary">ID: {{this.coupon_id}}</el-button>
          <el-button style="min-width: 100px;margin-top: 5px;" plain size="mini" type="primary">优惠券名称： {{this.coupon_name}}</el-button>
          <el-button style="min-width: 100px;margin-top: 5px;" plain size="mini" v-if="this.coupon_types === 0" type="primary">优惠类型：满减</el-button>
          <el-button style="min-width: 100px;margin-top: 5px;" plain size="mini" v-if="this.coupon_types === 1" type="primary">优惠类型：折扣</el-button>
          <el-button style="min-width: 100px;margin-top: 5px;" plain size="mini" type="primary">领取用户数：--服务端暂无数据--</el-button>
        </el-row>
      </el-form>
      <div>
        <el-table
                ref="special"
                :data="useData"
                stripe style="width: 100%;min-height: 420px;margin-top: 15px;">
          <el-table-column  prop="cu_use_id"  label="编号"></el-table-column>
          <el-table-column  prop="user_name"  label="用户名"></el-table-column>
          <el-table-column  prop="create_time" width="200px;" label="领取时间"></el-table-column>
          <el-table-column  prop="is_use_time" width="200px;" label="使用时间">
            <template slot-scope="scope">
              <label v-if="scope.row.is_use_time > 0">{{scope.row.is_use_time | formatDate}}</label>
            </template>
          </el-table-column>
          <el-table-column prop="order_id" label="订单号">
            <template slot-scope="scope">
              <label v-if="scope.row.order_id > 0">{{scope.row.order_id}}</label>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="优惠券状态">
            <template slot-scope="scope">
              <label v-if="scope.row.is_use === 0">未使用</label>
              <label v-if="scope.row.is_use === 1">已使用</label>
              <label v-if="scope.row.is_use === 2">已过期</label>
              <label v-if="scope.row.is_use === 3">已占用</label>
              <label v-if="scope.row.is_use === 4">已失效</label>
            </template>
          </el-table-column>
          <el-table-column prop="coupon_money" label="支付金额"></el-table-column>
        </el-table>
        <div class="table-page">
          <div class="block">
            <el-pagination
                    background
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page="pageNo2"
                    :page-sizes="pageSizes2"
                    :page-size="pageSize2"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total2>
            </el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import tagList from '../../components/TagList'
  // import custom_config from '@/../custom_config.js'
  import Clipboard from 'clipboard'
  export default {
    data () {
      return {
        tableHeight: window.innerHeight * 0.9,
        pageNo1: 1,
        pageSizes1:[10,20,50],
        pageSize1:10,
        total1:0,
        pageNo2: 1,
        pageSizes2:[5,10,20],
        pageSize2:5,
        total2:0,
        activeIndex:'1',
        audit_status:'',
        goods_status:'',
        tableData: [],
        multipleSelection: [],
        selectRows:[],
        checkArray:[],
        useData:[],
        CouponLink:'',
        LinkParam:'',
        TextLink:'',
        downloadhost:'',
        use_time:'',
        coupon_name:'',
        coupon_types:'',
        coupon_id:'',
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
        show_list: false,
        searchForm:{
          receive_time:'',
          use_time:'',
          coupon_name:'',
          coupon_type:'',
          receive_way:'',
          platform:['1','2','3','4'],
          platforms:'',
        },
      }
    },
    created(){
      if (this.$route.query.use_limit_type) this.activeIndex = this.$route.query.use_limit_type == 0 ? '1' : '2';
      this.couponList()
    },
    methods: {
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
          'type': this.activeIndex == 1 ? 0 : 1 ,
          'receive_way': this.searchForm.receive_way,
          'platform': this.searchForm.platforms.length > 0 ? this.searchForm.platforms.join(',') : '',
          'coupon_type':this.searchForm.coupon_type
        };

        /*let {data} = await this.$request.request(this.$API.common_api,param, 'main', 'GET', {
          router_path: 'se_promotion/coupons_filter',
          request_host:'COUPON_SERVER_USE_HOST',
          handle_class:'CouponLink'
        });*/
        let result = await this.$request.request(this.$API.coupon_server_list,param, 'main', 'GET',{handle_desc:"优惠券列表;"});
        console.log(result);
        this.downloadhost = result.downloadhost;
        this.tableData = result.data.data;
        this.total1 = result.data.count;
      },
      resetForm(formName) {
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
      async useCouponList(val){
        if(val) this.coupon_id = val['coupon_id'];
        if(val) this.coupon_name = val['coupon_name'];
        if(val) this.coupon_types = val['coupon_type'];
        this.show_list = true;
        let search_start_time = this.use_time ? this.use_time[0] / 1000 : '';//使用时间开始
        let search_end_time = this.use_time ? this.use_time[1] / 1000 : '';//使用时间结束
        /*let result = await this.$request.request(this.$API.common_api,{
          coupon_id:val ? val.coupon_id : this.coupon_id,
          page:this.pageNo,
          size:this.pageSize ? this.pageSize : 10,
          end_time:search_end_time,
          start_time:search_start_time,
        }, 'main', 'GET', {
          router_path: 'se_promotion/coupons_user',
          request_host:'COUPON_SERVER_USE_HOST',
          handle_class: 'Download'
        });*/
        let param = {
          coupon_id:val ? val.coupon_id : this.coupon_id,
          page:this.pageNo2,
          size:this.pageSize2 ? this.pageSize2 : 10,
          end_time:search_end_time,
          start_time:search_start_time,
        };
        let result = await this.$request.request(this.$API.coupon_use_list,param, 'main', 'GET',{handle_desc:"优惠券使用列表;"+this.coupon_id});
        console.log(result)
        if (result.code === 200) {
          this.useData = result.data.data;
          this.total2 = result.data.count;
        }
      },
      async deleteCoupon(data){
          let result = await this.$request.request(this.$API.common_api,{
            coupon_id:data.coupon_id
          }, 'main', 'GET', {
            router_path: 'ss_specialOffer/delete_draft_coupon',
            request_host:'COUPON_SERVER_HOST',
            handle_desc:"删除草稿优惠券;"+data.coupon_id
          });
          this.couponList();
          if (result.code === 200) SendMessage({message: '删除成功', type: 'success'})
      },
      async handleSizeChange1(val) {
        this.pageSize1 = val;
        this.couponList()
      },
      async handleSizeChange2(val) {
        this.pageSize2 = val;
        this.useCouponList()
      },
      async handleCurrentChange1(val) {
        this.pageNo1=val;
        this.couponList()
      },
      async handleCurrentChange2(val) {
        this.pageNo2=val;
        this.useCouponList()
      },
      async search(){

      },
      async couponType(val){
          this.searchForm.coupon_type = val;
      },
      async receiveWay(val){
        this.searchForm.receive_way = val;
      },
      async searchUseList(){
        this.useCouponList();
      },
      async activeIndexs(val){
        this.activeIndex = val;
        this.couponList();
      },
      async copyLink(val,type){
        let msg = '';
        if (type === 'PC') {
          msg = type+'链接复制成功';
          this.CouponLink = CUSTOM_CONFIG.PPY_HOST;
          this.LinkParam  = '/customer/user/mycoupons/'+val.coupon_id;
        }
        if (type === 'H5') {
          msg = type+'链接复制成功';
          this.CouponLink = CUSTOM_CONFIG.H5_HOST;
          this.LinkParam  = '/user/getcoupons/'+val.coupon_id
        }
        if (type === 'CODE') {
          msg = '券码复制成功';
          this.CouponLink = val.exchange_code;
          this.LinkParam = '';
        }
        this.TextLink = this.CouponLink + this.LinkParam;
        let clipboard = new Clipboard('.copy-link');
        clipboard.on('success', e => {
          SendMessage({message: msg, type: 'success'});
          this.LinkParam = '';
          clipboard.destroy()
        });
        clipboard.on('error', e => {
          SendMessage({message: '此浏览器不支持自动复制！', type: 'error'});
          clipboard.destroy()
        });
      },
      async downUseList(){
            let search_start_time = this.searchForm.use_time ? new Date(this.searchForm.use_time[0]).getTime() / 1000 : '';//使用时间开始
            let search_end_time = this.searchForm.use_time ? new Date(this.searchForm.use_time[1]).getTime() / 1000 : '';//使用时间结束
            let url = CUSTOM_CONFIG.ADMIN_HOST+"/api/specialoffer/get_coupons_user/?coupon_id="+this.coupon_id+"&size="+this.pageSizes2+"&start_time="+search_start_time+"&end_time="+search_end_time;
            window.location.href = url;
      },
      async platformCheck(val){
        this.searchForm.platforms = val;
      }
    },
    filters: {
      formatDate(time) {
        let times = time * 1000;
        let date = new Date(times);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s
      }
    },
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
  .form-search{
    margin: 15px;
  }
  .table-conten{
    width: 100%;
  }

</style>
