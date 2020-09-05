<template>
  <div class="template-floor">
    <div class="images-list">
      <div class="list-1">
        <div class="list-1-1 activity">
          <img src="https://oss.ecoprint.tech/data/gallery_album/5/original_img/1560970456949828114.png" alt="">
          <div class="activity-pop">
            <el-button type="success" icon="el-icon-upload" circle></el-button>
          </div>
          <div class="list-1-2"></div>
        </div>
      </div>
      <div class="list-2">
        <div class="list-2-1">2-1</div>
        <div class="list-2-2">2-2</div>
      </div>
    </div>
    <div class="update-info">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="跳转地址">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                form:{
                    name:'',
                    date1:''
                }
            }
        }
    }
</script>
<style lang="less" scoped>
  .template-floor {
    width: 100%;
    margin-bottom: 30px;

    .images-list {
      width: 100%;
      height: 400px;
      background: #ffffff;
      border: 1px #cccccc solid;
      > div {
        float: left;
        > div {
          >img{
            width: 100%;
            height: 100%;
          }
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .activity{
          position: relative;
          .activity-pop{
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            left: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

      .list-1 {
        width: calc(~"50% - 1px");
        height: 100%;
        border-right: 1px #cccccc solid;
        >div{
          &:first-child{
            border-bottom: 1px #cccccc solid;
          }
          width: 100%;
          height: 50%;
        }
      }
      .list-2{
        width: calc(~"50% - 1px");
        height: 100%;
        border-right: 1px #cccccc solid;
        >div{
          &:first-child{
            border-bottom: 1px #cccccc solid;
          }
          width: 100%;
          height: 50%;
        }
      }
      .list-4{
        width: calc(~"25% - 1px");
        height: 100%;
        border-right: 1px #cccccc solid;
        >div{
          &:first-child{
            border-bottom: 1px #cccccc solid;
          }
          width: 100%;
          height: 50%;
        }
      }
    }
    .update-info{
      margin-top: 30px;
    }
  }
</style>