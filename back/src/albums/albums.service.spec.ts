import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsService } from './albums.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  albumParsedSongs,
  albumResponse,
  albumSongs,
} from '../../test/data/albumsModule/AlbumData';
import { expectSongData, expectSongProps } from 'src/utils/expectSongs';
import { SequelizeTimeoutError } from 'src/utils/mockErrors';
import { AlbumsModel } from '../../models/albums/albums.model';
import { InvalidPaginationException } from 'src/utils/PaginationError';

describe('AlbumsService retrieves and parses all the songs of an album', () => {
  let service: AlbumsService;
  let albumModel: { findOne: jest.Mock, findAll: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: getModelToken(AlbumsModel),
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
    albumModel = module.get(getModelToken(AlbumsModel));
  });

  beforeEach(() => {
    albumModel.findOne.mockResolvedValue({ get: () => albumSongs });
    albumModel.findAll.mockResolvedValue([{ get: () => albumSongs }]);
  });

  it('parseAlbumSongs parses the raw songs data of an album', () => {
    const results = service.parseAlbumSongs(albumSongs);
    expectSongProps(results);
    expect(results.length).toBeGreaterThan(0);
    expectSongData(results[0], 'Come as You Are', 'Nirvana');
  });

  it('fetchAlbumSongs retrieves all the songs of an album from the database', async () => {
    const results = await service.fetchAlbumSongs('Nirvana');
    expect(results).toStrictEqual(albumSongs);
  });

  it('fetchAlbums retrieves the albums from the database', async () => {
    const results = await service.fetchAlbums("1",1,1);
    expect(results).toStrictEqual([albumSongs]);
  });

  it('parseAlbums parses the data into the expected format', () => {
    const results = service.parseAlbums([albumSongs]);
    expect(results).toStrictEqual(albumResponse);
  });

  it('getAlbums recieves expected album results', async () => {
    const results = await service.getAlbums("1", 1, 1);
    expect(results).toStrictEqual(albumResponse);
  });

  it('getAllAlbumSongs returns a song array of an album ready to be delivered', async () => {
    const results = await service.getAllAlbumSongs('Nirvana');
    expect(results).toStrictEqual(albumParsedSongs);
  });

  it("fetchAlbumSongs throws an error when the album isn't in the database", async () => {
    albumModel.findOne.mockResolvedValue(undefined);

    await expect(service.fetchAlbumSongs('noAlbum')).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.fetchAlbumSongs('noAlbum')).rejects.toThrow(
      `Album: noAlbum couldn't be found!`,
    );
  });

  it("fetchAlbums thows an error when the seed is not a valid number", async () => {
    await expect(service.fetchAlbums("abc", 1, 1)).rejects.toThrow(BadRequestException);
    await expect(service.fetchAlbums("abc", 1, 1)).rejects.toThrow(
      "The seed must be a valid string of numbers.");
  });

  it("fetchAlbums thows an error when the seed is not a valid number", async () => {
    await expect(service.fetchAlbums("1", -500, 1)).rejects.toThrow(InvalidPaginationException);
  });
});

describe("AlbumsService throws errors if it couldn't retrieve the data from the database", () => {
  let service: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: getModelToken(AlbumsModel),
          useValue: {
            findOne: SequelizeTimeoutError(),
          },
        },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
  });

  it("fetchAlbumSongs throws InternalServerErrorException when it could't connect with the database", async () => {
    await expect(service.fetchAlbumSongs('Duck')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchAlbumSongs('Duck')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });
});
