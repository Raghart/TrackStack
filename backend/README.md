# TrackStack — Backend

NestJS + GraphQL API for [TrackStack](../README.md). It serves the song catalogue, the recommendation engine, the AI streaming endpoint, and the production frontend build. See [docs/architecture.md](./docs/architecture.md) for the full schema reference and system design.

- **Framework:** NestJS 11 on Express 5.
- **API:** GraphQL code-first with Apollo Server 5 (`@nestjs/graphql`, schema generated in memory).
- **Realtime:** GraphQL subscriptions over WebSocket with `graphql-ws`.
- **Data:** Sequelize 6 over PostgreSQL, with `pgvector` for song embeddings.
- **Migrations:** Prisma 7 (`database/`).
- **AI:** Google GenAI (Gemini) for streamed recommendation messages.
- **Tests:** Vitest 5 + `unplugin-swc`.

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
├── database/                 # Prisma schema, migrations, and database notes
├── public/                   # generated frontend build served by Nest
├── dist/                     # compiled output
└── coverage/                 # generated test coverage
```

## Environment variables

Set up a `.env` file in `backend/` using these variable names:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DB_URL` | Yes | PostgreSQL connection string |
| `DB_PORT` | Yes | PostgreSQL port |
| `API_KEY` | Yes | Google GenAI API key |
| `AI_MODEL` | Yes | Gemini model name used for streamed messages |
| `LOCAL_PAGE_URL` | No | URL printed on startup |
| `LOCAL_GRAPHQL` | No | GraphQL URL printed on startup |

## Commands

From the repository root:

```bash
pnpm run dev:backend                 # NestJS in watch mode
pnpm run build:backend               # nest build -> backend/dist
pnpm run start:prod                  # run the compiled backend
pnpm run test:backend                # Vitest unit tests
```

Or target the package directly:

```bash
pnpm --filter ./backend run dev
pnpm --filter ./backend run build
pnpm --filter ./backend run lint
pnpm --filter ./backend run test
pnpm --filter ./backend run test:watch
pnpm --filter ./backend run test:cov
pnpm --filter ./backend run format
pnpm --filter ./backend run db:validate
pnpm --filter ./backend run db:status
pnpm --filter ./backend run db:migrate
pnpm --filter ./backend run db:generate
```

## Database & Migrations

Prisma-managed PostgreSQL schema with pgvector support and custom fuzzy-search
functions (trigram + unaccent). See [docs/database.md](./docs/database.md)
for migration structure and schema change guidelines.

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
