# Dev log

Small daily notes on the container-tracker web client.

- 2026-11-05: reviewed the API client types and test setup.
- 2026-11-05: idea: add a Login.tsx test covering the empty-credentials validation path.
- 2026-11-05: note: ContainerList could show an empty-state message when the API returns no containers.
- 2026-11-06: note: API error responses could be normalized into a single ApiError type so components share one error-handling path.
- 2026-11-07: note: vite.config.ts could proxy /api to the backend in dev so the client can use relative URLs and avoid CORS setup.
