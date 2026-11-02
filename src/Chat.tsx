import { useState } from 'react'
import { ask } from './api'

interface Msg { from: 'me' | 'bot'; text: string; tool?: string }

export default function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const question = text.trim()
    if (question.length < 3 || busy) return
    setText('')
    setBusy(true)
    setMsgs((m) => [...m, { from: 'me', text: question }])
    try {
      const r = await ask(question)
      setMsgs((m) => [...m, { from: 'bot', text: r.answer, tool: r.tool }])
    } catch (err) {
      setMsgs((m) => [...m, { from: 'bot', text: `Error: ${err instanceof Error ? err.message : 'failed'}` }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card">
      <h2>Ask</h2>
      <div className="chat" aria-live="polite">
        {msgs.length === 0 && <p className="muted">Try: "which containers are at sea?" or "where is MSKU1234567?"</p>}
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.from}`}>
            {m.text}
            {m.tool && <small className="muted"> via {m.tool}</small>}
          </div>
        ))}
      </div>
      <form className="row" onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about your containers" aria-label="Question" />
        <button type="submit" disabled={busy}>Send</button>
      </form>
    </section>
  )
}
