export const STATUSES = ['booked', 'gate_in', 'loaded', 'at_sea', 'discharged', 'gate_out'] as const
export type Status = (typeof STATUSES)[number]

export interface ContainerItem { id: number; number: string; size: string; status: Status; vessel_id: number | null }
export interface EventItem { id: number; status: Status; location: string; note: string | null; occurred_at: string }
export interface ContainerDetail extends ContainerItem { events: EventItem[] }
export interface Page { total: number; limit: number; offset: number; items: ContainerItem[] }
export interface AskResult { answer: string; tool: string; sources: string[] }

let token: string | null = null
export const setToken = (t: string | null) => { token = t }

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(path, { ...init, headers })
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail)
    } catch { /* keep statusText */ }
    throw new ApiError(res.status, detail)
  }
  return res.json() as Promise<T>
}

const json = (body: unknown): RequestInit => ({
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
})

export async function login(email: string, password: string): Promise<string> {
  const r = await request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: email, password }),
  })
  return r.access_token
}

export const register = (email: string, password: string, role: 'viewer' | 'operator') =>
  request('/auth/register', json({ email, password, role }))

export function listContainers(p: { status?: string; q?: string; limit?: number; offset?: number }) {
  const qs = new URLSearchParams()
  if (p.status) qs.set('status', p.status)
  if (p.q) qs.set('q', p.q)
  qs.set('limit', String(p.limit ?? 10))
  qs.set('offset', String(p.offset ?? 0))
  return request<Page>(`/containers?${qs}`)
}

export const getContainer = (n: string) => request<ContainerDetail>(`/containers/${n}`)
export const createContainer = (number: string) => request<ContainerItem>('/containers', json({ number }))
export const addEvent = (n: string, status: Status, location: string, note?: string) =>
  request<EventItem>(`/containers/${n}/events`, json({ status, location, note: note || null }))
export const ask = (question: string) => request<AskResult>('/ask', json({ question }))
