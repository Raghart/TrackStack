/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { SongGenresService } from './song_genres.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { expectSongProps } from 'src/utils/expectSongs';
import { InvalidPaginationException } from 'src/utils/PaginationError';
import { SequelizeConnectionError } from 'src/utils/mockErrors';
import { SongGenresModel } from '../../models/song_genres/SongGenres.model';
import { songGenresData } from '../../test/data/songGenresModule/songGenresData';

describe('SongGenresService', () => {
  let service: SongGenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongGenresService,
        {
          provide: getModelToken(SongGenresModel),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SongGenresService>(SongGenresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllGenreSongs', () => {
    it('getAllGenreSongs has expected properties', () => {
      const results = service.getAllGenreSongs(songGenresData);
      expect(results.length).toBeGreaterThan(0);
      expectSongProps(results);
    });

    it('getAllGenreSongs throws BadRequestException when seed is not a valid string of numbers', async () => {
      const INVALID_SEED = '18Jenkins18';
      await expect(
        service.fetchDBSongGenres(INVALID_SEED, 'Rock', 1, 5),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.fetchDBSongGenres(INVALID_SEED, 'Rock', 1, 5),
      ).rejects.toThrow('The seed must be a valid string of numbers.');
    });

    it('getAllGenreSongs throws InvalidPaginationException when page < 1', async () => {
      await expect(
        service.fetchDBSongGenres('1', 'Rock', 0, 5),
      ).rejects.toThrow(InvalidPaginationException);
      await expect(
        service.fetchDBSongGenres('1', 'Rock', 0, 5),
      ).rejects.toThrow('Invalid page: 0 must be >= 1');
    });

    it('getAllGenreSongs throws InvalidPaginationException when limit < 1', async () => {
      await expect(
        service.fetchDBSongGenres('1', 'Indie', 1, 0),
      ).rejects.toThrow(InvalidPaginationException);
      await expect(
        service.fetchDBSongGenres('1', 'Indie', 1, 0),
      ).rejects.toThrow('Invalid limit: 0 must be >= 1');
    });
  });
});

describe('SongGenresService Error handler', () => {
  let service: SongGenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongGenresService,
        {
          provide: getModelToken(SongGenresModel),
          useValue: { findAll: SequelizeConnectionError() },
        },
      ],
    }).compile();

    service = module.get<SongGenresService>(SongGenresService);
  });

  describe('getAllGenreSongs Error handler', () => {
    it("getAllGenreSongs throws InternalServerErrorException when it couldn't connect with the DB", async () => {
      await expect(
        service.fetchDBSongGenres('1', 'Rock', 1, 5),
      ).rejects.toThrow(InternalServerErrorException);
      await expect(
        service.fetchDBSongGenres('1', 'Rock', 1, 5),
      ).rejects.toThrow(
        'Database Error: SequelizeTimeoutError: Connection refused',
      );
    });
  });
});
