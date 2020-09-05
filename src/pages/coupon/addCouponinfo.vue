<template>
    <div class="content">
        <div class="pages-header">
            <div>添加优惠券</div>
            <el-button round style="float: right;margin-top: 15px;margin-right: 40px;" type="primary" id="add-logistics" icon="el-icon-back" size="medium" @click=goBack()>返回列表</el-button>
        </div>
        <div class="form_content">
            <el-main class="el-main">
                <el-form ref="form" :model="form" :rules="rules" label-width="140px" v-loading="loading">
                    <el-divider content-position="left"><label style="font-size: 12px;font-weight: bolder;">优惠券信息</label></el-divider>
                    <el-row class="form-edit-row">
                        <el-form-item label="优惠券名称" prop="coupon_name">
                            <el-input maxlength="20" show-word-limit v-model="form.coupon_name" style="width: 500px"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-form-item label="优惠类型" prop="coupon_type">
                        <el-radio-group v-model="form.coupon_type" @change="priceType">
                            <el-radio :label="0" :disabled=is_disabled style="width: 100px">满减</el-radio>
                            <el-radio :label="1" :disabled=is_disabled style="width: 100px">折扣券</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="使用条件" prop="use_requirement" v-if="form.coupon_type == 0">
                        <el-radio-group v-model="form.use_requirement" @change="useWhere">
                            <el-radio :label="0" :disabled=is_disabled style="width: 100px">满减</el-radio>
                            <el-radio :label="1" :disabled=is_disabled style="width: 100px">阶梯满减</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="使用条件" v-if="form.coupon_type == 1">
                        <span style="width: 100px">满 ￥</span><el-input-number :disabled=is_disabled suffix-icon="el-icon-date" v-model="form.start_price" controls-position="right"  :min="0" style="width: 200px"></el-input-number> 元，
                        <span style="width: 100px">打 </span><el-input-number :disabled=is_disabled v-model="form.discount_price" controls-position="right"  :step="0.1" :min="0.0" :max="9.9" style="width: 200px"></el-input-number> 折，
                        <span style="width: 100px">最多可抵扣￥ </span><el-input-number :disabled=is_disabled v-model="form.most_offer" :min="0" controls-position="right"  style="width: 200px"></el-input-number> 元。
                        <label style="font-size: 10px;color: #F56C6C">(￥：人民币)</label>
                    </el-form-item>
                    <el-form-item v-if="form.coupon_type == 0 && form.use_requirement == 0">
                        <span style="width: 100px">满 ￥</span><el-input-number :disabled=is_disabled v-model="form.start_price"  :min="0" controls-position="right" style="width: 200px"></el-input-number> 元，
                        <span style="width: 100px">减 ￥</span><el-input-number :disabled=is_disabled v-model="form.discount_price" :min="0"  controls-position="right" style="width: 200px"></el-input-number> 元，
                        <span style="width: 50px"> 最多减￥ </span><el-input-number :disabled=is_disabled v-model="form.most_offer" controls-position="right" :min="0" style="width: 200px"></el-input-number> 元。
                        <label style="font-size: 10px;color: #F56C6C">(￥：人民币)</label>
                    </el-form-item>
                    <el-form-item v-if="form.coupon_type == 0 && form.use_requirement == 1">
                        <span style="width: 50px">每满￥ </span><el-input-number :disabled=is_disabled v-model="form.start_price" controls-position="right" :min="0" style="width: 200px"></el-input-number> 元，
                        <span style="width: 50px">减￥ </span><el-input-number :disabled=is_disabled v-model="form.discount_price" controls-position="right" :min="0" style="width: 200px"></el-input-number> 元，
                        <span style="width: 50px"> 最多减￥ </span><el-input-number :disabled=is_disabled v-model="form.most_offer" controls-position="right" :min="0" style="width: 200px"></el-input-number> 元。
                        <label style="font-size: 10px;color: #F56C6C">(￥：人民币)</label>
                    </el-form-item>
                    <!--<el-form-item label="使用范围" prop="use_limit_type">
                        <el-radio-group v-model="form.use_limit_type" @change="userscopeList">
                            <el-radio :label="0" style="width: 100px" :disabled=is_disabled>全平台使用</el-radio>
                            <el-radio :label="1" style="width: 100px" disabled="disabled">仅在某店铺使用</el-radio>
                        </el-radio-group>
                    </el-form-item>-->
                    <el-form-item label="使用店铺" prop="shop_ids" v-if="form.use_limit_type == 1">
                        <el-select v-model="form.shop_ids" multiple placeholder="请选择店铺名称" style="width: 500px" :disabled=is_disabled>
                            <el-option
                                    v-for="item in rules_user_list"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="使用平台" prop="platform">
                        <el-checkbox-group v-model="form.platform" @change="userformList" :disabled=is_disabled>
                            <el-checkbox label='1' style="width: 100px">PC</el-checkbox>
                            <el-checkbox label='2' style="width: 100px">APP</el-checkbox>
                            <el-checkbox label='3' style="width: 100px">H5</el-checkbox>
                            <el-checkbox label='4' style="width: 100px">小程序</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="商品范围" prop="goods_category_range">
                        <el-radio-group v-model="form.goods_category_range" @change="assignSelect" :disabled=is_disabled>
                            <el-radio :label="0" style="width: 100px">全品类</el-radio>
                            <el-tooltip class="item" effect="dark" :content="'已选择 '+selectedData1.length+' 件商品'" placement="bottom-start">
                                <span @click="assignSelect(1)"> <el-radio :label="1" style="width: 100px">指定商品</el-radio></span>
                            </el-tooltip>
                            <el-radio :label="2" style="width: 100px">指定品类</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="form.goods_category_range == 2">
                        <el-cascader
                                :disabled=is_disabled
                                :options="category_range_options"
                                :props="multiple_props"
                                v-model="form.category_range_value"
                                style="width: 500px"></el-cascader>
                    </el-form-item>
                    <!--<el-form-item label="" v-if="form.goods_category_range == 2">
                        <el-input  v-model="form.category_name" maxlength="100" show-word-limit type="textarea" :autosize="{ minRows: 4}"  disabled="disabled" style="width: 500px;font-size: 15px;color: #00a2d4"></el-input>
                    </el-form-item>-->

                    <!--<el-form-item label="">
                        <el-button type="primary" :disabled=is_disabled size="small" v-if="form.goods_category_range == 1" icon="el-icon-search" plain round @click="assignSelect(1)">选择商品</el-button>
                    </el-form-item>-->
                    <!--<el-form-item label="" v-if="form.goods_category_range == 2">
                        <el-select v-model="form.class_name_1" style="width: 200px" clearable placeholder="请选择"  @change="(res)=>{handleChange(res,2)}">
                            <el-option
                                    v-for="item in class_option"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-if="is_select_2" :multiple="multiple2" v-model="form.class_name_2" clearable placeholder="请选择" @change="(res)=>{handleChange(res,3)}">
                            <el-option
                                    v-for="item in class_option_2"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-if="is_select_3" :multiple="multiple3" v-model="form.class_name_3" clearable placeholder="请选择" @change="(res)=>{handleChange(res,4)}">
                            <el-option
                                    v-for="item in class_option_3"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>-->
                    <el-form-item label="发行量" prop="quantity">
                        <el-input-number  controls-position="right" :min="1" :max="100000" v-model="form.quantity" style="width: 200px"></el-input-number> (张)
                    </el-form-item>
                    <el-form-item label="有效时间" prop="use_time_type_id">
                        <el-radio-group v-model="form.use_time_type_id" @change="useTime">
                            <el-radio :label="0" :disabled=is_disabled style="width: 100px">固定时间段有效</el-radio>
                            <el-radio :label="1" :disabled=is_disabled style="width: 120px">领取之日后<label v-if="form.show_time != 2 && form.use_time_type_id == 0">多少</label></el-radio>
                        </el-radio-group>
                        <el-input-number v-if="form.use_time_type_id == 1" :disabled=is_disabled prop="use_days_time" controls-position="right" :min="0" :max="100" v-model="form.use_days_time" style="width: 200px;margin-left: -20px"></el-input-number><label style="color: #606266;"> 天有效。</label>
                    </el-form-item>
                    <el-form-item label="有效期" v-if="form.use_time_type_id == 0">
                        <el-date-picker
                                :disabled=is_disabled
                                v-model="value1"
                                type="datetimerange"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width: 500px"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-divider content-position="left"><label style="font-size: 12px;font-weight: bolder;">扩展信息</label></el-divider>
                    <el-form-item label="领取方式" prop="receive_way">
                        <el-radio-group v-model="form.receive_way" @change="receiveType">
                            <el-radio :label="0" style="width: 100px" :disabled=is_disabled>系统发放</el-radio>
                            <el-radio :label="1" style="width: 100px" :disabled=is_disabled>用户主动领取</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否公开" prop="is_show">
                        <el-radio-group v-model="form.is_show" @change="receiveOpen">
                            <el-radio :label="0" style="width: 100px" :disabled=is_disabled>是</el-radio>
                            <el-radio :label="1" style="width: 100px" :disabled=is_disabled>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="form.receive_way == 0 ? '发放条件' : '领取条件'" prop="requirement">
                        <el-radio-group v-model="form.requirement" @change="receiveWhere">
                            <el-radio :label="3" v-if="form.receive_way == 0" :disabled=is_disabled style="width: 100px">按用户发放</el-radio>
                            <el-radio :label="0" v-if="form.receive_way == 1" :disabled=is_disabled style="width: 100px">无条件</el-radio>
                            <el-radio :label="2"  :disabled=is_disabled style="width: 100px">{{form.receive_way == 0 ? '按任务发放' : '按任务领取'}}</el-radio>
                            <el-radio :label="4" v-if="form.receive_way == 0" :disabled=is_disabled style="width: 100px">按用户标签发放</el-radio>
                            <el-radio :label="1" v-if="form.receive_way == 1" :disabled=is_disabled style="width: 100px">按消费金额领取</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="" v-if="form.requirement == 2 && form.receive_way == 1" prop="task_id">
                        <el-checkbox-group v-model="form.task_id"  prop="task_id" @change="userRules">
                            <el-checkbox label="0" style="width: 100px" :disabled=is_disabled>注册完成领取</el-checkbox>
                            <!--<el-checkbox label="2" style="width: 100px" :disabled=is_disabled>支付完成领取</el-checkbox>-->
                            <!--<el-checkbox label="6" style="width: 100px" :disabled=is_disabled>分享成功赠送</el-checkbox>-->
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="" v-if="form.requirement == 2 && form.receive_way == 0" prop="task_id">
                        <el-checkbox-group v-model="form.task_id"  prop="task_id" @change="userRules">
                            <el-checkbox label="0" style="width: 100px" :disabled=is_disabled>注册成功发放</el-checkbox>
                            <el-checkbox label="6" style="width: 100px" :disabled=is_disabled>分享成功发放</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="" v-if="form.requirement == 4 && form.receive_way == 0">
                            <el-checkbox-group v-model="label_id" v-if="labelData.length>0">
                                <el-checkbox v-for="(item,idx) in labelData" :key="idx" :label="item.id" >{{item.label_name}}
                                    <i class="el-icon-user-solid">
                                        <label style="font-size:12px;color: #909399;padding-left: 3px;font-weight: bold;">{{item.label_count}}</label>
                                    </i>
                                </el-checkbox>
                            </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="注册时间" required  v-if="form.task_id.indexOf('0') > -1 && form.requirement == 2">
                        <el-date-picker
                                v-model="register_time"
                                type="datetimerange"
                                :clearable=clearable
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width: 500px"
                                range-separator="至"
                                :disabled=is_disabled
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="" v-if="form.requirement == 1  && form.receive_way == 1" prop="amount_receive">
                        <label  style="color: #606266;">消费满 ￥ </label><el-input-number  :disabled=is_disabled prop="amount_receive" controls-position="right" :min="0"  :step="0.1" v-model="form.amount_receive" style="width: 200px"></el-input-number><label style="color: #606266;"> 元赠送</label>
                    </el-form-item>
                    <el-form-item label="" v-if="form.requirement == 3  && form.receive_way == 0">
                        <el-tooltip class="item" effect="dark" :content="'已添加 '+selectedData.length+' 个用户'" placement="bottom-start">
                            <el-button type="primary" :disabled=is_disabled size="small" icon="el-icon-search" plain round @click="userList()">选择添加用户</el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="'已添加 '+selectedData.length+' 个用户'" placement="bottom-start">
                            <el-button type="primary" :disabled=is_disabled size="small" icon="el-icon-plus" plain round @click="addMobiles()">批量添加用户</el-button>
                        </el-tooltip>
                    </el-form-item>
                    <!--<el-form-item prop="goods_range" v-if="form.requirement == 3  && form.receive_way == 0">
                        <el-select
                                v-model="form.goods_range"
                                filterable
                                multiple
                                remote
                                reserve-keyword
                                placeholder="请输入商品/品类搜索"
                                :remote-method="remoteMethodPrice"
                                style="width: 500px;">
                            <el-option
                                    v-for="(item,index) in rules_price_list"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>-->
                    <el-form-item label="限领" v-if="form.receive_way == 1" prop="limit_receive">
                        <el-input-number  controls-position="right" v-model="form.limit_receive" prop="limit_receive" style="width: 200px" :min=1 :max=form.quantity placeholder="请输入限制数量"></el-input-number><label  style="color: #606266;"> (张)</label>
                    </el-form-item>
                    <el-form-item label="领取时间" required>
                        <el-date-picker
                                v-model="value2"
                                type="datetimerange"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width: 500px"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="商品范围说明" prop="goods_range_des">
                        <el-input type="textarea" :disabled=is_disabled v-model="form.goods_range_des" maxlength="30" show-word-limit :autosize="{ minRows: 2}" style="width: 500px"></el-input>
                    </el-form-item>
                    <el-form-item label="使用规则" prop="remark">
                        <el-input type="textarea" v-model="form.remark" maxlength="200" show-word-limit :autosize="{ minRows: 6}" style="width: 500px"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券状态" prop="is_draft" >
                        <el-switch
                                style=""
                                v-model="form.is_draft"
                                v-if="is_draft == 1"
                                disabled
                                active-color="#66b1ff"
                                inactive-color="#F56C6C"
                                active-value="1"
                                inactive-value="0"
                                active-text="立即发布"
                                inactive-text="保存为草稿">
                        </el-switch>
                        <el-switch
                                style=""
                                v-model="form.is_draft"
                                v-if="is_draft == 0"
                                active-color="#66b1ff"
                                inactive-color="#F56C6C"
                                active-value="1"
                                inactive-value="0"
                                active-text="立即发布"
                                inactive-text="保存为草稿">
                        </el-switch>
                    </el-form-item>
                    <el-form-item v-if="this.is_edit == 1 || this.is_add == 1">
                        <el-button type="primary" @click="onSubmit('form')">立即保存</el-button>
                        <el-button @click="onClear('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
            <el-dialog title="用户列表" :visible.sync="user_list"  width="65%" class="user-window" :before-close="handleUserClose">
                <el-form :model="form" ref="addUserBatch" v-if="show_userbatch==true" class="demo-form-inline">
                    <el-form-item label="手机号" prop="mobiles"
                                  :rules="[
                                  {required: true, message: '请输入手机号,英文‘,’逗号隔开', trigger: 'blur'},
                    ]">
                        <el-input
                                style="width: 100%"
                                type="textarea"
                                size="medium"
                                :autosize="{ minRows: 3, maxRows: 8}"
                                :rows="textareaRow"
                                v-model="form.mobiles"
                                @input="checkMobiles"
                                placeholder="批量添加手机号码需要用英文‘,’逗号隔开。（例如：18898797127,15898456578,15033232323）">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="is_edit == 0 || is_draft == 0" style="margin-top: 15px;" size="small" type="primary" @click="success(3)" >批量添加</el-button>
                        <el-button v-if="is_edit == 0 || is_draft == 0" style="margin-top: 15px;" size="small" type="" @click="cancel(3)" >清空内容</el-button>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" :model="form" ref="userList" v-if="show_userbatch==false" class="demo-form-inline" style="height: 45px">
                    <el-form-item label="用户ID" style="margin-left: 10px;">
                        <el-input v-model="form.user_id" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="会员名称">
                        <el-input v-model="form.nick_name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="userList('search')">查询</el-button>
                    </el-form-item>
                </el-form>
                <div v-if="show_userbatch==false">
                    <el-table
                            ref="userTable"
                            :data="userData"
                            stripe style="width: 100%;margin-top: 15px;"
                            :empty-text="userTableText"
                            height="550"
                            @select="handleSelectionChange"
                            @select-all="handleSelectionClickAll">
                        <el-table-column type="selection"  prop="user_id" width="55" :selectable="selectable"></el-table-column>
                        <el-table-column prop="user_id" label="会员ID" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="nick_name" label="昵称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="mobile" label="手机" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="member_status" label="状态" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <label v-if="scope.row.status === 0" style="color:#E6A23C">停用</label>
                                <label v-if="scope.row.status === 1" style="color:#67C23A">启用</label>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="table-page" style="float: right;margin-top: 15px;">
                        <div class="block">
                            <el-pagination
                                    background
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="pageInfo.pageNo_U"
                                    :page-sizes="pageInfo.pageSizes_U"
                                    :page-size="pageInfo.pageSize_U"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total=pageInfo.total_U>
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <el-divider content-position="left" ></el-divider>
                <span><label style="font-size: 18px;">已选择用户</label><label style="margin-left:20px;font-size: 12px;color:#909399"> 注：添加（重复或不存在）数据系统会自动过滤</label></span>
                <div>
                    <el-table
                            :data="addUserData"
                            height="400"
                            highlight-current-row
                            stripe style="width: 100%;margin-top: 15px;">
                        <el-table-column prop="user_id" label="会员ID" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="nick_name" label="昵称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <label v-if="scope.row.email" >{{scope.row.email}}</label>
                                <label v-else>无</label>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mobile" label="手机" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <label v-if="scope.row.mobile" >{{scope.row.mobile}}</label>
                                <label v-else>无</label>
                            </template>
                        </el-table-column>
                        <el-table-column prop="member_status" label="状态" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <label v-if="scope.row.status === 0" style="color:#E6A23C">停用</label>
                                <label v-if="scope.row.status === 1" style="color:#67C23A">启用</label>
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="操作" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-button icon="el-icon-delete" circle type="danger" size="mini" @click="delUserData(scope.$index,scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button v-if="is_edit == 0 || is_draft == 0" style="margin-top: 15px;width:80px;" size="small" type="primary" @click="success(1)" >确定</el-button>
                    <el-button v-if="is_edit == 0 || is_draft == 0" style="margin-top: 15px;" size="small" type="danger"  plain @click="cancel(5)" >移除全部</el-button>
                </div>
            </el-dialog>
            <!--商品列表-->
            <el-dialog title="商品列表" :visible.sync="show_goodslist"  width="65%" class="goods-window" :before-close="handleGoodsClose">
                <el-form :inline="true" :model="goods_form" ref="searchForm" class="demo-form-inline" style="height: 45px">
                    <el-form-item label="商品名称" prop="search_goods_name" style="margin-left: 10px;">
                        <el-input v-model="goods_form.search_goods_name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="assignSelect('search')">查询</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-table
                            ref="goodsTable"
                            :data="goodsData"
                            stripe style="width: 100%;"
                            height="550"
                            :empty-text="goodsTableText"
                            highlight-current-row
                            @select="handleSelectionChange1"
                            @select-all="handleSelectionClickAll1">
                        <el-table-column type="selection"  prop="goods_id" width="55" :selectable="selectable"></el-table-column>
                        <el-table-column fixed="left" prop="goods_id" label="商品ID">

                        </el-table-column>
                        <el-table-column label="商品图片" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <img :src="scope.row.goods_thumb_image" class="avatar" style="height: 40px;width: 40px">
                            </template>
                        </el-table-column>
                        <el-table-column fixed prop="goods_name" label="商品名称" show-overflow-tooltip></el-table-column>
                        <el-table-column fixed prop="goods_price" label="商品价格" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="create_time" label="创建时间" show-overflow-tooltip></el-table-column>
                    </el-table>
                    <div class="table-page" style="float: right;margin-top: 15px;">
                        <div class="block">
                            <el-pagination
                                    background
                                    @size-change="handleSizeChange1"
                                    @current-change="handleCurrentChange1"
                                    :current-page="pageInfo.pageNo_G"
                                    :page-sizes="pageInfo.pageSizes_G"
                                    :page-size="pageInfo.pageSize_G"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total=pageInfo.total_G>
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <el-divider content-position="left"></el-divider>
                <label style="font-weight: bold">已选择商品</label>
                <div style="margin-top: 20px">
                    <el-table
                            ref="goodsTables"
                            :data="addGoodsData"
                            style="width: 100%"
                            height="400"
                            highlight-current-row>
                        <el-table-column fixed="left" prop="goods_id" label="商品ID">
                        </el-table-column>
                        <el-table-column label="商品图片" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <img :src="scope.row.goods_thumb_image" class="avatar" style="height: 40px;width: 40px">
                            </template>
                        </el-table-column>
                        <el-table-column fixed prop="goods_name" label="商品名称" show-overflow-tooltip></el-table-column>
                        <el-table-column fixed prop="goods_price" label="商品价格" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="create_time" label="创建时间" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-button icon="el-icon-delete" circle type="danger" size="mini" @click="delGoodsData(scope.$index,scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button v-if="is_edit == 0 || is_draft == 0" style="margin-top: 15px;width:80px" size="small" type="primary" @click="success(2)" >确定</el-button>
                    <el-button v-if="is_edit == 0 || is_draft == 0" style="margin-top: 15px;" size="small" plain type="danger" @click="cancel(4)" >移除全部</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import PreviewImage from '@/components/PreviewImage'
    export default {
        data() {
            return {
                loading:false,
                multiple_props:{multiple: true,},
                //checked:true,
                multiple2:false,
                multiple3:true,
                //is_select_2:false,
                //is_select_3:false,
                show_goodslist:false,
                show_goodsclass:false,
                show_userbatch:false,
                is_edit:'',
                textareaRow:4,
                userTableText:'暂无数据',
                goodsTableText:'暂无数据',
                coupons_id:'',
                user_list:false,
                userData:[],
                checkboxData:'',
                selectedData:[],
                selectedData1:[],
                defaultUserId:[],
                defaultGoodsId:[],
                goodsList:[],
                phoneData:[],
                emailData:[],
                addGoodsData:[],
                category_range_options:[],
                addUserData:[],
                rules_user_list:[],
                rules_price_list:[],
                arr_user:[],
                give_user_list:[],
                goodsData:[],
                class_option:[],
                checkUserData:{},
                checkGoodsData:{},
                currentGoodsData:[],
                currentUserData:[],
                labelData:[],
                label_id:[],
                is_add:0,
                is_draft:0,
                value1:'',
                value2:'',

                labelUserList:[],
                register_time:'',
                is_disabled:false,
                clearable:false,
                goods_form:{search_goods_name:''},
            pageInfo:{
                    pageNo_G:1,
                    pageSizes_G:[10],
                    pageSize_G:10,
                    total_G:0,
                    pageNo_Gs:1,
                    pageSizes_Gs:[10],
                    pageSize_Gs:10,
                    total_Gs:0,
                    pageNo_U:1,
                    pageSizes_U: [10],
                    pageSize_U:10,
                    total_U:0,
                    pageNo_Us:1,
                    pageSizes_Us: [10],
                    pageSize_Us:10,
                    total_Us:0,
                },
                form: {
                    category_list:'',
                    category_range_value:[],
                    is_draft:'0',
                    name: '',
                    coupon_name:'',
                    resource: '',
                    remark: '',
                    coupon_type:0,
                    use_time_type_id:0,
                    goods_category_range:0,
                    use_limit_type:0,
                    platform:['1'],
                    receive_way:0,
                    requirement:3,
                    is_show:0,
                    limit_receive:1,
                    quantity:1,
                    start_price:'',
                    discount_price:'',
                    most_offer:'',
                    use_days_time:'',
                    task_id:[],
                    amount_receive:'',
                    shop_ids:[],
                    use_requirement:0,
                    goods_type:'',
                    goods_range_des:'',
                    user_ids:'',
                    goods_range:[],
                    nick_name:'',
                    mobile:'',
                    email:'',
                    user_id:'',
                    goods_name:'',
                    goods_id:'',
                    goods_class:'',
                    class_name:'',
                    mobiles:''
                },
                rules: {
                    coupon_name: [
                        { required: true, message: '请输入优惠券名称', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                    ],
                    platform: [
                        { required: true, message: '请选择领取平台', trigger: 'blur' },
                    ],
                    quantity:[
                        { required: true, message: '请输入发行量', trigger: 'blur' },
                    ],
                    use_days_time:[
                        { required: true, message: '请输入有效天数', trigger: 'blur' },
                    ],
                    task_id:[
                        { required: true, message: '请选择赠送规则', trigger: 'blur' },
                    ],
                    shop_ids:[
                        { required: true, message: '请选择使用店铺', trigger: 'blur' },
                    ],
                    limit_receive:[
                        { required: true, message: '请选择领取数量', trigger: 'blur' },
                    ],
                    goods_range_des:[
                        { required: true, message: '请输入商品范围说明', trigger: 'blur' },
                    ],
                    goods_range:[
                        { required: true, message: '请选择商品/品类', trigger: 'blur' },
                    ],
                    amount_receive:[
                        { required: true, message: '请输入消费满金额', trigger: 'blur' },
                    ],
                    selectedData:[
                        { required: true, message: '请选择用户信息', trigger: 'blur' },
                    ],
                    is_draft:[
                        { required: true},
                    ],
                }
            }
        },
        created(){
            this.$route.query.is_edit == 0 ? this.is_edit = 0 : this.is_edit = 1;
            this.iframeMsg = this.$route.query.is_edit == 0 ? '清空数据?' : '恢复上次保存数据？';
            if (this.$route.query.coupons_id) this.coupons_id = this.$route.query.coupons_id;
            if (this.$route.query.is_add) this.is_add = this.$route.query.is_add;
            if (this.$route.query.coupons_id) this.couponInfo();
            if (this.$route.query.coupons_status == 1 && this.$route.query.is_edit == 1) this.is_disabled = true;
            this.form.user_ids = '';

        },
        watch: {
          /*  class_option_2: function (data) {
                if (this.form.class_name_2) this.form.class_name_2 = [];
                if (this.form.class_name_3) this.form.class_name_3 = [];
                if (data.length === 0) this.is_select_3 = false;
            },
            class_option_3:function (data) {
                if (this.form.class_name_3) this.form.class_name_3 = [];
            }*/
        },
        methods: {
            async labelDatas(val){
              console.log(val);
            },
            async couponInfo(){
                //this.loading = true;
                let result = await this.$request.request(this.$API.common_api,{
                }, 'main', 'get', {
                    router_path: 'coupons/operation',
                    request_host:'COUPON_SERVER_HOST',
                    extra_url: `${this.coupons_id}`,
                    handle_desc:"查看优惠券详情;"+this.coupons_id
                });
                if (result.code === 200){
                    const formatDate = (time) => {
                        let times = time * 1000;
                        let date = new Date(times);
                        let Y = date.getFullYear() + '-';
                        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        let D = date.getDate() + ' ';
                        let h = date.getHours() + ':';
                        let m = date.getMinutes() + ':';
                        let s = date.getSeconds();
                        return Y+M+D+h+m+s
                    };
                    let arrs = [];
                    if (this.is_edit == 1 && result.data.requirement != 4 && result.data.give_user_list){
                        result.data.give_user_list.split(',').forEach((item,index)=>{
                            if (item != 0) arrs.push(item);
                        });
                    }
                    if (result.data.requirement == 4) {
                        this.label_id = result.data.give_user_list.split(',').map(Number);
                        this.receiveWhere(4);
                    }
                    this.selectedData = arrs.concat();
                    this.selectedData.forEach((item,index)=>{
                        this.checkUserData[item] = 1;
                    })
                    this.defaultUserId = arrs.concat().join(',');
                    this.form = result.data;
                    this.form.platform = result.data.platform ? result.data.platform.split(',') : [];
                    this.form.goods_category_range = result.data.platform ? parseInt(result.data.goods_category_range) : 0;
                    this.value2 = [formatDate(result.data.receive_start_time),formatDate(result.data.receive_end_time)];
                    this.value1 = [formatDate(result.data.use_start_time),formatDate(result.data.use_end_time)];
                    this.register_time = result.data.register_start_time > 0 ? [formatDate(result.data.register_start_time),formatDate(result.data.register_end_time)] : '';
                    this.form.task_id = result.data.task_id.split(',');
                    this.form.is_draft = result.data.is_draft.toString();
                    this.is_draft = result.data.is_draft.toString();
                    this.form.goods_name = result.data.goods_name ? result.data.goods_name : '';
                    this.form.goods_id = result.data.goods_id ? result.data.goods_id : '';
                    this.form.class_id = result.data.category_range ? result.data.category_range.split(',') : '';
                    this.form.use_days_time = result.data.use_days_time / 86400;
                    this.form.category_list = result.data.category_range;
                    let arr = [];
                    if (result.data.goods_category_range === 1 && result.data.goods_range){
                        JSON.parse(result.data.goods_range).forEach((item,index)=>{
                            arr.push(item['goods_id']);
                            // this.selectedData1.push(item['goods_id']);
                            //this.checkGoodsData[item['goods_id']] = 1;
                            //this.defaultGoodsId.push(item['goods_id']);
                        });
                    }
                    this.selectedData1 = arr.concat();
                    this.selectedData1.forEach((item,index)=>{
                        this.checkGoodsData[item['goods_id']] = 1;
                    })
                    this.defaultGoodsId = arr.concat().join(',');
                    if (result.data.goods_category_range === 2){
                        if (JSON.parse(result.data.category_range).length > 0){
                            let category_range_value = [];
                            let category_range_attr = [];
                            JSON.parse(result.data.category_range).forEach((item,index)=>{
                                if (item.category_id_1 && item.category_id_2 && item.category_id){
                                    category_range_value=[item.category_id_1,item.category_id_2,item.category_id]
                                }else if (item.category_id_1 && item.category_id && !item.category_id_2){
                                    category_range_value=[item.category_id_1,item.category_id]
                                }else if (!item.category_id_1 && item.category_id && !item.category_id_2) {
                                    category_range_value=[item.category_id]
                                }
                                category_range_attr.push(category_range_value);
                            });
                            this.form.category_range_value = category_range_attr;
                            await this.assignSelect(2,'');
                            this.loading = false;
                        }
                    }
                   // if (result.data.category_range) this.setaddGoodsData();
                    //if (result.data.give_user_list) this.setaddUserData();
                    //查询用户缓存
                    if (this.is_edit === 1 && this.selectedData.length > 0) {
                        //this.userCache();
                    }
                }
            },
            async setaddGoodsData(){
                if (this.selectedData1.length > 0){
                    let result = await this.$request.get(this.$API.common_api, {
                        goods_ids:'['+this.selectedData1.toString()+']',
                    } ,'main',{
                        router_path: 'user_goods/goods_list_info',
                        request_host: 'GOODS_SERVER_HOST',
                        handle_desc:"优惠券商品批量;"+this.coupons_id
                    });
                    if (result.code == 200 && result.data.results) this.addGoodsData = result.data.results;
                }
            },
            async setaddUserData(){
                if (this.selectedData.length > 0){
                    let result = await this.$request.get(this.$API.common_api, {
                        user_list:'['+this.selectedData+']',
                    } ,'main',{
                        router_path: 'user/nick_name',
                        request_host: 'MEMBER_USER_HOST',
                        handle_desc:"批量查询用户;"
                    });
                    if (result.code == 200 && result.data) this.addUserData = result.data;
                }
            },
            async onSubmit(form) {
                this.$refs[form].validate(async (valid) => {
                    if (valid) {
                        let check = this.checkField(this.form);
                        if (!check.state){
                            SendMessage({message: check.msg, type: 'error'});
                            return false;
                        }
                        let request = this.form.coupon_id ? 'POST' : 'PUT';
                        let path = this.form.coupon_id ? 'coupons/operation' : 'ss_specialOffer/coupons';
                        let use_start_time = this.value1 ? new Date(this.value1[0]).getTime() / 1000 : 0;//有效时间开始
                        let use_end_time = this.value1 ? new Date(this.value1[1]).getTime() / 1000 : 0;//有效时间结束
                        let receive_start_time = this.value2 ? new Date(this.value2[0]).getTime() / 1000 : 0;//领取时间开始
                        let receive_end_time = this.value2 ? new Date(this.value2[1]).getTime() / 1000 : 0;//领取时间结束
                        let register_start_time = this.form.task_id.indexOf('0') > -1 && this.register_time ? new Date(this.register_time[0]).getTime() / 1000 : 0;//注册开始时间
                        let register_end_time = this.form.task_id.indexOf('0') > -1 && this.register_time ? new Date(this.register_time[1]).getTime() / 1000 : 0;//注册结束时间
                        let use_days_time = this.form.use_days_time * 86400;//有效天数时间戳
                        let goods_range = [];
                        if (this.form.goods_category_range === 1)  goods_range = this.selectedData1;
                        if (this.form.goods_category_range === 2) {
                            this.form.category_range_value.forEach((item,index)=>{
                                if (item[0] && item[1] && item[2]) {
                                    goods_range.push({'category_id_1':item[0],'category_id_2':item[1],'category_id':item[2]});
                                }else if (item[0] && item[1]){
                                    goods_range.push({'category_id_1':item[0],'category_id':item[1]});
                                }else{
                                    goods_range.push({'category_id':item[0]});
                                }
                            });
                           /* console.log(this.form.class_name_2);
                            console.log(this.form.class_name_3);
                            if (this.form.class_name_2 && !this.form.class_name_3){
                                this.form.class_name_2.forEach((item,index)=>{
                                    goods_range.push({'category_id':item.id,'category_name':item.label,'checked':true});
                                });

                            }else if(this.form.class_name_3){
                                this.form.class_name_3.forEach((item,index)=>{
                                    goods_range.push({'category_id':item.id,'category_name':item.label,'checked':true});
                                });
                            }else if (this.form.class_name_1 && !this.form.class_name_2) {
                                goods_range.push({'category_id':this.form.class_name_1.id,'category_name':this.form.class_name_1.label,'checked':true});
                            }*/
                        }
                        if (this.form.goods_category_range === 2 && goods_range.length === 0) {
                            SendMessage({message: '请选择指定品类', type: 'warning'});
                            return false;
                        }
                        if (this.form.goods_category_range === 1 && this.selectedData1.length === 0) {
                            SendMessage({message: '请选择指定商品', type: 'warning'});
                            return false;
                        }

                        if (this.form.is_draft == 1 && this.form.requirement === 3 && this.selectedData.length < 1 && this.selectedData[0] != 0) {
                            SendMessage({message: '请选择指定用户', type: 'warning'});
                            return false;
                        }
                        if(this.form.requirement === 4 && this.label_id.length < 1 ){
                            SendMessage({message: '请选择用户标签', type: 'warning'});
                            return false;
                        }
                        goods_range = this.form.goods_category_range === 2 ? JSON.stringify(goods_range) : this.form.category_list;
                        if (this.goodsList.length < 1){
                            this.selectedData1.forEach((item,index)=>{
                                this.goodsList.push({'goods_id':item});
                            });
                        }
                        let param = {
                            'use_start_time':use_start_time,
                            'use_end_time':use_end_time,
                            'receive_start_time':receive_start_time,
                            'receive_end_time':receive_end_time,
                            'register_start_time':register_start_time,
                            'register_end_time':register_end_time,
                            'use_days_time':use_days_time,
                            'coupon_name':this.form.coupon_name,
                            'coupon_type':this.form.coupon_type,
                            'shop_id':0,
                            'start_price':this.form.start_price ? this.form.start_price : 0,
                            'discount_price':this.form.discount_price ? this.form.discount_price : 0,
                            'platform':this.form.platform.join(','),
                            'quantity':this.form.quantity,
                            'use_time_type_id':this.form.use_time_type_id,
                            'use_limit_type':this.form.use_limit_type,
                            'shop_ids':typeof this.form.shop_ids ==='object' && this.form.shop_ids.length > 0 ? this.form.shop_ids.join(',') : 0,
                            'most_offer':this.form.most_offer ? this.form.most_offer : 0,
                            'use_requirement':this.form.use_requirement,
                            'requirement':this.form.requirement,
                            'task_id':typeof this.form.task_id ==='object' && this.form.task_id.length > 0 ? this.form.task_id.join(',') : 0,
                            'is_show':this.form.is_show,
                            'limit_receive':this.form.limit_receive,
                            'remark':this.form.remark,
                            'receive_way':this.form.receive_way,
                            'goods_range':this.form.goods_category_range === 1 ? JSON.stringify(this.goodsList) : 0,
                            'goods_category_range':this.form.goods_category_range.toString(),
                            'category_range':this.form.goods_category_range === 2 ? goods_range : 0,
                            'goods_range_des':this.form.goods_range_des,
                            'amount_receive':this.form.amount_receive ? this.form.amount_receive : '0.00',
                            'is_draft':this.form.is_draft,
                            'give_user_list':'0'
                        };
                        if (this.form.requirement == 4) await this.getuserLabel();
                        if (this.selectedData.length > 0 && this.form.requirement == 3) param['give_user_list'] = this.selectedData.join(',');
                        if (this.label_id.length > 0 && this.form.requirement == 4) param['give_user_list'] = this.label_id.join(',');
                        if (this.label_id.length > 0 && this.form.requirement == 4) param['label_user_list'] = this.labelUserList.join(',');
                        //param['give_user_list'] = this.form.is_draft == 1 && this.selectedData.length > 0 ? this.selectedData.join(',') : '0';
                        let result = await this.$request.request(this.$API.common_api,param, 'main', request, {
                            router_path: path,
                            request_host:'COUPON_SERVER_HOST',
                            extra_url: request === 'PUT' ? '' : this.form.coupon_id,
                            handle_desc:"编辑优惠券;"+this.form.coupon_id
                        });
                        result.code === 200 && this.$router.push({name:'/coupon/coupon'});
                        if (this.form.is_draft == 1) this.sendMessage();
                    } else {
                        return false;
                    }
                });
            },
            /*handleChange(value,type) {
                if (type === 2){
                    this.goods_ranges = [value.id];
                    this.class_option_2 = [];
                    this.class_option_3 = [];
                    this.is_select_2 = false;
                    this.is_select_3 = false;
                    this.multiple2 = false;
                    if (this.class_option.length > 0){
                        this.class_option.forEach((item,index)=>{
                            if (item.id === value.  id){
                                this.class_option_2 = item.children;
                                if (item.children.length > 0) this.is_select_2 = true;
                                if (item.children.length > 0 && item.children[0].is_end === 1) this.multiple2 = true;
                            }
                        });
                    }

                }
                if (type === 3){
                    this.goods_ranges = [value.id];
                    this.class_option_3 = [];
                    this.is_select_3 = false;
                    if (this.class_option_2.length > 0){
                        this.class_option_2.forEach((item,index)=>{
                            if (item.id === value.id){
                                this.class_option_3 = item.children;
                                if (item.children.length > 0) this.is_select_3 = true;
                            }
                        });
                    }
                }
                if (type === 4)  this.goods_ranges = [value.id];
            },*/
            async getuserLabel(){
                let userList = await this.$request.get(this.$API.common_api,{
                }, 'main', {
                    router_path: 'operating/label',
                    request_host:'MEMBER_USER_HOST',
                    handle_desc:"获取标签所有用户;"
                });
                let label_user_list = [];
                if (userList.code == 200 && userList.data){
                    this.label_id.forEach((labelId)=>{
                        if (userList.data[labelId]){
                            userList.data[labelId].forEach((item,key)=>{
                                label_user_list.push(item.user_id)
                            })
                        }
                    })
                }
                this.labelUserList = label_user_list.length > 0 ? label_user_list : [];
            },
            async sendMessage(){
                await this.setaddUserData();
                let time = ((new Date()).getTime() + this.form.use_days_time * 86400000)/1000;
                let dateTime = this.form.use_time_type_id == 1 ? this.$common.formatDate(time) : this.value1[1];
                if (this.addUserData.length > 0){
                    let sms_param = {};
                    sms_param['routing_key'] = 'sms_1';
                    sms_param['content'] = {'dateTime':1};
                    sms_param['target_list'] = [];
                    this.addUserData.forEach((row, index) => {
                        if (row['mobile']) sms_param['target_list'].push({'target':row['mobile'], 'content':{'dateTime':dateTime}});
                    });
                    console.log(sms_param);
                    await this.$request.request(this.$API.send_sms, {'data':JSON.stringify(sms_param),'type':1}, 'main', 'GET',{handle_desc:`发送优惠券短信;${this.form.coupon_id}`});
                }
                if (this.addUserData.length > 0){
                    let email_param = {};
                    email_param['target_list'] = [];
                    this.addUserData.forEach((row, index) => {
                        if (row['email']){
                            let subject = '拍拍印送您一张 '+this.form.coupon_name+' 优惠券';
                            let content = '尊敬的拍拍印用户，您好！您有一张新的优惠券，有效使用期至'+dateTime+'，请注意在期限前使用哦！。点击前往立即使用。链接地址：'+CUSTOM_CONFIG.PPY_HOST;
                            email_param['target_list'].push({'target':row['email'],'subject':subject,'content':content});
                        }
                    });
                    await this.$request.request(this.$API.send_email, {'data':email_param}, 'main', 'POST',{
                        handle_desc:`发送优惠券短信;${this.form.coupon_id}`
                    });
                }
            },
            async userCache(){
                let param = {'data':this.selectedData};
                let userCache = await this.$request.request(this.$API.get_user, param, 'main', 'POST',{
                    handle_desc:`获取优惠券发送用户信息;${this.form.coupon_id}`
                });
            },
            async priceType(val){
                this.form.start_price = '';
                this.form.discount_price = '';
                this.form.most_offer = '';
            },
            async success(val){
                if (val == 1) {
                    this.user_list = false;
                    this.pageInfo.pageNo_U = 1;
                }
                if (val == 2) {
                    let goodsList = [];
                    this.selectedData1.forEach((item,index)=>{
                        goodsList.push({'goods_id':item});
                    });
                    this.goodsList = goodsList;
                    this.pageInfo.pageNo_G = 1;
                    this.show_goodslist = false;
                }
                if (val == 3 && this.show_userbatch) {
                    let mobilesCheck = true;
                    let mobilesList = [];
                    if (this.form.mobiles) {
                        mobilesList = this.form.mobiles.split(',');
                        for (let i = 0; i < mobilesList.length; i++) {
                            if (!(/^1[23456789]\d{9}$/.test(mobilesList[i]))){
                                SendMessage({message: '手机'+mobilesList[i]+' 格式错误！', type: 'error'});
                                mobilesCheck = false;
                                break;
                            }
                        }
                    }
                    if (!this.form.mobiles) {
                        SendMessage({message: '请输入手机号码！', type: 'error'});
                        mobilesCheck = false;
                    }
                    if (mobilesCheck){
                        let result = await this.$request.get(this.$API.common_api, {
                            page:this.pageInfo.pageNo_Us ? this.pageInfo.pageNo_Us : 1,
                            page_size:this.pageInfo.pageSize_Us,
                            mobile_list:'['+this.form.mobiles+']',
                        } ,'main',{
                            router_path: 'mobile/get_user',
                            request_host: 'MEMBER_USER_HOST',
                            handle_desc:"手机批量添加用户;"
                        });
                        if (result.code === 200 && result.data.total && this.show_userbatch){
                            result.data.data.forEach((item=>{
                                if (!this.checkUserData[item.user_id]){
                                    this.checkUserData[item.user_id] = 1;
                                    this.selectedData.push(item.user_id);
                                    this.addUserData.push(item)
                                }
                            }));
                            this.pageInfo.total_Us = result.data.total;
                        }
                    }
                }
            },
            cancel(val){
                console.log('取消值=>'+val);
                if (val == 1){
                    this.user_list = false;
                    this.selectedData = [];
                    this.phoneData = [];
                    this.emailData = [];
                }
                if (val == 3){
                    this.form.mobiles = ''
                }
                if (val == 4){
                    this.currentGoodsData.forEach((item,index)=>{
                        if (this.checkGoodsData[item['goods_id']] == 1){
                            this.goodsData.push(item);
                        }
                    });
                    this.selectedData1 = [];
                    this.addGoodsData = [];
                    this.checkGoodsData = [];
                }
                if (val == 5){
                    this.currentUserData.forEach((item,index)=>{
                        if (this.checkUserData[item['user_id']] == 1){
                            this.userData.push(item);
                        }
                    });
                    this.selectedData = [];
                    this.addUserData = [];
                    this.checkUserData = [];

                }
            },
            delUserData(val,row){
                let hasSame = false;
                let index = 0;
                if (this.selectedData.length > 0){
                    this.selectedData.forEach((item, indexs) => {
                        if (item == row['user_id']){
                            hasSame = true;
                            index = indexs;
                        }
                    });
                }else{
                    hasSame = true;
                }
                let that = this;
                if (hasSame) {
                    that.selectedData.splice(index,1);
                    delete that.checkUserData[row['user_id']];
                    that.addUserData.splice(val,1);
                    that.currentUserData.forEach((item,index)=>{
                        if (item['user_id'] == row['user_id']){
                            console.log('当前页可以PUSH');
                            that.userData.push(row);
                        }
                    });
                } else {
                    this.addUserData.splice(val,1);
                }
            },
            delGoodsData(val,row){
                let hasSame = false;
                let index = 0;
                if (this.selectedData1.length > 0){
                    this.selectedData1.forEach((item, indexs) => {
                        if (item == row['goods_id']){
                            hasSame = true;
                            index = indexs;
                        }
                    });
                }
                let that = this;
                if (hasSame) {
                    that.selectedData1.splice(index,1);
                    delete that.checkGoodsData[row['goods_id']];
                    that.addGoodsData.splice(val,1);
                    that.currentGoodsData.forEach((item,index)=>{
                       if (item['goods_id'] == row['goods_id']){
                           console.log('当前页可以PUSH');
                           that.goodsData.push(row);
                       }
                    });
                    console.log(this.defaultGoodsId);
                } else {
                    this.addGoodsData.splice(val,1);
                }
            },
            checkMobiles(val){
                this.form.mobiles = val.replace(/[^\d,]/g,'');
            },
            useWhere(val){
                this.priceType();
            },
            async handleGoodsClose(){
                //if (this.selectedData1.length > 0){
                    this.$confirm(this.iframeMsg)
                        .then(_ => {
                            this.selectedData1 = this.is_edit === 0 ? [] : this.defaultGoodsId.split(',');
                            if (this.defaultGoodsId.length > 0){
                                this.checkGoodsData = {};
                                this.defaultGoodsId.split(',').forEach((item,index)=>{
                                    this.checkGoodsData[item] = 1;
                                });
                            }else{
                                this.checkGoodsData = {};
                            }
                            this.addGoodsData = [];
                            this.show_goodslist = false;
                        })
                        .catch(_ => {});
                /*}else{
                    this.show_goodslist = false;
                }*/

            },
            async handleUserClose(){
                //if (this.selectedData.length > 0  && this.selectedData[0] !== 0){
                    this.$confirm(this.iframeMsg)
                        .then(_ => {
                            this.user_list = false;
                            console.log(this.defaultUserId);
                            this.selectedData = this.is_edit == 1 && this.defaultUserId.split(',') ? this.defaultUserId.split(',') : [];
                            if (this.defaultUserId.length > 0){
                                this.checkUserData = {};
                                this.defaultUserId.split(',').forEach((item,index)=>{
                                    this.checkUserData[item] = 1;
                                });
                            }else{
                                this.checkUserData = {};
                            }
                            this.addUserData = [];
                        })
                        .catch(_ => {});
                //}else{
                    //this.user_list = false;
                //}
            },
            async assignSelect(val){
                if (val !== 'search') this.form.goods_category_range = val;
                if (val === 1 || val === 'search') {
                    this.show_goodslist = true;
                    if (val === 'search') this.pageInfo.pageNo_G = 1;
                    let result = await this.$request.get(this.$API.common_api, {
                        page:this.pageInfo.pageNo_G,
                        page_size:this.pageInfo.pageSize_G,
                        goods_name:this.goods_form.search_goods_name ? this.goods_form.search_goods_name : '',
                    } ,'main',{
                        router_path: 'goods/goods',
                        request_host: 'GOODS_SERVER_HOST',
                        handle_desc:"优惠券商品搜索;"
                    });
                    this.setaddGoodsData();
                    this.selectedData1.forEach((item1,index1)=>{
                        this.checkGoodsData[item1] = 1;
                    });
                    this.goodsData = result.code === 200 ? result.data : [];
                    this.currentGoodsData = result.data.concat();
                    this.goodsData = this.goodsData.filter(item => this.checkGoodsData[item['goods_id']] != 1 );
                    this.pageInfo.total_G = result.total;
                    this.form.class_name = '';
                    this.form.class_id = '';
                    if (this.goods_form.search_goods_name){
                        if (result.data.length == 0) this.goodsTableText = '暂无数据';
                        if (result.data.length > 0){
                            result.data.forEach((sitem,sindex)=>{
                                if (this.checkGoodsData[sitem['goods_id']] == 1){
                                    this.goodsTableText = '【搜索内容】已加入选中列表';
                                }
                            })
                        }
                    }else{
                        if (this.goodsData.length == 0) this.goodsTableText = '【当前页数据】已加入选中列表';
                    }
                }
                if (val == 2) {
                    this.show_goodsclass = true;
                    let {data} = await this.$request.request(this.$API.common_api, {
                        category_device: 0,
                        category_type: 0,
                    }, 'main', 'GET', {
                        router_path: 'goods/goods_category',
                        request_host:'GOODS_CATEGORY',
                        handle_desc:"优惠券平台分类信息;"
                    });
                    data.forEach((item,index)=>{
                        data[index].value = item.id;
                        if (item.children && item.children.length === 0) delete data[index]['children'];
                        if(item.status) data[index].disabled = (item.status === 1 ? true : false);
                        if(item.children && item.children.length){
                            item.children.forEach((item2,index2)=>{
                                if (item2.children.length === 0) delete data[index]['children'][index2]['children'];
                                data[index]['children'][index2].value = item2.id
                                if(item2.status) data[index]['children'][index2].disabled = (item2.status === 1 ? true : false);
                                if(item2.children && item2.children.length > 0){
                                    item2.children.forEach((item3,index3)=>{
                                        data[index]['children'][index2]['children'][index3].value = item3.id
                                        if(item3.status) data[index]['children'][index2]['children'][index3].disabled = (item3.status === 1 ? true : false)
                                        delete data[index]['children'][index2]['children'][index3]['children']
                                    })
                                }
                            })
                        }
                    });
                    this.category_range_options = data;
                    this.form.goods_name = '';
                    this.form.goods_id = '';
                }
            },
            useTime(val){
                if (val === '1') this.form.value1 = '';
                if (val === '0') this.form.use_days_time = '';
            },
            userscopeList(val){
                if (val == '0') this.form.shop_ids = '';
            },
            receiveType(val){
                if (val === 0) {
                    this.form.requirement = 3;
                    this.form.task_id = [];
                }
                if (val === 1) {
                    this.form.requirement = 0;
                }
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.userList();
            },
            handleCurrentChange(val){
                this.pageInfo.pageNo_U = val;
                this.userList();
            },
            handleSizeChange1(val){
                this.pageInfo.pageSize_G = val;
            },
            handleCurrentChange1(val){
                this.pageInfo.pageNo_G = val;
                this.assignSelect(1,val);
            },
            handleSelectionChange(selection, row) {
                this.userData.forEach((rows,index)=>{
                    if (rows['user_id'] == row['user_id']){
                        this.userData.splice(index,1);
                    }
                });
                this.selectedData.push(row['user_id']);
                this.addUserData.push(row);
                this.checkUserData[row['user_id']] = 1;
            },
            handleSelectionClickAll(){
                this.userData.forEach((rows,index)=>{
                    this.selectedData.push(rows['user_id']);
                    this.addUserData.push(rows);
                    this.checkUserData[rows['user_id']] = 1;
                });
                this.userData = [];
                this.userTableText = '【当前页数据】已加入选中列表';
            },
            handleSelectionChange1(selection, row) {
                this.goodsData.forEach((rows,index)=>{
                    if (rows['goods_id'] == row['goods_id']){
                        this.goodsData.splice(index,1);
                    }
                });
                this.selectedData1.push(row['goods_id']);
                this.addGoodsData.push(row);
                this.checkGoodsData[row['goods_id']] = 1;
            },
            handleSelectionClickAll1(){
                this.goodsData.forEach((rows,index)=>{
                    this.selectedData1.push(rows['goods_id']);
                    this.addGoodsData.push(rows);
                    this.checkGoodsData[rows['goods_id']] = 1;
                });
                this.goodsData = [];
                this.goodsTableText = '【当前页数据】已加入选中列表';
            },
            selectable(){
                if (this.is_edit == 1 && this.form.is_draft == 1) return false;
                if (this.is_edit == 0 || this.form.is_draft == 0) return true;
            },
            goBack(){
                this.$router.push('/coupon/coupon?use_limit_type='+this.form.use_limit_type);
            },
            async userList(val){
                this.user_list = true;
                this.show_userbatch = false;
                let param = {};
                if (val === 'search')  this.pageInfo.pageNo_U = 1;
                param['page'] = this.pageInfo.pageNo_U;
                param['page_size'] = this.pageSize;
                param['email'] = this.form.email ? this.form.email : '';
                param['mobile'] = this.form.mobile ? this.form.mobile : '';
                param['nick_name'] = this.form.nick_name ? this.form.nick_name : '';
                param['user_id'] = this.form.user_id ? this.form.user_id : '';
                let {data} = await this.$request.request(this.$API.common_api,param, 'main', 'GET', {
                    router_path: 'zt/users',
                    request_host:'MEMBER_USER_HOST',
                    handle_desc:"优惠券用户选择;"+this.form.user_id ? this.form.user_id : '列表'
                });
                this.userData = data.data;
                this.pageInfo.total_U = data['page_total'];
                this.setaddUserData();
                this.selectedData.forEach((item1,index1)=>{
                    this.checkUserData[item1] = 1;
                });
                this.userData = this.userData.filter(item => this.checkUserData[item['user_id']] !== 1 );
                if (data.data.length > 0){
                    this.currentUserData = data.data.concat();
                    if (!val) {
                        if (this.userData.length == 0) this.userTableText = '【当前页数据】已加入选中列表';
                    }else{
                        data.data.forEach((sitem,sindex)=>{
                            if (this.checkUserData[sitem['user_id']] == 1){
                                this.userTableText = '【搜索内容】已加入选中列表';
                            }
                        })
                    }
                }else{
                    this.userTableText = '暂无数据';
                }
            },
            async addMobiles(){
                this.user_list = true;
                this.show_userbatch = true;
                if (this.selectedData.length > 0){
                    this.setaddUserData();
                    this.selectedData.forEach((item,index)=>{
                        this.checkUserData[item] = 1;
                    });
                }
            },
            userListcheck(){
                SendMessage({message: '编辑优惠券不可以修改赠送的用户信息', type: 'warning'});
            },
            async receiveWhere(val){
                this.form.task_id = [];
                this.form.user_ids = '';
                this.form.amount_receive = '';
                this.form.goods_range = [];
                if (val == 4){
                    var labelData = await this.$request.get(this.$API.common_api,{
                        label_name:''
                    }, 'main', {
                        router_path: 'label/name',
                        request_host:'MEMBER_USER_HOST',
                        handle_desc:"获取用户标签;"
                    });
                    this.labelData = labelData.data;
                }
            },
            onClear(form){
                if (this.coupons_id){
                    this.couponInfo();
                }else {
                    this.$refs[form].resetFields();
                    this.form.start_price = '';
                    this.form.discount_price = '';
                    this.form.most_offer = '';
                    this.form.quantity = '';
                    this.form.value1 = '';
                    this.form.use_days_time = '';
                    this.form.value2 = '';
                }
            },
            checkField(data){
                let result = {};
                result['state'] = true;

                if (this.form.platform.length == 0) {
                    result['state'] = false;
                    result['msg'] = '请选择领取平台';
                }
                if (data.goods_category_range == 1 && this.selectedData1.length === 0) {
                    result['state'] = false;
                    result['msg'] = '请选择指定商品';
                }
                if (data.requirement == 2 && data.task_id.length < 1) {
                    result['state'] = false;
                    result['msg'] = '请选择规则';
                }
                if (data.discount_price < 0){
                    result['state'] = false;
                    result['msg'] = '请输入正确的使用条件';
                }
                if (data.use_requirement == 1 && data.most_offer == ''){
                    result['state'] = false;
                    result['msg'] = '请输入正确的使用条件';
                }
                if (data.use_time_type_id ==0 && !this.value1){
                    result['state'] = false;
                    result['msg'] = '请输入有效期';
                }
                if (data.use_time_type_id ==1 && !data.use_days_time){
                    result['state'] = false;
                    result['msg'] = '请输入有效天数';
                }
                if (!this.value2){
                    result['state'] = false;
                    result['msg'] = '请输入领取时间';
                }
                if (this.form.requirement == 2 && this.form.task_id.indexOf('0') > -1 ){
                    if((this.register_time && this.register_time.length == 0) || !this.register_time){
                        result['state'] = false;
                        result['msg'] = '请输入注册时间';
                    }
                }

                /* if (this.value2[0] < this.value1[0]){
                     result['state'] = false;
                     result['msg'] = '领取时间不可大于使用时间';

                 }*/
                return result;
            },
            userRules(val){},
            receiveOpen(val){},
            goodsScope(val){},
            userformList(val){},
            goods_search(data){},
        },
    }
</script>

<style lang="less" scoped>
    @import "../../assets/pageHeader";
    .form_content{
        margin: 15px;
        background-color: #ffffff;
    }
    .el-form-item{
        // margin-bottom:12px;
    }
    .el-divider__text{
        font-size: 16px;
        font-weight: bold;
    }
    .el-divider--horizontal {
        height: 2px;
        margin-top: 60px;
    }
    .el-icon-user-solid{
        color: #409EFF;
        position:relative;
        bottom: 20px;
        font-size: 17px;
    }
</style>