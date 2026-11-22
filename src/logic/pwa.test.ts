import { describe, expect, it } from 'vitest'
import { getInstallUi, getPwaBanner } from './pwa'
import type { InstallInput } from './pwa'

const base: InstallInput = {
    isStandalone: false,
    hasPrompt: false,
    isIOS: false,
    installedThisSession: false,
}

describe('getInstallUi', () => {
    it('瀏覽器提供安裝提示時顯示安裝按鈕', () => {
        expect(getInstallUi({ ...base, hasPrompt: true })).toBe('button')
    })

    it('已經是安裝後的 App 就不顯示，即使有提示', () => {
        expect(getInstallUi({ ...base, isStandalone: true, hasPrompt: true })).toBe(
            'hidden',
        )
    })

    it('這次剛安裝完成就隱藏', () => {
        expect(
            getInstallUi({ ...base, installedThisSession: true, hasPrompt: true }),
        ).toBe('hidden')
    })

    it('iOS 沒有提示事件，顯示手動安裝說明', () => {
        expect(getInstallUi({ ...base, isIOS: true })).toBe('ios-guide')
    })

    it('iOS 已安裝後不再顯示說明', () => {
        expect(getInstallUi({ ...base, isIOS: true, isStandalone: true })).toBe(
            'hidden',
        )
    })

    it('其他瀏覽器沒有提示事件時不顯示任何東西', () => {
        expect(getInstallUi(base)).toBe('hidden')
    })
})

describe('getPwaBanner', () => {
    it('有新版本', () => {
        expect(getPwaBanner({ needRefresh: true, offlineReady: false })).toBe(
            'update',
        )
    })

    it('可離線使用', () => {
        expect(getPwaBanner({ needRefresh: false, offlineReady: true })).toBe(
            'offline-ready',
        )
    })

    it('兩者同時為真時，更新優先', () => {
        expect(getPwaBanner({ needRefresh: true, offlineReady: true })).toBe(
            'update',
        )
    })

    it('都沒有時不顯示', () => {
        expect(getPwaBanner({ needRefresh: false, offlineReady: false })).toBe(
            'none',
        )
    })
})