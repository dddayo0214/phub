import type { Project } from '../types/project'

export type OpenAction =
    | { kind: 'iframe'; url: string }
    | { kind: 'newtab'; url: string }
    | { kind: 'download'; url: string }
    | { kind: 'unavailable'; reason: string }

function parseHttps(value: string | undefined): URL | null {
    if (!value) return null
    try {
        const url = new URL(value)
        return url.protocol === 'https:' ? url : null
    } catch {
        return null
    }
}

export function getOpenAction(
    project: Project,
    currentOrigin: string,
): OpenAction {
    if (project.type === 'android') {
        const apk = parseHttps(project.apkUrl)
        return apk
            ? { kind: 'download', url: apk.href }
            : { kind: 'unavailable', reason: '缺少有效的下載連結' }
    }

    const url = parseHttps(project.url)
    if (!url) return { kind: 'unavailable', reason: '缺少有效的 https 網址' }

    const mode =
        project.openMode ?? (project.type === 'other' ? 'newtab' : 'iframe')

    // 與 phub 同源的網站不內嵌，避免 sandbox 被繞過（見步驟 5-9）
    if (mode === 'iframe' && url.origin !== currentOrigin) {
        return { kind: 'iframe', url: url.href }
    }
    return { kind: 'newtab', url: url.href }
}