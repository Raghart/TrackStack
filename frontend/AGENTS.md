# AGENTS.md — TrackStack Frontend

Contexto específico del paquete `frontend/`. Las reglas generales del monorepo están en `../AGENTS.md` y tienen prioridad; lo específico del backend (`../backend/AGENTS.md`) no aplica aquí.

## Stack y configuración

- **React 19 + TypeScript** con **Vite 6**; el build (`tsc -b && vite build`) se escribe en `../backend/public` (artefacto generado, no editar). El `Dockerfile` del paquete sobreescribe la salida a `frontend/dist` y la sirve con Nginx (`nginx.conf`), sin tocar el flujo normal de Nest.
- **Chakra UI 3** para la UI, **Apollo Client 3** para GraphQL (HTTP + WebSocket) y **Redux Toolkit 2** para el estado global.
- **React Router 7** para las rutas.
- **Vitest 5 + Testing Library + jsdom** para unit tests. Configuración en `vitest.config.ts`; setup compartido en `src/test/setup.ts`.
- Alias `@/*` → `src/*` (definido en `tsconfig.app.json` y resuelto por `vite-tsconfig-paths` también en Vitest).
- `tsconfig.app.json` es `strict` y activa `noUnusedLocals`/`noUnusedParameters`; los tests también pasan por `tsc -b` en el build.
- **ESLint 9** (flat config) con `typescript-eslint`, `react-hooks`, `react-refresh` y `eslint-plugin-security`.

## Dónde va cada cosa

- Componentes agrupados por **feature/ruta** dentro de `src/components/<Feature>/`, no por tipo de archivo. Un componente nuevo de una feature existente vive junto a los de esa feature.
- Hooks reutilizables y hooks de página en `src/hooks/`, con nombre `useX.ts`/`useX.tsx` y export default.
- Helpers y componentes utilitarios compartidos en `src/Utils/` (p. ej. `safeParse.ts`, `redux-hooks.ts`, `ArtistLinks.tsx`).
- Documentos GraphQL en `src/queries/`, un archivo por feature. No escribas `gql` inline en componentes u hooks.
- Slices de Redux en `src/reducers/<feature>Reducer.ts`; el store se configura en `src/store.ts`.
- Tipos y validadores del cliente en `src/types/`. Los contratos que cruzan la API se importan de `@trackstack/schemas`; no los redeclares.
- Constantes de UI (labels, configuración de modales, pesos de recomendación) en `src/components/constants/`.
- Estilos dinámicos en `src/dynamicCSS/`; wrappers de Chakra en `src/components/ui/`.
- Acceso a variables de entorno únicamente a través de `src/config/env.ts`.
- Documentación detallada en `frontend/docs/*.md`; no crees `README.md` en subcarpetas (regla general en `../AGENTS.md`).

## Convenciones de código

- Usa el alias `@/...` para imports que cruzan carpetas y rutas relativas dentro de la misma feature.
- Mantén el estilo existente: `export default` en componentes y hooks de features; los wrappers de `components/ui/` y utilidades concretas conservan su export nombrado. Nombres de archivos en PascalCase para componentes y camelCase para hooks/utilidades.
- Valida las respuestas de GraphQL con los schemas de `@trackstack/schemas` y los helpers `parseDataOrUndefined` / `parseArrayOrEmpty` de `@/Utils/safeParse.ts` antes de guardarlas en Redux o pintarlas. Si el hook necesita distinguir un payload inválido de una lista vacía, usa `parseArrayWithOutcome`, que además devuelve el flag `invalid`.
- Usa `useAppDispatch` y `useAppSelector` de `@/Utils/redux-hooks.ts`; no llames a `useDispatch`/`useSelector` directamente.
- Chakra 3: usa el `toaster` de `@/components/ui/toasterInstance` y los wrappers de `components/ui/`; no uses APIs de Chakra 2 (`useToast`, etc.).
- No introduzcas `any` ni casts para sortear tipos. Si un dato externo es `unknown`, valídalo con Zod y trabaja con el tipo parseado.
- No edites `dist/`, `coverage/`, `../backend/public/`, `node_modules/` ni lockfiles (salvo cambio intencional de dependencias, gestionado con pnpm desde la raíz).
- Si un cambio afecta al contrato GraphQL, a los schemas compartidos o a la API pública, confírmalo antes de aplicarlo (ver `../AGENTS.md`).

## Apollo y estado

