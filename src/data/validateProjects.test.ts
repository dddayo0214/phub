import { describe, expect, it } from 'vitest'
import { validateProjects } from './validateProjects'

const valid = {
    id: 'my-site',
    name: '我的網站',
    description: '測試',
    type: 'website',
    platform: 'both',
    status: 'active',
    tags: ['網站'],
    url: 'https://example.com',
}

describe('validateProjects', () => {
    it('接受正確的資料', () => {
        const r = validateProjects([valid])
        expect(r.projects).toHaveLength(1)
        expect(r.errors).toHaveLength(0)
    })

    it('最外層不是陣列時回報錯誤', () => {
        const r = validateProjects({})
        expect(r.projects).toHaveLength(0)
        expect(r.errors).toHaveLength(1)
    })

    it('壞掉的一筆被略過，其他筆保留', () => {
        const r = validateProjects([valid, { ...valid, id: 'bad', name: '' }])
        expect(r.projects).toHaveLength(1)
        expect(r.errors).toHaveLength(1)
    })

    it('重複的 id 只保留第一筆', () => {
        const r = validateProjects([valid, { ...valid, name: '另一個' }])
        expect(r.projects).toHaveLength(1)
        expect(r.errors).toHaveLength(1)
    })

    it('Android 專案沒有 apkUrl 會被拒絕', () => {
        const r = validateProjects([
            { ...valid, id: 'app', type: 'android', url: undefined },
        ])
        expect(r.projects).toHaveLength(0)
    })

    it('拒絕 http 開頭的網址', () => {
        const r = validateProjects([{ ...valid, url: 'http://example.com' }])
        expect(r.projects).toHaveLength(0)
    })

    it('拒絕格式錯誤的 sha256', () => {
        const r = validateProjects([{ ...valid, sha256: 'abc' }])
        expect(r.projects).toHaveLength(0)
    })
})