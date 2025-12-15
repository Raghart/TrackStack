import { AlbumWithSongs } from './albumAttributes';
import { ArtistWithSongs } from './artistAttributes';
import {
  albumSearchResults,
  artistSearchResults,
  songSearchResults,
} from './searchTypes';
import { FullSongResponseAttributes, IASongResponse } from './songAttributes';
import { SongGenresRPWithSongs } from './songGenresAttributes';

export const isString = (text: unknown): text is string => {
  if (
    text !== null &&
    text !== undefined &&
    typeof text === 'string' &&
    text.trim() !== ''
  ) {
    return true;
  }
  return false;
};

export const isNumber = (value: unknown): value is number => {
  if (
    value !== null &&
    value !== undefined &&
    !Number.isNaN(value)
  ) {
    return true;
  }
  return false;
};

export const isNumericString = (value: unknown): value is string => {
  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value.trim())) {
    return true;
  }
  return false;
};

export const isStringArray = (array: unknown): array is string[] => {
  if (Array.isArray(array) && array.every(isString)) return true;
  return false;
};

export const isNumberArray = (array: unknown): array is number[] => {
  if (Array.isArray(array) && array.every(isNumber)) return true;
  return false;
};

export const isAlbumSong = (data: unknown): data is AlbumWithSongs => {
  if (data === null || data === undefined) return false;

  return typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'url_image' in data &&
    'songs' in data &&
    isNumber(data.id) &&
    isString(data.name) &&
    isString(data.url_image) &&
    Array.isArray(data.songs) &&
    data.songs.length > 0
};

export const isArtistSongs = (data: unknown): data is ArtistWithSongs => {
  if (data === null || data === undefined) return false;

  return typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'songs' in data &&
    isNumber(data.id) &&
    isString(data.name) &&
    Array.isArray(data.songs) &&
    data.songs.length > 0
};

export const isSongGenres = (data: unknown): data is SongGenresRPWithSongs => {
  if (data === null || data === undefined) return false;

  return typeof data === 'object' &&
    'id' in data &&
    'song_id' in data &&
    'genre_id' in data &&
    'song' in data &&
    'genre' in data &&
    isNumber(data.id) &&
    isNumber(data.song_id) &&
    isNumber(data.genre_id) &&
    typeof data.song === 'object' &&
    typeof data.genre === 'object'
};

export const isSongResponse = (
  data: unknown,
): data is FullSongResponseAttributes => {
  if (data === null || data === undefined) return false;

  return typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'url_preview' in data &&
    'artists' in data &&
    'album' in data &&
    isNumber(data.id) &&
    isString(data.name) &&
    isString(data.url_preview) &&
    Array.isArray(data.artists) &&
    typeof data.album === 'object'
};

export const isFullSongResponse = (
  data: unknown,
): data is FullSongResponseAttributes => {
  if (data === null || data === undefined) return false;
  
  return typeof data === 'object' &&
    'name' in data &&
    'spotify_id' in data &&
    'url_preview' in data &&
    'duration' in data &&
    'year' in data &&
    'artists' in data &&
    'album' in data &&
    'genres' in data &&
    isString(data.name) &&
    isString(data.spotify_id) &&
    isString(data.url_preview) &&
    isNumber(data.year) &&
    isNumber(data.duration) &&
    Array.isArray(data.artists) &&
    Array.isArray(data.genres) &&
    typeof data.album === 'object'
};

export const isIASongData = (data: unknown): data is IASongResponse => {
  if (data === null || data === undefined) return false;

  return typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'duration' in data &&
    'url_preview' in data &&
    'artists' in data &&
    'genres' in data &&
    'album' in data &&
    'songDetails' in data &&
    isNumber(data.id) &&
    isString(data.name) &&
    isNumber(data.duration) &&
    isString(data.url_preview) &&
    Array.isArray(data.artists) &&
    Array.isArray(data.genres) &&
    typeof data.album === 'object' &&
    typeof data.songDetails === 'object'
};

export const isArtistSearchData = (
  data: unknown,
): data is artistSearchResults => {
  if (data === null || data === undefined) return false;

  return typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'album_cover' in data &&
    'type' in data &&
    isNumber(data.id) &&
    isString(data.name) &&
    isString(data.album_cover) &&
    isString(data.type) &&
    data.type === 'artist'
};

export const isAlbumSearchData = (
  data: unknown,
): data is albumSearchResults => {
  if (data === null || data === undefined) return false;

  return typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'artists' in data &&
    'album_cover' in data &&
    'type' in data &&
    isNumber(data.id) &&
    isString(data.name) &&
    isString(data.album_cover) &&
    isString(data.type) &&
    Array.isArray(data.artists) &&
    data.type === 'album'
};

export const isSongSearchData = (data: unknown): data is songSearchResults => {
  if (data === null || data === undefined) return false;

  return typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'artists' in data &&
    'album' in data &&
    'album_cover' in data &&
    'url_preview' in data &&
    'type' in data && 
    isNumber(data.id) &&
    isString(data.name) &&
    isString(data.album) &&
    isString(data.album_cover) &&
    isString(data.url_preview) &&
    isString(data.type) &&
    Array.isArray(data.artists)
};
