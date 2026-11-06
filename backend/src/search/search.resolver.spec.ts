import { vi, type Mock } from 'vitest';
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { ZodError } from 'zod';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';
import {
  mockMultipleSeach,
  searchAlbums,
  searchArtists,
  searchSongs,
} from '../../test/data/searchModule/searchData';

describe('SearchResolver forwards the queries to SearchService and returns its results', () => {
  let resolver: SearchResolver;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchResolver,
        {
          provide: SearchService,
          useValue: {
            multipleSearch: vi.fn().mockResolvedValue(mockMultipleSeach),
            searchArtists: vi.fn().mockResolvedValue(searchArtists),
            searchAlbums: vi.fn().mockResolvedValue(searchAlbums),
            seachSongs: vi.fn().mockResolvedValue(searchSongs),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    resolver = module.get<SearchResolver>(SearchResolver);
  });

  it('multipleSearch returns the exact and remaining results from the service', async () => {
    const result = await resolver.multipleSearch('Nirvana');

    expect(service.multipleSearch).toHaveBeenCalledWith('Nirvana');
    expect(result).toBe(mockMultipleSeach);
    expect(result.exactArtist).toStrictEqual(searchArtists[0]);
    expect(result.exactAlbum).toStrictEqual(searchAlbums[0]);
    expect(result.exactSong).toStrictEqual(searchSongs[0]);
    expect(result.artistResults).toStrictEqual(searchArtists.slice(1));
    expect(result.albumResults).toStrictEqual(searchAlbums.slice(1));
    expect(result.songResults).toStrictEqual(searchSongs.slice(1));
  });

  it('artistSearch returns the artists from the service', async () => {
    const result = await resolver.artistSearch('Nirvana');

    expect(service.searchArtists).toHaveBeenCalledWith('Nirvana');
    expect(result).toBe(searchArtists);
  });

  it('albumSearch returns the albums from the service', async () => {
    const result = await resolver.albumSearch('Pablo Honey');

    expect(service.searchAlbums).toHaveBeenCalledWith('Pablo Honey');
    expect(result).toBe(searchAlbums);
  });

  it('songSearch returns the songs from the service', async () => {
    const result = await resolver.songSearch('Creep');

    expect(service.seachSongs).toHaveBeenCalledWith('Creep');
    expect(result).toBe(searchSongs);
  });

  it('multipleSearch returns empty collections when the service finds nothing', async () => {
    const emptyResults = {
      exactArtist: undefined,
      exactAlbum: undefined,
      exactSong: undefined,
      artistResults: [],
      albumResults: [],
      songResults: [],
    };
    (service.multipleSearch as Mock).mockResolvedValue(emptyResults);

    const result = await resolver.multipleSearch('does-not-exist');

    expect(result).toStrictEqual(emptyResults);
  });

  it('artistSearch returns an empty array when the service finds no artists', async () => {
    (service.searchArtists as Mock).mockResolvedValue([]);

    const result = await resolver.artistSearch('does-not-exist');

    expect(result).toStrictEqual([]);
  });

  it('albumSearch returns an empty array when the service finds no albums', async () => {
    (service.searchAlbums as Mock).mockResolvedValue([]);

    const result = await resolver.albumSearch('does-not-exist');

    expect(result).toStrictEqual([]);
  });

  it('songSearch returns an empty array when the service finds no songs', async () => {
    (service.seachSongs as Mock).mockResolvedValue([]);

    const result = await resolver.songSearch('does-not-exist');

    expect(result).toStrictEqual([]);
  });

  it('artistSearch only calls the artists search of the service', async () => {
    await resolver.artistSearch('Nirvana');

    expect(service.searchArtists).toHaveBeenCalledTimes(1);
    expect(service.searchAlbums).not.toHaveBeenCalled();
    expect(service.seachSongs).not.toHaveBeenCalled();
    expect(service.multipleSearch).not.toHaveBeenCalled();
  });

  it('albumSearch only calls the albums search of the service', async () => {
    await resolver.albumSearch('Pablo Honey');

    expect(service.searchAlbums).toHaveBeenCalledTimes(1);
    expect(service.searchArtists).not.toHaveBeenCalled();
    expect(service.seachSongs).not.toHaveBeenCalled();
    expect(service.multipleSearch).not.toHaveBeenCalled();
  });

  it('songSearch only calls the songs search of the service', async () => {
    await resolver.songSearch('Creep');

    expect(service.seachSongs).toHaveBeenCalledTimes(1);
    expect(service.searchArtists).not.toHaveBeenCalled();
    expect(service.searchAlbums).not.toHaveBeenCalled();
    expect(service.multipleSearch).not.toHaveBeenCalled();
  });

  it('multipleSearch only calls the combined search of the service', async () => {
    await resolver.multipleSearch('Nirvana');

    expect(service.multipleSearch).toHaveBeenCalledTimes(1);
    expect(service.searchArtists).not.toHaveBeenCalled();
    expect(service.searchAlbums).not.toHaveBeenCalled();
    expect(service.seachSongs).not.toHaveBeenCalled();
  });

  it.each(['', '   ', "O'Brien", 'Mägo de Oz', "Nirvana'); DROP TABLE artists; --"])(
    'multipleSearch forwards the query %j unchanged to the service',
    async (query) => {
      await resolver.multipleSearch(query);

      expect(service.multipleSearch).toHaveBeenCalledWith(query);
    },
  );

  it.each(['', '   ', "O'Brien", 'Mägo de Oz', "Nirvana'); DROP TABLE artists; --"])(
    'artistSearch forwards the query %j unchanged to the service',
    async (query) => {
      await resolver.artistSearch(query);

      expect(service.searchArtists).toHaveBeenCalledWith(query);
    },
  );

  it.each(['', '   ', "O'Brien", 'Mägo de Oz', "Pablo Honey'); DROP TABLE albums; --"])(
    'albumSearch forwards the query %j unchanged to the service',
    async (query) => {
      await resolver.albumSearch(query);

      expect(service.searchAlbums).toHaveBeenCalledWith(query);
    },
  );

  it.each(['', '   ', "O'Brien", 'Mägo de Oz', "Creep'); DROP TABLE songs; --"])(
    'songSearch forwards the query %j unchanged to the service',
    async (query) => {
      await resolver.songSearch(query);

      expect(service.seachSongs).toHaveBeenCalledWith(query);
    },
  );
});

