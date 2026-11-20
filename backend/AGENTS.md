# AGENTS.md — TrackStack Backend

Contexto específico del paquete `backend/`. Las reglas generales del monorepo están en `../AGENTS.md` y tienen prioridad.

## Tech stack

- **NestJS 11** con Express 5.
- **GraphQL code-first** con Apollo Server 5 (`@nestjs/graphql`): el schema se genera en memoria (`autoSchemaFile: true`), no hay archivo `.graphql` versionado.
- **Subscriptions** por WebSocket (`graphql-ws`) para el streaming de la IA.
- **Sequelize 6** (`@nestjs/sequelize`) sobre **PostgreSQL**; `autoLoadModels: true` y `synchronize: false`. Las **migraciones** se gestionan con **Prisma 7** en `database/` (`schema.prisma` + historial migrado 1:1 desde Goose, ya marcado como aplicado en la BD real).
- **Búsqueda sobre PostgreSQL** en `src/search` (sin servicio externo de búsqueda): `SearchService` ejecuta las funciones `search_songs`, `search_artists` y `search_albums` con Sequelize (`sequelize.query`, parámetros bound) y valida cada fila con los schemas Zod de `@trackstack/schemas`. La BD aporta `pg_trgm` + `unaccent`, índices GIN de trigramas y el ranking exacto → prefijo → contiene → fuzzy (ver `docs/database.md`).
- **Google GenAI (Gemini)** inyectado como provider `AI`, usado para las recomendaciones/RAG en streaming.
- **Vitest 5 + unplugin-swc** para unit tests; **ESLint 9** (flat config) con `typescript-eslint` y `eslint-plugin-security`; **Prettier** (`singleQuote`, `trailingComma: all`).
- Alias de imports `src/*` (configurado en `tsconfig.json` y en `vitest.config.ts`).

## Layout (breve)

```text
backend/
├── src/
│   ├── <dominio>/            # songs, albums, artists, genres, song_artists,
│   │   │                     # song_genres, song_details, search
│   │   ├── *.module.ts
│   │   ├── *.resolver.ts     # queries/subscriptions GraphQL (delgados)
│   │   ├── *.service.ts      # lógica de negocio y acceso a datos
│   │   ├── *.spec.ts         # module / resolver / service specs
│   │   └── dto/              # @ObjectType / @Field
│   ├── types/                # atributos, guards (verify.ts) y parsers (parses.ts)
│   ├── utils/                # safeQuery, paginación, helpers de test
│   ├── app.module.ts         # Sequelize, GraphQL, ServeStatic
│   └── main.ts               # bootstrap, CORS, puerto
├── models/<dominio>/         # modelos Sequelize
├── test/                     # fixtures (data/) y constantes (constants/)
├── database/                 # Prisma (schema/migraciones) e init/ (seed de la demo)
├── README.md                 # documentación del paquete
├── dist/ coverage/ public/   # artefactos generados (no editar)
└── eslint.config.mjs / tsconfig*.json / nest-cli.json
```

Cada dominio sigue el mismo patrón: `module` + `resolver` + `service`, con specs para los tres. Los resolvers solo reciben argumentos y delegan; la lógica y el acceso a datos van en el service.

## Documentación

- El README de este paquete es `backend/README.md`. La introducción del proyecto está en `../README.md` y la del cliente en `../frontend/README.md`.
- **No crees `README.md` en subcarpetas de `backend/`** (`database/`, `src/utils/`, etc.). La documentación detallada de una subcarpeta va en `backend/docs/<tema>.md` o en una sección de `backend/README.md`.
- Las reglas completas están en `../AGENTS.md` (sección "Documentación (READMEs)").

## Convenciones clave

- Valida/parsea con `src/types/verify.ts` (guards) + `src/types/parses.ts` (funciones `parse*` que lanzan `BadRequestException`). No devuelvas datos crudos si existe un parser.
- Envuelve acceso a PostgreSQL con `safeQuery` (`InternalServerErrorException`).
- Paginación inválida: `InvalidPaginationException` (`src/utils/PaginationError.ts`).
- DTOs GraphQL con decoradores y nombres de campo en `snake_case` cuando el contrato ya los usa; no renombres campos existentes (rompe el cliente).
- Imports con `src/*` en `src/`; los specs importan fixtures con rutas relativas a `test/`.
- No edites `dist/`, `coverage/`, `public/`, `pnpm-lock.yaml` ni `package-lock.json` (salvo cambio intencional de dependencias).
- **Nunca modifiques la base de datos con SQL/consultas directas** (`psql`, clientes GUI, `query()` sueltos, etc.). Todo cambio de esquema o de datos va por una migración de Prisma (ver "Base de datos y migraciones").
- No agregues mas de lo que te pidan.

## Base de datos y migraciones

