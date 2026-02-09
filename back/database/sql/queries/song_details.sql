-- name: CreateSongDetails :one
INSERT INTO song_details (id, song_id, danceability, energy, track_key, loudness, 
mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo, time_signature)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
RETURNING *;

-- name: CleanSongDetails :exec
DELETE FROM song_details;