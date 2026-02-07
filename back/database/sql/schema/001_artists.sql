-- +goose Up
CREATE TABLE artists(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- +goose Down
DROP TABLE artists;