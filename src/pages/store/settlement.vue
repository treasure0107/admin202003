<template>
    <div class="content">
<!--        <div class="pages-header">-->
<!--            <div>商家结算</div>-->
<!--        </div>-->
        <div class="form-search">
            <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="店铺名称" prop="shop_name">
                    <el-input v-model="formInline.shop_name" placeholder="店铺名称" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="订单号" prop="order_sn">
                    <el-input v-model="formInline.order_sn" placeholder="订单号" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="日期" prop="create_time">
                    <el-date-picker
                            v-model="formInline.create_time"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right" size="mini">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="支付类型" prop="pay_type">
                    <el-select v-model="formInline.pay_type" size="mini">
                        <el-option
                            v-for="item in payTypeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">筛选</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" @click="exportOrder">导出订单</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="text" @click="resetForm('formInline')" size="mini">清空筛选条件</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-content">
            <el-tabs v-model="activeName" @tab-click="handleClick" class="white order_tabs" v-loading="loading">
                <el-tab-pane :label="tabAll" name="all" >
                    <el-table ref="all" :data="tableData.data" height="750" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号"></el-table-column>
                        <el-table-column prop="shop_name" label="店铺名称"></el-table-column>
                        <el-table-column prop="create_time" label="订单结算时间" width="155"></el-table-column>
                        <el-table-column label="支付类型">
                            <template slot-scope="scope">
                                {{ payType[scope.row.pay_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="pay_sn" label="支付流水号"></el-table-column>
                        <el-table-column label="订单总金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.order_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="商家优惠金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.shop_coupons_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="平台优惠金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.mall_coupons_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="优惠合计">
                            <template slot-scope="scope">
                                ¥{{ scope.row.coupons_total_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="买家应付金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.should_pay_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="买家实付金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.actual_pay_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="平台补贴金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.mall_allowance_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="计算机服务费的交易金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.service_total_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="技术服务费比例">
                            <template slot-scope="scope">
                                {{ floatMul(scope.row.commission,100) }}%
                            </template>
                        </el-table-column>
                        <el-table-column prop="service_total_money" label="技术服务费金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.service_money}}
                            </template>
                        </el-table-column>
                        <el-table-column label="退款金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.return_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="分销佣金">
                            <template slot-scope="scope">
                                ¥{{ scope.row.brokerage }}
                            </template>
                        </el-table-column>

                        <el-table-column label="系统结算金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.settlement_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="结算状态">
                            <template slot-scope="scope">
                                {{ settlementStatus[scope.row.pay_status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="对账结果">
                            <template slot-scope="scope">
                                {{ payResult[scope.row.pay_result] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="92">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-tooltip class="item" effect="dark" content="处理" placement="top">
                                        <el-button type="primary" icon="el-icon-edit" circle @click="clickJump({ path:'/store/settlementDetail?type=edit&id='+scope.row.id })" content="处理" size="mini" v-if="scope.row.pay_status == 0 || scope.row.pay_status == 3"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="查看" placement="top">
                                        <el-button icon="el-icon-document" circle @click="clickJump({ path:'/store/settlementDetail?id='+scope.row.id })" content="操作日志" size="mini"></el-button>
                                    </el-tooltip>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="tabName[0]" name="waitHandle">
                    <el-table ref="waitHandle" :data="tableData.data" height="750" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号"></el-table-column>
                        <el-table-column prop="shop_name" label="店铺名称"></el-table-column>
                        <el-table-column prop="create_time" label="订单结算时间" width="155"></el-table-column>
                        <el-table-column label="支付类型">
                            <template slot-scope="scope">
                                {{ payType[scope.row.pay_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="pay_sn" label="支付流水号"></el-table-column>
                        <el-table-column label="订单总金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.order_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="商家优惠金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.shop_coupons_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="平台优惠金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.mall_coupons_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="优惠合计">
                            <template slot-scope="scope">
                                ¥{{ scope.row.coupons_total_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="买家应付金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.should_pay_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="买家实付金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.actual_pay_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="平台补贴金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.mall_allowance_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="计算机服务费的交易金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.service_total_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="技术服务费比例">
                            <template slot-scope="scope">
                                {{ floatMul(scope.row.commission,100) }}%
                            </template>
                        </el-table-column>
                        <el-table-column prop="service_total_money" label="技术服务费金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.service_money}}
                            </template>
                        </el-table-column>
                        <el-table-column label="退款金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.return_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="分销佣金">
                            <template slot-scope="scope">
                                ¥{{ scope.row.brokerage }}
                            </template>
                        </el-table-column>
                        <el-table-column label="系统结算金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.settlement_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="结算状态">
                            <template slot-scope="scope">
                                {{ settlementStatus[scope.row.pay_status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="对账结果">
                            <template slot-scope="scope">
                                {{ payResult[scope.row.pay_result] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="92">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-tooltip class="item" effect="dark" content="处理" placement="top">
                                        <el-button type="primary" icon="el-icon-edit" circle @click="clickJump({ path:'/store/settlementDetail?type=edit&id='+scope.row.id })" content="处理" size="mini" v-if="scope.row.pay_status == 0 || scope.row.pay_status == 3"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="查看" placement="top">
                                        <el-button icon="el-icon-document" circle @click="clickJump({ path:'/store/settlementDetail?id='+scope.row.id })" content="操作日志" size="mini"></el-button>
                                    </el-tooltip>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="tabName[3]" name="waitReview">
                    <el-table ref="waitReview" :data="tableData.data" height="750" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号"></el-table-column>
                        <el-table-column prop="shop_name" label="店铺名称"></el-table-column>
                        <el-table-column prop="create_time" label="订单结算时间" width="155"></el-table-column>
                        <el-table-column label="支付类型">
                            <template slot-scope="scope">
                                {{ payType[scope.row.pay_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="pay_sn" label="支付流水号"></el-table-column>
                        <el-table-column label="订单总金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.order_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="商家优惠金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.shop_coupons_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="平台优惠金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.mall_coupons_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="优惠合计">
                            <template slot-scope="scope">
                                ¥{{ scope.row.coupons_total_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="买家应付金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.should_pay_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="买家实付金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.actual_pay_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="平台补贴金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.mall_allowance_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="计算机服务费的交易金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.service_total_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="技术服务费比例">
                            <template slot-scope="scope">
                                {{ floatMul(scope.row.commission,100) }}%
                            </template>
                        </el-table-column>
                        <el-table-column prop="service_total_money" label="技术服务费金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.service_money}}
                            </template>
                        </el-table-column>
                        <el-table-column label="退款金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.return_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="分销佣金">
                            <template slot-scope="scope">
                                ¥{{ scope.row.brokerage }}
                            </template>
                        </el-table-column>
                        <el-table-column label="系统结算金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.settlement_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="结算状态">
                            <template slot-scope="scope">
                                {{ settlementStatus[scope.row.pay_status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="对账结果">
                            <template slot-scope="scope">
                                {{ payResult[scope.row.pay_result] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="92">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-tooltip class="item" effect="dark" content="处理" placement="top">
                                        <el-button type="primary" icon="el-icon-edit" circle @click="clickJump({ path:'/store/settlementDetail?type=edit&id='+scope.row.id })" content="处理" size="mini" v-if="scope.row.pay_status == 0 || scope.row.pay_status == 3"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="查看" placement="top">
                                        <el-button icon="el-icon-document" circle @click="clickJump({ path:'/store/settlementDetail?id='+scope.row.id })" content="操作日志" size="mini"></el-button>
                                    </el-tooltip>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="tabName[2]" name="settled">
                    <el-table ref="settled" :data="tableData.data" height="750" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号"></el-table-column>
                        <el-table-column prop="shop_name" label="店铺名称"></el-table-column>
                        <el-table-column prop="create_time" label="订单结算时间" width="155"></el-table-column>
                        <el-table-column label="支付类型">
                            <template slot-scope="scope">
                                {{ payType[scope.row.pay_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="pay_sn" label="支付流水号"></el-table-column>
                        <el-table-column label="订单总金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.order_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="商家优惠金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.shop_coupons_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="平台优惠金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.mall_coupons_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="优惠合计">
                            <template slot-scope="scope">
                                ¥{{ scope.row.coupons_total_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="买家应付金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.should_pay_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="买家实付金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.actual_pay_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="平台补贴金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.mall_allowance_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="计算机服务费的交易金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.service_total_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="技术服务费比例">
                            <template slot-scope="scope">
                                {{ floatMul(scope.row.commission,100) }}%
                            </template>
                        </el-table-column>
                        <el-table-column prop="service_total_money" label="技术服务费金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.service_money}}
                            </template>
                        </el-table-column>
                        <el-table-column label="退款金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.return_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="分销佣金">
                            <template slot-scope="scope">
                                ¥{{ scope.row.brokerage }}
                            </template>
                        </el-table-column>
                        <el-table-column label="系统结算金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.settlement_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="结算状态">
                            <template slot-scope="scope">
                                {{ settlementStatus[scope.row.pay_status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="对账结果">
                            <template slot-scope="scope">
                                {{ payResult[scope.row.pay_result] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="92">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-tooltip class="item" effect="dark" content="处理" placement="top">
                                        <el-button type="primary" icon="el-icon-edit" circle @click="clickJump({ path:'/store/settlementDetail?type=edit&id='+scope.row.id })" content="处理" size="mini" v-if="scope.row.pay_status == 0 || scope.row.pay_status == 3"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="查看" placement="top">
                                        <el-button icon="el-icon-document" circle @click="clickJump({ path:'/store/settlementDetail?id='+scope.row.id })" content="操作日志" size="mini"></el-button>
                                    </el-tooltip>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="tabName[4]" name="nonSettlement">
                    <el-table ref="nonSettlement" :data="tableData.data" height="750" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号"></el-table-column>
                        <el-table-column prop="shop_name" label="店铺名称"></el-table-column>
                        <el-table-column prop="create_time" label="订单结算时间" width="155"></el-table-column>
                        <el-table-column label="支付类型">
                            <template slot-scope="scope">
                                {{ payType[scope.row.pay_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="pay_sn" label="支付流水号"></el-table-column>
                        <el-table-column label="订单总金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.order_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="商家优惠金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.shop_coupons_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="平台优惠金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.mall_coupons_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="优惠合计">
                            <template slot-scope="scope">
                                ¥{{ scope.row.coupons_total_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="买家应付金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.should_pay_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="买家实付金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.actual_pay_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="平台补贴金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.mall_allowance_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="计算机服务费的交易金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.service_total_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="技术服务费比例">
                            <template slot-scope="scope">
                                {{ floatMul(scope.row.commission,100) }}%
                            </template>
                        </el-table-column>
                        <el-table-column prop="service_total_money" label="技术服务费金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.service_money}}
                            </template>
                        </el-table-column>
                        <el-table-column label="退款金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.return_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="分销佣金">
                            <template slot-scope="scope">
                                ¥{{ scope.row.brokerage }}
                            </template>
                        </el-table-column>
                        <el-table-column label="系统结算金额">
                            <template slot-scope="scope">
                                ¥{{ scope.row.settlement_money }}
                            </template>
                        </el-table-column>
                        <el-table-column label="结算状态">
                            <template slot-scope="scope">
                                {{ settlementStatus[scope.row.pay_status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="对账结果">
                            <template slot-scope="scope">
                                {{ payResult[scope.row.pay_result] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="92">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-tooltip class="item" effect="dark" content="处理" placement="top">
                                        <el-button type="primary" icon="el-icon-edit" circle @click="clickJump({ path:'/store/settlementDetail?type=edit&id='+scope.row.id })" content="处理" size="mini" v-if="scope.row.pay_status == 0 || scope.row.pay_status == 3"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="查看" placement="top">
                                        <el-button icon="el-icon-document" circle @click="clickJump({ path:'/store/settlementDetail?id='+scope.row.id })" content="操作日志" size="mini"></el-button>
                                    </el-tooltip>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <div class="pages_footer white" v-if="tableData.total > 0">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="tableData.page_index"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="formInline.size"
                        layout="total, prev, pager, next, jumper"
                        :total="tableData.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {AFTER_TYPE, AFTER_STATUS, PAY_TYPE, PAY_TYPE_OPTION, PAY_RESULT} from "../../config/order";
    import { SETTLEMENT_STATUS, SETTLEMENT_STATUS_TAB } from "../../config/seller";

    export default {
        data () {
            return {
                activeName: 'all',
                ppy_host:CUSTOM_CONFIG.PPY_HOST,
                afterType: AFTER_TYPE,
                afterStatus: AFTER_STATUS,
                payType: PAY_TYPE,
                payTypeOption: PAY_TYPE_OPTION,
                settlementStatus: SETTLEMENT_STATUS,
                settlementStatusTab: SETTLEMENT_STATUS_TAB,
                payResult: PAY_RESULT,
                tableData: {
                    page_total: 0,
                    total: 0,
                    page_index: 1,
                    data: []
                },
                loading: false,
                formInline:{
                    order_sn: '',
                    shop_name: '',
                    pay_type: '',
                    create_time: [],
                    start_time: '',
                    end_time: '',
                    pay_status: '',
                    size: 10,
                    page: 1
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
                fit: 'contain',
                id_list: [],
                current_page_id_list: [],
                errorMessage: '',
                tabAll: '',
                tabName: {},
            }
        },
        created(){
            this.order_list(this.formInline)
        },
        methods: {
            checked(){
                this.tableData.data.forEach((item,index) => {
                    if (this.id_list.includes(item.id)){
                        this.$nextTick(()=>{
                            this.$refs[this.activeName].toggleRowSelection(this.tableData.data[index],true)
                        })
                    }
                })
            },
            async order_list(parameter){
                this.loading = true
                // 初始化当前页的id列表
                this.current_page_id_list = []
                let params =  JSON.parse(JSON.stringify(parameter))
                if(params.create_time && params.create_time.length == 2){
                    params.start_time = Math.round(new Date(params.create_time[0]).getTime()/1000)
                    params.end_time = Math.round(new Date(params.create_time[1]).getTime()/1000)
                }
                let data = await this.$request.get(this.$API.common_api,params,'main',{
                    router_path: 'store/settlement',
                    request_host: 'STORE_SERVER_HOST',
                    handle_desc: '查看结算订单列表;'
                });
                if( data.code == 200 ){
                    this.tableData = data.data
                    this.tabName =  JSON.parse(JSON.stringify(this.settlementStatus))
                    let order_count = 0
                    this.tableData.count_data.forEach((item,index) => {
                        if(item.pay_status != 1){
                            this.tabName[item.pay_status] = this.tabName[item.pay_status] + ' ('+ item.sum_data + ')'
                            order_count += item.sum_data
                        }
                    })
                    this.tableData.data.forEach((item,index) => {
                        this.current_page_id_list.push(item.id)
                    })
                    this.tabAll = ''
                    if(order_count>0){
                        this.tabAll += '全部 (' + order_count + ')'
                    }else{
                        this.tabAll += '全部'
                    }
                    this.checked()
                }
                this.loading = false
            },
            onSubmit() {
                this.formInline.page = 1
                this.id_list = []
                this.order_list(this.formInline)
            },
            handleClick(tab, event) {
                this.formInline.pay_status = this.settlementStatusTab[tab.name]
                this.formInline.page = 1
                this.id_list = []
                this.order_list(this.formInline)
            },

            handleSizeChange(val) {
                this.formInline.size = val
                this.order_list(this.formInline)
            },

            handleCurrentChange(val) {
                this.formInline.page = val
                this.order_list(this.formInline)
            },
            clickJump(url){
                this.$router.push(url)
            },
            //乘法运算
            floatMul(arg1,arg2){
                let m=0,s1=arg1.toString(),s2=arg2.toString();
                try{m+=s1.split(".")[1].length}catch(e){}
                try{m+=s2.split(".")[1].length}catch(e){}
                return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
            },
            handleSelectionChange(orders) {
                let page_id_list = JSON.parse(JSON.stringify(this.current_page_id_list))
                if(orders.length){
                    orders.forEach((item) => {
                        this.arrayRemoveItem(page_id_list,item.id)
                        if(!this.id_list.includes(item.id)){
                            this.id_list.push(item.id)
                        }
                    })
                    if (page_id_list.length){
                        page_id_list.forEach((item) => {
                            this.arrayRemoveItem(this.id_list,item)
                        })
                    }
                }else{
                    page_id_list.forEach((item) => {
                        this.arrayRemoveItem(this.id_list,item)
                    })
                }
            },
            arrayRemoveItem(arr, delVal) {
                if (arr instanceof Array) {
                    var index = arr.indexOf(delVal);
                    if (index > -1) {
                        arr.splice(index, 1);
                    }
                }
            },
            fail() {
                this.$message({
                    showClose: true,
                    message: this.errorMessage,
                    type: 'error'
                });
            },
            exportOrder(){
                let data =  JSON.parse(JSON.stringify(this.formInline))
                if(data.create_time && data.create_time.length == 2){
                    data.start_time = Math.round(new Date(data.create_time[0]).getTime()/1000)
                    data.end_time = Math.round(new Date(data.create_time[1]).getTime()/1000)
                }
                if(this.id_list.length){
                    window.location.href = this.ppy_host+'/api/application_seller/se_wallet/manage_settlement?id_list=[' + this.id_list.join(',') + ']'
                }else{
                    let param = '&shop_name='+data.shop_name+'&order_sn='+data.order_sn+'&start_time='+data.start_time+'&end_time='+data.end_time+'&pay_type='+data.pay_type+'&pay_status='+data.pay_status
                    window.location.href = this.ppy_host+'/api/application_seller/se_wallet/manage_settlement?all_data=1'+param
                }
            },
            resetForm(formName) {
                this.id_list = []
                this.$refs[formName].resetFields();
                this.order_list(this.formInline)
            }
        },
    }
</script>

<style scoped lang="less">
    @import "../../assets/pageHeader";

    .content {
        width: 100%;
        background: #eeeeee;
        border-bottom: 1px #eeeeee solid;
        border-radius: 5px;

        .table-content {
            margin: 0 15px;
            .order_tabs{
                padding: 0 10px;
            }
        }

        .white {
            background: #ffffff;
        }

        /*------表单搜索-----*/
        .form-search{
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
                width:100%;
                display: block;
            }
        }
        .pages_footer {
            padding: 10px;
            text-align: center;
        }
    }
</style>
