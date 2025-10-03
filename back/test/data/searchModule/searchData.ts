import {
  albumSearchResults,
  artistSearchResults,
  songSearchResults,
} from 'src/types/searchTypes';

export const searchArtists: artistSearchResults[] = [
  { id: 1, name: 'Nirvana', album_cover: 'url1', type: 'artist' },
  { id: 2, name: 'Oasis', album_cover: 'url2', type: 'artist' },
  { id: 3, name: 'Radiohead', album_cover: 'url3', type: 'artist' },
  { id: 4, name: 'Mägo de Oz', album_cover: 'url3', type: 'artist' },
];

export const searchAlbums: albumSearchResults[] = [
  {
    id: 1,
    name: 'Nevermind (Remastered)',
    artists: ['Nirvana'],
    album_cover: 'url1',
    type: 'album',
  },
  {
    id: 2,
    name: "(What's The Story) Morning Glory? [Remastered]",
    artists: ['Oasis'],
    album_cover: 'url2',
    type: 'album',
  },
  {
    id: 3,
    name: 'Pablo Honey',
    artists: ['Radiohead'],
    album_cover: 'url3',
    type: 'album',
  },
];

export const searchSongs: songSearchResults[] = [
  {
    id: 1,
    name: 'Come as You Are',
    url_preview: 'urlTest',
    album: 'Nevermind (Remastered)',
    artists: ['Nirvana'],
    album_cover: 'url1',
    type: 'song',
  },
  {
    id: 2,
    name: 'Wonderwall',
    url_preview: 'urlTest',
    album: "(What's The Story) Morning Glory? [Remastered]",
    artists: ['Oasis'],
    album_cover: 'url2',
    type: 'song',
  },
  {
    id: 3,
    name: 'Creep',
    url_preview: 'urlTest',
    album: 'Pablo Honey',
    artists: ['Radiohead'],
    album_cover: 'url3',
    type: 'song',
  },
];

export const mockMultipleSeach = {
  exactArtist: searchArtists[0],
  exactAlbum: searchAlbums[0],
  exactSong: searchSongs[0],
  artistResults: searchArtists.slice(1),
  albumResults: searchAlbums.slice(1),
  songResults: searchSongs.slice(1),
};
