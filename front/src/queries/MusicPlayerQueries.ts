import { gql } from "@apollo/client";

export const getRandomSong = gql`
query {
  getRandomSong {
    id
    name
    artists
    album_cover
    url_preview
  }
}
`;

export const getNextSong = gql`
query getNextSongByID ($songID: Int!) {
  getNextSong(songID: $songID) {
    id
    name
    artists
    album_cover
    url_preview
  }
}
`;

export const getPreviousSong = gql`
query getPreviousSongByID ($songID: Int!) {
  getPreviousSong(songID: $songID) {
    id
    name
    artists
    album_cover
    url_preview
  }
}
`;