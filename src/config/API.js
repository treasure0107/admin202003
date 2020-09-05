/**
 * Created by PhpStorm.
 * User: 李果 aiden.li
 * Email: 1334435738@qq.com
 * Date: 2019-06-18 12:54
 */
    // import config from '@/../custom_config.js'

    // export const MAIN_HOST = config.MAIN_HOST
    // export const UPLOAD_TOKEN_HOST = config.UPLOAD_TOKEN_HOST
export const API = {
        survey_total: '/survey/total',
        login: '/login/login',
        login_find_password: '/login/find_password',
        login_send_email: '/login/send_email',
        get_access_token: '/auth_token/get_token',
        upload_token: '/api/server_doc/doc_center/oss_secret/',
        //广告-banner
        banner_info: 'category/banner/list',
        banner_up: 'category/banner/up',
        banner_down: 'category/banner/down',
        banner_set: 'category/banner/set',

        //权限
        member_list: 'auth_manage/get_member_list',
        add_member: 'auth_manage/add_member',
        edit_member: 'auth_manage/edit_member',
        del_member: 'auth_manage/del_member',
        get_member_name: 'auth_manage/get_member_name',
        get_member_log: 'common/get_member_log',
        get_name_list: 'auth_manage/get_name_list',

        node_list: 'auth_manage/get_node_list',
        get_node_info: 'auth_manage/get_node_info',
        add_node: 'auth_manage/add_node',
        edit_node: 'auth_manage/edit_node',
        delete_node: 'auth_manage/del_node',
        role_list: 'auth_manage/get_role_list',
        add_role: 'auth_manage/add_role',
        edit_role: 'auth_manage/edit_role',
        del_role: 'auth_manage/del_role',
        //规格参数
        attr_param: 'goods/attr_param/apis',
        goods_attr: '/goods/goods_attr/apis',
        goods_comment: '/goods/goods_comment',
        goods_admin_log: '/goods/get_goods_log',
        //公共请求
        common_api: '/common/common/apis',
        //物流请求
        logistics_api: '/logistics/logisticsList',
        logistics_del_api: '/logistics/delCompany',
        logistics_status_api: '/logistics/statusCompany',
        logistics_one_api: '/logistics/oneCompany',
        logistics_add_api: '/logistics/addCompany',
        logistics_edit_api: '/logistics/editCompany',
        area_api: '/logistics/areaList',
        area_one_api: '/logistics/oneArea',
        area_del_api: '/logistics/delArea',
        area_edit_api: '/logistics/editArea',
        area_add_api: '/logistics/addArea',
        //店铺设置
        seller_setting_info: '/seller/setting_info',
        seller_type: '/seller/seller_type',
        edit_seller_setting: 'auth_manage/edit_store',
        addressInfo: 'logistics/addressInfo',
        operate_shop_log: '/store/log',

        walletLogs: '/common/common/wallet_log',
        common_logs: '/common/common/common_log',
        //优惠券服务
        coupon_server_list: '/specialoffer/coupons_filter/',
        coupon_use_list: '/specialoffer/coupons_user/',
        coupon_use_download: '/specialoffer/get_coupons_user/',

        //活动
        activity_seckill_list: '/activity/get_seckill_list',
        add_seckill: '/activity/add_seckill',
        edit_seckill: '/activity/edit_seckill',
        end_seckill: '/activity/end_seckill',
        get_seckill_log: '/activity/get_seckill_log',
        get_seckill_info: '/activity/get_seckill_info',
        activity_list_web: '/activity/get_activity_list_web',

        activity_tg_list: '/activity/get_tg_list',
        add_tg: '/activity/add_tg',
        edit_tg: '/activity/edit_tg',
        get_tg_info: '/activity/get_tg_info',
        get_tg_log: '/activity/get_tg_log',
        end_tg: '/activity/end_tg',
        //优惠券发送短信
        send_sms: '/specialoffer/send_sms/',
        send_email: '/specialoffer/send_email/',
        get_user: '/specialoffer/get_user/',
    }

