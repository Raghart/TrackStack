CREATE OR REPLACE FUNCTION search_songs_cosine_similarity(
    genres_filter text[],
    query_vector vector(13),
    limit_num int DEFAULT 40
)
RETURNS TABLE (
    id int,
    name text,
    artists text,
    url_preview text,
    album_cover text,
    cos_sim float
)
LANGUAGE sql stable
AS $$
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
$$;