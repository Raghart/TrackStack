# TrackStack — Frontend

React single-page app for [TrackStack](../README.md). It provides the recommendation flow, the music player, and the browsing experience for songs, artists, albums, and genres.

- **React 19** + **TypeScript**.
- **Vite 6** for the dev server and production build.
- **Chakra UI 3** for the component system and responsive layout.
- **Apollo Client 3** for GraphQL queries and WebSocket subscriptions.
- **Redux Toolkit 2** for the player, search, and recommendation state.
- **React Router 7** for client-side routing.

## Project structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Landpage/                 # landing page, search bar, search results
│   │   ├── SongPath/                 # song details
│   │   ├── LaraRecommendationsPath/  # recommendation results and AI message
│   │   ├── GenrePath/GenreDetails/   # genre catalogue and genre songs
│   │   ├── ArtistPath/               # artist catalogue
│   │   ├── AlbumPath/DetailsPath/    # album catalogue and detail layout
│   │   ├── SongCard/                 # song cards and play overlay
│   │   ├── MainLayout/               # sidebar, top bar, player shell
│   │   ├── Pagination/               # pagination controls and helpers
│   │   ├── Utils/                    # hooks, formatting, vector helpers
│   │   ├── constants/                # labels, modal config, recommendation weights
│   │   └── ui/                       # Chakra wrappers (color mode, toaster, tooltip)
│   ├── queries/                      # GraphQL documents (gql)
│   ├── reducers/                     # Redux slices: songs, songData, search
│   ├── types/                        # client types
│   ├── dynamicCSS/                   # dynamic styles
│   ├── apolloClient.ts               # HTTP/WebSocket split link and cache policies
│   ├── store.ts                      # Redux store
│   ├── theme.ts                      # Chakra theme
│   └── App.tsx                       # route definitions
├── public/
└── vite.config.ts                    # build output -> ../backend/public
```

## Environment variables

Create `frontend/.env` with the backend GraphQL endpoints:

```bash
VITE_GRAPHQL_URI=http://localhost:3000/graphql
VITE_SUBSCRIPTION_URI=ws://localhost:3000/graphql
```

For a deployed environment, point both variables at the public backend URL (use `wss://` for the subscription). The backend must allow the frontend origin through `URL_DOMAIN` (CORS).

## Commands

From the repository root:

```bash
pnpm run dev:frontend       # Vite dev server
pnpm run build:frontend     # tsc -b + vite build -> backend/public
```

Or inside the package:

```bash
pnpm --filter ./frontend run dev
pnpm --filter ./frontend run build
pnpm --filter ./frontend run lint
pnpm --filter ./frontend run preview
```

The production build is written to `../backend/public` and served by NestJS next to the GraphQL API.

## Architecture

See [docs/architecture.md](./docs/architecture.md) for routing, how the recommendation vector is built, and the GraphQL/Redux data layer.

## Tests

There is no frontend unit-test suite yet. End-to-end coverage lives in the separate Playwright package [`../e2e`](../e2e), which exercises the landing page, search, songs, artists, genres, and the recommendation modal in Chromium, Firefox, and WebKit.

```bash
cd e2e
npm ci
npm run test
npm run test:report
```

The E2E suite expects the built app at `http://localhost:3000` (override with `E2ETEST_URL`) and needs a running backend and database.

## Features

From AI-powered recommendations to browsing by artist, genre, or album — see [docs/features.md](./docs/features.md) for the full walkthrough with screenshots.

---

[← Back to the project README](../README.md) · [Backend README →](../backend/README.md)
