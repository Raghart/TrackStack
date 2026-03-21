import { Test, TestingModule } from '@nestjs/testing';
import { SongDetailsService } from './song_details.service';
import { getModelToken } from '@nestjs/sequelize';
import { SongDetailsModel } from '../../models/song_details/SongDetails.model';

describe('SongDetailsService', () => {
  let service: SongDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongDetailsService,
        { provide: getModelToken(SongDetailsModel), useValue: {} },
      ],
    }).compile();

    service = module.get<SongDetailsService>(SongDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
