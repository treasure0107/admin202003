/**
 * Created by PhpStorm.
 * User: 李果 aiden.li
 * Email: 1334435738@qq.com
 * Date: 2019-06-18 12:53
 */

import axios from 'axios'
// import { MAIN_HOST, UPLOAD_TOKEN_HOST } from '@/config/API'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
let Base64 = require('js-base64').Base64

// import custom_config from '@/../custom_config.js'
// axios.defaults.baseURL = custom_config.MAIN_HOST

axios.interceptors.request.use(function (config) {
    if (localStorage.getItem('token')) {
        //config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return config
}, function (error) {
    return Promise.reject(error)
})
export default {
    host_type: 'main',
    request_url: '',
    exp_header: {},

    setBaseUrl (type) {
        this.host_type = type
        if (!CUSTOM_CONFIG) {
            SendMessage({message: '未读取到配置文件', type: 'error'})
            return
        }
        type === 'main' && (axios.defaults.baseURL = CUSTOM_CONFIG.MAIN_HOST)
        type === 'upload_token' && (axios.defaults.baseURL = CUSTOM_CONFIG.UPLOAD_TOKEN_HOST)
    },

    async post (url, params, host_type = 'main', exp_header = {}) {
        this.setBaseUrl(host_type)
        this.exp_header = exp_header
        return await this._req(url, params, 'POST')
    },

    async get (url, params, host_type = 'main', exp_header = {}) {
        //url == '/activity/get_activity_list_web' ? axios.defaults.baseURL = '/bendis' : this.setBaseUrl(host_type)
        this.setBaseUrl(host_type)
        this.exp_header = exp_header
        return await this._req(url, params, 'GET')
    },

    async request (url, params, host_type, req_type = 'GET', exp_header = {}) {
        this.setBaseUrl(host_type)
        this.exp_header = exp_header
        return await this._req(url, params, req_type)
    },

    async _req (url, params, type) {
        this.request_url = url
        //TODO 状态判断 登陆状态
        let header = await this.createToken()
        const checkResult = (res) => {
            res.data.code == 401 && (window.location.href = '/#/login')

            if (this.host_type === 'main' && res.data.code != 200) {
                let message = res.data.message ? res.data.message : res.data.msg
                SendMessage({message: message, type: 'error'})
                return false
            }
            return true
        }

        return new Promise((resolve, reject) => {
            let send_param = {
                method: type,
                url: url,
                data: params,
                headers: header
            };
            (type == 'get' || type == 'GET') && (send_param['params'] = params)
            axios(send_param).then(async res => {
                if (res.status === 200) {
                    checkResult(res) ? resolve(res.data) : reject(false)
                } else {
                    reject(false)
                    console.log(res)
                }
            }).catch(async error => {
                SendMessage({
                    message: '请求错误了',
                    type: 'error'
                })
                reject(false)
            })
        })
    },

    async createToken () {

        const checkOutLogin = () => {
            let urls = ['/login/login', '/login/find_password', '/login/send_email', '/auth_token/get_token'],
                state = true
            urls.forEach((item) => {
                if (this.request_url.indexOf(item) != -1) {
                    state = false
                    return state
                }
            })
            return state
        }

        let token = sessionStorage.getItem('token')
        let clientInfo = JSON.parse(sessionStorage.getItem('clientInfo'))
        if (!clientInfo) {
            checkOutLogin() && (window.location.href = '/#/login')
            clientInfo = {admin_id: '', app_key: ''}
        }
        let authentication = Base64.encode(token + '-' + clientInfo.admin_id + '-' + clientInfo.app_key)
        return {
            'X-Requested-With': 'XMLHttpRequest',
            'source': '676ddd1ea49de84eabd4c76924b40fe0',
            'authentication': authentication,
            'routerpath': this.exp_header.router_path ? this.exp_header.router_path : '',
            'requesthost': this.exp_header.request_host ? this.exp_header.request_host : '',
            'extraurl': this.exp_header.extra_url ? this.exp_header.extra_url : '',
            'handleclass': this.exp_header.handle_class ? this.exp_header.handle_class : '',
            'handledesc': this.exp_header.handle_desc ? Base64.encode(this.exp_header.handle_desc) : ''
        }
    }
}
