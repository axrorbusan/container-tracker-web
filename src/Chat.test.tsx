import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import Chat from './Chat'

afterEach(() => vi.unstubAllGlobals())

it('shows the question and the answer with the tool used', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ answer: '1 container(s) at_sea: MSKU1234567.', tool: 'list_by_status', sources: [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } })))
  render(<Chat />)
  await userEvent.type(screen.getByLabelText('Question'), 'which containers are at sea?')
  await userEvent.click(screen.getByRole('button', { name: 'Send' }))
  expect(await screen.findByText(/MSKU1234567/)).toBeInTheDocument()
  expect(screen.getByText('which containers are at sea?')).toBeInTheDocument()
  expect(screen.getByText(/via list_by_status/)).toBeInTheDocument()
})

it('shows an error message when the API fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ detail: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } })))
  render(<Chat />)
  await userEvent.type(screen.getByLabelText('Question'), 'hello there')
  await userEvent.click(screen.getByRole('button', { name: 'Send' }))
  expect(await screen.findByText(/Not authenticated/)).toBeInTheDocument()
})
