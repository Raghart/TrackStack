# TrackStack — Backend

NestJS + GraphQL API for [TrackStack](../README.md). It serves the song catalogue, the recommendation engine, the AI streaming endpoint, and the production frontend build. See [docs/architecture.md](./docs/architecture.md) for the full schema reference and system design.

- **Framework:** NestJS 11 on Express 5.
- **API:** GraphQL code-first with Apollo Server 5 (`@nestjs/graphql`, schema generated in memory).
- **Realtime:** GraphQL subscriptions over WebSocket with `graphql-ws`.
- **Data:** Sequelize 6 over PostgreSQL, with `pgvector` for song embeddings.
- **Migrations:** Prisma 7 (`database/`).
- **AI:** Google GenAI (Gemini) for streamed recommendation messages.
- **Tests:** Vitest + `unplugin-swc`.

## Project structure

```text
backend/
├── src/
│   ├── <domain>/             # module + resolver + service + specs
│   │   └── dto/              # @ObjectType / @Field GraphQL types
│   ├── search/               # multipleSearch resolver/service and SQL search helpers
│   ├── types/                # attribute types, guards, parsers, shared types
│   ├── utils/                # safeQuery, pagination, ranking helpers
│   ├── app.module.ts         # Sequelize, GraphQL, ServeStatic wiring
│   └── main.ts               # bootstrap, CORS, port
├── models/<domain>/          # Sequelize models
├── test/                     # fixtures and shared constants for unit tests
├── database/                 # Prisma schema/migrations and init/ demo seed
├── public/                   # generated frontend build served by Nest
├── dist/                     # compiled output
└── coverage/                 # generated test coverage
```

## Environment variables

Set up a `.env` file in `backend/` using these variable names:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DB_URL` | Yes | PostgreSQL connection string |
| `DB_SSL` | No | Enables TLS for PostgreSQL (`true`/`false`, defaults to `false`). Keep it `false` for the Docker demo database. |
| `DB_SSL_CA` | No | Path to the CA certificate used when `DB_SSL=true` (for example `certs/ca.pem` for Aiven). Relative paths are resolved from the backend directory. |
| `API_KEY` | No | Google GenAI API key (AI messages fall back to a demo notice when missing) |
| `AI_MODEL` | No | Gemini model name used for streamed messages (Used together with API_KEY) |
| `PORT` | No | HTTP port (defaults to `3000`) |
| `FRONTEND_URL` | No | Allowed CORS origin for the frontend |

Check out an example on how to setup the [.env](.env.example) file.

## Commands

From the repository root:

```bash
pnpm run dev:backend                 # NestJS in watch mode
pnpm run build:backend               # nest build -> backend/dist
pnpm run start:prod                  # run the compiled backend
pnpm run test:backend                # Vitest unit tests
```

Or target the package directly. The scripts are grouped by purpose:

```bash
# Development
pnpm --filter ./backend run dev          # Nest in watch mode (same as dev:backend)
pnpm --filter ./backend run build        # nest build -> backend/dist
pnpm --filter ./backend run start:prod   # run the compiled build (needs DB_URL)
pnpm --filter ./backend run lint         # ESLint over src, test, apps and libs
pnpm --filter ./backend run format       # Prettier over src/ and test/

# Tests
pnpm --filter ./backend run test         # Vitest unit suite (no database needed)
pnpm --filter ./backend run test:watch   # Vitest in watch mode
pnpm --filter ./backend run test:cov     # suite + coverage -> backend/coverage/

# Database (Prisma, reads backend/.env)
pnpm --filter ./backend run db:validate  # validate schema.prisma without connecting
pnpm --filter ./backend run db:status    # list applied and pending migrations
pnpm --filter ./backend run db:migrate   # local only: create and apply migrations (prisma migrate dev)
pnpm --filter ./backend run db:generate  # regenerate the Prisma client after editing schema.prisma
pnpm --filter ./backend run db:deploy    # apply committed migrations to an existing DB (CI/production)
```

## Quick start

### Local setup

Prerequisites: Node.js, pnpm, and PostgreSQL 17 with the `pgvector` extension available (the `pgvector/pgvector:pg17` image works). The migrations create the `vector`, `pg_trgm` and `unaccent` extensions, so the role in `DB_URL` needs permission to install them.

```bash
pnpm install
cp backend/.env.example backend/.env     # set DB_URL and keep DB_SSL=false
createdb trackstack                      # or: psql -c 'CREATE DATABASE trackstack;'
```

Then apply the schema and start the API:

```bash
pnpm --filter ./backend run db:migrate   # applies database/prisma/migrations in order
pnpm run dev:backend                     # GraphQL at http://localhost:3000/graphql
```

To load the demo catalogue (100 songs) into that database after migrating:

```bash
psql "postgres://user:password@localhost:5432/trackstack" -f backend/database/init/02_seed.sql
```

Only the seed file should be applied: `00_extensions.sql` and `01_schema.sql` are the Docker snapshot, and the migrations already create the schema and the Prisma history.

### Docker

The backend has a standalone Docker image. The build context is the repository root because the pnpm workspace and `schemas/` live there:

```bash
docker build -f backend/Dockerfile -t trackstack-backend .
docker run --rm -p 3000:3000 \
  -e DB_URL=postgres://user:password@host:5432/trackstack \
  -e DB_SSL=false \
  trackstack-backend
```

The image runs as the non-root `node` user, listens on port 3000 and reads the same environment variables as `start:prod`. It only contains the backend (the GraphQL endpoint is served at `/graphql`); a database with the schema applied is still required (the demo snapshot in `database/init/` needs the `pgvector` extension).

## Database & Migrations

Prisma-managed PostgreSQL schema with pgvector support. Search is implemented entirely in PostgreSQL through the `search_songs`, `search_artists`, and `search_albums` functions (trigram + unaccent, exact → prefix → contains → fuzzy ranking); `SearchService` calls them with Sequelize and validates the rows with the shared Zod schemas. See [docs/database.md](./docs/database.md) for migration structure and schema change guidelines.

## Tests

Unit tests live next to the code (`src/<domain>/*.spec.ts`) and do not need PostgreSQL: models are mocked and the AI provider is replaced with a stub. Fixtures live in `test/data/` and shared assertions in `src/utils/expect*.ts`.

```bash
pnpm --filter ./backend run test -- src/songs/songs.service.spec.ts   # one spec
pnpm --filter ./backend run test:cov                                  # full suite + coverage
```

<p align="center">
    <img src="../assets/coverage.png" alt="Backend test coverage" />
</p>

## Production

`pnpm run build:frontend` writes the SPA into `backend/public`, and the backend serves it with `ServeStaticModule`. Deploying therefore means building both packages and running the compiled backend with the environment variables above. GitHub Actions runs lint, the security ESLint pass, and the unit tests on every pull request; the CD workflow triggers a Render deployment on `main`.

---

[← Back to the project README](../README.md) · [Frontend README →](../frontend/README.md)
