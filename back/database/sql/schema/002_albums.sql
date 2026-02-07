-- +goose Up
CREATE TABLE albums(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    url_image TEXT NOT NULL UNIQUE
);

-- +goose Down
DROP TABLE albums;
