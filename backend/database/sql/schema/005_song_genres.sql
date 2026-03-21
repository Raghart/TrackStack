-- +goose Up
CREATE TABLE song_genres(
    id INTEGER PRIMARY KEY,
    song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE song_genres;