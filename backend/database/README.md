# Base de datos — Prisma

Esta carpeta contiene el esquema y el historial de migraciones de Prisma.

## Estructura

```text
database/
├── prisma.config.ts                         # configuración de Prisma CLI
└── prisma/
    ├── schema.prisma                        # estado final del esquema
    └── migrations/
        ├── migration_lock.toml
        ├── 20261102000000_pgvector_extension/
        ├── 20261102000001_artists/          # 1:1 con Goose 001_artists.sql
        ├── ...
        ├── 20261102000012_add_vectors/      # 1:1 con Goose 012_add_vectors.sql
        ├── 20261102000013_search_songs_cosine_similarity/
        └── 20261102000014_search_extensions/
```

Las 12 migraciones de Goose se copiaron en el mismo orden y sin cambios (solo se
eliminaron las marcas `-- +goose Up/Down`; Prisma no usa `Down`). Además se añadió
la extensión `pgvector` antes de `012_add_vectors` y la función
`search_songs_cosine_similarity` al final, que en Goose se aplicaban aparte.

## Búsqueda PostgreSQL-only

La migración `20261102000014_search_extensions` añade, sin tocar tablas ni datos:

- Extensiones `pg_trgm` (tolerancia a typos y subcadenas) y `unaccent`
  (`mago de oz` encuentra `Mägo de Oz`).
- `public.immutable_unaccent(text)`: envoltura `IMMUTABLE` de `unaccent()` para
  poder usarla en índices. Si cambia el diccionario de `unaccent`, hay que
  recrear los índices.
- Índices GIN de trigramas sobre `lower(immutable_unaccent(name))` en `songs`,
  `artists` y `albums`. Para que se usen, las consultas deben aplicar exactamente
  esa expresión.
- Funciones `search_songs`, `search_artists` y `search_albums`, que combinan
  `ILIKE`/`LIKE` con `similarity()` y un ranking `CASE`:
  `0` exacto → `1` prefijo → `2` contiene → `3` fuzzy. A igual rank, mayor
  `similarity()` primero.

## Conexión

El `prisma.config.ts` carga `backend/.env` (o el `.env` del directorio actual) porque
Prisma 7 ya no lo hace automáticamente. Para Aiven puede que necesites añadir
`?sslmode=require` a la URL; no se modifica el `.env` desde aquí.

## Comandos

Desde la raíz del repo:

```bash
pnpm --filter ./backend run db:validate   # valida schema.prisma sin conectar
pnpm --filter ./backend run db:status     # compara migraciones con la BD
pnpm --filter ./backend run db:migrate    # solo en local: crea/aplica migraciones
pnpm --filter ./backend run db:generate   # genera el cliente Prisma
pnpm --filter ./backend run db:studio     # abre Prisma Studio
```

## A partir de aquí

- Para cambios nuevos: edita `schema.prisma`, crea la migración en local con
  `db:migrate` y revisa el SQL generado. **No** uses `db:migrate` contra la BD real
  sin revisar antes el SQL (Prisma puede proponer cambios destructivos).
