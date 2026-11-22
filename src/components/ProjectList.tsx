import { useProjectFilter } from '../hooks/useProjectFilter'
import { buildProjectHash } from '../logic/route'
import { isTagSelected } from '../logic/tags'
import type { Project } from '../types/project'

interface Props {
    projects: Project[]
    errors: string[]
}

export function ProjectList({ projects, errors }: Props) {
    const { filter, allTags, visible, setQuery, toggle, clear } =
        useProjectFilter(projects)

    return (
        <div>
            <input
                type="search"
                value={filter.query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋名稱、描述、標籤"
            />

            <div>
                {allTags.map(({ tag, count }) => {
                    const selected = isTagSelected(filter.tags, tag)
                    return (
                        <button
                            key={tag}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggle(tag)}
                        >
                            {selected ? '✓ ' : ''}
                            {tag} ({count})
                        </button>
                    )
                })}
                <button type="button" onClick={clear}>
                    清除
                </button>
            </div>

            <p>
                顯示 {visible.length} / {projects.length}
            </p>

            {visible.length === 0 && projects.length > 0 && <p>沒有符合的專案</p>}

            <ul>
                {visible.map((p) => (
                    <li key={p.id}>
                        <a href={buildProjectHash(p.id)}>{p.name}</a>（{p.type} /{' '}
                        {p.platform}）— {p.tags.join('、')}
                    </li>
                ))}
            </ul>

            {errors.length > 0 && (
                <>
                    <h2>資料錯誤</h2>
                    <ul>
                        {errors.map((e) => (
                            <li key={e}>{e}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}