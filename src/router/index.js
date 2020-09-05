import Vue from 'vue'
import Router from 'vue-router'
import _ from 'lodash'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '*',
            name: '404paage',
            component: resolve => require(['@/components/404.vue'], resolve)
        },
        {
            path: '/',
            name: 'index',
            component: resolve => require(['@/pages/survey/total.vue'], resolve)
        },
        {
            path: '/advert/floorAd',
            name: '/advert/floorAd',
            component: resolve => require(['@/pages/advert/floor.vue'], resolve)
        },
        {
            path: '/login',
            name: 'login',
            component: resolve => require(['@/pages/login.vue'], resolve)
        },
        {
            path: '/findPwd',
            name: 'findPwd',
            component: resolve => require(['@/pages/findPwd.vue'], resolve)
        },
        {
            path: '/advert/homeBanner',
            name: '/advert/homeBanner',
            component: resolve => require(['@/pages/advert/banner.vue'], resolve)
        },
        {
            path: '/advert/recStores',
            name: '/advert/recStores',
            component: resolve => require(['@/pages/advert/RecStores.vue'], resolve)
        },
        {
            path: '/advert/pageAd',
            name: '/advert/pageAd',
            component: resolve => require(['@/pages/advert/pageAd.vue'], resolve)
        },
        {
            path: '/goods/attribute',
            name: '/goods/attribute',
            component: resolve => require(['@/pages/goods/attribute.vue'], resolve)
        },
        {
            path: '/goods/attrParam',
            name: '/goods/attrParam',
            component: resolve => require(['@/pages/goods/attrParam.vue'], resolve)
        },
        {

            path: '/member/member',
            name: '/member/member',
            component: resolve => require(['@/pages/member/member.vue'], resolve)
        },
        {

            path: '/node/node',
            name: '/node/node',
            component: resolve => require(['@/pages/node/node.vue'], resolve)
        },
        {

            path: '/role/role',
            name: '/role/role',
            component: resolve => require(['@/pages/role/role.vue'], resolve)
        },
        {
            path: '/member/addMember',
            name: '/member/addMember',
            component: resolve => require(['@/pages/member/addMember.vue'], resolve)
        },
        {
            path: '/orders/index',
            name: '/orders/index',
            component: resolve => require(['@/pages/orders/index.vue'], resolve)
        },
        {
            path: '/orders/detail',
            name: '/orders/detail',
            component: resolve => require(['@/pages/orders/detail.vue'], resolve)
        },
        {
            path: '/orders/return',
            name: '/orders/return',
            component: resolve => require(['@/pages/orders/return.vue'], resolve)
        },
        {
            path: '/orders/returnDetail',
            name: '/orders/returnDetail',
            component: resolve => require(['@/pages/orders/returnDetail.vue'], resolve)
        },
        {
            path: '/orders/aftermarket',
            name: '/orders/aftermarket',
            component: resolve => require(['@/pages/orders/aftermarket.vue'], resolve)
        },
        {
            path: '/orders/aftermarketDetail',
            name: '/orders/aftermarketDetail',
            component: resolve => require(['@/pages/orders/aftermarketDetail.vue'], resolve)
        },
        {
            path: '/orders/disputeDetail',
            name: '/orders/disputeDetail',
            component: resolve => require(['@/pages/orders/disputeDetail.vue'], resolve)
        },
        {
            path: '/orders/dispute',
            name: '/orders/dispute',
            component: resolve => require(['@/pages/orders/dispute.vue'], resolve)
        },
        {
            path: '/store/brokerage',
            name: '/store/brokerage',
            component: resolve => require(['@/pages/store/brokerage.vue'], resolve)
        },
        {
            path: '/store/settlement',
            name: '/store/settlement',
            component: resolve => require(['@/pages/store/settlement.vue'], resolve)
        },
        {
            path: '/store/settlementDetail',
            name: '/store/settlementDetail',
            component: resolve => require(['@/pages/store/settlementDetail.vue'], resolve)
        },
        {
            path: '/seller/shopDetail',
            name: '/seller/shopDetail',
            component: resolve => require(['@/pages/seller/shopDetail.vue'], resolve)
        },
        {
            path: '/seller/shop',
            name: '/seller/shop',
            component: resolve => require(['@/pages/seller/shop.vue'], resolve)
        },
        {
            path: '/goods/webclass',
            name: '/goods/webclass',
            component: resolve => require(['@/pages/goods/webclass.vue'], resolve)
        },
        {
            path: '/goods/goodsLog',
            name: '/goods/goodsLog',
            component: resolve => require(['@/pages/goods/goodsLog.vue'], resolve)
        },
        {
            path: '/goods/comment',
            name: '/goods/comment',
            component: resolve => require(['@/pages/goods/comment.vue'], resolve)
        },
        {

            path: '/goods/goods',
            name: '/goods/goods',
            component: resolve => require(['@/pages/goods/goods.vue'], resolve)
        },
        {
            path: '/goods/adminclass',
            name: '/goods/adminclass',
            component: resolve => require(['@/pages/goods/adminclass.vue'], resolve)
        },
        {
            path: '/logistics/lsetting',
            name: '/logistics/lsetting',
            component: resolve => require(['@/pages/logistics/lsetting.vue'], resolve)
        },
        {
            path: '/logistics/areasetting',
            name: '/logistics/areasetting',
            component: resolve => require(['@/pages/logistics/areasetting.vue'], resolve)
        },
        {
            path: '/help/FAQ',
            name: '/help/FAQ',
            component: resolve => require(['@/pages/help/FAQ.vue'], resolve)
        },
        {
            path: '/help/category',
            name: '/help/category',
            component: resolve => require(['@/pages/help/category.vue'], resolve)
        },
        {
            path: '/navigation/main',
            name: '/navigation/main',
            component: resolve => require(['@/pages/navigation/main.vue'], resolve)
        },
        {
            path: '/navigation/help',
            name: '/navigation/help',
            component: resolve => require(['@/pages/navigation/help.vue'], resolve)
        },
        {
            path: '/help/homeHelp',
            name: '/help/homeHelp',
            component: resolve => require(['@/pages/help/homeHelp.vue'], resolve)
        },
        {
            path: '/advert/floorGoods',
            name: '/advert/floorGoods',
            component: resolve => require(['@/pages/advert/floorGoods.vue'], resolve)
        },
        {
            path: '/seller/storeJoin',
            name: '/seller/storeJoin',
            component: resolve => require(['@/pages/seller/storeJoin.vue'], resolve)
        },
        {
            path: '/seller/storeJoinInfo',
            name: '/seller/storeJoinInfo',
            component: resolve => require(['@/pages/seller/storeJoinInfo.vue'], resolve)
        },
        {
            path: '/member/memberlist',
            name: '/member/memberlist',
            component: resolve => require(['@/pages/member/memberlist.vue'], resolve)
        },
        {
            path: '/member/memberInfo',
            name: '/member/memberInfo',
            component: resolve => require(['@/pages/member/memberInfo.vue'], resolve)
        },
        {
            path: '/member/log',
            name: '/member/log',
            component: resolve => require(['@/pages/member/log.vue'], resolve)
        },
        {
            path: '/seller/bankcard',
            name: '/seller/bankcard',
            component: resolve => require(['@/pages/seller/bankcard.vue'], resolve)
        },
        {
            path: '/seller/shopComment',
            name: '/seller/shopComment',
            component: resolve => require(['@/pages/seller/shopComment.vue'], resolve)
        },
        {
            path: '/seller/shopCommentInfo',
            name: '/seller/shopCommentInfo',
            component: resolve => require(['@/pages/seller/shopCommentInfo.vue'], resolve)
        },
        {
            path: '/coupon/coupon',
            name: '/coupon/coupon',
            component: resolve => require(['@/pages/coupon/coupon.vue'], resolve)
        },
        {
            path: '/coupon/couponGetList',
            name: '/coupon/couponGetList',
            component: resolve => require(['@/pages/coupon/couponGetList.vue'], resolve)
        },
        {
            path: '/coupon/addCoupon',
            name: '/coupon/addCoupon',
            component: resolve => require(['@/pages/coupon/addCoupon.vue'], resolve)
        },
        {
            path: '/seller/settings',
            name: '/seller/settings',
            component: resolve => require(['@/pages/seller/settings.vue'], resolve)
        },
        {
            path: '/seller/shopAttestation',
            name: '/seller/shopAttestation',
            component: resolve => require(['@/pages/seller/shopAttestation.vue'], resolve)
        },
        {
            path: '/seller/shopTrain',
            name: '/seller/shopTrain',
            component: resolve => require(['@/pages/seller/shopTrain.vue'], resolve)
        },
        {
            path: '/seller/shopService',
            name: '/seller/shopService',
            component: resolve => require(['@/pages/seller/shopService.vue'], resolve)
        },
        {
            path: '/seller/shopQuality',
            name: '/seller/shopQuality',
            component: resolve => require(['@/pages/seller/shopQuality.vue'], resolve)
        },
        {
            path: '/advert/keywords',
            name: '/advert/keywords',
            component: resolve => require(['@/pages/advert/keywords.vue'], resolve)
        },
        {
            path: '/help/special',
            name: '/help/special',
            component: resolve => require(['@/pages/help/special.vue'], resolve)
        }, {
            path: '/coupon/addCouponinfo',
            name: '/coupon/addCouponinfo',
            component: resolve => require(['@/pages/coupon/addCouponinfo.vue'], resolve)
        }, {
            path: '/orders/withdraw',
            name: '/orders/withdraw',
            component: resolve => require(['@/pages/orders/withdraw.vue'], resolve)
        }, {
            path: '/help/feedback',
            name: '/help/feedback',
            component: resolve => require(['@/pages/help/feedback.vue'], resolve)
        }, {
            path: '/member/questrewards',
            name: '/member/questrewards',
            component: resolve => require(['@/pages/member/questrewards.vue'], resolve)
        }, {
            path: '/member/growthrecord',
            name: '/member/growthrecord',
            component: resolve => require(['@/pages/member/growthrecord.vue'], resolve)
        },
        {
            path: '/activity/seckill',
            name: '/activity/seckill',
            component: resolve => require(['@/pages/activity/seckill.vue'], resolve)
        },
        {
            path: '/activity/addSeckill',
            name: '/activity/addSeckill',
            component: resolve => require(['@/pages/activity/addSeckill.vue'], resolve)
        },
        {
            path: '/activity/editSeckill',
            name: '/activity/editSeckill',
            component: resolve => require(['@/pages/activity/editSeckill.vue'], resolve)
        },
        {
            path: '/activity/seckillLog',
            name: '/activity/seckillLog',
            component: resolve => require(['@/pages/activity/seckillLog.vue'], resolve)
        },
        {
            path: '/activity/seckillInfo',
            name: '/activity/seckillInfo',
            component: resolve => require(['@/pages/activity/seckillInfo.vue'], resolve)
        },
        {
            path: '/activity/tg',
            name: '/activity/tg',
            component: resolve => require(['@/pages/activity/tg.vue'], resolve)
        },
        {
            path: '/activity/addTg',
            name: '/activity/addTg',
            component: resolve => require(['@/pages/activity/addTg.vue'], resolve)
        },
        {
            path: '/activity/editTg',
            name: '/activity/editTg',
            component: resolve => require(['@/pages/activity/editTg.vue'], resolve)
        },
        {
            path: '/activity/tgInfo',
            name: '/activity/tgInfo',
            component: resolve => require(['@/pages/activity/tgInfo.vue'], resolve)
        },
        {
            path: '/activity/tgLog',
            name: '/activity/tgLog',
            component: resolve => require(['@/pages/activity/tgLog.vue'], resolve)
        },
        {
            path: '/activity/activityList',
            name: '/activity/activityList',
            component: resolve => require(['@/pages/activity/activityList.vue'], resolve)
        },
        {
            path: '/activity/activityFloor',
            name: '/activity/activityFloor',
            component: resolve => require(['@/pages/activity/activityFloor.vue'], resolve)
        },
        {
            path: '/activity/activitySetGoods',
            name: '/activity/activitySetGoods',
            component: resolve => require(['@/pages/activity/activitySetGoods.vue'], resolve)
        },
        {
            path: '/activity/activityFloorGoods',
            name: '/activity/activityFloorGoods',
            component: resolve => require(['@/pages/activity/activityFloorGoods.vue'], resolve)
        },
        {
            path: '/survey/total',
            name: '/survey/total',
            component: resolve => require(['@/pages/survey/total.vue'], resolve)
        },
        {
            path: '/goods/purchaseclass',
            name: '/goods/purchaseclass',
            component: resolve => require(['@/pages/goods/purchaseclass.vue'], resolve)
        },
        {
            path: '/purchase/list',
            name: '/purchase/list',
            component: resolve => require(['@/pages/purchase/list.vue'], resolve),
            meta: {
                keepAlive: true // 不需要缓存
            }
        }, {
            path: '/purchase/listInfo',
            name: '/purchase/listInfo',
            component: resolve => require(['@/pages/purchase/listInfo.vue'], resolve)
        }, {
            path: '/purchase/deal',
            name: '/purchase/deal',
            component: resolve => require(['@/pages/purchase/deal.vue'], resolve)
        },
        {
            path: '/purchase/edit',
            name: '/purchase/edit',
            component: resolve => require(['@/pages/purchase/edit.vue'], resolve)
        }, {
            path: '/purchase/email',
            name: '/purchase/email',
            component: resolve => require(['@/pages/purchase/settingEmail.vue'], resolve)
        }, {
            path: '/goods/purchaseclass',
            name: '/goods/purchaseclass',
            component: resolve => require(['@/pages/goods/purchaseclass.vue'], resolve)
        },
        {
            path: '/im/list',
            name: '/im/list',
            component: resolve => require(['@/pages/im/list.vue'], resolve)
        }, {
            path: '/help/feedback',
            name: '/help/feedback',
            component: resolve => require(['@/pages/help/feedback.vue'], resolve)
        }
        , {
            path: '/advert/mobIconSet',
            name: '/advert/mobIconSet',
            component: resolve => require(['@/pages/advert/mobIconSet.vue'], resolve)
        }
        , {
            path: '/im/loginList',
            name: '/im/loginList',
            component: resolve => require(['@/pages/im/loginList.vue'], resolve)

        },
        {
            path: '/seller/joinTrain',
            name: '/seller/joinTrain',
            component: resolve => require(['@/pages/seller/joinTrain.vue'], resolve)
        },
        {
            path: '/advert/youxuan',
            name: '/advert/youxuan',
            component: resolve => require(['@/pages/advert/youxuanFloor.vue'], resolve)
        },
        {
            path: '/advert/youxuanGoods',
            name: '/advert/youxuanGoods',
            component: resolve => require(['@/pages/advert/youxuanFloorGoods.vue'], resolve)
        },

        {
            path: '/setTag/setTag',
            name: '/setTag/setTag',
            component: resolve => require(['@/pages/setTag/setTag.vue'], resolve)
        },

        {
            path: '/orders/memberWithdraw',
            name: '/orders/memberWithdraw',
            component: resolve => require(['@/pages/orders/memberWithdraw.vue'], resolve)
        },
        {
            path: '/operate/preferentialPayment',
            name: '/operate/preferentialPayment',
            component: resolve => require(['@/pages/operate/preferentialPayment.vue'], resolve)
        },
        {
            path: '/purchase/turnList',
            name: '/purchase/turnList',
            component: resolve => require(['@/pages/purchase/turnList.vue'], resolve)
        },
        {
            path: '/seller/intention',
            name: '/seller/intention',
            component: resolve => require(['@/pages/seller/intention.vue'], resolve)
        },
    ]
})
