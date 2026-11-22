function trim(n: number): string {
    return String(Math.round(n * 10) / 10)
}

export function formatSize(mb: number | undefined): string | null {
    if (mb === undefined || !Number.isFinite(mb) || mb <= 0) return null
    if (mb < 1) return `${Math.max(1, Math.round(mb * 1024))} KB`
    if (mb >= 1024) return `${trim(mb / 1024)} GB`
    return `${trim(mb)} MB`
}

export function formatSha256(hash: string | undefined): string | null {
    if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) return null
    return hash.toLowerCase().replace(/(.{8})(?=.)/g, '$1 ')
}

export function apkFileName(url: string | undefined): string | null {
    if (!url) return null
    try {
        const last = new URL(url).pathname.split('/').filter(Boolean).pop()
        if (!last) return null
        const name = decodeURIComponent(last)
        return name.toLowerCase().endsWith('.apk') ? name : null
    } catch {
        return null
    }
}