<template>
    <div class="content">
        <div class="table-content" v-loading="loading">
            <el-container>
                <div class="index-left">
                    <el-row class="tab-border">
                        <el-col :span="12"><div class="index-one-block">
                            <el-row>
                                <el-col :span="8"><div class="index-one-img">
                                    <el-image
                                            style="width: 100%; height: 100%"
                                            src="/static/order/order_total.png"
                                            :fit="fit"></el-image>
                                </div></el-col>
                                <el-col :span="16"><div class="index-one-data">
                                    <div class="title—wide">{{ tableData.yesterday_order_total }}</div>
                                    <div>今日订单量</div>
                                </div></el-col>
                            </el-row>
                        </div></el-col>
                        <el-col :span="12"><div class="index-one-block">
                            <el-row>
                                <el-col :span="8"><div class="index-one-img">
                                    <el-image
                                            style="width: 100%; height: 100%"
                                            src="/static/order/money_total.png"
                                            :fit="fit"></el-image>
                                </div></el-col>
                                <el-col :span="16"><div class="index-one-data">
                                    <div class="title—wide">¥ {{ tableData.yesterday_order_money_total | moneyHandle(3) }}</div>
                                    <div>今日订单金额</div>
                                </div></el-col>
                            </el-row>
                        </div></el-col>
                        <!-- 新增实时订单 -->
                        <el-col :span="12"><div class="index-one-block">
                            <el-row>
                                <el-col :span="8"><div class="index-one-img">
                                    <el-image
                                            style="width: 100%; height: 100%"
                                            src="/static/order/today-order.png"
                                            :fit="fit"></el-image>
                                </div></el-col>
                                <el-col :span="16"><div class="index-one-data">
                                    <div class="title—wide">{{ tableData.order_make_total }}</div>
                                    <div>今日成交订单</div>
                                </div></el-col>
                            </el-row>
                        </div></el-col>
                        <el-col :span="12"><div class="index-one-block">
                            <el-row>
                                <el-col :span="8"><div class="index-one-img">
                                    <el-image
                                            style="width: 100%; height: 100%"
                                            src="/static/order/today-deal.png"
                                            :fit="fit"></el-image>
                                </div></el-col>
                                <el-col :span="16"><div class="index-one-data">
                                    <div class="title—wide">¥ {{ tableData.order_make_money_total }}</div>
                                    <div>今日成交金额</div>
                                </div></el-col>
                            </el-row>
                        </div></el-col>
                        <el-col :span="12"><div class="index-one-block">
                            <el-row>
                                <el-col :span="8"><div class="index-one-img">
                                    <el-image
                                            style="width: 100%; height: 100%"
                                            src="/static/order/today-order-success.png"
                                            :fit="fit"></el-image>
                                </div></el-col>
                                <el-col :span="16"><div class="index-one-data">
                                    <div class="title—wide">{{ tableData.order_success_total }}</div>
                                    <div>今日完结订单</div>
                                </div></el-col>
                            </el-row>
                        </div></el-col>
                        <el-col :span="12"><div class="index-one-block">
                            <el-row>
                                <el-col :span="8"><div class="index-one-img">
                                    <el-image
                                            style="width: 100%; height: 100%"
                                            src="/static/order/today-money.png"
                                            :fit="fit"></el-image>
                                </div></el-col>
                                <el-col :span="16"><div class="index-one-data">
                                    <div class="title—wide">¥ {{ tableData.order_success_money_total }}</div>
                                    <div>今日完结金额</div>
                                </div></el-col>
                            </el-row>
                        </div></el-col>
                        <el-col :span="12"><div class="index-one-block">
                            <el-row>
                                <el-col :span="8"><div class="index-one-img">
                                    <el-image
                                            style="width: 100%; height: 100%"
                                            src="/static/order/comment_total.png"
                                            :fit="fit"></el-image>
                                </div></el-col>
                                <el-col :span="16"><div class="index-one-data">
                                    <div class="title—wide">{{ tableData.yesterday_comments_total }}</div>
                                    <div>今日商品评论数</div>
                                </div></el-col>
                            </el-row>
                        </div></el-col>
                        <el-col :span="12"><div class="index-one-block">
                            <el-row>
                                <el-col :span="8"><div class="index-one-img">
                                    <el-image
                                            style="width: 100%; height: 100%"
                                            src="/static/order/shop_total.png"
                                            :fit="fit"></el-image>
                                </div></el-col>
                                <el-col :span="16"><div class="index-one-data">
                                    <div class="title—wide">{{ tableData.yesterday_shop_total }}</div>
                                    <div>累计店铺数</div>
                                </div></el-col>
                            </el-row>
                        </div></el-col>
                    </el-row>
                    <el-row class="tab-border">
                        <el-col :span="24">
                            <div class="title">会员概况</div>
                            <el-row class="index-text-align">
                                <el-col :span="6"><div>
                                    <div class="index-tow-line title—wide">{{ tableData.user.today_user_total }}</div>
                                    <div>今日新增</div>
                                </div></el-col>
                                <el-col :span="6"><div>
                                    <div class="index-tow-line title—wide">{{ tableData.user.yesterday_user_total }}</div>
                                    <div>昨日新增</div>
                                </div></el-col>
                                <el-col :span="6"><div>
                                    <div class="index-tow-line title—wide">{{ tableData.user.month_user_total }}</div>
                                    <div>本月新增</div>
                                </div></el-col>
                                <el-col :span="6"><div>
                                    <div class="index-tow-line title—wide">{{ tableData.user.user_total }}</div>
                                    <div>会员总数</div>
                                </div></el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row class="tab-border">
                        <el-col :span="24">
                            <div class="title">商品概况</div>
                            <el-row class="index-text-align">
                                <el-col :span="6"><div>
                                    <div class="index-tow-line title—wide">{{ tableData.goods.today_goods_total }}</div>
                                    <div>今日新增</div>
                                </div></el-col>
                                <el-col :span="6"><div>
                                    <div class="index-tow-line title—wide">{{ tableData.goods.yesterday_goods_total }}</div>
                                    <div>昨日新增</div>
                                </div></el-col>
                                <el-col :span="6"><div>
                                    <div class="index-tow-line title—wide">{{ tableData.goods.month_goods_total }}</div>
                                    <div>本月新增</div>
                                </div></el-col>
                                <el-col :span="6"><div>
                                    <div class="index-tow-line title—wide">{{ tableData.goods.goods_total }}</div>
                                    <div>商品总数</div>
                                </div></el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </div>
                <div class="index-right">
                    <el-row class="tab-border" :gutter="0">
                        <el-col :span="3"><div class="index-order">
                            <div class="index-order-img"><el-image
                                    style="width: 100%; height: 100%"
                                    src="/static/order/order_table_1.png"
                                    :fit="fit"></el-image></div>
                            <div>待承接</div>
                            <div>{{ tableData.order.wait_order_taking }}</div>
                        </div></el-col>
                        <el-col :span="3"><div class="index-order">
                            <div class="index-order-img"><el-image
                                    style="width: 100%; height: 100%"
                                    src="/static/order/order_table_2.png"
                                    :fit="fit"></el-image></div>
                            <div>待付款</div>
                            <div>{{ tableData.order.wait_payment }}</div>
                        </div></el-col>
                        <el-col :span="3"><div class="index-order">
                            <div class="index-order-img"><el-image
                                    style="width: 100%; height: 100%"
                                    src="/static/order/order_table_3.png"
                                    :fit="fit"></el-image></div>
                            <div>待确认</div>
                            <div>{{ tableData.order.wait_confirm_print }}</div>
                        </div></el-col>
                        <el-col :span="3"><div class="index-order">
                            <div class="index-order-img"><el-image
                                    style="width: 100%; height: 100%"
                                    src="/static/order/order_table_4.png"
                                    :fit="fit"></el-image></div>
                            <div>待发货</div>
                            <div>{{ tableData.order.wait_ship }}</div>
                        </div></el-col>
                        <el-col :span="3"><div class="index-order">
                            <div class="index-order-img"><el-image
                                    style="width: 100%; height: 100%"
                                    src="/static/order/order_table_5.png"
                                    :fit="fit"></el-image></div>
                            <div>待收货</div>
                            <div>{{ tableData.order.wait_shipping }}</div>
                        </div></el-col>
                        <el-col :span="3"><div class="index-order">
                            <div class="index-order-img"><el-image
                                    style="width: 100%; height: 100%"
                                    src="/static/order/order_table_6.png"
                                    :fit="fit"></el-image></div>
                            <div>待评价</div>
                            <div>{{ tableData.order.wait_evaluate }}</div>
                        </div></el-col>
                        <el-col :span="3"><div class="index-order">
                            <div class="index-order-img"><el-image
                                    style="width: 100%; height: 100%"
                                    src="/static/order/order_table_7.png"
                                    :fit="fit"></el-image></div>
                            <div>已完成</div>
                            <div>{{ tableData.order.finished }}</div>
                        </div></el-col>
                        <el-col :span="3"><div class="index-order">
                            <div class="index-order-img"><el-image
                                    style="width: 100%; height: 100%"
                                    src="/static/order/order_table_8.png"
                                    :fit="fit"></el-image></div>
                            <div>售后</div>
                            <div>{{ tableData.order.aftermarket }}</div>
                        </div></el-col>
                    </el-row>
                    <el-row class="tab-border">
                        <el-col :span="24"><div>
                            <el-row class="title">
                                <el-col :span="19"><div>订单统计</div></el-col>
                                <el-col :span="5"><div>
                                    <template>
                                        <el-select v-model="order_time" placeholder="请选择" size="mini" @change="orderTime">
                                            <el-option
                                                    v-for="item in timeWhereOption"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </div></el-col>
                            </el-row>
                        </div></el-col>
                        <el-col :span="24"><div>
                            <div id="orderTable"></div>
                        </div></el-col>
                    </el-row>
                    <el-row class="tab-border">
                        <el-col :span="24"><div>
                            <el-row class="title">
                                <el-col :span="19"><div>成交统计</div></el-col>
                                <el-col :span="5"><div>
                                    <template>
                                        <el-select v-model="turnover_time" placeholder="请选择" size="mini" @change="turnoverTime">
                                            <el-option
                                                    v-for="item in timeWhereOption"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </div></el-col>
                            </el-row>
                        </div></el-col>
                        <el-col :span="24"><div>
                            <div id="turnoverTable"></div>
                        </div></el-col>
                    </el-row>
                </div>
            </el-container>
        </div>
    </div>
