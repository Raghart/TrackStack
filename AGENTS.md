# AGENTS.md — TrackStack

## Descripción del proyecto

**TrackStack** es una aplicación web de recomendación musical. Combina:

- Búsqueda de canciones, artistas y álbumes directamente sobre **PostgreSQL** (sin motor de búsqueda externo), con `pg_trgm` + `unaccent`, índices GIN de trigramas y funciones de ranking SQL (`search_songs`, `search_artists`, `search_albums`).
- Reproductor de previews de 30 s.
- Recomendaciones personalizadas mediante **vectores construidos con metadata de canciones** (energía, danceability, mood, etc.) y pesos ajustables por el usuario.
- Respuestas de IA en streaming vía **GraphQL Subscriptions** (WebSocket), con un sistema basado en principios **RAG** sobre un catálogo de +50 000 canciones.
- Catálogo de +50 000 canciones persistido en **PostgreSQL** con modelos **Sequelize**.

Arquitectura general: monorepo **pnpm workspaces** con un backend **NestJS + GraphQL (Apollo)** que también sirve el build estático del frontend, un frontend **React 19 + Vite + Chakra UI + Redux Toolkit + Apollo Client**, y un paquete compartido de **schemas Zod**. Los tests E2E viven en un paquete **Playwright** independiente.

## Project layout

```text
TrackStack/
├── README.md                 # introducción del proyecto (enlaza a backend/frontend)
├── backend/                  # API NestJS + GraphQL (tiene README.md propio)
│   ├── src/                  # código de la aplicación
│   │   ├── <dominio>/        # songs, albums, artists, genres,
│   │   │                     # song_artists, song_genres, song_details, search
│   │   │   ├── *.module.ts
│   │   │   ├── *.resolver.ts # queries/subscriptions GraphQL
│   │   │   ├── *.service.ts  # lógica de negocio y acceso a datos
│   │   │   ├── *.spec.ts     # tests unitarios junto al código
│   │   │   └── dto/          # @ObjectType / @Field (contratos GraphQL)
│   │   ├── types/            # tipos de atributos, guards y parsers
│   │   ├── utils/            # helpers (safeQuery, paginación…)
│   │   ├── app.module.ts     # wiring global (Sequelize, GraphQL, estáticos)
│   │   └── main.ts           # bootstrap, CORS, puerto
│   ├── models/               # modelos Sequelize (uno por dominio)
│   ├── test/                 # fixtures/datos compartidos por los tests
│   ├── database/             # Prisma: schema, migraciones y configuración
│   └── public/               # build del frontend servido por el backend (generado)
├── frontend/                 # SPA React + Vite (tiene README.md propio)
│   └── src/
│       ├── components/       # componentes agrupados por feature/ruta
│       │   └── Utils/hooks/  # custom hooks reutilizables
│       ├── queries/          # documentos GraphQL (gql)
│       ├── reducers/         # slices de Redux Toolkit
│       ├── types/            # tipos y validadores del cliente
│       ├── dynamicCSS/       # estilos dinámicos
│       ├── apolloClient.ts   # split HTTP/WebSocket para subscriptions
│       ├── store.ts          # configuración de Redux
│       └── App.tsx           # rutas de React Router
├── schemas/                  # @trackstack/schemas — Zod compartido (en migración)
├── e2e/                      # Playwright (paquete aparte, fuera de workspaces)
├── .github/workflows/        # CI, CD y health check
├── assets/                   # imágenes usadas por el README
├── PLAN_MEJORAS.md           # notas personales del autor (ver nota)
└── TODO.md                   # notas personales del autor (ver nota)
```

## Comandos

El gestor es **pnpm** (versión fijada en `packageManager` de `package.json`). El workspace está definido en `pnpm-workspace.yaml` (`backend`, `frontend`, `schemas`) y las dependencias se resuelven desde `pnpm-lock.yaml`.

Desde la raíz del repo:

