-- +goose Up
ALTER TABLE songs
DROP CONSTRAINT songs_url_preview_key;

-- +goose Down
ALTER TABLE songs
ADD CONSTRAINT UNIQUE;