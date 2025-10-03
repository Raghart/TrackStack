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
  artistSongsData,
  artistTestResponses,
  artistTestSongs,
} from '../../test/data/artistsModule/artistData';
import { expectSongProps } from 'src/utils/expectSongs';
import {
  SequelizeConnectionError,
  SequelizeTimeoutError,
} from 'src/utils/mockErrors';
import { InvalidPaginationException } from 'src/utils/PaginationError';
import { ArtistsModel } from '../../models/artists/artists.model';

describe('ArtistsService', () => {
  let service: ArtistsService;
  let artistModel: { findAll: jest.Mock; findOne: jest.Mock };
  const artistTestData = artistData.map((entry) => ({ get: () => entry }));
  const artistSongsDB = { get: () => artistSongsData };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistsService,
        {
          provide: getModelToken(ArtistsModel),
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
    artistModel = module.get(getModelToken(ArtistsModel));
  });

  it('fetchArtists returns the expected list of artists from the database', async () => {
    artistModel.findAll.mockResolvedValue(artistTestData);

    const results = await service.fetchArtists('1');
    expect(results).toHaveLength(5);
    expect(results).toStrictEqual(artistData);
  });

  it('parseArtists parses and returns artists with expected props', () => {
    const results = service.parseArtists(artistData);
    expect(results).toStrictEqual(artistTestResponses);
  });

  it('getAllArtists return a list of artists ready to deliver', async () => {
    artistModel.findAll.mockResolvedValue(artistTestData);

    const artistList = await service.getAllArtists('1', 1, 5);
    expect(artistList).toHaveLength(5);
    expect(artistList).toStrictEqual(artistTestResponses);
  });

  it('fetchArtists throws InvalidPaginationException when the page is invalid', async () => {
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

  it('parseArtistSongs returns a list of objects with correct properties', () => {
    const results = service.parseArtistSongs(artistSongsData);
    expectSongProps(results);
  });

  it('fetchArtistSongs retrieves the artist songs from the database', async () => {
    artistModel.findOne.mockResolvedValue(artistSongsDB);

    const artistSongs = await service.fetchArtistSongs('Nirvana');
    expect(artistSongs).toStrictEqual(artistSongsData);
  });

  it('fetchArtistSongs throws an error if the artist is not found in the database', async () => {
    await expect(service.fetchArtistSongs('notArtist')).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.fetchArtistSongs('notArtist')).rejects.toThrow(
      "The artist: 'notArtist' doesn't exist in the DB!",
    );
  });

  it('getAllArtistSongs returns a list of songs from the requested artist', async () => {
    artistModel.findOne.mockResolvedValue(artistSongsDB);

    const artistSongs = await service.getAllArtistSongs('Nirvana');
    expect(artistSongs).toHaveLength(5);
    expectSongProps(artistSongs);
    expect(artistSongs).toStrictEqual(artistTestSongs);
  });
});

describe("ArtistsService throws an error when the requests couldn't connect with the database", () => {
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

  it("fetchArtists throws an error when it couldn't connect with the database", async () => {
    await expect(service.fetchArtists('1', 1, 5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchArtists('1', 1, 5)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
  });

  it("fetchArtistSongs throws an error when it couldn't connect with the database", async () => {
    await expect(service.fetchArtistSongs('Felipez')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.fetchArtistSongs('Felipez')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
  });
});
