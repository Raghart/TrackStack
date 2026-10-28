# TrackStack — Plan de mejoras por bloques

> **Uso:** este archivo es la fuente de verdad del plan. Cada bloque es una unidad de trabajo
> independiente, pensada para ejecutarse en **sesiones separadas** y revisarse antes de pasar al
> siguiente. No hacer todo de una vez.

---

## 0. Contexto para una sesión nueva

Leer primero:

- `README.md`
- `PLAN_MEJORAS.md` (este archivo)
- `backend/package.json`, `backend/src/app.module.ts`, `backend/src/main.ts`

Objetivo del proyecto: portfolio principal para buscar trabajo como developer. La prioridad no es
agregar más stack, sino que el demo funcione, que cualquiera pueda levantarlo y que las decisiones
técnicas estén bien contadas.

### Estado verificado al 2026-10-28

- Backend: 210 tests pasando, 92.21% statements, 90.48% lines, **75.75% functions**, ~167s.
- El search en producción devuelve **503** (`ping` y `multipleSearch`): Elasticsearch/Bonsai caído.
- `getPreviousSong` en el primer tema devuelve el mismo tema (IDs no secuenciales; arrancan en 598104).
- `database/sql/queries/vectorFunction.sql` declara `vector(13)` pero la columna es `vector(8)`.
  En producción funciona porque la función desplegada no coincide con el repo.
- `songs.resolver.ts` importa `USER_VECTOR` desde `test/constants`.
- `synchronize: true`, SSL hardcodeado, sin `.env.example`, sin Docker, sin migraciones ejecutables,
  sin seed reproducible, sin mappings de Elasticsearch en el repo.
- Búsqueda con resultados vacíos puede romper toda la query por campos GraphQL non-null.

### Decisiones tomadas

1. **Eliminar Elasticsearch del proyecto.** Los datos salen de PostgreSQL; no se perdió la fuente
   de verdad. La búsqueda se reimplementa con PostgreSQL (`pg_trgm` + `unaccent` + full-text).
   Dejar registro de la decisión en un ADR.
2. **Docker + seed de muestra** es requisito para que el proyecto sea reproducible. Sin seed, el
   compose levanta una app vacía y no sirve para revisión.
3. **Backend primero.** El frontend se trabaja después, en un bloque separado (B9).
4. No agregar microservicios, Kafka, Kubernetes ni auth solo por sumar palabras al CV.

---

## 1. Reglas para el agente (anti one-shot)

1. **Un bloque por sesión.** Al terminar un bloque, parar y esperar confirmación del usuario.
2. Leer este archivo completo antes de tocar código. Si algo no está claro, preguntar.
3. Crear una rama por bloque: `mejora/b<numero>-<slug>`.
4. No refactorizar código que no pertenece al bloque. Si aparece algo importante, anotarlo al final
   de este archivo en "Pendientes detectados" y seguir.
5. No instalar dependencias nuevas sin justificarlas en el reporte del bloque.
6. No tocar el frontend en bloques de backend.
7. No commitear secretos, `dist/`, `coverage/` ni datos pesados.
8. Antes de cerrar un bloque, ejecutar como mínimo:
   ```bash
   cd backend
   npx tsc --noEmit
   npm run lint
   npm test
   ```
   Si el bloque agrega integración/Docker, agregar el comando correspondiente.
9. Al terminar, actualizar la tabla de estado, listar archivos modificados, comandos ejecutados y
   resultados. No marcar un bloque como terminado si falla build, lint o tests.
10. Si un bloque supera ~15 archivos o se vuelve inmanejable, dividirlo en `BA` y `BB` y pedir
    confirmación antes de seguir.

### Prompt de arranque para una sesión nueva

```text
Leé README.md y PLAN_MEJORAS.md. Trabajá únicamente el Bloque N.
No avances al siguiente bloque. Al terminar, actualizá el estado en PLAN_MEJORAS.md
y mostrame: archivos tocados, comandos ejecutados, resultados y qué queda pendiente.
```

---

## 2. Tabla de estado

