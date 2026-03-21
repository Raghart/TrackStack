-- +goose Up
ALTER TABLE songs
DROP CONSTRAINT songs_spotify_id_key;

-- +goose Down
ALTER TABLE songs
ADD CONSTRAINT UNIQUE;
