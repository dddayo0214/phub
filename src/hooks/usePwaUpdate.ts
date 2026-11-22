import { useRegisterSW } from 'virtual:pwa-register/react'
import { getPwaBanner } from '../logic/pwa'

const CHECK_INTERVAL_MS = 60 * 60 * 1000

export function usePwaUpdate() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        offlineReady: [offlineReady, setOfflineReady],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(_swUrl, registration) {
            if (!registration) return
            // App 一直開著時，每小時主動檢查一次有沒有新版本
            setInterval(() => {
                if (registration.installing || !navigator.onLine) return
                registration.update().catch(() => { })
            }, CHECK_INTERVAL_MS)
        },
    })

    return {
        banner: getPwaBanner({ needRefresh, offlineReady }),
        applyUpdate: () => updateServiceWorker(true),
        dismiss: () => {
            setNeedRefresh(false)
            setOfflineReady(false)
        },
    }
}