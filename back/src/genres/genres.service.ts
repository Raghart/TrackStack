import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenresModel } from '../../models/genres/genres.model';
import { parseStringArray } from 'src/types/parses';
import safeQuery from 'src/utils/safeQuery';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(GenresModel) private genreModel: typeof GenresModel,
  ) {}

  async getAllGenres(): Promise<string[]> {
    const genres = await safeQuery(() =>
      this.genreModel.findAll({ attributes: ['genre'], raw: true }),
    );
    return parseStringArray(genres.map((g) => g.genre));
  }
}
