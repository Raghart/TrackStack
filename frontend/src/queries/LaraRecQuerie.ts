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

export const aiSubscription = gql`
subscription {
  aiResponse
}
`;

export const streamAIAnswer = gql`
mutation streamResponse($genres: [String!], $userVector: [Float!]) {
  streamAIResponse(genres: $genres, userVector: $userVector) 
}
`;