<template>
  <el-dialog :title="title" :visible.sync="showDialog" width="70%" :close-on-click-modal="false"
             :close-on-press-escape="false" @close="closeDialog">
    <div v-loading="loading">
      <iframe :src="openUrl" width="100%" height="700" frameborder="0"
              ref="iframe">
      </iframe>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        data () {
            return {
                openUrl: '',
                title: '打开窗口',
                showDialog: false,
                messageNumber: 0,
                number: 0,
                loading: false
            }
        },
        mounted () {
            window.addEventListener('message', this.handleMessage)
        },
        methods: {
            setShow (params) {
                this.openUrl = window.location.origin + '/#' + params.url
                this.showDialog = true
                this.messageNumber = 0
                if (params.title) this.title = params.title
                if (params.loading) this.loading = params.loading
                if (params.number) this.number = params.number
            },
            handleMessage (event) {
                const data = event.data
                console.log(data)
                if (data.cmd == 'loading') {
                    this.loading = false
                } else if (data.cmd == 'message') {
                    this.messageNumber++
                    console.log(this.number, this.messageNumber)
                    if ((this.number && this.messageNumber >= this.number) || !this.number) {
                        this.closeWindow(data.params)
                    }
                }
            },
            closeWindow (params) {
                this.showDialog = false
                this.openUrl = ''
                this.messageNumber = 0
                this.number = 0
                this.loading = false
                this.title = '打开窗口'
                this.$emit('closeOpenWindow', params)
            },
            closeDialog () {
                this.showDialog = false
                this.openUrl = ''
                this.messageNumber = 0
                this.number = 0
                this.loading = false
                this.title = '打开窗口'
            }
        }
    }
</script>

<style scoped>

</style>