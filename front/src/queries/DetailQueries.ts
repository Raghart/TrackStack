import { gql } from "@apollo/client";

export const getSongData = gql`
query getSongDataByID ($SongID: Int!) {
  getSongData (SongID: $SongID) {
    id
    name
    artists
    genres
    album
    album_cover
    year
    duration
    spotify_id
    url_preview
  }
}
`;

export const getAllArtistSongs = gql`
query getAllArtistSongsByName ($artist: String!) {
  getAllArtistSongs(artist: $artist) {
    id
    name
    artists
    album_cover
    url_preview
  }
}
`;

export const getAllArtists = gql`
query getAllArtistsPagination ($seed: String!, $page: Int!, $limit: Int!) {
  getAllArtists(seed: $seed, page: $page, limit: $limit) {
    id
    name
    album_cover
  }
}
`;

export const getAllGenreSongs = gql`
query getAllGenreSongsByName ($seed: String!, $genre: String!, $page: Int!, $limit: Int!) {
  getAllGenreSongs(seed: $seed, genre: $genre, page: $page, limit: $limit) {
    id
    name
    artists
    album_cover
    url_preview
  }
}
`;

export const getAllAlbumSongs = gql`
query getAllAlbumSongsByName ($album: String!) {
  getAllAlbumSongs(album: $album) {
    id
    name
    artists
    album_cover
    url_preview
  }
}
`;