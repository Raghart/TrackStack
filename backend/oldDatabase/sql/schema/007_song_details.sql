-- +goose Up
CREATE TABLE song_details(
    id INTEGER PRIMARY KEY,
    song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    danceability REAL NOT NULL,
    energy REAL NOT NULL,
    track_key REAL NOT NULL,
    loudness REAL NOT NULL,
    mode REAL NOT NULL,
    speechiness REAL NOT NULL,
    acousticness DOUBLE PRECISION NOT NULL,
    instrumentalness DOUBLE PRECISION NOT NULL,
    liveness REAL NOT NULL,
    valence REAL NOT NULL,
    tempo REAL NOT NULL,
    time_signature INTEGER NOT NULL
);

-- +goose Down
DROP TABLE song_details;