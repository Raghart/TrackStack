Los 4 arreglos con mejor retorno (de mayor a menor impacto)

1. Tests de integración contra Postgres real. Ya tienes Docker y el schema SQL. Unos 5-6 tests que ejecuten search_songs y search_songs_cosine_similarity de verdad contra el contenedor taparían justo el hueco más débil. Es el cambio que más sube la nota.

2. Mata duplicidad de esquema. Tienes database/init/01_schema.sql escrito a mano y migraciones Prisma y modelos Sequelize: tres fuentes de verdad que van a driftear. Deja una canónica y explica la decisión en backend/docs/.

3. ~~Endurece el borde. No hay throttling ni helmet (verifiqué con grep). Un endpoint de IA público y sin rate limit es una factura de Google GenAI esperando a pasar. Añadir @nestjs/throttler es media hora y es un buen punto de entrevista.~~

4. ~~Limpia la historia y el arranque. Commits con prefijo r se leen mal; reescribe o al menos usa mensajes imperativos de aquí en adelante. Y saca process.loadEnvFile() de songs.service.ts (efecto lateral al importar un servicio) a main.ts/ConfigModule~~.