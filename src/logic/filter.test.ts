import { describe, expect, it } from 'vitest'
import { emptyFilter, filterProjects } from './filter'
import { sample } from './fixtures'

const ids = (list: { id: string }[]) => list.map((p) => p.id)

describe('filterProjects', () => {
    it('沒有條件時回傳全部，且是新陣列', () => {
        const result = filterProjects(sample, emptyFilter)
        expect(result).toEqual(sample)
        expect(result).not.toBe(sample)
    })

    it('單一標籤', () => {
        const result = filterProjects(sample, { query: '', tags: ['工具'] })
        expect(ids(result)).toEqual(['todo', 'notes'])
    })

    it('多個標籤必須同時符合', () => {
        const result = filterProjects(sample, { query: '', tags: ['react', '工具'] })
        expect(ids(result)).toEqual(['todo'])
    })

    it('標籤與搜尋可同時使用', () => {
        const result = filterProjects(sample, { query: 'android', tags: ['工具'] })
        expect(ids(result)).toEqual(['notes'])
    })

    it('不存在的標籤回傳空陣列', () => {
        const result = filterProjects(sample, { query: '', tags: ['不存在'] })
        expect(result).toEqual([])
    })

    it('不改動輸入的陣列', () => {
        const copy = [...sample]
        filterProjects(sample, { query: 'react', tags: ['工具'] })
        expect(sample).toEqual(copy)
    })
})