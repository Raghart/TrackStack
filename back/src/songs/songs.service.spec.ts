import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  getFullSongID,
  getIARecommendations,
  getLandpageSongs,
  getRandomSong,
  getSongID,
} from 'src/utils/mockSongs';
import { songData } from '../../test/data/songsModule/serSongData';
import {
  expectFullSongData,
  expectFullSongProps,
  expectSongData,
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
            findAll: getLandpageSongs,
            count: jest.fn().mockResolvedValue(songData.length),
            findOne: getRandomSong,
            findByPk: getSongID,
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
    it('getLandpageSongs has the expected properties', async () => {
      const results = await service.getLandpageSongs(songData.length);
      expect(results.length).toBe(songData.length);
      expectSongProps(results);
    });

    it('getLandpageSongs get one song when limit = 1', async () => {
      const result = await service.getLandpageSongs(1);
      expect(result).toHaveLength(1);
    });

    it('getLandpageSongs get expected song results', async () => {
      const results = await service.getLandpageSongs(songData.length);
      expect(results).toHaveLength(songData.length);
      const songNames = songData.map((song) => song.name);
      expectSongNames(results, songNames);
    });

    it('getLandpageSongs throws InvalidPaginationException when limit < 1', async () => {
      const INVALID_LIMIT = -500;
      await expect(service.getLandpageSongs(INVALID_LIMIT)).rejects.toThrow(
        InvalidPaginationException,
      );
      await expect(service.getLandpageSongs(INVALID_LIMIT)).rejects.toThrow(
        `Invalid limit: ${INVALID_LIMIT} must be >= 1`,
      );
    });
  });

  describe('getRandomSong', () => {
    it('getRandomSong gets a random Song with correct props', async () => {
      const result = await service.getRandomSong();
      expectSongProps([result]);
    });
  });

  describe('getNextSong', () => {
    it('getNextSong gets a song with the correct props', async () => {
      const song = await service.getNextSong(1);
      expectSongProps([song]);
    });

    it('single getNextSong recieve expected song', async () => {
      const song = await service.getNextSong(2);
      expectSongData(song, 'Take Me Out', 'Franz Ferdinand');
    });

    it('several getNextSongs recieves expected song', async () => {
      const song1 = await service.getNextSong(1);
      expectSongData(song1, 'Wonderwall', 'Oasis');

      const song2 = await service.getNextSong(3);
      expectSongData(song2, 'Mr. Brightside', 'The Killers');

      const song3 = await service.getNextSong(4);
      expectSongData(song3, 'Creep', 'Radiohead');
    });

    it('getNextSong handles a request with an ID > of any song ID', async () => {
      const song = await service.getNextSong(999);
      expectSongData(song, 'Come as You Are', 'Nirvana');
    });

    it('getNextSong handles a request with an ID < 1', async () => {
      const INVALID_SONGID = -999;
      await expect(service.getNextSong(INVALID_SONGID)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.getNextSong(INVALID_SONGID)).rejects.toThrow(
        `The ID: '${INVALID_SONGID}' is not valid, It must be >= 1!`,
      );
    });
  });

  describe('getPreviousSong', () => {
    it('getPreviousSong gets a song with the expected props', async () => {
      const song = await service.getPreviousSong(2);
      expectSongProps([song]);
    });

    it('single getPreviousSong request recieve expected song', async () => {
      const song = await service.getPreviousSong(2);
      expectSongData(song, 'Come as You Are', 'Nirvana');
    });

    it('several getPreviousSong requests recieves expected songs', async () => {
      const song1 = await service.getPreviousSong(3);
      expectSongData(song1, 'Wonderwall', 'Oasis');

      const song2 = await service.getPreviousSong(4);
      expectSongData(song2, 'Take Me Out', 'Franz Ferdinand');

      const song3 = await service.getPreviousSong(5);
      expectSongData(song3, 'Mr. Brightside', 'The Killers');
    });

    it('getNextSong handles a request with an ID < 1', async () => {
      const INVALID_SONGID = -999;
      await expect(service.getPreviousSong(INVALID_SONGID)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.getPreviousSong(INVALID_SONGID)).rejects.toThrow(
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
            useValue: {
              findByPk: getFullSongID,
            },
          },
        ],
      }).compile();

      service = module.get<SongsService>(SongsService);
    });

    it('getSongData recieves the song with the correct props', async () => {
      const song = await service.getSongData(1);
      expectFullSongProps(song);
    });

    it('single getSongData request gets the song', async () => {
      const song = await service.getSongData(1);
      expectFullSongData(song);
    });

    it('several getSongData requests recieves the songs', async () => {
      const song1 = await service.getSongData(2);
      expectFullSongData(song1);

      const song2 = await service.getSongData(3);
      expectFullSongData(song2);
    });

    it('getSongData throws NotFoundException when the is not found', async () => {
      await expect(service.getSongData(999)).rejects.toThrow(NotFoundException);
      await expect(service.getSongData(999)).rejects.toThrow(
        "Song doesn't exist in the DB!",
      );
    });

    it('getSongData throws BadRequestException when the id has an invalid range < 1', async () => {
      const INVALID_ID = -999;
      await expect(service.getSongData(INVALID_ID)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.getSongData(INVALID_ID)).rejects.toThrow(
        `The ID: '${INVALID_ID}' is not valid, It must be >= 1!`,
      );
    });
  });

  describe('Lara Recommendation Algorythim', () => {
    let service: SongsService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SongsService,
          {
            provide: getModelToken(SongsModel),
            useValue: {
              findAll: getIARecommendations,
            },
          },
        ],
      }).compile();

      service = module.get<SongsService>(SongsService);
    });

    it('getIARecommendations recieves the data with the correct props', async () => {
      const results = await service.getIARecommendations(
        ['Rock', 'Alternative', 'Alternative Rock', 'Grunge'],
        0.826,
        0.04,
        0.508,
        2.5,
        0.543,
        0.000459,
        0,
        0.000175,
      );
      expectSongProps(results);
    });

    it('getIARecommendations recieves as the first recommendation the one that satisfies it more', async () => {
      const results = await service.getIARecommendations(
        ['Rock', 'Alternative', 'Alternative Rock', 'Grunge'],
        0.826,
        0.04,
        0.508,
        2.5,
        0.543,
        0.000459,
        0,
        0.000175,
      );
      const song = results[0];
      expectSongData(song, 'Come as You Are', 'Nirvana');
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

  it("getLandpageSongs throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.getLandpageSongs(5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.getLandpageSongs(5)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });

  it("getRandomSong throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.getRandomSong()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.getRandomSong()).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("getNextSong throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.getNextSong(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.getNextSong(1)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("getPreviousSong throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.getPreviousSong(2)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.getPreviousSong(2)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("getSongData throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(service.getSongData(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.getSongData(1)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("getIARecommendations throws InternalServerErrorException when it can't collect the info from the DB", async () => {
    await expect(
      service.getIARecommendations(
        [],
        0.826,
        0.04,
        0.508,
        2.5,
        0.543,
        0.000459,
        0,
        0.000175,
      ),
    ).rejects.toThrow(InternalServerErrorException);
    await expect(
      service.getIARecommendations(
        [],
        0.826,
        0.04,
        0.508,
        2.5,
        0.543,
        0.000459,
        0,
        0.000175,
      ),
    ).rejects.toThrow('Database Error: SequelizeTimeoutError: Query timed out');
  });
});
