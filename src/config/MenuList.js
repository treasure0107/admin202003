/**
 * Created by PhpStorm.
 * User: 李果 aiden.li
 * Email: 1334435738@qq.com
 * Date: 2019-06-18 12:18
 */
export const MENU_LIST = [
    {
        name: '首页',
        path: '/',
        icon: 'el-icon-s-home',
    },
    {
        name: '商品',
        path: '/goods',
        icon: 'el-icon-s-goods',
        group: [
            {
                name: '分类',
                list: [
                    {
                        name: '运营分类',
                        path: '/goods/webclass',
                        icon: 'el-icon-help',
                    },
                    {
                        name: '平台分类',
                        path: '/goods/adminclass',
                        icon: 'el-icon-s-help',
                    }
                ]
            },
            {
                name: '属性',
                list: [
                    {
                        name: '商品属性',
                        path: '/goods/attribute',
                        icon: 'el-icon-attract',
                    },
                    {
                        name: '参数设置',
                        path: '/goods/attrParam',
                        icon: 'el-icon-tickets',
                    }
                ]
            }
        ]
    }, {
        name: '订单',
        icon: 'el-icon-s-order',
        path: '/orders/index',
        group: [
            {
                name: '平台订单',
                list: [
                    {
                        name: '订单列表',
                        path: '/orders/index',
                        icon: 'el-icon-s-unfold',
                    }, {
                        name: '售后订单',
                        path: '/orders/aftermarket',
                        icon: 'el-icon-s-unfold',
                    }, {
                        name: '退款订单',
                        path: '/orders/returnOrders',
                        icon: 'el-icon-s-unfold',
                    }, {
                        name: '交易纠纷',
                        path: '/orders/dispute',
                        icon: 'el-icon-warning',
                    }
                ]
            }
        ]
    },
    {
        name: '广告设置',
        icon: 'el-icon-s-help',
        path: '/advert/floorAd',
        group: [
            {
                name: 'PC广告',
                list: [
                    {
                        name: '楼层广告',
                        path: '/advert/floorAd',
                        icon: 'el-icon-s-operation',
                    },
                    {
                        name: '首页banner',
                        path: '/advert/homeBanner',
                        icon: 'el-icon-turn-off',
                    },
                    {
                        name: '推荐店铺',
                        path: '/advert/recStores',
                        icon: 'el-icon-school',
                    },
                    {
                        name: '页面广告',
                        path: '/advert/pageAd',
                        icon: 'el-icon-news',
                    }
                ]
            }
        ]
    },
    {
        name: '帮助',
        icon: 'el-icon-question',
        path: '/help',
        group: [
            {
                name: '帮助分类',
                list: [
                    {
                        name: '商家',
                        path: '/help/category',
                        icon: 'el-icon-s-operation',
                    },
                    {
                        name: '买家',
                        path: '/help/category',
                        icon: 'el-icon-turn-off',
                    }
                ]
            }, {
                name: 'FAQ',
                list: [
                    {
                        name: 'FAQ',
                        path: '/help/FAQ',
                        icon: 'el-icon-s-operation',
                    }
                ]
            }, {
                name: '帮助首页',
                list: [
                    {
                        name: '商家',
                        path: '/help/category',
                        icon: 'el-icon-s-operation',
                    },
                    {
                        name: '买家',
                        path: '/help/category',
                        icon: 'el-icon-turn-off',
                    }
                ]
            }, {
                name: '意见反馈',
                list: [
                    {
                        name: '意见反馈',
                        path: '/help/category',
                        icon: 'el-icon-s-operation',
                    }
                ]
            }
        ]
    },
    {
        name: '导航',
        icon: 'el-icon-smoking',
        path: '/navigation',
        group: [{
            list: [
                {
                    name: '主导航',
                    path: '/navigation/main',
                    icon: 'el-icon-house',
                },
                {
                    name: '帮助导航',
                    path: '/navigation/help',
                    icon: 'el-icon-c-scale-to-original',
                },
                {
                    name: '底部导航',
                    path: '/navigation/bottom',
                    icon: 'el-icon-monitor',
                },
                {
                    name: '友情链接',
                    path: '/navigation/links',
                    icon: 'el-icon-paperclip',
                }
            ]
        }]
    },
    {
        name: '商家',
        path: '/shop',
        icon: 'el-icon-s-release',
    },
    {
        name: '设置',
        path: '/member/member',
        icon: 'el-icon-s-release',
        group: [
            {
                name: '权限',
                list: [
                    {
                        name: '员工管理',
                        path: '/member/member',
                        icon: 'el-icon-s-operation',
                    },
                ]
            }
        ]
    },
    {
        name: '物流',
        path: '/index',
        icon: 'el-icon-truck',
        group: [
            {
                list: [
                    {
                        name: '配送方式',
                        path: '/logistics/lsetting',
                        icon: 'el-icon-guide',
                    },
                    {
                        name: '地区列表',
                        path: '/logistics/arealist',
                        icon: 'el-icon-location',
                    },
                    {
                        name: '区域设置',
                        path: '/logistics/areasetting',
                        icon: 'el-icon-setting',
                    }
                ]
            }
        ]

    }
]

