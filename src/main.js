import Vue from 'vue';
import App from './App';
import router from './router';
import custom_config from '@/../custom_config.js';
import { API } from './config/API';
import request from './library/request';
import common from './library/common';
import './permission';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/index';
var apk = common.query('apk');
apk && sessionStorage.setItem('is_apk', apk);
window.CUSTOM_CONFIG = custom_config[process.env.BRANCH] ? custom_config[process.env.BRANCH] : {};
Vue.use(ElementUI);
Vue.prototype.$vuexStore = store;
Vue.prototype.$API = API;
Vue.prototype.$common = common;
Vue.prototype.$request = request;
Vue.config.productionTip = false;
new Vue({
    el: '#app',
    router: router,
    store: store,
    components: { App: App },
    template: '<App/>'
});
//# sourceMappingURL=main.js.map