| Bloque | Tema | Depende de | Esfuerzo | Estado |
|---|---|---|---|---|
| B0 | Reconocimiento y baseline | — | S | `[ ]` |
| B1 | Docker, migraciones, seed y entorno reproducible | B0 | M | `[ ]` |
| B2 | Correcciones P0 de backend | B1 (para tests de DB) | S/M | `[ ]` |
| B3 | Search PostgreSQL-only y eliminación de Elasticsearch | B1 | M | `[ ]` |
| B4 | Hardening: validación, seguridad, config, logs | B1–B3 | M | `[ ]` |
| B5 | Performance y queries | B1–B4 | M | `[ ]` |
| B6 | Tests de integración y CI con gates | B1–B5 | M | `[ ]` |
| B7 | Diferenciador: RAG real o explicabilidad | B3, B5 | M | `[ ]` |
| B8 | README, docs, ADR y polish final | B1–B7 | M | `[ ]` |
| B9 | Frontend (sesión separada) | B8 | L | `[ ]` |

Leyenda de esfuerzo: S = acotado, M = una sesión dedicada, L = varias sesiones.

---

## B0 — Reconocimiento y baseline

**Objetivo:** confirmar el estado real antes de cambiar nada y dejar evidencia.

### Tareas

- [ ] `git status` limpio y rama `mejora/b0-baseline` creada.
- [ ] `npm ci` en la raíz.
- [ ] `cd backend && npx tsc --noEmit` → resultado.
- [ ] `cd backend && npm run lint` → resultado.
- [ ] `cd backend && npm test` → tests, cobertura y duración.
- [ ] Verificar si `ELASTICSEARCH_NODE`, `API_KEY` y `AI_MODEL` están documentados en algún lado.
- [ ] Buscar referencias a Elasticsearch en todo el repo:
  ```bash
  grep -rn "elastic\|Bonsai\|ELASTICSEARCH" --exclude-dir=node_modules --exclude-dir=.git .
  ```
- [ ] Anotar al final del archivo cualquier hallazgo nuevo que no esté ya listado.

### Criterio de aceptación

- Baseline registrado en el reporte de la sesión.
- No se modifica código de producto.

---

## B1 — Docker, migraciones, seed y entorno reproducible

**Objetivo:** que cualquier persona (o reviewer) levante TrackStack desde cero con un comando y
tenga datos reales para probar. Sin esto, el resto no se puede validar bien.

### Tareas

- [ ] Crear `backend/.env.example` con todas las variables:
  `DB_URL`, `DB_PORT`, `DB_SSL`, `API_KEY`, `AI_MODEL`, `URL_DOMAIN`, `PORT`.
- [ ] Validar configuración al boot (Joi o Zod) en un único lugar. Eliminar los
  `process.loadEnvFile()` repetidos en `src/main.ts`, `src/app.module.ts`, `songs.service.ts` y
  `search.module.ts` si corresponde.
- [ ] `Dockerfile` multi-stage para el backend + `docker-compose.yml` en la raíz con:
  - PostgreSQL con pgvector (`pgvector/pgvector:pg16`).
  - Extensiones `vector`, `pg_trgm`, `unaccent`.
  - Backend (perfil opcional para desarrollo).
- [ ] Reemplazar `synchronize: true` por migraciones reales (Umzug ya está en deps, o Sequelize CLI).
  - Incluir el esquema actual (`database/sql/schema/*.sql`) como migración inicial.
  - Incluir la función `search_songs_cosine_similarity`.
  - Incluir índices faltantes: FKs, únicos compuestos, GIN trigram y HNSW/IVFFlat para vectores.
- [ ] Script de seed reproducible:
  - `npm run db:seed --workspace=backend` o equivalente.
  - Muestra de 2k–5k canciones con artistas, álbumes, géneros, relaciones, `song_details` y vectores.
  - Datos de muestra en el repo (comprimidos, <5–10 MB) o script de descarga documentado.
  - El seed debe ser idempotente.
- [ ] Scripts nuevos documentados en `package.json`: `db:migrate`, `db:seed`, `db:reset`.
- [ ] Health check mínimo con `@nestjs/terminus`: `/health/live` y `/health/ready` (DB).
  Sin auth, excluido de rate limiting.
- [ ] Actualizar CI para usar `DATABASE_URL` local/servicio, no secretos de producción.
- [ ] Documentar en `docs/SETUP.md` el flujo exacto desde clonar hasta ver GraphQL.

### Criterio de aceptación

Desde un clon limpio:

```bash
cp backend/.env.example backend/.env
docker compose up -d
npm ci
npm run db:migrate --workspace=backend
npm run db:seed --workspace=backend
npm run dev:backend
```

- La app arranca sin errores.
- `/health/ready` responde 200.
- GraphQL responde `getLandpageSongs`, `getAllGenres` y `getSongData` con datos del seed.
- `npm test` sigue pasando.
- No queda `synchronize: true` ni SSL hardcodeado.

