
export type keyName = string

export type expireTimes = string | number | Date

export interface _CookieBase {
    expire?: expireTimes
    path?: string
    domain?: string
    secure?: string
    sameSite?: string
}
export interface CookieConfigOptions extends _CookieBase {
}

export interface SetCookieOptions extends _CookieBase {
}

export interface RemoveCookieOptions {
    path?: string
    domain?: string
}

export interface IsCookieAvailable {
    keyName: keyName
}