- Las operaciones de una feature viven en su archivo de `src/queries/`; los hooks de `src/hooks/` orquestan `useQuery`/`useLazyQuery`/`useMutation`/`useSubscription` y traducen el resultado a estado de la UI.
- `src/apolloClient.ts` divide queries (HTTP) y subscriptions (WebSocket) y define políticas `merge` para las listas paginadas (`getAllGenreSongs`, `getAllArtists`, `getAlbums`). No cambies esas políticas sin un test que cubra la paginación/infinite scroll.
- No importes `apolloClient.ts` en tests sin necesidad: al cargarse lee `VITE_GRAPHQL_URI` y `VITE_SUBSCRIPTION_URI` y crea el cliente WebSocket. Mockea `@/config/env` o los hooks de Apollo según el caso.

## Errores y UX

- El manejo de errores del frontend (Toaster, mensajes al usuario, `try/catch`, `onError` en suscripciones y deduplicación de toasts) está definido en la sección **"Manejo de errores en el frontend"** de `../AGENTS.md`. Síguela; no la dupliques aquí.
- Toma como referencia los patrones ya implementados en `useLoadRecommendations.ts` (query), `useSearchResults.ts` (estados de búsqueda y deduplicación) y `useAIStream.ts` (subscription con estado de error expuesto al componente).

## Tests

### Ubicación (regla obligatoria)

**Add specs next to the code they cover as `src/**/*.{test,spec}.{ts,tsx}`.**

- El spec va junto al archivo que prueba, en la misma carpeta: `SongCard.tsx` → `SongCard.test.tsx`; `useAudioData.ts` → `useAudioData.test.ts`; `normalizeText.ts` → `normalizeText.test.ts`.
- Convención del paquete: usa `.test.ts`/`.test.tsx` por defecto. `.spec.ts`/`.spec.tsx` también lo recoge Vitest, pero mantén un solo estilo por carpeta.
- **No** crees carpetas `src/__tests__/`, `src/tests/` ni un árbol de tests paralelo. `src/test/` se reserva para setup y helpers compartidos, no para specs.
- Los helpers de test compartidos (por ejemplo un `renderWithProviders`) y fixtures comunes pueden vivir en `src/test/`, pero los tests de un archivo siempre se colocan junto a ese archivo.

### Constantes, fixtures y mocks de una suite

- Al escribir un set de tests, agrupa sus constantes, fixtures, mocks y helpers en **un archivo propio dentro de `src/test/`**, nombrado por la feature/hook que cubre (`searchConstants.tsx`, `loadRecSetups.tsx`). El spec junto al código importa de ahí con `@/test/...`.
- **Reutiliza antes de crear**: revisa los archivos que ya existen en `src/test/` y usa sus stores, fixtures, respuestas de GraphQL y helpers de render si encajan. Si una constante sirve para varias suites, muévela a un archivo compartido en `src/test/` en lugar de duplicarla.
- No llenes `src/test/` de constantes de un solo uso: si un valor solo lo consume un `it` y es corto, déjalo en el propio spec. Promueve al archivo de la suite lo que se repita entre tests o sea voluminoso.
- `vi.mock` se hoistea al principio del módulo. Para compartir mocks entre el archivo de la suite y las fábricas de `vi.mock`, declara `const hoisted = vi.hoisted(() => ({ ... }))` **sin exportarlo**, exporta los alias con `export const { mockX } = hoisted` y referencia `hoisted.mockX` dentro de las fábricas de `vi.mock`. Exportar directamente `export const { mockX } = vi.hoisted(...)` falla con "Cannot export hoisted variable".

### Entorno de test

- Vitest corre con `environment: 'jsdom'`, `globals: true` (no hace falta importar `describe`/`it`/`expect`, aunque `vi` se importa explícitamente desde `vitest`) y `@testing-library/jest-dom/vitest` ya cargado en `src/test/setup.ts`.
- Los tests no deben depender de un backend real, PostgreSQL, WebSocket ni de `frontend/.env`. Mockea GraphQL, Apollo y las variables de entorno.
- Para componentes que usan providers, envuélvelos en un helper con `ChakraProvider value={theme}` (`src/theme.ts`), `Provider` de Redux con un store de test, `MemoryRouter` y, si aplica, `MockedProvider` de `@apollo/client/testing`.
- Para hooks, usa `renderHook` de `@testing-library/react`. Para queries/mutations, `MockedProvider`; para `useSubscription` o hooks que mezclan varias operaciones, suele ser más claro mockear `@apollo/client` con `vi.mock` y controlar `onData`/`onError`.
- Mockea `@/components/ui/toasterInstance` cuando el test compruebe notificaciones: evita portales de Chakra y permite assertar los mensajes sin depender del DOM global.
- `jsdom` no implementa reproducción de audio (`play`, `pause`, `currentTime`). Si el test toca el reproductor, stubea `HTMLMediaElement` y, si el hook depende de animación/timers, usa fake timers o stubs de `requestAnimationFrame`.
- No está instalado `@testing-library/user-event`; usa `fireEvent` salvo que se justifique y apruebe añadir la dependencia (regla de dependencias en `../AGENTS.md`).
- Limpia efectos entre tests: `vi.restoreAllMocks()`, `vi.useRealTimers()` y `cleanup` de Testing Library cuando corresponda. Evita stores, Apollo clients o suscripciones compartidos entre tests.

