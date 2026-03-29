-- name: CreateGenre :one
INSERT INTO genres(id, genre) 
VALUES($1, $2) 
RETURNING *;

-- name: GetGenreByID :one
SELECT * FROM genres WHERE id = $1;