<template>
  <div class="page-404">
    <div>404</div>
    <div>你找的页面不存在</div>
  </div>
</template>
<script>
    export default {
        data () {
            return {}
        }
    }
</script>
<style lang="less" scoped>
  @import "../assets/variable";
  .page-404{
    width: calc(~"100% - 30px");
    height: calc(~"100vh - 120px");
    background: #ffffff;
    margin-left: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 80px;
    margin-top: 5px;
    color: #999999;
    flex-direction: column;
    box-shadow: @contentBoxShadow;
    border-radius: @contentBorderRadius;
    >div{
      &:last-child{
        margin-top: 10px;
        font-size: 20px;
      }
    }
  }
</style>
