import { useMemo, useSyncExternalStore } from 'react'
import { parseHash } from '../logic/route'

function subscribe(callback: () => void) {
    window.addEventListener('hashchange', callback)
    return () => window.removeEventListener('hashchange', callback)
}

export function useHashRoute() {
    const hash = useSyncExternalStore(
        subscribe,
        () => window.location.hash,
        () => '',
    )
    return useMemo(() => parseHash(hash), [hash])
}