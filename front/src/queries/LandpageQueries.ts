import { gql } from "@apollo/client";

export const getDBLength = gql`
query {
    getDBLength
}
`;

export const getLandpageSongs = gql`
query {
  getLandpageSongs {
    id
    name
    artists
    album_cover
    url_preview
  }
}
`;

export const getAllGenres = gql`
query {
  getAllGenres
}
`;