import type { Project } from '../types/project'

export function make(overrides: Partial<Project> & { id: string }): Project {
    return {
        name: overrides.id,
        description: '',
        type: 'website',
        platform: 'both',
        status: 'active',
        tags: [],
        url: 'https://example.com',
        ...overrides,
    }
}

export const todo = make({
    id: 'todo',
    name: '待辦清單',
    description: 'React 工具',
    tags: ['React', '工具'],
})

export const notes = make({
    id: 'notes',
    name: '筆記 App',
    description: 'Android 筆記程式',
    type: 'android',
    platform: 'mobile',
    tags: ['Android', '工具'],
    url: undefined,
    apkUrl: 'https://example.com/notes.apk',
})

export const portfolio = make({
    id: 'portfolio',
    name: 'Portfolio',
    description: 'My site',
    tags: ['網站', 'react'],
})

export const sample = [todo, notes, portfolio]