import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsService } from './albums.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  albumParsedSongs,
  albumSongs,
} from '../../test/data/albumsModule/AlbumData';
import { expectSongData, expectSongProps } from 'src/utils/expectSongs';
import { SequelizeTimeoutError } from 'src/utils/mockErrors';
import { AlbumsModel } from '../../models/albums/albums.model';

describe('AlbumsService retrieves and parses from the database all the songs of an album', () => {
  let service: AlbumsService;
  let albumModel: { findOne: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: getModelToken(AlbumsModel),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
    albumModel = module.get(getModelToken(AlbumsModel));
  });

  it('parseAlbumSongs parses correctly the songs of a specific album', () => {
    albumModel.findOne.mockResolvedValue({ get: () => albumSongs });

    const results = service.parseAlbumSongs(albumSongs);
    expectSongProps(results);
    expect(results.length).toBeGreaterThan(0);
    expectSongData(results[0], 'Come as You Are', 'Nirvana');
  });

  it('fetchAlbumSongs returns an object with the expected props', async () => {
    albumModel.findOne.mockResolvedValue({ get: () => albumSongs });

    const results = await service.fetchAlbumSongs('Nirvana');
    expect(results).toStrictEqual(albumSongs);
  });

  it("fetchAlbumSongs throws an error when the searched album isn't in the database", async () => {
    albumModel.findOne.mockResolvedValue(undefined);

    await expect(service.fetchAlbumSongs('noAlbum')).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.fetchAlbumSongs('noAlbum')).rejects.toThrow(
      `Album: noAlbum couldn't be found!`,
    );
  });

  it('getAllAlbumSongs returns a list of songs ready to deliver to the resolver', async () => {
    albumModel.findOne.mockResolvedValue({ get: () => albumSongs });

    const results = await service.getAllAlbumSongs('Nirvana');
    expect(results).toStrictEqual(albumParsedSongs);
  });
});

describe("AlbumsService is able to manage errors when it couldn't connect to the database", () => {
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
