import { apkFileName, formatSha256, formatSize } from '../logic/apk'
import type { Project } from '../types/project'

interface Props {
    project: Project
    url: string
}

export function ApkDownload({ project, url }: Props) {
    const size = formatSize(project.sizeMB)
    const hash = formatSha256(project.sha256)
    const fileName = apkFileName(url)

    return (
        <section>
            <h2>下載 Android 版本</h2>
            <ul>
                <li>版本：{project.version ?? '未提供'}</li>
                <li>大小：{size ?? '未提供'}</li>
                <li>檔名：{fileName ?? '未提供'}</li>
                <li>更新日期：{project.updatedAt ?? '未提供'}</li>
                <li>
                    SHA-256：<code>{hash ?? '未提供'}</code>
                </li>
            </ul>

            <p>
                <a href={url} rel="noopener noreferrer">
                    下載 APK
                </a>
            </p>

            <details>
                <summary>第一次安裝的步驟</summary>
                <ol>
                    <li>按「下載 APK」，下載進度會顯示在通知欄。</li>
                    <li>
                        Android 會提示不允許安裝未知應用程式，點「設定」，允許你用來下載的瀏覽器（例如
                        Chrome）。不同廠牌的手機，選項名稱可能略有不同。
                    </li>
                    <li>回到下載完成的通知，點開 APK，按「安裝」。</li>
                    <li>安裝完成後，可以把剛剛開啟的權限關掉。</li>
                </ol>
                <p>
                    想確認檔案沒有被替換：在電腦下載後，用 PowerShell 執行
                    <code> Get-FileHash .\檔名.apk -Algorithm SHA256 </code>
                    ，結果與上面的 SHA-256 一致（不分大小寫、忽略空白）即可。
                </p>
            </details>
        </section>
    )
}