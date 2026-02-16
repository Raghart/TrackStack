import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  singleSongTestData,
  songTestData,
  songFullRawResponse,
  songIARawResponse,
} from '../../test/data/songsModule/serSongData';
import { expectFullSongProps, expectSongProps } from 'src/utils/expectSongs';
import {
  SequelizeConnectionError,
  SequelizeTimeoutError,
} from 'src/utils/mockErrors';
import { InvalidPaginationException } from 'src/utils/PaginationError';
import { SongsModel } from '../../models/songs/song.model';
import {
  singleSongData,
  songFullTestResponse,
  songIATestResponses,
  songIATestScores,
  songTestResponses,
} from '../../test/data/songsModule/resSongData';
import { USER_VECTOR } from '../../test/constants/constants';

describe('SongsService retrieves, evaluates and parses songs data from the database', () => {
  let service: SongsService;
  let songModel: {
    count: jest.Mock;
    findAll: jest.Mock;
    findByPk: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getModelToken(SongsModel),
          useValue: {
            count: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    songModel = module.get(getModelToken(SongsModel));
  });

  describe('DBLength returns the current number of songs in the database', () => {
    beforeEach(() => {
      songModel.count.mockResolvedValue(songTestData.length);
    });

    it("DBLength retrieves song's quantity from the database", async () => {
      const result = await service.getDBLength();
      expect(result).toBe(songTestData.length);
    });
  });

  describe('getLandpageSongs returns a songs array ready to be delivered', () => {
    const rawLandpageSongs = songTestData.map((entry) => ({
      get: () => entry,
    }));
    beforeEach(() => {
      songModel.findAll.mockResolvedValue(rawLandpageSongs);
    });

    it('fetchLandpageSongs retrieves a raw song data array from the database', async () => {
      const landpageSongs = await service.fetchLandpageSongs();
      expect(landpageSongs).toHaveLength(5);
      expect(landpageSongs).toStrictEqual(songTestData);
    });

    it('getLandpageSongs returns a song responses array', async () => {
      const landpageSongs = await service.getLandpageSongs(5);
      expect(landpageSongs).toHaveLength(5);
      expect(landpageSongs).toStrictEqual(songTestResponses);
    });

    it('fetchLandpageSongs throws InvalidPaginationException when limit < 1', async () => {
      const INVALID_LIMIT = -500;
      await expect(service.fetchLandpageSongs(INVALID_LIMIT)).rejects.toThrow(
        InvalidPaginationException,
      );
      await expect(service.fetchLandpageSongs(INVALID_LIMIT)).rejects.toThrow(
        `Invalid limit: ${INVALID_LIMIT} must be >= 1`,
      );
    });
  });

  describe('the parse methods parses the raw data into the expected format', () => {
    it('parseSongResponse returns a song response with expected props', () => {
      const songResponse = service.parseSongData(songTestData[0]);
      expectSongProps([songResponse]);
    });

    it('parseSongList returns a songs response array with expected properties', () => {
      const results = service.parseSongList(songTestData);
      expect(results.length).toBe(songTestData.length);
      expectSongProps(results);
    });

    it('parseFullSong returns a full song response with the expected properties', () => {
      const song = service.parseFullSong(songFullRawResponse);
      expectFullSongProps(song);
    });
  });

  describe('getRandomSong returns a random song from the database', () => {
    beforeEach(() => {
      songModel.findOne.mockResolvedValue({ get: () => singleSongTestData });
    });

    it('fetchRandomSong retrieves a random song from the database', async () => {
      const randomSong = await service.fetchRandomSong();
      expect(randomSong).toStrictEqual(singleSongTestData);
    });

    it('getRandomSong returns a random song with the expected format', async () => {
      const randomSong = await service.getRandomSong();
      expectSongProps([randomSong]);
      expect(randomSong).toStrictEqual(singleSongData);
    });
  });

  describe('getNextSong returns a song response of the next given id from the database', () => {
    beforeEach(() => {
      songModel.findByPk.mockResolvedValue({ get: () => singleSongTestData });
    });

    it("fetchNextSong retrieves the next song's data from the database by id", async () => {
      const result = await service.fetchNextSong(1);
      expect(result).toStrictEqual(singleSongTestData);
    });

    it("fetchNextSong returns another song if it couldn't find the given id in the database", async () => {
      songModel.findByPk.mockResolvedValue(undefined);
      songModel.findOne.mockResolvedValue({ get: () => singleSongTestData });

      const results = await service.fetchNextSong(1);
      expect(results).toStrictEqual(singleSongTestData);
    });

    it("getNextSong returns the next song's response of the given id", async () => {
      const song = await service.getNextSong(1);
      expect(song).toStrictEqual(singleSongData);
    });

    it("fetchNextSong throws an error when it couldn't retrieve a song after 2 attempts", async () => {
      songModel.findByPk.mockResolvedValue(undefined);
      songModel.findOne.mockResolvedValue(undefined);

      await expect(service.fetchNextSong(5)).rejects.toThrow(
        ServiceUnavailableException,
      );
      await expect(service.fetchNextSong(5)).rejects.toThrow(
        "It couldn't retrieve the song from the database",
      );
    });

    it('fetchNextSong throws a BadRequestException when id < 1', async () => {
      const INVALID_SONGID = -999;
      await expect(service.fetchNextSong(INVALID_SONGID)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.fetchNextSong(INVALID_SONGID)).rejects.toThrow(
        `The ID: '${INVALID_SONGID}' is not valid, It must be >= 1!`,
      );
    });
  });

  describe('getPreviousSong returns a song of the previous id from the database', () => {
    beforeEach(() => {
      songModel.findByPk.mockResolvedValue({ get: () => singleSongTestData });
    });

    it('fetchPreviousSong retrieves the song data of the given id minus 1 from the database', async () => {
      const song = await service.fetchPreviousSong(3);
      expect(song).toStrictEqual(singleSongTestData);
    });

    it("fetchPreviousSong returns another song when it couldn't retrieve a song from the id", async () => {
      songModel.findByPk.mockResolvedValue(undefined);
      songModel.findOne.mockResolvedValue({ get: () => singleSongTestData });

      const song = await service.fetchPreviousSong(3);
      expect(song).toStrictEqual(singleSongTestData);
    });

    it('getPreviousSong returns the previous song response by id', async () => {
      const song = await service.getPreviousSong(3);
      expect(song).toStrictEqual(singleSongData);
    });

    it("fetchPreviousSong throws an error when it couldn't find a song after 2 attempts", async () => {
      songModel.findByPk.mockResolvedValue(undefined);
      songModel.findOne.mockResolvedValue(undefined);

      await expect(service.fetchPreviousSong(3)).rejects.toThrow(
        ServiceUnavailableException,
      );
      await expect(service.fetchPreviousSong(3)).rejects.toThrow(
        "It couldn't retrieve the song from the database",
      );
    });

    it('fetchPreviousSong throws a BadRequestException when id < 1', async () => {
      const INVALID_SONGID = -999;
      await expect(service.fetchPreviousSong(INVALID_SONGID)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.fetchPreviousSong(INVALID_SONGID)).rejects.toThrow(
        `The ID: '${INVALID_SONGID}' is not valid, It must be >= 1!`,
      );
    });
  });

  describe('getSongData returns a full song response by id', () => {
    beforeEach(() => {
      songModel.findByPk.mockResolvedValue({ get: () => songFullRawResponse });
    });

    it('fetchFullSongData retrieves full song data by id from the database', async () => {
      const fullSong = await service.fetchFullSongData(2);
      expect(fullSong).toStrictEqual(songFullRawResponse);
    });

    it('getSongData returns a full response song by id ready to deliver', async () => {
      const fullSong = await service.getSongData(2);
      expectFullSongProps(fullSong);
      expect(fullSong).toStrictEqual(songFullTestResponse);
    });

    it("fetchFullSongData throws NotFoundException if the id doesn't exist in the database", async () => {
      songModel.findByPk.mockResolvedValue(undefined);

      const errID = 5;
      await expect(service.fetchFullSongData(errID)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.fetchFullSongData(errID)).rejects.toThrow(
        `The song with the ID: '${errID}' doesn't exist in the database!`,
      );
    });

    it('fetchFullSongData throws BadRequestException when id < 1', async () => {
      const INVALID_ID = -999;
      await expect(service.fetchFullSongData(INVALID_ID)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.fetchFullSongData(INVALID_ID)).rejects.toThrow(
        `The ID: '${INVALID_ID}' is not valid, It must be >= 1!`,
      );
    });
  });

  describe('getIARecommendations returns a song recommendations array based by user input', () => {
    const rawIASongs = songIARawResponse.map((entry) => ({ get: () => entry }));
    beforeEach(() => {
      songModel.findAll.mockResolvedValue(rawIASongs);
    });
  });
});

describe("SongsService throws an error if it couldn't retrieve the data from the database", () => {
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

  it("getDBLength throws an error if it couldn't retrieve the length from the database", async () => {
    await expect(service.getDBLength()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.getDBLength()).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });

  it("fetchLandpageSongs throws an error if it couldn't retrieve the song data from the database", async () => {
    await expect(service.fetchLandpageSongs(5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchLandpageSongs(5)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });

  it("fetchRandomSong throws an error if it couldn't retrieve the random song from the database", async () => {
    await expect(service.fetchRandomSong()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchRandomSong()).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("fetchNextSong throws an error if it couldn't retrieve the song data from the database", async () => {
    await expect(service.fetchNextSong(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchNextSong(1)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("fetchPreviousSong throws an error if it couldn't retrieve the song data from the database", async () => {
    await expect(service.fetchPreviousSong(2)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchPreviousSong(2)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("fetchFullSongData throws an error if it couldn't retrieve the full song data from the database", async () => {
    await expect(service.fetchFullSongData(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchFullSongData(1)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });
});
