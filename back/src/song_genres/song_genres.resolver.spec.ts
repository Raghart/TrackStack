/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SongGenresResolver } from './song_genres.resolver';
import { SongGenresService } from './song_genres.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { songGenresResData } from '../../test/data/songGenresModule/songGenresData';
import { NOGENRE_ERROR } from '../../test/constants/constants';
import { InvalidPaginationException } from 'src/utils/PaginationError';

describe('SongGenresResolver', () => {
  let resolver: SongGenresResolver;
  let service: SongGenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongGenresResolver,
        {
          provide: SongGenresService,
          useValue: {
            getAllGenreSongs: jest.fn().mockResolvedValue(songGenresResData),
          },
        },
      ],
    }).compile();

    service = module.get<SongGenresService>(SongGenresService);
    resolver = module.get<SongGenresResolver>(SongGenresResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('getAllGenreSongs recieves the expected data from the song_genres service', async () => {
    const results = await resolver.getAllGenreSongs('1', 'Rock', 1, 5);
    expect(service.getAllGenreSongs).toHaveBeenCalledWith('1', 'Rock', 1, 5);
    expect(results).toHaveLength(3);
    expect(results).toEqual(songGenresResData);
  });
});

describe('SongGenresResolver Error Handling', () => {
  let resolver: SongGenresResolver;
  let service: SongGenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongGenresResolver,
        {
          provide: SongGenresService,
          useValue: {
            getAllGenreSongs: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SongGenresService>(SongGenresService);
    resolver = module.get<SongGenresResolver>(SongGenresResolver);
  });

  it("getAllGenreSongs throws NotFoundException when genre doesn't exist", async () => {
    (service.getAllGenreSongs as jest.Mock).mockRejectedValue(
      new NotFoundException(NOGENRE_ERROR),
    );

    await expect(
      resolver.getAllGenreSongs('1', 'noGenre', 1, 5),
    ).rejects.toThrow(NotFoundException);
    await expect(
      resolver.getAllGenreSongs('1', 'noGenre', 1, 5),
    ).rejects.toThrow(NOGENRE_ERROR);

    expect(service.getAllGenreSongs).toHaveBeenCalledWith('1', 'noGenre', 1, 5);
  });

  it('getAllGenreSongs throws InvalidPaginationException when limit < 1', async () => {
    const INVALID_LIMIT = -50;
    (service.getAllGenreSongs as jest.Mock).mockRejectedValue(
      new InvalidPaginationException('limit', INVALID_LIMIT),
    );

    await expect(
      resolver.getAllGenreSongs('1', 'Rock', 1, INVALID_LIMIT),
    ).rejects.toThrow(InvalidPaginationException);

    await expect(
      resolver.getAllGenreSongs('1', 'Rock', 1, INVALID_LIMIT),
    ).rejects.toThrow(`Invalid limit: ${INVALID_LIMIT} must be >= 1`);

    expect(service.getAllGenreSongs).toHaveBeenCalledWith(
      '1',
      'Rock',
      1,
      INVALID_LIMIT,
    );
  });

  it('getAllGenreSongs throws InvalidPaginationException when page < 1', async () => {
    const INVALID_PAGE = -50;
    (service.getAllGenreSongs as jest.Mock).mockRejectedValue(
      new InvalidPaginationException('page', INVALID_PAGE),
    );

    await expect(
      resolver.getAllGenreSongs('1', 'Rock', INVALID_PAGE, 5),
    ).rejects.toThrow(InvalidPaginationException);

    await expect(
      resolver.getAllGenreSongs('1', 'Rock', INVALID_PAGE, 5),
    ).rejects.toThrow(`Invalid page: ${INVALID_PAGE} must be >= 1`);

    expect(service.getAllGenreSongs).toHaveBeenCalledWith(
      '1',
      'Rock',
      INVALID_PAGE,
      5,
    );
  });

  it('getAllGenreSongs throws InternalServerErrorException the request timeout', async () => {
    (service.getAllGenreSongs as jest.Mock).mockRejectedValue(
      new InternalServerErrorException(
        new Error('Database Error: SequelizeTimeoutError: Query timed out'),
      ),
    );
    await expect(resolver.getAllGenreSongs('1', 'Rock', 1, 5)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getAllGenreSongs('1', 'Rock', 1, 5)).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Query timed out',
    );
    expect(service.getAllGenreSongs).toHaveBeenCalledWith('1', 'Rock', 1, 5);
  });
});
