import { describe, expect, it } from 'vitest'
import { make, sample } from './fixtures'
import { countTags, isTagSelected, toggleTag } from './tags'

describe('countTags', () => {
    it('忽略大小寫合併並累計數量', () => {
        const result = countTags(sample)
        expect(result.find((t) => t.tag === 'React')?.count).toBe(2)
        expect(result.find((t) => t.tag === '工具')?.count).toBe(2)
        expect(result.find((t) => t.tag === 'react')).toBeUndefined()
    })

    it('同一專案內重複的標籤只算一次', () => {
        const result = countTags([make({ id: 'a', tags: ['x', 'X', 'x'] })])
        expect(result).toEqual([{ tag: 'x', count: 1 }])
    })

    it('依數量由多到少排序，相同時依名稱', () => {
        const result = countTags([
            make({ id: 'p1', tags: ['b', 'a'] }),
            make({ id: 'p2', tags: ['b'] }),
            make({ id: 'p3', tags: ['c'] }),
        ])
        expect(result.map((t) => t.tag)).toEqual(['b', 'a', 'c'])
    })

    it('忽略空白標籤', () => {
        expect(countTags([make({ id: 'a', tags: ['', '  '] })])).toEqual([])
    })

    it('沒有專案時回傳空陣列', () => {
        expect(countTags([])).toEqual([])
    })
})

describe('toggleTag', () => {
    it('尚未選取時加入', () => {
        expect(toggleTag(['a'], 'b')).toEqual(['a', 'b'])
    })

    it('已選取時移除，忽略大小寫', () => {
        expect(toggleTag(['React'], 'react')).toEqual([])
    })

    it('不改動原陣列', () => {
        const selected = ['a']
        toggleTag(selected, 'b')
        expect(selected).toEqual(['a'])
    })

    it('isTagSelected 忽略大小寫', () => {
        expect(isTagSelected(['React'], 'REACT')).toBe(true)
        expect(isTagSelected(['React'], 'vue')).toBe(false)
    })
})