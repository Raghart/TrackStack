-- name: AddGenre :one
INSERT INTO genres(id, genre) 
VALUES($1, $2) 
RETURNING *;