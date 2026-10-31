import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, ask, listContainers, setToken } from './api'

const reply = (body: unknown, status = 200) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }))

afterEach(() => { vi.unstubAllGlobals(); setToken(null) })

describe('api client', () => {
  it('sends the bearer token', async () => {
    const f = reply({ total: 0, limit: 10, offset: 0, items: [] })
    vi.stubGlobal('fetch', f)
    setToken('abc')
    await listContainers({})
    const headers = f.mock.calls[0][1].headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer abc')
  })

  it('builds the query string with filters and paging', async () => {
    const f = reply({ total: 0, limit: 8, offset: 8, items: [] })
    vi.stubGlobal('fetch', f)
    await listContainers({ status: 'at_sea', q: 'MSKU', limit: 8, offset: 8 })
    expect(f.mock.calls[0][0]).toBe('/containers?status=at_sea&q=MSKU&limit=8&offset=8')
  })

  it('turns API errors into ApiError with the server message', async () => {
    vi.stubGlobal('fetch', reply({ detail: "Cannot go from 'gate_in' to 'booked'" }, 409))
    await expect(ask('where is it')).rejects.toMatchObject({ status: 409, message: "Cannot go from 'gate_in' to 'booked'" })
    await expect(ask('x y z')).rejects.toBeInstanceOf(ApiError)
  })
})
