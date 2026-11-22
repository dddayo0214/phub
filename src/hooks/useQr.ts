import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export type QrResult =
    | { status: 'loading' }
    | { status: 'error' }
    | { status: 'ready'; url: string }

interface Done {
    text: string
    url: string | null
}

export function useQr(text: string): QrResult {
    const [done, setDone] = useState<Done | null>(null)

    useEffect(() => {
        let cancelled = false
        QRCode.toDataURL(text, { margin: 1, width: 256, errorCorrectionLevel: 'M' })
            .then((url) => {
                if (!cancelled) setDone({ text, url })
            })
            .catch(() => {
                if (!cancelled) setDone({ text, url: null })
            })
        return () => {
            cancelled = true
        }
    }, [text])

    if (!done || done.text !== text) return { status: 'loading' }
    return done.url ? { status: 'ready', url: done.url } : { status: 'error' }
}