### Fuera de alcance

- Cambiar la lógica de búsqueda (eso es B3).
- Performance (B5).

---

## B2 — Correcciones P0 de backend

**Objetivo:** eliminar bugs que un reviewer encuentra en 10 minutos, sin mezclarlos con refactors
grandes.

### Tareas

- [ ] **Prev/Next con IDs no secuenciales**
  - Reemplazar `findByPk(songID ± 1)` por:
    - siguiente: `WHERE id > :id ORDER BY id ASC LIMIT 1`
    - anterior: `WHERE id < :id ORDER BY id DESC LIMIT 1`
    - wrap explícito: siguiente del último → `MIN(id)`; anterior del primero → `MAX(id)`.
  - Cubrir primero, último y huecos de IDs con tests.
- [ ] **Dimensiones del vector**
  - Alinear `database/sql/queries/vectorFunction.sql` a `vector(8)` y a la columna real.
  - Asegurar que la migración de B1 crea la función con la firma correcta.
  - Test de integración: insertar un vector de 8 dimensiones y ejecutar la función.
- [ ] **Dependencia de test en producción**
  - Sacar `USER_VECTOR` de `test/constants` de `src/songs/songs.resolver.ts`.
  - Mover default a `src/constants` con valores normalizados 0..1 (tempo no puede ir en 120).
  - O hacer `genres` y `userVector` argumentos requeridos y validados.
- [ ] **Servicios con chequeos incorrectos**
  - `SongGenresService.fetchSongGenres`: chequear `rawData.length === 0` y devolver 404 real.
  - `ArtistsService.parseArtists` / `AlbumsService.parseAlbums`: evitar `songs[0]` sin guardas.
  - `SongsService.fetchRandomSong`: manejar DB vacía sin `parseSongResponse(undefined)`.
- [ ] **Errores internos**
  - `safeQuery`: loggear el error original y devolver mensaje genérico al cliente.
  - Distinguir 400 (input inválido) de 500 (fallo interno) en los parsers.
- [ ] **Código muerto**
  - Eliminar `song_details` y `song_artists` como módulos/resolvers/servicios vacíos si no aportan
    queries (conservar los modelos).
  - Borrar sus specs tautológicos.
- [ ] Tests para cada corrección.

### Criterio de aceptación

- `getPreviousSong(primerID)` devuelve el último tema y `getNextSong(últimoID)` devuelve el primero.
- Con un hueco de ID no salta al primer tema.
- La función SQL acepta exactamente 8 dimensiones.
- No hay imports desde `test/` en `src/`.
- Tests nuevos cubren los casos anteriores.
- Build, lint y tests verdes.

---

## B3 — Search PostgreSQL-only y eliminación de Elasticsearch

**Objetivo:** recuperar la búsqueda sin depender de Bonsai, con calidad comparable y todo versionado
en el repo.

### Decisión

Eliminar Elasticsearch. Implementar búsqueda en PostgreSQL con:

- `pg_trgm` para tolerancia a typos.
- `unaccent` + lower para acentos.
- Prefijo para autocompletado.
- `tsvector`/`websearch_to_tsquery` si hace falta para queries de varias palabras.
- Índices GIN para que no sea un scan completo.

### Tareas

- [ ] Borrar `src/search` actual basado en Elasticsearch y el provider `BonsaiClient`.
- [ ] Quitar dependencias: `elasticsearch`, `@elastic/elasticsearch`, `@nestjs/elasticsearch`,
  `@types/elasticsearch` (verificar cuáles se usan realmente antes).
- [ ] Quitar `ELASTICSEARCH_NODE` de env, CI, README y health check.
- [ ] Crear columnas normalizadas de búsqueda (`search_name`) en `songs`, `artists`, `albums`,
  pobladas por trigger o por seed. Si se usa `unaccent`, resolver el problema de inmutabilidad con
  una función wrapper `IMMUTABLE` o una columna materializada.
- [ ] Migración con índices GIN trigram y, si se usa full-text, GIN sobre `tsvector`.
- [ ] Nuevo `SearchService` con Sequelize/raw SQL:
  - Ranking: exacto > prefijo > similitud trigram > full-text.
  - Pesos por campo (nombre de canción con más peso).
  - Límite 11 por categoría, consistente.
  - Búsqueda de songs/artists/albums en paralelo (`Promise.all`).
