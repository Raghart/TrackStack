# Backend — Architecture

The TrackStack backend is a NestJS 11 service (Express 5) that exposes a GraphQL API with Apollo Server in code-first mode: the schema is generated in memory from decorated resolvers and DTOs, so it stays in sync with the TypeScript types instead of being maintained in a separate `.graphql` file. Resolvers stay thin, services own the business logic, and PostgreSQL does the heavy work — vector ranking, pagination, and trigram search — rather than loading the catalog into the application.

## How it works

```text
frontend ──HTTP──▶ /graphql ──▶ resolver ──▶ service ──▶ Sequelize ──▶ PostgreSQL
    │                              │
    └──WebSocket──▶ subscription ──┴──▶ Google GenAI (streaming)
```

Each domain (`songs`, `albums`, `artists`, `genres`, `song_artists`, `song_genres`, `song_details`, `search`) follows the same shape: a thin resolver receives the GraphQL arguments, the service owns the business logic and data access, and the DTOs declare the public GraphQL contract. Inputs and database rows are validated with the Zod schemas from the `schemas` workspace, so every object has the expected shape. Database queries are wrapped in `safeQuery`, which turns driver and connection failures into a consistent error (see [Design decisions](#safequery-wraps-every-database-call)).

## Recommendation flow

Recommendations combine two complementary layers: a deterministic one, where the database ranks the catalog by cosine distance against the user's preference vector, and a generative one, where Gemini explains and enriches the selection over a streaming subscription. Both are fed by the same 8-value vector, so the songs the user sees and the text the AI produces describe the same musical profile.

1. The frontend turns the user's sliders and switches into an 8-value vector: `danceability`, `energy`, `mode`, `speechiness`, `acousticness`, `instrumentalness`, `valence`, and `tempo`.
2. `getSongRecommendations(genres, userVector, limit)` calls the PostgreSQL function to obtain the songs, which ranks songs by cosine distance.
3. In parallel, `aiResponse(genres, userVector)` opens a Gemini stream and yields each chunk as a GraphQL subscription event, so the message appears progressively in the UI.

## Search system

Search runs entirely in PostgreSQL, with no external search engine. Results are ranked exact → prefix → contains → fuzzy, with `similarity()` as a tie-breaker.

`SearchService` (`src/search`) calls those functions through `sequelize.query` with bound `query` and `limit` replacements, validates the rows (see [Shared validation](#shared-validation)), and tags each result with its `type` (`song`, `artist`, or `album`).

## Design decisions

### Search & similarity systems in PostgreSQL

`pg_trgm`, `unaccent`, GIN trigram indexes, and `pgvector` cover the needs of a catalog of roughly 50,000 songs. Keeping search and vector ranking in the same database removes a second system to deploy, an index to keep in sync with writes, and a network hop between the data and the ranking. The filtering by genre and the cosine ordering happen in a single SQL statement, close to the rows.

The trade-off is that this ties the project to PostgreSQL features. If the catalog or query volume grows far beyond what a single database handles comfortably, an external search engine would earn its operational cost.

### Prisma migrates, Sequelize queries

Prisma owns the schema and the migration history in `database/`; Sequelize, configured through `@nestjs/sequelize`, is what the services actually use at runtime. This keeps a reviewable migration trail (including the SQL functions) without rewriting the data access layer and its models. The Prisma client is not imported by the application.

The cost is a schema declared twice — `schema.prisma` and the Sequelize models in `models/` — which must be kept aligned by hand. A structural change therefore needs both edits plus the migration.

### The Docker demo is seeded with SQL, not Prisma

Prisma migrations are the source of truth for the schema; `database/init/*.sql` exists only to bootstrap the local Docker demo. The SQL files also have to carry what Prisma cannot express directly: the `vector(8)` literals, the `immutable_unaccent` wrapper, and the `search_*` functions. Keeping the snapshot declarative and self-contained makes the demo deterministic and lets the integration tests load the exact same files against an isolated instance (see [Demo data](database.md#demo-data)).

Unifying the seed into Prisma would mean orchestrating `prisma db seed` after the database is healthy but before the backend starts, which adds an application-runtime dependency to the bootstrap and a second way to recreate the demo. 

The cost is duplication: `01_schema.sql` mirrors `schema.prisma` and must be updated by hand when the schema changes, as noted in [Changing the schema](database.md#changing-the-schema). That drift is contained because the files are demo-only, the production path is still the Prisma migration history (which `01_schema.sql` marks as already applied), and the integration suite fails when schema and seed disagree.

### `safeQuery` wraps every database call

`safeQuery` (`src/utils/safeQuery.ts`) wraps a query in `try/catch` and rethrows any driver or connection failure as a Nest `InternalServerErrorException`. This separates infrastructure failures from domain errors (`BadRequestException`, `NotFoundException`, invalid pagination), gives the client a consistent GraphQL error instead of leaking driver internals, and keeps the original message available for debugging. It only wraps the database boundary, so validation and parsing errors keep their own status.

The trade-off is discipline: every new query must go through the wrapper to get this behaviour. The original message is preserved, but the original stack trace is not. It is intentionally a thin helper, not a retry or transaction manager.

## Shared validation

Response parsing uses the Zod schemas in `@trackstack/schemas`: the services validate database rows before returning them. Besides trimming and numeric bounds, the contracts enforce security-sensitive formats — every `url_preview`, `album_cover`, and `url_image` must be an absolute `http:` or `https:` URL, and `spotify_id` must be a 22-character alphanumeric Spotify ID. Values such as `javascript:` or `data:` URLs are rejected before they can reach the client. See `schemas/zod.schemas.ts` and its spec for the primitives (`httpUrlSchema`, `spotifyIdSchema`).

## GraphQL API

The schema is generated at runtime. When `NODE_ENV` is not `production`, open `http://localhost:3000/graphql` for the Apollo playground.

### Queries

| Query | Arguments | Returns |
| --- | --- | --- |
| `getDBLength` | — | Song count |
| `getLandpageSongs` | `limit = 20` | Random songs for the landing page |
| `getSongData` | `SongID` | Full song details (album, artists, genres, Spotify id) |
| `getRandomSong` | — | A random song |
| `getNextSong` | `songID` | Next song by id |
| `getPreviousSong` | `songID` | Previous song by id |
| `getSongRecommendations` | `genres`, `userVector`, `limit = 40` | Songs ordered by vector similarity |
| `getAllArtists` | `seed`, `page = 1`, `limit = 20` | Paginated artists |
| `getAllArtistSongs` | `artist` | Songs by artist |
| `getAlbums` | `seed`, `page = 1`, `limit = 20` | Paginated albums |
| `getAllAlbumSongs` | `album` | Songs in an album |
| `getAllGenres` | — | All genre names |
| `getAllGenreSongs` | `seed`, `genre`, `page = 1`, `limit = 20` | Songs in a genre |
| `multipleSearch` | `query` | Exact match plus remaining results for songs, artists, and albums |
| `artistSearch` | `query` | Artists ranked by exact/prefix/contains/fuzzy match |
| `albumsSearch` | `query` | Albums ranked by exact/prefix/contains/fuzzy match |
| `songsSearch` | `query` | Songs ranked by exact/prefix/contains/fuzzy match |

### Subscription

| Subscription | Arguments | Emits |
| --- | --- | --- |
| `aiResponse` | `genres`, `userVector` | Markdown chunks generated by Gemini |