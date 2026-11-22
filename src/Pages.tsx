import { ProjectDetail } from './components/ProjectDetail'
import { ProjectList } from './components/ProjectList'
import { PwaBar } from './components/PwaBar'
import { useHashRoute } from './hooks/useHashRoute'
import { useProjects } from './hooks/useProjects'

function NotFound({ message }: { message: string }) {
  return (
    <div>
      <p>{message}</p>
      <a href="#/">回到清單</a>
    </div>
  )
}

function Pages() {
  const state = useProjects()
  const route = useHashRoute()

  if (state.status === 'loading') return <p>載入中…</p>
  if (state.status === 'error') return <p>錯誤：{state.message}</p>

  const { projects, errors } = state

  if (route.name === 'home') {
    return <ProjectList projects={projects} errors={errors} />
  }

  if (route.name === 'project') {
    const project = projects.find((p) => p.id === route.id)
    if (!project) return <NotFound message={`找不到專案：${route.id}`} />
    return <ProjectDetail key={project.id} project={project} />
  }

  return <NotFound message="找不到這個頁面" />
}

function App() {
  return (
    <>
      <PwaBar />
      <Pages />
    </>
  )
}

export default App