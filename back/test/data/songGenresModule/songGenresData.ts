import { SongResponse } from 'src/types/songAttributes';
import { TESTING_IMG, TESTING_URL } from '../../../test/constants/constants';
import { SongGenresRPWithSongs } from 'src/types/songGenresAttributes';

export const songGenresData = [
  {
    id: 1,
    song_id: 1,
    genre_id: 1,
    genre: { id: 1, genre: 'Rock' },
    song: {
      id: 1,
      name: "I'm A Mover",
      spotify_id: 'testingID',
      url_preview: TESTING_URL,
      duration: 2.94,
      year: 2010,
      album_id: 1,
      artists: [{ name: 'Iron Maiden' }],
      album: { url_image: TESTING_IMG },
    },
  },
  {
    id: 2,
    song_id: 2,
    genre_id: 2,
    genre: { id: 1, genre: 'Rock' },
    song: {
      id: 2,
      name: 'Smoking Umbrellas',
      spotify_id: 'testingID',
      url_preview: TESTING_URL,
      duration: 3.98,
      year: 1996,
      album_id: 2,
      artists: [{ name: 'Failure Band' }],
      album: { url_image: TESTING_IMG },
    },
  },
  {
    id: 3,
    song_id: 3,
    genre_id: 3,
    genre: { id: 3, genre: 'Rock' },
    song: {
      id: 3,
      name: 'Bones',
      spotify_id: 'testingID',
      url_preview: TESTING_URL,
      duration: 3.78,
      year: 2010,
      album_id: 3,
      artists: [{ name: 'Imagine Dragons' }],
      album: { url_image: TESTING_IMG },
    },
  },
] as unknown as SongGenresRPWithSongs[];

export const songGenresResponses: SongResponse[] = [
  {
    id: 1,
    name: "I'm A Mover",
    artists: ['Iron Maiden'],
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
  },
  {
    id: 2,
    name: 'Smoking Umbrellas',
    artists: ['Failure Band'],
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
  },
  {
    id: 3,
    name: 'Bones',
    artists: ['Imagine Dragons'],
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
  },
];