```bash
pnpm install                # instala los workspaces (backend, frontend, schemas)

pnpm run dev:backend        # NestJS en modo watch
pnpm run dev:frontend       # Vite dev server
pnpm run build:frontend     # build del frontend -> backend/public
pnpm run build:backend      # compila NestJS -> backend/dist
pnpm run start:prod         # ejecuta backend compilado
pnpm run test:backend       # tests del backend (Vitest)
pnpm run test:schemas       # tests de los schemas compartidos (Vitest)
```

Por paquete:

```bash
# backend
pnpm --filter ./backend run lint
pnpm --filter ./backend run test          # Vitest
pnpm --filter ./backend run test:cov
pnpm --filter ./backend run format        # Prettier

# frontend
pnpm --filter ./frontend run lint
pnpm --filter ./frontend run build        # tsc -b && vite build
```

E2E (paquete aparte, **fuera** del workspace de pnpm; instalar dependencias dentro de `e2e/`):

```bash
cd e2e
npm ci
npm run test
npm run test:report
```

> Los tests E2E y parte de los tests de integración requieren servicios externos (PostgreSQL) y variables de entorno. No los ejecutes asumiendo que existen: comprueba primero y reporta si faltan.

## Pautas generales

### Alcance y cambios

- Haz cambios **mínimos y enfocados** al objetivo. Evita refactors amplios, renombrados masivos o reformateos de archivos no relacionados.
- Respeta el estilo existente aunque no sea perfecto: nombres, estructura de carpetas, `snake_case` en campos de API/DTOs, mayúsculas irregulares en algunos archivos. No "corrijas" convenciones existentes sin pedirlo.
- No modifiques archivos generados ni artefactos: `backend/dist/`, `backend/coverage/`, `backend/public/`, `node_modules/`, `pnpm-lock.yaml` ni `package-lock.json` (salvo que cambien dependencias de forma intencional). El lockfile canónico es `pnpm-lock.yaml`; reglénalo con `pnpm` y no a mano.
- No borres ni reescribas trabajo del usuario que no entiendas. Investiga antes de tocar archivos ajenos al cambio.
- Si un cambio afecta el contrato GraphQL, la estructura de la base de datos o la API pública, explícalo y confírmalo antes de aplicarlo.

### Documentación (READMEs)

La documentación pública se reparte en **exactamente tres** `README.md`:

- `README.md` (raíz): introducción del proyecto, demo, stack, quick start y enlaces a los READMEs de los paquetes.
- `backend/README.md`: arquitectura, API GraphQL, base de datos, variables de entorno y comandos del backend.
- `frontend/README.md`: features, rutas, estado, Apollo, variables de entorno y comandos del frontend.

Reglas:

