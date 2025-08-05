import { FindAllGenreSongsParams } from 'src/types/mockTypes';
import { songGenresData } from '../../test/data/songGenresModule/songGenresData';

export const findAllGenreSongs = jest
  .fn()
  .mockImplementation(({ offset, limit, include }: FindAllGenreSongsParams) => {
    const genreObj = include?.[0]?.where?.genre;
    if (!genreObj) return null;
    const genreSymbol = Object.getOwnPropertySymbols(genreObj)[0];
    const genreFilter = genreObj[genreSymbol];

    const filtered = songGenresData.filter((entry) =>
      entry.genre.some(
        (g) => g.genre.toLowerCase() === genreFilter.toLowerCase(),
      ),
    );

    const paginated = filtered.slice(offset, offset + limit);

    return paginated.length > 0
      ? paginated.map((song) => ({ get: () => song }))
      : null;
  });
