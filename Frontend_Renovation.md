Reconocimiento del frontend: flujos externos y cobertura Zod No he modificado nada. Esto es solo análisis.

1. Resumen ejecutivo
Sí, hay varios flujos que cruzan una frontera externa, y ya hay bastante Zod aplicado en las respuestas GraphQL, más de lo que parece a primera vista. El problema no es tanto “falta Zod” como:
    1. La validación no es uniforme: algunos hooks usan parse, otros no validan nada, y los errores de validación no siempre se manejan.
    2. Solo se validan respuestas, no entradas: variables GraphQL, parámetros de ruta y variables de entorno quedan sin contrato.
    3. Los schemas de respuesta son demasiado laxos en campos sensibles: URLs, IDs, años, duraciones y el chunk de IA.
    4. parse se ejecuta en render o en callbacks sin una estrategia común de fallback, así que un payload inválido puede romper el componente en vez de degradar de forma controlada.
    5. No hay infraestructura de tests en el frontend ni tests de los schemas compartidos, que es justo donde empezaría a construir la red de seguridad.

2. Flujos que interactúan con el exterior
2.1 GraphQL por HTTP
Es el flujo principal. Todas las consultas pasan por frontend/src/apolloClient.ts y HttpLink.
Flujo	Query	Hook / consumidor	Validación actual
Canciones de portada	getLandpageSongs	useLandpageSongs	songResponseSchema.array().parse
Contador total	getDBLength	useGetCount	floatNumberSchema.parse
Géneros disponibles	getAllGenres	useGenreBtns	stringSchema.array().parse
Artistas paginados	getAllArtists	useArtistBar, useGetArtistCards	artistResponseSchema.array().parse
Álbumes paginados	getAlbums	useGetAlbumCards	albumResponseSchema.array().parse
Canciones por género	getAllGenreSongs	useGenreSongs	songResponseSchema.array().parse
Canciones por artista/álbum	getAllArtistSongs, getAllAlbumSongs	useGetDetailSongs	songResponseSchema.array().parse
Detalle de canción	getSongData	useSongDetails, useGetSongCover	fullSongResponseSchema.parse
Búsqueda múltiple	multipleSearch	useSearchResults	multipleSearchResultsSchema.parse dentro de try/catch
Recomendaciones	getSongRecommendations	useLoadRec	songResponseSchema.array().parse
Canción aleatoria	getRandomSong	useStraySong	songResponseSchema.parse
Siguiente/anterior	getNextSong, getPreviousSong	useLoadNextSong, useLoadPriorSong	songResponseSchema.parse

