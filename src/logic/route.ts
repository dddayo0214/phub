export type Route =
  | { name: 'home' }
  | { name: 'project'; id: string }
  | { name: 'notfound' }

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, '').split('?')[0]
  const path = raw.replace(/^\/+/, '').replace(/\/+$/, '')

  if (path === '') return { name: 'home' }

  const parts = path.split('/')
  if (parts.length === 2 && parts[0] === 'project' && parts[1] !== '') {
    try {
      return { name: 'project', id: decodeURIComponent(parts[1]) }
    } catch {
      return { name: 'notfound' }
    }
  }

  return { name: 'notfound' }
}

export function buildProjectHash(id: string): string {
  return `#/project/${encodeURIComponent(id)}`
}