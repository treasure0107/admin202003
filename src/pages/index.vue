<template>
    <div class="content">
        拍拍印后台管理系统
    </div>
</template>
<script>
    import { Table, TableColumn, Button } from 'element-ui'

    export default {
        data () {
            return {
            }
        },
        async created () {
            if(!sessionStorage.getItem('clientInfo')){
                window.location.href = '/#/login';
            }

            // let data = await this.$request.post(this.$API.login)
            // console.log(data)
        },
        components: {
            ElTable: Table, ElTableColumn: TableColumn, ElButton: Button
        }
    }
</script>
<style lang="less" scoped>
    @import "../assets/pageHeader";
    .content {
        width: 100%;
        height: 100%;
        background: #f5f5f5;
        border-bottom: 1px #eeeeee solid;
        border-radius: 5px;
        text-align:center;
        font-size: xx-large;
        margin-top: 200px;
        color: #999999;
    }
</style>
