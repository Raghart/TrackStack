import { gql } from "@apollo/client";

export const getSongRecommendations = gql`
query getRecommendedSongs ($genres: [String!], $userVector: [Float!], $limit: Int!) {
  getSongRecommendations (genres: $genres, userVector: $userVector, limit: $limit) {
    id
    name
    artists
    album_cover
    url_preview
  }
}
`;