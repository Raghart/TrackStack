/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsResolver } from './albums.resolver';
import { AlbumsService } from './albums.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { albumResSongs } from '../../test/data/albumsModule/AlbumData';
import { expectSongProps } from 'src/utils/expectSongs';

describe('AlbumsResolver returns the expected songs from an album', () => {
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

  it('getAllAlbumSongs returns a song array of an album ready to be delivered', async () => {
    const results = await resolver.getAllAlbumSongs('testingAlbum');
    expect(service.getAllAlbumSongs).toHaveBeenCalledWith('testingAlbum');
    expect(results).toHaveLength(5);
    expectSongProps(results);
  });
});

describe('AlbumsResolver retrieves the errors thrown by the service to detect invalid results', () => {
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

  it('getAllAlbumSongs throws an error when no songs are found for an album', async () => {
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

  it("getAllAlbumSongs throws an error when it couldn't retrieve the data from the database", async () => {
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