- [ ] Corregir contrato GraphQL:
  - `exactArtist`, `exactAlbum`, `exactSong` deben ser **nullable** cuando no hay coincidencia exacta.
  - No devolver el primer fuzzy match como "exact".
  - Si no hay resultados, devolver arrays vacíos y exactos `null`, no romper la query.
- [ ] Mantener la forma de respuesta que consume el frontend; verificar `SearchResults.tsx` y
  `useSearchResults.ts` antes de cambiar nombres.
- [ ] Tests:
  - Unitarios: exacto, prefijo, typo, acento, sin resultados, ranking.
  - Integración (con B1): query real contra Postgres sembrado.
- [ ] ADR: `docs/adr/0001-search-postgres.md` con contexto, decisión, alternativas, consecuencias.
- [ ] Script de verificación manual con `curl` documentado en el ADR o en `docs/SETUP.md`.

### Criterio de aceptación

- No queda ninguna referencia a Elasticsearch/Bonsai en código, deps, CI ni docs.
- `multipleSearch("nirvana")`, `multipleSearch("mago de oz")`, `multipleSearch("zzzzqqq")` y una
  query con typo funcionan sin 500.
- Una búsqueda sin resultados devuelve `data` válida, no un error GraphQL.
- Los tests de integración corren contra Postgres del compose.
- `ping` (si se conserva) ya no depende de ES.

### Fuera de alcance

- Benchmark formal (B5), aunque se puede anotar una medición preliminar.

---

## B4 — Hardening: validación, seguridad, config y logs

**Objetivo:** que la API se comporte como un servicio real ante inputs inválidos, abuso y fallos.

### Tareas

- [ ] **Validación de argumentos GraphQL** con DTO + `class-validator`/Zod:
  - `limit` entre 1 y 100.
  - `page >= 1`.
  - `userVector` exactamente 8 valores numéricos entre 0 y 1.
  - `genres` contra whitelist de géneros existentes; máximo razonable.
  - query de búsqueda entre 1 y 80 caracteres.
- [ ] **Rate limiting** con `@nestjs/throttler`:
  - Límite general por IP.
  - Límite más estricto para `aiResponse`, `getSongRecommendations` y `multipleSearch`.
  - Configurar `trust proxy` para Render.
- [ ] **IA**:
  - `maxOutputTokens`, timeout, abort al desconectarse el cliente.
  - Retry con backoff solo para errores transitorios.
  - Fallback si el modelo falla (no romper la UI).
  - No interpolar input del usuario sin sanear en el prompt.
- [ ] **Apollo en producción**:
  - `playground` e introspección deshabilitados por env.
  - `autoSchemaFile: 'schema.gql'` y commitear el schema.
  - Formato de errores sin stacktrace ni detalles internos.
  - Límite de profundidad/complejidad de query.
- [ ] **HTTP**:
  - Helmet, compresión, body limit.
  - CORS por allowlist configurable; no `undefined` abierto.
  - `app.enableShutdownHooks()`.
- [ ] **Logging**:
  - `nestjs-pino` o equivalente, con request ID.
  - Filtro global de excepciones.
  - Eliminar `console.log`/`console.error` de producción.
- [ ] **Config**:
  - Falla al boot si falta una variable crítica.
  - Un solo punto de carga de `.env`.
- [ ] Tests de validación: límites, vectores inválidos, géneros inválidos, rate limit.

### Criterio de aceptación

- Inputs inválidos devuelven 400 con mensaje claro, no 500 ni error de DB.
- El endpoint de IA no puede dispararse sin límite.
- En producción no hay playground, introspección ni stacktraces.
- Los logs incluyen request ID y no filtran errores SQL.
- Build, lint y tests verdes.

---

## B5 — Performance y queries

**Objetivo:** mejorar latencia real y tener números para contar en entrevistas.

### Tareas

- [ ] **Landing aleatoria**
  - Reemplazar `ORDER BY RANDOM()` sobre 50k filas por `TABLESAMPLE SYSTEM`, buckets
    precalculados o keyset pagination.
  - Cachear landing 30–60s (`cache-manager` o Redis si hay más de una instancia).
  - `Cache-Control`/ETag si aplica.
- [ ] **Listados de artistas/álbumes**
  - Dejar de traer todas las canciones para leer `songs[0]`.
  - Usar lateral join/subquery o dos queries: IDs de página + agregados con `IN (...)`.
  - Seleccionar solo columnas necesarias.
