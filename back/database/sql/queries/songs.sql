-- name: CreateSong :one
INSERT INTO songs(id, name, spotify_id, url_preview, duration, year, album_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetSongByID :one
SELECT * FROM songs WHERE id = $1;

-- name: CleanSongs :exec
DELETE FROM songs;