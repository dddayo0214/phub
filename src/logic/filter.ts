import type { Project } from '../types/project'
import { matchesQuery } from './search'
import { hasTag } from './tags'

export interface FilterState {
    query: string
    tags: string[]
}

export const emptyFilter: FilterState = { query: '', tags: [] }

export function filterProjects(
    projects: Project[],
    filter: FilterState,
): Project[] {
    return projects.filter(
        (p) =>
            filter.tags.every((tag) => hasTag(p, tag)) &&
            matchesQuery(p, filter.query),
    )
}