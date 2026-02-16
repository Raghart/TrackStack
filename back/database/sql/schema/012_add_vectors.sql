-- +goose Up
ALTER TABLE song_details
ADD COLUMN vectors vector(13); 

-- +goose Down
ALTER TABLE song_details
DROP COLUMN vectors;