- **Prohibido alterar la BD directamente.** No ejecutes `CREATE`/`ALTER`/`DROP`/`INSERT`/`UPDATE`/`DELETE` a mano ni desde herramientas externas para aplicar un cambio. El único canal es una migración de Prisma versionada en `backend/database/prisma/migrations/`.
- Todo cambio estructural (tablas, columnas, tipos, índices, constraints, extensiones, funciones SQL) debe ir acompañado de:
  1. el cambio correspondiente en `backend/database/prisma/schema.prisma`;
  2. una migración nueva generada con `pnpm run db:migrate` (o `pnpm exec prisma migrate dev --create-only --config database/prisma.config.ts` para revisar el SQL antes de aplicarlo).
- Si el cambio incluye datos (backfill, normalización, seeds necesarios para la migración), ese SQL también va dentro de la migración, no ejecutado aparte. Así queda registrado y se puede revertir.
- **No edites migraciones ya aplicadas** ni borres su carpeta: crea una migración nueva que corrija lo anterior. El historial es lo que permite deshacer errores.
- Revisa siempre el SQL generado antes de aplicarlo. `db:migrate` es solo para local; contra la BD real (`db:deploy`, migraciones nuevas) pide confirmación explícita al usuario.
- Si una migración falla o deja la BD en un estado incorrecto, corrígela con el flujo de Prisma (nueva migración, o `pnpm exec prisma migrate resolve --config database/prisma.config.ts` si aplica) y no "arreglando" la BD a mano. Documenta el incidente en el resumen final.

## Mantenimiento de este AGENTS.md

Este archivo refleja cómo está montado `backend/`. Si cambia el código y el archivo se queda atrás, la siguiente sesión trabajará con supuestos falsos. **Actualízalo tú mismo cuando corresponda; no esperes a que el usuario lo pida.**

- Tras un cambio **relevante** en `backend/`, revisa si este archivo (y `../AGENTS.md` si el cambio es de alcance general) sigue siendo correcto, y actualiza la parte desfasada en el mismo cambio.
- Actualiza este archivo cuando el cambio:
  - añade, elimina o renombra un dominio en `src/`, un modelo en `models/`, o mueve código entre `src/`, `models/` y `database/`;
  - cambia el tech stack o configuración del paquete (Nest, Apollo/graphql-ws, Sequelize, GenAI, Vitest, ESLint, tsconfig, alias `src/*`);
  - añade o modifica scripts de `package.json` o el orden de verificación (lint/tests/build);
  - establece una convención nueva de estructura (p. ej. dónde van los tipos, DTOs, guards, parsers, fixtures o specs) o cambia la forma de testear;
  - cambia el contrato GraphQL, el patrón resolver/service, `safeQuery`, paginación o el manejo de errores de un modo que afecte al trabajo diario.
- Cómo hacerlo:
  - Edita solo las secciones afectadas, con cambios mínimos y el mismo estilo/tono del archivo.
  - Lo general del monorepo va en `../AGENTS.md`; lo específico del paquete, aquí. No dupliques reglas en ambos.
  - Si algo deja de ser cierto, corrígelo o elimínalo; no acumules notas contradictorias.
- **No** actualices este archivo por cambios triviales, refactors internos que no alteran cómo se trabaja, ni por fixes que no cambian convenciones, comandos ni patrones.
- Si dudas de si merece actualización, decide con criterio y dilo en el resumen final (qué revisaste y por qué no cambiaste nada).

## Tipos

- **No declares `interface`, `type` ni aliases de tipos dentro de archivos de dominio, services, resolvers, utils, controladores ni specs.** Todos los tipos del backend viven en `src/types/*.ts` (`songAttributes.ts`, `searchTypes.ts`, `albumAttributes.ts`, etc.) y se importan desde ahí con el alias `src/types/...`.
- **Antes de crear un tipo, busca en `src/types/` uno que ya sirva.** Reutilízalo o extiéndelo (`extends`, `Pick`, `Omit`, etc.) en lugar de duplicarlo o declarar una versión local. Si de verdad no existe nada equivalente, añade el tipo al archivo de `src/types/` que corresponda al dominio (o crea uno nuevo ahí, siguiendo el patrón existente).
- Única excepción: los DTOs GraphQL (`@ObjectType` / `@Field`) siguen en `src/<dominio>/dto/` porque los exige el enfoque code-first. Los tipos de atributos, respuestas de servicio o estructuras internas que esos DTOs consuman sí van en `src/types/`.
- Respeta los nombres y el estilo ya usados (p. ej. `snake_case` en campos que reflejan el contrato de la API) y no dupliques el mismo tipo en dos sitios.

## Tests

