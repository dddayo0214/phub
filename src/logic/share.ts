import { buildProjectHash } from './route'

export function buildShareUrl(currentHref: string, id: string): string | null {
    try {
        const url = new URL(currentHref)
        url.hash = ''
        url.search = ''
        url.pathname = url.pathname.replace(/index\.html$/i, '')
        return url.href + buildProjectHash(id)
    } catch {
        return null
    }
}

export function isLocalHost(href: string): boolean {
    try {
        const host = new URL(href).hostname
        return (
            host === 'localhost' ||
            host.endsWith('.localhost') ||
            host === '127.0.0.1' ||
            host === '[::1]'
        )
    } catch {
        return false
    }
}