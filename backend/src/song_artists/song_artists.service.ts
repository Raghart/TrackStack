import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SongArtistsModel } from '../../models/song_artists/songArtists.model';

@Injectable()
export class SongArtistsService {
  constructor(
    @InjectModel(SongArtistsModel)
    private songArtistModel: typeof SongArtistsModel,
  ) {}
}
