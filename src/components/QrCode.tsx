import { useQr } from '../hooks/useQr'

interface Props {
    text: string
    label: string
}

export function QrCode({ text, label }: Props) {
    const qr = useQr(text)

    if (qr.status === 'loading') return <p>QR Code 產生中…</p>
    if (qr.status === 'error') return <p>QR Code 產生失敗，請直接用手機開啟：{text}</p>
    return <img src={qr.url} alt={label} width={256} height={256} />
}