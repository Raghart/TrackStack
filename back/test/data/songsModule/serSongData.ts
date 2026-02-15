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
    album_cover: TESTING_IMG,
    artists: "Testament",
    cos_sim: 0.9998
  },
  {
    id: 2,
    name: 'Lead Me Into The Night',
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
    artists: 'The Cardigans',
    cos_sim: 0.9997
  },
  {
    id: 3,
    name: 'Avant Garden',
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
    artists: 'Aerosmith',
    cos_sim: 0.9996
  },
  {
    id: 4,
    name: 'Ring The Bells',
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
    artists: 'JAMES',
    cos_sim: 0.9995
  },
  {
    id: 5,
    name: 'Head To Wall',
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
    artists: 'Quicksand',
    cos_sim: 0.9994
  },
] as unknown as IASongResponse[];
