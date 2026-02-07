-- name: CreateAlbum :one
INSERT INTO albums(id, name, url_image)
VALUES($1, $2, $3)
RETURNING *;

-- name: CleanAlbums :exec
DELETE FROM albums;