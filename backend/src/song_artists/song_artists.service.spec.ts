import { Test, TestingModule } from '@nestjs/testing';
import { SongArtistsService } from './song_artists.service';
import { getModelToken } from '@nestjs/sequelize';
import { SongArtistsModel } from '../../models/song_artists/songArtists.model';

describe('SongArtistsService', () => {
  let service: SongArtistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongArtistsService,
        { provide: getModelToken(SongArtistsModel), useValue: {} },
      ],
    }).compile();

    service = module.get<SongArtistsService>(SongArtistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
