-- search_artists: rellena hasta limit_num resultados con coincidencias fuzzy.
--
-- Antes la función filtraba con el operador % de pg_trgm, que aplica el
-- umbral por defecto (0.3). Cuando había pocas coincidencias exactas/prefijo/
-- contiene, la consulta devolvía menos filas de las pedidas. Ahora se rankean
-- todos los artistas (exacto > prefijo > contiene > fuzzy) y se limita al
-- final, de modo que siempre se devuelven hasta limit_num resultados.
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
