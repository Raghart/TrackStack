import { gql } from "@apollo/client";

export const getIARecommendations = gql`
query getIARecommendedSongs ($genres: [String!], $energy: Float!, $speechLevel: Float!, $danceability: Float!,
  $duration: Float!, $sentiment: Float!, $voiceType: Float!, $mood: Int!, $acousticness: Float!) {
  getIARecommendations (genres: $genres, energy: $energy, speechLevel: $speechLevel, danceability: $danceability,
  duration: $duration, sentiment: $sentiment, voiceType: $voiceType, mood: $mood, acousticness: $acousticness) {
    id
    name
    artists
    album_cover
    url_preview
  }
}
`;