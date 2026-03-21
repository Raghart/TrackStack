/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { multipleSearchResults } from 'src/types/searchTypes';

export const expectSearchProps = (result: multipleSearchResults) => {
  expect(result).toMatchObject({
    exactArtist: {
      id: expect.any(Number),
      name: expect.any(String),
      album_cover: expect.any(String),
      type: 'artist',
    },
    exactAlbum: {
      id: expect.any(Number),
      name: expect.any(String),
      artists: expect.any(Array),
      album_cover: expect.any(String),
      type: 'album',
    },
    exactSong: {
      id: expect.any(Number),
      name: expect.any(String),
      album: expect.any(String),
      artists: expect.any(Array),
      album_cover: expect.any(String),
      url_preview: expect.any(String),
      type: 'song',
    },
    artistResults: expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        album_cover: expect.any(String),
        type: 'artist',
      }),
    ]),
    albumResults: expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        artists: expect.any(Array),
        album_cover: expect.any(String),
        type: 'album',
      }),
    ]),
    songResults: expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        album: expect.any(String),
        artists: expect.any(Array),
        album_cover: expect.any(String),
        url_preview: expect.any(String),
        type: 'song',
      }),
    ]),
  });
};
