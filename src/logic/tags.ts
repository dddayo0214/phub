import type { Project } from '../types/project'
import { normalize } from './search'

export interface TagCount {
    tag: string
    count: number
}

export function countTags(projects: Project[]): TagCount[] {
    const map = new Map<string, TagCount>()

    for (const project of projects) {
        const seen = new Set<string>()
        for (const raw of project.tags) {
            const key = normalize(raw)
            if (key === '' || seen.has(key)) continue
            seen.add(key)

            const entry = map.get(key)
            if (entry) entry.count += 1
            else map.set(key, { tag: raw.trim(), count: 1 })
        }
    }

    return [...map.values()].sort(
        (a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-Hant'),
    )
}

export function hasTag(project: Project, tag: string): boolean {
    const key = normalize(tag)
    return project.tags.some((t) => normalize(t) === key)
}

export function isTagSelected(selected: string[], tag: string): boolean {
    const key = normalize(tag)
    return selected.some((t) => normalize(t) === key)
}

export function toggleTag(selected: string[], tag: string): string[] {
    if (isTagSelected(selected, tag)) {
        const key = normalize(tag)
        return selected.filter((t) => normalize(t) !== key)
    }
    return [...selected, tag]
}