import { vi, type Mock } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { InternalServerErrorException } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { ZodError } from 'zod';
import { SearchService } from './search.service';
import {
  searchAlbums,
  searchArtists,
  searchSongs,
} from '../../test/data/searchModule/searchData';
import { expectSearchProps } from '@/utils/expectSearch';
import { SequelizeTimeoutError } from '@/utils/mockErrors';
import { ArtistsModel } from '../../models/artists/artists.model';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongsModel } from '../../models/songs/song.model';

const SEARCH_ARTISTS_SQL =
  'SELECT id, name, album_cover FROM search_artists(:query, :limit);';

// The SQL function returns only the columns it selects (no `type`).
const artistRows = searchArtists.map(({ id, name, album_cover }) => ({
  id,
  name,
  album_cover,
}));

const createModelMock = () => ({ sequelize: { query: vi.fn() } });

describe('SearchService.searchArtists retrieves artists from PostgreSQL', () => {
  let service: SearchService;
  let artistModel: { sequelize: { query: Mock } };
  let albumModel: { sequelize: { query: Mock } };
  let songModel: { sequelize: { query: Mock } };

  beforeEach(async () => {
    artistModel = createModelMock();
    albumModel = createModelMock();
    songModel = createModelMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: getModelToken(ArtistsModel), useValue: artistModel },
        { provide: getModelToken(AlbumsModel), useValue: albumModel },
        { provide: getModelToken(SongsModel), useValue: songModel },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('returns the artists parsed with the expected properties', async () => {
    artistModel.sequelize.query.mockResolvedValue(artistRows);

    const result = await service.searchArtists('Nirvana');

    expect(result).toHaveLength(searchArtists.length);
    expect(result).toStrictEqual(searchArtists);
  });

  it('tags every database row with type "artist"', async () => {
    artistModel.sequelize.query.mockResolvedValue([
      { ...artistRows[0], type: 'song' },
    ]);

    const result = await service.searchArtists('Nirvana');

    expect(result[0].type).toBe('artist');
  });

  it('returns an empty array when the database finds no artists', async () => {
    artistModel.sequelize.query.mockResolvedValue([]);

    const result = await service.searchArtists('does-not-exist');

    expect(result).toStrictEqual([]);
  });

  it('queries PostgreSQL with the fixed SQL function and bound replacements', async () => {
    artistModel.sequelize.query.mockResolvedValue(artistRows);

    await service.searchArtists('Nirvana');

    expect(artistModel.sequelize.query).toHaveBeenCalledWith(
      SEARCH_ARTISTS_SQL,
      {
        type: QueryTypes.SELECT,
        replacements: { query: 'Nirvana', limit: 11 },
      },
    );
  });

  it('passes SQL metacharacters as a bound replacement instead of interpolating them', async () => {
    const maliciousQuery = "Nirvana'); DROP TABLE artists; --";
    artistModel.sequelize.query.mockResolvedValue(artistRows);

    await service.searchArtists(maliciousQuery);

    expect(artistModel.sequelize.query).toHaveBeenCalledWith(
      SEARCH_ARTISTS_SQL,
      {
        type: QueryTypes.SELECT,
        replacements: { query: maliciousQuery, limit: 11 },
      },
    );
  });

  it.each(['', '   ', "O'Brien", 'Mägo de Oz'])(
    'forwards the query %j unchanged to the database',
    async (query) => {
      artistModel.sequelize.query.mockResolvedValue([]);

      await service.searchArtists(query);

      expect(artistModel.sequelize.query).toHaveBeenCalledWith(
        SEARCH_ARTISTS_SQL,
        {
          type: QueryTypes.SELECT,
          replacements: { query, limit: 11 },
        },
      );
    },
  );

  it('does not query the albums or songs models', async () => {
    artistModel.sequelize.query.mockResolvedValue(artistRows);

    await service.searchArtists('Nirvana');

    expect(albumModel.sequelize.query).not.toHaveBeenCalled();
    expect(songModel.sequelize.query).not.toHaveBeenCalled();
  });

  it("throws InternalServerErrorException when it couldn't connect with the database", async () => {
    artistModel.sequelize.query.mockImplementation(SequelizeTimeoutError());

    await expect(service.searchArtists('Nirvana')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.searchArtists('Nirvana')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });

  it('wraps non-Error failures with a generic database error message', async () => {
    artistModel.sequelize.query.mockRejectedValue('connection lost');

    await expect(service.searchArtists('Nirvana')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.searchArtists('Nirvana')).rejects.toThrow(
      'Database Error: Unknown database error',
    );
  });

  it('rejects rows with an empty artist name', async () => {
    artistModel.sequelize.query.mockResolvedValue([
      { id: 1, name: '   ', album_cover: 'url1' },
    ]);

    await expect(service.searchArtists('Nirvana')).rejects.toThrow(ZodError);
  });

  it('rejects rows missing required artist properties', async () => {
    artistModel.sequelize.query.mockResolvedValue([
      { id: 1, name: 'Nirvana' },
    ]);

    await expect(service.searchArtists('Nirvana')).rejects.toThrow(ZodError);
  });
});

describe.skip('SearchService retrieves and sort the data incoming from the elasticSearch server', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: 'PostgreSQL',
          useValue: {
            search: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('searchAlbums returns an albums array with expected properties', async () => {
    const result = await service.searchAlbums('Pablo Honey');
    expect(result).toHaveLength(3);
    expect(result).toStrictEqual(searchAlbums);
  });

  it('seachSongs returns a songs array with expected properties', async () => {
    const result = await service.seachSongs('Creep');
    expect(result).toHaveLength(3);
    expect(result).toStrictEqual(searchSongs);
  });

  it('multipleSearch returns an object containing results from artists, albums and songs', async () => {
    const multipleResults = await service.multipleSearch('Nirvana');
    expectSearchProps(multipleResults);
  });
});
