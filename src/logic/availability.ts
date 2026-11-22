import type { Project } from '../types/project'
import type { DeviceInfo } from './device'

export type Availability =
    | { status: 'ok' }
    | { status: 'mobile-only' }
    | { status: 'desktop-recommended' }
    | { status: 'unsupported-os' }

export function getAvailability(
    project: Project,
    device: DeviceInfo,
): Availability {
    // Android 專案只看裝置是不是 Android，忽略 platform 欄位
    if (project.type === 'android') {
        if (device.isAndroid) return { status: 'ok' }
        return device.kind === 'desktop'
            ? { status: 'mobile-only' }
            : { status: 'unsupported-os' }
    }

    if (project.platform === 'mobile' && device.kind === 'desktop') {
        return { status: 'mobile-only' }
    }
    if (project.platform === 'desktop' && device.kind === 'mobile') {
        return { status: 'desktop-recommended' }
    }
    return { status: 'ok' }
}