</template>
<script>
    import { Table, TableColumn, Button } from 'element-ui';
    import { TIME_WHERE, TIME_WHERE_OPTION } from "../../config/order";
    let echarts = require('echarts');

    export default {
        data () {
            return {
                fit: 'contain',
                loading:true,
                url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                orderTable: {},
                saleTable: {},
                form: {},
                formInline: {},
                order_time: 'week_date',
                turnover_time: 'week_date',
                timeWhereOption: TIME_WHERE_OPTION,
                timeWhere: TIME_WHERE,
                tableData: {
                    goods: {
                        month_goods_total: 0,
                        goods_total: 0,
                        yesterday_goods_total: 0,
                        today_goods_total:0,
                    },
                    user: {
                        month_user_total: 0,
                        user_total: 0,
                        yesterday_user_total: 0,
                        today_user_total:0,
                    },
                    order: {
                        wait_order_taking: 0,
                        wait_payment: 0,
                        wait_confirm_print: 0,
                        wait_ship: 0,
                        wait_shipping: 0,
                        wait_evaluate: 0,
                        finished: 0,
                        aftermarket: 0,
                    },
                    where_date: {},
                    order_table: [],
                    turnover_table: [],
                    order_success_total: 0,
                    order_make_total: 0,
                    order_make_money_total:0,
                    order_success_money_total:0,
                    yesterday_order_total: 0,
                    yesterday_comments_total: 0,
                    yesterday_shop_total: 0,
                    yesterday_order_money_total: '0.000'
                },
                order_table: [],
                turnover_table: [],
                orderOption: {
                    color: ["#24d336"],
                    tooltip: {
                        trigger: "axis",
                        formatter: "时间 : {b}<br/>金额 : {c}元",
                        axisPointer: {
                            type: "line"
                        }
                    },
                    toolbox: {
                        show: true,
                        left:'92%',
                        top: '18%',
                        orient: 'vertical',
                        itemGap: 16,
                        feature: {
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {
                                type: 'png',
                                name: ''
                            }
                        }
                    },
                    dataZoom: [{
                        startValue: '2000-01-01',
                        endValue: '2019-01-01',
                    }, {
                        type: 'inside'
                    }],
                    xAxis: [{
                        type: "category",
                        name: "日期",
                        data: [],
                        boundaryGap: false,
                        axisTick: {
                            alignWithLabel: true
                        },
                        nameGap: 2
                    }],
                    yAxis: [{
                        type: "value",
                        name: "金额（元）"
                    }],
                    series: [{
                        name: "柜子使用量",
                        //类型为折线图
                        type: "line",
                        //折线样式
                        lineStyle: {
                            normal: {
                                //宽度
                                width: 3,
                                //阴影颜色
                                shadowColor: "rgba(0,0,0,0.1)",
                                // 阴影的模糊范围
                                shadowBlur: 10,
                                // 阴影的纵向位移量
                                shadowOffsetY: 10
                            }
                        },
                        areaStyle: {
                            normal: {
                                // 折线范围内的背景色
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: "#E7F1F5"
                                },
                                    {
                                        offset: 1,
                                        color: "#E7F1F5"
                                    }])
                            }
                        },
                        data: []
                    }]
                },
                turnoverOption: {
                    color: ["#d3c310"],
                    tooltip: {
                        trigger: "axis",
                        formatter: "时间 : {b}<br/>金额 : {c}元",
                        axisPointer: {
                            type: "line"
                        }
                    },
                    toolbox: {
                        show: true,
                        left:'92%',
                        top: '18%',
                        orient: 'vertical',
                        itemGap: 16,
                        feature: {
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {
                                type: 'png',
                                name: ''
                            }
                        }
                    },
                    dataZoom: [{
                        startValue: '2000-01-01',
                        endValue: '2019-01-01',
                    }, {
                        type: 'inside'
                    }],
                    xAxis: [{
                        type: "category",
                        name: "日期",
                        data: [],
                        boundaryGap: false,
                        axisTick: {
                            alignWithLabel: true
                        },
                        nameGap: 2
                    }],
                    yAxis: [{
                        type: "value",
                        name: "金额（元）"
                    }],
                    series: [{
                        name: "柜子使用量",
                        //类型为折线图
                        type: "line",
                        //折线样式
                        lineStyle: {
                            normal: {
                                //宽度
                                width: 3,
                                //阴影颜色
                                shadowColor: "rgba(0,0,0,0.1)",
                                // 阴影的模糊范围
                                shadowBlur: 10,
                                // 阴影的纵向位移量
                                shadowOffsetY: 10
                            }
                        },
                        areaStyle: {
                            normal: {
                                // 折线范围内的背景色
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: "#E7F1F5"
                                },
                                    {
                                        offset: 1,
                                        color: "#E7F1F5"
                                    }])
                            }
                        },
                        data: []
                    }]
                }
            }
        },
        async created () {
            if(!sessionStorage.getItem('clientInfo')){
                window.location.href = '/#/login';
            }
            this.index_total()
        },
        methods: {
            // 初始化订单表
            initial_order_table(){
                this.orderTable = echarts.init(document.getElementById('orderTable'));
                this.orderTable.setOption(this.orderOption);
            },
            // 初始化统计表
            initial_turnover_table(){
                this.turnoverTable = echarts.init(document.getElementById('turnoverTable'));
                this.turnoverTable.setOption(this.turnoverOption);
            },
            async index_total(){
                this.loading = true
                let data = await this.$request.get(this.$API.survey_total, {})
                if( data.code == 200 ){
                    this.tableData = data.data
                    this.loading = false;
                    //订单统计数据
                    this.orderOption.xAxis[0].data = this.tableData.order_table.map(function (item) {
                        return item[0];
                    })
                    this.orderOption.series[0].data = this.tableData.order_table.map(function (item) {
                        return item[1];
                    })
                    this.orderOption.dataZoom[0].startValue = this.tableData.where_date[this.order_time]
                    this.orderOption.dataZoom[0].endValue = this.tableData.where_date['yesterday_date']
                    // 下载图片名称
                    this.orderOption.toolbox.feature.saveAsImage.name = this.currentFormat() + '-订单统计-' +this.timeWhere[this.order_time] + '数据'
                    this.initial_order_table()

                    //成交统计数据
                    this.turnoverOption.xAxis[0].data = this.tableData.turnover_table.map(function (item) {
                        return item[0];
                    })
                    this.turnoverOption.series[0].data = this.tableData.turnover_table.map(function (item) {
                        return item[1];
                    })
                    this.turnoverOption.dataZoom[0].startValue = this.tableData.where_date[this.turnover_time]
                    this.turnoverOption.dataZoom[0].endValue = this.tableData.where_date['yesterday_date']
                    // 下载图片名称
                    this.turnoverOption.toolbox.feature.saveAsImage.name = this.currentFormat() + '-成交统计-' +this.timeWhere[this.turnover_time] + '数据'
                    this.initial_turnover_table()
                }
                this.loading = false
            },
            orderTime(){
                this.orderOption.dataZoom[0].startValue = this.tableData.where_date[this.order_time]
                this.orderOption.dataZoom[0].endValue = this.tableData.where_date['yesterday_date']
                // 跟随时间选项变更下载图片名称
                this.orderOption.toolbox.feature.saveAsImage.name = this.currentFormat() + '-订单统计' +this.timeWhere[this.order_time] + '数据'
                this.initial_order_table()
            },
            turnoverTime(){
                this.turnoverOption.dataZoom[0].startValue = this.tableData.where_date[this.turnover_time]
                this.turnoverOption.dataZoom[0].endValue = this.tableData.where_date['yesterday_date']
                // 跟随时间选项变更下载图片名称
                this.turnoverOption.toolbox.feature.saveAsImage.name = this.currentFormat() + '-成交统计-' +this.timeWhere[this.turnover_time] + '数据'
                this.initial_turnover_table()
            },
            // 获取当前时间 格式如: 20190925165535
            currentFormat() {
                var timeStr = '';
                var curDate = new Date();
                var curYear =curDate.getFullYear();  //获取完整的年份(4位,1970-????)
                var curMonth = curDate.getMonth()+1;  //获取当前月份(0-11,0代表1月)
                var curDay = curDate.getDate();       //获取当前日(1-31)
                var curWeekDay = curDate.getDay();    //获取当前星期X(0-6,0代表星期天)
                var curHour = curDate.getHours();      //获取当前小时数(0-23)
                var curMinute = curDate.getMinutes();   // 获取当前分钟数(0-59)
                var curSec =curDate.getSeconds();      //获取当前秒数(0-59)
                var Current= curYear+timeStr+curMonth+timeStr+curDay+timeStr+curHour+timeStr+curMinute+timeStr+curSec;
                return Current;
            }
        },
        filters: {
            // 处理金额格式 格式为：5,230,923.820
            moneyHandle:function(value, n){
                if(n != 0 ){
                    n = (n > 0 && n <= 20) ? n : 2;
                }
                value = parseFloat((value + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
                var sub_val = value.split(".")[0].split("").reverse();
                var sub_xs = value.split(".")[1];

                var show_html = "";
                for (let i = 0; i < sub_val.length; i++){
                    show_html += sub_val[i] + ((i + 1) % 3 == 0 && (i + 1) != sub_val.length ? "," : "");
                }

                if(n == 0 ){
                    return show_html.split("").reverse().join("");
                }else{
                    return show_html.split("").reverse().join("") + "." + sub_xs;
                }
            }
        },
        components: {
            ElTable: Table, ElTableColumn: TableColumn, ElButton: Button
        }
    }
</script>
<style lang="less" scoped>
    @import "../../assets/pageHeader";
    .content {
        width: 100%;
        height: 100%;
        background: #f5f5f5;
        border-bottom: 1px #eeeeee solid;
        border-radius: 5px;
        color: #999999;
        .index-left {
            width: 35%;
            float: left;
            margin-right: 15px;
        }
        .index-right {
            width: 65%;
            float: left;
            .index-order {
                text-align:center;
                padding: 5px;
                .index-order-img {
                    height: 35px;
                }
            }
            #orderTable, #turnoverTable {
                width: 100%;
                height: 300px;
            }
        }
        .tab-border {
            border: 1px solid #EDEDED;
            padding: 15px;
            margin-bottom: 15px;
        }
        .index-one-data div {
            margin-top: 9px;
        }
        .index-one-block {
            padding: 25px 0px;
            .index-one-img {
                height: 60px;
            }
            .index-tow-line {
                text-align:center;
            }
        }
        .title{
            padding-bottom: 15px;
            border-bottom: 1px solid #EDEDED;
        }
        .index-text-align {
            text-align:center;
            padding-top: 40px;
            padding-bottom: 40px;
            .index-tow-line {
                margin-bottom: 20px;
            }
        }
        .title—wide{
            font-weight:bold;
        }
    }
</style>
