<template>
  <div class="tag-top-list" v-if="tagList">
    <el-tag :type="index==nowTagIndex ? 'primary' : 'info'" v-for="(item,index) in tagList"
            @click="router_tab(item.link,index)" closable class="tab-list-item"
            @close="removeTab(item)" size="medium" :key="index">{{item.text}}
    </el-tag>
  </div>
</template>
<script>

    export default {
        data () {
            return {}
        },
        created () {
        },
        methods: {
            //验证权限
            router_tab (path, index) {
                this.$vuexStore.commit('setNowTagIndex', index)
                this.$router.push({
                    path: path
                })

            },
            removeTab (item) {
                item.text!=='首页' && this.$vuexStore.commit('removeTagItem', item)
            }
        },
        computed: {
            nowTagIndex () {
                return this.$vuexStore.state.nowTagIndex
            },
            tagList () {
                return this.$vuexStore.state.tagListData
            }
        }
    }
</script>

<style lang="less" scoped>
  @import "../assets/variable";

  .tag-top-list {
    width: calc(~"100% - 30px");
    height: 50px;
    margin-top: @MenuTopHeight;
    padding: 0 15px;
    line-height: @MenuTopHeight;
    overflow: hidden;

    .tab-list-item {
      &:first-child {
        margin-left: 0;
      }

      margin-left: 5px;
    }
  }
</style>
