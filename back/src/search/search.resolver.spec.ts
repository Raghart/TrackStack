/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';
import { mockMultipleSeach } from '../../test/data/searchModule/searchData';
import { ServiceUnavailableException } from '@nestjs/common';
import { pingError, searchError } from '../../test/constants/constants';

describe('SearchResolver recieves the expected answer from the service ready to deliver it', () => {
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

  it('ping returns a string to indicate that the connection to ES is avaible', async () => {
    const result = await resolver.ping();
    expect(service.ping).toHaveBeenCalled();
    expect(result).toBe('Elastic Search is working!');
  });

  it('multipleSearch recieves the expected data from the search service', async () => {
    const result = await resolver.multipleSearch('Nirvana');
    expect(service.multipleSearch).toHaveBeenCalledWith('Nirvana');
    expect(result).toEqual(mockMultipleSeach);
  });
});

describe('SearchResolver handle errors from the service to indicate the problems to the devs', () => {
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

  it("ping throws an error when it couldn't connect with the database", async () => {
    await expect(resolver.ping()).rejects.toThrow(ServiceUnavailableException);
    await expect(resolver.ping()).rejects.toThrow(pingError);
    expect(service.ping).toHaveBeenCalled();
  });

  it("multipleSearch throws an error when it couldn't recieve the expected data from ES", async () => {
    await expect(resolver.multipleSearch('Marimo')).rejects.toThrow(
      ServiceUnavailableException,
    );
    await expect(resolver.multipleSearch('Marimo')).rejects.toThrow(
      searchError,
    );
    expect(service.multipleSearch).toHaveBeenCalledWith('Marimo');
  });
});
