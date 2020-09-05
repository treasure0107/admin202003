/**
 * 上传公共方法
 * Created by PhpStorm.
 * User: 李果 aiden.li
 * Email: 1334435738@qq.com
 * Date: 2019-06-18 12:53
 */
export default {

    uploadUrl: '',
    vueObj: null,
    miniSize: 10,

    beforeUpload (vue, file, size) {
        this.vueObj = vue
        return new Promise((resolve, reject) => {
            let check = this.checkUpload(file, size)
            if (check.type !== true) {
                SendMessage({message: check.message, type: check.type})
                reject(false)
            } else {
                this.uploadImage(file).then((res) => {
                    resolve(res)
                }).catch((e) => {
                    reject(e)
                })
            }
        })
    },

    checkUpload (file, size) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type.indexOf('mp4') > -1
        if (!isJPG) {
            return {type: 'error', 'message': `${file.type.replace('image/', '')}类型错误;暂时只支持jpge,jpg,png,mp4格式`}
        }
        const isLt2M = size ? file.size > size : false
        if (isLt2M) {
            let sizeValue = parseInt(size / 1024)
            return {type: 'error', 'message': `图片大小超出${sizeValue}KB限制`}
        }
        return {type: true, 'message': 'success'}
    },

    randomString (len) {
        len = len || 32
        const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        const maxPos = chars.length
        let pwd = ''
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos))
        }
        return pwd
    },
    getFileType (filename) {
        const pos = filename.lastIndexOf('.')
        let suffix = ''
        if (pos != -1) {
            suffix = filename.substring(pos)
        }
        return suffix
    },

    async uploadImage (item) {
        let _this = this
        return new Promise(async (resolve, reject) => {
            let {data} = await this.vueObj.$request.get(this.vueObj.$API.upload_token, {}, 'upload_token')
            this.uploadUrl = data.host
            let formdata = new FormData()
            let _key = data.dir + _this.randomString(10) + new Date().getTime() + _this.getFileType(item.name)
            formdata.append('key', _key)
            formdata.append('signature', data.signature)
            formdata.append('OSSAccessKeyId', data.accessid)
            formdata.append('policy', data.policy)
            formdata.append('success_action_status', '200')
            formdata.append('file', item)
            this.upload(formdata, _key).then(res => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
        })

    },

    upload (formdata, key, name) {
        return new Promise((resolve, reject) => {
            this.vueObj.$request.post(this.uploadUrl, formdata, 'null').then((res) => {
                let imageOssUrl = this.uploadUrl + '/' + key
                resolve({imageOssUrl: imageOssUrl, 'key': key})
            }).catch((e) => {
                SendMessage({message: '上传失败', type: 'error'})
                reject(false)
            })
        })

    }

}