### Qué probar y cuándo añadir regresión

- Añade un test de regresión siempre que corrijas un bug: el caso debe fallar con el código anterior y pasar con el fix.
- Cubre especialmente:
  - reducers (`src/reducers/`) y selectores/estados derivados;
  - helpers puros (`safeParse`, `generateUserVector`, `normalizeText`, `minMaxScale`) y paginación;
  - hooks de datos y sus estados (`idle`/`loading`/`success`/`empty`/`network-error`/`invalid-payload`);
  - validación de payloads con `@trackstack/schemas` y respuestas inválidas;
  - manejo de errores, toasts y deduplicación de notificaciones;
  - rutas, `ErrorBoundary` y estados vacíos/no encontrados;
  - políticas `merge` del cache de Apollo e infinite scroll.
- Prueba comportamiento observable (texto, roles, callbacks, estado expuesto), no detalles internos de implementación.
- Reutiliza fixtures/helpers antes de duplicar setups. No debilites assertions existentes ni uses snapshots como única comprobación.
- Los E2E reales viven en `../e2e` (Playwright) y requieren backend y BD; no los ejecutes ni los sustituyas por unit tests con red real.

### Comandos de test

Desde la raíz:

```bash
# Solo el spec afectado por tu cambio
pnpm --filter ./frontend run test -- src/components/SongCard/SongCard.test.tsx

# Modo watch para el archivo concreto
pnpm --filter ./frontend exec vitest src/components/SongCard/SongCard.test.tsx

# Suite completa: solo si tocas configuración global, setup o providers compartidos
pnpm --filter ./frontend run test

# Cobertura (costosa; úsala cuando se pida o para lógica sensible)
pnpm --filter ./frontend run test:cov
```

- La cobertura se genera en `frontend/coverage/` e incluye `src/**/*.{ts,tsx}`, excluyendo `src/test/**`, `main.tsx` y `.d.ts`. No hay umbral configurado, pero evita bajar la cobertura del archivo que tocas.
- La CI actual del frontend ejecuta lint y `eslint .` (seguridad), no la suite de unit tests. No asumas que la CI valida tus specs: ejecútalos en local.

## Verificación antes de terminar

1. `pnpm --filter ./frontend run lint`
2. Ejecuta solo los specs afectados con el filtro de arriba.
3. `pnpm --filter ./frontend run build` (incluye `tsc -b`; escribe en `../backend/public`, es esperado).
4. `pnpm --filter ./frontend run test:cov` solo si el usuario lo pide o si tocaste lógica sensible.

Si el cambio añade o modifica dependencias de test, configuración de Vitest, providers globales, alias o estructura de carpetas, ejecuta la suite completa.

## Mantenimiento de este AGENTS.md

Este archivo describe cómo se trabaja en `frontend/`. **Actualízalo tú mismo cuando el cambio lo justifique; no esperes a que el usuario lo pida.**

- Tras un cambio relevante en `frontend/`, revisa si este archivo (y `../AGENTS.md` si el cambio es de alcance general) sigue siendo correcto, y corrige lo desfasado en el mismo cambio.
- Actualízalo cuando el cambio:
  - añade o mueve features, hooks, queries, reducers, tipos o carpetas importantes de `src/`;
  - cambia configuración de Vite, Vitest, Testing Library, alias, tsconfig, ESLint o scripts;
  - introduce providers globales o una convención nueva de tests (ubicación, helpers, mocks, fixtures);
  - cambia el stack del cliente (React, Chakra, Apollo, Redux, Router) o la forma de consumir GraphQL/Redux.
- Edita solo las secciones afectadas, con cambios mínimos y el mismo estilo/tono. Lo general del monorepo va en `../AGENTS.md`; lo específico de `frontend/`, aquí. No dupliques reglas en ambos archivos.
- **No** lo actualices por cambios triviales, fixes internos que no alteran convenciones, comandos ni patrones, ni por refactors que no cambian cómo se trabaja en el paquete.
- Si dudas de si merece actualización, decide con criterio y dilo en el resumen final (qué revisaste y por qué no cambiaste nada).
