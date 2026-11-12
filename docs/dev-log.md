# Dev log

Small daily notes on the container-tracker web client.

- 2026-11-05: reviewed the API client types and test setup.
- 2026-11-05: idea: add a Login.tsx test covering the empty-credentials validation path.
- 2026-11-05: note: ContainerList could show an empty-state message when the API returns no containers.
- 2026-11-06: note: API error responses could be normalized into a single ApiError type so components share one error-handling path.
- 2026-11-07: note: vite.config.ts could proxy /api to the backend in dev so the client can use relative URLs and avoid CORS setup.
- 2026-11-08: note: the container list view could persist its search/filter text in the URL query string so a filtered view can be bookmarked or shared.
- 2026-11-09: note: package.json could add a "typecheck" script (tsc -b --noEmit) so type errors can be checked in CI separately from the Vite build.
- 2026-11-10: note: ContainerDetail's load() could ignore stale responses (cancel flag in the effect) so a slow request for a previous container number can't overwrite the current one.
- 2026-11-11: note: the README could list the available npm scripts (dev, build, preview) in a short table so new contributors find them quickly.
- 2026-11-12: note: the Login form could disable its submit button while the request is in flight to prevent duplicate login attempts on double-click.
