declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

// 扩充
import {API} from './config/API';
import request from './library/request';
import {Message} from 'element-ui'
import common from './library/common';

declare module 'vue/types/vue' {
    interface Vue {
        $API: API,
        $request: request,
        $common: common
    }
}
declare global {
    var SendMessage: Message
}