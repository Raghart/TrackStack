-- Extensiones necesarias para que la demo sea equivalente a la base de datos
-- de producción.
--
--   vector   -> columna song_details.vectors y búsqueda por similitud coseno.
--   pg_trgm  -> búsqueda tolerante a typos sobre nombres.
--   unaccent -> búsqueda ignorando acentos (p. ej. "sigur ros" -> "Sigur Rós").
--
-- La imagen de PostgreSQL usada por la demo debe incluir pgvector. Las otras
-- dos forman parte de postgresql-contrib.

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
