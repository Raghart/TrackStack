import { gql } from "@apollo/client";

export const getIARecommendations = gql`
query getIARecommendedSongs ($genres: [String!], $userVector: [Float!]) {
  getIARecommendations (genres: $genres, userVector: $userVector) {
    id
    name
    artists
    album_cover
    url_preview
  }
}
`;