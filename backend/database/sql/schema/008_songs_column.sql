-- +goose Up
ALTER TABLE songs
ADD album_id INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE;

-- +goose Down
ALTER TABLE songs DROP COLUMN album_id;