describe('SearchResolver propagates the errors from SearchService to the client', () => {
  let resolver: SearchResolver;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchResolver,
        {
          provide: SearchService,
          useValue: {
            multipleSearch: vi.fn(),
            searchArtists: vi.fn(),
            searchAlbums: vi.fn(),
            seachSongs: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    resolver = module.get<SearchResolver>(SearchResolver);
  });

  it('multipleSearch throws the database error reported by the service', async () => {
    (service.multipleSearch as Mock).mockRejectedValue(
      new InternalServerErrorException(
        new Error('Database Error: SequelizeTimeoutError: Query timed out'),
      ),
    );

    await expect(resolver.multipleSearch('Nirvana')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.multipleSearch('Nirvana')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.multipleSearch).toHaveBeenCalledWith('Nirvana');
  });

  it('artistSearch throws the database error reported by the service', async () => {
    (service.searchArtists as Mock).mockRejectedValue(
      new InternalServerErrorException(
        new Error('Database Error: SequelizeTimeoutError: Query timed out'),
      ),
    );

    await expect(resolver.artistSearch('Nirvana')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.artistSearch('Nirvana')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.searchArtists).toHaveBeenCalledWith('Nirvana');
  });

  it('albumSearch throws the database error reported by the service', async () => {
    (service.searchAlbums as Mock).mockRejectedValue(
      new InternalServerErrorException(
        new Error('Database Error: SequelizeTimeoutError: Query timed out'),
      ),
    );

    await expect(resolver.albumSearch('Pablo Honey')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.albumSearch('Pablo Honey')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.searchAlbums).toHaveBeenCalledWith('Pablo Honey');
  });

  it('songSearch throws the database error reported by the service', async () => {
    (service.seachSongs as Mock).mockRejectedValue(
      new InternalServerErrorException(
        new Error('Database Error: SequelizeTimeoutError: Query timed out'),
      ),
    );

    await expect(resolver.songSearch('Creep')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.songSearch('Creep')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.seachSongs).toHaveBeenCalledWith('Creep');
  });

  it('propagates validation errors from the service without wrapping them', async () => {
    const validationError = new ZodError([]);
    (service.searchArtists as Mock).mockRejectedValue(validationError);

    await expect(resolver.artistSearch('Nirvana')).rejects.toBe(validationError);
    expect(service.searchArtists).toHaveBeenCalledWith('Nirvana');
  });

  it('propagates unknown errors from the service unchanged', async () => {
    const unexpectedError = new Error('unexpected failure');
    (service.multipleSearch as Mock).mockRejectedValue(unexpectedError);

    await expect(resolver.multipleSearch('Nirvana')).rejects.toBe(
      unexpectedError,
    );
    expect(service.multipleSearch).toHaveBeenCalledWith('Nirvana');
  });
});
