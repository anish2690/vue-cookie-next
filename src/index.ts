import type { IVueCookieNext } from './VueCookieNext'
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $cookie: IVueCookieNext
    }
}

export { VueCookieNext } from './VueCookieNext'