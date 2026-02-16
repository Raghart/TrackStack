/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SongsResolver } from './songs.resolver';
import { SongsService } from './songs.service';
import {
  singleSongData,
  songFullTestResponse,
  songIATestResponses,
  songTestResponses,
} from '../../test/data/songsModule/resSongData';
import { InternalServerErrorException } from '@nestjs/common';
import { ConnectionResError, TimeoutResError } from 'src/utils/mockErrors';
import { USER_VECTOR } from '../../test/constants/constants';
import { expectSongProps } from 'src/utils/expectSongs';

describe('SongsResolver receives the expected songs array from the service', () => {
  let service: SongsService;
  let resolver: SongsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsResolver,
        {
          provide: SongsService,
          useValue: {
            getLandpageSongs: jest.fn().mockResolvedValue(songTestResponses),
            getDBLength: jest.fn().mockResolvedValue(songTestResponses.length),
            getSongData: jest.fn().mockResolvedValue(songFullTestResponse),
            getIARecommendations: jest
              .fn()
              .mockReturnValue(songIATestResponses),
            getRandomSong: jest.fn().mockResolvedValue(singleSongData),
            getNextSong: jest.fn().mockResolvedValue(singleSongData),
            getPreviousSong: jest.fn().mockResolvedValue(singleSongData),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    resolver = module.get<SongsResolver>(SongsResolver);
  });

  it('getDBLength retrieves the quantity of songs from the service', async () => {
    const result = await resolver.getDBLength();
    expect(service.getDBLength).toHaveBeenCalled();
    expect(result).toBe(5);
  });

  it('getLandpageSongs retrieves a songs array ready to be delivered', async () => {
    const results = await resolver.getLandpageSongs(5);
    expect(service.getLandpageSongs).toHaveBeenCalledWith(5);
    expect(results).toHaveLength(5);
  });

  it('getSongData retrieves a full song response from service ready to be delivered', async () => {
    const result = await resolver.getSongData(2);
    expect(service.getSongData).toHaveBeenCalledWith(2);
    expect(result).toEqual(songFullTestResponse);
  });

  it('getIARecommendations retrieves a songs recommendations array ready to be delivered', async () => {
    const results = await resolver.getIARecommendations(
      ['Rock', 'Alternative', 'Alternative Rock', 'Grunge'],
      USER_VECTOR, 40
    );

    expect(results).toHaveLength(5);
  });

  it('getRandomSong retrieves a song ready to be delivered', async () => {
    const result = await resolver.getRandomSong();
    expect(service.getRandomSong).toHaveBeenCalled();
    expectSongProps([result]);
  });

  it('getNextSong retrieves a song ready to be delivered', async () => {
    const result = await resolver.getNextSong(1);
    expect(service.getNextSong).toHaveBeenCalledWith(1);
    expectSongProps([result]);
  });

  it("getNextSong retrieves a song even if the id doesn't match", async () => {
    const result = await resolver.getNextSong(999);
    expect(service.getNextSong).toHaveBeenCalledWith(999);
    expectSongProps([result]);
  });

  it('getPreviousSong retrieves a song ready to be delivered', async () => {
    const result = await resolver.getPreviousSong(3);
    expect(service.getPreviousSong).toHaveBeenCalledWith(3);
    expectSongProps([result]);
  });

  it("getPreviousSong recieves a song even if the id doesn't match", async () => {
    const result = await resolver.getPreviousSong(999);
    expect(service.getPreviousSong).toHaveBeenCalledWith(999);
    expectSongProps([result]);
  });
});

describe('SongsResolver is able to communicate the error from the service to help development', () => {
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
            getLandpageSongs: TimeoutResError(),
            getRandomSong: TimeoutResError(),
            getSongData: TimeoutResError(),
            getIARecommendations: ConnectionResError(),
            getNextSong: ConnectionResError(),
            getPreviousSong: ConnectionResError(),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    resolver = module.get<SongsResolver>(SongsResolver);
  });

  it("getDBLength throws an error when the service couldn't connect with the database", async () => {
    await expect(resolver.getDBLength()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getDBLength()).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.getDBLength).toHaveBeenCalled();
  });

  it("getLandpageSongs throws an error when the service couldn't connect with the database", async () => {
    await expect(resolver.getLandpageSongs(5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getLandpageSongs(5)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.getLandpageSongs).toHaveBeenCalledWith(5);
  });

  it("getRandomSong throws an error when the service couldn't connect with the database", async () => {
    await expect(resolver.getRandomSong()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getRandomSong()).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.getRandomSong).toHaveBeenCalled();
  });

  it("getSongData throws an error when the service couldn't connect with the database", async () => {
    await expect(resolver.getSongData(999)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getSongData(999)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.getSongData).toHaveBeenCalledWith(999);
  });

  it("getIARecommendations throws an error when the service couldn't connect with the database", async () => {
    await expect(
      resolver.getIARecommendations([], USER_VECTOR, 40),
    ).rejects.toThrow(InternalServerErrorException);

    await expect(
      resolver.getIARecommendations([], USER_VECTOR, 40),
    ).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );

    expect(service.fetchIACosRecommendations).toHaveBeenCalledWith([], USER_VECTOR);
  });

  it("getNextSong throws an error when the service couldn't connect with the database", async () => {
    await expect(resolver.getNextSong(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getNextSong(1)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
    expect(service.getNextSong).toHaveBeenCalledWith(1);
  });

  it("getPreviousSong throws an error when the service couldn't connect with the database", async () => {
    await expect(resolver.getPreviousSong(3)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getPreviousSong(3)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
    expect(service.getPreviousSong).toHaveBeenCalledWith(3);
  });
});
