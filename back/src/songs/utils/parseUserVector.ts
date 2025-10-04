import { parseNumberArray } from 'src/types/parses';

export const parseUserVector = (
  energy: number,
  speechLevel: number,
  danceability: number,
  duration: number,
  sentiment: number,
  voiceType: number,
  mood: number,
  acousticness: number,
) => {
  return parseNumberArray([
    energy,
    speechLevel,
    danceability,
    duration,
    sentiment,
    voiceType,
    mood,
    acousticness,
  ]);
};
