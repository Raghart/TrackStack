/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TESTING_URL, TESTING_IMG } from '../../test/constants/constants';
import { FullSongResponseData, SongResponseData } from '@trackstack/schemas';

export const expectFullSongProps = (song: FullSongResponseData) => {
  expect(song).toMatchObject({
    id: expect.any(Number),
    name: expect.any(String),
    artists: expect.any(Array),
    genres: expect.any(Array),
    album: expect.any(String),
    album_cover: expect.any(String),
    duration: expect.any(Number),
    year: expect.any(Number),
    spotify_id: expect.any(String),
    url_preview: expect.any(String),
  });
};

export const expectSongProps = (array: SongResponseData[]) => {
  array.forEach((song) => {
    expect(song).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      artists: expect.any(Array),
      album_cover: expect.any(String),
      url_preview: expect.any(String),
    });
  });
};

export const expectSongData = (
  song: SongResponseData,
  name: string,
  artist: string,
) => {
  expect(song.name).toBe(name);
  expect(song.artists).toContain(artist);
  expect(song.url_preview).toBe(TESTING_URL);
  expect(song.album_cover).toBe(TESTING_IMG);
};
