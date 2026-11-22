import { validateProjects } from './validateProjects'
import type { ValidationResult } from './validateProjects'

export async function loadProjects(): Promise<ValidationResult> {
    // no-cache：每次都向伺服器確認有沒有更新，避免被瀏覽器快取擋住新清單
    const res = await fetch(`${import.meta.env.BASE_URL}projects.json`, {
        cache: 'no-cache',
    })
    if (!res.ok) throw new Error(`載入 projects.json 失敗（${res.status}）`)
    return validateProjects(await res.json())
}