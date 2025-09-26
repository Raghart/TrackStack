import { GetLandSongsParams } from 'src/types/mockTypes';
import { IASongs } from '../../test/data/songsModule/serAISongData';
import {
  fullResSongs,
  songData,
} from '../../test/data/songsModule/serSongData';

export const getLandpageSongs = jest
  .fn()
  .mockImplementation(({ limit }: GetLandSongsParams) => {
    return [...songData].slice(0, limit).map((song) => ({ get: () => song }));
  });

export const getRandomSong = jest.fn().mockImplementation(() => {
  const randomIdx = Math.floor(Math.random() * songData.length);
  return { get: () => songData[randomIdx] };
});

export const getSongID = jest.fn().mockImplementation((id: number) => {
  const song = songData.find((song) => song.id === id);
  if (!song) return { get: () => songData[0] };
  return { get: () => song };
});

export const getFullSongID = jest.fn().mockImplementation((id: number) => {
  const song = fullResSongs.find((song) => song.id === id);
  return song ? { get: () => song } : null;
});

export const getIARecommendations = jest.fn().mockImplementation(() => {
  return IASongs.map((song) => ({ get: () => song }));
});
