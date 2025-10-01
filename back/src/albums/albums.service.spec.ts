/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsService } from './albums.service';
import { getModelToken } from '@nestjs/sequelize';
import { InternalServerErrorException } from '@nestjs/common';
import { albumSongs } from '../../test/data/albumsModule/AlbumData';
import { expectSongData, expectSongProps } from 'src/utils/expectSongs';
import { SequelizeTimeoutError } from 'src/utils/mockErrors';
import { AlbumsModel } from '../../models/albums/albums.model';

describe('AlbumsService', () => {
  let service: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: getModelToken(AlbumsModel),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
  });

  describe('parseAlbumSongs returns parsed songs of the same album', () => {
    it('it returns a list of songs of the same album with has correct properties', () => {
      const results = service.parseAlbumSongs(albumSongs);
      expectSongProps(results);
    });

    it('it parses correctly the songs of a specific album', () => {
      const results = service.parseAlbumSongs(albumSongs);
      expect(results.length).toBeGreaterThan(0);
      expectSongData(results[0], 'Come as You Are', 'Nirvana');
    });
  });
});

describe('AlbumsService DB Connection Error handler', () => {
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

  describe('fetchAlbumSongs Timeout Error', () => {
    it("fetchAlbumSongs throws InternalServerErrorException when the request could't connect with the DB", async () => {
      await expect(service.fetchAlbumSongs('Duck')).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.fetchAlbumSongs('Duck')).rejects.toThrow(
        'Database Error: SequelizeTimeoutError: Query timed out',
      );
    });
  });
});
