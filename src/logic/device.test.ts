import { describe, expect, it } from 'vitest'
import { detectDevice } from './device'

const ANDROID_PHONE =
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'
const ANDROID_TABLET =
    'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
const IPHONE =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
const IPAD_OLD =
    'Mozilla/5.0 (iPad; CPU OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
const MAC =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'
const WINDOWS =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
const LINUX =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

describe('detectDevice', () => {
    it('Android 手機', () => {
        expect(detectDevice({ userAgent: ANDROID_PHONE })).toEqual({
            kind: 'mobile',
            isAndroid: true,
            isIOS: false,
        })
    })

    it('Android 平板（UA 沒有 Mobile）也算手機端並可安裝 APK', () => {
        expect(detectDevice({ userAgent: ANDROID_TABLET })).toEqual({
            kind: 'mobile',
            isAndroid: true,
            isIOS: false,
        })
    })

    it('iPhone', () => {
        expect(detectDevice({ userAgent: IPHONE })).toEqual({
            kind: 'mobile',
            isAndroid: false,
            isIOS: true,
        })
    })

    it('舊版 iPad', () => {
        expect(detectDevice({ userAgent: IPAD_OLD }).isIOS).toBe(true)
    })

    it('iPadOS 偽裝成 Mac，靠觸控點數辨識', () => {
        const d = detectDevice({ userAgent: MAC, maxTouchPoints: 5 })
        expect(d).toEqual({ kind: 'mobile', isAndroid: false, isIOS: true })
    })

    it('真的 Mac 沒有觸控點', () => {
        expect(detectDevice({ userAgent: MAC, maxTouchPoints: 0 }).kind).toBe(
            'desktop',
        )
    })

    it('Mac 沒提供 maxTouchPoints 時視為電腦', () => {
        expect(detectDevice({ userAgent: MAC }).kind).toBe('desktop')
    })

    it('Windows 電腦，即使有觸控螢幕', () => {
        expect(detectDevice({ userAgent: WINDOWS, maxTouchPoints: 10 })).toEqual({
            kind: 'desktop',
            isAndroid: false,
            isIOS: false,
        })
    })

    it('Linux 電腦', () => {
        expect(detectDevice({ userAgent: LINUX }).kind).toBe('desktop')
    })

    it('空的 User Agent 視為電腦，不拋出例外', () => {
        expect(detectDevice({ userAgent: '' }).kind).toBe('desktop')
    })
})