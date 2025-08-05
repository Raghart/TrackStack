/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { GenresResolver } from './genres.resolver';
import { GenresService } from './genres.service';
import { InternalServerErrorException } from '@nestjs/common';
import { genreResData } from '../../test/data/genres/genresData';
import { TimeoutResError } from 'src/utils/mockErrors';

describe('GenresResolver', () => {
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

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAllGenres', () => {
    it('getAllGenres recieves the expected list of genres', async () => {
      const results = await resolver.getAllGenres();
      expect(service.getAllGenres).toHaveBeenCalled();
      expect(results.length).toBe(9);
      expect(results).toEqual(genreResData);
    });
  });

  describe('getAllGenres Connection DB Error Handler', () => {
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

    it("getAllGenres throws InternalServerErrorException when it couldn't connect to the DB", async () => {
      await expect(resolver.getAllGenres()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(resolver.getAllGenres()).rejects.toThrow(
        'Database Error: SequelizeTimeoutError: Query timed out',
      );
      expect(service.getAllGenres).toHaveBeenCalled();
    });
  });
});
