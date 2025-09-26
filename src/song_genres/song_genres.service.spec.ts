import { Test, TestingModule } from '@nestjs/testing';
import { SongGenresService } from './song_genres.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { findAllGenreSongs } from 'src/utils/mockSongGenres';
import { expectSongData, expectSongProps } from 'src/utils/expectSongs';
import { InvalidPaginationException } from 'src/utils/PaginationError';
import { SequelizeConnectionError } from 'src/utils/mockErrors';
import { SongGenresModel } from '../../models/song_genres/SongGenres.model';

describe('SongGenresService', () => {
  let service: SongGenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongGenresService,
        {
          provide: getModelToken(SongGenresModel),
          useValue: {
            findAll: findAllGenreSongs,
          },
        },
      ],
    }).compile();

    service = module.get<SongGenresService>(SongGenresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllGenreSongs', () => {
    it('getAllGenreSongs has expected properties', async () => {
      const results = await service.getAllGenreSongs('1', 'Rock', 1, 5);
      expect(results.length).toBeGreaterThan(0);
      expectSongProps(results);
    });

    it('getAllGenreSongs get songs of a specific genre', async () => {
      const results = await service.getAllGenreSongs('1', 'Pop', 1, 5);
      expect(results.length).toBeGreaterThan(0);
      results.forEach((song) => expectSongData(song, 'Wonderwall', 'Oasis'));
    });

    it('getAllGenreSongs get diferent songs depending of the genre', async () => {
      const grungeResults = await service.getAllGenreSongs('1', 'grunge', 1, 5);
      expect(grungeResults.length).toBeGreaterThan(0);

      const loveResults = await service.getAllGenreSongs('1', 'Love', 1, 5);
      expect(loveResults.length).toBeGreaterThan(0);

      expect(grungeResults).not.toEqual(loveResults);
    });

    it('getAllGenreSongs pagination cuts songs where the limit indicates', async () => {
      const results1 = await service.getAllGenreSongs('1', 'Alternative', 1, 2);
      expect(results1).toHaveLength(2);

      const results2 = await service.getAllGenreSongs('1', 'Alternative', 2, 2);
      expect(results2).toHaveLength(2);

      expect(results1).not.toEqual(results2);
    });

    it('getAllGenreSongs get songs of several genres', async () => {
      const results1 = await service.getAllGenreSongs('1', 'grunge', 1, 5);
      expect(results1.length).toBeGreaterThan(0);
      results1.forEach((song) =>
        expectSongData(song, 'Come as You Are', 'Nirvana'),
      );

      const results2 = await service.getAllGenreSongs('1', 'Britpop', 1, 5);
      expect(results2.length).toBeGreaterThan(0);
      expect(results2.some((song) => song.name === 'Wonderwall')).toBe(true);
      expect(results2.some((song) => song.artists.includes('Oasis'))).toBe(
        true,
      );

      expect(results2.some((song) => song.name === 'Take Me Out')).toBe(true);
      expect(
        results2.some((song) => song.artists.includes('Franz Ferdinand')),
      ).toBe(true);

      const results3 = await service.getAllGenreSongs('1', '90s', 1, 5);
      expect(results3.length).toBeGreaterThan(0);
      results3.forEach((song) => expectSongData(song, 'Creep', 'Radiohead'));
    });

    it('getAllGenreSongs handles limit > songs', async () => {
      const results = await service.getAllGenreSongs('1', '00s', 1, 999);
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(999);
    });

    it('getAllGenreSongs throws BadRequestException when seed is not a valid string of numbers', async () => {
      const INVALID_SEED = '18Jenkins18';
      await expect(
        service.getAllGenreSongs(INVALID_SEED, 'Rock', 1, 5),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.getAllGenreSongs(INVALID_SEED, 'Rock', 1, 5),
      ).rejects.toThrow('The seed must be a valid string of numbers.');
    });

    it('getAllGenreSongs throws InvalidPaginationException when page < 1', async () => {
      await expect(service.getAllGenreSongs('1', 'Rock', 0, 5)).rejects.toThrow(
        InvalidPaginationException,
      );
      await expect(service.getAllGenreSongs('1', 'Rock', 0, 5)).rejects.toThrow(
        'Invalid page: 0 must be >= 1',
      );
    });

    it('getAllGenreSongs throws InvalidPaginationException when limit < 1', async () => {
      await expect(
        service.getAllGenreSongs('1', 'Indie', 1, 0),
      ).rejects.toThrow(InvalidPaginationException);
      await expect(
        service.getAllGenreSongs('1', 'Indie', 1, 0),
      ).rejects.toThrow('Invalid limit: 0 must be >= 1');
    });

    it('getAllGenreSongs throws NotFoundException when genre does not exist', async () => {
      await expect(
        service.getAllGenreSongs('1', 'papelon', 1, 5),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getAllGenreSongs('1', 'papelon', 1, 5),
      ).rejects.toThrow("The genre: 'papelon' doesn't exist in the DB!");
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
      await expect(service.getAllGenreSongs('1', 'Rock', 1, 5)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.getAllGenreSongs('1', 'Rock', 1, 5)).rejects.toThrow(
        'Database Error: SequelizeTimeoutError: Connection refused',
      );
    });
  });
});
