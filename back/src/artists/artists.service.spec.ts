/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsService } from './artists.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  artistData,
  artistSongs,
} from '../../test/data/artistsModule/serArtistData';
import { expectSongProps, expectSongsArray } from 'src/utils/expectSongs';
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
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseArtists', () => {
    it('parseArtists returns artists with expected props', () => {
      const results = service.parseArtists(artistData);
      expect(results.length).toBe(LIMIT);

      results.forEach((artist) =>
        expect(artist).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          album_cover: expect.any(String),
        }),
      );
    });

    it('fetchDBArtists throws InvalidPaginationException when the page is invalid', async () => {
      const INVALID_PAGE = -500;
      await expect(
        service.fetchArtists('123456', INVALID_PAGE, 5),
      ).rejects.toThrow(InvalidPaginationException);
      await expect(
        service.fetchArtists('123456', INVALID_PAGE, 5),
      ).rejects.toThrow(`Invalid page: ${INVALID_PAGE} must be >= 1`);
    });

    it('fetchArtists throws BadRequestException when seed is invalid', async () => {
      const INVALID_SEED = 'papitas123456';
      await expect(service.fetchArtists(INVALID_SEED, 1, 5)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.fetchArtists(INVALID_SEED, 1, 5)).rejects.toThrow(
        'The seed must be a valid string of numbers.',
      );
    });

    it('fetchArtists throws InvalidPaginationException when page = 0', async () => {
      const INVALID_PAGE = 0;
      await expect(
        service.fetchArtists('123456', INVALID_PAGE, 5),
      ).rejects.toThrow(InvalidPaginationException);
      await expect(
        service.fetchArtists('123456', INVALID_PAGE, 5),
      ).rejects.toThrow(`Invalid page: ${INVALID_PAGE} must be >= 1`);
    });

    it('fetchArtists throws InvalidPaginationException when the limit is invalid', async () => {
      const INVALID_LIMIT = -500;
      await expect(
        service.fetchArtists('123456', 1, INVALID_LIMIT),
      ).rejects.toThrow(InvalidPaginationException);
      await expect(
        service.fetchArtists('123456', 1, INVALID_LIMIT),
      ).rejects.toThrow(`Invalid limit: ${INVALID_LIMIT} must be >= 1`);
    });

    it('fetchArtists throws InvalidPaginationException when the limit = 0', async () => {
      const INVALID_LIMIT = 0;
      await expect(
        service.fetchArtists('123456', 1, INVALID_LIMIT),
      ).rejects.toThrow(InvalidPaginationException);
      await expect(
        service.fetchArtists('123456', 1, INVALID_LIMIT),
      ).rejects.toThrow(`Invalid limit: ${INVALID_LIMIT} must be >= 1`);
    });
  });

  describe('parseArtistSongs', () => {
    it('parseArtistSongs returns a list of objects with correct properties', () => {
      const results = service.parseArtistSongs(artistSongs);
      expectSongProps(results);
    });

    it('getAllArtistSongs get specific artist songs', () => {
      const results = service.parseArtistSongs(artistSongs);
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

  it("fetchArtists throws InternalServerErrorException when it couldn't connect with the DB", async () => {
    await expect(service.fetchArtists('1', 1, 5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchArtists('1', 1, 5)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("fetchArtistSongs throws InternalServerErrorException when it couldn't connect with the DB", async () => {
    await expect(service.fetchArtistSongs('Felipez')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchArtistSongs('Felipez')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });
});
