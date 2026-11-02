# Base de datos — Prisma

Esta carpeta contiene el esquema y el historial de migraciones de Prisma. Sustituye
a Goose como herramienta de migraciones, pero **conserva intacto** el trabajo de
`backend/oldDatabase/` (Goose + sqlc) como referencia.

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

Prisma reutiliza las mismas variables que Nest/Sequelize, en este orden:

1. `DATABASE_URL`
2. `DB_URL`

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

## Base de datos existente (la que ya tiene Goose aplicado)

La base de datos de producción ya está funcionando con el esquema de Goose. **No
hay que ejecutar nada sobre ella ahora**: estos comandos quedan preparados por si
en el futuro hace falta registrar el historial de Prisma.

No ejecutes `db:deploy` directamente: fallaría al intentar crear tablas que ya
existen. Habría que hacer *baseline*, es decir, registrar el historial como aplicado
sin volver a ejecutar el SQL:

```bash
pnpm --filter ./backend run db:baseline
```

El script marca las 14 migraciones con `prisma migrate resolve --applied` y luego
muestra `migrate status`. Deja intacta la tabla `goose_db_version` y no borra datos.

Antes de hacer baseline, comprueba que la extensión y la función ya existen en esa
BD (en la BD actual sí, porque Goose llegó a aplicar `012_add_vectors`):

```sql
\dx vector
\df search_songs_cosine_similarity
```

Si faltara alguna, aplica antes el SQL de
`prisma/migrations/20261102000000_pgvector_extension/` o
`prisma/migrations/20261102000013_search_songs_cosine_similarity/`.

## A partir de aquí

- Para cambios nuevos: edita `schema.prisma`, crea la migración en local con
  `db:migrate` y revisa el SQL generado.
- En una BD existente usa `db:deploy`; **no uses `db:migrate`/`migrate dev` contra
  la BD compartida**, porque la tabla `goose_db_version` puede hacer que Prisma
  detecte drift y proponga resetear.
- El runtime de Nest sigue usando Sequelize (`synchronize: true`). Este cambio solo
  migra la gestión de migraciones; no sustituye los modelos ni el acceso a datos.
- No se ha ejecutado ninguna migración contra la base de datos real.
