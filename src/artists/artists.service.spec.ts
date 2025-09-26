/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsService } from './artists.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  artistData,
  artistSongs,
} from '../../test/data/artistsModule/serArtistData';
import { findAllArtists, findOneArtistSongs } from 'src/utils/mockArtists';
import { expectArtistData } from 'src/utils/expectArtists';
import {
  expectSongData,
  expectSongProps,
  expectSongsArray,
} from 'src/utils/expectSongs';
import {
  SequelizeConnectionError,
  SequelizeTimeoutError,
} from 'src/utils/mockErrors';
import { InvalidPaginationException } from 'src/utils/PaginationError';
import { ArtistsModel } from '../../models/artists/artists.model';

describe('ArtistsService', () => {
  let service: ArtistsService;
  const LIMIT = artistData.length;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistsService,
        {
          provide: getModelToken(ArtistsModel),
          useValue: {
            findOne: findOneArtistSongs,
            findAll: findAllArtists,
          },
        },
      ],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllArtists', () => {
    it('getAllArtists has expected props', async () => {
      const results = await service.getAllArtists('123456', 1, LIMIT);
      expect(results.length).toBe(LIMIT);

      results.forEach((artist) =>
        expect(artist).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          album_cover: expect.any(String),
        }),
      );
    });

    it('getAllArtists pagination works as expected', async () => {
      const LIMIT1 = 3;
      const results1 = await service.getAllArtists('123456', 1, LIMIT1);
      expect(results1.length).toBe(LIMIT1);

      const LIMIT2 = 2;
      const results2 = await service.getAllArtists('123456', 2, LIMIT2);
      expect(results2.length).toBe(LIMIT2);
    });

    it('getAllArtists should return all mock artists with correct album covers', async () => {
      const artistsList = artistData.map((artist) => artist.name);
      const results = await service.getAllArtists('123456', 1, LIMIT);
      expect(results).toHaveLength(LIMIT);
      results.forEach((artist) => expectArtistData(artistsList, artist));
    });

    it('getAllArtists throws InvalidPaginationException when the page is invalid', async () => {
      const INVALID_PAGE = -500;
      await expect(
        service.getAllArtists('123456', INVALID_PAGE, 5),
      ).rejects.toThrow(InvalidPaginationException);
      await expect(
        service.getAllArtists('123456', INVALID_PAGE, 5),
      ).rejects.toThrow(`Invalid page: ${INVALID_PAGE} must be >= 1`);
    });

    it('getAllArtists throws BadRequestException when seed is invalid', async () => {
      const INVALID_SEED = 'papitas123456';
      await expect(service.getAllArtists(INVALID_SEED, 1, 5)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.getAllArtists(INVALID_SEED, 1, 5)).rejects.toThrow(
        'The seed must be a valid string of numbers.',
      );
    });

    it('getAllArtists throws InvalidPaginationException when page = 0', async () => {
      const INVALID_PAGE = 0;
      await expect(
        service.getAllArtists('123456', INVALID_PAGE, 5),
      ).rejects.toThrow(InvalidPaginationException);
      await expect(
        service.getAllArtists('123456', INVALID_PAGE, 5),
      ).rejects.toThrow(`Invalid page: ${INVALID_PAGE} must be >= 1`);
    });

    it('getAllArtists throws InvalidPaginationException when the limit is invalid', async () => {
      const INVALID_LIMIT = -500;
      await expect(
        service.getAllArtists('123456', 1, INVALID_LIMIT),
      ).rejects.toThrow(InvalidPaginationException);
      await expect(
        service.getAllArtists('123456', 1, INVALID_LIMIT),
      ).rejects.toThrow(`Invalid limit: ${INVALID_LIMIT} must be >= 1`);
    });

    it('getAllArtists throws InvalidPaginationException when the limit = 0', async () => {
      const INVALID_LIMIT = 0;
      await expect(
        service.getAllArtists('123456', 1, INVALID_LIMIT),
      ).rejects.toThrow(InvalidPaginationException);
      await expect(
        service.getAllArtists('123456', 1, INVALID_LIMIT),
      ).rejects.toThrow(`Invalid limit: ${INVALID_LIMIT} must be >= 1`);
    });

    it('getAllArtists handles limit > surpases', async () => {
      const results = await service.getAllArtists('123456', 1, 999);
      expect(results).toHaveLength(LIMIT);
    });
  });

  describe('getAllArtistSongs', () => {
    it('getAllArtistSongs has correct properties', async () => {
      const artists = artistSongs.map((artist) => artist.name);
      for (const artist of artists) {
        const results = await service.getAllArtistSongs(artist);
        expectSongProps(results);
      }
    });

    it('getAllArtistSongs get specific artist songs', async () => {
      const results = await service.getAllArtistSongs('Nirvana');
      const songNames = [
        'Come as You Are',
        'Lithium',
        'Heart-Shaped Box',
        'In Bloom',
        'Rape Me',
      ];
      expect(results.length).toBeGreaterThan(0);
      results.forEach((song) => expectSongsArray(song, songNames, 'Nirvana'));
    });

    it('getAllArtistSongs get songs for several artists', async () => {
      const results1 = await service.getAllArtistSongs('Oasis');
      results1.forEach((song) => expectSongData(song, 'Wonderwall', 'Oasis'));

      const results2 = await service.getAllArtistSongs('Franz Ferdinand');
      results2.forEach((song) =>
        expectSongData(song, 'Take Me Out', 'Franz Ferdinand'),
      );

      const results3 = await service.getAllArtistSongs('The Killers');
      results3.forEach((song) =>
        expectSongData(song, 'Mr. Brightside', 'The Killers'),
      );

      const results4 = await service.getAllArtistSongs('Radiohead');
      results4.forEach((song) => expectSongData(song, 'Creep', 'Radiohead'));
    });

    it('getAllArtistSongs throws NotFoundException when the artist is not in the DB', async () => {
      await expect(service.getAllArtistSongs('Jesus Benito')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getAllArtistSongs('Jesus Benito')).rejects.toThrow(
        "The artist: 'Jesus Benito' doesn't exist in the DB!",
      );
    });
  });
});

describe('ArtistsService DB Connection Error Handler', () => {
  let service: ArtistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistsService,
        {
          provide: getModelToken(ArtistsModel),
          useValue: {
            findOne: SequelizeTimeoutError(),
            findAll: SequelizeConnectionError(),
          },
        },
      ],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
  });

  it("getAllArtists throws InternalServerErrorException when it couldn't connect with the DB", async () => {
    await expect(service.getAllArtists('1', 1, 5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.getAllArtists('1', 1, 5)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("getAllArtistSongs throws InternalServerErrorException when it couldn't connect with the DB", async () => {
    await expect(service.getAllArtistSongs('Felipez')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.getAllArtistSongs('Felipez')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });
});
