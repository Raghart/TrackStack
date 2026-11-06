import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { SongResponse } from '@/types/songAttributes';
import safeQuery from '@/utils/safeQuery';
import { InvalidPaginationException } from '@/utils/PaginationError';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongGenresModel } from '../../models/song_genres/SongGenres.model';
import { GenresModel } from '../../models/genres/genres.model';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { floatNumberSchema, songGenresData, songGenresSchema, stringSchema } from '@trackstack/schemas';

@Injectable()
export class SongGenresService {
  constructor(
    @InjectModel(SongGenresModel)
    private songGenreModel: typeof SongGenresModel,
  ) {}

  async fetchSongGenres(
    seed: string,
    genre: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<songGenresData[]> {
    if (!floatNumberSchema.safeParse(seed).success)
      throw new BadRequestException(
        'The seed must be a valid string of numbers.',
      );
    if (page < 1) throw new InvalidPaginationException('page', page);
    if (limit < 1) throw new InvalidPaginationException('limit', limit);

    const rawData = await safeQuery(() =>
      this.songGenreModel.findAll({
        order: Sequelize.literal(
          `md5(CAST("SongGenresModel"."id" AS TEXT) || '${Number(seed)}')`,
        ),
        offset: (page - 1) * limit,
        limit,
        include: [
          { model: GenresModel, where: { genre: { [Op.iLike]: `${genre}` } } },
          {
            model: SongsModel,
            include: [
              { model: ArtistsModel, attributes: ['name'] },
              { model: AlbumsModel, attributes: ['url_image'] },
            ],
          },
        ],
      }),
    );

    if (!rawData)
      throw new NotFoundException(
        `The genre: '${genre}' doesn't exist in the DB!`,
      );

    return rawData.map((entry) => songGenresSchema.parse(entry.get({ plain: true })));
  }

  parseGenreSongs(data: songGenresData[]): SongResponse[] {
    return data.map((entry) => ({
      id: floatNumberSchema.parse(entry.song.id),
      name: stringSchema.parse(entry.song.name),
      artists: entry.song.artists?.map((artist) => stringSchema.parse(artist.name)) ?? [],
      url_preview: stringSchema.parse(entry.song.url_preview),
      album_cover: stringSchema.parse(entry.song.album?.url_image),
    }));
  }

  async getAllGenreSongs(
    seed: string,
    genre: string,
    page: number,
    limit: number,
  ) {
    const genreSongs = await this.fetchSongGenres(seed, genre, page, limit);
    return this.parseGenreSongs(genreSongs);
  }
}
