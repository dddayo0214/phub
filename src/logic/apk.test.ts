import { describe, expect, it } from 'vitest'
import { apkFileName, formatSha256, formatSize } from './apk'

describe('formatSize', () => {
    it('沒有值、零、負數、NaN 都回傳 null', () => {
        expect(formatSize(undefined)).toBeNull()
        expect(formatSize(0)).toBeNull()
        expect(formatSize(-3)).toBeNull()
        expect(formatSize(Number.NaN)).toBeNull()
        expect(formatSize(Number.POSITIVE_INFINITY)).toBeNull()
    })

    it('一般大小', () => {
        expect(formatSize(12.5)).toBe('12.5 MB')
    })

    it('整數不顯示小數點', () => {
        expect(formatSize(12)).toBe('12 MB')
        expect(formatSize(12.04)).toBe('12 MB')
    })

    it('小於 1 MB 改用 KB', () => {
        expect(formatSize(0.5)).toBe('512 KB')
    })

    it('極小的值至少顯示 1 KB', () => {
        expect(formatSize(0.0001)).toBe('1 KB')
    })

    it('1024 MB 以上改用 GB', () => {
        expect(formatSize(2048)).toBe('2 GB')
        expect(formatSize(1536)).toBe('1.5 GB')
    })
})

describe('formatSha256', () => {
    const hash = '0123456789abcdef'.repeat(4)

    it('每 8 個字元一組', () => {
        expect(formatSha256(hash)).toBe(
            '01234567 89abcdef 01234567 89abcdef 01234567 89abcdef 01234567 89abcdef',
        )
    })

    it('轉成小寫', () => {
        expect(formatSha256(hash.toUpperCase())).toBe(formatSha256(hash))
    })

    it('結尾沒有多餘的空白', () => {
        expect(formatSha256(hash)?.endsWith(' ')).toBe(false)
    })

    it('格式錯誤或沒有值回傳 null', () => {
        expect(formatSha256('abc')).toBeNull()
        expect(formatSha256('g'.repeat(64))).toBeNull()
        expect(formatSha256(undefined)).toBeNull()
        expect(formatSha256('')).toBeNull()
    })
})

describe('apkFileName', () => {
    it('取出檔名', () => {
        expect(
            apkFileName('https://github.com/a/b/releases/latest/download/notes.apk'),
        ).toBe('notes.apk')
    })

    it('解碼檔名', () => {
        expect(apkFileName('https://example.com/%E7%AD%86%E8%A8%98.apk')).toBe(
            '筆記.apk',
        )
    })

    it('忽略查詢字串', () => {
        expect(apkFileName('https://example.com/a.apk?token=1')).toBe('a.apk')
    })

    it('不是 .apk 結尾回傳 null', () => {
        expect(apkFileName('https://example.com/a.zip')).toBeNull()
    })

    it('沒有值、無效網址、錯誤編碼都回傳 null', () => {
        expect(apkFileName(undefined)).toBeNull()
        expect(apkFileName('not a url')).toBeNull()
        expect(apkFileName('https://example.com/%E0%A4%A.apk')).toBeNull()
        expect(apkFileName('https://example.com/')).toBeNull()
    })
})