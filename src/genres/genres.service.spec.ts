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
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllGenres', () => {
    it('getAllGenres parses correctly the recieved list of string', () => {
      const results = service.getAllGenres(genreData);
      results.forEach((genre) => {
        expect(typeof genre).toBe('string');
      });
    });

    it('getAllGenres recieves expected list of genres', async () => {
      const results = service.getAllGenres(genreData);
      expect(results).toHaveLength(genreData.length);
      expect(results).toEqual(genreData.map((genre) => genre.genre));
    });
  });

  describe('fetchDBGenres throws an Error when it cant communicate with the database', () => {
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
      await expect(service.fetchDBGenres()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.fetchDBGenres()).rejects.toThrow(
        'Database Error: SequelizeTimeoutError: Connection refused',
      );
    });
  });
});
