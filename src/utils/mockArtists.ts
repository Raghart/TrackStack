import { FindAllArtistsParams, FindNameParams } from 'src/types/mockTypes';
import {
  artistData,
  artistSongs,
} from '../../test/data/artistsModule/serArtistData';
import { seedSort } from './seedSort';

export const findAllArtists = jest
  .fn()
  .mockImplementation(({ offset, limit }: FindAllArtistsParams) => {
    const sorted = [...artistData].sort((a, b) => seedSort(a) - seedSort(b));
    return sorted
      .slice(offset, offset + limit)
      .map((artist) => ({ get: () => artist }));
  });

export const findOneArtistSongs = jest
  .fn()
  .mockImplementation(({ where }: FindNameParams) => {
    const name = where.name[Object.getOwnPropertySymbols(where.name)[0]];
    const songs = artistSongs.find((artist) => artist.name === name);
    return songs ? { get: () => songs } : null;
  });
