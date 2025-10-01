import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { getModelToken } from '@nestjs/sequelize';
import { InternalServerErrorException } from '@nestjs/common';
import { SequelizeConnectionError } from 'src/utils/mockErrors';
import { genreData, genreResData } from '../../test/data/genres/genresData';
import { GenresModel } from '../../models/genres/genres.model';

describe('GenresService should retrieve all the posible genres avaibles in the database', () => {
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

  it('parseGenres parses correctly the recieved data', () => {
    const results = service.parseGenres(genreData);
    results.forEach((genre) => expect(typeof genre).toBe('string'));
    expect(results).toHaveLength(genreData.length);
    expect(results).toEqual(genreData.map((genre) => genre.genre));
  });

  it("fetchGenres returns the list of avaibles genres with the expected props", async () => {
    const genres = await service.fetchGenres();
    genres.forEach(genre => expect(genre).toHaveProperty("genre"));
    expect(genres).toEqual(genreData);
  });

  it("getAllGenres returns the list of string genres ready to deliver", async () => {
    const genreList = await service.getAllGenres();
    expect(genreList).toEqual(genreResData);
  })

  describe("fetchGenres is able to handle an error when a promise isn't fullfiled", () => {
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
