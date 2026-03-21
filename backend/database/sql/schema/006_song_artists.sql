-- +goose Up
CREATE TABLE song_artists(
    id INTEGER PRIMARY KEY,
    song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE song_artists;