- [ ] **Recomendaciones**
  - Filtrar por `genre_id` antes de los joins.
  - Índice HNSW/IVFFlat sobre `song_details.vectors`.
  - Devolver `cos_sim` al cliente si es útil.
  - Limitar `limit` y evitar ORDER BY sobre todo el catálogo.
  - Documentar la semántica de pesos (frontend vs backend).
- [ ] **Search PostgreSQL**
  - Verificar planes con `EXPLAIN ANALYZE`.
  - Evitar funciones no indexables en el WHERE.
  - Cachear queries calientes si hace falta.
- [ ] **Géneros y count**
  - Cachear `getAllGenres`.
  - Revisar si `getDBLength` necesita cache o count aproximado.
- [ ] **Benchmark**
  - Script reproducible (`autocannon` o `k6`) para landing, search, recomendaciones y detalle.
  - Guardar resultados antes/después en `docs/PERFORMANCE.md`.
  - Incluir p50/p95 y el `EXPLAIN ANALYZE` de las queries clave.
- [ ] Tests de regresión para que la optimización no cambie la respuesta.

### Criterio de aceptación

- Cada optimización tiene una medición antes/después.
- No se rompe ningún contrato GraphQL.
- `docs/PERFORMANCE.md` tiene números reales reproducibles.
- Build, lint y tests verdes.

### Fuera de alcance

- Reescribir la app en otro framework o agregar infraestructura innecesaria.

---

## B6 — Tests de integración y CI con gates

**Objetivo:** que la cobertura refleje confianza real y que el deploy no pueda pasar si algo se rompe.

### Tareas

- [ ] **Testcontainers** para Postgres con pgvector.
  - Suite de integración con migraciones + seed mínimo.
  - Casos: búsqueda, recomendación, prev/next, vectores, health, artistas/álbumes.
- [ ] **E2E de GraphQL** con `supertest` (hoy `test/jest-e2e.json` existe pero no hay
  `*.e2e-spec.ts`).
  - Queries principales y casos de error.
- [ ] **Schema snapshot**: commitear `schema.gql` y detectar breaking changes.
- [ ] **Limpiar tests tautológicos**
  - Eliminar specs de módulos que solo hacen `new XModule()`.
  - Reemplazar por tests de DI con mocks o integración.
- [ ] **Velocidad**
  - Migrar de ts-jest a `@swc/jest` o activar `isolatedModules`.
  - Objetivo: bajar sustancialmente los ~167s actuales.
- [ ] **Cobertura**
  - `coverageThreshold` (ej. 85% global, 95% en services).
  - Excluir modelos/generados.
  - Badge real de cobertura (Codecov o similar).
- [ ] **CI**
  - `npm ci` + cache de npm.
  - `npx tsc --noEmit`, `npm run build`.
  - Lint **sin `--fix`** en CI.
  - `jest --ci --coverage`.
  - Build de Docker como smoke test.
  - Matrix Node 20/22 (opcional).
  - `npm audit` o Dependabot.
- [ ] **CD**
  - El deploy debe depender de CI verde (un solo pipeline con `needs` o `workflow_run`).
  - Hoy CI solo corre en PR y CD en push a main: un push directo deploya sin tests.
- [ ] **Playwright**
  - DB/ES efímera, no secretos de producción.
  - Chromium en PR; los 3 browsers en nightly.
  - Subir traces/reportes.

### Criterio de aceptación

- Hay al menos un test de integración real por módulo crítico.
- Un fallo de test de integración bloquea el deploy.
- CI usa base de datos efímera y no secretos de prod.
- Cobertura y tiempos quedan reportados en el README.

---

## B7 — Diferenciador: RAG real o explicabilidad

**Objetivo:** tener algo que un reviewer recuerde y que permita una conversación técnica profunda.

### Elegir **una** opción por sesión

#### Opción A — RAG real (recomendada si se mantiene el claim del README)

- [ ] Antes de llamar al modelo, recuperar el top-K de recomendaciones de pgvector.
- [ ] Pasar al prompt nombres, artistas, géneros y features de esos temas.
- [ ] Cachear respuestas para combinaciones idénticas (géneros + vector) con TTL corto.
- [ ] Fallback si el modelo falla.
- [ ] Medir latencia y tokens.
- [ ] Tests del prompt builder (sin llamar a la API real) y del fallback.
- [ ] Actualizar README para explicar el flujo RAG de verdad.

#### Opción B — Explicabilidad de recomendaciones

