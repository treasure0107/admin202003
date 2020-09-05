//店铺等级
export const RANK_STATUS = {
    0: 'VIP商家',
    1: '金牌商家',
    2: '银牌商家',
    3: '铜牌商家'
}
export const RANK_STATUS_OPTION = [
    {
        'value': 3,
        'label': '铜牌商家',
    },
    {
        'value': 2,
        'label': '银牌商家',
    },
    {
        'value': 1,
        'label': '金牌商家',
    },
    {
        'value': 0,
        'label': 'VIP商家',
    },
]
//店铺状态
export const SHOP_CLOSE = {
    0: '关闭',
    1: '上线',
    2: '准备上线'
}
export const SHOP_CLOSE_OPTION = [
    {
        'value': '0',
        'label': '关闭',
    },
    {
        'value': '1',
        'label': '上线',
    },
    {
        'value': '2',
        'label': '准备上线',
    },
]
//店铺类型
export const OPEN_STATUS = {
    0: '公司公有店',
    1: '公司私有店',
    2: '个人公有店',
    3: '企业私域店',
    4: '个人私域店',
    5: '个人私有店'
}
export const OPEN_STATUS_OPTION = [
    {
        'value': '0',
        'label': '公司公有店',
    },
    {
        'value': '1',
        'label': '公司私有店',
    },
    {
        'value': '2',
        'label': '个人公有店',
    },
    {
        'value': '3',
        'label': '企业私域店',
    },
    {
        'value': '4',
        'label': '个人私域店',
    },
    {
        'value': '5',
        'label': '个人私有店',
    },
]
//店铺类型
export const MERCHANT_LEVEL = {
    1: '普通商家',
    2: '核心商家',
    3: '战略商家'
}
export const MERCHANT_LEVEL_OPTION = [
    {
        'value': 1,
        'label': '普通商家',
    },
    {
        'value': 2,
        'label': '核心商家',
    },
    {
        'value': 3,
        'label': '战略商家',
    }
]
//商品是否审核
export const REVIEW_GOODS = {
    0: '否',
    1: '是',
}
export const REVIEW_GOODS_OPTION = [
    {
        'value': '0',
        'label': '否',
    },
    {
        'value': '1',
        'label': '是',
    },
]
//银行卡审核状态
export const IS_AUTH = {
    0: '审核不通过',
    1: '审核通过',
}
//服务项目
export const SERVER_COMMIT = {
    0: '售后无忧',
    1: '急速出货',
    2: '专人设计'
}
export const SERVER_COMMIT_OPTION = [
    {
        'value': '1',
        'label': '急速出货',
    }, {
        'value': '2',
        'label': '专人设计',
    }, {
        'value': '0',
        'label': '售后无忧',
    }
]
//店铺认证
export const SHOP_AUTH = {
    1: '金牌服务',
    2: '参加质保',
    3: '专业培训',
    4: '实地认证'
}
//结算状态
export const SETTLEMENT_STATUS = {
    0: '待处理',
    2: '已结算',
    3: '待复核',
    4: '不结算'
}
//结算状态
export const SETTLEMENT_STATUS_TAB = {
    'all': '',
    'waitHandle': 0,
    'waitReview': 3,
    'settled': 2,
    'nonSettlement': 4
}
//售后天数
export const AFTER_SALE_DAY = [
    {
        'value': '7',
        'label': '7',
    }, {
        'value': '14',
        'label': '14',
    }
]
//操作模块
export const OPERATE_MODULE_OPTION = [
    {
        'value': '',
        'label': '请选择',
    }, {
        'value': '1',
        'label': '商品',
    }, {
        'value': '2',
        'label': '活动',
    }, {
        'value': '3',
        'label': '店铺基本信息',
    }, {
        'value': '4',
        'label': '商家登录',
    }, {
        'value': '5',
        'label': '商家申请开票',
    }, {
        'value': '6',
        'label': '钱包',
    }
]
//服务项目
export const SHOP_LOGS = {
    0: '拍拍快印',
    1: '企业印'
}
export const SHOP_LOGS_OPTION = [
    {
        'value': '0',
        'label': '拍拍快印',
    }, {
        'value': '1',
        'label': '企业印',
    }
]
