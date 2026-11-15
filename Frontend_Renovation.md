# Plan de renovación del frontend

**Objetivo:** hacer que el frontend falle de forma controlada cuando los datos externos no cumplen el contrato, y dejar una red de tests que permita seguir tocando la app sin miedo.

**Alcance:** validación de datos, manejo de errores y tests. No incluye rediseño visual ni cambios de UX.

---

## Punto de partida

Lo que ya está bien:

- La mayoría de respuestas GraphQL pasan por Zod (`songResponseSchema`, `albumResponseSchema`, etc.).
- Los contratos compartidos viven en `schemas/zod.schemas.ts`.
- Las consultas están centralizadas en hooks y en `apolloClient.ts`.

Lo que falta:

- Las **entradas** (variables GraphQL, params de ruta, variables de entorno) no se validan.
- Los schemas son laxos con **URLs, IDs, años y duraciones**.
- La suscripción de IA usa un schema pensado para strings normales.
- Muchos hooks hacen `.parse()` directo: un payload inválido puede romper la pantalla.
- No hay tests ni en `schemas/` ni en `frontend/`.

Regla para todo el plan: cada paso debe terminar con `pnpm --filter ./frontend run build` en verde. Si tocas `schemas/`, añade también `pnpm --filter ./schemas exec tsc -p tsconfig.json --noEmit` y los tests del backend.

---

## Fase 0 — Decidir cómo falla la app

### Paso 1. Elegir una política de validación única

**Objetivo:** que un dato inválido no tumbe la aplicación entera.

**Decisión recomendada:** `safeParse` + fallback local (`null`, `[]` o el dato anterior) y un `ErrorBoundary` global solo como última red. No usar `.parse()` suelto en render.

**Cambios:**

- Documentar la decisión en este archivo o en `frontend/README.md`.
- Revisar los hooks que hoy usan `.parse()` y marcarlos para migrar.

**Terminado cuando:** está claro qué hace la app ante un payload inválido y no hay discusión abierta sobre el tema.

---

## Fase 1 — Cimientos de validación

### Paso 2. Crear helpers de parseo seguro

**Objetivo:** no repetir `try/catch` y `safeParse` en cada hook.

**Cambios:**

- Crear `frontend/src/components/Utils/safeParse.ts` con dos helpers:
  - `parseOrFallback(schema, value, fallback)`: devuelve el dato validado o el fallback.
  - `parseArrayOrEmpty(schema, value)`: atajo para listas.
- Registrar el error de validación con `console.error` incluyendo el nombre del schema.
- Tipar los helpers con `ZodType` para que funcionen con cualquier schema.

**Terminado cuando:** los hooks nuevos y los migrados usan estos helpers en lugar de `.parse()` directo.

### Paso 3. Añadir un ErrorBoundary global

**Objetivo:** si algo se escapa igualmente, el usuario ve un fallback y no una pantalla en blanco.

**Cambios:**

- Crear `frontend/src/components/Error/ErrorBoundary.tsx`.
- Envolver `<App />` en `main.tsx`.
- Reutilizar `NotFound` o un mensaje simple con opción de recargar.

**Terminado cuando:** un error de render muestra el boundary y la app sigue navegable.

---

## Fase 2 — Endurecer los contratos compartidos

> Todo lo de esta fase toca `schemas/zod.schemas.ts` y afecta también al backend. Hazlos de uno en uno y ejecuta los tests del backend al terminar cada paso.

### ~~Paso 4. Añadir primitivas estrictas~~

**Objetivo:** dejar de usar `floatNumberSchema` para todo.

**Cambios:**

- `positiveIntSchema`: entero mayor que 0. Para IDs.
- `yearSchema`: entero dentro de un rango razonable (por ejemplo 1900–2100).
- `durationSchema`: número finito y positivo.
- `floatNumberSchema`: añadir `Number.isFinite` para rechazar `"Infinity"` y valores raros.
- `stringSchema`: valorar `trim()` y una longitud máxima para textos que vienen de fuera.

**Terminado cuando:** las primitivas existen, están tipadas y probadas con casos válidos e inválidos.

### ~~Paso 5. Validar URLs antes de usarlas~~

**Objetivo:** no meter cualquier string en `src`, CSS o `<audio>`.

**Cambios:**