- Los unit tests **no necesitan PostgreSQL**: los modelos se mockean con `getModelToken(...)` y los providers externos (`AI`) con `useValue`.
- Fixtures compartidos en `test/data/<dominio>/`; constantes (URLs, errores, `USER_VECTOR`) en `test/constants/constants.ts`; assertions reutilizables en `src/utils/expect*.ts`.
- Coloca el spec junto al archivo afectado (`src/<dominio>/<archivo>.spec.ts`). Usa los fixtures en vez de inventar datos inline.
- **Ejecuta solo los specs afectados por tu cambio** (`pnpm run test -- src/<dominio>/<archivo>.spec.ts`). La suite completa es lenta y costosa: no la corras por defecto. Resérvala para cuando el usuario la pida explícitamente o cuando el cambio toque algo global (configuración de Vitest/tsconfig, `app.module.ts`, o tipos/helpers compartidos de `src/types` y `src/utils`).
- Si el cambio afecta a varios dominios, ejecuta el spec de cada archivo tocado; si creas un spec nuevo, ejecuta ese archivo concreto.
- Los E2E reales están en `../e2e` (Playwright) y requieren servicios; no hay runner de E2E dentro de `backend/`.

### Cuándo agregar un test de regresión

Añade un test de regresión siempre que:

- Corrijas un **bug**: debe existir un caso que falle con el código anterior y pase con el fix. Si es posible, añádelo antes de corregir para comprobar que reproduce el fallo.
- Cambies un **parser/guard** (`parses.ts`, `verify.ts`): cubre la entrada que antes se aceptaba/rechazaba mal.
- Toques **manejo de errores**: `safeQuery`, paginación inválida, recurso no encontrado (`NotFoundException`), timeouts de Sequelize.
- Modifiques el **contrato GraphQL** (query, mutation, subscription o DTO): añade/actualiza el spec del resolver y verifica forma y tipos de la respuesta.
- Cambies lógica de **recomendaciones/vector**, búsqueda o normalización de texto: cubre el caso límite que motivó el cambio (array vacío, valores fuera de rango, query con typo, etc.).
- Arregles un **edge case** reportado en producción o en un PR.

Reglas para estos tests:

- Ubícalos en el `*.spec.ts` del dominio/archivo afectado dentro del `describe` existente; crea uno nuevo solo si el caso cruza dominios.
- Nombra el `it` describiendo el comportamiento esperado (inglés, como el resto), p. ej. `it('returns 400 when limit is zero')`. No hace falta prefijarlo con "regression".
- Reutiliza fixtures y helpers de `expect*`; evita duplicar setups.
- No debilites ni elimines assertions existentes para que pase el test; no uses `any` nuevo ni casts para sortear tipos.

## Comandos de verificación

Desde la raíz del repo:

```bash
pnpm run dev:backend                 # Nest en watch
pnpm run build:backend               # nest build -> backend/dist
pnpm run start:prod                  # ejecuta el build compilado
```

Dentro de `backend/` (o con `pnpm --filter ./backend run <script>` desde la raíz):

```bash
pnpm run lint                        # ESLint sobre src, test, apps, libs
pnpm exec eslint .                   # mismo lint + reglas de seguridad (lo que corre la CI)
pnpm run test                        # Vitest (unit specs de src/)
pnpm run test -- src/songs/songs.service.spec.ts   # un spec concreto
pnpm run test:watch                  # Vitest en watch
pnpm run test:cov                    # cobertura -> backend/coverage/
pnpm run build                       # compila con Nest
pnpm run format                      # Prettier sobre src/ y test/
pnpm run db:validate                 # valida database/prisma/schema.prisma (sin conectar)
pnpm run db:status                   # estado de migraciones Prisma frente a la BD
pnpm run db:migrate                  # solo local: crea/aplica migraciones
pnpm run db:generate                 # genera el cliente Prisma
```

No ejecutes `db:deploy` ni crees migraciones nuevas contra la BD real sin confirmarlo. La BD ya tiene el baseline de Prisma aplicado; las migraciones se documentan en `backend/README.md` (sección Database).

Orden recomendado antes de dar un cambio por terminado:

1. `pnpm --filter ./backend run lint`
2. Ejecuta **solo los specs afectados** con `pnpm --filter ./backend run test -- src/<dominio>/<archivo>.spec.ts` (evita `pnpm run test` completo salvo que se pida o el cambio sea global).
3. `pnpm --filter ./backend run build`
4. `pnpm --filter ./backend run test:cov` solo si el usuario lo pide o si tocaste lógica sensible y necesitas revisar la cobertura; también es costoso.

Notas:

- La suite completa es lenta; la CI la ejecuta en cada PR. En local basta con validar los specs directamente relacionados con el cambio.
- No hay umbral de cobertura configurado en Vitest, pero el proyecto mantiene métricas altas; evita bajar la cobertura del archivo que tocas.
- `pnpm run test` no requiere `.env` ni servicios externos. `start:prod`, los E2E y cualquier prueba de integración sí necesitan `DB_URL`, `DB_PORT` y, para la IA, `API_KEY`. Si faltan, dilo explícitamente en el resumen en lugar de asumir que pasan.
- La CI ejecuta lint, `eslint .` (seguridad) y los tests en cada PR, así que esos tres deben pasar.
