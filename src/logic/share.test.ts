import { describe, expect, it } from 'vitest'
import { buildShareUrl, isLocalHost } from './share'

describe('buildShareUrl', () => {
    it('GitHub Pages 的子路徑', () => {
        expect(buildShareUrl('https://me.github.io/phub/', 'todo')).toBe(
            'https://me.github.io/phub/#/project/todo',
        )
    })

    it('去掉 index.html', () => {
        expect(buildShareUrl('https://me.github.io/phub/index.html', 'todo')).toBe(
            'https://me.github.io/phub/#/project/todo',
        )
    })

    it('網域根目錄', () => {
        expect(buildShareUrl('http://localhost:5173/', 'a')).toBe(
            'http://localhost:5173/#/project/a',
        )
    })

    it('取代原本的 hash 與查詢字串', () => {
        expect(
            buildShareUrl('https://x.test/phub/?utm=1#/project/old', 'new'),
        ).toBe('https://x.test/phub/#/project/new')
    })

    it('無效的網址回傳 null', () => {
        expect(buildShareUrl('not a url', 'a')).toBeNull()
    })
})

describe('isLocalHost', () => {
    it('localhost 與回送位址', () => {
        expect(isLocalHost('http://localhost:5173/')).toBe(true)
        expect(isLocalHost('http://127.0.0.1:5173/')).toBe(true)
        expect(isLocalHost('http://[::1]:5173/')).toBe(true)
    })

    it('區網位址與一般網域不是', () => {
        expect(isLocalHost('http://192.168.1.5:5173/')).toBe(false)
        expect(isLocalHost('https://me.github.io/phub/')).toBe(false)
    })

    it('無效網址回傳 false', () => {
        expect(isLocalHost('nope')).toBe(false)
    })
})