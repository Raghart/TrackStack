## Architecture

### Routes

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

### How the recommendation vector is built

`components/Utils/generateUserVector.ts` normalizes each slider with min-max scaling and multiplies it by the weights in `components/constants/WeightData.ts`:

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

### Data layer

- `src/queries/` contains every GraphQL document. There is one file per feature: details, landing page, recommendations, multiple search, and player.
- `apolloClient.ts` splits operations by type: queries go through `HttpLink`, subscriptions go through `GraphQLWsLink`.
- The Apollo cache defines `merge` policies for `getAllGenreSongs`, `getAllArtists`, and `getAlbums`, which lets the infinite-scroll lists append pages instead of replacing them.
- Redux Toolkit stores three slices: `songs` (active track and playback state), `songData` (recommendation inputs and results), and `search` (query and results).
- Page-specific data fetching lives in custom hooks under `components/Utils/hooks/`.