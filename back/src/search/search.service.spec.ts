/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import {
  searchAlbums,
  searchArtists,
  searchSongs,
} from '../../test/data/searchModule/searchData';
import { ServiceUnavailableException } from '@nestjs/common';
import { expectSearchProps } from 'src/utils/expectSearch';
import { Client, SearchResponse } from 'elasticsearch';
import {
  albumSearchResults,
  albumsHitStructure,
  artistHitStructure,
  artistSearchResults,
  songSearchResults,
  songsHitStructure,
} from 'src/types/searchTypes';

describe('SearchService retrieves and sort lists of searched data from the elasticSearch server', () => {
  let service: SearchService;
  let esService: jest.Mocked<Client>;
  const artistHitData = {
    hits: { hits: searchArtists.map((doc) => ({ _source: doc })) },
  } as unknown as SearchResponse<artistHitStructure>;
  const albumHitData = {
    hits: { hits: searchAlbums.map((doc) => ({ _source: doc })) },
  } as unknown as SearchResponse<albumsHitStructure>;
  const songsHitData = {
    hits: { hits: searchSongs.map((doc) => ({ _source: doc })) },
  } as unknown as SearchResponse<songsHitStructure>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: 'BonsaiClient',
          useValue: {
            ping: jest
              .fn()
              .mockImplementation((_params, callback: (err: null) => void) =>
                callback(null),
              ),
            search: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    esService = module.get('BonsaiClient');
  });

  it('ping resolves true when is called to confirm a communication with the DB', async () => {
    const result = await service.ping();
    expect(esService.ping).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('searchArtists returns a list of artists with expected properties', async () => {
    esService.search.mockResolvedValue(artistHitData);

    const result = await service.searchArtists('Nirvana');
    expect(result).toHaveLength(4);
    expect(result).toStrictEqual(searchArtists);
  });

  it('searchAlbums returns a list of albums with expected properties', async () => {
    esService.search.mockResolvedValue(albumHitData);

    const result = await service.searchAlbums('Pablo Honey');
    expect(result).toHaveLength(3);
    expect(result).toStrictEqual(searchAlbums);
  });

  it('seachSongs returns a list of albums with expected properties', async () => {
    esService.search.mockResolvedValue(songsHitData);

    const result = await service.seachSongs('Creep');
    expect(result).toHaveLength(3);
    expect(result).toStrictEqual(searchSongs);
  });

  it('sortResults sorts the list to put in first the most similar to the query', () => {
    const sortedResults = service.sortResults<artistSearchResults>(
      'Mägo de Oz',
      searchArtists,
    );
    expect(sortedResults.length).toBeGreaterThan(0);
    expect(sortedResults[0]).toStrictEqual({
      id: 4,
      name: 'Mägo de Oz',
      album_cover: 'url3',
      type: 'artist',
    });
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

  it('multipleSearch returns an object containing results from artists, albums and songs', async () => {
    esService.search
      .mockResolvedValueOnce(artistHitData)
      .mockResolvedValueOnce(albumHitData)
      .mockResolvedValueOnce(songsHitData);

    const multipleResults = await service.multipleSearch('Nirvana');
    expectSearchProps(multipleResults);
  });
});

describe("SearchService throws errors when the methods couldn't connect with the database", () => {
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
              .mockImplementation((_params, callback: (err: Error) => void) =>
                callback(new Error('Ping failed')),
              ),
          },
        },
      ],
    }).compile();

    esService = module.get<Client>('BonsaiClient');
    service = module.get<SearchService>(SearchService);
  });

  it("Ping throws an error when it couldn't recieve a ping from the ES server", async () => {
    await expect(service.ping()).rejects.toThrow(ServiceUnavailableException);
    await expect(service.ping()).rejects.toThrow(
      /ElasticSearch is not responding: .*Ping failed/,
    );
    expect(esService.ping).toHaveBeenCalled();
  });

  it("multipleSearch throws a connection error if some method couldn't received a response from ES", async () => {
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

  it('multipleSearch throws unknown database Error when a unidentified error ocurred while searching', async () => {
    esService.search = jest.fn().mockRejectedValue(undefined);
    await expect(service.multipleSearch('Pepe')).rejects.toThrow(
      ServiceUnavailableException,
    );
    await expect(service.multipleSearch('Pepe')).rejects.toThrow(
      /ElasticSearch is not responding: Unknown database error/,
    );
    expect(esService.search).toHaveBeenCalled();
  });

  it("multipleSearch throws timeout error when it couldn't resolve the promise in time", async () => {
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
});
