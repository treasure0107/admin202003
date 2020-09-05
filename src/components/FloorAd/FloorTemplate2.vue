<template>
  <div class="template-floor">
   <!-- <el-form inline label-width="120px" v-if="nowIndex">
      <el-form-item label="跳转链接">
        <el-input placeholder="跳转链接" @change="changeInput" v-model="list[nowIndex].img_link"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="uploadImage" type="primary">上传<i class="el-icon-upload el-icon&#45;&#45;right"></i></el-button>
      </el-form-item>
    </el-form>-->
    <div class="images-list">

      <div class="list-1">
        <div class="list-1-1" @mouseenter="nowIndex='1-1'" @click="nowIndex='1-1'" :class="{'activity':nowIndex=='1-1'}">
          <img :src="list['1-1'].img_url" alt="" v-if="list['1-1'].img_url">
          <template v-else>1-1</template>
          <div class="activity-pop" v-if="nowIndex=='1-1'" @click="setOpenUpload">编辑</div>
        </div>
      </div>

      <div class="list-2">
        <div class="list-2-1" @mouseenter="nowIndex='2-1'" @click="nowIndex='2-1'" :class="{'activity':nowIndex=='2-1'}">
          <img :src="list['2-1'].img_url" alt="" v-if="list['2-1'].img_url">
          <template v-else>1-1</template>
          <div class="activity-pop" v-if="nowIndex=='2-1'" @click="setOpenUpload">编辑</div>
        </div>
        <div class="list-2-2" @click="nowIndex='2-2'" @mouseenter="nowIndex='2-2'" :class="{'activity':nowIndex=='2-2'}">
          <img :src="list['2-2'].img_url" alt="" v-if="list['2-2'].img_url">
          <template v-else>2-2</template>
          <div class="activity-pop" v-if="nowIndex=='2-2'" @click="setOpenUpload">编辑</div>
        </div>
      </div>

      <div class="list-2">
        <div class="list-2-1" @click="nowIndex='3-1'" @mouseenter="nowIndex='3-1'" :class="{'activity':nowIndex=='3-1'}">
          <img :src="list['3-1'].img_url" alt="" v-if="list['3-1'].img_url">
          <template v-else>3-1</template>
          <div class="activity-pop" v-if="nowIndex=='3-1'" @click="setOpenUpload">编辑</div>
        </div>
        <div class="list-2-2" @click="nowIndex='3-2'" @mouseenter="nowIndex='3-2'" :class="{'activity':nowIndex=='3-2'}">
          <img :src="list['3-2'].img_url" alt="" v-if="list['3-2'].img_url">
          <template v-else>3-2</template>
          <div class="activity-pop" v-if="nowIndex=='3-2'" @click="setOpenUpload">编辑</div>
        </div>
      </div>

      <div class="list-4">
        <div class="list-4-1" @click="nowIndex='4-1'" @mouseenter="nowIndex='4-1'" :class="{'activity':nowIndex=='4-1'}">
          <img :src="list['4-1'].img_url" alt="" v-if="list['4-1'].img_url">
          <template v-else>4-1</template>
          <div class="activity-pop" v-if="nowIndex=='4-1'" @click="setOpenUpload">编辑</div>
        </div>
        <div class="list-4-2" @click="nowIndex='4-2'" @mouseenter="nowIndex='4-2'" :class="{'activity':nowIndex=='4-2'}">
          <img :src="list['4-2'].img_url" alt="" v-if="list['4-2'].img_url">
          <template v-else>4-2</template>
          <div class="activity-pop" v-if="nowIndex=='4-2'" @click="setOpenUpload">编辑</div>
        </div>
      </div>
    </div>

    <el-dialog title="编辑广告位" :visible.sync="openUpload" width="50%" append-to-body>
      <el-form :model="images" ref="formsss" label-width="120px">
        <el-form-item label="广告图片" :maxsize="300*1024" prop="img_url" :rules="{required: true, message: '广告图片不能为空', trigger: 'blur'}">
          <div>
            <el-button @click="uploadImage" type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
          </div>
          <img :src="images.img_url" alt="" v-if="images.img_url" style="width: 200px;margin-top: 10px;">
          <div style="color: #cccccc;font-size: 12px;width: 100%">300*200px，大小不能超过300K</div>
        </el-form-item>
        <el-form-item label="跳转链接" prop="img_link" :rules="{required: true, message: '跳转链接不能为空', trigger: 'blur'}">
          <el-input placeholder="跳转链接" @change="changeInput" v-model="images.img_link"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmImages">保存</el-button>
          <el-button @click="openUpload=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <input @change='add_img' type="file" ref="file" class="upload_img_temp" style="display: none">
  </div>
