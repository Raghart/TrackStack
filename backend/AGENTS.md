# AGENTS.md — TrackStack Backend

Contexto específico del paquete `backend/`. Las reglas generales del monorepo están en `../AGENTS.md` y tienen prioridad.

## Tech stack

- **NestJS 11** con Express 5.
- **GraphQL code-first** con Apollo Server 5 (`@nestjs/graphql`): el schema se genera en memoria (`autoSchemaFile: true`), no hay archivo `.graphql` versionado.
- **Subscriptions** por WebSocket (`graphql-ws`) para el streaming de la IA.
- **Sequelize 6** (`@nestjs/sequelize`) sobre **PostgreSQL**; `autoLoadModels: true` y `synchronize: true`. Existe además `database/` con SQL y utilidades **Go/sqlc** para generar queries, no es código Nest.
- **Elasticsearch 7** vía cliente `elasticsearch` (inyectado como `BonsaiClient`). La búsqueda usa fuzzy, n-grams y edge-ngrams.
- **Google GenAI (Gemini)** inyectado como provider `AI`, usado para las recomendaciones/RAG en streaming.
- **Jest 29 + ts-jest** para unit tests; **ESLint 9** (flat config) con `typescript-eslint` y `eslint-plugin-security`; **Prettier** (`singleQuote`, `trailingComma: all`).
- Alias de imports `src/*` (configurado en `tsconfig.json` y en `moduleNameMapper` de Jest).

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
│   ├── utils/                # safeQuery, safeSearch, paginación, helpers de test
│   ├── app.module.ts         # Sequelize, GraphQL, ServeStatic
│   └── main.ts               # bootstrap, CORS, puerto
├── models/<dominio>/         # modelos Sequelize
├── test/                     # fixtures (data/) y constantes (constants/)
├── database/                 # SQL + tooling Go/sqlc (no tocar sin motivo)
├── dist/ coverage/ public/   # artefactos generados (no editar)
└── eslint.config.mjs / tsconfig*.json / nest-cli.json
```

Cada dominio sigue el mismo patrón: `module` + `resolver` + `service`, con specs para los tres. Los resolvers solo reciben argumentos y delegan; la lógica y el acceso a datos van en el service.

## Convenciones clave

- Valida/parsea con `src/types/verify.ts` (guards) + `src/types/parses.ts` (funciones `parse*` que lanzan `BadRequestException`). No devuelvas datos crudos si existe un parser.
- Envuelve acceso a PostgreSQL con `safeQuery` (`InternalServerErrorException`) y a Elasticsearch con `safeSearch` (`ServiceUnavailableException`).
- Paginación inválida: `InvalidPaginationException` (`src/utils/PaginationError.ts`).
- DTOs GraphQL con decoradores y nombres de campo en `snake_case` cuando el contrato ya los usa; no renombres campos existentes (rompe el cliente).
- Imports con `src/*` en `src/`; los specs importan fixtures con rutas relativas a `test/`.
- No edites `dist/`, `coverage/`, `public/`, `pnpm-lock.yaml` ni `package-lock.json` (salvo cambio intencional de dependencias).

## Tests

- Los unit tests **no necesitan PostgreSQL ni Elasticsearch**: los modelos se mockean con `getModelToken(...)` y los providers externos (`BonsaiClient`, `AI`) con `useValue`.
- Fixtures compartidos en `test/data/<dominio>/`; constantes (URLs, errores, `USER_VECTOR`) en `test/constants/constants.ts`; assertions reutilizables en `src/utils/expect*.ts`.
- Coloca el spec junto al archivo afectado (`src/<dominio>/<archivo>.spec.ts`). Usa los fixtures en vez de inventar datos inline.
- `test:e2e` existe pero apunta a `test/*.e2e-spec.ts`, que hoy no hay; los E2E reales están en `../e2e` (Playwright) y requieren servicios.

### Cuándo agregar un test de regresión

Añade un test de regresión siempre que:

- Corrijas un **bug**: debe existir un caso que falle con el código anterior y pase con el fix. Si es posible, añádelo antes de corregir para comprobar que reproduce el fallo.
- Cambies un **parser/guard** (`parses.ts`, `verify.ts`): cubre la entrada que antes se aceptaba/rechazaba mal.
- Toques **manejo de errores**: `safeQuery`, `safeSearch`, paginación inválida, recurso no encontrado (`NotFoundException`), timeouts de Sequelize/Elasticsearch.
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
pnpm run test                        # Jest (unit specs de src/)
pnpm run test -- src/songs/songs.service.spec.ts   # un spec concreto
pnpm run test:watch                  # Jest en watch
pnpm run test:cov                    # cobertura -> backend/coverage/
pnpm run build                       # compila con Nest
pnpm run format                      # Prettier sobre src/ y test/
pnpm run test:e2e                    # config test/jest-e2e.json (sin specs actualmente)
```

Orden recomendado antes de dar un cambio por terminado:

1. `pnpm --filter ./backend run lint`
2. `pnpm --filter ./backend run test` (o el spec afectado durante el desarrollo)
3. `pnpm --filter ./backend run build`
4. Si tocaste lógica sensible, `pnpm --filter ./backend run test:cov` y revisa que no baje la cobertura.

Notas:

- No hay umbral de cobertura configurado en Jest, pero el proyecto mantiene métricas altas; evita bajar la cobertura del archivo que tocas.
- `pnpm run test` no requiere `.env` ni servicios externos. `start:prod`, los E2E y cualquier prueba de integración sí necesitan `DB_URL`, `DB_PORT`, `ELASTICSEARCH_NODE` y, para la IA, `API_KEY`. Si faltan, dilo explícitamente en el resumen en lugar de asumir que pasan.
- La CI ejecuta lint, `eslint .` (seguridad) y los tests en cada PR, así que esos tres deben pasar.
