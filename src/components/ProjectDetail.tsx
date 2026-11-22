import { useState } from 'react'
import { getAvailability } from '../logic/availability'
import { detectDevice } from '../logic/device'
import { getOpenAction } from '../logic/open'
import { buildShareUrl, isLocalHost } from '../logic/share'
import type { Project } from '../types/project'
import { ApkDownload } from './ApkDownload'
import { EmbedFrame } from './EmbedFrame'
import { QrCode } from './QrCode'

export function ProjectDetail({ project }: { project: Project }) {
    const [embedded, setEmbedded] = useState(false)
    const [device] = useState(() => detectDevice(navigator))

    const action = getOpenAction(project, window.location.origin)
    const availability = getAvailability(project, device)
    const shareUrl = buildShareUrl(window.location.href, project.id)

    return (
        <div>
            <p>
                <a href="#/">← 返回清單</a>
            </p>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            <p>
                類型：{project.type}｜平台：{project.platform}｜狀態：{project.status}
            </p>
            <p>標籤：{project.tags.join('、') || '（無）'}</p>

            {availability.status === 'mobile-only' && (
                <section>
                    <p>這個專案僅限手機使用。請用手機掃描 QR Code，在手機上開啟。</p>
                    {shareUrl ? (
                        <>
                            <QrCode text={shareUrl} label={`開啟 ${project.name} 的 QR Code`} />
                            {isLocalHost(shareUrl) && (
                                <p>
                                    注意：目前網址是 localhost，手機連不到。開發時請用電腦的區網 IP
                                    開啟本頁（執行 npm run dev -- --host），再重新掃描。
                                </p>
                            )}
                        </>
                    ) : (
                        <p>無法產生 QR Code。</p>
                    )}
                </section>
            )}

            {availability.status === 'desktop-recommended' && (
                <p>這個專案建議在電腦上使用，手機上可能無法正常操作。</p>
            )}

            {availability.status === 'unsupported-os' && (
                <p>iPhone 與 iPad 無法安裝 APK，請改用 Android 裝置。</p>
            )}

            {action.kind === 'iframe' && (
                <>
                    {!embedded && (
                        <button type="button" onClick={() => setEmbedded(true)}>
                            在 App 內開啟
                        </button>
                    )}{' '}
                    <a href={action.url} target="_blank" rel="noopener noreferrer">
                        改用新分頁開啟
                    </a>
                    {embedded && (
                        <>
                            <p>如果下方是空白或顯示被拒絕，代表這個網站不允許被內嵌，請改用新分頁開啟。</p>
                            <EmbedFrame url={action.url} title={project.name} />
                        </>
                    )}
                </>
            )}

            {action.kind === 'newtab' && (
                <a href={action.url} target="_blank" rel="noopener noreferrer">
                    開啟網站
                </a>
            )}

            {action.kind === 'download' && availability.status === 'ok' && (
                <ApkDownload project={project} url={action.url} />
            )}

            {action.kind === 'unavailable' && <p>無法開啟：{action.reason}</p>}
        </div>
    )
}