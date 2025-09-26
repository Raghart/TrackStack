import { FindNameParams } from 'src/types/mockTypes';
import { albumSongs } from '../../test/data/albumsModule/AlbumData';

export const findOneAlbum = jest
  .fn()
  .mockImplementation(({ where }: FindNameParams) => {
    const name = where.name[Object.getOwnPropertySymbols(where.name)[0]];
    const album = albumSongs.find((album) => album.name === name);
    return album ? { get: () => album } : null;
  });
