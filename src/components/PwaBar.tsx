import { useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { usePwaUpdate } from '../hooks/usePwaUpdate'

export function PwaBar() {
    const { ui, install } = useInstallPrompt()
    const { banner, applyUpdate, dismiss } = usePwaUpdate()
    const [hideInstall, setHideInstall] = useState(false)

    return (
        <>
            {banner === 'update' && (
                <div role="status">
                    <span>有新版本可以使用。</span>{' '}
                    <button type="button" onClick={applyUpdate}>
                        更新
                    </button>{' '}
                    <button type="button" onClick={dismiss}>
                        稍後
                    </button>
                </div>
            )}

            {banner === 'offline-ready' && (
                <div role="status">
                    <span>已準備好離線使用。</span>{' '}
                    <button type="button" onClick={dismiss}>
                        知道了
                    </button>
                </div>
            )}

            {!hideInstall && ui === 'button' && (
                <div>
                    <button type="button" onClick={install}>
                        安裝 phub
                    </button>{' '}
                    <button type="button" onClick={() => setHideInstall(true)}>
                        不用了
                    </button>
                </div>
            )}

            {!hideInstall && ui === 'ios-guide' && (
                <div>
                    <span>
                        想安裝到主畫面：點瀏覽器的「分享」按鈕，選擇「加入主畫面」。
                    </span>{' '}
                    <button type="button" onClick={() => setHideInstall(true)}>
                        知道了
                    </button>
                </div>
            )}
        </>
    )
}