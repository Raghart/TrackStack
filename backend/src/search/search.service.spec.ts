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
