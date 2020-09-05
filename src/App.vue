<template>
  <div id="app" :class="{'menu-collapse':isCollapse}">
    <template v-if="$route.name!=='login' && $route.name!=='findPwd'">
      <left-menu ref="leftMenu"></left-menu>

      <div class="body-right" :style="isCollapse ? 'width: calc(100% - 70px)' : 'width: calc(100% - 195px);'">

        <div class="body-top" id="body-top"
             :style="!isCollapse ? 'left:195px;width: calc(100% - 195px)' : 'left:70px;width: calc(100% - 70px)'">
          <div class="body-top-left" @click="setCollapse">
            <i :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'" class="set-menu"></i>
          </div>
          <div class="body-top-right" id="body-top-right-menu">
            <el-menu
              :default-active="activeIndex2"
              class="el-menu-demo el-menu-demo-app"
              mode="horizontal"
              @select="handleSelect"
              background-color="#ffffff"
              text-color="#545c64"
              style="max-width: 450px;min-width:400px;float: right">
              <el-submenu index="2">
                <template slot="title" style="max-width: 180px">
                  <el-icon class="el-icon-s-custom"></el-icon>
                  {{this.$common.getNowUserId(false)['user_name']}}
                </template>
                <el-menu-item index="2-1">
                  <el-icon class="el-icon-user-solid"></el-icon>
                  个人信息
                </el-menu-item>
                <el-menu-item index="2-3">
                  <el-icon class="el-icon-s-home"></el-icon>
                  返回首页
                </el-menu-item>
                <el-menu-item index="2-5">
                  <el-icon class="el-icon-s-open"></el-icon>
                  清理缓存
                </el-menu-item>
                <el-menu-item index="2-4"><i class="el-icon-switch-button" style="font-weight: bold"></i>退出登录
                </el-menu-item>
              </el-submenu>
              <el-menu-item index="1" @click="msg()">
                <el-icon class="el-icon-bell"></el-icon>
                消息中心
              </el-menu-item>
              <el-menu-item index="3" @click="goShoping()">
                <el-icon class="el-icon-goods"></el-icon>
                商城
              </el-menu-item>
            </el-menu>
            <div class="search-menu">
              <el-select :class="{'input-activity':activity}"
                         v-model="searchValue"
                         filterable
                         remote
                         reserve-keyword
                         placeholder="搜索菜单例如-入驻"
                         :remote-method="searchMenu">
                <el-option
                  v-for="item in searchOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.path">
                  <span style="float: left">{{ item.name }}</span>
                  <i :class="item.icon" class="set-menu"
                     style="float: right; color: #8492a6; font-size: 13px;margin-top: 10px"></i>
                </el-option>
              </el-select>
              <div class="button-div">
                <el-button :class="{'round-buts':activity}" icon="el-icon-search" type="primary" circle
                           @click="activity=!activity" size="small"></el-button>
              </div>
            </div>
          </div>
        </div>
        <tagList></tagList>
        <section class="app-main">
          <transition :name="transitionName" mode="out-in" v-if="!$route.meta.keepAlive">
            <router-view v-loading="loading" class="content-body child-view"/>
          </transition>
          <transition :name="transitionName" mode="out-in">
            <keep-alive>
              <router-view v-loading="loading" v-if="$route.meta.keepAlive" class="content-body child-view"/>
            </keep-alive>
          </transition>
        </section>
      </div>
    </template>
    <template v-else>
      <router-view v-loading="loading" class="content-body"/>
    </template>

  </div>
</template>

<script>

    import leftMenu from './components/leftMenu'
    import tagList from './components/TagList'

    export default {
        name: 'App',
        data () {
            return {
                isCollapse: false,
                activeIndex2: '2',
                transitionName: 'slide-right',
                loading: false,
                menuList: [],
                searchOption: [],
                searchValue: '',
                activity: false,
                nowMenu: [
                    // '/advert/floorAd'
                ]
            }
        },
        created () {
            let is_apk = sessionStorage.getItem('is_apk')
            is_apk && (this.isCollapse = true)
        },
        watch: {
            searchValue (res) {
                if (res) {
                    this.$router.push({name: res})
                    this.searchValue = ''
                    this.searchOption = []
                    this.activity = false
                }
            }
        },
        methods: {
            searchMenu (option) {
                if (!option) {
                    this.searchOption = []
                    return false
                }
                let menuList = sessionStorage.getItem('MENU_LIST')
                let result = []
                if (menuList) {
                    menuList = JSON.parse(menuList)
                    menuList.forEach((res) => {
                        res.group[0].list.forEach((list) => {
                            list.name.indexOf(option) >= 0 && result.push(list)
                        })
                    })
                }
                this.searchOption = result
            },
            goShoping () {
                window.open(CUSTOM_CONFIG.PPY_HOST)
            },
            setCollapse () {
                this.isCollapse = !this.isCollapse
                this.$refs.leftMenu.setCollapse(this.isCollapse)
            },
            async handleSelect (key, keyPath) {
                if (key === '2-1') {
                    this.$router.push({name: '/member/member', query: {nav_mean: '2-1'}})
                }
                if (key === '2-3') {
                    this.$router.push({path: '/'})
                }
                if (key === '2-4') {
                    sessionStorage.clear()
                    this.$router.push({path: '/login'})
                }
                if (key === '2-5') {
                    this.loading = true
                    await this.$common.wait(2000)
                    this.loading = false
                    SendMessage({message: '缓存已清理', type: 'success'})
                }
            },
            msg () {
                SendMessage({message: '功能开发中 ..', type: 'warning'})
            }
        },
        components: {
            leftMenu,
            tagList
        }
    }
</script>

<style lang="less">
  @import "assets/main";
  @import "assets/appStyle";


</style>
