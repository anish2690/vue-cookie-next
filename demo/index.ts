import { createApp } from 'vue'
import App from './App.vue'
import { VueCookieNext } from '/@'
console.log(VueCookieNext)
const app = createApp(App)
app.use(VueCookieNext)
//  global cookies
VueCookieNext.config({ expire: '7d' })
VueCookieNext.setCookie('theme', 'dark-mode')
VueCookieNext.setCookie('hover-time', { expire: '1s' })
window.vm = app.mount('#app')
