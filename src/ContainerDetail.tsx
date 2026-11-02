import { useCallback, useEffect, useState } from 'react'
import { STATUSES, addEvent, getContainer, type ContainerDetail as Detail, type Status } from './api'

export default function ContainerDetail({ number, onChanged }: { number: string; onChanged: () => void }) {
  const [c, setC] = useState<Detail | null>(null)
  const [status, setStatus] = useState<Status>('gate_in')
  const [location, setLocation] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(() => {
    getContainer(number).then((d) => { setC(d); setError('') }).catch((e) => setError(e.message))
  }, [number])
  useEffect(load, [load])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await addEvent(number, status, location, note)
      setLocation(''); setNote('')
      load(); onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed') // e.g. "Cannot go from ... Next allowed: ..."
    }
  }

  if (!c) return <section className="card"><p className="muted">{error || 'Loading...'}</p></section>
  return (
    <section className="card">
      <h2>{c.number} <span className={`pill ${c.status}`}>{c.status}</span></h2>
      <ol className="timeline">
        {c.events.map((e) => (
          <li key={e.id}>
            <strong>{e.status}</strong> at {e.location}
            {e.note && <em> ({e.note})</em>}
            <div className="muted">{new Date(e.occurred_at).toLocaleString()}</div>
          </li>
        ))}
      </ol>
      <form className="row" onSubmit={submit}>
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)} aria-label="New status">
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <input placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button type="submit">Add event</button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
    </section>
  )
}
