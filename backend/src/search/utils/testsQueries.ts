import { searchAlbums, searchArtists, searchSongs } from "../../../test/data/searchModule/searchData";

// The SQL functions return only the columns they select (no `type`).
export const artistRows = searchArtists.map(({ id, name, album_cover }) => ({
  id,
  name,
  album_cover,
}));

export const albumRows = searchAlbums.map(({ id, name, album_cover, artists }) => ({
  id,
  name,
  album_cover,
  artists,
}));

export const songRows = searchSongs.map(
  ({ id, name, album, url_preview, album_cover, artists }) => ({
    id,
    name,
    album,
    url_preview,
    album_cover,
    artists,
  }),
);