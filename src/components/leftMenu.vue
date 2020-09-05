<template>
  <div class="body-menu" :style="'width:'+width">
    <div class="menu-top-set" @click="$router.push({path: '/'})">
      <img src="https://sfcntest2.ecoprint.tech/admin/images/admin-logo.png">
    </div>
    <el-menu :default-active="nowMenu[1]?nowMenu[1]:nowMenu[0]" class="el-menu-vertical-demo" router
             background-color="rgb(50, 61, 80)"
             :text-color="'#ffffff'"
             :collapse="isCollapse" @open="handleOpen" @close="handleClose" @select="handleSelect"
             :class="!isCollapse ? 'isCollapse' : 'notCollapse'">
      <el-submenu v-for="(menu,index) in menuList" :key="index" :index="menu.path">
        <template slot="title">
          <el-icon :class="menu.icon"></el-icon>
          <span slot="title">{{menu.name}}
          </span>
          <span v-if="menu.path=='/purchase/list' && purchase>0" class="data-icon"></span>
        </template>
        <template v-if="menu.group && menu.group.length">
          <menu-item-group v-for="(group_item,g_index) in menu.group" :key="g_index">
            <span slot="title" v-if="group_item.name">{{group_item.name}}</span>
            <menu-item :route="group.path" :index="group.path" v-for="(group,key) in group_item.list" :key="key"
                       @click="saveMenuTextToLocal(group)">
              <template>
                <el-icon :class="group.icon"></el-icon>
                <span slot="title" :data-link="group.path">{{group.name}} {{group.path=='/purchase/list' && purchase>0 ? '('+purchase+')' : ''}}</span>
              </template>
            </menu-item>
          </menu-item-group>
        </template>
      </el-submenu>
    </el-menu>
    <div class="ban-quan" v-if="!isCollapse">妙印云版权所有</div>
  </div>
</template>
<script>
    import { Menu, Submenu, Icon, MenuItem, MenuItemGroup, Breadcrumb, BreadcrumbItem } from 'element-ui'

    let textArr = []
    export default {
        data () {
            return {
                isCollapse: false,
                menuList: [],
                width: '195px',
                nowMenu: [
                    // '/advert/floorAd'
                ]
            }
        },
        created () {
            this.purchaseCount()
            let is_apk = sessionStorage.getItem('is_apk')
            is_apk && this.setCollapse(true)
            this.verificationAuth()
        },
        methods: {
            //验证权限
            verificationAuth () {
                //TODO 请求接口
                let menu = sessionStorage.getItem('MENU_LIST')
                menu = JSON.parse(menu)
                this.menuList = menu
            },

            async purchaseCount () {
                let data = await this.$request.get(this.$API.common_api, {
                    status: 5,
                    purchaseType: -1,
                    pageSize: 1
                }, 'main', {
                    router_path: 'purchase/list',
                    request_host: 'PURCHASE_CATEGORY_HOST',
                    handle_desc: '采购列表;'
                })
                data.total > 0 && (this.$vuexStore.commit('changeMenu', {field: 'purchase', value: data.total}))
            },

            setCollapse (state) {
                this.width = !state ? '195px' : '70px'
                this.isCollapse = state
            },

            handleOpen (key, keyPath) {
            },
            handleSelect (key, keyPath) {
                this.nowMenu = keyPath
            },
            handleClose (key, keyPath) {
            },
            saveMenuTextToLocal (event) {
                this.$vuexStore.commit('changeTagList', {
                    text: event.name,
                    link: event.path
                })
            }
        },
        components: {
            ElMenu: Menu, ElSubmenu: Submenu, ElIcon: Icon, MenuItem, MenuItemGroup, Breadcrumb, BreadcrumbItem,
        },
        watch: {
            $route (res) {
                this.$set(this.nowMenu, 0, this.$route.path)
            }
        },
        computed: {
            purchase () {
                return this.$vuexStore.state.menuData.purchase
            }
        }
    }
</script>

<style lang="less" scoped>
  .ban-quan {
    font-size: 12px;
    text-align: center;
    margin-top: 10px;
    color: #999999;
  }

  .data-icon {
    width: 7px;
    height: 7px;
    display: inline-block;
    background: #da0606;
    border-radius: 10px;
  }
</style>