- **No crees `README.md` en subcarpetas** (`backend/database/`, `backend/src/utils/`, etc.). Los únicos tres permitidos son los de arriba.
- La documentación detallada de una subcarpeta va en `backend/docs/<tema>.md` o `frontend/docs/<tema>.md`. Si un subdirectorio necesita documentación, añade una sección al README de su paquete o un archivo en su `docs/`, nunca un `README.md` nuevo.
- Mantén los tres READMEs enlazados entre sí y actualiza el del paquete correspondiente cuando cambien comandos, variables de entorno, contrato GraphQL, rutas o estructura.
- No repitas contenido en los READMEs, si una seccion se ve demasiado grande seria mejor solo colocar una breve introduccion de ese campo y dejar un link para una seccion con mas informacion en docs/*.md.

### Mantenimiento de este AGENTS.md

Estos archivos son documentación viva: si se quedan obsoletos, las siguientes sesiones trabajan con información incorrecta. **No esperes a que el usuario te pida actualizarlos.**

- Al terminar un cambio **relevante**, revisa si `AGENTS.md` (raíz) y `backend/AGENTS.md` siguen describiendo la realidad del repo. Actualiza lo que haya quedado desfasado como parte del mismo cambio, no en una tarea aparte.
- Actualiza la documentación cuando el cambio:
  - añade, elimina o mueve un dominio, paquete o carpeta importante del layout;
  - añade o cambia scripts/comandos, el gestor de paquetes o el flujo de verificación;
  - introduce o cambia una dependencia relevante del stack, configuración global (lint, Vitest, tsconfig, CI) o el modo de arrancar/buildear;
  - establece o modifica una convención que el agente deba seguir (estructura de archivos, dónde viven los tipos, manejo de errores, patrones de tests);
  - cambia el contrato GraphQL, el esquema de la base de datos o la forma de consumir la API de un modo que afecte a cómo se trabaja en el repo.
- Cómo hacerlo:
  - Edita **solo las secciones afectadas**, con cambios mínimos y en el mismo idioma/estilo/tono que el resto del archivo.
  - Mantén la separación: las reglas del monorepo van en `AGENTS.md`; lo específico del paquete va en `backend/AGENTS.md`. No dupliques una regla en ambos.
  - Corrige o elimina la información obsoleta en lugar de añadir una nota que la contradiga.
  - No reescribas ni reorganices el archivo completo sin necesidad.
- **No** hace falta actualizarlos por cambios triviales ni por refactors internos que no cambian cómo se trabaja en el repo (p. ej. un fix de bug que no altera convenciones ni comandos).
- Si no está claro si el cambio merece una actualización, decide con criterio y **indícalo en el resumen final**: qué revisaste y por qué no lo actualizaste.

### Dependencias

- Instala en la raíz con pnpm para los workspaces (`backend`, `frontend`, `schemas`): `pnpm add <paquete>` (o `pnpm add -D <paquete>`), y para un paquete concreto `pnpm --filter ./backend add <paquete>`.
- No uses `npm install` en la raíz: npm y pnpm comparten `node_modules` y mezclar ambos deja el árbol inconsistente.
- `e2e/` **no** es un workspace: sus dependencias se instalan dentro de `e2e/` (con npm y su propio lockfile).
- Justifica cualquier dependencia nueva y evita duplicar librerías que ya cubran la necesidad.
- Los scripts de instalación (`postinstall`…) están bloqueados por defecto en `pnpm-workspace.yaml` (`allowBuilds`). Si una dependencia legítima necesita compilar binarios, añádela con `pnpm approve-builds` y justifícalo.

### Schemas compartidos (`schemas/`)

- Los contratos de datos que cruzan la API se declaran en `schemas/zod.schemas.ts` (paquete `@trackstack/schemas`) y se importan como `import { songResponseSchema } from '@trackstack/schemas'` desde backend y frontend.
- El resto de archivos del paquete se importan por su subruta, sin rutas relativas profundas: `import { stringSchema } from '@trackstack/schemas/zod.parsers'` o `import { songSchema } from '@trackstack/schemas/zod.dbSchemas'`. Los `exports` de `schemas/package.json` exponen el nombre de cada archivo (y un comodín `./*`) para que backend y frontend los resuelvan igual.
- Ese archivo contiene los schemas Zod de las funciones `parse*` de `backend/src/types/parses.ts` (y los primitivos/entidades que usan). Se migrará a ellos por partes: mientras la migración no se complete, los parsers siguen siendo la implementación activa.
- Usa Zod 4 (ya instalado en los tres workspaces) y `z.looseObject` para no descartar campos extra que los parsers actuales devuelven tal cual.
- `schemas/tsconfig.json` tiene `strict: true`, por lo que `noImplicitAny` está habilitado. Tipa **explícitamente** los parámetros de callbacks como `.refine`, `.transform`, `.superRefine`, etc. (por ejemplo, `(value: string) => ...` o `(value: number | string) => ...`); no dejes que el tipo se infiera a `any` y evita anotar `unknown` si luego necesitas el tipo real en la transformación.
- Al añadir o cambiar un parser o un contrato GraphQL, actualiza también su schema en `schemas/`; no dupliques validaciones nuevas en `backend/src/types` ni en `frontend/src/types`.
- Antes de dar por terminado un cambio en `schemas/`, comprueba los tipos con `pnpm --filter ./schemas exec tsc -p tsconfig.json --noEmit` y ejecuta sus tests con `pnpm run test:schemas`.

### Nota sobre documentación de planificación

`PLAN_MEJORAS.md` y `TODO.md` son **notas personales del autor** sobre trabajo futuro. No son especificaciones ni fuentes de verdad para el agente: no deben editarse, ni usarse para decidir cambios, ni asumirse como requisitos salvo que el usuario lo pida explícitamente.
