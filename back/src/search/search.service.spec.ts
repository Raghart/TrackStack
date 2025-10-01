/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import {
  searchAlbums,
  searchArtists,
  searchSongs,
} from '../../test/data/searchModule/searchData';
import { ServiceUnavailableException } from '@nestjs/common';
import { expectSearchProps } from 'src/utils/expectSearch';
import { Client } from 'elasticsearch';
import {
  albumSearchResults,
  artistSearchResults,
  songSearchResults,
} from 'src/types/searchTypes';

describe('SearchService', () => {
  let service: SearchService;
  let esService: Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: 'BonsaiClient',
          useValue: {
            ping: jest
              .fn()
              .mockImplementation((params, callback) => callback(null)),

            search: jest
              .fn()
              .mockResolvedValueOnce({
                hits: { hits: searchArtists.map((doc) => ({ _source: doc })) },
              })
              .mockResolvedValueOnce({
                hits: { hits: searchAlbums.map((doc) => ({ _source: doc })) },
              })
              .mockResolvedValueOnce({
                hits: { hits: searchSongs.map((doc) => ({ _source: doc })) },
              }),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    esService = module.get<Client>('BonsaiClient');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('ping resolves true when is called to confirm a communication with the DB', async () => {
    const result = await service.ping();
    expect(esService.ping).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('multipleSearch result has correct properties', async () => {
    const result = await service.multipleSearch('Nirvana');
    expectSearchProps(result);
    expect(result.artistResults.length).toBeGreaterThan(0);
    expect(result.albumResults.length).toBeGreaterThan(0);
    expect(result.songResults.length).toBeGreaterThan(0);
  });

  it('multipleSearch has expected results', async () => {
    const result = await service.multipleSearch('Nirvana');

    expect(result.exactArtist).toEqual(searchArtists[0]);
    expect(result.exactAlbum).toEqual(searchAlbums[0]);
    expect(result.exactSong).toEqual(searchSongs[0]);

    expect(result.artistResults).toEqual(searchArtists.slice(1));
    expect(result.albumResults).toEqual(searchAlbums.slice(1));
    expect(result.songResults).toEqual(searchSongs.slice(1));
  });

  it('sortResults sorts correctly if the first item is exactly the query', () => {
    expect(
      service.sortResults<artistSearchResults>('nirvana', searchArtists)[0]
        .name,
    ).toBe('Nirvana');
    expect(
      service.sortResults<albumSearchResults>('pablo honey', searchAlbums)[0]
        .name,
    ).toBe('Pablo Honey');
    expect(
      service.sortResults<songSearchResults>('creep', searchSongs)[0].name,
    ).toBe('Creep');
  });

  it('sortResults sorts correctly the first item even if it has an unique accentuation', () => {
    expect(
      service.sortResults<artistSearchResults>('mago de oz', searchArtists)[0]
        .name,
    ).toBe('Mägo de Oz');
  });

  it("sortResults sorts correctly even if the query doesn't have the exact name", () => {
    expect(
      service.sortResults<artistSearchResults>('nirv', searchArtists)[0].name,
    ).toBe('Nirvana');
    expect(
      service.sortResults<albumSearchResults>('nevermind', searchAlbums)[0]
        .name,
    ).toBe('Nevermind (Remastered)');
    expect(
      service.sortResults<songSearchResults>('wonder', searchSongs)[0].name,
    ).toBe('Wonderwall');
  });

  it("sortResults leaves the rest of the items as they are if the doesn't match the query", () => {
    expect(
      service.sortResults<artistSearchResults>('nirvana', searchArtists)[1]
        .name,
    ).not.toBe('Nirvana');
    expect(
      service.sortResults<albumSearchResults>('nevermind', searchAlbums)[1]
        .name,
    ).not.toBe('Nevermind (Remastered)');
    expect(
      service.sortResults<songSearchResults>('come', searchSongs)[1].name,
    ).not.toBe('Come as You Are');
  });
});

describe('SearchService Error handler', () => {
  let service: SearchService;
  let esService: Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: 'BonsaiClient',
          useValue: {
            ping: jest
              .fn()
              .mockImplementation((params, callback) =>
                callback(new Error('Ping failed')),
              ),
          },
        },
      ],
    }).compile();

    esService = module.get<Client>('BonsaiClient');
    service = module.get<SearchService>(SearchService);
  });

  it('Ping Error Handler', async () => {
    await expect(service.ping()).rejects.toThrow(ServiceUnavailableException);
    await expect(service.ping()).rejects.toThrow(
      /ElasticSearch is not responding: .*Ping failed/,
    );
    expect(esService.ping).toHaveBeenCalled();
  });

  it('multipleSearch Connection Error', async () => {
    esService.search = jest
      .fn()
      .mockRejectedValue(new Error('No living connections'));
    await expect(service.multipleSearch('Pepe')).rejects.toThrow(
      ServiceUnavailableException,
    );
    await expect(service.multipleSearch('Pepe')).rejects.toThrow(
      /ElasticSearch is not responding: .*living connections/,
    );
    expect(esService.search).toHaveBeenCalled();
  });

  it('multipleSearch Timeout Error', async () => {
    esService.search = jest
      .fn()
      .mockRejectedValue(new Error('timeout_exception: search timed out'));
    await expect(service.multipleSearch('Pepe')).rejects.toThrow(
      ServiceUnavailableException,
    );
    await expect(service.multipleSearch('Pepe')).rejects.toThrow(
      /ElasticSearch is not responding: .*timeout_exception: search timed out/,
    );
    expect(esService.search).toHaveBeenCalled();
  });

  it('multipleSearch Unexpected Error', async () => {
    esService.search = jest
      .fn()
      .mockRejectedValue(new Error('Unexpected error from ElasticSearch'));
    await expect(service.multipleSearch('Pepe')).rejects.toThrow(
      ServiceUnavailableException,
    );
    await expect(service.multipleSearch('Pepe')).rejects.toThrow(
      /ElasticSearch is not responding: .*Unexpected error from ElasticSearch/,
    );
    expect(esService.search).toHaveBeenCalled();
  });
});