- Crear `httpUrlSchema`: `URL` válida y protocolo `http:` o `https:`.
- Aplicarlo a `url_preview`, `album_cover` y `url_image` en los schemas de respuesta.
- Añadir `spotifyIdSchema` con patrón de ID de Spotify (22 caracteres alfanuméricos) y usarlo en `spotify_id`.
- No aceptar `data:` salvo que se decida explícitamente.

**Terminado cuando:** una URL inválida o `javascript:` no pasa la validación y el componente degrada sin romperse.

### ~~Paso 6. Corregir los campos numéricos de las respuestas~~

**Objetivo:** que los tipos del schema reflejen la realidad del backend.

**Cambios:**

- `songResponseSchema.id` → `positiveIntSchema`.
- `fullSongResponseSchema.year` → `yearSchema`.
- `fullSongResponseSchema.duration` → `durationSchema`.
- Revisar los `z.number()` de `songDetailsSchema` y de las referencias (`albumReferenceSchema`, `artistReferenceSchema`, `genreReferenceSchema`): los IDs deben ser enteros positivos.
- Mantener `floatNumberSchema` solo donde de verdad se acepta un string numérico.

**Terminado cuando:** IDs, años y duraciones rechazan negativos, decimales y strings no numéricos.

### ~~Paso 7. Resolver el contrato de `multipleSearchResultsSchema`~~

**Objetivo:** que schema, backend y UI digan lo mismo.

**Problema:** el schema exige `exactArtist`, `exactAlbum` y `exactSong`, pero el backend puede devolver `undefined` y la UI ya comprueba si existen.

**Cambios:**

- Decidir el contrato real. Recomendado: los tres campos `optional()` o `nullable()`.
- Alinear `SearchResults` para que no tenga guardas duplicadas si al final son obligatorios.
- Añadir un test de contrato con resultados completos, sin artista, sin álbum y sin canción.

**Terminado cuando:** los tres lados aceptan el mismo conjunto de respuestas.

### ~~Paso 8. Crear el schema del stream de IA~~

**Objetivo:** que un chunk vacío o nulo no lance una excepción dentro de la suscripción.

**Cambios:**

- En `schemas/`, añadir un schema específico para el payload que emite `aiResponse`.
- Definir explícitamente qué se acepta: texto no vacío, cadena vacía, `null` o `undefined`.
- Si el contrato garantiza chunks no vacíos, dejar un schema estricto para el chunk; si no, normalizar a `""` y acumular.
- No reutilizar `stringSchema` para el stream.

**Terminado cuando:** un chunk vacío o nulo se ignora sin romper y hay tests para los cuatro casos.

### ~~Paso 9. Documentar `songRecommendationsSchema`~~

**Objetivo:** evitar que alguien use el schema equivocado.

**Cambios:**

- Añadir un comentario en `schemas/zod.schemas.ts`: `songRecommendationsSchema` modela la fila cruda de la función SQL y lo consume el backend; el frontend usa `songResponseSchema`.

**Terminado cuando:** queda claro en el código qué schema usa cada capa.

---

## Fase 3 — Validar las entradas del frontend

### ~~Paso 10. Validar los parámetros de ruta~~

**Objetivo:** no enviar `NaN` ni basura a GraphQL.

**Cambios:**

- `useSongDetails`: validar `songId` con `positiveIntSchema` antes de crear la query. Si no es válido, no consultar y devolver `null`.
- `useGetSongCover`: cambiar `floatNumberSchema` por `positiveIntSchema`.
- `useDetailFilter` / `DetailsLayout`: dejar la validación de `album` y `artist` en un único sitio, con `stringSchema` + `trim()`.
- `GenreDetails`: separar “género válido de ruta” (string no vacío) de “género con icono” (lista local de UI).
- Revisar enlaces de género que no usan `encodeURIComponent`: `GenreCard.tsx`, `GenreBarBtns.tsx` y `GenreBtn.tsx`.

**Terminado cuando:** `/songs/abc`, `/songs/1.5` o una ruta sin parámetro no disparan ninguna petición.

### ~~Paso 11. Validar las variables GraphQL antes de enviarlas~~

**Objetivo:** que el frontend no envíe datos que el backend no espera.

**Cambios:** crear schemas para las variables que se envían:

- ID de canción: entero positivo.
- Query de búsqueda: string con `trim`, longitud mínima y máxima.
- Paginación: `page >= 1` y `limit` dentro de un rango razonable.
- Seed: string numérico válido.
- Género: string no vacío.
- Vector de usuario: exactamente 8 números finitos, dentro de los rangos que genera `generateUserVector`.
- Petición de recomendaciones: objeto `{ genres, userVector, limit }`.

