import {
  FullSongResponse,
  SongResponse,
} from 'src/types/songAttributes';
import { TESTING_IMG, TESTING_URL } from '../../../test/constants/constants';

export const songTestResponses: SongResponse[] = [
  {
    id: 1,
    name: 'Come as You Are',
    artists: ['Nirvana'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 2,
    name: 'Wonderwall',
    artists: ['Oasis'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 3,
    name: 'Take Me Out',
    artists: ['Franz Ferdinand'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 4,
    name: 'Mr. Brightside',
    artists: ['The Killers'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 5,
    name: 'Creep',
    artists: ['Radiohead'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
];

export const singleSongData: SongResponse = {
  id: 2,
  name: 'Wonderwall',
  artists: ['Oasis'],
  url_preview:
    'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
  album_cover:
    'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
};

export const songFullTestResponse: FullSongResponse = {
  id: 1,
  name: 'Come as You Are',
  artists: ['Nirvana'],
  url_preview:
    'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
  album: 'Nevermind (Remastered)',
  album_cover:
    'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  spotify_id: '0keNu0t0tqsWtExGM3nT1D',
  year: 1991,
  duration: 2.5,
  genres: ['Rock', 'Alternative', 'Alternative Rock', 'Grunge', '90s'],
};

export const songRecommendResponses: SongResponse[] = [
  {
    id: 1,
    name: 'Malpractice',
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
    artists: ['Testament'],
  },
  {
    id: 2,
    name: 'Lead Me Into The Night',
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
    artists: ['The Cardigans'],
  },
  {
    id: 3,
    name: 'Avant Garden',
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
    artists: ['Aerosmith'],
  },
  {
    id: 4,
    name: 'Ring The Bells',
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
    artists: ['JAMES'],
  },
  {
    id: 5,
    name: 'Head To Wall',
    url_preview: TESTING_URL,
    album_cover: TESTING_IMG,
    artists: ['Quicksand'],
  },
];
