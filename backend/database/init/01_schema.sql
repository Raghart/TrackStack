-- Esquema de la base de datos de TrackStack.
--
-- Reproduce el estado real de la base de datos de producción (no solo el
-- histórico de migraciones de Prisma): tipos, nulabilidad, constraints,
-- índices, funciones de búsqueda y la tabla de control de migraciones.
--
-- Este archivo se ejecuta después de 00_extensions.sql y antes de 02_seed.sql.

BEGIN;

CREATE TABLE artists(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE albums(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    url_image TEXT NOT NULL
);

CREATE TABLE genres(
    id INTEGER PRIMARY KEY,
    genre TEXT NOT NULL UNIQUE
);

CREATE TABLE songs(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    spotify_id TEXT NOT NULL,
    url_preview TEXT NOT NULL,
    duration NUMERIC(10,5) NOT NULL,
    year INTEGER NOT NULL,
    album_id INTEGER,
    CONSTRAINT songs_album_id_fkey
        FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

CREATE TABLE song_artists(
    id INTEGER,
    song_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    CONSTRAINT song_artists_rp_pkey PRIMARY KEY (id),
    CONSTRAINT song_artists_rp_song_id_fkey
        FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    CONSTRAINT song_artists_rp_artist_id_fkey
        FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE song_genres(
    id INTEGER,
    song_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    CONSTRAINT song_genres_rp_pkey PRIMARY KEY (id),
    CONSTRAINT song_genres_rp_song_id_fkey
        FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    CONSTRAINT song_genres_rp_genre_id_fkey
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE TABLE song_details(
    id INTEGER PRIMARY KEY,
    song_id INTEGER NOT NULL,
    danceability NUMERIC(10,5) NOT NULL,
    energy NUMERIC(10,5) NOT NULL,
    track_key INTEGER NOT NULL,
    loudness NUMERIC(10,5) NOT NULL,
    mode INTEGER NOT NULL,
    speechiness NUMERIC(10,5) NOT NULL,
    acousticness NUMERIC(10,5) NOT NULL,
    instrumentalness NUMERIC(10,5) NOT NULL,
    liveness NUMERIC(10,5) NOT NULL,
    valence NUMERIC(10,5) NOT NULL,
    tempo NUMERIC(10,5) NOT NULL,
    time_signature INTEGER NOT NULL,
    vectors vector(8),
    CONSTRAINT song_details_song_id_fkey
        FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- unaccent() es STABLE, así que no se puede usar directamente en un índice.
-- Esta envoltura IMMUTABLE permite indexar lower(unaccent(name)).
CREATE OR REPLACE FUNCTION public.immutable_unaccent(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE PARALLEL SAFE STRICT
AS $function$
  SELECT public.unaccent('public.unaccent'::regdictionary, value);
$function$;

-- Índices GIN de trigramas sobre el nombre normalizado (sin acentos y en
-- minúsculas). Aceleran ILIKE '%texto%' y el operador % de pg_trgm.
CREATE INDEX songs_name_trgm_idx
    ON songs USING gin (lower(public.immutable_unaccent(name)) gin_trgm_ops);

CREATE INDEX artists_name_trgm_idx
    ON artists USING gin (lower(public.immutable_unaccent(name)) gin_trgm_ops);

CREATE INDEX albums_name_trgm_idx
    ON albums USING gin (lower(public.immutable_unaccent(name)) gin_trgm_ops);

-- Búsqueda de canciones por nombre con ranking:
--   0 = coincidencia exacta, 1 = prefijo, 2 = contiene, 3 = fuzzy.
-- A igual rank, mayor similarity() primero.
CREATE OR REPLACE FUNCTION public.search_songs(search_query text, limit_num integer DEFAULT 10)
RETURNS TABLE(id integer, name text, artists text[], album text, album_cover text, url_preview text, match_rank integer, score real)
LANGUAGE sql
STABLE
AS $function$
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
$function$;

-- Búsqueda de artistas por nombre. Devuelve hasta limit_num resultados
-- (incluidos los fuzzy) y la portada de su álbum más reciente.
CREATE OR REPLACE FUNCTION public.search_artists(search_query text, limit_num integer DEFAULT 10)
RETURNS TABLE(id integer, name text, album_cover text, match_rank integer, score real)
LANGUAGE sql
STABLE
AS $function$
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
$function$;

-- Búsqueda de álbumes por nombre, con la lista de artistas del álbum.
CREATE OR REPLACE FUNCTION public.search_albums(search_query text, limit_num integer DEFAULT 10)
RETURNS TABLE(id integer, name text, artists text[], album_cover text, match_rank integer, score real)
LANGUAGE sql
STABLE
AS $function$
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
$function$;

-- Recomendaciones por similitud coseno sobre song_details.vectors.
CREATE OR REPLACE FUNCTION public.search_songs_cosine_similarity(genres_filter text[], query_vector vector, limit_num integer DEFAULT 40)
RETURNS TABLE(id integer, name text, artists text, url_preview text, album_cover text, cos_sim double precision)
LANGUAGE sql
STABLE
AS $function$
    SELECT songs.id,
        songs.name,
        string_agg(DISTINCT artists.name, ', ') AS artists,
        songs.url_preview,
        albums.url_image AS album_cover,
        1 - (song_details.vectors <=> query_vector) AS cos_sim
    FROM songs
    JOIN song_details ON songs.id = song_details.song_id
    JOIN albums ON albums.id = songs.album_id
    JOIN song_artists ON songs.id = song_artists.song_id
    JOIN artists ON song_artists.artist_id = artists.id
    JOIN song_genres ON songs.id = song_genres.song_id
    JOIN genres ON song_genres.genre_id = genres.id
    WHERE (cardinality(genres_filter) = 0 OR genres.genre = ANY(genres_filter))
    GROUP BY songs.id, songs.name, songs.url_preview, albums.url_image, song_details.vectors
    ORDER BY cos_sim DESC
    LIMIT limit_num;
$function$;

-- Historial de Prisma. La demo crea el esquema directamente, así que marcamos
-- todas las migraciones como aplicadas para que `prisma migrate deploy` no
-- intente recrear tablas que ya existen. Los checksums coinciden con los
-- archivos de backend/database/prisma/migrations.
CREATE TABLE _prisma_migrations(
    id VARCHAR(36) PRIMARY KEY,
    checksum VARCHAR(64) NOT NULL,
    finished_at TIMESTAMPTZ,
    migration_name VARCHAR(255) NOT NULL,
    logs TEXT,
    rolled_back_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    applied_steps_count INTEGER NOT NULL DEFAULT 0
);

INSERT INTO _prisma_migrations
    (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
VALUES
    (md5('20261102000000_pgvector_extension')::uuid::text, '4cd351d1ee79dfc7f2967102b6386571c181ff5268d14a1130b9c98fe71ba812', now(), '20261102000000_pgvector_extension', now(), 0),
    (md5('20261102000001_artists')::uuid::text, '9159366df0ea708e2c666010e62efa1e3e5a0499ebd4d515d4421266fac8009a', now(), '20261102000001_artists', now(), 0),
    (md5('20261102000002_albums')::uuid::text, 'ee6bbf51a53f36641ca546858596d824922b97ed61c3923283448839eaac1bb8', now(), '20261102000002_albums', now(), 0),
    (md5('20261102000003_genres')::uuid::text, '1a6ad57dd4326d65bf8d424d44361ff6f5fc46927188cb8d14603f8933210c0e', now(), '20261102000003_genres', now(), 0),
    (md5('20261102000004_songs')::uuid::text, '9a2e6822cc22e694134e9a8c478771d0fa2f7cfb23ab8348a77dc87a6815198c', now(), '20261102000004_songs', now(), 0),
    (md5('20261102000005_song_genres')::uuid::text, 'f6ed99179b60b12c1c05217021417cb4af08bffaefd57d128eb600cbb67c42ec', now(), '20261102000005_song_genres', now(), 0),
    (md5('20261102000006_song_artists')::uuid::text, 'd497167dfb850e1da963b2cf90447d5837c5696eef8ef2d5f100523986c4d189', now(), '20261102000006_song_artists', now(), 0),
    (md5('20261102000007_song_details')::uuid::text, 'a241de6ec880c90bfd43f4f53d0b4f0bb7c8e12c21f2b78a095883baa4338d14', now(), '20261102000007_song_details', now(), 0),
    (md5('20261102000008_songs_column')::uuid::text, '20d259d5883dba1f386163e2422f60c7d19741e9fe34de9cfb2d26bfa452454a', now(), '20261102000008_songs_column', now(), 0),
    (md5('20261102000009_songs_duration_fix')::uuid::text, 'b3b5133156958868e9d4c8dac87325ee12bdee1fdc0cf3079082e12850298e14', now(), '20261102000009_songs_duration_fix', now(), 0),
    (md5('20261102000010_id_constraint_fix')::uuid::text, 'e72d7886d3d1e1ddc7b25ef8edf70c379e9f6b74675a1347f4ade39d0f44b37d', now(), '20261102000010_id_constraint_fix', now(), 0),
    (md5('20261102000011_id_preview_fix')::uuid::text, '395eefe68e21aa812bb6e218f28541f87eb2839b8cd779935f0494679dc94fce', now(), '20261102000011_id_preview_fix', now(), 0),
    (md5('20261102000012_add_vectors')::uuid::text, '6fbc8ea068c636afb3e7d5142f018a9eeb20b2d9cae44355ad886a9693439bac', now(), '20261102000012_add_vectors', now(), 0),
    (md5('20261102000013_search_songs_cosine_similarity')::uuid::text, '4b9fd9200f1fa5a3e8617923c8a0618393df37de771f5e3cbff29cd4213f24cf', now(), '20261102000013_search_songs_cosine_similarity', now(), 0),
    (md5('20261102000014_search_extensions')::uuid::text, 'cd03cd85ee8b3479d7f1789d2acb82c59b4cb4fb7c65145007e278eacac69faf', now(), '20261102000014_search_extensions', now(), 1),
    (md5('20261105000000_search_artists_fill_limit')::uuid::text, '3e20b184a3ca740add609a5859c8aa20a9cae204411a2ed4345832d83e0491e3', now(), '20261105000000_search_artists_fill_limit', now(), 1),
    (md5('20261105000001_search_albums_fill_limit')::uuid::text, 'b6c393e5134dd50488616f414d3850d0d7a31421d89c6e863b5ad67f260026d6', now(), '20261105000001_search_albums_fill_limit', now(), 1),
    (md5('20261112000000_fix_death_to_death_spotify_id')::uuid::text, '6bb87134d5dada20f227e4867656ec1879414b8ccf4329a6d3fce8153781ccf7', now(), '20261112000000_fix_death_to_death_spotify_id', now(), 1);

COMMIT;
