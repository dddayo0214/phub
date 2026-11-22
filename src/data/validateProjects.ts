import type { Project } from '../types/project'

const TYPES = ['website', 'react', 'android', 'other']
const PLATFORMS = ['mobile', 'desktop', 'both']
const STATUSES = ['active', 'done', 'paused']
const OPEN_MODES = ['iframe', 'newtab']

export interface ValidationResult {
    projects: Project[]
    errors: string[]
}

function isHttps(value: unknown): value is string {
    if (typeof value !== 'string') return false
    try {
        return new URL(value).protocol === 'https:'
    } catch {
        return false
    }
}

function validateOne(
    item: unknown,
    index: number,
): { project?: Project; errors: string[] } {
    if (typeof item !== 'object' || item === null) {
        return { errors: [`#${index}: 不是有效的物件`] }
    }

    const o = item as Record<string, unknown>
    const errors: string[] = []
    const label = typeof o.id === 'string' ? o.id : `#${index}`
    const err = (msg: string) => errors.push(`${label}: ${msg}`)

    if (typeof o.id !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(o.id)) {
        err('id 必須是小寫英數字，單字間用連字號')
    }
    if (typeof o.name !== 'string' || o.name.trim() === '') {
        err('name 不可為空')
    }
    if (typeof o.description !== 'string') err('description 必須是字串')
    if (!TYPES.includes(o.type as string)) err('type 不合法')
    if (!PLATFORMS.includes(o.platform as string)) err('platform 不合法')
    if (!STATUSES.includes(o.status as string)) err('status 不合法')
    if (!Array.isArray(o.tags) || !o.tags.every((t) => typeof t === 'string')) {
        err('tags 必須是字串陣列')
    }

    if ((o.type === 'website' || o.type === 'react') && !isHttps(o.url)) {
        err('網站類專案需要 https 開頭的 url')
    }
    if (o.type === 'android' && !isHttps(o.apkUrl)) {
        err('Android 專案需要 https 開頭的 apkUrl')
    }

    if (o.url !== undefined && !isHttps(o.url)) err('url 必須是 https 網址')
    if (o.apkUrl !== undefined && !isHttps(o.apkUrl)) {
        err('apkUrl 必須是 https 網址')
    }
    if (
        o.sha256 !== undefined &&
        !(typeof o.sha256 === 'string' && /^[a-f0-9]{64}$/i.test(o.sha256))
    ) {
        err('sha256 必須是 64 個十六進位字元')
    }
    if (o.openMode !== undefined && !OPEN_MODES.includes(o.openMode as string)) {
        err('openMode 不合法')
    }
    if (
        o.sizeMB !== undefined &&
        !(typeof o.sizeMB === 'number' && o.sizeMB > 0)
    ) {
        err('sizeMB 必須是大於 0 的數字')
    }

    if (errors.length > 0) return { errors }
    return { project: o as unknown as Project, errors }
}

export function validateProjects(raw: unknown): ValidationResult {
    if (!Array.isArray(raw)) {
        return { projects: [], errors: ['projects.json 的最外層必須是陣列'] }
    }

    const projects: Project[] = []
    const errors: string[] = []
    const seen = new Set<string>()

    raw.forEach((item, index) => {
        const result = validateOne(item, index)
        errors.push(...result.errors)
        if (!result.project) return

        if (seen.has(result.project.id)) {
            errors.push(`${result.project.id}: id 重複，已略過`)
            return
        }
        seen.add(result.project.id)
        projects.push(result.project)
    })

    return { projects, errors }
}