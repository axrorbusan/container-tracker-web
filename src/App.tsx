import { useState } from 'react'
import ContainerList from './ContainerList'
import Login from './Login'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  if (!loggedIn) return <main><h1>Container Tracker</h1><Login onLoggedIn={() => setLoggedIn(true)} /></main>
  return <main><h1>Container Tracker</h1><ContainerList selected={selected} onSelect={setSelected} /></main>
}
