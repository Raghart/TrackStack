# Frontend — Architecture

The TrackStack frontend is a React 19 single-page application built with Vite and TypeScript. A single Apollo Client talks to the NestJS backend: queries go over HTTP, subscriptions over WebSocket, same /graphql endpoint.

```text
                    ┌──▶ HTTP ──────────▶ queries ──────────────┐
Apollo Client ──────┤                                            ├──▶ /graphql
(split link)        └──▶ WebSocket ─────▶ subscriptions ────────┘
                         (graphql-ws)
```

Chakra UI renders the interface, Redux Toolkit holds the state that belongs to the user (active track, recommendation inputs, search status), and React Router maps each URL to a feature component. In production the backend serves the compiled build from `backend/public`, so the SPA and the API share an origin.

The sections below describe the route map, the recommendation vector, and the data and error-handling layers.

## Routes

| Route | Page |
| --- | --- |
| `/` | Landing page with a random song selection |
| `/songs/:songId` | Song details |
| `/recommendations` | Recommendation results and streamed AI message |
| `/artists` | Artist catalogue |
| `/artists/:artist` | Songs by artist |
| `/albums` | Album catalogue |
| `/albums/:album` | Songs in an album |
| `/genres` | Genre catalogue |
| `/genres/:genre` | Songs in a genre |
| `*` | Redirect to `/` |

`MainLayout` keeps the sidebar, search bar, and music player mounted across routes. When the search query is non-empty, it renders the search results instead of the routed page.

## Design decisions

### Apollo owns server state, Redux owns client state

The two libraries split the work by the lifetime of the data. Apollo keeps the normalized cache of entities and paginated lists, so a song fetched on one page is reused elsewhere and the infinite-scroll lists merge new pages into the existing one. Redux keeps the state that outlives a query and is not a copy of a server object: the active track and playback flag (`songReducer`), the recommendation sliders and selected genres (`recommendReducer`), and the search query plus its status (`searchReducer`).

The trade-off is two stores to reason about; the gain is that navigation and playback survive query teardown, and no global state library has to reimplement the normalized cache. The flip side is discipline: data that changes on the server but lives in Redux must be refreshed explicitly.

### Feature folders with hooks as the data boundary

Components are grouped by feature/route, not by file type, and data fetching is pushed into hooks. A page component reads a hook, renders its `loading`/`error`/empty state, and stays easy to test as plain UI. Hooks are the only place that calls `useQuery`/`useLazyQuery`/`useSubscription`, validates the result, and decides what goes to Redux or local state.

The trade-off is indirection: a feature change often touches a component, its hook, and its query document, and some hooks are page-specific rather than reusable. In exchange, the Apollo logic is testable in isolation and components do not depend on GraphQL shapes. There is no server-state framework (React Query, router loaders) or `createAsyncThunk`: this is a deliberate, small-surface choice that suits the catalog's straightforward fetch-on-mount and infinite-scroll patterns.

### Validate every payload at the client boundary

Every GraphQL response is parsed with the Zod schemas from `@trackstack/schemas` through `parseDataOrUndefined`/`parseArrayOrEmpty` (`src/Utils/safeParse.ts`) before it is stored in Redux or rendered. The same schemas the backend uses to validate its rows also enforce URL formats and Spotify ids on the client, so a malformed or unexpected payload becomes a controlled `undefined`/`[]` plus an explicit UI state, not a crash inside a component.

The trade-off is runtime overhead and boilerplate on every fetch, and an extra place to keep in sync with the contract. Sharing the schemas in a workspace package keeps that from turning into duplicate definitions, but adding a field still means touching the schema. The alternative — trusting TypeScript types that are erased at runtime — would leave the client exposed to the very payloads the backend is trying to guard against.

```text
route ──▶ page component ──▶ hook (src/hooks) ──▶ Apollo Client ──▶ /graphql
              │                    │                    │
              │                    ├──▶ Redux slice     └──▶ WebSocket (subscriptions)
              │                    └──▶ Zod schemas (@trackstack/schemas)
              └──▶ UI (Chakra)
```

### Stream the AI answer over a WebSocket subscription

The recommendation page does not poll for the AI text. `useAIStream` opens an `aiResponse` subscription, appends each validated chunk to local state, and resubscribes when the genres or the user vector change. The text appears progressively and the connection is closed when the component unmounts.

The trade-off is operational: subscriptions need a second URL (`VITE_SUBSCRIPTION_URI`), a `graphql-ws` client, and explicit error handling, because a dropped socket would otherwise leave the page waiting forever (see the `error` state returned by the hook). Queries, by contrast, need only HTTP. Keeping both behind one Apollo Client and a `split` link hides most of that complexity, at the cost of a single client that reads environment variables at import time and must be mocked in tests.

## How the recommendation vector is built

`Utils/generateUserVector.ts` normalizes each slider with min-max scaling and multiplies it by the weights in `components/constants/WeightData.ts`:

| Feature | Weight |
| --- | --- |
| Energy | `1.5` |
| Tempo | `1.2` |
| Sentiment (valence) | `1.2` |
| Danceability | `1` |
| Mood (mode) | `1` |
| Speechiness | `0.8` / `1.2` depending on the voice setting |
| Acousticness | `0.7` / `1.5` depending on the acoustic setting |
| Instrumentalness | `0.8` / `1.3` depending on the voice type |

The resulting 8-value array is sent to `getSongRecommendations` and also passed to the `aiResponse` subscription, so the songs and the AI message describe the same preferences.

## Data layer

- `src/queries/` contains every GraphQL document. There is one file per feature: details, landing page, recommendations, multiple search, and player.
- `apolloClient.ts` splits operations by type: queries go through `HttpLink`, subscriptions go through `GraphQLWsLink`.
- The Apollo cache defines `merge` policies for `getAllGenreSongs`, `getAllArtists`, and `getAlbums`, which lets the infinite-scroll lists append pages instead of replacing them.
- Redux Toolkit stores three slices: `songs` (active track and playback state), `songData` (recommendation inputs and results), and `search` (query and results). The search slice keeps a `status` (`idle`, `loading`, `success`, `empty`, `network-error` or `invalid-payload`) so an empty result set and a failed request render different states.
- Page-specific data fetching lives in custom hooks under `src/hooks/`.

## Error handling

`Utils/getGraphLink.ts` builds the `graphql-ws` client with its defaults (no explicit retry options), so a dropped connection is retried automatically a few times before the failure reaches Apollo. Queries are unaffected: they travel over HTTP through the same `split` link. Non-subscription errors are only logged by the `errorLink` in `getGraphLink.ts`; their UI state is handled per hook.

If the `aiResponse` subscription still fails, `useAIStream` stores the error in its `error` state and shows one Chakra toast ("We couldn't get Lara's recommendations…"). `AIResponse` then replaces the loading spinner with a short fallback message instead of waiting forever. The toast is deduplicated with a ref, so repeated errors from the same failed subscription do not stack; the flag resets when a valid chunk arrives or when the genres/user vector change (which also resets the state and resubscribes), so a new failure notifies again.

`components/Error/ErrorBoundary.tsx` wraps `<App />` in `main.tsx` as a last-resort guard, so an unhandled render error shows a fallback instead of a blank page. A second boundary inside `MainLayout` surrounds only the routed content (and the search results): if a page fails, the sidebar, search bar, and player stay usable, and the boundary resets automatically when the route changes. Page-specific "not found" and empty states are still handled by `components/Error/NotFound.tsx`.