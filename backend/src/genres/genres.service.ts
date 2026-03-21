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

  async fetchGenres(): Promise<{ genre: string }[]> {
    return safeQuery(() =>
      this.genreModel.findAll({ attributes: ['genre'], raw: true }),
    );
  }

  parseGenres(genres: { genre: string }[]): string[] {
    return parseStringArray(genres.map((g) => g.genre));
  }

  async getAllGenres(): Promise<string[]> {
    const genreList = await this.fetchGenres();
    return this.parseGenres(genreList);
  }
}
