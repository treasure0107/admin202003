//订单状态
export const ORDER_STATUS = {
    0: '取消订单',
    1: '待接单',
    2: '待付款',
    3: '待确认印刷',
    4: '待发货',
    5: '待收货',
    6: '待评价',
    7: '已完成',
    8: '待尾款付款',
    9: '待核销',
};
//订单类型
export const ORDER_TYPE = {
    0: '库存类',
    1: '生产类',
    2: '定制类',
    3: '分期类',
    6: '采购类',
    7: '自提类',
    8: '线下快印订单',
    9: '分销订单'
};
export const ORDER_TYPE_OPTION = [
    {
        'value': '0',
        'label': '库存类',
    },{
        'value': '1',
        'label': '生产类',
    },{
        'value': '2',
        'label': '定制类',
    },{
        'value': '3',
        'label': '分期类',
    },{
        'value': '6',
        'label': '采购类',
    },{
        'value': '7',
        'label': '自提类',
    },{
        'value': '8',
        'label': '线下快印订单',
    },{
        'value':'9',
        'label':'分销订单'
    }
];
//支付类型
export const PAY_TYPE = {
    0: '支付宝',
    1: '微信',
    2: '银联',
    3: '虚拟支付'
};
export const PAY_TYPE_OPTION = [
    {
        'value': '0',
        'label': '支付宝',
    },{
        'value': '1',
        'label': '微信',
    },{
        'value': '2',
        'label': '银联',
    },{
        'value': '3',
        'label': '虚拟支付',
    }
];
//下单平台
export const FROM_SOURCE = {
    1: '拍拍印-PC',
    2: '拍拍印-Android',
    3: '拍拍印-iOS',
    4: '拍拍印-H5',
    5: '拍拍印-小程序',
    6: '拍拍快印',
    7: '企业印微应用',
    8: 'H5-私域店'
};
export const FROM_SOURCE_OPTION = [
    {
        'value': '1',
        'label': '拍拍印-PC',
    },{
        'value': '2',
        'label': '拍拍印-Android',
    },{
        'value': '3',
        'label': '拍拍印-iOS',
    },{
        'value': '4',
        'label': '拍拍印-H5',
    },{
        'value': '5',
        'label': '拍拍印-小程序',
    },{
        'value': '6',
        'label': '拍拍快印',
    },{
        'value': '7',
        'label': '企业印微应用',
    },{
        'value': '8',
        'label': 'H5-私域店',
    }
];
//来源类型
export const ORDER_FROM_SOURCE = {
    1: 'BD订单'
};
export const ORDER_FROM_SOURCE_OPTION = [
    {
        'value': '1',
        'label': 'BD订单',
    }
];
//售后类型
export const AFTER_TYPE = {
    0: '仅退款',
    1: '退货退款'
};
//售后状态
export const AFTER_STATUS = {
    0: '售后失败',
    1: '处理中',
    2: '待退货',
    3: '待卖家收货',
    4: '售后成功'
};
//快递类型
export const EXPRESS_TYPE = {
    0: '普通快递',
    1: '同城配送',
    2: '自提',
    3: '无需配送'
};
//退款状态
export const RETURN_STATUS = {
    0: '取消退款',
    1: '待处理',
    2: '已处理'
};
//发票类型
export const INVOICE_NATURE = {
    1: '电子发票',
    2: '纸质发票'
};
//对账结果
export const PAY_RESULT = {
    0: '支付金额不匹配',
    1: '一致',
    2: '异常订单'
};

//时间条件
export const TIME_WHERE = {
    'week_date': '近7天',
    'one_month_date': '近1个月',
    'quarter_date': '近3个月',
    'half_year_date': '近半年',
    'one_year_date': '近1年',
};
export const TIME_WHERE_OPTION = [
    {
        'value': 'week_date',
        'label': '近7天',
    },{
        'value': 'one_month_date',
        'label': '近1个月',
    },{
        'value': 'quarter_date',
        'label': '近3个月',
    },{
        'value': 'half_year_date',
        'label': '近半年',
    },{
        'value': 'one_year_date',
        'label': '近1年',
    }
];

//交易纠纷状态
export const DISPUTE_STATUS = {
    0: '待处理',
    1: '已处理',
};
export const DISPUTE_STATUS_TAB = {
    'waitHandle': '0',
    'handleFinish': '1',
};

