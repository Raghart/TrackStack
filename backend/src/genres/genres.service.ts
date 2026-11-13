import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenresModel } from '../../models/genres/genres.model';
import safeQuery from '@/utils/safeQuery';
import { stringSchema } from '@trackstack/schemas/zod.parsers';

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
    return genres.map((g) => stringSchema.parse(g.genre));
  }

  async getAllGenres(): Promise<string[]> {
    const genreList = await this.fetchGenres();
    return this.parseGenres(genreList);
  }
}
