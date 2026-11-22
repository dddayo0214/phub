import { useMemo, useState } from 'react'
import { emptyFilter, filterProjects } from '../logic/filter'
import type { FilterState } from '../logic/filter'
import { countTags, toggleTag } from '../logic/tags'
import type { Project } from '../types/project'

export function useProjectFilter(projects: Project[]) {
    const [filter, setFilter] = useState<FilterState>(emptyFilter)

    const allTags = useMemo(() => countTags(projects), [projects])
    const visible = useMemo(
        () => filterProjects(projects, filter),
        [projects, filter],
    )

    const setQuery = (query: string) => setFilter((f) => ({ ...f, query }))
    const toggle = (tag: string) =>
        setFilter((f) => ({ ...f, tags: toggleTag(f.tags, tag) }))
    const clear = () => setFilter(emptyFilter)

    return { filter, allTags, visible, setQuery, toggle, clear }
}