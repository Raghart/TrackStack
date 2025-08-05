/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';
import { mockMultipleSeach } from '../../test/data/searchModule/searchData';
import { ServiceUnavailableException } from '@nestjs/common';
import { pingError, searchError } from '../../test/constants/constants';

describe('SearchResolver', () => {
  let resolver: SearchResolver;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchResolver,
        {
          provide: SearchService,
          useValue: {
            ping: jest.fn().mockResolvedValue(true),
            multipleSearch: jest.fn().mockResolvedValue(mockMultipleSeach),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    resolver = module.get<SearchResolver>(SearchResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('ping', async () => {
    const result = await resolver.ping();
    expect(service.ping).toHaveBeenCalled();
    expect(result).toBe('Elastic Search is working!');
  });

  it('multipleSearch recieves the expected Data from the search service', async () => {
    const result = await resolver.multipleSearch('Nirvana');
    expect(service.multipleSearch).toHaveBeenCalledWith('Nirvana');
    expect(result).toEqual(mockMultipleSeach);
  });
});

describe('SearchResolver Error handler', () => {
  let resolver: SearchResolver;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchResolver,
        {
          provide: SearchService,
          useValue: {
            ping: jest
              .fn()
              .mockRejectedValue(new ServiceUnavailableException(pingError)),
            multipleSearch: jest
              .fn()
              .mockRejectedValue(new ServiceUnavailableException(searchError)),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    resolver = module.get<SearchResolver>(SearchResolver);
  });

  it('ping Error handling', async () => {
    await expect(resolver.ping()).rejects.toThrow(ServiceUnavailableException);
    await expect(resolver.ping()).rejects.toThrow(pingError);
    expect(service.ping).toHaveBeenCalled();
  });

  it('multipleSearch Error Handling', async () => {
    await expect(resolver.multipleSearch('Marimo')).rejects.toThrow(
      ServiceUnavailableException,
    );
    await expect(resolver.multipleSearch('Marimo')).rejects.toThrow(
      searchError,
    );
    expect(service.multipleSearch).toHaveBeenCalledWith('Marimo');
  });
});
