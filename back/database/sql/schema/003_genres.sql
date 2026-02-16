-- +goose Up
CREATE TABLE genres(
    id INTEGER PRIMARY KEY,
    genre TEXT UNIQUE NOT NULL
);

-- +goose Down
DROP TABLE genres;