import { describe, expect, it } from 'vitest'
import { portfolio, todo } from './fixtures'
import { matchesQuery } from './search'

describe('matchesQuery', () => {
    it('空查詢符合所有專案', () => {
        expect(matchesQuery(todo, '')).toBe(true)
    })

    it('只有空白也視為空查詢', () => {
        expect(matchesQuery(todo, '   ')).toBe(true)
    })

    it('比對名稱', () => {
        expect(matchesQuery(todo, '待辦')).toBe(true)
    })

    it('不分大小寫', () => {
        expect(matchesQuery(portfolio, 'PORTFOLIO')).toBe(true)
    })

    it('比對描述', () => {
        expect(matchesQuery(portfolio, 'site')).toBe(true)
    })

    it('比對標籤', () => {
        expect(matchesQuery(portfolio, '網站')).toBe(true)
    })

    it('多個關鍵字必須同時符合', () => {
        expect(matchesQuery(todo, 'react 工具')).toBe(true)
        expect(matchesQuery(portfolio, 'react 工具')).toBe(false)
    })

    it('全形字元視為半形', () => {
        expect(matchesQuery(todo, 'ＲＥＡＣＴ')).toBe(true)
    })

    it('沒有符合時回傳 false', () => {
        expect(matchesQuery(todo, 'xyz')).toBe(false)
    })
})