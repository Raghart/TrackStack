-- name: AddArtist :one
INSERT INTO artists (id, name)
VALUES ($1, $2)
RETURNING *;

-- name: GetArtist :one
SELECT * FROM artists WHERE id = $1;