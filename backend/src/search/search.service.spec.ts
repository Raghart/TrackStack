/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import {
  searchAlbums,
  searchArtists,
  searchSongs,
} from '../../test/data/searchModule/searchData';
import { ServiceUnavailableException } from '@nestjs/common';
import { expectSearchProps } from '@/utils/expectSearch';
import {
  albumSearchResults,
  artistSearchResults,
  songSearchResults,
} from '@/types/searchTypes';

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

  it('searchArtists returns an artists array with expected properties', async () => {
    const result = await service.searchArtists('Nirvana');
    expect(result).toHaveLength(4);
    expect(result).toStrictEqual(searchArtists);
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

  it('sortResults sorts the list to put in first place the most similar to the query', () => {
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

  it('sortResults puts in first place the item which name is equal to the query', () => {
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

  it('sortResults sorts correctly even if the first item even has an unique accentuation', () => {
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
    const multipleResults = await service.multipleSearch('Nirvana');
    expectSearchProps(multipleResults);
  });
});

describe.skip("SearchService throws errors when the methods couldn't connect with the database", () => {
  let service: SearchService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: 'PostgreSQL',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });
});
