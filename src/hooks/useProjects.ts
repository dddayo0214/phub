import { useEffect, useState } from 'react'
import { loadProjects } from '../data/loadProjects'
import type { Project } from '../types/project'

export type ProjectsState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'ready'; projects: Project[]; errors: string[] }

export function useProjects(): ProjectsState {
    const [state, setState] = useState<ProjectsState>({ status: 'loading' })

    useEffect(() => {
        let cancelled = false
        loadProjects()
            .then((r) => {
                if (!cancelled) {
                    setState({ status: 'ready', projects: r.projects, errors: r.errors })
                }
            })
            .catch((e: Error) => {
                if (!cancelled) setState({ status: 'error', message: e.message })
            })
        return () => {
            cancelled = true
        }
    }, [])

    return state
}