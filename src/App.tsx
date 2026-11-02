import { useState } from 'react'
import { setToken } from './api'
import Chat from './Chat'
import ContainerDetail from './ContainerDetail'
import ContainerList from './ContainerList'
import Login from './Login'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)

  if (!loggedIn) return <main><h1>Container Tracker</h1><Login onLoggedIn={() => setLoggedIn(true)} /></main>

  return (
    <main>
      <header className="row between">
        <h1>Container Tracker</h1>
        <button onClick={() => { setToken(null); setLoggedIn(false); setSelected(null) }}>Sign out</button>
      </header>
      <div className="grid">
        <ContainerList key={refresh} selected={selected} onSelect={setSelected} />
        <div className="stack">
          {selected ? <ContainerDetail number={selected} onChanged={() => setRefresh((r) => r + 1)} /> : <section className="card muted">Select a container.</section>}
          <Chat />
        </div>
      </div>
    </main>
  )
}
