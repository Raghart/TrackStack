-- name: CreateArtist :one
INSERT INTO artists (id, name)
VALUES ($1, $2)
RETURNING *;

-- name: GetArtist :one
SELECT * FROM artists WHERE id = $1;

-- name: CleanArtists :exec
DELETE FROM artists;