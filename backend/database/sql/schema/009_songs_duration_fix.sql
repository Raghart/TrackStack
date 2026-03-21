-- +goose Up
ALTER TABLE songs
ALTER COLUMN duration TYPE REAL;

-- +goose Down
ALTER TABLE songs
ALTER COLUMN duration TYPE INTEGER;