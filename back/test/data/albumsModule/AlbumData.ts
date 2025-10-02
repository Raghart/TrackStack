import { AlbumWithSongs } from 'src/types/albumAttributes';
import { SongResponse } from 'src/types/songAttributes';

export const albumSongs = {
  id: 549818,
  name: 'Nevermind (Remastered)',
  url_image: 'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  songs: [
    {
      id: 598104,
      name: 'Come as You Are',
      artists: [{ name: 'Nirvana' }],
      url_preview:
        'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    },
  ],
} as unknown as AlbumWithSongs;

export const albumParsedSongs: SongResponse[] = [
  {
    id: 598104,
    name: 'Come as You Are',
    artists: ['Nirvana'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
  },
];

export const albumResSongs: SongResponse[] = [
  {
    id: 598104,
    name: 'Come as You Are',
    artists: ['Nirvana'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b273fbc71c99f9c1296c56dd51b6',
  },
  {
    id: 598105,
    name: 'Wonderwall',
    artists: ['Oasis'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b273fbc71c99f9c1296c56dd51b6',
  },
  {
    id: 598106,
    name: 'Take Me Out',
    artists: ['Franz Ferdinand'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b273fbc71c99f9c1296c56dd51b6',
  },
  {
    id: 598107,
    name: 'Mr. Brightside',
    artists: ['The Killers'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b273fbc71c99f9c1296c56dd51b6',
  },
  {
    id: 598108,
    name: 'Creep',
    artists: ['Radiohead'],
    url_preview:
      'https://p.scdn.co/mp3-preview/a1c11bb1cb231031eb20e5951a8bfb30503224e9?cid=774b29d4f13844c495f206cafdad9c86',
    album_cover:
      'https://i.scdn.co/image/ab67616d0000b273fbc71c99f9c1296c56dd51b6',
  },
];
