
import { IVueCookieNext } from './VueCookieNext'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $cookie: IVueCookieNext
  }
}
