import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadProjects } from './loadProjects'

const valid = {
    id: 'my-site',
    name: '我的網站',
    description: '',
    type: 'website',
    platform: 'both',
    status: 'active',
    tags: [],
    url: 'https://example.com',
}

function stubFetch(response: Partial<Response> & { json?: () => unknown }) {
    const fn = vi.fn().mockResolvedValue(response)
    vi.stubGlobal('fetch', fn)
    return fn
}

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('loadProjects', () => {
    it('請求 projects.json 時指定 no-cache', async () => {
        const fn = stubFetch({ ok: true, json: async () => [valid] })
        await loadProjects()
        expect(fn).toHaveBeenCalledTimes(1)
        const [url, init] = fn.mock.calls[0] as [string, RequestInit]
        expect(url.endsWith('projects.json')).toBe(true)
        expect(init.cache).toBe('no-cache')
    })

    it('回傳通過驗證的專案', async () => {
        stubFetch({ ok: true, json: async () => [valid] })
        const r = await loadProjects()
        expect(r.projects).toHaveLength(1)
        expect(r.errors).toHaveLength(0)
    })

    it('壞掉的資料仍交給驗證處理，不拋出例外', async () => {
        stubFetch({ ok: true, json: async () => [valid, { ...valid, id: 'Bad' }] })
        const r = await loadProjects()
        expect(r.projects).toHaveLength(1)
        expect(r.errors).toHaveLength(1)
    })

    it('HTTP 錯誤時拋出含狀態碼的例外', async () => {
        stubFetch({ ok: false, status: 404 })
        await expect(loadProjects()).rejects.toThrow('404')
    })

    it('回應不是合法 JSON 時拋出例外', async () => {
        stubFetch({
            ok: true,
            json: async () => {
                throw new SyntaxError('Unexpected token')
            },
        })
        await expect(loadProjects()).rejects.toThrow()
    })
})