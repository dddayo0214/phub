import { describe, expect, it } from 'vitest'
import { make } from './fixtures'
import { getOpenAction } from './open'

const ORIGIN = 'https://app.test'

describe('getOpenAction', () => {
    it('網站預設用 iframe', () => {
        const p = make({ id: 'a', url: 'https://example.com/' })
        expect(getOpenAction(p, ORIGIN)).toEqual({
            kind: 'iframe',
            url: 'https://example.com/',
        })
    })

    it('openMode 為 newtab 時開新分頁', () => {
        const p = make({ id: 'a', openMode: 'newtab' })
        expect(getOpenAction(p, ORIGIN).kind).toBe('newtab')
    })

    it('React 專案可以明確指定 iframe', () => {
        const p = make({ id: 'a', type: 'react', openMode: 'iframe' })
        expect(getOpenAction(p, ORIGIN).kind).toBe('iframe')
    })

    it('與 phub 同源的網址強制開新分頁', () => {
        const p = make({ id: 'a', url: 'https://app.test/other/' })
        expect(getOpenAction(p, ORIGIN).kind).toBe('newtab')
    })

    it('Android 專案回傳 download', () => {
        const p = make({
            id: 'a',
            type: 'android',
            url: undefined,
            apkUrl: 'https://example.com/a.apk',
        })
        expect(getOpenAction(p, ORIGIN)).toEqual({
            kind: 'download',
            url: 'https://example.com/a.apk',
        })
    })

    it('Android 專案沒有 apkUrl 時無法開啟', () => {
        const p = make({ id: 'a', type: 'android', url: undefined })
        expect(getOpenAction(p, ORIGIN).kind).toBe('unavailable')
    })

    it('沒有網址時無法開啟', () => {
        const p = make({ id: 'a', url: undefined })
        expect(getOpenAction(p, ORIGIN).kind).toBe('unavailable')
    })

    it('other 類型預設開新分頁', () => {
        const p = make({ id: 'a', type: 'other' })
        expect(getOpenAction(p, ORIGIN).kind).toBe('newtab')
    })

    it('other 類型明確指定 iframe 時才內嵌', () => {
        const p = make({ id: 'a', type: 'other', openMode: 'iframe' })
        expect(getOpenAction(p, ORIGIN).kind).toBe('iframe')
    })

    it('http 網址無法開啟', () => {
        const p = make({ id: 'a', url: 'http://example.com' })
        expect(getOpenAction(p, ORIGIN).kind).toBe('unavailable')
    })

    it('無效的網址無法開啟', () => {
        const p = make({ id: 'a', url: 'not a url' })
        expect(getOpenAction(p, ORIGIN).kind).toBe('unavailable')
    })
})