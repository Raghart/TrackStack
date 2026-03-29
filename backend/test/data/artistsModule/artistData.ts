import { ArtistResponse, ArtistWithSongs } from 'src/types/artistAttributes';
import { SongResponse } from 'src/types/songAttributes';

export const artistData = [
  {
    id: 1,
    name: 'Nirvana',
    songs: [
      {
        name: 'Come as You Are',
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
        name: 'Wonderwall',
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
        name: 'Take Me Out',
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
        name: 'Mr. Brightside',
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
        name: 'Creep',
        album: {
          url_image:
            'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
        },
      },
    ],
  },
] as unknown as ArtistWithSongs[];

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
} as unknown as ArtistWithSongs;

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
