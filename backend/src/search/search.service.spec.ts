import { vi, type Mock } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { InternalServerErrorException } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { ZodError } from 'zod';
import { SearchService } from './search.service';
import {
  mockMultipleSeach,
  searchAlbums,
  searchArtists,
  searchSongs,
} from '../../test/data/searchModule/searchData';
import { SequelizeTimeoutError } from '@/utils/mockErrors';
import { ArtistsModel } from '../../models/artists/artists.model';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongsModel } from '../../models/songs/song.model';
import { albumRows, artistRows, songRows } from './utils/testsQueries';
import { SEARCH_ALBUMS_SQL, SEARCH_ARTISTS_SQL, SEARCH_SONGS_SQL } from './utils/contants';

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

describe('SearchService.searchAlbums retrieves albums from PostgreSQL', () => {
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

  it('returns the albums parsed with the expected properties', async () => {
    albumModel.sequelize.query.mockResolvedValue(albumRows);

    const result = await service.searchAlbums('Pablo Honey');

    expect(result).toHaveLength(searchAlbums.length);
    expect(result).toStrictEqual(searchAlbums);
  });

  it('tags every database row with type "album"', async () => {
    albumModel.sequelize.query.mockResolvedValue([
      { ...albumRows[0], type: 'song' },
    ]);

    const result = await service.searchAlbums('Pablo Honey');

    expect(result[0].type).toBe('album');
  });

  it('returns an empty array when the database finds no albums', async () => {
    albumModel.sequelize.query.mockResolvedValue([]);

    const result = await service.searchAlbums('does-not-exist');

    expect(result).toStrictEqual([]);
  });

  it('queries PostgreSQL with the fixed SQL function and bound replacements', async () => {
    albumModel.sequelize.query.mockResolvedValue(albumRows);

    await service.searchAlbums('Pablo Honey');

    expect(albumModel.sequelize.query).toHaveBeenCalledWith(
      SEARCH_ALBUMS_SQL,
      {
        type: QueryTypes.SELECT,
        replacements: { query: 'Pablo Honey', limit: 11 },
      },
    );
  });

  it('passes SQL metacharacters as a bound replacement instead of interpolating them', async () => {
    const maliciousQuery = "Pablo Honey'); DROP TABLE albums; --";
    albumModel.sequelize.query.mockResolvedValue(albumRows);

    await service.searchAlbums(maliciousQuery);

    expect(albumModel.sequelize.query).toHaveBeenCalledWith(
      SEARCH_ALBUMS_SQL,
      {
        type: QueryTypes.SELECT,
        replacements: { query: maliciousQuery, limit: 11 },
      },
    );
  });

  it.each(['', '   ', "O'Brien", 'Mägo de Oz'])(
    'forwards the query %j unchanged to the database',
    async (query) => {
      albumModel.sequelize.query.mockResolvedValue([]);

      await service.searchAlbums(query);

      expect(albumModel.sequelize.query).toHaveBeenCalledWith(
        SEARCH_ALBUMS_SQL,
        {
          type: QueryTypes.SELECT,
          replacements: { query, limit: 11 },
        },
      );
    },
  );

  it('does not query the artists or songs models', async () => {
    albumModel.sequelize.query.mockResolvedValue(albumRows);

    await service.searchAlbums('Pablo Honey');

    expect(artistModel.sequelize.query).not.toHaveBeenCalled();
    expect(songModel.sequelize.query).not.toHaveBeenCalled();
  });

  it("throws InternalServerErrorException when it couldn't connect with the database", async () => {
    albumModel.sequelize.query.mockImplementation(SequelizeTimeoutError());

    await expect(service.searchAlbums('Pablo Honey')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.searchAlbums('Pablo Honey')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });

  it('wraps non-Error failures with a generic database error message', async () => {
    albumModel.sequelize.query.mockRejectedValue('connection lost');

    await expect(service.searchAlbums('Pablo Honey')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.searchAlbums('Pablo Honey')).rejects.toThrow(
      'Database Error: Unknown database error',
    );
  });

  it('rejects rows with an empty album name', async () => {
    albumModel.sequelize.query.mockResolvedValue([
      { ...albumRows[0], name: '   ' },
    ]);

    await expect(service.searchAlbums('Pablo Honey')).rejects.toThrow(ZodError);
  });

  it('rejects rows with an empty artist name', async () => {
    albumModel.sequelize.query.mockResolvedValue([
      { ...albumRows[0], artists: ['   '] },
    ]);

    await expect(service.searchAlbums('Pablo Honey')).rejects.toThrow(ZodError);
  });

  it('rejects rows missing required album properties', async () => {
    albumModel.sequelize.query.mockResolvedValue([
      { id: 1, name: 'Pablo Honey' },
    ]);

    await expect(service.searchAlbums('Pablo Honey')).rejects.toThrow(ZodError);
  });
});

describe('SearchService.seachSongs retrieves songs from PostgreSQL', () => {
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

  it('returns the songs parsed with the expected properties', async () => {
    songModel.sequelize.query.mockResolvedValue(songRows);

    const result = await service.seachSongs('Creep');

    expect(result).toHaveLength(searchSongs.length);
    expect(result).toStrictEqual(searchSongs);
  });

  it('tags every database row with type "song"', async () => {
    songModel.sequelize.query.mockResolvedValue([
      { ...songRows[0], type: 'album' },
    ]);

    const result = await service.seachSongs('Creep');

    expect(result[0].type).toBe('song');
  });

  it('returns an empty array when the database finds no songs', async () => {
    songModel.sequelize.query.mockResolvedValue([]);

    const result = await service.seachSongs('does-not-exist');

    expect(result).toStrictEqual([]);
  });

  it('queries PostgreSQL with the fixed SQL function and bound replacements', async () => {
    songModel.sequelize.query.mockResolvedValue(songRows);

    await service.seachSongs('Creep');

    expect(songModel.sequelize.query).toHaveBeenCalledWith(
      SEARCH_SONGS_SQL,
      {
        type: QueryTypes.SELECT,
        replacements: { query: 'Creep', limit: 11 },
      },
    );
  });

  it('passes SQL metacharacters as a bound replacement instead of interpolating them', async () => {
    const maliciousQuery = "Creep'); DROP TABLE songs; --";
    songModel.sequelize.query.mockResolvedValue(songRows);

    await service.seachSongs(maliciousQuery);

    expect(songModel.sequelize.query).toHaveBeenCalledWith(
      SEARCH_SONGS_SQL,
      {
        type: QueryTypes.SELECT,
        replacements: { query: maliciousQuery, limit: 11 },
      },
    );
  });

  it.each(['', '   ', "O'Brien", 'Mägo de Oz'])(
    'forwards the query %j unchanged to the database',
    async (query) => {
      songModel.sequelize.query.mockResolvedValue([]);

      await service.seachSongs(query);

      expect(songModel.sequelize.query).toHaveBeenCalledWith(
        SEARCH_SONGS_SQL,
        {
          type: QueryTypes.SELECT,
          replacements: { query, limit: 11 },
        },
      );
    },
  );

  it('does not query the artists or albums models', async () => {
    songModel.sequelize.query.mockResolvedValue(songRows);

    await service.seachSongs('Creep');

    expect(artistModel.sequelize.query).not.toHaveBeenCalled();
    expect(albumModel.sequelize.query).not.toHaveBeenCalled();
  });

  it("throws InternalServerErrorException when it couldn't connect with the database", async () => {
    songModel.sequelize.query.mockImplementation(SequelizeTimeoutError());

    await expect(service.seachSongs('Creep')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.seachSongs('Creep')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });

  it('wraps non-Error failures with a generic database error message', async () => {
    songModel.sequelize.query.mockRejectedValue('connection lost');

    await expect(service.seachSongs('Creep')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.seachSongs('Creep')).rejects.toThrow(
      'Database Error: Unknown database error',
    );
  });

  it('rejects rows with an empty song name', async () => {
    songModel.sequelize.query.mockResolvedValue([
      { ...songRows[0], name: '   ' },
    ]);

    await expect(service.seachSongs('Creep')).rejects.toThrow(ZodError);
  });

  it('rejects rows with an empty album name', async () => {
    songModel.sequelize.query.mockResolvedValue([
      { ...songRows[0], album: '   ' },
    ]);

    await expect(service.seachSongs('Creep')).rejects.toThrow(ZodError);
  });

  it('rejects rows with an empty preview URL', async () => {
    songModel.sequelize.query.mockResolvedValue([
      { ...songRows[0], url_preview: '   ' },
    ]);

    await expect(service.seachSongs('Creep')).rejects.toThrow(ZodError);
  });

  it('rejects rows missing required song properties', async () => {
    songModel.sequelize.query.mockResolvedValue([
      { id: 1, name: 'Creep' },
    ]);

    await expect(service.seachSongs('Creep')).rejects.toThrow(ZodError);
  });
});

describe('SearchService.multipleSearch combines the three searches', () => {
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

  it('returns the exact matches and the remaining results for each type', async () => {
    artistModel.sequelize.query.mockResolvedValue(artistRows);
    albumModel.sequelize.query.mockResolvedValue(albumRows);
    songModel.sequelize.query.mockResolvedValue(songRows);

    const result = await service.multipleSearch('Nirvana');

    expect(result).toStrictEqual(mockMultipleSeach);
    expect(result.exactArtist).toStrictEqual(searchArtists[0]);
    expect(result.exactAlbum).toStrictEqual(searchAlbums[0]);
    expect(result.exactSong).toStrictEqual(searchSongs[0]);
    expect(result.artistResults).toStrictEqual(searchArtists.slice(1));
    expect(result.albumResults).toStrictEqual(searchAlbums.slice(1));
    expect(result.songResults).toStrictEqual(searchSongs.slice(1));
  });

  it('searches artists, albums and songs with the same query and limit', async () => {
    artistModel.sequelize.query.mockResolvedValue(artistRows);
    albumModel.sequelize.query.mockResolvedValue(albumRows);
    songModel.sequelize.query.mockResolvedValue(songRows);

    await service.multipleSearch('Nirvana');

    expect(artistModel.sequelize.query).toHaveBeenCalledWith(
      SEARCH_ARTISTS_SQL,
      {
        type: QueryTypes.SELECT,
        replacements: { query: 'Nirvana', limit: 11 },
      },
    );
    expect(albumModel.sequelize.query).toHaveBeenCalledWith(SEARCH_ALBUMS_SQL, {
      type: QueryTypes.SELECT,
      replacements: { query: 'Nirvana', limit: 11 },
    });
    expect(songModel.sequelize.query).toHaveBeenCalledWith(SEARCH_SONGS_SQL, {
      type: QueryTypes.SELECT,
      replacements: { query: 'Nirvana', limit: 11 },
    });
  });

  it('queries each model exactly once per search', async () => {
    artistModel.sequelize.query.mockResolvedValue(artistRows);
    albumModel.sequelize.query.mockResolvedValue(albumRows);
    songModel.sequelize.query.mockResolvedValue(songRows);

    await service.multipleSearch('Nirvana');

    expect(artistModel.sequelize.query).toHaveBeenCalledTimes(1);
    expect(albumModel.sequelize.query).toHaveBeenCalledTimes(1);
    expect(songModel.sequelize.query).toHaveBeenCalledTimes(1);
  });

  it('propagates database errors instead of returning partial results', async () => {
    artistModel.sequelize.query.mockResolvedValue(artistRows);
    albumModel.sequelize.query.mockImplementation(SequelizeTimeoutError());

    await expect(service.multipleSearch('Nirvana')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.multipleSearch('Nirvana')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });

  it('rejects when any of the underlying searches returns invalid rows', async () => {
    artistModel.sequelize.query.mockResolvedValue(artistRows);
    albumModel.sequelize.query.mockResolvedValue([{ id: 1, name: '   ' }]);
    songModel.sequelize.query.mockResolvedValue(songRows);

    await expect(service.multipleSearch('Nirvana')).rejects.toThrow(ZodError);
  });
});
