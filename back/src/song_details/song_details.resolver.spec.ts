import { Test, TestingModule } from '@nestjs/testing';
import { SongDetailsResolver } from './song_details.resolver';
import { SongDetailsService } from './song_details.service';

describe('SongDetailsResolver', () => {
  let resolver: SongDetailsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongDetailsResolver,
        { provide: SongDetailsService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<SongDetailsResolver>(SongDetailsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
