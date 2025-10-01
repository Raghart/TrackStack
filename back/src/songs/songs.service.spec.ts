/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  songData,
  songFullResponse,
} from '../../test/data/songsModule/serSongData';
import {
  expectFullSongProps,
  expectSongNames,
  expectSongProps,
} from 'src/utils/expectSongs';
import {
  SequelizeConnectionError,
  SequelizeTimeoutError,
} from 'src/utils/mockErrors';
import { InvalidPaginationException } from 'src/utils/PaginationError';
import { SongsModel } from '../../models/songs/song.model';

describe('SongsService', () => {
  let service: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getModelToken(SongsModel),
          useValue: {
            count: jest.fn().mockResolvedValue(songData.length),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('DBLength', () => {
    it('DBLength gets the correct quantity of songs', async () => {
      const result = await service.getDBLength();
      expect(result).toBe(songData.length);
    });
  });

  describe('getLandpageSongs', () => {
    it('parseSongList has the expected properties', () => {
      const results = service.parseSongList(songData);
      expect(results.length).toBe(songData.length);
      expectSongProps(results);
    });

    it('parseSongList get expected song results', () => {
      const results = service.parseSongList(songData);
      expect(results).toHaveLength(songData.length);
      const songNames = songData.map((song) => song?.name);
      expectSongNames(results, songNames);
    });

    it('getLandpageSongs throws InvalidPaginationException when limit < 1', async () => {
      const INVALID_LIMIT = -500;
      await expect(service.fetchLandpageSongs(INVALID_LIMIT)).rejects.toThrow(
        InvalidPaginationException,
      );
      await expect(service.fetchLandpageSongs(INVALID_LIMIT)).rejects.toThrow(
        `Invalid limit: ${INVALID_LIMIT} must be >= 1`,
      );
    });
  });

  describe('getRandomSong', () => {
    it('parseSongResponse gets a random Song with correct props', () => {
      const songResponse = service.parseSongData(songData[0]);
      expectSongProps([songResponse]);
    });
  });

  describe('fetchDBNextSong', () => {
    it('getNextSong handles a request with an ID < 1', async () => {
      const INVALID_SONGID = -999;
      await expect(service.fetchNextSong(INVALID_SONGID)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.fetchNextSong(INVALID_SONGID)).rejects.toThrow(
        `The ID: '${INVALID_SONGID}' is not valid, It must be >= 1!`,
      );
    });
  });

  describe('fetchDBPreviousSong', () => {
    it('getNextSong handles a request with an ID < 1', async () => {
      const INVALID_SONGID = -999;
      await expect(service.fetchPreviousSong(INVALID_SONGID)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.fetchPreviousSong(INVALID_SONGID)).rejects.toThrow(
        `The ID: '${INVALID_SONGID}' is not valid, It must be >= 1!`,
      );
    });
  });

  describe('getSongData', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SongsService,
          {
            provide: getModelToken(SongsModel),
            useValue: {},
          },
        ],
      }).compile();

      service = module.get<SongsService>(SongsService);
    });

    it('parseFullSong recieves the song with the correct props', () => {
      const song = service.parseFullSong(songFullResponse);
      expectFullSongProps(song);
    });

    it('fetchFullSongData throws BadRequestException when the id has an invalid range < 1', async () => {
      const INVALID_ID = -999;
      await expect(service.fetchFullSongData(INVALID_ID)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.fetchFullSongData(INVALID_ID)).rejects.toThrow(
        `The ID: '${INVALID_ID}' is not valid, It must be >= 1!`,
      );
    });
  });
});

describe('SongsService Error handling', () => {
  let service: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getModelToken(SongsModel),
          useValue: {
            findAll: SequelizeTimeoutError(),
            count: SequelizeTimeoutError(),
            findOne: SequelizeConnectionError(),
            findByPk: SequelizeConnectionError(),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
  });

  it("getDBLength throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.getDBLength()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.getDBLength()).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });

  it("fetchLandpageSongs throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.fetchLandpageSongs(5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchLandpageSongs(5)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });

  it("fetchRandomSong throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.fetchRandomSong()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchRandomSong()).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("fetchNextSong throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.fetchNextSong(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchNextSong(1)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("fetchPreviousSong throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.fetchPreviousSong(2)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchPreviousSong(2)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("fetchFullSongData throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.fetchFullSongData(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchFullSongData(1)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("getIARecommendations throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.fetchIARecommendations([])).rejects.toThrow(
      InternalServerErrorException,
    );

    await expect(service.fetchIARecommendations([])).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });
});
