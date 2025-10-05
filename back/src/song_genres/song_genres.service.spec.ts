import { Test, TestingModule } from '@nestjs/testing';
import { SongGenresService } from './song_genres.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { expectSongProps } from 'src/utils/expectSongs';
import { InvalidPaginationException } from 'src/utils/PaginationError';
import { SequelizeConnectionError } from 'src/utils/mockErrors';
import { SongGenresModel } from '../../models/song_genres/SongGenres.model';
import { songGenresData } from '../../test/data/songGenresModule/songGenresData';

describe('SongGenresService retrieves and parses songs of a genre from the database', () => {
  let service: SongGenresService;
  let songGenresModel: { findAll: jest.Mock };
  const songGenresRawData = songGenresData.map((entry) => ({
    get: () => entry,
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongGenresService,
        {
          provide: getModelToken(SongGenresModel),
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SongGenresService>(SongGenresService);
    songGenresModel = module.get(getModelToken(SongGenresModel));
  });

  describe('getAllGenreSongs returns an array of songs of a specific genre', () => {
    beforeEach(() => {
      songGenresModel.findAll.mockResolvedValue(songGenresRawData);
    });

    it('parseGenreSongs parses songs of a genre with the expected properties', () => {
      const results = service.parseGenreSongs(songGenresData);
      expect(results.length).toBeGreaterThan(0);
      expectSongProps(results);
    });

    it('fetchSongGenres returns the expected list of songs from the database', async () => {
      const results = await service.fetchSongGenres('1', 'Rock');
      expect(results).toHaveLength(3);
      expect(results).toStrictEqual(songGenresData);
    });

    it('getAllGenreSongs returns an array of songs of a specific genre ready to deliver', async () => {
      const genreSongs = await service.getAllGenreSongs('1', 'Rock', 1, 3);
      expect(genreSongs).toHaveLength(3);
      expectSongProps(genreSongs);
    });

    it('fetchSongGenres throws NotFoundException when no songs where found for a genre', async () => {
      songGenresModel.findAll.mockResolvedValue(undefined);

      await expect(
        service.fetchSongGenres('1', 'Potatoes', 1, 5),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.fetchSongGenres('1', 'Potatoes', 1, 5),
      ).rejects.toThrow(`The genre: 'Potatoes' doesn't exist in the DB!`);
    });
  });
});

describe("SongGenresService throws an error if it couldn't retrieve the data from the database", () => {
  let service: SongGenresService;
  let songGenresModel: { findAll: jest.Mock };

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
    songGenresModel = module.get(getModelToken(SongGenresModel));
  });

  beforeEach(() => {
    songGenresModel.findAll.mockRejectedValue(
      new Error('SequelizeTimeoutError: Connection refused'),
    );
  });

  it('fetchSongGenres throws BadRequestException when seed is not a valid string of numbers', async () => {
    const INVALID_SEED = '18Jenkins18';
    await expect(
      service.fetchSongGenres(INVALID_SEED, 'Rock', 1, 5),
    ).rejects.toThrow(BadRequestException);
    await expect(
      service.fetchSongGenres(INVALID_SEED, 'Rock', 1, 5),
    ).rejects.toThrow('The seed must be a valid string of numbers.');
  });

  it('fetchSongGenres throws InvalidPaginationException when page < 1', async () => {
    await expect(service.fetchSongGenres('1', 'Rock', 0, 5)).rejects.toThrow(
      InvalidPaginationException,
    );
    await expect(service.fetchSongGenres('1', 'Rock', 0, 5)).rejects.toThrow(
      'Invalid page: 0 must be >= 1',
    );
  });

  it('fetchSongGenres throws InvalidPaginationException when limit < 1', async () => {
    await expect(service.fetchSongGenres('1', 'Indie', 1, 0)).rejects.toThrow(
      InvalidPaginationException,
    );
    await expect(service.fetchSongGenres('1', 'Indie', 1, 0)).rejects.toThrow(
      'Invalid limit: 0 must be >= 1',
    );
  });

  it("fetchSongGenres throws an error when it couldn't connect with the database", async () => {
    await expect(service.fetchSongGenres('1', 'Rock', 1, 5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchSongGenres('1', 'Rock', 1, 5)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it('fetchSongGenres throws a generic error if there is no message in the rejected request', async () => {
    songGenresModel.findAll.mockRejectedValue(undefined);

    await expect(service.fetchSongGenres('1', 'Rock', 1, 5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchSongGenres('1', 'Rock', 1, 5)).rejects.toThrow(
      'Database Error: Unknown database error',
    );
  });
});
