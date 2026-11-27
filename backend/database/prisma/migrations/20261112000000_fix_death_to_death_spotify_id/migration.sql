-- Corrige el spotify_id inválido de "Death to Death" (Stars, id 645822).
-- El valor anterior tenía 17 caracteres y no pasaba la validación de 22
-- caracteres alfanuméricos de spotifyIdSchema. El nuevo ID corresponde al
-- track real en Spotify: https://open.spotify.com/track/7M5Fm7kw3KS2PlHlwzvKW5
UPDATE songs
SET spotify_id = '7M5Fm7kw3KS2PlHlwzvKW5'
WHERE id = 645822
  AND name = 'Death to Death'
  AND spotify_id = '2GPgrIYmVUGFdD8FF';
