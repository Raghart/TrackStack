/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { GenresResolver } from './genres.resolver';
import { GenresService } from './genres.service';
import { InternalServerErrorException } from '@nestjs/common';
import { genreResData } from '../../test/data/genres/genresData';
import { TimeoutResError } from 'src/utils/mockErrors';

describe('GenresResolver retrieves a genres array from the service', () => {
  let resolver: GenresResolver;
  let service: GenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresResolver,
        {
          provide: GenresService,
          useValue: {
            getAllGenres: jest.fn().mockResolvedValue(genreResData),
          },
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    resolver = module.get<GenresResolver>(GenresResolver);
  });

  it('getAllGenres retrieves the genres array ready to be delivered', async () => {
    const genreList = await resolver.getAllGenres();

    expect(service.getAllGenres).toHaveBeenCalled();
    expect(genreList).toHaveLength(9);
    expect(genreList).toEqual(genreResData);
  });

  describe("getAllGenres throws an error when it couldn't connect to the database", () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          GenresResolver,
          {
            provide: GenresService,
            useValue: {
              getAllGenres: TimeoutResError(),
            },
          },
        ],
      }).compile();

      service = module.get<GenresService>(GenresService);
      resolver = module.get<GenresResolver>(GenresResolver);
    });

    it("it throws InternalServerErrorException when it couldn't connect to the database", async () => {
      await expect(resolver.getAllGenres()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(resolver.getAllGenres()).rejects.toThrow(
        'Database Error: SequelizeTimeoutError: Query timed out',
      );
      expect(service.getAllGenres).toHaveBeenCalledTimes(2);
    });
  });
});
