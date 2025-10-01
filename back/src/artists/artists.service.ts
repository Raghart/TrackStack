import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { parseArtistSongs, parseFloatNum, parseString } from 'src/types/parses';
import { SongResponse } from 'src/types/songAttributes';
import { ArtistResponse, ArtistWithSongs } from 'src/types/artistAttributes';
import safeQuery from 'src/utils/safeQuery';
import { InvalidPaginationException } from 'src/utils/PaginationError';
import { AlbumsModel } from '../../models/albums/albums.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { SongsModel } from '../../models/songs/song.model';
import { isNumericString } from 'src/types/verify';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(ArtistsModel) private artistModel: typeof ArtistsModel,
  ) {}

  async fetchArtists(
    seed: string,
    page = 1,
    limit = 20,
  ): Promise<ArtistWithSongs[]> {
    if (!isNumericString(seed))
      throw new BadRequestException(
        'The seed must be a valid string of numbers.',
      );
    if (page < 1) throw new InvalidPaginationException('page', page);
    if (limit < 1) throw new InvalidPaginationException('limit', limit);

    const offset = (page - 1) * limit;
    const rawData = await safeQuery(() =>
      this.artistModel.findAll({
        order: Sequelize.literal(
          `md5(CAST("ArtistsModel"."id" AS TEXT) || '${seed}')`,
        ),
        offset,
        limit,
        include: [
          {
            model: SongsModel,
            attributes: ['name'],
            include: [{ model: AlbumsModel, attributes: ['url_image'] }],
          },
        ],
      }),
    );

    return rawData.map((entry) => parseArtistSongs(entry.get({ plain: true })));
  }

  parseArtists(artistData: ArtistWithSongs[]): ArtistResponse[] {
    return artistData.map((artist) => ({
      id: artist.id,
      name: artist.name,
      album_cover: parseString(artist.songs[0].album.url_image),
    }));
  }

  async getAllArtists(
    seed: string,
    page: number,
    limit: number,
  ): Promise<ArtistResponse[]> {
    const artistResults = await this.fetchArtists(seed, page, limit);
    return this.parseArtists(artistResults);
  }

  async fetchArtistSongs(artist: string): Promise<ArtistWithSongs> {
    const rawData = await safeQuery(() =>
      this.artistModel.findOne({
        where: { name: { [Op.iLike]: `${artist}` } },
        include: [
          {
            model: SongsModel,
            attributes: ['id', 'name', 'url_preview'],
            through: { attributes: [] },
            include: [{ model: AlbumsModel, attributes: ['url_image'] }],
          },
        ],
      }),
    );

    if (!rawData)
      throw new NotFoundException(
        `The artist: '${artist}' doesn't exist in the DB!`,
      );
    return parseArtistSongs(rawData.get({ plain: true }));
  }

  parseArtistSongs(artist: ArtistWithSongs): SongResponse[] {
    return artist.songs.map((song) => ({
      id: parseFloatNum(song.id),
      name: parseString(song.name),
      artists: [artist.name],
      url_preview: parseString(song.url_preview),
      album_cover: parseString(song.album.url_image),
    }));
  }

  async getAllArtistSongs(artist: string): Promise<SongResponse[]> {
    const artistSongs = await this.fetchArtistSongs(artist);
    return this.parseArtistSongs(artistSongs);
  }
}
