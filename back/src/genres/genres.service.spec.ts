import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { getModelToken } from '@nestjs/sequelize';
import { InternalServerErrorException } from '@nestjs/common';
import { SequelizeConnectionError } from 'src/utils/mockErrors';
import { genreData, genreResData } from '../../test/data/genres/genresData';
import { GenresModel } from '../../models/genres/genres.model';

describe('GenresService retrieves and parses all the avaibles genres from the database', () => {
  let service: GenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getModelToken(GenresModel),
          useValue: {
            findAll: jest.fn().mockResolvedValue(genreData),
          },
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  describe('getAllGenres returns a genre array ready to deliver', () => {
    it('parseGenres parses the given data to the expected format', () => {
      const results = service.parseGenres(genreData);
      results.forEach((genre) => expect(typeof genre).toBe('string'));
      expect(results).toHaveLength(genreData.length);
      expect(results).toEqual(genreData.map((genre) => genre.genre));
    });

    it('fetchGenres returns an array of all the avaibles genres with the expected props', async () => {
      const genres = await service.fetchGenres();
      genres.forEach((genre) => expect(genre).toHaveProperty('genre'));
      expect(genres).toEqual(genreData);
    });

    it('getAllGenres returns an array of genres', async () => {
      const genreList = await service.getAllGenres();
      expect(genreList).toEqual(genreResData);
    });
  });

  describe("fetchGenres throws an error if it couldn't retrieve the genres array", () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          GenresService,
          {
            provide: getModelToken(GenresModel),
            useValue: {
              findAll: SequelizeConnectionError(),
            },
          },
        ],
      }).compile();

      service = module.get<GenresService>(GenresService);
    });

    it("fetchDBGenres throws InternalServerErrorException when it couldn't connect with the database", async () => {
      await expect(service.fetchGenres()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.fetchGenres()).rejects.toThrow(
        'Database Error: SequelizeTimeoutError: Connection refused',
      );
    });
  });
});
