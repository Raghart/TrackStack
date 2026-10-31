/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';
import { mockMultipleSeach } from '../../test/data/searchModule/searchData';
import { ServiceUnavailableException } from '@nestjs/common';

describe.skip('SearchResolver recieves the expected data from the service', () => {
  let resolver: SearchResolver;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchResolver,
        {
          provide: SearchService,
          useValue: {
            multipleSearch: jest.fn().mockResolvedValue(mockMultipleSeach),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    resolver = module.get<SearchResolver>(SearchResolver);
  });

  it.skip('multipleSearch recieves the expected data from the search service', async () => {
    const result = await resolver.multipleSearch('Nirvana');
    expect(service.multipleSearch).toHaveBeenCalledWith('Nirvana');
    expect(result).toEqual(mockMultipleSeach);
  });
});

describe.skip('SearchResolver throws errors from the service locate problems', () => {
  let resolver: SearchResolver;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchResolver,
        {
          provide: SearchService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    resolver = module.get<SearchResolver>(SearchResolver);
  });

  it.skip("multipleSearch throws an error when it couldn't recieve the expected data from ES", async () => {
    await expect(resolver.multipleSearch('Marimo')).rejects.toThrow(
      ServiceUnavailableException,
    );
    expect(service.multipleSearch).toHaveBeenCalledWith('Marimo');
  });
});
