/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SongsResolver } from './songs.resolver';
import { SongsService } from './songs.service';
import {
  songResData,
  singleSongData,
  songResFullData,
  songResIAData,
} from '../../test/data/songsModule/resSongData';
import { InternalServerErrorException } from '@nestjs/common';
import { ConnectionResError, TimeoutResError } from 'src/utils/mockErrors';
import { USER_VECTOR } from '../../test/constants/constants';

describe('SongsResolver', () => {
  let service: SongsService;
  let resolver: SongsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsResolver,
        {
          provide: SongsService,
          useValue: {
            fetchLandpageSongs: jest.fn().mockResolvedValue(songResData),
            parseSongList: jest.fn().mockReturnValue(songResData),
            getDBLength: jest.fn().mockResolvedValue(songResData.length),
            fetchFullSongData: jest.fn().mockResolvedValue(songResFullData),
            parseFullSong: jest.fn().mockReturnValue(songResFullData),
            fetchIARecommendations: jest.fn().mockResolvedValue(songResData),
            parseUserVector: jest.fn().mockReturnValue(USER_VECTOR),
            getIARecommendations: jest.fn().mockReturnValue(songResIAData),
            fetchRandomSong: jest.fn().mockResolvedValue(singleSongData),
            fetchNextSong: jest.fn().mockResolvedValue(singleSongData),
            fetchPreviousSong: jest.fn().mockResolvedValue(singleSongData),
            parseSongResponse: jest.fn().mockReturnValue(singleSongData),
            getNextSong: jest.fn().mockResolvedValue(singleSongData),
            getPreviousSong: jest.fn().mockResolvedValue(singleSongData),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    resolver = module.get<SongsResolver>(SongsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('getDBLength recieves the expected DBLength from the songs service', async () => {
    const result = await resolver.getDBLength();
    expect(service.getDBLength).toHaveBeenCalled();
    expect(result).toBe(5);
  });

  it('getLandpageSongs recieves the expected DBLength from the songs service', async () => {
    const results = await resolver.getLandpageSongs(5);
    expect(service.fetchLandpageSongs).toHaveBeenCalledWith(5);
    expect(results).toHaveLength(5);
  });

  it('getSongData recieves the expected DBLength from the songs service', async () => {
    const result = await resolver.getSongData(2);
    expect(service.fetchFullSongData).toHaveBeenCalledWith(2);
    expect(result).toEqual(songResFullData);
  });

  it('getIARecommendations recieves the expected DBLength from the songs service', async () => {
    const results = await resolver.getIARecommendations(
      ['Rock', 'Alternative', 'Alternative Rock', 'Grunge'],
      ...USER_VECTOR,
    );

    expect(service.fetchIARecommendations).toHaveBeenCalledWith([
      'Rock',
      'Alternative',
      'Alternative Rock',
      'Grunge',
    ]);
    expect(service.parseUserVector).toHaveBeenCalledWith(...USER_VECTOR);

    expect(results).toHaveLength(5);
  });

  it('fetchRandomSong recieves the expected DBLength from the songs service', async () => {
    const result = await resolver.getRandomSong();
    expect(service.fetchRandomSong).toHaveBeenCalled();
    expect(result).toEqual(singleSongData);
  });

  it('getNextSong recieves the expected DBLength from the songs service', async () => {
    const result = await resolver.getNextSong(1);
    expect(service.fetchNextSong).toHaveBeenCalledWith(1);
    expect(result).toEqual(singleSongData);
  });

  it("getNextSong recieves a song even if the id doesn't match", async () => {
    const result = await resolver.getNextSong(999);
    expect(service.fetchNextSong).toHaveBeenCalledWith(999);
    expect(result).toEqual(singleSongData);
  });

  it('getPreviousSong recieves the expected DBLength from the songs service', async () => {
    const result = await resolver.getPreviousSong(3);
    expect(service.fetchPreviousSong).toHaveBeenCalledWith(3);
    expect(result).toEqual(singleSongData);
  });

  it("getPreviousSong recieves a song even if the id doesn't match", async () => {
    const result = await resolver.getPreviousSong(999);
    expect(service.fetchPreviousSong).toHaveBeenCalledWith(999);
    expect(result).toEqual(singleSongData);
  });
});

describe('SongsResolver Error Handling', () => {
  let resolver: SongsResolver;
  let service: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsResolver,
        {
          provide: SongsService,
          useValue: {
            getDBLength: TimeoutResError(),
            fetchLandpageSongs: TimeoutResError(),
            fetchRandomSong: TimeoutResError(),
            fetchFullSongData: TimeoutResError(),
            fetchIARecommendations: ConnectionResError(),
            fetchNextSong: ConnectionResError(),
            fetchPreviousSong: ConnectionResError(),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    resolver = module.get<SongsResolver>(SongsResolver);
  });

  it("getDBLength throws InvalidConnectionError when the service couldn't connect with the DB", async () => {
    await expect(resolver.getDBLength()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getDBLength()).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.getDBLength).toHaveBeenCalled();
  });

  it("getLandpageSongs throws InternalServerErrorException when the service couldn't connect with the DB", async () => {
    await expect(resolver.getLandpageSongs(5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getLandpageSongs(5)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.fetchLandpageSongs).toHaveBeenCalledWith(5);
  });

  it("getRandomSong throws InternalServerErrorException when the service couldn't connect with the DB", async () => {
    await expect(resolver.getRandomSong()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getRandomSong()).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.fetchRandomSong).toHaveBeenCalled();
  });

  it("getSongData throws InternalServerErrorException when the service couldn't connect with the DB", async () => {
    await expect(resolver.getSongData(999)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getSongData(999)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.fetchFullSongData).toHaveBeenCalledWith(999);
  });

  it("getIARecommendations throws InternalServerErrorException when the service couldn't connect with the DB", async () => {
    await expect(
      resolver.getIARecommendations([], ...USER_VECTOR),
    ).rejects.toThrow(InternalServerErrorException);

    await expect(
      resolver.getIARecommendations([], ...USER_VECTOR),
    ).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );

    expect(service.fetchIARecommendations).toHaveBeenCalledWith([]);
  });

  it("getNextSong throws InternalServerErrorException when the service couldn't connect with the DB", async () => {
    await expect(resolver.getNextSong(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getNextSong(1)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
    expect(service.fetchNextSong).toHaveBeenCalledWith(1);
  });

  it("getNextSong throws InternalServerErrorException when the service couldn't connect with the DB", async () => {
    await expect(resolver.getPreviousSong(3)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getPreviousSong(3)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
    expect(service.fetchPreviousSong).toHaveBeenCalledWith(3);
  });
});
