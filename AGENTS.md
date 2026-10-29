# AGENTS.md — TrackStack

## Descripción del proyecto

**TrackStack** es una aplicación web de recomendación musical. Combina:

- Búsqueda avanzada con **Elasticsearch** (fuzzy search, n-grams, edge-ngrams).
- Reproductor de previews de 30 s.
- Recomendaciones personalizadas mediante **vectores construidos con metadata de canciones** (energía, danceability, mood, etc.) y pesos ajustables por el usuario.
- Respuestas de IA en streaming vía **GraphQL Subscriptions** (WebSocket), con un sistema basado en principios **RAG** sobre un catálogo de +50 000 canciones.
- Catálogo persistido en **PostgreSQL** (modelos **Sequelize**) y +30 000 documentos indexados en Elasticsearch.

Arquitectura general: monorepo **pnpm workspaces** con un backend **NestJS + GraphQL (Apollo)** que también sirve el build estático del frontend, un frontend **React 19 + Vite + Chakra UI + Redux Toolkit + Apollo Client**, y un paquete compartido de **schemas Zod**. Los tests E2E viven en un paquete **Playwright** independiente.

## Project layout

```text
TrackStack/
├── backend/                  # API NestJS + GraphQL
│   ├── src/                  # código de la aplicación
│   │   ├── <dominio>/        # songs, albums, artists, genres,
│   │   │                     # song_artists, song_genres, song_details, search
│   │   │   ├── *.module.ts
│   │   │   ├── *.resolver.ts # queries/subscriptions GraphQL
│   │   │   ├── *.service.ts  # lógica de negocio y acceso a datos
│   │   │   ├── *.spec.ts     # tests unitarios junto al código
│   │   │   └── dto/          # @ObjectType / @Field (contratos GraphQL)
│   │   ├── types/            # tipos de atributos, guards y parsers
│   │   ├── utils/            # helpers (safeQuery, safeSearch, paginación…)
│   │   ├── app.module.ts     # wiring global (Sequelize, GraphQL, estáticos)
│   │   └── main.ts           # bootstrap, CORS, puerto
│   ├── models/               # modelos Sequelize (uno por dominio)
│   ├── test/                 # fixtures/datos compartidos por los tests
│   ├── database/             # SQL, configuración y utilidades de BD
│   └── public/               # build del frontend servido por el backend (generado)
├── frontend/                 # SPA React + Vite
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
```

Por paquete:

```bash
# backend
pnpm --filter ./backend run lint
pnpm --filter ./backend run test          # Jest
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

> Los tests E2E y parte de los tests de integración requieren servicios externos (PostgreSQL, Elasticsearch) y variables de entorno. No los ejecutes asumiendo que existen: comprueba primero y reporta si faltan.

## Pautas generales

### Alcance y cambios

- Haz cambios **mínimos y enfocados** al objetivo. Evita refactors amplios, renombrados masivos o reformateos de archivos no relacionados.
- Respeta el estilo existente aunque no sea perfecto: nombres, estructura de carpetas, `snake_case` en campos de API/DTOs, mayúsculas irregulares en algunos archivos. No "corrijas" convenciones existentes sin pedirlo.
- No modifiques archivos generados ni artefactos: `backend/dist/`, `backend/coverage/`, `backend/public/`, `node_modules/`, `pnpm-lock.yaml` ni `package-lock.json` (salvo que cambien dependencias de forma intencional). El lockfile canónico es `pnpm-lock.yaml`; reglénalo con `pnpm` y no a mano.
- No borres ni reescribas trabajo del usuario que no entiendas. Investiga antes de tocar archivos ajenos al cambio.
- Si un cambio afecta el contrato GraphQL, la estructura de la base de datos o la API pública, explícalo y confírmalo antes de aplicarlo.

### Dependencias

- Instala en la raíz con pnpm para los workspaces (`backend`, `frontend`, `schemas`): `pnpm add <paquete>` (o `pnpm add -D <paquete>`), y para un paquete concreto `pnpm --filter ./backend add <paquete>`.
- No uses `npm install` en la raíz: npm y pnpm comparten `node_modules` y mezclar ambos deja el árbol inconsistente.
- `e2e/` **no** es un workspace: sus dependencias se instalan dentro de `e2e/` (con npm y su propio lockfile).
- Justifica cualquier dependencia nueva y evita duplicar librerías que ya cubran la necesidad.
- Los scripts de instalación (`postinstall`…) están bloqueados por defecto en `pnpm-workspace.yaml` (`allowBuilds`). Si una dependencia legítima necesita compilar binarios, añádela con `pnpm approve-builds` y justifícalo.

### Nota sobre documentación de planificación

`PLAN_MEJORAS.md` y `TODO.md` son **notas personales del autor** sobre trabajo futuro. No son especificaciones ni fuentes de verdad para el agente: no deben editarse, ni usarse para decidir cambios, ni asumirse como requisitos salvo que el usuario lo pida explícitamente.