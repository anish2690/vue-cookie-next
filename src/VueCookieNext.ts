import { App } from 'vue'
import {
  CookieConfigOptions,
  SetCookieOptions,
  keyName,
  RemoveCookieOptions,
} from './@types/index'
export interface IVueCookieNext {
  /**
   * Set global config
   */
  config(options: CookieConfigOptions): void

  /**
   * Set a cookie
   */
  setCookie(keyName: keyName, value: string, options?: SetCookieOptions): this

  /**
   * Get a cookie
   */
  getCookie(keyName: keyName): any

  /**
   * Remove a cookie
   */
  removeCookie(keyName: keyName, options?: RemoveCookieOptions): this | boolean

  /**
   * Exist a cookie name
   */
  isCookieAvailable(keyName: keyName): boolean

  /**
   * Get All cookie name
   */
  keys(): string[]

  install(app: App): void
}

const defaultConfig: CookieConfigOptions = {
  expire: '1d',
  path: '; path=/',
  domain: '',
  secure: '',
  sameSite: '; SameSite=Lax',
}

export const VueCookieNext: IVueCookieNext = {
  install: function (app: App) {
    app.config.globalProperties.$cookie = this
    app.provide('cookie', this)
  },
  config: function (options: CookieConfigOptions) {
    const { expire, path, domain, secure, sameSite } = options
    defaultConfig.expire = expire ? expire : '1d'
    defaultConfig.path = path ? '; path=' + path : '; path=/'
    defaultConfig.domain = domain ? '; domain=' + domain : ''
    defaultConfig.secure = secure ? '; Secure' : ''
    defaultConfig.sameSite = sameSite
      ? '; SameSite=' + sameSite
      : '; SameSite=Lax'
  },
  getCookie: function (keyName: string) {
    var value =
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            '(?:(?:^|.*;)\\s*' +
            encodeURIComponent(keyName).replace(/[\-\.\+\*]/g, '\\$&') +
            '\\s*\\=\\s*([^;]*).*$)|^.*$'
          ),
          '$1'
        )
      ) || null

    if (
      value &&
      value.substring(0, 1) === '{' &&
      value.substring(value.length - 1, value.length) === '}'
    ) {
      try {
        value = JSON.parse(value)
      } catch (e) {
        return value
      }
    }
    return value
  },
  setCookie: function (
    keyName: keyName,
    value: string,
    options?: SetCookieOptions
  ) {
    let { expire: expireTimes, path, domain, secure, sameSite } = options || {}
    if (!keyName) {
      throw new Error('Cookie name is not find in first argument.')
    } else if (
      /^(?:expires|max\-age|path|domain|secure|SameSite)$/i.test(keyName)
    ) {
      throw new Error(
        'Cookie key name illegality, Cannot be set to ["expires","max-age","path","domain","secure","SameSite"]\t current key name: ' +
        keyName
      )
    }
    // support json object
    if (value && value.constructor === Object) {
      value = JSON.stringify(value)
    }
    var _expires = ''
    expireTimes = expireTimes === undefined ? defaultConfig.expire : expireTimes
    if (expireTimes && expireTimes != 0) {
      switch (expireTimes.constructor) {
        case Number:
          if (expireTimes === Infinity || expireTimes === -1)
            _expires = '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
          else _expires = '; max-age=' + expireTimes
          break
        case String:
          let exp = expireTimes.toString()
          if (/^(?:\d+(y|m|d|h|min|s))$/i.test(exp)) {
            // get capture number group
            var _expireTime = exp.replace(/^(\d+)(?:y|m|d|h|min|s)$/i, '$1')
            // get capture type group , to lower case
            switch (
            exp.replace(/^(?:\d+)(y|m|d|h|min|s)$/i, '$1').toLowerCase()
            ) {
              // Frequency sorting
              case 'm':
                _expires = '; max-age=' + +_expireTime * 2592000
                break // 60 * 60 * 24 * 30
              case 'd':
                _expires = '; max-age=' + +_expireTime * 86400
                break // 60 * 60 * 24
              case 'h':
                _expires = '; max-age=' + +_expireTime * 3600
                break // 60 * 60
              case 'min':
                _expires = '; max-age=' + +_expireTime * 60
                break // 60
              case 's':
                _expires = '; max-age=' + _expireTime
                break
              case 'y':
                _expires = '; max-age=' + +_expireTime * 31104000
                break // 60 * 60 * 24 * 30 * 12
              default:
                new Error('unknown exception of "set operation"')
            }
          } else {
            _expires = '; expires=' + expireTimes
          }
          break
        case Date:
          // @ts-ignore
          _expires = '; expires=' + expireTimes.toUTCString()
          break
      }
    }
    document.cookie =
      encodeURIComponent(keyName) +
      '=' +
      encodeURIComponent(value) +
      _expires +
      (domain ? '; domain=' + domain : defaultConfig.domain) +
      (path ? '; path=' + path : defaultConfig.path) +
      (secure === undefined ? defaultConfig.secure : secure ? '; Secure' : '') +
      (sameSite === undefined
        ? defaultConfig.sameSite
        : sameSite
          ? '; SameSite=' + sameSite
          : '')
    return this
  },
  removeCookie: function (keyName: keyName, options?: RemoveCookieOptions) {
    const { path, domain } = options || {}
    if (!keyName || !this.isCookieAvailable(keyName)) {
      return false
    }
    document.cookie =
      encodeURIComponent(keyName) +
      '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
      (domain ? '; domain=' + domain : defaultConfig.domain) +
      (path ? '; path=' + path : defaultConfig.path) +
      '; SameSite=Lax'
    return this
  },
  isCookieAvailable: function (keyName: keyName) {
    return new RegExp(
      '(?:^|;\\s*)' +
      encodeURIComponent(keyName).replace(/[\-\.\+\*]/g, '\\$&') +
      '\\s*\\='
    ).test(document.cookie)
  },
  keys: function () {
    if (!document.cookie) return []
    var _keys = document.cookie
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
      .split(/\s*(?:\=[^;]*)?;\s*/)
    for (var _index = 0; _index < _keys.length; _index++) {
      _keys[_index] = decodeURIComponent(_keys[_index])
    }
    return _keys
  },
}
