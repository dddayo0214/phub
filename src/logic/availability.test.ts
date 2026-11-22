import { describe, expect, it } from 'vitest'
import { getAvailability } from './availability'
import type { DeviceInfo } from './device'
import { make } from './fixtures'

const androidPhone: DeviceInfo = { kind: 'mobile', isAndroid: true, isIOS: false }
const iphone: DeviceInfo = { kind: 'mobile', isAndroid: false, isIOS: true }
const desktop: DeviceInfo = { kind: 'desktop', isAndroid: false, isIOS: false }

describe('getAvailability：網站類專案', () => {
    it('both 在任何裝置都可用', () => {
        const p = make({ id: 'a', platform: 'both' })
        expect(getAvailability(p, androidPhone).status).toBe('ok')
        expect(getAvailability(p, iphone).status).toBe('ok')
        expect(getAvailability(p, desktop).status).toBe('ok')
    })

    it('mobile 專案在電腦上是「僅限手機」', () => {
        const p = make({ id: 'a', platform: 'mobile' })
        expect(getAvailability(p, desktop).status).toBe('mobile-only')
    })

    it('mobile 的網站專案在 Android 與 iPhone 都可用', () => {
        const p = make({ id: 'a', platform: 'mobile' })
        expect(getAvailability(p, androidPhone).status).toBe('ok')
        expect(getAvailability(p, iphone).status).toBe('ok')
    })

    it('desktop 專案在手機上是「建議用電腦」', () => {
        const p = make({ id: 'a', platform: 'desktop' })
        expect(getAvailability(p, androidPhone).status).toBe('desktop-recommended')
        expect(getAvailability(p, iphone).status).toBe('desktop-recommended')
    })

    it('desktop 專案在電腦上可用', () => {
        const p = make({ id: 'a', platform: 'desktop' })
        expect(getAvailability(p, desktop).status).toBe('ok')
    })
})

describe('getAvailability：Android 專案', () => {
    const apk = make({
        id: 'app',
        type: 'android',
        platform: 'mobile',
        url: undefined,
        apkUrl: 'https://example.com/a.apk',
    })

    it('在 Android 裝置可用', () => {
        expect(getAvailability(apk, androidPhone).status).toBe('ok')
    })

    it('在電腦上是「僅限手機」', () => {
        expect(getAvailability(apk, desktop).status).toBe('mobile-only')
    })

    it('在 iPhone 上無法安裝', () => {
        expect(getAvailability(apk, iphone).status).toBe('unsupported-os')
    })

    it('platform 填成 both 或 desktop，仍只看是不是 Android', () => {
        const both = { ...apk, platform: 'both' as const }
        const desk = { ...apk, platform: 'desktop' as const }
        expect(getAvailability(both, desktop).status).toBe('mobile-only')
        expect(getAvailability(desk, androidPhone).status).toBe('ok')
    })
})