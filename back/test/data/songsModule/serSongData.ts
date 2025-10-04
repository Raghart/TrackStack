import {
  FullSongResponseAttributes,
  IASongResponse,
  SongResponseAttributes,
} from 'src/types/songAttributes';
import { TESTING_IMG, TESTING_URL } from '../../../test/constants/constants';

export const songTestData = [
  {
    id: 1,
    name: 'Come as You Are',
    artists: [{ name: 'Nirvana' }],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album: {
      url_image:
        'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
    },
  },
  {
    id: 2,
    name: 'Wonderwall',
    artists: [{ name: 'Oasis' }],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album: {
      url_image:
        'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
    },
  },
  {
    id: 3,
    name: 'Take Me Out',
    artists: [{ name: 'Franz Ferdinand' }],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album: {
      url_image:
        'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
    },
  },
  {
    id: 4,
    name: 'Mr. Brightside',
    artists: [{ name: 'The Killers' }],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album: {
      url_image:
        'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
    },
  },
  {
    id: 5,
    name: 'Creep',
    artists: [{ name: 'Radiohead' }],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album: {
      url_image:
        'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
    },
  },
] as unknown as SongResponseAttributes[];

export const singleSongTestData = {
  id: 2,
  name: 'Wonderwall',
  artists: [{ name: 'Oasis' }],
  url_preview:
    'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
  album: {
    url_image:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
} as unknown as SongResponseAttributes;

export const songFullRawResponse = {
  id: 1,
  name: 'Come as You Are',
  artists: [{ name: 'Nirvana' }],
  url_preview:
    'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
  album: {
    name: 'Nevermind (Remastered)',
    url_image:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  spotify_id: '0keNu0t0tqsWtExGM3nT1D',
  year: 1991,
  duration: 2.5,
  genres: [
    { genre: 'Rock' },
    { genre: 'Alternative' },
    { genre: 'Alternative Rock' },
    { genre: 'Grunge' },
    { genre: '90s' },
  ],
} as unknown as FullSongResponseAttributes;

export const songIARawResponse = [
  {
    id: 1,
    name: 'Malpractice',
    url_preview: TESTING_URL,
    duration: 4.04,
    album: {
      url_image: TESTING_IMG,
    },
    artists: [{ name: 'Testament' }],
    songDetails: {
      id: 1,
      song_id: 1,
      danceability: 0.255,
      energy: 0.958,
      track_key: 8,
      loudness: -6.538,
      mode: 1,
      speechiness: 0.152,
      acousticness: '0.000886',
      instrumentalness: '0.576000',
      liveness: 0.563,
      valence: 0.122,
      tempo: '119.004',
      time_signature: 4,
    },
    genres: [{ genre: 'Rock' }],
  },
  {
    id: 2,
    name: 'Lead Me Into The Night',
    url_preview: TESTING_URL,
    duration: 4.53,
    album: {
      url_image: TESTING_IMG,
    },
    artists: [{ name: 'The Cardigans' }],
    songDetails: {
      id: 2,
      song_id: 2,
      danceability: 0.387,
      energy: 0.378,
      track_key: 10,
      loudness: -9.046,
      mode: 1,
      speechiness: 0.028,
      acousticness: '0.617000',
      instrumentalness: '0.000001',
      liveness: 0.163,
      valence: 0.132,
      tempo: '129.087',
      time_signature: 3,
    },
    genres: [{ genre: 'Rock' }],
  },
  {
    id: 3,
    name: 'Avant Garden',
    url_preview: TESTING_URL,
    duration: 4.87,
    album: {
      url_image: TESTING_IMG,
    },
    artists: [{ name: 'Aerosmith' }],
    songDetails: {
      id: 3,
      song_id: 3,
      danceability: 0.298,
      energy: 0.759,
      track_key: 5,
      loudness: -4.399,
      mode: 1,
      speechiness: 0.0346,
      acousticness: '0.025400',
      instrumentalness: '0.000000',
      liveness: 0.15,
      valence: 0.465,
      tempo: '167.861',
      time_signature: 4,
    },
    genres: [{ genre: 'Rock' }],
  },
  {
    id: 4,
    name: 'Ring The Bells',
    url_preview: TESTING_URL,
    duration: 4.73,
    album: {
      url_image: TESTING_IMG,
    },
    artists: [{ name: 'JAMES' }],
    songDetails: {
      id: 4,
      song_id: 4,
      danceability: 0.455,
      energy: 0.966,
      track_key: 0,
      loudness: -4,
      mode: 1,
      speechiness: 0.0495,
      acousticness: '0.010900',
      instrumentalness: '0.000604',
      liveness: 0.0766,
      valence: 0.48,
      tempo: '154.246',
      time_signature: 4,
    },
    genres: [{ genre: 'Rock' }],
  },
  {
    id: 5,
    name: 'Head To Wall',
    url_preview: TESTING_URL,
    duration: 3.12,
    album: {
      url_image: TESTING_IMG,
    },
    artists: [{ name: 'Quicksand' }],
    songDetails: {
      id: 5,
      song_id: 5,
      danceability: 0.545,
      energy: 0.753,
      track_key: 7,
      loudness: -6.828,
      mode: 1,
      speechiness: 0.0538,
      acousticness: '0.000343',
      instrumentalness: '0.249000',
      liveness: 0.526,
      valence: 0.299,
      tempo: '137.515',
      time_signature: 4,
    },
    genres: [{ genre: 'Rock' }],
  },
] as unknown as IASongResponse[];
