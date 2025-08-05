/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FullSongResponse, SongResponse } from 'src/types/songAttributes';
import { fullResSongs } from '../../test/data/songsModule/serSongData';
import { TESTING_URL, TESTING_IMG } from '../../test/constants/constants';

export const expectFullSongProps = (song: FullSongResponse) => {
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

export const expectFullSongData = (song: FullSongResponse) => {
  expectFullSongProps(song);
  const mockSong = fullResSongs.find((s) => s.id === song.id);
  expect(mockSong).toBeDefined();
  expect(mockSong?.name).toBe(song.name);
  expect(mockSong?.artists.map((artist) => artist.name)).toEqual(song.artists);
  expect(mockSong?.genres.map((genre) => genre.genre)).toEqual(song.genres);
  expect(mockSong?.album.name).toBe(song.album);
  expect(mockSong?.album.url_image).toBe(song.album_cover);
  expect(mockSong?.duration).toBe(song.duration);
  expect(mockSong?.spotify_id).toBe(song.spotify_id);
  expect(mockSong?.url_preview).toBe(song.url_preview);
};

export const expectSongNames = (songs: SongResponse[], names: string[]) => {
  expect(songs.map((song) => song.name)).toEqual(names);
};

export const expectSongProps = (array: SongResponse[]) => {
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
  song: SongResponse,
  name: string,
  artist: string,
) => {
  expect(song.name).toBe(name);
  expect(song.artists).toContain(artist);
  expect(song.url_preview).toBe(TESTING_URL);
  expect(song.album_cover).toBe(TESTING_IMG);
};

export const expectSongsArray = (
  song: SongResponse,
  songNames: string[],
  artist: string,
) => {
  expect(songNames).toContain(song.name);
  expect(song.artists).toContain(artist);
  expect(song.url_preview).toBe(TESTING_URL);
  expect(song.album_cover).toBe(TESTING_IMG);
};
