import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import common from './library/common'
import { Message } from 'element-ui'

window.SendMessage = Message
router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
})

router.afterEach(async () => {
    let rand = Math.random()
    NProgress.set(rand)

    await common.wait(500)
    NProgress.done()
})