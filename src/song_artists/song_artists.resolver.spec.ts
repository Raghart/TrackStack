import { Test, TestingModule } from '@nestjs/testing';
import { SongArtistsResolver } from './song_artists.resolver';
import { SongArtistsService } from './song_artists.service';

describe('SongArtistsResolver', () => {
  let resolver: SongArtistsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongArtistsResolver,
        { provide: SongArtistsService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<SongArtistsResolver>(SongArtistsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
