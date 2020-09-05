<template>
    <div class="content">
        <div class="table-content">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="店铺信息" name="shopInfo" :data="shopInfo">
                    <el-form id="shop_info" ref="form" :rules="rules" :model="form" :inline="true" label-width="130px" class="shop_form" v-loading="loading">
                        <div class="info-title-style">店铺信息</div>
                        <el-row>
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label="会员">
                                    {{ userInfo.nick_name }} <span v-if="userInfo.nick_name && userInfo.email">|</span> {{ userInfo.email }}
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14"><div class="grid-content">
                                <el-form-item label="店铺名称" v-if="type==''">
                                    {{ shopInfo.shop_name }}
                                </el-form-item>
                                <el-form-item label="店铺名称" v-if="type=='edit'" prop="shop_name">
                                    <el-input v-model="form.shop_name" size="mini"></el-input>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label="店铺类型">
                                    {{ openStatus[shopInfo.open_status] }}
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row v-if="shopInfo.open_status == 0">
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label="商家类型" v-if="type==''">
                                    {{ merchantLevel[shopInfo.merchant_level] }}
                                </el-form-item>
                                <el-form-item label="商家类型" v-if="type=='edit'" prop="merchant_level">
                                    <el-select v-model="form.merchant_level" size="mini">
                                        <el-option
                                            v-for="(item,index) in merchantLevelOption"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label="店铺等级" v-if="type==''">
                                    {{ rankStatus[shopInfo.rank_status] }}
                                </el-form-item>
                                <el-form-item label="店铺等级" v-if="type=='edit'" prop="rank_status">
                                    <el-select v-model="form.rank_status" size="mini">
                                        <el-option
                                                v-for="(item,index) in openStatusOption"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label="店铺LOGO" v-if="type==''">
                                    <el-image style="width: 100px; height: 100px" :src="shopInfo.log" :fit="fit" v-if="shopInfo.log"></el-image>
                                </el-form-item>
                                <el-form-item label="店铺LOGO" v-if="type=='edit'">
                                    <el-row>
                                        <el-col :span="16">
                                            <el-image style="width: 100px; height: 100px" :src="shopInfo.log" :fit="fit" v-if="form.log"></el-image>
                                        </el-col>
                                        <el-col :span="8">
                                            <upload-img @uploaded="uploaded"></upload-img>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24"><el-button @click="form.log = ''" type="text" v-if="type=='edit' && form.log">删除</el-button></el-col>
                                    </el-row>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14"><div class="grid-content">
                                <el-form-item label="经营项目" v-if="type==''">
                                    {{ shopInfo.business_range }}
                                </el-form-item>
                                <el-form-item label="经营项目" v-if="type=='edit'" prop="business_range">
                                    <el-input type="textarea" v-model="form.business_range" size="mini"></el-input>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14"><div class="grid-content">
                                <el-form-item label="服务项目" v-if="type==''">
                                    {{ shopInfo.servers }}
                                </el-form-item>
                                <el-form-item label="服务项目" v-if="type=='edit'">
                                    <el-checkbox-group v-model="form.server_commit" size="mini">
                                        <el-checkbox v-for="(server,index) in serverCommitOption" :label="server.value" :key="index" name="server_commit">{{server.label}}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item v-if="type=='edit'" class="after-sale-day">
                                    <el-select v-model="form.after_sale_day" size="mini" prop="after_sale_day">
                                        <el-option v-for="(item,index) in afterSaleDay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="type=='edit'" class="after-sale-day">天</el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14"><div class="grid-content">
                                <el-form-item label="商家标签" v-if="type==''">
                                    {{ shopInfo.seller_label_str }}
                                </el-form-item>
                                <el-form-item label="商家标签" v-if="type=='edit'">
                                    <el-checkbox-group v-model="form.seller_label" size="mini">
                                        <el-checkbox v-for="(server,index) in shopInfo.seller_label_list" :label="server.seller_label_id" :key="index" name="seller_label">{{server.label_name}}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14"><div class="grid-content">
                                <el-form-item label="店铺所在地" v-if="type==''">
                                    {{ shopInfo.province | getAddress }}{{ shopInfo.city | getAddress }}{{ shopInfo.district | getAddress }}
                                </el-form-item>
                                <el-form-item label="店铺所在地" v-if="type=='edit'" style="width: 675px">
                                    <el-cascader-panel v-model="form.select_address" :options="address_list" :disabled="disabled"
                                                       v-loading="addressLading"></el-cascader-panel>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14"><div class="grid-content">
                                <el-form-item label="店铺详细地址" v-if="type==''">
                                    {{ shopInfo.address }}
                                </el-form-item>
                                <el-form-item label="店铺详细地址" v-if="type=='edit'" prop="address">
                                    <el-input v-model="form.address" size="mini"></el-input>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14"><div class="grid-content">
                                <el-form-item label="经纬度" v-if="type==''">
                                    {{ shopInfo.positioning }}
                                </el-form-item>
                                <el-form-item label="经纬度" v-if="type=='edit'" prop="positioning">
                                    <el-row>
                                        <el-col :span="22"><el-input id="positioning" v-model="form.positioning" size="mini" disabled></el-input></el-col>
                                        <el-col :span="2"><el-button @click="dialogVisible = true" type="text" v-if="type=='edit'">定位</el-button></el-col>
                                    </el-row>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14"><div class="grid-content">
                                <el-form-item label="资质认证">
                                    {{ shopAllAuth }}
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14" :offset="0"><div class="grid-content">
                                <el-form-item label="订单通知手机号" v-if="type==''">
                                    {{ shopInfo.mobile }}
                                </el-form-item>
                                <el-form-item label="订单通知手机号" v-if="type=='edit'" prop="mobile">
                                    <el-input v-model="form.mobile" size="mini"></el-input>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14" :offset="0"><div class="grid-content">
                                <el-form-item label="订单通知邮箱" v-if="type==''">
                                    {{ shopInfo.email }}
                                </el-form-item>
                                <el-form-item label="订单通知邮箱" v-if="type=='edit'" prop="email">
                                    <el-input v-model="form.email" size="mini"></el-input>
                                </el-form-item>
                            </div></el-col>
                        </el-row>

                        <div class="info-title-style">客服信息</div>
                        <el-row>
                            <el-col :span="14" :offset="0"><div class="grid-content">
                                <el-form-item label="客服QQ" v-if="type==''">
                                    {{ shopInfo.customer_service_qq }}
                                </el-form-item>
                                <el-form-item label="客服QQ" v-if="type=='edit'">
                                    <el-input v-model="form.customer_service_qq" size="mini"></el-input>
                                </el-form-item>
                                <el-form-item v-if="type=='edit'">
                                    支持输入多个，请用 | 隔开;
                                </el-form-item>

                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14" :offset="0"><div class="grid-content">
                                <el-form-item label="客服电话" v-if="type==''">
                                    {{ shopInfo.customer_service_mobile }}
                                </el-form-item>
                                <el-form-item label="客服电话" v-if="type=='edit'" prop="customer_service_mobile">
                                    <el-input v-model="form.customer_service_mobile" size="mini"></el-input>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <div class="info-title-style">绑定银行卡</div>
                        <el-row>
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label="公司名称">
                                    {{ bankCard.company_name }}
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label="银行账号">
                                    {{ bankCard.account_number }}
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label="开户行">
                                    {{ bankCard.bank_name_master }}
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label="审核状态">
                                    {{ isAuth[bankCard.is_auth] }}
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <div class="info-title-style">管理信息</div>
                        <el-row>
                            <el-col :span="14"><div class="grid-content">
                                <el-form-item label="店铺标签" v-if="type==''">
                                    {{ shopInfo.logs }}
                                </el-form-item>
                                <el-form-item label="店铺标签" v-if="type=='edit'">
                                    <el-checkbox-group v-model="form.label" size="mini">
                                        <el-checkbox v-for="(server,index) in shopLogsOption" :label="server.value" :key="index" name="server_commit">{{server.label}}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
