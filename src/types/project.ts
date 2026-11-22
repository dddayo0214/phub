export type ProjectType = 'website' | 'react' | 'android' | 'other'
export type Platform = 'mobile' | 'desktop' | 'both'
export type ProjectStatus = 'active' | 'done' | 'paused'
export type OpenMode = 'iframe' | 'newtab'

export interface Project {
    id: string
    name: string
    description: string
    type: ProjectType
    platform: Platform
    status: ProjectStatus
    tags: string[]
    url?: string          // 網站、React 專案的網址
    openMode?: OpenMode   // 預設 iframe，不能內嵌的網站設 newtab
    apkUrl?: string       // Android 專案的下載連結
    version?: string
    sha256?: string       // APK 校驗碼，64 個十六進位字元
    sizeMB?: number
    updatedAt?: string    // 格式 YYYY-MM-DD
}