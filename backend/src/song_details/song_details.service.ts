import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SongDetailsModel } from '../../models/song_details/SongDetails.model';

@Injectable()
export class SongDetailsService {
  constructor(
    @InjectModel(SongDetailsModel)
    private songDetailsModel: typeof SongDetailsModel,
  ) {}
}
