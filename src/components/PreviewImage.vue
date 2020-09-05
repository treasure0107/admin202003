<template>
  <div class="preview-content" :style="'max-width:'+width+';'+'max-height:'+height+';float:left'">
    <div class="preview-images" :class="{'move-preview-images':showImage}" @click="showImage=false
">
      <img :src="image" alt="" @click.stop="showImage=true">
      <i class="el-icon-close close-preview" @click="showImage=false"></i>
    </div>
    <img :src="image" alt="" :style="'max-width:'+width+';'+'max-height:'+height" @click="showImage=true">
    <div class="download-image" @click="$common.downloadFile(image,filename)" v-if="download">下载</div>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                showImage: false
            }
        },
        props: {
            image: '',
            filename: '',
            width: {
                type: String,
                default: 'auto'
            },
            height: {
                type: String,
                default: 'auto'
            },
            download: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style scoped lang="less">
  .box-shadows() {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }

  .preview-content {
    float: left;
    margin-left: 20px;

    &:first-child {
      margin-left: 0;
    }
  }

  .preview-images {
    display: flex;
    justify-content: center;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100vh;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    opacity: 0;
    transition: all 0.3s;
    flex-direction: column;

    img {
      max-width: 60%;
      max-height: 60%;
      padding: 10px;
      .box-shadows();
      border-radius: 4px;
      transition: all 0.3s;
      background: #ffffff;
    }

    .close-preview {
      width: 30px;
      height: 30px;
      border-radius: 50px;
      background: transparent;
      color: #ffffff;
      border: 1px #cccccc solid;
      margin-top: 15px;
      text-align: center;
      .box-shadows();
      line-height: 30px;
      font-size: 20px;
      transition: all 0.3s;

      &:hover {
        background: #666666;
      }
    }
  }

  .move-preview-images {
    opacity: 1;
    z-index: 111111;

    > img, .close-preview {
      transform: translateY(20px);
    }
  }

  .download-image {
    width: 40px;
    height: 25px;
    display: flex;
    justify-content: center;
    font-size: 12px;
    align-items: center;
    color: #FFFFFF;
    margin: 5px auto;
    border-radius: 5px;
    background: #409EFF;
    cursor: pointer;
  }
</style>