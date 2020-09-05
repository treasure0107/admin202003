export default {

    /**
     * 公共延迟方法
     * @param time
     * @returns {Promise<any>}
     */

    wait (time = 2000) {
        return new Promise((resolve, reject) => {
            setTimeout((res) => {
                resolve(true)
            }, time)
        })
    },

    /**
     * 获取当前登陆用户信息
     * @param field
     * @returns {{}}
     */
    getNowUserId (field = 'admin_id') {
        let userInfo = sessionStorage.getItem('clientInfo')
        userInfo = userInfo ? JSON.parse(userInfo) : {}
        return field ? userInfo[field] : userInfo
    },

    /**
     * 获取后台昵称
     * @param id
     * @param vue
     * @returns {Promise<string|rules.user_name|{trigger, message, required}|*>}
     */
    async getUserName (id, vue) {
        if (!id) return ''
        let userList = sessionStorage.getItem('ADMIN_USER_LIST')
        userList = userList ? JSON.parse(userList) : {}
        if (userList[id]) {
            return userList[id]
        } else {
            let {data} = await vue.$request.post(vue.$API.get_member_name, {admin_id: id})
            if (data && data.user_name) {
                userList[id] = data.user_name
                sessionStorage.setItem('ADMIN_USER_LIST', JSON.stringify(userList))
                return data.user_name
            } else {
                return ''
            }
        }
    },

    /**
     * 获取商家昵称
     * @param id
     * @param vue
     * @returns {Promise<string|*>}
     */
    async sellerName (id, vue) {
        let list = sessionStorage.getItem('ADMIN_SELLER_LIST')
        list = list ? JSON.parse(list) : {}
        if (list[id]) return list[id]

        let {data} = await vue.$request.get(vue.$API.common_api, {shop_id: id}, 'main', {
            router_path: 'seller/shop',
            request_host: 'APP_SELLER_SERVER_HOST',
        })
        if (data.result.length) {
            list[id] = data.result[0]['shop_name']
            sessionStorage.setItem('ADMIN_SELLER_LIST', JSON.stringify(list))
            return data.result[0]['shop_name']
        } else
            return ''
    },

    /**
     *  弹出确认框
     * @param vue
     * @param content
     * @param title
     * @returns {Promise<T | boolean>}
     */
    async confirmDialog (vue, content, title = '提示') {
        return await vue.$confirm(content, title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            return Promise.resolve(true)
        }).catch((e) => {
            return Promise.resolve(false)
        })
    },

    /**
     * 文件下载
     * @param url
     */
    downloadFile (url,name='') {
        let host = window.location.host.indexOf('admin.paipaiyin.cn') >= 0 ? 'https://www.paipaiyin.cn' : 'https://ppytest.paipaiyin.cn'
        let urls = `${host}/api/application_seller/se_home/Download?url=${url}`
        name && (urls +=`&file_name=${name}&type=1`)
        window.open(urls)
    },

    /**
     * 获取参数
     * @param name
     * @returns {string | boolean}
     */
    query: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || false
    },

    /**
     * 时间转化
     * @param time
     * @returns {string}
     */
    formatDate (time) {
        let times = time * 1000
        let date = new Date(times)
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
        return Y + M + D + h + m + s
    },
    /**
     * 分类单位
     *
     * @returns array
     */
    async getClassnuit (vue) {
        let data = await vue.$request.request(vue.$API.common_api, {
        }, 'main', 'GET', {
            router_path: 'server_goods/get_units',
            request_host:'EDIT_CATEGORY_HOST',
            handle_desc:"获取分类单位;"
        });
        return data.code === 200 && data.data.length > 0 ? data.data : [];
    },

    iframePostMessage (data, type = 'message') {
        window.parent.postMessage({
            cmd: type,
            params: data
        }, '*')
    }

}