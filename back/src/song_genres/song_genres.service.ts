import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import {
  parseFloatNum,
  parseSongGenres,
  parseString,
  parseStringArray,
} from 'src/types/parses';
import { SongResponse } from 'src/types/songAttributes';
import safeQuery from 'src/utils/safeQuery';
import { InvalidPaginationException } from 'src/utils/PaginationError';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongGenresModel } from '../../models/song_genres/SongGenres.model';
import { GenresModel } from '../../models/genres/genres.model';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { isNumericString } from 'src/types/verify';

@Injectable()
export class SongGenresService {
  constructor(
    @InjectModel(SongGenresModel)
    private songGenreModel: typeof SongGenresModel,
  ) {}

  async getAllGenreSongs(
    seed: string,
    genre: string,
    page = 1,
    limit = 20,
  ): Promise<SongResponse[]> {
    if (!isNumericString(seed))
      throw new BadRequestException(
        'The seed must be a valid string of numbers.',
      );
    if (page < 1) throw new InvalidPaginationException('page', page);
    if (limit < 1) throw new InvalidPaginationException('limit', limit);

    const rawData = await safeQuery(() =>
      this.songGenreModel.findAll({
        order: Sequelize.literal(
          `md5(CAST("SongGenresModel"."id" AS TEXT) || '${seed}')`,
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

    return rawData.map((entry) => {
      const data = parseSongGenres(entry.get({ plain: true }));
      return {
        id: parseFloatNum(data.song.id),
        name: parseString(data.song.name),
        artists: parseStringArray(
          data.song.artists.map((artist) => artist.name),
        ),
        url_preview: parseString(data.song.url_preview),
        album_cover: parseString(data.song.album.url_image),
      };
    });
  }
}