- [ ] Devolver por canción la contribución por feature (energía, valence, tempo, etc.).
- [ ] Exponer un campo `matchReasons` o similar en GraphQL.
- [ ] Mostrar en frontend (o dejar contrato listo) "match 87%: energía alta, tempo medio".
- [ ] Tests de cálculo y de contrato.
- [ ] Documentar la fórmula.

### Criterio de aceptación

- La feature es demostrable con una request real.
- Hay tests que no dependen de servicios externos.
- README explica qué hace y por qué.

---

## B8 — README, docs, ADR y polish final

**Objetivo:** que el proyecto se vea tan bien como funciona.

### Tareas

- [ ] Corregir claims:
  - Tests reales (hoy 210; actualizar al número final).
  - Cobertura real (statement/lines/functions; no decir "90% en todo").
  - Números de datos consistentes (50k, 28k, 300k, 30k: explicar diferencias).
  - "RAG" solo si se implementó de verdad (B7A).
- [ ] Quitar Elasticsearch de descripción, stack, diagrama y setup.
- [ ] Agregar **Docker + seed** al Quick Start y eliminar pasos manuales irreproducibles.
- [ ] `.env.example` documentado.
- [ ] Diagrama de arquitectura (Mermaid o imagen) y flujo de una recomendación.
- [ ] Sección "Engineering decisions" con tradeoffs:
  - GraphQL, subscriptions para streaming, pgvector, búsqueda en Postgres, por qué se quitó ES.
- [ ] Sección "Performance" con números de B5.
- [ ] Sección "Testing & CI" con comandos, cobertura, workflows y gates.
- [ ] Sección "Known limitations / Roadmap" honesta.
- [ ] Link a LinkedIn/GitHub/email del autor arriba.
- [ ] GIF corto del demo (por cold start de Render).
- [ ] Optimizar imágenes de `assets/` a WebP (hoy ~7.5 MB, hay PNGs de ~1 MB).
- [ ] Reemplazar `backend/README.md` y `frontend/README.md` boilerplate o borrarlos.
- [ ] Corregir typos y formato del README.
- [ ] Crear `docs/ARCHITECTURE.md`, `docs/API.md` (ejemplos GraphQL), `docs/SETUP.md`,
  `docs/PERFORMANCE.md`, `docs/adr/0001-search-postgres.md`.
- [ ] Verificación final desde clon limpio, con checklist paso a paso.

### Criterio de aceptación

- Un lector puede entender qué hace el proyecto, cómo correrlo y por qué está diseñado así en
  menos de 5 minutos.
- No hay afirmaciones que el código no respalde.
- El README enlaza al demo, al autor y a los docs.

---

## B9 — Frontend (sesión separada)

**No ejecutar hasta cerrar backend y confirmar.**

Objetivo: auditar el frontend después de estabilizar el contrato GraphQL.

Temas candidatos (se detallan en su propia sesión):

- Generar tipos desde `schema.gql` con GraphQL Codegen y eliminar queries a mano.
- Revisar manejo de errores/carga, estados vacíos y accesibilidad.
- Revisar performance: imágenes, code splitting, bundle size, caché de Apollo.
- Revisar consistencia de estado (Redux vs Apollo) y lógica duplicada.
- Tests de componentes y E2E estables.
- Responsive y UX del player/modal.
- Revisar que el frontend no rompa cuando exact* venga `null` (cambio de B3).

---

## 3. Pendientes detectados (agregar acá, no arreglar fuera de bloque)

- [ ] `getLandpageSongs` y `getSongRecommendations` aceptan `limit` sin máximo.
- [ ] `SongsService` y `SearchService` repiten lógica de parseo/validación.
- [ ] `package.json` raíz contiene dependencias de backend/frontend; revisar límites del monorepo.
- [ ] `README.md` dice 196 tests; el número real es 210 (actualizar en B8).
- [ ] `backend/coverage/` existe localmente; confirmar que no se commitea.
- [ ] Revisar si `getDBLength` se usa en el frontend y con qué frecuencia.

---

## 4. Definición de terminado (por bloque)

Un bloque está terminado solo si:

1. Se cumplieron sus criterios de aceptación.
2. `npx tsc --noEmit`, `npm run lint` y `npm test` pasan.
3. Se actualizó la tabla de estado y el reporte de la sesión.
4. El usuario revisó y confirmó el bloque.
5. No quedaron cambios sin commitear ni archivos temporales.

---

## 5. Registro de sesiones

| Fecha | Bloque | Rama/PR | Tests | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | | |
