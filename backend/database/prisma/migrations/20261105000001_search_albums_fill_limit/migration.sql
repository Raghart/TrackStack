-- search_albums: rellena hasta limit_num resultados con coincidencias fuzzy.
--
-- Antes la función filtraba con el operador % de pg_trgm, que aplica el
-- umbral por defecto (0.3). Cuando había pocas coincidencias exactas/prefijo/
-- contiene, la consulta devolvía menos filas de las pedidas. Ahora se rankean
-- todos los álbumes (exacto > prefijo > contiene > fuzzy) y se limita al
-- final, de modo que siempre se devuelven hasta limit_num resultados.
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
