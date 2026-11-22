import { useEffect, useState } from 'react'
import { detectDevice } from '../logic/device'
import { getInstallUi } from '../logic/pwa'

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function checkStandalone(): boolean {
    const nav = navigator as Navigator & { standalone?: boolean }
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        nav.standalone === true
    )
}

export function useInstallPrompt() {
    const [promptEvent, setPromptEvent] =
        useState<BeforeInstallPromptEvent | null>(null)
    const [installed, setInstalled] = useState(false)
    const [standalone] = useState(checkStandalone)
    const [device] = useState(() => detectDevice(navigator))

    useEffect(() => {
        const onPrompt = (e: Event) => {
            e.preventDefault()
            setPromptEvent(e as BeforeInstallPromptEvent)
        }
        const onInstalled = () => {
            setInstalled(true)
            setPromptEvent(null)
        }

        window.addEventListener('beforeinstallprompt', onPrompt)
        window.addEventListener('appinstalled', onInstalled)
        return () => {
            window.removeEventListener('beforeinstallprompt', onPrompt)
            window.removeEventListener('appinstalled', onInstalled)
        }
    }, [])

    const install = async () => {
        if (!promptEvent) return
        try {
            await promptEvent.prompt()
            const choice = await promptEvent.userChoice
            if (choice.outcome === 'accepted') setInstalled(true)
        } catch {
            // 提示只能使用一次，失敗時一樣清掉，等瀏覽器下次再提供
        }
        setPromptEvent(null)
    }

    const ui = getInstallUi({
        isStandalone: standalone,
        hasPrompt: promptEvent !== null,
        isIOS: device.isIOS,
        installedThisSession: installed,
    })

    return { ui, install }
}