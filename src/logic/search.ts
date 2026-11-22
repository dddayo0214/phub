import type { Project } from '../types/project'

export function normalize(text: string): string {
    return text.normalize('NFKC').toLowerCase().trim()
}

export function matchesQuery(project: Project, query: string): boolean {
    const terms = normalize(query).split(/\s+/).filter(Boolean)
    if (terms.length === 0) return true

    const haystack = normalize(
        [project.name, project.description, ...project.tags].join('\n'),
    )
    return terms.every((term) => haystack.includes(term))
}