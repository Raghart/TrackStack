import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsService } from './albums.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SongResponse } from 'src/types/songAttributes';
import { findOneAlbum } from 'src/utils/mockAlbums';
import { albumSongs } from '../../test/data/albumsModule/AlbumData';
import { expectSongData, expectSongProps } from 'src/utils/expectSongs';
import { TESTING_IMG, TESTING_URL } from '../../test/constants/constants';
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
          useValue: {
            findOne: findOneAlbum,
          },
        },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllAlbumSongs', () => {
    it('getAllAlbumSongs has correct properties', async () => {
      const albums = albumSongs.map((album) => album.name);
      for (const album of albums) {
        const results = await service.getAllAlbumSongs(album);
        expectSongProps(results);
      }
    });

    it('getAllAlbumSongs find the songs of a specific album', async () => {
      const results = await service.getAllAlbumSongs('Franz Ferdinand');
      expect(results.length).toBeGreaterThan(0);
      results.forEach((song: SongResponse) =>
        expectSongData(song, 'Take Me Out', 'Franz Ferdinand'),
      );
    });

    it('getAllAlbumSongs find the songs of several albums', async () => {
      const results1 = await service.getAllAlbumSongs('Nevermind (Remastered)');
      expect(results1.length).toBeGreaterThan(0);
      results1.forEach((song: SongResponse) =>
        expectSongData(song, 'Come as You Are', 'Nirvana'),
      );

      const results2 = await service.getAllAlbumSongs(
        "(What's The Story) Morning Glory? [Remastered]",
      );
      expect(results2.length).toBeGreaterThan(0);
      results2.forEach((song: SongResponse) =>
        expectSongData(song, 'Wonderwall', 'Oasis'),
      );

      const results3 = await service.getAllAlbumSongs('Hot Fuss');
      expect(results3.length).toBe(2);

      expect(results3.some((song) => song.name === 'Mr. Brightside')).toBe(
        true,
      );
      expect(results3.some((song) => song.name === 'Somebody Told Me')).toBe(
        true,
      );
      expect(
        results3.every(
          (song) =>
            song.artists.includes('The Killers') && song.artists.length === 1,
        ),
      ).toBe(true);
      expect(results3.every((song) => song.url_preview === TESTING_URL)).toBe(
        true,
      );
      expect(results3.every((song) => song.album_cover === TESTING_IMG)).toBe(
        true,
      );
    });

    it('getAllAlbumSongs error handler: No album Found', async () => {
      const promise = service.getAllAlbumSongs('noAlbum');
      await expect(promise).rejects.toThrow(NotFoundException);
      await expect(promise).rejects.toThrow(
        "Album: noAlbum couldn't be found!",
      );
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

  describe('getAllAlbumSongs Timeout Error', () => {
    it("getAllAlbumSongs throws InternalServerErrorException when the request could't connect with the DB", async () => {
      await expect(service.getAllAlbumSongs('Duck')).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.getAllAlbumSongs('Duck')).rejects.toThrow(
        'Database Error: SequelizeTimeoutError: Query timed out',
      );
    });
  });
});