<!--                        <el-row>-->
<!--                            <el-col :span="24"><div class="grid-content">-->
<!--                                <el-form-item label="商品是否审核" v-if="type==''">-->
<!--                                   {{ reviewGoods[shopInfo.review_goods] }}-->
<!--                                </el-form-item>-->
<!--                                <el-form-item label="商品是否审核" v-if="type=='edit'" prop="review_goods">-->
<!--                                    <el-select v-model="form.review_goods" size="mini">-->
<!--                                        <el-option-->
<!--                                                v-for="(item,index) in reviewGoodsOption"-->
<!--                                                :key="item.value"-->
<!--                                                :label="item.label"-->
<!--                                                :value="index">-->
<!--                                        </el-option>-->
<!--                                    </el-select>-->
<!--                                </el-form-item>-->
<!--                            </div></el-col>-->
<!--                        </el-row>-->
                        <el-row>
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label="任务完成情况">
                                    <el-row>
                                        <el-col :span="24"><div class="grid-content task-info">基本资料 <span><i :class="shopInfo.shop_info == 1?'el-icon-check icon-correct':'el-icon-close icon-error'"></i></span></div></el-col>
                                        <el-col :span="24"><div class="grid-content task-info">设置物流 <span><i :class="shopInfo.shop_express == 1?'el-icon-check icon-correct':'el-icon-close icon-error'"></i></span></div></el-col>
                                        <el-col :span="24"><div class="grid-content task-info">发布商品 <span><i :class="shopInfo.shop_goods == 1?'el-icon-check icon-correct':'el-icon-close icon-error'"></i></span></div></el-col>
                                        <el-col :span="24"><div class="grid-content task-info">店铺装修 <span><i :class="shopInfo.shop_decoration == 1?'el-icon-check icon-correct':'el-icon-close icon-error'"></i></span></div></el-col>
                                    </el-row>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14" :offset="0"><div class="grid-content">
                                <el-form-item label="交易佣金" v-if="type==''">
                                    {{ shopInfo.commission }} <template v-if="shopInfo.commission">%</template>
                                </el-form-item>
                                <el-form-item label="交易佣金" v-if="type=='edit'" prop="commission">
                                    <el-row>
                                        <el-col :span="22"><el-input v-model="form.commission" size="mini" @input="oninput"></el-input></el-col>
                                        <el-col :span="2">%</el-col>
                                    </el-row>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label="店铺状态" v-if="type==''">
                                    {{ shopClose[shopInfo.shop_close] }}
                                </el-form-item>
                                <el-form-item label="店铺状态" v-if="type=='edit'" prop="shop_close">
                                    <el-select v-model="form.shop_close" size="mini">
                                        <el-option
                                                v-for="(item,key) in shopCloseOption"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="key">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24"><div class="grid-content">
                                <el-form-item label=" ">
                                    <el-button id="shop_edit" type="primary" @click="shopEdit" size="mini" v-if="type==''">编辑</el-button>
                                    <el-button type="primary" @click="onSubmit" size="mini" v-if="type=='edit'">保存</el-button>
                                    <el-button @click="loadShopInfo" size="mini" v-if="type=='edit'">取消</el-button>
                                </el-form-item>
                            </div></el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <!--      商家店铺日志  start     -->
                <el-tab-pane label="商家店铺日志" name="storeShopLog">
                    <div class="form-search">
                        <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
                            <el-form-item label="操作人" prop="operator_name">
                                <el-input v-model="searchForm.operator_name" placeholder="操作人" size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label="操作模块" prop="operate_module">
                                <el-select v-model="searchForm.operate_module" size="mini">
                                    <el-option
                                            v-for="item in operateModuleOption"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="操作时间" prop="create_time">
                                <el-date-picker
                                        v-model="searchForm.create_time"
                                        type="datetimerange"
                                        :picker-options="pickerOptions"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        align="right" size="mini">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="searchOnSubmit" size="mini">筛选</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="text" @click="resetForm('searchForm')" size="mini">清空筛选条件</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table :data="storeShopLogs.data" style="width: 100%" v-loading="loading">
                        <el-table-column prop="log_id" label="序号"></el-table-column>
                        <el-table-column prop="operator_name" label="操作人"></el-table-column>
                        <el-table-column prop="operate_platform" label="操作平台"></el-table-column>
                        <el-table-column prop="operate_module" label="操作模块"></el-table-column>
                        <el-table-column prop="operate_time" label="操作时间"></el-table-column>
                        <el-table-column prop="operate_content" label="操作内容"></el-table-column>
                    </el-table>
                    <template>
                        <div class="pages_footer white" v-if="storeShopLogs.total > 0">
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="storeShopLogs.page"
                                    :page-sizes="[10, 20, 50, 100]"
                                    :page-size="searchForm.page_size"
                                    layout="total, prev, pager, next, jumper"
                                    :total="storeShopLogs.total">
                            </el-pagination>
                        </div>
                    </template>
                </el-tab-pane>
                <!--      商家店铺日志  end       -->
                <!--      运营店铺日志  start     -->
                <el-tab-pane label="运营店铺日志" name="operateShopLog">
                    <div class="form-search">
                        <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
                            <el-form-item label="操作人" prop="admin_id">
                                <el-select v-model="searchForm.admin_id" filterable placeholder="操作人,输入名称可搜索" size="mini">
                                    <el-option
                                            v-for="item in member_name_list"
                                            :key="item.admin_id"
                                            :label="item.user_name"
                                            :value="item.admin_id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
