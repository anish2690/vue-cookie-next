import { inject } from 'vue'
import type { IVueCookieNext } from './VueCookieNext'

export function useCookie(): IVueCookieNext {
  return inject<IVueCookieNext>('cookie')!
}
