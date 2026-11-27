# Backend — Database

Sequelize maps the tables through the models in `models/` with `synchronize` disabled, so the schema is owned by Prisma: `database/prisma/schema.prisma` describes the current schema and `database/prisma/migrations/` holds its history. The API also depends on SQL functions created by those migrations:

- `search_songs_cosine_similarity` for recommendations.
- `search_songs`, `search_artists`, `search_albums` for search.

## Migrations

The migrations are the only way the schema changes: each folder in `database/prisma/migrations/` is a versioned step containing a `migration.sql`, and Prisma applies them in folder-name (timestamp) order while recording what has run in the `_prisma_migrations` table. The first migrations implement the database schema, and the later ones add the vectors (`pgvector`), the search extensions and SQL functions (`pg_trgm`, `unaccent`, `search_songs*`). Never edit or delete a migration that is already applied: add a new one that corrects it.

```text
database/
├── prisma.config.ts                  # Prisma CLI config (loads backend/.env)
└── prisma/
    ├── schema.prisma                 # current schema
    └── migrations/
        ├── migration_lock.toml
        ├── 20261102000000_pgvector_extension/
        ├── 20261102000001_artists/   # initial schema migrations
        └── ...
```

## TLS / SSL

The managed PostgreSQL instance (Aiven) only accepts encrypted connections and presents a certificate signed by its own CA, so the backend must verify that certificate instead of trusting the system store. The connection settings are built in `src/utils/databaseSsl.ts` and plugged into Sequelize in `src/app.module.ts` through `dialectOptions.ssl`.

| Variable | Effect |
| --- | --- |
| `DB_SSL` | Turns TLS on. Accepted truthy values: `true`, `1`, `yes`, `on` (case-insensitive). Anything else, or unset, leaves TLS off. |
| `DB_SSL_CA` | Path to the CA certificate (PEM) used to verify the server. Relative paths are resolved from the backend directory. For example, certs/ca.pem works both in dev and in the Docker image. |

The Docker demo uses `DB_SSL=false` (see `docker-compose.yml` and [.env.example](../.env.example)). The committed `certs/ca.pem` is the project CA certificate only: it contains no private key and cannot be used to authenticate, which is why it is safe to keep in the repository. If the provider rotates or reissues the CA, download the new file and replace it.

## Changing the schema

1. Edit `schema.prisma`.
2. Create the migration locally with `db:migrate`.
3. Review the generated SQL in the new migration folder.
4. Update the matching Sequelize model in `models/`.
5. Run the tests and try the change locally.
6. Commit `schema.prisma`, the new migration folder, and the model changes together.
7. If the Docker demo must reflect the change, update 01_schema.sql (and 02_seed.sql if the data is affected).

Do not run `db:migrate` or `db:deploy` against a shared database without checking the SQL first; Prisma may propose destructive changes.

## Demo data

`database/init/` contains a self-contained PostgreSQL snapshot for the Docker demo. The official `postgres` image runs these files in name order the first time the data directory is initialized:

```text
database/init/
├── 00_extensions.sql  # vector, pg_trgm and unaccent
├── 01_schema.sql      # tables, constraints, indexes, search functions and Prisma history
└── 02_seed.sql        # 100 songs with their artists, albums, genres and song_details
```

The schema mirrors the production database (including the `numeric(10,5)` columns and the `vector(8)` column), not just the Prisma migration files. The Prisma history is marked as applied so `db:deploy` does not try to recreate existing tables. 

The seed is a fixed snapshot generated from production: do not edit it by hand, and keep it in sync if the schema changes. `test/integration/database.integration.spec.ts` loads this snapshot through Docker in an isolated PostgreSQL instance to confirm that the extensions, tables and PostgreSQL functions (`search_songs`, `search_artists`, `search_albums`, `search_songs_cosine_similarity`) work as expected against real demo data. If the schema or the seed changes without updating these files, the integration tests will fail or stop reflecting the real behaviour.