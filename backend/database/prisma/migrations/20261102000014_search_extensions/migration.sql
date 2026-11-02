-- Búsqueda PostgreSQL-only: tolerancia a typos, acentos y ranking.
-- Solo añade extensiones, una función auxiliar, índices y funciones de consulta.
-- No modifica ni elimina tablas, columnas ni datos existentes.

-- pg_trgm: trigramas para tolerancia a typos y búsqueda por subcadena.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- unaccent: normaliza acentos (p. ej. "mago de oz" encuentra "Mägo de Oz").
CREATE EXTENSION IF NOT EXISTS unaccent;

-- unaccent() es STABLE, por lo que no puede usarse directamente en un índice.
-- Esta envoltura IMMUTABLE permite indexar lower(unaccent(name)); si el
-- diccionario de unaccent cambiara, habría que recrear los índices.
CREATE OR REPLACE FUNCTION public.immutable_unaccent(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
STRICT
AS $$
  SELECT public.unaccent('public.unaccent'::regdictionary, value);
$$;

-- Índices GIN de trigramas sobre el nombre normalizado (sin acentos y en
-- minúsculas). Aceleran tanto ILIKE '%texto%' como el operador % de pg_trgm.
CREATE INDEX IF NOT EXISTS songs_name_trgm_idx
  ON songs USING gin (lower(public.immutable_unaccent(name)) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS artists_name_trgm_idx
  ON artists USING gin (lower(public.immutable_unaccent(name)) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS albums_name_trgm_idx
  ON albums USING gin (lower(public.immutable_unaccent(name)) gin_trgm_ops);

-- Búsqueda de canciones por nombre con ranking:
--   0 = coincidencia exacta
--   1 = prefijo
--   2 = contiene
--   3 = fuzzy (trigramas)
-- A igual rank, mayor similarity() primero.
CREATE OR REPLACE FUNCTION public.search_songs(
  search_query text,
  limit_num int DEFAULT 10
)
RETURNS TABLE (
  id int,
  name text,
  artists text[],
  album text,
  album_cover text,
  url_preview text,
  match_rank int,
  score real
)
LANGUAGE sql
STABLE
AS $$
  WITH q AS (
    SELECT lower(public.immutable_unaccent(trim(search_query))) AS term
  ),
  ranked AS (
    SELECT
      s.id,
      s.name,
      s.url_preview,
      s.album_id,
      lower(public.immutable_unaccent(s.name)) AS normalized_name,
      q.term
    FROM songs s
    CROSS JOIN q
    WHERE q.term <> ''
      AND (
        lower(public.immutable_unaccent(s.name)) LIKE '%' || q.term || '%'
        OR lower(public.immutable_unaccent(s.name)) % q.term
      )
  )
  SELECT
    r.id,
    r.name,
    coalesce(
      array_agg(DISTINCT ar.name) FILTER (WHERE ar.name IS NOT NULL),
      ARRAY[]::text[]
    ) AS artists,
    al.name AS album,
    al.url_image AS album_cover,
    r.url_preview,
    CASE
      WHEN r.normalized_name = r.term THEN 0
      WHEN r.normalized_name LIKE r.term || '%' THEN 1
      WHEN r.normalized_name LIKE '%' || r.term || '%' THEN 2
      ELSE 3
    END AS match_rank,
    similarity(r.normalized_name, r.term) AS score
  FROM ranked r
  JOIN albums al ON al.id = r.album_id
  LEFT JOIN song_artists sa ON sa.song_id = r.id
  LEFT JOIN artists ar ON ar.id = sa.artist_id
  GROUP BY
    r.id,
    r.name,
    r.url_preview,
    r.normalized_name,
    r.term,
    al.name,
    al.url_image
  ORDER BY match_rank, score DESC, r.name
  LIMIT limit_num;
$$;

-- Búsqueda de artistas por nombre. album_cover es la portada del álbum más
-- reciente del artista (cadena vacía si no tiene canciones).
CREATE OR REPLACE FUNCTION public.search_artists(
  search_query text,
  limit_num int DEFAULT 10
)
RETURNS TABLE (
  id int,
  name text,
  album_cover text,
  match_rank int,
  score real
)
LANGUAGE sql
STABLE
AS $$
  WITH q AS (
    SELECT lower(public.immutable_unaccent(trim(search_query))) AS term
  ),
  ranked AS (
    SELECT
      ar.id,
      ar.name,
      lower(public.immutable_unaccent(ar.name)) AS normalized_name,
      q.term,
      coalesce(
        (
          SELECT al.url_image
          FROM songs s
          JOIN albums al ON al.id = s.album_id
          WHERE s.id IN (
            SELECT sa.song_id
            FROM song_artists sa
            WHERE sa.artist_id = ar.id
          )
          ORDER BY s.year DESC, s.id
          LIMIT 1
        ),
        ''
      ) AS album_cover
    FROM artists ar
    CROSS JOIN q
    WHERE q.term <> ''
      AND (
        lower(public.immutable_unaccent(ar.name)) LIKE '%' || q.term || '%'
        OR lower(public.immutable_unaccent(ar.name)) % q.term
      )
  )
  SELECT
    r.id,
    r.name,
    r.album_cover,
    CASE
      WHEN r.normalized_name = r.term THEN 0
      WHEN r.normalized_name LIKE r.term || '%' THEN 1
      WHEN r.normalized_name LIKE '%' || r.term || '%' THEN 2
      ELSE 3
    END AS match_rank,
    similarity(r.normalized_name, r.term) AS score
  FROM ranked r
  ORDER BY match_rank, score DESC, r.name
  LIMIT limit_num;
$$;

-- Búsqueda de álbumes por nombre, con la lista de artistas del álbum.
CREATE OR REPLACE FUNCTION public.search_albums(
  search_query text,
  limit_num int DEFAULT 10
)
RETURNS TABLE (
  id int,
  name text,
  artists text[],
  album_cover text,
  match_rank int,
  score real
)
LANGUAGE sql
STABLE
AS $$
  WITH q AS (
    SELECT lower(public.immutable_unaccent(trim(search_query))) AS term
  ),
  ranked AS (
    SELECT
      al.id,
      al.name,
      al.url_image,
      lower(public.immutable_unaccent(al.name)) AS normalized_name,
      q.term
    FROM albums al
    CROSS JOIN q
    WHERE q.term <> ''
      AND (
        lower(public.immutable_unaccent(al.name)) LIKE '%' || q.term || '%'
        OR lower(public.immutable_unaccent(al.name)) % q.term
      )
  )
  SELECT
    r.id,
    r.name,
    coalesce(
      array_agg(DISTINCT ar.name) FILTER (WHERE ar.name IS NOT NULL),
      ARRAY[]::text[]
    ) AS artists,
    r.url_image AS album_cover,
    CASE
      WHEN r.normalized_name = r.term THEN 0
      WHEN r.normalized_name LIKE r.term || '%' THEN 1
      WHEN r.normalized_name LIKE '%' || r.term || '%' THEN 2
      ELSE 3
    END AS match_rank,
    similarity(r.normalized_name, r.term) AS score
  FROM ranked r
  LEFT JOIN songs s ON s.album_id = r.id
  LEFT JOIN song_artists sa ON sa.song_id = s.id
  LEFT JOIN artists ar ON ar.id = sa.artist_id
  GROUP BY
    r.id,
    r.name,
    r.url_image,
    r.normalized_name,
    r.term
  ORDER BY match_rank, score DESC, r.name
  LIMIT limit_num;
$$;
