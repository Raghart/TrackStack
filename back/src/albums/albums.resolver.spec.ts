/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsResolver } from './albums.resolver';
import { AlbumsService } from './albums.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { albumResSongs } from '../../test/data/albumsModule/AlbumData';

describe('AlbumsResolver', () => {
  let resolver: AlbumsResolver;
  let service: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsResolver,
        {
          provide: AlbumsService,
          useValue: {
            getAllAlbumSongs: jest.fn().mockResolvedValue(albumResSongs),
          },
        },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
    resolver = module.get<AlbumsResolver>(AlbumsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('getAllAlbumSongs gets the expected results from the albums service', async () => {
    const results = await resolver.getAllAlbumSongs('testingAlbum');
    expect(service.getAllAlbumSongs).toHaveBeenCalledWith('testingAlbum');
    expect(results.length).toBe(5);
  });
});

describe('AlbumsResolver Error handling', () => {
  let resolver: AlbumsResolver;
  let service: AlbumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsResolver,
        {
          provide: AlbumsService,
          useValue: {
            fetchDBAlbumSongs: jest.fn(),
            getAllAlbumSongs: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
    resolver = module.get<AlbumsResolver>(AlbumsResolver);
  });

  it('getAllAlbumSongs throws NotFoundException when no songs are found for X album', async () => {
    (service.getAllAlbumSongs as jest.Mock).mockRejectedValue(
      new NotFoundException("Album: noAlbum couldn't be found!"),
    );
    await expect(resolver.getAllAlbumSongs('noAlbum')).rejects.toThrow(
      NotFoundException,
    );
    await expect(resolver.getAllAlbumSongs('noAlbum')).rejects.toThrow(
      "Album: noAlbum couldn't be found!",
    );
    expect(service.getAllAlbumSongs).toHaveBeenCalledWith('noAlbum');
  });

  it('getAllAlbumSongs throws NotFoundException when no songs are found for X album', async () => {
    (service.getAllAlbumSongs as jest.Mock).mockRejectedValue(
      new InternalServerErrorException(
        new Error('Database Error: SequelizeTimeoutError: Connection refused'),
      ),
    );
    await expect(resolver.getAllAlbumSongs('Duck')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(resolver.getAllAlbumSongs('Duck')).rejects.toThrow(
      'Database Error: SequelizeTimeoutError: Connection refused',
    );
    expect(service.getAllAlbumSongs).toHaveBeenCalledWith('Duck');
  });
});