<!--                            <el-form-item label="操作模块" prop="operate_module">-->
<!--                                <el-input v-model="searchForm.operate_module" placeholder="操作模块" size="mini"></el-input>-->
<!--                            </el-form-item>-->
                            <el-form-item label="操作时间" prop="create_time">
                                <el-date-picker
                                        v-model="searchForm.create_time"
                                        type="datetimerange"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        :picker-options="pickerOptions"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        align="right" size="mini">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="searchOnSubmit" size="mini">筛选</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="text" @click="resetForm('searchForm')" size="mini">清空筛选条件</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table :data="operateShopLogs.data" style="width: 100%" v-loading="loading">
                        <el-table-column prop="lid" label="序号"></el-table-column>
                        <el-table-column prop="user_name" label="操作人"></el-table-column>
                        <el-table-column label="操作时间">
                            <template slot-scope="scope">
                                {{ scope.row.add_time.replace("T" ,' ') }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="handle_desc" label="操作内容"></el-table-column>
                    </el-table>
                    <template>
                        <div class="pages_footer white" v-if="operateShopLogs.total > 0">
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="operateShopLogs.page"
                                    :page-sizes="[10, 20, 50, 100]"
                                    :page-size="searchForm.page_size"
                                    layout="total, prev, pager, next, jumper"
                                    :total="operateShopLogs.total">
                            </el-pagination>
                        </div>
                    </template>
                </el-tab-pane>
                <!--      运营店铺日志  end       -->

            </el-tabs>
            <el-dialog
                    title="定位坐标"
                    :visible.sync="dialogVisible"
                    width="50%">
                <el-row>
                    <el-amap
                            ref="map"
                            vid="amapDemo"
                            :center="gMap.center"
                            :map-manager="gMap.amapManager"
                            :zoom="gMap.zoom"
                            :plugin="gMap.plugin"
                            :events="gMap.events"
                            class="amap-demo" style="width: 100%; height: 450px">
                        <!-- 坐标点 -->
                        <el-amap-marker vid="amapDemo" :position="gMap.center"></el-amap-marker>
                    </el-amap>
                </el-row>
                <el-row>
                    <el-col :span="24"></el-col>
                    <el-col :span="24" class="positioning">拖动地图至目标位置，获得经纬度 <span class="positioningColor">{{ gMap.center[0] }}</span><span class="positioningColor">,{{ gMap.center[1] }}</span></el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setPositioning">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Vue from "vue"
    import VueAMap from "vue-amap"
    import uploadImg from '../../components/UplodaImg'
    import {
        RANK_STATUS, OPEN_STATUS, RANK_STATUS_OPTION, REVIEW_GOODS, REVIEW_GOODS_OPTION, IS_AUTH, SERVER_COMMIT,
        SERVER_COMMIT_OPTION, SHOP_CLOSE, SHOP_CLOSE_OPTION, SHOP_AUTH, AFTER_SALE_DAY, OPERATE_MODULE_OPTION,
        MERCHANT_LEVEL, MERCHANT_LEVEL_OPTION, SHOP_LOGS, SHOP_LOGS_OPTION
    } from "../../config/seller";
    // 初始化高德地图的 key 和插件
    Vue.use(VueAMap)
    let amapManager = new VueAMap.AMapManager()

    export default {
        data () {
            let checkFloat = (rule, value, callback) => {
                if (value < 0 || value > 100) {
                    callback(new Error('必须是 0～100 之间的数字'));
                }else{
                    callback();
                }
                setTimeout(() => {
                    if (!isFloat(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        callback();
                    }
                }, 1000);
            };
            let isFloat = ( str ) => {
                for(let i=0;i<str.length;i++)  {
                    if ((str.charAt(i)<"0" || str.charAt(i)>"9")&& str.charAt(i) != '.'){
                        return false;
                    }
                }
                return true;
            };
            /*电话号码正则表达式*/
            let isPhone = (rule, value, callback) => {
                let reg= 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
                if(reg.test(value)){
                    callback();
                }else{
                    callback(new Error('请输入正确的手机格式'));
                }
            };
            return {
                member_name_list:[],
                shopLogs: SHOP_LOGS,
                shopLogsOption: SHOP_LOGS_OPTION,
                openStatus: OPEN_STATUS,
                openStatusOption: RANK_STATUS_OPTION,
                rankStatus: RANK_STATUS,
                reviewGoods: REVIEW_GOODS,
                reviewGoodsOption: REVIEW_GOODS_OPTION,
                isAuth: IS_AUTH,
                serverCommit: SERVER_COMMIT,
                serverCommitOption: SERVER_COMMIT_OPTION,
                shopClose: SHOP_CLOSE,
                shopCloseOption: SHOP_CLOSE_OPTION,
                shopAuth: SHOP_AUTH,
                afterSaleDay: AFTER_SALE_DAY,
                operateModuleOption: OPERATE_MODULE_OPTION,
                merchantLevel: MERCHANT_LEVEL,
                merchantLevelOption: MERCHANT_LEVEL_OPTION,
                type: '',
                loading: false,
                activeName: 'shopInfo',
                disabled: false,
                address_list: [],
                addressLading: false,
                form: {
                    shop_id: '',
                    address: '',
                    shop_name: '',
                    // open_status: '',
                    rank_status: '',
                    business_range: '',
                    server_commit: [],
                    // review_goods: 0,
                    log: '',
                    email: '',
                    label: [],
                    customer_service_mobile: '',
                    customer_service_qq: '',
                    commission: '',
                    shop_close: '',
                    district: '',
                    select_address: [],
                    positioning: '',
                    after_sale_day: '7',
                    mobile: '',
                    merchant_level: '',
                    seller_label: []
                },
                errorMessage: '',
                searchForm: {
                    operator_name: '',
                    object_id: '',
                    admin_id: '',
                    create_time: [],
                    operate_module: '',
                    page: 1,
                    page_size: 10
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
                storeShopLogs: {
                    page_total: 0,
                    total: 0,
                    page: 1,
                    data: []
                },
                operateShopLogs: {
                    page_total: 0,
                    total: 0,
                    page: 1,
                    data: []
                },
                danger: false,
                primary: false,
                shopInfo: {
                    shop_id: '',
                    shop_name: '',
                    company_name: '',
                    mobile: '',
                    positioning: '',
                    customer_service_qq: '',
                    customer_service_mobile: '',
                    // review_goods: '',
                    business_range: '',
                    server_commit: [],
                    servers: '',
                    shop_close: '',
                    address: '',
                    rank_status: '',
                    district: '',
                    merchant_level: '',
                    seller_label: [],
                    seller_label_str: '',
                    seller_label_list: ''
                },
                bankCard:{
                    account_number: '',
                    company_name: '',
                    bank_name_master: '',
                    is_auth: 0
                },
                reverse: false,
                fit: 'contain',
                shopAllAuth: '',
                rules: {
                    shop_name: [
                        { required: true, message: '请输入店铺名称', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                    ],
                    rank_status: [
                        { required: true, message: '请选择店铺等级', trigger: 'blur' },
                    ],
                    merchant_level: [
                        { required: true, message: '请选择商店类型', trigger: 'blur' },
                    ],
                    business_range: [
                        { min: 0, max: 500, message: '最长 500 个字符', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入店铺详细地址', trigger: 'blur' },
                        { min: 0, max: 100, message: '最长 100 个字符', trigger: 'blur' }
                    ],
                    // review_goods: [
                    //     { required: true, message: '请选择商品是否审核', trigger: 'blur' },
                    // ],
                    commission: [
                        { required: true, message: '请输入交易佣金', trigger: 'blur' },
                        { validator: checkFloat, trigger: 'blur'}
                    ],
                    shop_close: [
                        { required: true, message: '请选择店铺状态', trigger: 'blur' },
                    ],
                    customer_service_mobile: [
                        { min: 0, max: 50, message: '最长 50 个字符', trigger: 'blur' }
                    ],
                    mobile: [
                        { validator: isPhone, trigger: 'blur'}
                    ],
                    email: [
                        { type: 'email',message: '请输入正确的邮箱地址', trigger: 'blur'},
                    ]
                },
                dialogVisible: false,
                userInfo: {
                    nick_name: ''
                },
                gMap: {
                    zoom: 12,
                    center: [116.397428, 39.90923], //默认经纬度为北京天安门
                    amapManager,
                    events: {
                        'click': (e) => {
                            this.gMap.center = [e.lnglat.lng, e.lnglat.lat]// 点击选择新地址为中心点
                        }
                    },
                    // ToolBar工具条插件、MapType插件、Scale比例尺插件、OverView鹰眼插件
                    plugin: [{
                        pName: 'AMap.ToolBar',//放大缩小工具
                        events: {
                            init(instance) {
                                // instance.hideDirection()
                            }
                        }
                    }, 'AMap.Scale'],
                }
            }
        },
        created(){
            VueAMap.initAMapApiLoader({
                key: 'c07dcece9b8c42302b11fe3fd7d4e50a',
                plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','MapUI.loadUI'],
                // 默认高德 sdk 版本为 1.4.4
                v: '1.4.4'
            });
            this.shop_detail()
            this.get_member_name_list();
        },
        updated(){
            if(this.$route.query.type == 'edit'){
                this.type = this.$route.query.type
            }else{
                this.type = ''
            }
        },
        methods: {
            setPositioning(){
                this.form.positioning = this.gMap.center[0] + ',' + this.gMap.center[1];
                this.dialogVisible = false
            },
            async get_member_name_list(){
                let {data} = await this.$request.get(this.$API.get_name_list);
                this.member_name_list=data;
            },
            oninput() {
                // 通过正则过滤小数点后三位
                this.form.commission = (this.form.commission.match(/^\d*(\.?\d{0,3})/g)[0]) || null
            },
            async shopAddress () {
                this.addressLading = true
                let {data} = await this.$request.get(this.$API.addressInfo)
                this.address_list = data
                this.addressLading = false
            },
            async shop_detail(){
                this.loading = true
                if(this.$route.query.type == 'edit'){
                    this.type = this.$route.query.type
                }else{
                    this.type = ''
                }
                if(this.$route.query.tag){
                    this.activeName = this.$route.query.tag
                }
                this.disabled = this.$route.type=='edit' ? true : false
                this.shopAddress()
                //获取店铺详情
                let parameter = {'shop_id':this.$route.query.shop_id};
                let data = await this.$request.get(this.$API.common_api,parameter,'main',{
                    router_path: 'seller/shop',
                    request_host: 'APP_SELLER_SERVER_HOST',
                    handle_desc: '查看店铺详情;' + this.$route.query.shop_id
                })
                if( data.code == 200 ){
                    this.shopInfo = data.data.result[0]
                    let province =  this.shopInfo.province.split('_')
                    let city =  this.shopInfo.city.split('_')
                    let district =  this.shopInfo.district.split('_')
                    this.form.select_address = [province[0], city[0], district[0]]

                    if(this.shopInfo.server_commit){
                        let servers = this.shopInfo.server_commit.split(',')
                        let server_commit = ''
                        servers.forEach((item, index, arr) => {
                            if(index==0){
                                server_commit += this.serverCommit[item]
                            }else{
                                server_commit += ','+this.serverCommit[item]
                            }
                            if(item==0){
                                server_commit += this.shopInfo.after_sale_day + '天'
                            }
                        })
                        this.shopInfo.servers = server_commit
                        this.form.server_commit = servers
                    }else{
                        this.shopInfo.servers = ''
                        this.form.server_commit = []
                    }
                    if(this.shopInfo.label){
                        let logs = this.shopInfo.label.split(',')
                        let label = ''
                        logs.forEach((item, index, arr) => {
                            if(index==0){
                                label += this.shopLogs[item]
                            }else{
                                label += ','+this.shopLogs[item]
                            }
                        })
                        this.shopInfo.logs = label
                        this.form.label = logs
                    }else{
                        this.shopInfo.logs = ''
                        this.form.label = []
                    }
                    this.form.seller_label = eval(this.shopInfo.seller_label)
                    if(this.shopInfo.seller_label_list){
                        // let label = ''
                        this.shopInfo.seller_label_str = ''
                        this.shopInfo.seller_label_list.forEach((item, index, arr) => {
                            if(this.form.seller_label.includes(item.seller_label_id)){
                                if(this.shopInfo.seller_label_str === ''){
                                    this.shopInfo.seller_label_str+= item.label_name
                                }else{
                                    this.shopInfo.seller_label_str+= ','+item.label_name
                                }
                            }
                        })
                    }else{
                        this.shopInfo.seller_label_str = ''
                    }

                    this.form.shop_name = this.shopInfo.shop_name
                    this.form.rank_status = this.shopInfo.rank_status
                    this.form.business_range = this.shopInfo.business_range

                    // this.form.review_goods = this.shopInfo.review_goods
                    this.form.email = this.shopInfo.email
                    this.form.log = this.shopInfo.log
                    this.form.customer_service_qq = this.shopInfo.customer_service_qq
                    this.form.customer_service_mobile = this.shopInfo.customer_service_mobile
                    this.form.shop_close = this.shopInfo.shop_close
                    this.form.address = this.shopInfo.address
                    this.form.shop_id = this.shopInfo.shop_id
                    this.form.positioning = this.shopInfo.positioning
                    this.form.after_sale_day = !this.shopInfo.after_sale_day ? 7 :this.shopInfo.after_sale_day
                    this.form.mobile = this.shopInfo.mobile
                    this.form.commission = this.shopInfo.commission
                    this.form.merchant_level = this.shopInfo.merchant_level

                    // 获取当前店铺的经纬度
                    if(this.shopInfo.positioning){
                        let positioning = this.shopInfo.positioning.split(',')
                        this.gMap.center[0] = parseFloat(positioning[0])
                        this.gMap.center[1] = parseFloat(positioning[1])
                    };

                    //获取资质认证
                    let shopAuth = await this.$request.get(this.$API.common_api,parameter,'main',{
                        router_path: 'seller/shopAuth',
                        request_host: 'STORE_SERVER_HOST',
                    })
                    if(shopAuth.code == 200 && shopAuth.data.length != 0){
                        let auth = []
                        shopAuth.data.forEach((item, index, arr) => {
                            auth.push(this.shopAuth[item.apply_type])
                        })
                        this.shopAllAuth = auth.join(';')+';'
                    }
                    //获取银行卡信息
                    let bankInfo = await this.$request.get(this.$API.common_api,parameter,'main',{
                        router_path: 'seller/bankCard',
                        request_host: 'STORE_SERVER_HOST',
                    })
                    if(bankInfo.code == 200 && bankInfo.data){
                        this.bankCard = bankInfo.data
                    }
                    //获取用户信息
                    let userInfo = await this.$request.request(this.$API.common_api,{
                        user_id:this.shopInfo.user_id
                    }, 'main', 'GET', {
                        router_path: 'zt/users',
                        request_host:'MEMBER_USER_HOST',
                    });
                    if(userInfo.code == 200 && userInfo.data.data[0]){
                        this.userInfo = userInfo.data.data[0]
                    }else{
                        this.errorMessage = '会员信息获取失败,请重试!'
                        this.fail()
                    }
                }else{
                    this.errorMessage = '店铺不存在,请重试!'
                    this.fail()
                    this.$router.push('/seller/shop')
                }
                this.loading = false
            },
            //商家店铺日志
            async store_shop_log(parameter){
                let params =  JSON.parse(JSON.stringify(parameter))
                params.shop_id = this.$route.query.shop_id
                if(params.create_time && params.create_time.length == 2){
                    params.start_time = Math.round(new Date(params.create_time[0]).getTime()/1000)
                    params.end_time = Math.round(new Date(params.create_time[1]).getTime()/1000)
                }
                let shopLog = await this.$request.get(this.$API.common_api,params,'main',{
                    router_path: 'seller/shopLog',
                    request_host: 'STORE_SERVER_HOST',
                })
                if(shopLog.code == 200){
                    this.storeShopLogs = shopLog
                }
            },
            //运营店铺日志
            async operate_shop_log(parameter){
                let params =  JSON.parse(JSON.stringify(parameter))
                params.object_id = parseInt(this.$route.query.shop_id)
                if(params.create_time && params.create_time.length == 2){
                    params.start_time = params.create_time[0]
                    params.end_time = params.create_time[1]
                }
                let shopLog = await this.$request.request(this.$API.operate_shop_log, params, 'main', 'POST');
                if(shopLog.code == 200){
                    this.operateShopLogs = shopLog.data
                }
            },
            uploaded (data) {
                this.form.log = data.imageOssUrl
            },
            handleClick(tab, event) {
                this.$refs['searchForm'].resetFields();
                if(tab.name == 'shopInfo'){
                    this.shop_detail()
                }else if(tab.name == 'storeShopLog'){
                    this.store_shop_log(this.searchForm)
                }else if(tab.name == 'operateShopLog'){
                    this.operate_shop_log(this.searchForm)
                }
            },
            handleSizeChange(val) {
                this.searchForm.size = val
                if(this.activeName == 'storeShopLog'){
                    this.store_shop_log(this.searchForm)
                }else if(this.activeName == 'operateShopLog'){
                    this.operate_shop_log(this.searchForm)
                }
            },
            handleCurrentChange(val) {
                this.searchForm.page = val
                if(this.activeName == 'storeShopLog'){
                    this.store_shop_log(this.searchForm)
                }else if(this.activeName == 'operateShopLog'){
                    this.operate_shop_log(this.searchForm)
                }
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
            },
            shopEdit() {
                this.loading = true
                this.$router.push('/seller/shopDetail?tag=shopInfo&type=edit&shop_id='+this.shopInfo.shop_id)
                this.loading = false
            },
            loadShopInfo(){
                this.loading = true
                this.$router.push('/seller/shopDetail?tag=shopInfo&shop_id='+this.shopInfo.shop_id)
                this.loading = false
            },
            searchOnSubmit() {
                this.loading = true
                if(this.activeName == 'storeShopLog'){
                    this.store_shop_log(this.searchForm)
                }else if(this.activeName == 'operateShopLog'){
                    this.operate_shop_log(this.searchForm)
                }
                this.loading = false
            },
            onSubmit() {
                let task_count = this.shopInfo.shop_info + this.shopInfo.shop_goods +this.shopInfo.shop_express +this.shopInfo.shop_decoration
                if(this.form.shop_close == 1 && task_count < 3){
                    this.errorMessage = '任务完成情况必须完成3个或3个以上才可上线!'
                    this.fail()
                    return false
                }
                const setAddress = () => {
                    let province = '',
                        city = '',
                        district = ''
                    let address = JSON.parse(JSON.stringify(this.form.select_address))
                    province = _.findIndex(this.address_list, (o) => {
                        return o.value == address[0]
                    })
                    if (province >= 0) {
                        address[0] += '_' + this.address_list[province].label
                        city = _.findIndex(this.address_list[province].children, (o) => {
                            return o.value == address[1]
                        })
                        if (city >= 0) {
                            address[1] += '_' + this.address_list[province].children[city].label
                            district = _.findIndex(this.address_list[province].children[city].children, (o) => {
                                return o.value == address[2]
                            })
                            district >= 0 && (address[2] += '_' + this.address_list[province].children[city].children[district].label)
                        }
                    } else {
                        return {state: false, address: address}
                    }
                    return {state: true, address: address}
                }

                let {state, address} = setAddress()
                if (!state) {
                    SendMessage({message: '请选择店铺所在地', type: 'error'})
                    this.loading = false
                    return false
                }
                this.form.province = address[0]
                this.form.city = address[1]
                this.form.district = address[2]
                let params =  JSON.parse(JSON.stringify(this.form))
                delete params.select_address
                params.server_commit = this.form.server_commit.join(',')
                params.label = this.form.label.join(',')
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let data = await this.$request.post(this.$API.common_api,params,'main',{
                            router_path: 'seller/shopEdit',
                            request_host: 'STORE_SERVER_HOST',
                            handle_desc: '修改店铺信息;' + this.shopInfo.shop_id
                        })
                        if(data.code == '200' && data.data){
                            this.success()
                            this.shop_detail()
                            this.$router.push('/seller/shopDetail?tag=shopInfo&shop_id='+this.shopInfo.shop_id)
                        }else{
                            this.errorMessage = '更新失败'
                            this.fail()
                        }
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                if(this.activeName == 'storeShopLog'){
                    this.searchForm= {
                        operator_id: '',
                        object_id: '',
                        admin_id: '',
                        create_time: [],
                        operate_module: '',
                        page: 1,
                        page_size: 10
                    }
                    this.store_shop_log(this.searchForm)
                }else if(this.activeName == 'operateShopLog'){
                    this.operate_shop_log(this.searchForm)
                }
            },
        },
        filters: {
            getAddress(value) {
                if(value){
                    let address = value.split('_');
                    return address[1]
                }
                return ''
            }
        },
        components: {
            uploadImg
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/pageHeader";

    .content {
        .page-header-tag {
            margin: 22px auto;
        }
        .table-content {
            .info-title-style {
                width: calc(~"100% - 30px");
                height: 40px;
                background: #F5F5F5;
                line-height: 40px;
                padding: 0 15px;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 22px;
            }
            .task-info {
                line-height: 20px;
            }
            .el-form-item {
                margin-bottom: 10px;
            }
            .pages_footer {
                padding: 10px;
                text-align: center;
            }
            .after-sale-day {
                width: 75px;
            }
            #container{
                width: 700px;
                height: 400px;
            }
            .positioning {
                margin-top: 10px;
            }
            .positioningColor {
                color: #409EFF;
            }
        }
        .icon-correct{
            color: #2A904C;
        }
        .icon-error{
            color: #DD0919;
        }
        .hidden{
            display: none;
        }
    }
</style>
