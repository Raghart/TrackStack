# Base de datos — Prisma

Esta carpeta contiene el esquema y el historial de migraciones de Prisma.

## Estructura

```text
database/
├── prisma.config.ts                         # configuración de Prisma CLI
├── baseline-existing-db.sh                  # marca el historial como aplicado
└── prisma/
    ├── schema.prisma                        # estado final del esquema
    └── migrations/
        ├── migration_lock.toml
        ├── 20261102000000_pgvector_extension/
        ├── 20261102000001_artists/          # 1:1 con Goose 001_artists.sql
        ├── ...
        ├── 20261102000012_add_vectors/      # 1:1 con Goose 012_add_vectors.sql
        └── 20261102000013_search_songs_cosine_similarity/
```

Las 12 migraciones de Goose se copiaron en el mismo orden y sin cambios (solo se
eliminaron las marcas `-- +goose Up/Down`; Prisma no usa `Down`). Además se añadió
la extensión `pgvector` antes de `012_add_vectors` y la función
`search_songs_cosine_similarity` al final, que en Goose se aplicaban aparte.

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

## Base de datos nueva

```bash
pnpm --filter ./backend run db:deploy
```

Esto aplica las 14 migraciones en orden. Verificado contra un PostgreSQL local:
el resultado no deja diferencias respecto a `schema.prisma`.

## A partir de aquí

- Para cambios nuevos: edita `schema.prisma`, crea la migración en local con
  `db:migrate` y revisa el SQL generado.
- El runtime de Nest sigue usando Sequelize (`synchronize: true`). Este cambio solo
  migra la gestión de migraciones; no sustituye los modelos ni el acceso a datos.
- No se ha ejecutado ninguna migración contra la base de datos real.
