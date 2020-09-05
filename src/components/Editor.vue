<template>
  <div>
    <vue-ueditor-wrap v-model="newcontent" :config="myConfig"></vue-ueditor-wrap>
  </div>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap'
    export default {
        data () {
            return {
                newcontent: '',
                myConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 240,
                    initialFrameWidth: '100%',
                    // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                    serverUrl: CUSTOM_CONFIG.MAIN_HOST+'/ueditor/controller/',
                    UEDITOR_HOME_URL: '/static/UE/'
                }
            }
        },
        props: {
            content: '',
            height: {
                default: 300,
                type: Number
            }
        },
        created () {
            this.newcontent = this.content
        },
        mounted () {
            //this.editor.container.style.height = `${this.height}px`
        },
        methods: {
            setContent (content) {
                this.newcontent = content
            }
        },
        components: {
            VueUeditorWrap
        },
        computed: {
        },
        watch: {
            newcontent (res) {
                this.$emit('update:content', res)
            }
        }
    }
</script>

<style>
  .edui-editor{
    z-index: 10000!important;
  }
  #edui_fixedlayer{
    z-index: 10001!important;
  }
  .edui-box{
    line-height: normal!important;
  }
</style>