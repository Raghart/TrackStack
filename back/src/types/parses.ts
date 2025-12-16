import { BadRequestException } from '@nestjs/common';
import { AlbumWithSongs } from './albumAttributes';
import { ArtistWithSongs } from './artistAttributes';
import {
  albumSearchResults,
  artistSearchResults,
  songSearchResults,
} from './searchTypes';
import {
  FullSongResponseAttributes,
  IASongResponse,
  SongResponseAttributes,
} from './songAttributes';
import { SongGenresRPWithSongs } from './songGenresAttributes';
import {
  isAlbumSearchData,
  isAlbumSong,
  isArtistSearchData,
  isArtistSongs,
  isFullSongResponse,
  isIASongData,
  isNumberArray,
  isSongGenres,
  isSongResponse,
  isSongSearchData,
  isStringArray,
  isString,
  isNumber,
} from './verify';

export const parseString = (text: unknown): string => {
  if (isString(text)) return text;
  throw new BadRequestException(
    `The data recieved is not a string: ${String(text)}`,
  );
};

export const parseStringArray = (array: unknown): string[] => {
  if (isStringArray(array)) return array;
  throw new BadRequestException(
    'The data recieved is not an array of strings.',
  );
};

export const parseNumberArray = (array: unknown): number[] => {
  if (isNumberArray(array)) return array;
  throw new BadRequestException(
    `Error: the data is neither an array or a number: "${String(array)}"`,
  );
};

export const parseFloatNum = (value: unknown): number => {
  if (isNumber(value) && typeof value === "number") return value;
  if (isNumber(value) && typeof value === "string") return parseFloat(value);

  throw new BadRequestException(
    `The data received is not a valid number or a string of numbers: ${String(value)}`,
  );
};

export const parseAlbumSong = (data: unknown): AlbumWithSongs => {
  if (isAlbumSong(data)) return data;
  throw new BadRequestException(
    'There was an error trying to find the songs of this album.',
  );
};

export const parseArtistSongs = (data: unknown): ArtistWithSongs => {
  if (isArtistSongs(data)) return data;
  throw new BadRequestException(
    "The data doesn't have the correct song format.",
  );
};

export const parseSongGenres = (data: unknown): SongGenresRPWithSongs => {
  if (isSongGenres(data)) return data;
  throw new BadRequestException(
    'The data recieved is not in the correct Song-Genre Format.',
  );
};

export const parseSongResponse = (data: unknown): SongResponseAttributes => {
  if (isSongResponse(data)) return data;
  throw new BadRequestException(
    "The data recieved doesn't match the required song response structure.",
  );
};

export const parseFullSongResponse = (
  data: unknown,
): FullSongResponseAttributes => {
  if (isFullSongResponse(data)) return data;
  throw new BadRequestException(
    "The data recieved doesn't match the required full song response structure.",
  );
};

export const parseIASongData = (data: unknown): IASongResponse => {
  if (isIASongData(data)) return data;
  throw new BadRequestException(
    "The data received doesn't have the required structure for the IA recommendation.",
  );
};

export const parseArtistSearchData = (data: unknown): artistSearchResults => {
  if (isArtistSearchData(data)) return data;
  throw new BadRequestException(
    `The data received didn't have the correct artistSearch format: "${String(data)}".`,
  );
};

export const parseAlbumSearchData = (data: unknown): albumSearchResults => {
  if (isAlbumSearchData(data)) return data;
  throw new BadRequestException(
    `The data recieved is not in a valid albumSearch format: "${String(data)}".`,
  );
};

export const parseSongSearchData = (data: unknown): songSearchResults => {
  if (isSongSearchData(data)) return data;
  throw new BadRequestException(
    `The data recieved is not in a valid songSearch format: "${String(data)}"`,
  );
};
