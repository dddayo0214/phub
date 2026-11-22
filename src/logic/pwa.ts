export type InstallUi = 'hidden' | 'button' | 'ios-guide'

export interface InstallInput {
    /** 目前已經是以「已安裝的 App」模式在執行 */
    isStandalone: boolean
    /** 瀏覽器已提供可觸發的安裝提示（beforeinstallprompt） */
    hasPrompt: boolean
    isIOS: boolean
    /** 這次開啟期間剛剛安裝完成 */
    installedThisSession: boolean
}

export function getInstallUi(input: InstallInput): InstallUi {
    if (input.isStandalone || input.installedThisSession) return 'hidden'
    if (input.hasPrompt) return 'button'
    // iOS 沒有安裝事件，只能引導使用者手動「加入主畫面」
    if (input.isIOS) return 'ios-guide'
    return 'hidden'
}

export type PwaBanner = 'update' | 'offline-ready' | 'none'

export function getPwaBanner(state: {
    needRefresh: boolean
    offlineReady: boolean
}): PwaBanner {
    if (state.needRefresh) return 'update'
    if (state.offlineReady) return 'offline-ready'
    return 'none'
}