Aplicarlos en `useSearchResults`, `useLoadRec`, `useGenreSongs`, `useArtistBar`, `useGetAlbumCards`, `useGetDetailSongs` y `useStraySong`.

**Terminado cuando:** un vector incompleto, un `limit` absurdo o una query vacía no llegan a la red.

### ~~Paso 12. Validar las variables de entorno al arrancar~~

**Objetivo:** fallar al inicio con un mensaje claro, no cuando el usuario ya está usando la app.

**Cambios:**

- Crear `frontend/src/config/env.ts` (schema local, no en `schemas/`).
- Validar `VITE_GRAPHQL_URI` como URL `http/https`.
- Validar `VITE_SUBSCRIPTION_URI` como URL `ws/wss`.
- Importarlo desde `apolloClient.ts` para que el fallo ocurra en el arranque.
- Añadir un `.env.example` si no existe.

**Terminado cuando:** una variable ausente o con protocolo incorrecto detiene la app con un error legible.

---

## Fase 4 — Arreglar los hooks más frágiles

### ~~Paso 13. `useSongDetails`: validar una sola vez~~

**Objetivo:** quitar el doble parseo y proteger la entrada.

**Cambios:**

- Validar `songId` antes de la query.
- Eliminar el parseo de `onCompleted` o el del render; dejar uno solo.
- Usar `parseOrFallback` con `null` como fallback.
- No mutar el store con datos inválidos.

**Terminado cuando:** la canción se carga una vez, el store recibe datos válidos y un ID inválido no genera petición.

### ~~Paso 14. `useLoadRec`: manejar éxito, vacío y error~~

**Objetivo:** que el modal no se quede cargando para siempre.

**Cambios:**

- Envolver la query en `try/catch/finally`.
- `setLoading(false)` y `setOpen(false)` en `finally` o en la rama correcta.
- Validar la respuesta con `parseOrFallback(..., [])`.
- Estado de error visible para el usuario.
- No navegar si la respuesta está vacía o es inválida.

**Terminado cuando:** una query fallida o un payload inválido dejan el modal cerrado con un mensaje, no en loading infinito.

### ~~Paso 15. `useSongRec`: suscripción robusta~~

**Objetivo:** que la IA no rompa la pantalla ni se quede sin respuesta.

**Cambios:**

- Usar el schema del Paso 8 en `onData`.
- Ignorar chunks vacíos o nulos sin lanzar.
- Añadir `onError` y un estado `error`.
- Resetear `aiResponse` cuando cambien los géneros o el vector.
- Exponer el error al componente que pinta la respuesta.

**Terminado cuando:** funciona con chunks válidos, vacíos y nulos, y un fallo de WebSocket muestra un estado controlado.

### ~~Paso 16. `useSearchResults`: distinguir los tipos de fallo~~

**Objetivo:** que “sin resultados” no signifique “algo se rompió”.

**Cambios:**

- Separar `error de red`, `payload inválido` y `sin resultados` en el reducer o en el estado local.
- Asegurar que `setIsLoading(false)` se ejecuta en todos los caminos.
- Usar el helper de parseo seguro.
- Mantener el debounce de 400 ms.

**Terminado cuando:** cada caso tiene un estado distinto y testeable.

### ~~Paso 17. Blindar el consumo de URLs en audio e imágenes~~

**Objetivo:** que las URLs validadas en el Paso 5 se usen de forma segura.

**Cambios:**

- `useSongState`: comprobar `activeSong.url_preview` antes de asignarlo a `audio.src`.
- Componentes de imagen: usar `album_cover` / `url_image` ya validados y aplicar un fallback si faltan.
- `SongInfoLayout`: construir el enlace de Spotify solo si `spotify_id` cumple el patrón.

**Terminado cuando:** una URL inválida no se asigna al `<audio>` ni se pinta como imagen o enlace.

---

## Fase 5 — Tests

### Paso 18. Montar la infraestructura de tests

**Objetivo:** poder testear schemas y hooks.

**Cambios:**

- Añadir a `frontend/`:
  - `vitest`
  - `@testing-library/react`
  - `@testing-library/jest-dom`
  - `jsdom`
