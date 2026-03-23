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

export const getAIResponse = gql`
query getAISongResponse($genres: [String!], $userVector: [Float!]) {
  getAIResponse (genres: $genres, userVector: $userVector)
}
`;