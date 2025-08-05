import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { getModelToken } from '@nestjs/sequelize';
import { InternalServerErrorException } from '@nestjs/common';
import { SequelizeConnectionError } from 'src/utils/mockErrors';
import { genreData } from '../../test/data/genres/genresData';
import { GenresModel } from '../../models/genres/genres.model';

describe('GenresService', () => {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllGenres', () => {
    it('getAllGenres recieves a list of strings', async () => {
      const results = await service.getAllGenres();
      results.forEach((genre) => {
        expect(typeof genre).toBe('string');
      });
    });

    it('getAllGenres recieves expected list of genres', async () => {
      const results = await service.getAllGenres();
      expect(results).toHaveLength(genreData.length);
      expect(results).toEqual(genreData.map((genre) => genre.genre));
    });
  });

  describe('getAllGenres DB Connection Error Handler', () => {
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

    it("getAllGenres throws InternalServerErrorException when it couldn't connect with the DB", async () => {
      await expect(service.getAllGenres()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.getAllGenres()).rejects.toThrow(
        'Database Error: SequelizeTimeoutError: Connection refused',
      );
    });
  });
});