Conclusión: la capa de respuesta HTTP está razonablemente cubierta. Lo que falta es:
- Un patrón común de safeParse + fallback/estado de error en vez de .parse() directo.
- Validar también las variables de entrada antes de enviarlas.
- Definir qué pasa cuando el schema falla: ¿se muestra NotFound, se mantiene el dato anterior, se corta la petición?
2.2 GraphQL por WebSocket: la suscripción de IA
Archivo: frontend/src/components/Utils/hooks/useSongRec.tsx.
Es el flujo más delicado porque:
- El servidor emite chunks de texto (aiResponse).
- El backend tipa internamente el chunk como string | undefined.
- El frontend hace stringSchema.parse(data.data.aiResponse).
- stringSchema rechaza la cadena vacía, y no contempla undefined/null.
Riesgos:
- Un chunk vacío o nulo lanza excepción dentro de onData.
- No hay onError ni estado de error de la suscripción.
- aiResponse se acumula sin resetear explícitamente si cambian los genes/vector.
- Si el parse falla, no hay un mensaje controlado para el usuario.
Aquí sí recomendaría un schema específico nuevo en schemas/, por ejemplo un schema de payload de suscripción que admita null/ vacío y un schema de chunk no vacío solo si el contrato lo garantiza.
2.3 Reproducción de audio externo
Archivo clave: frontend/src/components/Utils/hooks/useSongState.ts.
- audio.src = activeSong.url_preview.
- url_preview viene del backend y hoy solo se valida como “string no vacío”.
Riesgo: una URL inválida, un esquema no http/https o un valor inesperado se asigna directamente al elemento <audio>. No es el mismo riesgo que un href, pero sí es una frontera real y debería tener un schema de URL.
2.4 Imágenes y fondos externos
Se usan album_cover y url_image en:
- <Image src={album_cover}> en tarjetas, búsqueda, player, etc.
- MainLayout: bgImage={url(${song.album_cover})}.
- Varios componentes construyen rutas con encodeURIComponent.
Hoy album_cover y url_image son solo stringSchema. Recomendación: URL validada por protocolo permitido (http/https) antes de usarla en src o en CSS.
2.5 Enlace externo a Spotify
Archivo: frontend/src/components/SongPath/SongInfoLayout/SongInfoLayout.tsx.
Se construye:
https://open.spotify.com/track/${spotify_id}
spotify_id solo está validado como string no vacío. No es un riesgo de esquema abierto porque el dominio es fijo, pero sí conviene validar el formato del ID para evitar enlaces roto (y para poder testearlo).
2.6 Parámetros de URL / rutas
Es una entrada controlada por el usuario y navegación:
Ruta	Parámetro	Consumidor	Validación actual
/songs/:songId	songId	useSongDetails	Number(songId) sin validar
/songs/:songId	songId	useGetSongCover	floatNumberSchema.safeParse
/albums/:album	album	DetailsLayout / useDetailFilter	stringSchema.safeParse
/artists/:artist	artist	DetailsLayout / useDetailFilter	stringSchema.safeParse
/genres/:genre	genre	GenreDetails	isValidGenre contra lista local
Problemas:
- useSongDetails convierte a número sin comprobar nada: Number(undefined) produce NaN y se envía como variable.
- floatNumberSchema acepta decimales y negativos, pero SongID es un Int positivo.
- useDetailFilter solo hace null check; la validación fuerte está en DetailsLayout, lo cual está bien pero deja el hook sin contrato propio.
- GenreDetails valida con una lista local de iconos, no con un schema compartido. Eso puede ser correcto para la UI, pero conviene separar “género válido de ruta” de “género con icono”.
- Los enlaces de género no usan encodeURIComponent (/genres/${genre}), a diferencia de artistas y álbumes. No es Zod, pero es una frontera de datos que conviene revisar.
2.7 Variables de entorno
Archivo: frontend/src/apolloClient.ts.
- VITE_GRAPHQL_URI
- VITE_SUBSCRIPTION_URI
No hay validación en arranque. Si falta una variable o tiene un protocolo incorrecto, el cliente Apollo se construye igual y el fallo aparece después, de forma difusa.
Esto no es un contrato de API compartido, así que probablemente no debería vivir en schemas/, sino en un schema local del frontend o en un módulo de configuración. Pero sí merece validación temprana.
2.8 APIs del navegador
No son “exteriores” de red, pero sí son puntos de integración que hoy no tienen tests:
- <audio>: play, pause, currentTime, volume, loadedmetadata, canplay.
- requestAnimationFrame en useAudioData.
- window.scrollTo / scroll listener en useScrollUp.
- location.pathname en useNavButtons.
No necesitan schemas de Zod, pero sí tests de hooks aislados.
2.9 Lo que no existe
- No hay fetch directo, ni axios, ni localStorage, ni sessionStorage.
- No hay mutaciones GraphQL.
- spotify-preview-finder aparece en dependencias pero no se importa en frontend/src; parece dependencia muerta.
3. Qué schemas nuevos o cambios recomendaría en schemas/
Prioridad alta
1. Schema del chunk de IA / suscripción
Hoy se reutiliza stringSchema, que es demasiado estricto para un stream. Recomendación:
- Un schema para el valor emitido por aiResponse.
- Política explícita para null/undefined/cadena vacía.
- Idealmente un schema del payload completo de la suscripción, no solo del string.
Esto es contrato de API y encaja perfectamente en schemas/.
2. Schemas de entrada GraphQL
Añadiría schemas para las variables que el frontend envía:
- ID de canción: entero positivo.
- Query de búsqueda: string, trim, longitud mínima/máxima y quizá rechazo de caracteres de control.
- Paginación: page >= 1, limit dentro de un rango razonable.
- Seed: string numérico válido.
- Género: string no vacío.
- Vector de usuario: array de exactamente 8 números finitos, con rangos coherentes.
- Petición de recomendaciones: { genres, userVector, limit } como objeto.
Estos schemas sirven tanto para robustez como para tests de contrato y evitan enviar NaN, arrays incompletos o límites absurdos.
3. Schemas de URL
Los campos que se usan en src, CSS o audio deberían dejar de ser stringSchema genérico:
- url_preview: URL http/https.
- album_cover / url_image: URL http/https.
- spotify_id: patrón de ID de Spotify.
No hace falta permitir esquemas como data: salvo decisión explícita.
4. IDs y números más estrictos
Hoy:
- songResponseSchema.id usa floatNumberSchema, que admite strings numéricos, decimales y negativos.
- Varios id usan z.number() sin .int().positive().
- year usa floatNumberSchema aunque el backend lo declara como entero.
- duration no exige positividad.
Recomendación: separar primitivas:
- positiveIntSchema
- positiveNumberSchema o durationSchema
- yearSchema
- idSchema
Y reservar floatNumberSchema para casos donde realmente se acepta string numérico.
5. Revisar multipleSearchResultsSchema
Hay una inconsistencia de contrato:
- El schema exige exactArtist, exactAlbum y exactSong.
- El backend hace destructuring del primer resultado y puede obtener undefined.
- La UI (SearchResults) comprueba exactSong && exactAlbum && exactArtist, lo que sugiere que espera que puedan faltar.
Recomendación: decidir el contrato real y alinearlo. Si puede no haber coincidencia exacta, los campos deberían ser nullable/opcionales. Si no, la UI no debería tener esas guardas. Este es un caso perfecto para un test de contrato antes de tocar la lógica.
Prioridad media
6. Primitivas más seguras
floatNumberSchema acepta "Infinity" y notaciones raras porque solo comprueba Number.isNaN. Recomendación: exigir Number.isFinite.
stringSchema rechaza strings vacíos pero no normaliza espacios. Para rutas y queries quizá convenga un schema con trim y longitud máxima.
7. Schema de variables de entorno
Probablemente local al frontend, no en schemas/, pero muy recomendable:
- URI HTTP válida.
- URI WebSocket válida.
- Fallo rápido y claro al arrancar.
8. Schema de respuesta de recomendaciones
Ojo: songRecommendationsSchema en schemas/ modela la fila cruda de la función SQL (cos_sim, artists como string). El frontend no usa ese schema; usa songResponseSchema. Está bien que exista para el backend, pero conviene documentar que no es el contrato que consume el frontend.
Lo que no metería en schemas/
- La lista genreList con iconos: es UI, no contrato de API.
- El estado de audio, volumen, reproducción: es estado de cliente.
- Las rutas de React Router como tales: son contrato del frontend, no de la API. Los validadores de parámetros pueden vivir en frontend.
- Variables de entorno: específicas de cada app.
4. Problemas de robustez que afectan a la introducción de tests
4.1 .parse() directo en render
Muchos hooks hacen schema.parse(...) en el cuerpo del hook, que se ejecuta durante el render. Si el payload no cumple:
- La excepción sube.
- No hay ErrorBoundary en la app.
- La pantalla puede romperse entera en vez de mostrar un fallback local.
No digo que haya que cambiar todo a safeParse, pero sí definir una estrategia:
- safeParse + fallback (undefined, [], dato anterior).
- O parse + error boundary común.
- O un helper parseOrThrow con logging y estado de error.
Para tests, safeParse es mucho más fácil de cubrir.
4.2 useLoadRec no maneja fallos
useLoadRec hace await y luego parse. Si la query falla o el parse lanza:
- setLoading(false) no se ejecuta.
- El modal puede quedarse cargando.
- No hay feedback de error.
Es uno de los primeros sitios donde escribiría un test.
4.3 useSongDetails valida dos veces y no valida la entrada
- Parsea en onCompleted.
- Vuelve a parsear en el render.
- Envía Number(songId) sin validar.
Además, si songId es undefined o basura, se hace una petición con NaN.
4.4 useSongRec no tiene onError
La suscripción no tiene manejo de error ni de cierre. Un fallo de WebSocket o un chunk inválido no tiene camino controlado.
4.5 useSearchResults silencia errores
Está bien que tenga try/catch, pero mezcla error de red y error de validación y termina mostrando el estado de “sin resultados”. Para tests y diagnóstico convendría distinguir:
- error de red,
- payload inválido,
- sin resultados.
4.6 useGetSongCover valida con un schema demasiado permisivo
safeParse(songId) con floatNumberSchema deja pasar "1.5", "-2" o "Infinity". Para un ID de GraphQL debería ser entero positivo.
4.7 Cache de Apollo
apolloClient.ts usa typePolicies con merge que asume arrays y argumentos válidos. No es un flujo externo directo, pero es lógica sensible que conviene testear con datos de paginación.
5. Dónde empezar con los tests
Nivel 1: tests de schemas en schemas/
No hay ningún test ahí ahora mismo. Empezaría por:
- Casos válidos e inválidos de songResponseSchema, fullSongResponseSchema, albumResponseSchema, artistResponseSchema.
- multipleSearchResultsSchema con:
- resultados exactos presentes,
- sin artistas,
- sin álbumes,
- sin canciones,
- arrays vacíos.
- URLs inválidas (javascript:, vacías, no URL).
- IDs negativos, decimales y strings numéricos.
- Chunks de IA: texto, vacío, null, undefined.
- Vector de usuario: 8 valores, longitudes incorrectas, NaN, Infinity.
Estos tests son baratos, no necesitan navegador ni base de datos, y protegen el contrato que comparten backend y frontend.
Nivel 2: tests de hooks con Apollo MockedProvider
El frontend no tiene Vitest ni React Testing Library configurados. Para introducirlos, el orden natural sería:
1. useSearchResults: query válida, payload inválido, error de red, debounce.
2. useLoadRec: éxito, respuesta vacía, parse fallido, variables correctas.
3. useSongRec: chunks válidos, chunk vacío/nulo, error de suscripción, acumulación de texto.
4. useSongDetails: songId válido, inválido, undefined, respuesta inválida.
5. useGetSongCover: ruta válida, ruta inválida y que no se dispare la query.
6. useGetDetailSongs, useGenreSongs, useArtistBar, useGetAlbumCards: carga, paginación, datos inválidos.
7. useSongState / useAudioData: mockear <audio> y comprobar src, play, pause, currentTime, volume.
Nivel 3: tests de integración con Apollo
Con MockedProvider puedes simular respuestas GraphQL sin backend ni PostgreSQL. Es la forma más rentable de probar los flujos de datos antes de tocar E2E.
Nivel 4: E2E
El paquete e2e/ ya existe con Playwright, pero depende de servicios externos. Lo dejaría para smoke tests:
- home carga canciones,
- búsqueda devuelve resultados,
- navegación a detalle de canción/artista/álbum/género,
- reproducir/pausar,
- flujo de recomendaciones con IA.
No lo usaría como primera red de seguridad.
6. Orden de adopción que recomendaría
1. Definir la estrategia de validación: safeParse + fallback o error boundary. Sin esto, añadir más schemas solo traslada el problema.
2. Añadir schemas de entrada (IDs, query, paginación, vector, recomendaciones).
3. Añadir schemas de URL y endurecer primitivas (IDs enteros, año, duración, Number.isFinite).
4. Corregir el schema de IA y el contrato de multipleSearchResults.
5. Validar variables de entorno al arrancar.
6. Introducir Vitest + RTL + MockedProvider y empezar por los schemas y los hooks de frontera.
7. Dejar Playwright para smoke tests.
7. Conclusión
El frontend ya tiene una base buena: la mayoría de respuestas GraphQL pasan por Zod y los tipos compartidos vienen de @trackstack/schemas. Lo que falta para que sea sólido y testeable es:
- validar entradas además de salidas;
- tratar URLs, IDs y números con más precisión;
- resolver el caso especial del stream de IA;
- manejar los errores de validación de forma uniforme;
- y montar tests de schemas y de hooks, que hoy no existen.
Los puntos que primero testearía son useSearchResults, useLoadRec, useSongRec, useSongDetails y useGetSongCover, porque concentran la mayoría de las fronteras externas y los caminos de error.