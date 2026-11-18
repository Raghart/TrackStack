## Testing

The frontend uses **Vitest 5**, **Testing Library** and **jsdom**. The configuration lives in [`vitest.config.ts`](../vitest.config.ts) and the shared setup (jest-dom matchers) in [`src/test/setup.ts`](../src/test/setup.ts).

Specs live next to the code they cover (`src/**/*.test.ts(x)`). Shared fixtures, mocks and render helpers live in `src/test/`, grouped by feature or hook. Tests do not need a running backend, PostgreSQL, WebSocket or `frontend/.env`: GraphQL operations, Apollo hooks and environment variables are mocked.

### What the suite covers

- **Apollo cache policies** (`src/apolloClient.test.ts`): pagination `merge` policies for `getAllArtists`, `getAlbums` and `getAllGenreSongs` — first page, append, refresh/replace, stale entries, shorter last page, offset calculation, ignored seeds and per-genre isolation.
- **GraphQL data hooks** (`src/components/Utils/hooks/`): search with debounce and request supersession, recommendations, song details, detail-song pagination, artist/album/genre catalogues, song cover, random/next/previous song and AI streaming.
- **Player and audio state** (`useSongState`, `useAudioData`): source switching, play/pause, `canplay` listeners, animation-frame progress, seeking, clamping and cleanup on unmount.
- **Payload validation**: empty, null and invalid responses; rejected lists when one item is invalid; extra fields stripped; numeric IDs coerced; results kept referentially stable across re-renders.
- **User-facing errors and Toaster notifications**: failed queries and subscriptions notify once per failure, stay deduplicated across retries and re-renders, notify again after a successful request or a new failure, and ignore stale responses from superseded requests. Subscription errors are also exposed as state so the UI can render a fallback instead of loading forever.

The notification suites mock `@/components/ui/toasterInstance`, so they assert the user-facing message without depending on Chakra portals. See `useSearchResults.test.tsx`, `useLoadRecommendations.test.tsx`, `useGetSongCover.test.ts` and `useAIStream.test.tsx`.

### Commands

```bash
pnpm run test:frontend                         # from the repository root
pnpm --filter ./frontend run test              # one run
pnpm --filter ./frontend run test:cov          # coverage -> frontend/coverage/

# Run a specific spec
pnpm --filter ./frontend run test -- src/components/Utils/hooks/useSearchResults.test.tsx
```

Coverage includes `src/**/*.{ts,tsx}` and excludes `src/test/**`, `main.tsx` and `.d.ts` files. There is no coverage threshold configured.

The Playwright end-to-end suite is separate (see [`e2e/`](../../e2e)) and does need a built app, a running backend and PostgreSQL.
