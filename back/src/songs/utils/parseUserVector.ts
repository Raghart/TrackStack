import { parseNumberArray } from 'src/types/parses';

export const parseUserVector = (
  energy: number = 0.5,
  speechLevel: number = 0.165,
  danceability: number = 0.5,
  duration: number = 2.5,
  sentiment: number = 0.5,
  voiceType: number = 0.05,
  mood: number = 1,
  acousticness: number = 0.15,
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
