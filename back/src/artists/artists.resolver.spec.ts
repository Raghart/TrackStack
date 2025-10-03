/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsResolver } from './artists.resolver';
import { ArtistsService } from './artists.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NOTFOUND_ERROR } from '../../test/constants/constants';
import { InvalidPaginationException } from 'src/utils/PaginationError';
import {
  artistTestResponses,
  artistTestSongs,
} from '../../test/data/artistsModule/artistData';

describe('ArtistsResolver delivers the expected artists and artist songs to the frontend', () => {
  let resolver: ArtistsResolver;
  let service: ArtistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistsResolver,
        {
          provide: ArtistsService,
          useValue: {
            getAllArtists: jest.fn().mockResolvedValue(artistTestResponses),
            getAllArtistSongs: jest.fn().mockResolvedValue(artistTestSongs),
          },
        },
      ],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
    resolver = module.get<ArtistsResolver>(ArtistsResolver);
  });

  it('getAllArtists recieves the expected results from the artists service', async () => {
    const results = await resolver.getAllArtists('1', 1, 5);
    expect(service.getAllArtists).toHaveBeenCalledWith('1', 1, 5);
    expect(results).toHaveLength(5);
    expect(results).toEqual(artistTestResponses);
  });

  it('getAllArtistSongs recieves the expected results from the artists service', async () => {
    const results = await resolver.getAllArtistSongs('Nirvana');
    expect(service.getAllArtistSongs).toHaveBeenCalledWith('Nirvana');
    expect(results).toHaveLength(5);
    expect(results).toEqual(artistTestSongs);
  });
});

describe('ArtistsResolver handles error from the service to communicate them to the devs', () => {
  let resolver: ArtistsResolver;
  let service: ArtistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistsResolver,
        {
          provide: ArtistsService,
          useValue: {
            getAllArtists: jest.fn(),
            getAllArtistSongs: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
    resolver = module.get<ArtistsResolver>(ArtistsResolver);
  });

  it('fetchArtists throws InvalidPaginationException when page < 1', async () => {
    const INVALID_PAGE = -500;
    (service.getAllArtists as jest.Mock).mockRejectedValue(
      new InvalidPaginationException('page', INVALID_PAGE),
    );

    await expect(
      resolver.getAllArtists('123456', INVALID_PAGE, 5),
    ).rejects.toThrow(InvalidPaginationException);

    await expect(
      resolver.getAllArtists('123456', INVALID_PAGE, 5),
    ).rejects.toThrow(`Invalid page: ${INVALID_PAGE} must be >= 1`);

    expect(service.getAllArtists).toHaveBeenCalledWith(
      '123456',
      INVALID_PAGE,
      5,
    );
  });

  it("getAllArtists throws InternalServerErrorException when the request couldn't connect with the DB", async () => {
    (service.getAllArtists as jest.Mock).mockRejectedValue(
      new InternalServerErrorException(
        new Error('Database Error: SequelizeTimeoutError: Connection refused'),
      ),
    );
    await expect(resolver.getAllArtists('123456', 1, 5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getAllArtists('123456', 1, 5)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
    expect(service.getAllArtists).toHaveBeenCalledWith('123456', 1, 5);
  });

  it('getAllArtists throws InvalidPaginationException when page < 1', async () => {
    const INVALID_LIMIT = -500;
    (service.getAllArtists as jest.Mock).mockRejectedValue(
      new InvalidPaginationException('limit', INVALID_LIMIT),
    );
    await expect(
      resolver.getAllArtists('123456', 1, INVALID_LIMIT),
    ).rejects.toThrow(InvalidPaginationException);

    await expect(
      resolver.getAllArtists('123456', 1, INVALID_LIMIT),
    ).rejects.toThrow(`Invalid limit: ${INVALID_LIMIT} must be >= 1`);

    expect(service.getAllArtists).toHaveBeenCalledWith(
      '123456',
      1,
      INVALID_LIMIT,
    );
  });

  it("getAllArtistSongs throws NotFoundException when the artist isn't found in the database", async () => {
    (service.getAllArtistSongs as jest.Mock).mockRejectedValue(
      new NotFoundException(NOTFOUND_ERROR),
    );
    await expect(resolver.getAllArtistSongs('Benito')).rejects.toThrow(
      NotFoundException,
    );
    await expect(resolver.getAllArtistSongs('Benito')).rejects.toThrow(
      NOTFOUND_ERROR,
    );
    expect(service.getAllArtistSongs).toHaveBeenCalledWith('Benito');
  });

  it("getAllArtistSongs throws an error when the request couldn't connect with the database", async () => {
    (service.getAllArtistSongs as jest.Mock).mockRejectedValue(
      new InternalServerErrorException(
        new Error('Database Error: SequelizeTimeoutError: Query timed out'),
      ),
    );

    await expect(resolver.getAllArtistSongs('Duck')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getAllArtistSongs('Duck')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );

    expect(service.getAllArtistSongs).toHaveBeenCalledWith('Duck');
  });
});
