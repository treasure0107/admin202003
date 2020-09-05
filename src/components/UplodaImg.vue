<template>
  <div>
    <el-button :loading="uploading" :size="buttonSize" type="primary" @click="clickUpload">上传<i
      class="el-icon-upload el-icon--right"></i>
    </el-button>
    <input @change='add_img' type="file" class="upload-image-but" ref="file" style="display: none">
  </div>
</template>
<script>
    import Upload from '../library/Upload'

    export default {
        data () {
            return {
                uploading: false
            }
        },
        props: {
            keystr: '',
            maxsize: {
                type: Number,
                default: 10 * 1024 * 1024
            },
            buttonSize: '',
        },
        methods: {
            clickUpload () {
                this.$refs.file.click()
            },

            async add_img (events) {
                this.uploading = true
                let file = events.target.files[0]
                try {
                    document.querySelector('.upload-image-but').value = ''
                    let data = await Upload.beforeUpload(this, file, this.maxsize)
                    this.uploading = false
                    data['filename'] = file['name']
                    this.$emit('uploaded', data, this.keystr)
                } catch (e) {
                    this.uploading = false
                }
            },
        }
    }
</script>
<style lang="less" scoped>

</style>