- Configurar `vitest.config.ts` y un `setupTests.ts`.
- Añadir scripts `test` y `test:cov` en `frontend/package.json`.
- Configurar Vitest en `schemas/` (o un script que ejecute los tests desde la raíz).

**Terminado cuando:** `pnpm --filter ./frontend run test` y los tests de `schemas` arrancan aunque sea con un test trivial.

### Paso 19. Tests de schemas (primera red de seguridad)

**Objetivo:** proteger el contrato compartido sin necesitar navegador ni base de datos.

**Casos mínimos:**

- `songResponseSchema`, `fullSongResponseSchema`, `albumResponseSchema`, `artistResponseSchema`: válidos e inválidos.
- `multipleSearchResultsSchema`: completo, sin artista, sin álbum, sin canción y arrays vacíos.
- URLs: `javascript:`, vacías, texto plano, `http` y `https`.
- IDs: negativos, decimales y strings numéricos.
- Chunks de IA: texto, vacío, `null` y `undefined`.
- Vector de usuario: 8 valores, longitudes incorrectas, `NaN` e `Infinity`.

**Terminado cuando:** los schemas tienen tests y cualquier cambio de contrato rompe un test.

### Paso 20. Tests de hooks con Apollo `MockedProvider`

**Orden recomendado (de más rentable a menos):**

1. `useSearchResults`: query válida, payload inválido, error de red y debounce.
2. `useLoadRec`: éxito, respuesta vacía, parse fallido y variables correctas.
3. `useSongRec`: chunks válidos, vacío/nulo, error de suscripción y acumulación de texto.
4. `useSongDetails`: ID válido, inválido, `undefined` y respuesta inválida.
5. `useGetSongCover`: ruta válida, ruta inválida y que no se dispare la query.
6. `useGetDetailSongs`, `useGenreSongs`, `useArtistBar` y `useGetAlbumCards`: carga, paginación y datos inválidos.
7. `useSongState` / `useAudioData`: mockear `<audio>` y comprobar `src`, `play`, `pause`, `currentTime` y `volume`.

**Terminado cuando:** los cinco primeros hooks tienen tests y cubren sus caminos de error.

### Paso 21. Tests de la caché de Apollo

**Objetivo:** proteger los `merge` de `apolloClient.ts`, que asumen arrays y argumentos válidos.

**Cambios:**

- Testear `getAllGenreSongs`, `getAllArtists` y `getAlbums` con paginación.
- Comprobar que no se duplican ni se pierden elementos al cambiar de página.

**Terminado cuando:** un cambio en `typePolicies` que rompa la paginación falla en un test.

### Paso 22. Smoke tests E2E

**Objetivo:** comprobar los flujos completos, no usarlos como primera red de seguridad.

**Cambios:** en `e2e/`, cubrir:

- La home carga canciones.
- La búsqueda devuelve resultados.
- Navegación a detalle de canción, artista, álbum y género.
- Reproducir y pausar.
- Flujo de recomendaciones con IA.

**Terminado cuando:** los smoke tests pasan contra un entorno con PostgreSQL y variables configuradas.

### Paso 23. Limpieza final

**Objetivo:** dejar el proyecto sin ruido.

**Cambios:**

- Eliminar `spotify-preview-finder` de `frontend/package.json` si se confirma que no se usa (hoy no se importa en `frontend/src`).
- Actualizar `frontend/README.md` con los scripts de test y las variables de entorno.
- Revisar que no queden `.parse()` directos en hooks sin justificación.

**Terminado cuando:** no quedan dependencias muertas ni documentación desactualizada.

---

## Resumen del orden

1. Política de fallo.
2. Helpers de parseo seguro.
3. ErrorBoundary.
4. Primitivas estrictas.
5. URLs seguras.
6. Campos numéricos.
7. Contrato de búsqueda.
8. Schema de IA.
9. Documentar schema de recomendaciones.
10. Params de ruta.
11. Variables GraphQL.
12. Variables de entorno.
13. `useSongDetails`.
14. `useLoadRec`.
15. `useSongRec`.
16. `useSearchResults`.
17. URLs en audio e imágenes.
18. Infraestructura de tests.
19. Tests de schemas.
20. Tests de hooks.
21. Tests de caché de Apollo.
22. Smoke tests E2E.
23. Limpieza final.

**Si solo puedes hacer una cosa:** empieza por los pasos 2, 3 y 4. Sin una estrategia de fallo y primitivas fiables, el resto de validaciones solo mueve el problema de sitio.
