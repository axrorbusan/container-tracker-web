# Container Tracker Web

React + TypeScript frontend for my FastAPI backend (`container-tracker`). You can sign in, search and
filter containers, see a container's event timeline, add events, and ask questions in plain language
through the `/ask` endpoint.

## Run

Start the API first (`uvicorn app.main:app` in the backend repo, port 8000), then:

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # vitest + Testing Library
npm run build
```

Vite proxies `/auth`, `/containers`, `/vessels`, `/ask` to the API, so the browser uses one origin and CORS
is not needed. Use `VITE_API_TARGET=http://host:port npm run dev` for another API address.

## What is in it

- `src/api.ts` – small typed fetch client (bearer token, error messages from the API).
- Login / register, container list with search, status filter and paging.
- Container detail with timeline; the API's rule errors ("Cannot go from gate_in to booked") show in the UI.
- Chat panel that shows which tool answered each question.
- 5 tests (API client, chat component) and GitHub Actions CI (test + build).

## Next steps

- Docker Compose that runs API + web + Postgres together.
- Remember the login after refresh.
- Deploy the demo.