</template>
<script>
    import Upload from '../../library/Upload'

    export default {
        data () {
            return {
                nowIndex: '',
                openUpload: false,
                list: {
                    '1-1': {
                        grid_number: '1-1',
                        img_url: '',
                        img_link: ''
                    },
                    '2-1': {
                        grid_number: '2-1',
                        img_url: '',
                        img_link: ''
                    },
                    '2-2': {
                        grid_number: '2-2',
                        img_url: '',
                        img_link: ''
                    },
                    '3-1': {
                        grid_number: '3-1',
                        img_url: '',
                        img_link: ''
                    },
                    '3-2': {
                        grid_number: '3-2',
                        img_url: '',
                        img_link: ''
                    },
                    '4-1': {
                        grid_number: '4-1',
                        img_url: '',
                        img_link: ''
                    },
                    '4-2': {
                        grid_number: '4-2',
                        img_url: '',
                        img_link: ''
                    },
                },
                images: {
                    img_url: '',
                    img_link: ''
                }
            }
        },
        props: {
            goodsList: {
                default: {}
            }
        },
        created () {
            this.goodsList.forEach((item) => {
                item.grid_number && (this.list[item.grid_number] = item)
            })
        },
        methods: {
            uploadImage () {
                document.querySelector('.upload_img_temp').click()
            },
            async add_img (events) {
                let file = events.target.files[0]
                try {
                    let data = await Upload.beforeUpload(this, file)
                    this.images.img_url = data.imageOssUrl
                    document.querySelector('.upload_img_temp').value = ''
                } catch (e) {
                }
            },
            changeInput (index) {
                this.$emit('changTempList', this.list)
            },
            confirmImages () {
                this.$refs.formsss.validate(async (valid) => {
                    if (valid) {
                        this.list[this.nowIndex].img_url = this.images.img_url
                        this.list[this.nowIndex].img_link = this.images.img_link
                        this.$emit('changTempList', this.list)
                        this.openUpload = false
                    }
                })
            },
            setOpenUpload () {
                this.images.img_url = this.list[this.nowIndex].img_url
                this.images.img_link = this.list[this.nowIndex].img_link
                this.openUpload = true
            }
        },
        watch: {
            nowIndex (res) {
                // !this.list[res].img_url && this.setOpenUpload()
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
          > img {
            width: 100%;
            height: 100%;
          }

          display: flex;
          justify-content: center;
          align-items: center;
        }

        .activity {
          position: relative;

          .activity-pop {
            position: absolute;
            width: 100%;
            height: 50px;
            background: rgba(0, 0, 0, 0.6);
            left: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff!important;
          }
        }
      }

      .list-1 {
        width: calc(~"30% - 1px");
        height: 100%;
        border-right: 1px #cccccc solid;

        > div {
          width: 100%;
          height: 100%;
        }
      }

      .list-2 {
        width: calc(~"70% / 3 - 1px");
        height: 100%;
        border-right: 1px #cccccc solid;

        > div {
          &:first-child {
            border-bottom: 1px #cccccc solid;
          }

          width: 100%;
          height: 50%;
        }
      }

      .list-4 {
        width: calc(~"70% / 3 - 1px");
        height: 100%;
        border-right: 1px #cccccc solid;

        > div {
          &:first-child {
            border-bottom: 1px #cccccc solid;
          }

          width: 100%;
          height: 50%;
        }
      }
    }

    .update-info {
      margin-top: 30px;
    }
  }
</style>