import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { parseAlbumSong, parseStringArray } from 'src/types/parses';
import { SongResponse } from 'src/types/songAttributes';
import safeQuery from 'src/utils/safeQuery';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { AlbumWithSongs } from 'src/types/albumAttributes';
import { isNumber } from 'src/types/verify';
import { InvalidPaginationException } from 'src/utils/PaginationError';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(AlbumsModel) private albumModel: typeof AlbumsModel,
  ) {}

  async fetchAlbums(seed: string, page = 1, limit = 20) {
    if (!isNumber(seed))
      throw new BadRequestException(
        'The seed must be a valid string of numbers.',
      );
    if (page < 1) throw new InvalidPaginationException('page', page);
    if (limit < 1) throw new InvalidPaginationException('limit', limit);

    const offset = (page - 1) * limit;
    const rawData = await safeQuery(() =>
    this.albumModel.findAll({
      order: Sequelize.literal(
        `md5(CAST("AlbumsModel"."id" AS TEXT) || '${Number(seed)}')`
      ),
      offset,
      limit,
      include: [
        {
          model: SongsModel,
          include: [{ model: ArtistsModel, attributes: ['name'] }]
        }
      ]
    }));

    const data = rawData.map(entry => entry.get({ plain: true }));
    console.log(data)
    return "ok";
  }

  async fetchAlbumSongs(album: string): Promise<AlbumWithSongs> {
    const rawData = await safeQuery(() =>
      this.albumModel.findOne({
        where: { name: { [Op.iLike]: `${album}` } },
        include: [
          {
            model: SongsModel,
            attributes: ['id', 'name', 'url_preview'],
            include: [
              {
                model: ArtistsModel,
                attributes: ['name'],
                through: { attributes: [] },
              },
            ],
          },
        ],
      }),
    );

    if (!rawData)
      throw new NotFoundException(`Album: ${album} couldn't be found!`);
    return parseAlbumSong(rawData.get({ plain: true }));
  }

  parseAlbumSongs(albumSongs: AlbumWithSongs): SongResponse[] {
    return albumSongs.songs.map((song) => ({
      id: song.id,
      name: song.name,
      artists: parseStringArray(song.artists.map((artist) => artist.name)),
      url_preview: song.url_preview,
      album_cover: albumSongs.url_image,
    }));
  }

  async getAllAlbumSongs(album: string): Promise<SongResponse[]> {
    const albumSongs = await this.fetchAlbumSongs(album);
    return this.parseAlbumSongs(albumSongs);
  }
}
