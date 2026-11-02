import { useCallback, useEffect, useState } from 'react'
import { STATUSES, createContainer, listContainers, type Page } from './api'

const PAGE = 8

export default function ContainerList({ selected, onSelect }: { selected: string | null; onSelect: (n: string) => void }) {
  const [page, setPage] = useState<Page | null>(null)
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [offset, setOffset] = useState(0)
  const [newNumber, setNewNumber] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(() => {
    listContainers({ status, q, limit: PAGE, offset })
      .then(setPage)
      .catch((e) => setError(e.message))
  }, [status, q, offset])

  useEffect(load, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const c = await createContainer(newNumber.toUpperCase())
      setNewNumber('')
      load()
      onSelect(c.number)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    }
  }

  const total = page?.total ?? 0
  return (
    <section className="card">
      <h2>Containers</h2>
      <div className="row">
        <input placeholder="Search number" value={q} onChange={(e) => { setQ(e.target.value); setOffset(0) }} />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setOffset(0) }} aria-label="Status filter">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <ul className="list">
        {page?.items.map((c) => (
          <li key={c.id}>
            <button className={c.number === selected ? 'item active' : 'item'} onClick={() => onSelect(c.number)}>
              <strong>{c.number}</strong> <span className={`pill ${c.status}`}>{c.status}</span>
            </button>
          </li>
        ))}
        {page && page.items.length === 0 && <li className="muted">No containers found.</li>}
      </ul>
      <div className="row between">
        <button disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>Prev</button>
        <span className="muted">{total === 0 ? 0 : offset + 1}-{Math.min(offset + PAGE, total)} of {total}</span>
        <button disabled={offset + PAGE >= total} onClick={() => setOffset(offset + PAGE)}>Next</button>
      </div>
      <form className="row" onSubmit={add}>
        <input placeholder="MSKU1234567" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
    </section>
  )
}
