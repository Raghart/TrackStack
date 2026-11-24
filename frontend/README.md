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
│   │   ├── Error/                    # global error boundary and not-found message
│   │   ├── Pagination/               # pagination controls and helpers
│   │   ├── constants/                # labels, modal config, recommendation weights
│   │   └── ui/                       # Chakra wrappers (color mode, toaster, tooltip)
│   ├── hooks/                        # reusable and page data hooks
│   ├── Utils/                        # formatting, parsing, vector and shared helpers
│   ├── queries/                      # GraphQL documents (gql)
│   ├── reducers/                     # Redux slices: songs, songData, search
│   ├── types/                        # client types
│   ├── test/                         # Vitest setup (jsdom + jest-dom)
│   ├── dynamicCSS/                   # dynamic styles
│   ├── apolloClient.ts               # HTTP/WebSocket split link and cache policies
│   ├── store.ts                      # Redux store
│   ├── theme.ts                      # Chakra theme
│   └── App.tsx                       # route definitions
├── public/
├── vitest.config.ts                  # Vitest + Testing Library (jsdom)
└── vite.config.ts                    # build output -> ../backend/public
```

## Environment variables

Create `frontend/.env` with the backend GraphQL endpoints:

```bash
VITE_GRAPHQL_URI=http://localhost:3000/graphql
VITE_SUBSCRIPTION_URI=ws://localhost:3000/graphql
```

For a deployed environment, point both variables at the public backend URL (use `wss://` for the subscription). The backend must allow the frontend origin through `FRONTEND_URL` (CORS).

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

## Tests

Unit tests use **Vitest** with **Testing Library** and **jsdom**. They cover the GraphQL data hooks, the Apollo pagination policies, the player/audio state and the user-facing error notifications (including Toaster messages and their deduplication). No backend or `frontend/.env` is needed for testing: GraphQL, Apollo and the environment are mocked.

See [docs/testing.md](./docs/testing.md) for the coverage map, fixtures and conventions.

```bash
pnpm run test:frontend                         # from the repository root
pnpm --filter ./frontend run test              # one run
pnpm --filter ./frontend run test:cov          # coverage -> frontend/coverage/
```

```bash
pnpm run test:e2e                              # from the repository root
pnpm --filter ./e2e run test                   # one run
pnpm run test:e2e:report                       # open the HTML report
pnpm --filter ./e2e exec playwright install    # install browsers once
```

The E2E suite expects the built app at `http://localhost:3000` (override with `E2ETEST_URL`) and needs a running backend and database.

## Docker

The frontend has a standalone image that serves the Vite build with **Nginx** (SPA fallback included). The build context is the repository root because the pnpm workspace and `schemas/` live there:

```bash
docker build -f frontend/Dockerfile -t trackstack-frontend .
docker run --rm -p 8080:80 trackstack-frontend
```

The app is available at `http://localhost:8080`. By default the image expects the backend at `http://localhost:3000`, matching `frontend/.env`; the backend must allow `http://localhost:8080` through CORS (`FRONTEND_URL`).

Vite bakes `VITE_GRAPHQL_URI` and `VITE_SUBSCRIPTION_URI` at build time, so override them as build args when the API lives somewhere else:

```bash
docker build -f frontend/Dockerfile \
  --build-arg VITE_GRAPHQL_URI=https://api.example.com/graphql \
  --build-arg VITE_SUBSCRIPTION_URI=wss://api.example.com/graphql \
  -t trackstack-frontend .
```

Inside the image the bundle is written to `frontend/dist` (not `../backend/public`) and copied to Nginx's web root. Nginx configuration: [`nginx.conf`](./nginx.conf).

## Architecture

See [docs/architecture.md](./docs/architecture.md) for routing, how the recommendation vector is built, and the GraphQL/Redux data layer.

## Features

From AI-powered recommendations to browsing by artist, genre, or album — see [docs/features.md](./docs/features.md) for the full walkthrough with screenshots.

---

[← Back to the project README](../README.md) · [Backend README →](../backend/README.md)
