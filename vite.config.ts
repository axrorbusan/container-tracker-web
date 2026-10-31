/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The API runs on :8000 (FastAPI). Proxy so the browser sees one origin and CORS is not needed.
const API = process.env.VITE_API_TARGET ?? 'http://localhost:8000'
const paths = ['/auth', '/vessels', '/containers', '/ask', '/health']

export default defineConfig({
  plugins: [react()],
  server: { proxy: Object.fromEntries(paths.map((p) => [p, API])) },
  test: { environment: 'jsdom', setupFiles: './src/setup.ts', globals: true },
})
