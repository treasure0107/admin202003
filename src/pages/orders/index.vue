<template>
    <div class="content">
<!--        <div class="pages-header">-->
<!--            <div>订单列表</div>-->
<!--        </div>-->
        <div class="form-search">
            <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="订单号" prop="order_sn">
                    <el-input v-model="formInline.order_sn" placeholder="订单号" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="店铺名称/店铺ID" prop="shop_id">
                    <el-input v-model="formInline.shop_id" placeholder="店铺名称/ID" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="用户ID" prop="buyer_id">
                    <el-input v-model.number="formInline.buyer_id" placeholder="用户ID" size="mini" @input="numberHandle"></el-input>
                </el-form-item>
                <el-form-item label="订单类型" prop="order_type">
                    <el-select v-model="formInline.order_type" size="mini">
                        <el-option
                            v-for="item in orderTypeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="formInline.goods_name" placeholder="商品名称" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="支付方式" prop="pay_type">
                    <el-select v-model="formInline.pay_type" size="mini">
                        <el-option
                                v-for="item in payTypeOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="店铺类型" prop="open_status">
                    <el-select v-model="formInline.open_status" size="mini">
                        <el-option
                                v-for="item in openStatusOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下单平台" prop="from_source">
                    <el-select v-model="formInline.from_source" size="mini">
                        <el-option
                                v-for="item in fromSourceOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单来源" prop="order_from_source">
                    <el-select v-model="formInline.order_from_source" size="mini">
                        <el-option
                            v-for="item in orderFromSourceOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下单时间" prop="create_time">
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
                <el-form-item label="支付时间" prop="pay_time">
                    <el-date-picker
                            v-model="formInline.pay_time"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right" size="mini">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
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
            <el-tabs v-model="activeName" @tab-click="handleClick" class="white order_tabs">
                <el-tab-pane label="全部订单" name="all" v-loading="loading">
                    <el-table ref="all" :data="tableData.data" height="650" border style="width: 100%" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号" width="150">
                            <template slot-scope="scope">
                                <div :class="scope.row.order_sn" v-show="scope.row.order_from_source == 1"><el-tag
                                    type="danger"
                                    effect="dark"
                                    size="mini">
                                    BD订单
                                </el-tag></div>
                                <div>{{ scope.row.order_sn }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品信息" width="350">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div>
                                        <div class="goods-info-child goods-img">
                                            <el-image
                                                style="width: 110px; height: 110px"
                                                :src="goods.goods_img"
                                                :fit="fit"></el-image>
                                        </div>
                                        <div class="goods-info-child goods-name">
                                            <el-col :span="24"><div :title="goods.goods_name" class="string-show-tow">{{ goods.goods_name }}</div></el-col>
                                            <el-col :span="24"><div :title="goods.goods_classify" class="string-show-tow" v-if="scope.row.order_type != 8">{{ goods.goods_classify }}</div></el-col>
                                            <el-col :span="24"><div class="string-show-one" v-if="scope.row.order_type != 8">SKU:{{ goods.sku_id }}</div></el-col>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品单价">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        ¥{{ goods.unit_price }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品数量">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        x{{ goods.goods_number }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺名称" width="100">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>{{ goods.shop_name }}</p>
                                        <p>{{ scope.row.shop_id }}</p>
                                        <p>{{ openStatus[scope.row.open_status] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额标签">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>¥{{ goods.total_price }}</p>
                                        <p>{{ payType[scope.row.pay_type] }}</p>
                                        <p>来源:{{ fromSource[scope.row.from_source] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" sortable="custom" label="下单时间" width="160"></el-table-column>
                        <el-table-column label="订单类型" width="100">
                            <template slot-scope="scope">
                                {{ orderType[scope.row.order_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态">
                            <template slot-scope="scope">
                                {{ orderStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-row class="operation_button">
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 1">取消冻结</el-button>
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 0">冻结订单</el-button>
                                </el-row>
                                <el-row class="operation_button">
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/detail',query: {order_sn:scope.row.order_sn,id:scope.row.id,order_type:scope.row.order_type}}))">查看订单</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="wait_payment" name="wait_payment" v-loading="loading">
                    <el-table ref="wait_payment" :data="tableData.data" height="650" border style="width: 100%" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号" width="150">
                            <template slot-scope="scope">
                                <div :class="scope.row.order_sn" v-show="scope.row.order_from_source == 1"><el-tag
                                    type="danger"
                                    effect="dark"
                                    size="mini">
                                    BD订单
                                </el-tag></div>
                                <div>{{ scope.row.order_sn }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品信息" width="350">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div>
                                        <div class="goods-info-child goods-img">
                                            <el-image
                                                style="width: 110px; height: 110px"
                                                :src="goods.goods_img"
                                                :fit="fit"></el-image>
                                        </div>
                                        <div class="goods-info-child goods-name">
                                            <el-col :span="24"><div :title="goods.goods_name" class="string-show-tow">{{ goods.goods_name }}</div></el-col>
                                            <el-col :span="24"><div :title="goods.goods_classify" class="string-show-tow" v-if="scope.row.order_type != 8">{{ goods.goods_classify }}</div></el-col>
                                            <el-col :span="24"><div class="string-show-one" v-if="scope.row.order_type != 8">SKU:{{ goods.sku_id }}</div></el-col>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品单价">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        ¥{{ goods.unit_price }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品数量">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        x{{ goods.goods_number }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺名称" width="100">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>{{ goods.shop_name }}</p>
                                        <p>{{ scope.row.shop_id }}</p>
                                        <p>{{ openStatus[scope.row.open_status] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额标签">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>¥{{ goods.total_price }}</p>
                                        <p>{{ payType[scope.row.pay_type] }}</p>
                                        <p>来源:{{ fromSource[scope.row.from_source] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" sortable="custom" label="下单时间" width="160"></el-table-column>
                        <el-table-column label="订单类型" width="100">
                            <template slot-scope="scope">
                                {{ orderType[scope.row.order_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态">
                            <template slot-scope="scope">
                                {{ orderStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-row class="operation_button">
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 1">取消冻结</el-button>
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 0">冻结订单</el-button>
                                </el-row>
                                <el-row class="operation_button">
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/detail',query: {order_sn:scope.row.order_sn,id:scope.row.id,order_type:scope.row.order_type}}))">查看订单</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="wait_ship" name="wait_ship" v-loading="loading">
                    <el-table ref="wait_ship" :data="tableData.data" height="650" border style="width: 100%" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号" width="150">
                            <template slot-scope="scope">
                                <div :class="scope.row.order_sn" v-show="scope.row.order_from_source == 1"><el-tag
                                    type="danger"
                                    effect="dark"
                                    size="mini">
                                    BD订单
                                </el-tag></div>
                                <div>{{ scope.row.order_sn }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品信息" width="350">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div>
                                        <div class="goods-info-child goods-img">
                                            <el-image
                                                style="width: 110px; height: 110px"
                                                :src="goods.goods_img"
                                                :fit="fit"></el-image>
                                        </div>
                                        <div class="goods-info-child goods-name">
                                            <el-col :span="24"><div :title="goods.goods_name" class="string-show-tow">{{ goods.goods_name }}</div></el-col>
                                            <el-col :span="24"><div :title="goods.goods_classify" class="string-show-tow" v-if="scope.row.order_type != 8">{{ goods.goods_classify }}</div></el-col>
                                            <el-col :span="24"><div class="string-show-one" v-if="scope.row.order_type != 8">SKU:{{ goods.sku_id }}</div></el-col>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品单价">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        ¥{{ goods.unit_price }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品数量">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        x{{ goods.goods_number }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺名称" width="100">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>{{ goods.shop_name }}</p>
                                        <p>{{ scope.row.shop_id }}</p>
                                        <p>{{ openStatus[scope.row.open_status] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额标签">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>¥{{ goods.total_price }}</p>
                                        <p>{{ payType[scope.row.pay_type] }}</p>
                                        <p>来源:{{ fromSource[scope.row.from_source] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" sortable="custom" label="下单时间" width="160"></el-table-column>
                        <el-table-column label="订单类型" width="100">
                            <template slot-scope="scope">
                                {{ orderType[scope.row.order_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态">
                            <template slot-scope="scope">
                                {{ orderStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-row class="operation_button">
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 1">取消冻结</el-button>
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 0">冻结订单</el-button>
                                </el-row>
                                <el-row class="operation_button">
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/detail',query: {order_sn:scope.row.order_sn,id:scope.row.id,order_type:scope.row.order_type}}))">查看订单</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="待收货" name="wait_shipping" v-loading="loading">
                    <el-table ref="wait_shipping" :data="tableData.data" height="650" border style="width: 100%" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号" width="150">
                            <template slot-scope="scope">
                                <div :class="scope.row.order_sn" v-show="scope.row.order_from_source == 1"><el-tag
                                    type="danger"
                                    effect="dark"
                                    size="mini">
                                    BD订单
                                </el-tag></div>
                                <div>{{ scope.row.order_sn }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品信息" width="350">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div>
                                        <div class="goods-info-child goods-img">
                                            <el-image
                                                style="width: 110px; height: 110px"
                                                :src="goods.goods_img"
                                                :fit="fit"></el-image>
                                        </div>
                                        <div class="goods-info-child goods-name">
                                            <el-col :span="24"><div :title="goods.goods_name" class="string-show-tow">{{ goods.goods_name }}</div></el-col>
                                            <el-col :span="24"><div :title="goods.goods_classify" class="string-show-tow" v-if="scope.row.order_type != 8">{{ goods.goods_classify }}</div></el-col>
                                            <el-col :span="24"><div class="string-show-one" v-if="scope.row.order_type != 8">SKU:{{ goods.sku_id }}</div></el-col>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品单价">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        ¥{{ goods.unit_price }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品数量">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        x{{ goods.goods_number }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺名称" width="100">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>{{ goods.shop_name }}</p>
                                        <p>{{ scope.row.shop_id }}</p>
                                        <p>{{ openStatus[scope.row.open_status] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额标签">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>¥{{ goods.total_price }}</p>
                                        <p>{{ payType[scope.row.pay_type] }}</p>
                                        <p>来源:{{ fromSource[scope.row.from_source] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" sortable="custom" label="下单时间" width="160"></el-table-column>
                        <el-table-column label="订单类型" width="100">
                            <template slot-scope="scope">
                                {{ orderType[scope.row.order_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态">
                            <template slot-scope="scope">
                                {{ orderStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-row class="operation_button">
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 1">取消冻结</el-button>
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 0">冻结订单</el-button>
                                </el-row>
                                <el-row class="operation_button">
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/detail',query: {order_sn:scope.row.order_sn,id:scope.row.id,order_type:scope.row.order_type}}))">查看订单</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="待评价" name="wait_evaluate" v-loading="loading">
                    <el-table ref="wait_evaluate" :data="tableData.data" height="650" border style="width: 100%" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号" width="150">
                            <template slot-scope="scope">
                                <div :class="scope.row.order_sn" v-show="scope.row.order_from_source == 1"><el-tag
                                    type="danger"
                                    effect="dark"
                                    size="mini">
                                    BD订单
                                </el-tag></div>
                                <div>{{ scope.row.order_sn }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品信息" width="350">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div>
                                        <div class="goods-info-child goods-img">
                                            <el-image
                                                style="width: 110px; height: 110px"
                                                :src="goods.goods_img"
                                                :fit="fit"></el-image>
                                        </div>
                                        <div class="goods-info-child goods-name">
                                            <el-col :span="24"><div :title="goods.goods_name" class="string-show-tow">{{ goods.goods_name }}</div></el-col>
                                            <el-col :span="24"><div :title="goods.goods_classify" class="string-show-tow" v-if="scope.row.order_type != 8">{{ goods.goods_classify }}</div></el-col>
                                            <el-col :span="24"><div class="string-show-one" v-if="scope.row.order_type != 8">SKU:{{ goods.sku_id }}</div></el-col>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品单价">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        ¥{{ goods.unit_price }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品数量">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        x{{ goods.goods_number }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺名称" width="100">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>{{ goods.shop_name }}</p>
                                        <p>{{ scope.row.shop_id }}</p>
                                        <p>{{ openStatus[scope.row.open_status] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额标签">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>¥{{ goods.total_price }}</p>
                                        <p>{{ payType[scope.row.pay_type] }}</p>
                                        <p>来源:{{ fromSource[scope.row.from_source] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" sortable="custom" label="下单时间" width="160"></el-table-column>
                        <el-table-column label="订单类型" width="100">
                            <template slot-scope="scope">
                                {{ orderType[scope.row.order_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态">
                            <template slot-scope="scope">
                                {{ orderStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-row class="operation_button">
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 1">取消冻结</el-button>
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 0">冻结订单</el-button>
                                </el-row>
                                <el-row class="operation_button">
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/detail',query: {order_sn:scope.row.order_sn,id:scope.row.id,order_type:scope.row.order_type}}))">查看订单</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="已完成" name="finished" v-loading="loading">
                    <el-table ref="finished" :data="tableData.data" height="650" border style="width: 100%" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号" width="150">
                            <template slot-scope="scope">
                                <div :class="scope.row.order_sn" v-show="scope.row.order_from_source == 1"><el-tag
                                    type="danger"
                                    effect="dark"
                                    size="mini">
                                    BD订单
                                </el-tag></div>
                                <div>{{ scope.row.order_sn }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品信息" width="350">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div>
                                        <div class="goods-info-child goods-img">
                                            <el-image
                                                style="width: 110px; height: 110px"
                                                :src="goods.goods_img"
                                                :fit="fit"></el-image>
                                        </div>
                                        <div class="goods-info-child goods-name">
                                            <el-col :span="24"><div :title="goods.goods_name" class="string-show-tow">{{ goods.goods_name }}</div></el-col>
                                            <el-col :span="24"><div :title="goods.goods_classify" class="string-show-tow" v-if="scope.row.order_type != 8">{{ goods.goods_classify }}</div></el-col>
                                            <el-col :span="24"><div class="string-show-one" v-if="scope.row.order_type != 8">SKU:{{ goods.sku_id }}</div></el-col>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品单价">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        ¥{{ goods.unit_price }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品数量">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        x{{ goods.goods_number }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺名称" width="100">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>{{ goods.shop_name }}</p>
                                        <p>{{ scope.row.shop_id }}</p>
                                        <p>{{ openStatus[scope.row.open_status] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额标签">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>¥{{ goods.total_price }}</p>
                                        <p>{{ payType[scope.row.pay_type] }}</p>
                                        <p>来源:{{ fromSource[scope.row.from_source] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" sortable="custom" label="下单时间" width="160"></el-table-column>
                        <el-table-column label="订单类型" width="100">
                            <template slot-scope="scope">
                                {{ orderType[scope.row.order_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态">
                            <template slot-scope="scope">
                                {{ orderStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-row class="operation_button">
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 1">取消冻结</el-button>
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 0">冻结订单</el-button>
                                </el-row>
                                <el-row class="operation_button">
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/detail',query: {order_sn:scope.row.order_sn,id:scope.row.id,order_type:scope.row.order_type}}))">查看订单</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="待接单" name="wait_order_taking" v-loading="loading">
                    <el-table ref="wait_order_taking" :data="tableData.data" height="650" border style="width: 100%" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号" width="150">
                            <template slot-scope="scope">
                                <div :class="scope.row.order_sn" v-show="scope.row.order_from_source == 1"><el-tag
                                    type="danger"
                                    effect="dark"
                                    size="mini">
                                    BD订单
                                </el-tag></div>
                                <div>{{ scope.row.order_sn }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品信息" width="350">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div>
                                        <div class="goods-info-child goods-img">
                                            <el-image
                                                style="width: 110px; height: 110px"
                                                :src="goods.goods_img"
                                                :fit="fit"></el-image>
                                        </div>
                                        <div class="goods-info-child goods-name">
                                            <el-col :span="24"><div :title="goods.goods_name" class="string-show-tow">{{ goods.goods_name }}</div></el-col>
                                            <el-col :span="24"><div :title="goods.goods_classify" class="string-show-tow" v-if="scope.row.order_type != 8">{{ goods.goods_classify }}</div></el-col>
                                            <el-col :span="24"><div class="string-show-one" v-if="scope.row.order_type != 8">SKU:{{ goods.sku_id }}</div></el-col>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品单价">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        ¥{{ goods.unit_price }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品数量">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        x{{ goods.goods_number }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺名称" width="100">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>{{ goods.shop_name }}</p>
                                        <p>{{ scope.row.shop_id }}</p>
                                        <p>{{ openStatus[scope.row.open_status] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额标签">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>¥{{ goods.total_price }}</p>
                                        <p>{{ payType[scope.row.pay_type] }}</p>
                                        <p>来源:{{ fromSource[scope.row.from_source] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" sortable="custom" label="下单时间" width="160"></el-table-column>
                        <el-table-column label="订单类型" width="100">
                            <template slot-scope="scope">
                                {{ orderType[scope.row.order_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态">
                            <template slot-scope="scope">
                                {{ orderStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-row class="operation_button">
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 1">取消冻结</el-button>
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 0">冻结订单</el-button>
                                </el-row>
                                <el-row class="operation_button">
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/detail',query: {order_sn:scope.row.order_sn,id:scope.row.id,order_type:scope.row.order_type}}))">查看订单</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="待确认印刷" name="wait_confirm_print" v-loading="loading">
                    <el-table ref="wait_confirm_print" :data="tableData.data" height="650" border style="width: 100%" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号" width="150">
                            <template slot-scope="scope">
                                <div :class="scope.row.order_sn" v-show="scope.row.order_from_source == 1"><el-tag
                                    type="danger"
                                    effect="dark"
                                    size="mini">
                                    BD订单
                                </el-tag></div>
                                <div>{{ scope.row.order_sn }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品信息" width="350">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div>
                                        <div class="goods-info-child goods-img">
                                            <el-image
                                                style="width: 110px; height: 110px"
                                                :src="goods.goods_img"
                                                :fit="fit"></el-image>
                                        </div>
                                        <div class="goods-info-child goods-name">
                                            <el-col :span="24"><div :title="goods.goods_name" class="string-show-tow">{{ goods.goods_name }}</div></el-col>
                                            <el-col :span="24"><div :title="goods.goods_classify" class="string-show-tow" v-if="scope.row.order_type != 8">{{ goods.goods_classify }}</div></el-col>
                                            <el-col :span="24"><div class="string-show-one" v-if="scope.row.order_type != 8">SKU:{{ goods.sku_id }}</div></el-col>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品单价">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        ¥{{ goods.unit_price }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品数量">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        x{{ goods.goods_number }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺名称" width="100">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>{{ goods.shop_name }}</p>
                                        <p>{{ scope.row.shop_id }}</p>
                                        <p>{{ openStatus[scope.row.open_status] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额标签">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>¥{{ goods.total_price }}</p>
                                        <p>{{ payType[scope.row.pay_type] }}</p>
                                        <p>来源:{{ fromSource[scope.row.from_source] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" sortable="custom" label="下单时间" width="160"></el-table-column>
                        <el-table-column label="订单类型" width="100">
                            <template slot-scope="scope">
                                {{ orderType[scope.row.order_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态">
                            <template slot-scope="scope">
                                {{ orderStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-row class="operation_button">
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 1">取消冻结</el-button>
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 0">冻结订单</el-button>
                                </el-row>
                                <el-row class="operation_button">
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/detail',query: {order_sn:scope.row.order_sn,id:scope.row.id,order_type:scope.row.order_type}}))">查看订单</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="已取消" name="cancelled" v-loading="loading">
                    <el-table ref="cancelled" :data="tableData.data" height="650" border style="width: 100%" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="order_sn" label="订单号" width="150">
                            <template slot-scope="scope">
                                <div :class="scope.row.order_sn" v-show="scope.row.order_from_source == 1"><el-tag
                                    type="danger"
                                    effect="dark"
                                    size="mini">
                                    BD订单
                                </el-tag></div>
                                <div>{{ scope.row.order_sn }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品信息" width="350">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div>
                                        <div class="goods-info-child goods-img">
                                            <el-image
                                                style="width: 110px; height: 110px"
                                                :src="goods.goods_img"
                                                :fit="fit"></el-image>
                                        </div>
                                        <div class="goods-info-child goods-name">
                                            <el-col :span="24"><div :title="goods.goods_name" class="string-show-tow">{{ goods.goods_name }}</div></el-col>
                                            <el-col :span="24"><div :title="goods.goods_classify" class="string-show-tow" v-if="scope.row.order_type != 8">{{ goods.goods_classify }}</div></el-col>
                                            <el-col :span="24"><div class="string-show-one" v-if="scope.row.order_type != 8">SKU:{{ goods.sku_id }}</div></el-col>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品单价">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        ¥{{ goods.unit_price }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品数量">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        x{{ goods.goods_number }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺名称" width="100">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>{{ goods.shop_name }}</p>
                                        <p>{{ scope.row.shop_id }}</p>
                                        <p>{{ openStatus[scope.row.open_status] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额标签">
                            <template slot-scope="scope">
                                <div class="goods-info" v-for="(goods, key, index) in scope.row.order_goods">
                                    <div class="goods-info-child">
                                        <p>¥{{ goods.total_price }}</p>
                                        <p>{{ payType[scope.row.pay_type] }}</p>
                                        <p>来源:{{ fromSource[scope.row.from_source] }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" sortable="custom" label="下单时间" width="160"></el-table-column>
                        <el-table-column label="订单类型" width="100">
                            <template slot-scope="scope">
                                {{ orderType[scope.row.order_type] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态">
                            <template slot-scope="scope">
                                {{ orderStatus[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-row class="operation_button">
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 1">取消冻结</el-button>
                                    <el-button type="primary" size="mini" plain @click="frozen_order(scope.row.order_sn,$event,scope.row.id)" v-if="scope.row.is_frozen == 0">冻结订单</el-button>
                                </el-row>
                                <el-row class="operation_button">
                                    <el-button type="info" size="mini" plain @click="clickJump($router.resolve({path: '/orders/detail',query: {order_sn:scope.row.order_sn,id:scope.row.id,order_type:scope.row.order_type}}))">查看订单</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
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
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import { ORDER_STATUS, ORDER_TYPE, ORDER_TYPE_OPTION, PAY_TYPE, FROM_SOURCE, FROM_SOURCE_OPTION, PAY_TYPE_OPTION, ORDER_FROM_SOURCE, ORDER_FROM_SOURCE_OPTION } from "../../config/order";
    import { OPEN_STATUS, OPEN_STATUS_OPTION } from "../../config/seller";

    export default {
        data () {
            return {
                ppy_host:CUSTOM_CONFIG.PPY_HOST,
                loading: false,
                errorMessage: '',
                activeList: {
                    'all': '',
                    'wait_order_taking': 1, //待接单
                    'wait_payment': 2, //待付款
                    'wait_confirm_print': 3, //待确认印刷
                    'wait_ship': 4, //待发货
                    'wait_shipping': 5, //待收货
                    'wait_evaluate': 6,//待评价
                    'finished': 7, //已完成
                    'cancelled': 0 //已取消
                },
                orderStatus: ORDER_STATUS,
                orderType: ORDER_TYPE,
                orderTypeOption: ORDER_TYPE_OPTION,
                payType: PAY_TYPE,
                payTypeOption: PAY_TYPE_OPTION,
                fromSource: FROM_SOURCE,
                openStatus: OPEN_STATUS,
                fromSourceOption: FROM_SOURCE_OPTION,
                openStatusOption: OPEN_STATUS_OPTION,
                orderFromSource: ORDER_FROM_SOURCE,
                orderFromSourceOption: ORDER_FROM_SOURCE_OPTION,
                activeName: 'all',
                tableData: {
                    page_total: 0,
                    total: 0,
                    page_index: 1,
                    data: []
                },
                formInline:{
                    order_sn: '',
                    shop_id: '',
                    user_id: '',
                    order_type: '',
                    order_status: '',
                    goods_name: '',
                    pay_type: '',
                    from_source: '',
                    open_status: '',
                    user: '',
                    region: '',
                    status: '',
                    create_time:[],
                    pay_time:[],
                    create_start_time: '',
                    create_end_time: '',
                    pay_start_time: '',
                    pay_end_time: '',
                    order_from_source: '',
                    order_by: '-create_time',
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
                checked: false,
                orderExportParams:{
                    order_list: '',
                },
                order_sn_list: [],
                wait_payment: '待付款',
                wait_ship: '待发货',
                current_page_order_sn_list: [],
            }
        },
        created(){
            if (this.$route.query.user_id){
                this.formInline.buyer_id = this.$route.query.user_id;
                this.onSubmit();
            }else{
                this.order_list(this.formInline)
            }
        },
        methods: {
            handleSortChange(val){
                if(val.prop == 'create_time'){
                    this.formInline.order_by = val.order == 'ascending'?'create_time' :'-create_time'
                }
                this.order_list(this.formInline)
            },
            select_checked(){
                this.tableData.data.forEach((item,index) => {
                    if (this.order_sn_list.includes(item.order_sn)){
                        this.$nextTick(()=>{
                            this.$refs[this.activeName].toggleRowSelection(this.tableData.data[index],true)
                        })
                    }
                })
            },
            async order_list(parameter){
                this.loading = true
                // 初始化当前页的id列表
                this.current_page_order_sn_list = []
                let params =  JSON.parse(JSON.stringify(parameter))
                if(params.create_time && params.create_time.length == 2){
                    params.create_start_time = Math.round(new Date(params.create_time[0]).getTime()/1000)
                    params.create_end_time = Math.round(new Date(params.create_time[1]).getTime()/1000)
                }
                if(params.pay_time && params.pay_time.length == 2){
                    params.pay_start_time = Math.round(new Date(params.pay_time[0]).getTime()/1000)
                    params.pay_end_time = Math.round(new Date(params.pay_time[1]).getTime()/1000)
                }
                if(parameter.shop_id && isNaN(parameter.shop_id)){
                    let param = {'exactitude_shop_name': parameter.shop_id}
                    let shopInfo = await this.$request.get(this.$API.common_api, param, 'main', {
                        router_path: 'seller/shop',
                        request_host: 'STORE_SERVER_HOST',
                    })
                    if(shopInfo.code == 200 && shopInfo.data.count>0){
                        params.shop_id = shopInfo.data.result['0']['shop_id']
                    }else {
                        this.tableData = {
                            page_total: 0,
                            total: 0,
                            page_index: 1,
                            data: []
                        }
                        this.loading = false
                        return false
                    }

                }
                let data = await this.$request.get(this.$API.common_api, params, 'main', {
                    router_path: 'orders/list',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: '查看订单列表;'
                })
                if( data.code == 200 ){
                    this.wait_payment= '待付款'
                    this.wait_ship= '待发货'
                    this.wait_payment+= '('+data.status_count.o2+')'
                    this.wait_ship+= '('+data.status_count.o4+')'
                    this.tableData = data.data
                    this.tableData.data.forEach((item,index) => {
                        this.current_page_order_sn_list.push(item.order_sn)
                    });
                    this.select_checked()
                }
                this.loading = false
            },
            numberHandle(){
                this.formInline.buyer_id = (this.formInline.buyer_id.match(/^\d*(\.?\d{0,0})/g)[0]) || null;
            },
            async frozen_order(order_sn,event,id) {
                let parameter = {order_sn:order_sn}
                let frozen_title = event.currentTarget.firstElementChild;
                let data = await this.$request.post(this.$API.common_api, parameter, 'main', {
                    router_path: 'orders/frozen',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: frozen_title.innerHTML + '订单;'+ id
                })
                if( data.code == 200 ){
                    if(frozen_title.innerHTML == '取消冻结'){
                        frozen_title.innerHTML = '冻结订单'
                    }else if(frozen_title.innerHTML == '冻结订单'){
                        frozen_title.innerHTML = '取消冻结'
                    }
                    this.success()
                }else{
                    this.errorMessage = data.msg
                    this.fail();
                }
            },
            async set_bd_order(order_sn,event,id) {
                let parameter = {order_sn:order_sn}
                let set_bd_title = event.currentTarget.firstElementChild;
                let set_bd = document.getElementsByClassName(order_sn)[0]
                let data = await this.$request.post(this.$API.common_api, parameter, 'main', {
                    router_path: 'orders/frozen',
                    request_host: 'ORDERS_SERVER_HOST',
                    handle_desc: set_bd_title.innerHTML + '订单;'+ id
                })
                if( data.code == 200 ){
                    if(set_bd_title.innerHTML == '非BD订单'){
                        set_bd_title.innerHTML = '设为BD订单'
                        set_bd.style.display = 'none'
                    }else if(set_bd_title.innerHTML == '设为BD订单'){
                        set_bd_title.innerHTML = '非BD订单'
                        set_bd.style.display = 'block'
                    }
                    this.success()
                }else{
                    this.errorMessage = data.msg
                    this.fail();
                }
            },
            onSubmit() {
                this.formInline.page = 1
                this.order_sn_list = []
                this.order_list(this.formInline)
            },

            handleClick(tab, event) {
                this.formInline.status = this.activeList[tab.name]
                this.formInline.page = 1
                this.order_sn_list = []
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
            clickJump(routeUrl){
                window.open(routeUrl .href, '_blank');
            },
            handleSelectionChange(orders) {
                let page_id_list = JSON.parse(JSON.stringify(this.current_page_order_sn_list))
                if(orders.length){
                    orders.forEach((item) => {
                        this.arrayRemoveItem(page_id_list,item.order_sn)
                        if(!this.order_sn_list.includes(item.order_sn)){
                            this.order_sn_list.push(item.order_sn)
                        }
                    })
                    if (page_id_list.length){
                        page_id_list.forEach((item) => {
                            this.arrayRemoveItem(this.order_sn_list,item)
                        })
                    }
                }else{
                    page_id_list.forEach((item) => {
                        this.arrayRemoveItem(this.order_sn_list,item)
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
            async exportOrder(){
                if(this.order_sn_list.length==0){
                    let params =  JSON.parse(JSON.stringify(this.formInline))
                    if(params.create_time && params.create_time.length == 2){
                        params.create_start_time = Math.round(new Date(params.create_time[0]).getTime()/1000)
                        params.create_end_time = Math.round(new Date(params.create_time[1]).getTime()/1000)
                    }
                    if(params.pay_time && params.pay_time.length == 2){
                        params.pay_start_time = Math.round(new Date(params.pay_time[0]).getTime()/1000)
                        params.pay_end_time = Math.round(new Date(params.pay_time[1]).getTime()/1000)
                    }
                    let data = await this.$request.get(this.$API.common_api, params, 'main', {
                        router_path: 'orders/orderExport',
                        request_host: 'ORDERS_SERVER_HOST',
                        handle_desc: '导出订单;'
                    });
                    if (data.code == 200) {
                        window.location.href = this.ppy_host+'/api/server_order/export_excel?file_name='+data.data
                    }
                }else {
                    this.orderExportParams.order_list = '[' + this.order_sn_list.join(',') + ']'
                    let data = await this.$request.get(this.$API.common_api, this.orderExportParams, 'main', {
                        router_path: 'orders/orderExport',
                        request_host: 'ORDERS_SERVER_HOST',
                        handle_desc: '导出订单;'
                    });
                    if (data.code == 200) {
                        window.location.href = this.ppy_host+'/api/server_order/export_excel?file_name='+data.data
                    }
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
            resetForm(formName) {
                this.order_sn_list = []
                this.$refs[formName].resetFields();
                this.order_list(this.formInline)
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/pageHeader";
    .content {
        min-width: 1000px;
        width: 100%;
        background: #eeeeee;
        border-bottom: 1px #eeeeee solid;
        border-radius: 5px;
        /deep/ .el-tabs__content {
            min-height: 600px;
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
        .table-content {
            margin: 0 15px;
            .order_tabs {
                padding: 0 10px;

                .goods_img {
                    width: 100px;
                }
                .goods-name {
                    width: 220px;
                }
                .goods-info {
                    height: 110px;
                    width: 400px;
                    float: left;
                    margin-top: 10px;
                    border-top: 1px solid #EBEEF5;
                    padding-top: 10px;
                    margin-bottom: 10px;
                    .goods-info-child {
                        height: 110px;
                        float: left;
                        margin-right: 10px;
                        p {
                            margin: 0;
                        }
                    }
                    .goods-info-child:first-child {
                        margin-top: 0;
                    }
                }
                .goods-info:first-child{
                    padding-top: 0;
                    padding-right: 10px;
                    margin-top: 0;
                    border-top: 0;
                    margin-bottom: 0;
                }
                .operation_button {
                    margin-top: 10px;
                }
            }

            .pages_footer {
                padding: 10px;
                text-align: center;
            }
        }

        .white {
            background: #ffffff;
        }

    }

</style>
