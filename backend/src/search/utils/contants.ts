export const SEARCH_ARTISTS_SQL =
  'SELECT id, name, album_cover FROM search_artists(:query, :limit);';
export const SEARCH_ALBUMS_SQL =
  'SELECT id, name, album_cover, artists FROM search_albums(:query, :limit);';
export const SEARCH_SONGS_SQL =
  'SELECT id, name, album, album_cover, artists, url_preview FROM search_songs(:query, :limit);';