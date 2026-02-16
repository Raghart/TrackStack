-- name: CreateSongArtist :one
INSERT INTO song_artists(id, song_id, artist_id)
VALUES($1, $2, $3)
RETURNING *;