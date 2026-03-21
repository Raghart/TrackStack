-- +goose Up
CREATE TABLE songs(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    spotify_id TEXT NOT NULL UNIQUE,
    url_preview TEXT NOT NULL UNIQUE,
    duration INTEGER NOT NULL,
    year INTEGER NOT NULL
);

-- +goose Down
DROP TABLE songs;