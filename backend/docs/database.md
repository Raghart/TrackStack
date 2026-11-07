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

### Changing the schema

Edit `schema.prisma`, create the migration locally with `db:migrate`, and review the generated SQL. Do not run `db:migrate` or `db:deploy` against a shared database without checking the SQL first; Prisma may propose destructive changes.