-- name: CreateSongGenre :one
INSERT INTO song_genres(id, song_id, genre_id)
VALUES ($1, $2, $3)
RETURNING *;