import { ArtistResponse } from '@/types/artistAttributes';
import { SongResponse } from '@/types/songAttributes';
import { ArtistWithSongsData } from '@trackstack/schemas';

export const artistData = [
  {
    id: 1,
    name: 'Nirvana',
    songs: [
      {
        id: 598102,
        name: 'Come as You Are',
        url_preview:
          'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
        album: {
          url_image:
            'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Oasis',
    songs: [
      {
        id: 584103,
        name: 'Wonderwall',
        url_preview:
          'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
        album: {
          url_image:
            'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
        },
      },
    ],
  },
  {
    id: 3,
    name: 'Franz Ferdinand',
    songs: [
      {
        id: 584321,
        name: 'Take Me Out',
        url_preview:
          'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
        album: {
          url_image:
            'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
        },
      },
    ],
  },
  {
    id: 4,
    name: 'The Killers',
    songs: [
      {
        id: 598123,
        name: 'Mr. Brightside',
        url_preview:
          'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
        album: {
          url_image:
            'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
        },
      },
    ],
  },
  {
    id: 5,
    name: 'Radiohead',
    songs: [
      {
        id: 597132,
        name: 'Creep',
        url_preview:
          'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
        album: {
          url_image:
            'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
        },
      },
    ],
  },
] as unknown as ArtistWithSongsData[];

export const artistTestResponses: ArtistResponse[] = [
  {
    id: 1,
    name: 'Nirvana',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 2,
    name: 'Oasis',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 3,
    name: 'Franz Ferdinand',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 4,
    name: 'The Killers',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 5,
    name: 'Radiohead',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
];

export const artistSongsData = {
  id: 598104,
  name: 'Nirvana',
  songs: [
    {
      id: 598102,
      name: 'Come as You Are',
      url_preview:
        'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
      album: {
        url_image:
          'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
      },
    },
    {
      id: 584103,
      name: 'Lithium',
      url_preview:
        'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
      album: {
        url_image:
          'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
      },
    },
    {
      id: 584321,
      name: 'Heart-Shaped Box',
      url_preview:
        'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
      album: {
        url_image:
          'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
      },
    },
    {
      id: 598123,
      name: 'In Bloom',
      url_preview:
        'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
      album: {
        url_image:
          'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
      },
    },
    {
      id: 597132,
      name: 'Rape Me',
      url_preview:
        'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
      album: {
        url_image:
          'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
      },
    },
  ],
} as unknown as ArtistWithSongsData;

export const artistTestSongs: SongResponse[] = [
  {
    id: 598102,
    name: 'Come as You Are',
    artists: ['Nirvana'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 584103,
    name: 'Lithium',
    artists: ['Nirvana'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 584321,
    name: 'Heart-Shaped Box',
    artists: ['Nirvana'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 598123,
    name: 'In Bloom',
    artists: ['Nirvana'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
  {
    id: 597132,
    name: 'Rape Me',
    artists: ['Nirvana'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
];
