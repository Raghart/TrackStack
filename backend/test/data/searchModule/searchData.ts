import { AlbumSearchResultData, ArtistSearchResultData, multipleSearchResults, SongSearchResultData } from '@trackstack/schemas';
import { TESTING_IMG, TESTING_URL } from '../../constants/constants';

export const searchArtists: ArtistSearchResultData[] = [
  { id: 1, name: 'Nirvana', album_cover: TESTING_IMG, type: 'artist' },
  { id: 2, name: 'Oasis', album_cover: TESTING_IMG, type: 'artist' },
  { id: 3, name: 'Radiohead', album_cover: TESTING_IMG, type: 'artist' },
  { id: 4, name: 'Mägo de Oz', album_cover: TESTING_IMG, type: 'artist' },
];

export const searchAlbums: AlbumSearchResultData[] = [
  {
    id: 1,
    name: 'Nevermind (Remastered)',
    artists: ['Nirvana'],
    album_cover: TESTING_IMG,
    type: 'album',
  },
  {
    id: 2,
    name: "(What's The Story) Morning Glory? [Remastered]",
    artists: ['Oasis'],
    album_cover: TESTING_IMG,
    type: 'album',
  },
  {
    id: 3,
    name: 'Pablo Honey',
    artists: ['Radiohead'],
    album_cover: TESTING_IMG,
    type: 'album',
  },
];

export const searchSongs: SongSearchResultData[] = [
  {
    id: 1,
    name: 'Come as You Are',
    url_preview: TESTING_URL,
    album: 'Nevermind (Remastered)',
    artists: ['Nirvana'],
    album_cover: TESTING_IMG,
    type: 'song',
  },
  {
    id: 2,
    name: 'Wonderwall',
    url_preview: TESTING_URL,
    album: "(What's The Story) Morning Glory? [Remastered]",
    artists: ['Oasis'],
    album_cover: TESTING_IMG,
    type: 'song',
  },
  {
    id: 3,
    name: 'Creep',
    url_preview: TESTING_URL,
    album: 'Pablo Honey',
    artists: ['Radiohead'],
    album_cover: TESTING_IMG,
    type: 'song',
  },
];

export const mockMultipleSeach : multipleSearchResults = {
  artistResults: searchArtists,
  albumResults: searchAlbums,
  songResults: searchSongs,
};
