## Database

- **Sequelize** maps the tables through the models in `models/`; `synchronize` is disabled, so the schema is owned by migrations.
- **Prisma** holds `database/prisma/schema.prisma` and the migration history.
- **SQL functions used by the API:** `search_songs_cosine_similarity` (recommendations) and `search_songs`, `search_artists`, `search_albums` (search).

### Migrations

```text
database/
├── prisma.config.ts                  # Prisma CLI config (loads backend/.env)
└── prisma/
    ├── schema.prisma                 # current schema
    └── migrations/
        ├── migration_lock.toml
        ├── 20261102000000_pgvector_extension/
        ├── 20261102000001_artists/   # 1:1 with the old Goose migrations
        ├── ...
        ├── 20261102000012_add_vectors/
        ├── 20261102000013_search_songs_cosine_similarity/
        ├── 20261102000014_search_extensions/
        ├── 20261105000000_search_artists_fill_limit/
        └── 20261105000001_search_albums_fill_limit/
```

`20261102000014_search_extensions` implements:

- `pg_trgm` for typo tolerance and substring matching, and `unaccent` so `mago de oz` finds `Mägo de Oz`.
- `public.immutable_unaccent(text)`, an `IMMUTABLE` wrapper around `unaccent()` so it can be used in indexes.
- GIN trigram indexes on `lower(immutable_unaccent(name))` for `songs`, `artists`, and `albums`. Queries must apply exactly that expression to use the indexes.
- `search_songs`, `search_artists`, and `search_albums`, which combine `ILIKE`/`LIKE` with `similarity()` and rank results as exact → prefix → contains → fuzzy, then by `similarity()`.

`20261105000000_search_artists_fill_limit` and `20261105000001_search_albums_fill_limit`
redefine `search_artists` and `search_albums` so they rank every row and apply
`LIMIT` at the end, instead of filtering with the `%` trigram operator (which
uses the 0.3 similarity threshold and could return fewer rows than requested).
`search_songs` still filters candidates with `LIKE`/`%` before ranking.

`prisma.config.ts` loads `backend/.env` because Prisma 7 no longer reads it automatically. For Aiven you may need to append `?sslmode=require` to the URL.

The API reads TLS settings for Sequelize from `DB_SSL` and `DB_SSL_CA` (see `backend/README.md`). The Docker demo database does not accept SSL, so leave `DB_SSL=false` there; for Aiven use `DB_SSL=true` and point `DB_SSL_CA` to the downloaded certificate (the repo keeps it at `backend/certs/ca.pem`).

### Demo data

`database/init/` contains a self-contained PostgreSQL snapshot for the Docker
demo. The official `postgres` image runs these files in name order the first
time the data directory is initialised:

```text
database/init/
├── 00_extensions.sql  # vector, pg_trgm and unaccent
├── 01_schema.sql      # tables, constraints, indexes, search functions and Prisma history
└── 02_seed.sql        # 100 songs with their artists, albums, genres and song_details
```

The schema mirrors the production database (including the `numeric(10,5)`
columns and the `vector(8)` column), not just the Prisma migration files. The
Prisma history is marked as applied so `db:deploy` does not try to recreate
existing tables. The seed is a fixed snapshot generated from production: do
not edit it by hand, and keep it in sync if the schema changes. It is intended
only for the demo, not for local development against real data.

### Changing the schema

Edit `schema.prisma`, create the migration locally with `db:migrate`, and review the generated SQL. Do not run `db:migrate` or `db:deploy` against a shared database without checking the SQL first; Prisma may propose destructive changes.