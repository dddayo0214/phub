export type DeviceKind = 'mobile' | 'desktop'

export interface DeviceInfo {
    kind: DeviceKind
    isAndroid: boolean
    isIOS: boolean
}

export interface NavigatorLike {
    userAgent: string
    maxTouchPoints?: number
}

export function detectDevice(nav: NavigatorLike): DeviceInfo {
    const ua = nav.userAgent
    const isAndroid = /Android/i.test(ua)
    // iPadOS 的 Safari 預設會偽裝成 Mac，只能靠觸控點數分辨
    const isIPadOS = /Macintosh/i.test(ua) && (nav.maxTouchPoints ?? 0) > 1
    const isIOS = /iPhone|iPod|iPad/i.test(ua) || isIPadOS
    const isOtherMobile = /Mobile|Windows Phone|webOS|BlackBerry/i.test(ua)

    const kind: DeviceKind =
        isAndroid || isIOS || isOtherMobile ? 'mobile' : 'desktop'

    return { kind, isAndroid, isIOS }
}