import { parseFloatNum, parseNumberArray } from 'src/types/parses';
import { IASongResponse } from 'src/types/songAttributes';

export const buildSongVector = (song: IASongResponse) => {
  return parseNumberArray([
    song.songDetails.energy,
    song.songDetails.speechiness,
    song.songDetails.danceability,
    song.duration,
    song.songDetails.valence,
    parseFloatNum(song.songDetails.instrumentalness),
    song.songDetails.mode,
    parseFloatNum(song.songDetails.acousticness),
  ]);
};
