import { describe, expect, it } from 'vitest'
import { buildProjectHash, parseHash } from './route'

describe('parseHash', () => {
    it('空字串是首頁', () => {
        expect(parseHash('')).toEqual({ name: 'home' })
    })

    it('# 與 #/ 都是首頁', () => {
        expect(parseHash('#')).toEqual({ name: 'home' })
        expect(parseHash('#/')).toEqual({ name: 'home' })
    })

    it('解析專案頁', () => {
        expect(parseHash('#/project/my-app')).toEqual({
            name: 'project',
            id: 'my-app',
        })
    })

    it('結尾斜線不影響結果', () => {
        expect(parseHash('#/project/my-app/')).toEqual({
            name: 'project',
            id: 'my-app',
        })
    })

    it('沒有 id 是找不到', () => {
        expect(parseHash('#/project/')).toEqual({ name: 'notfound' })
    })

    it('多餘的層級是找不到', () => {
        expect(parseHash('#/project/a/b')).toEqual({ name: 'notfound' })
    })

    it('未知路徑是找不到', () => {
        expect(parseHash('#/foo')).toEqual({ name: 'notfound' })
    })

    it('會解碼 id', () => {
        expect(parseHash('#/project/my%2Dapp')).toEqual({
            name: 'project',
            id: 'my-app',
        })
    })

    it('錯誤的編碼是找不到，不會拋出例外', () => {
        expect(parseHash('#/project/%E0%A4%A')).toEqual({ name: 'notfound' })
    })

    it('忽略 ? 之後的內容', () => {
        expect(parseHash('#/project/my-app?x=1')).toEqual({
            name: 'project',
            id: 'my-app',
        })
    })
})

describe('buildProjectHash', () => {
    it('產生專案網址', () => {
        expect(buildProjectHash('my-app')).toBe('#/project/my-app')
    })

    it('與 parseHash 互為反運算', () => {
        expect(parseHash(buildProjectHash('todo-react'))).toEqual({
            name: 'project',
            id: 'todo-react',
        })
    })
})