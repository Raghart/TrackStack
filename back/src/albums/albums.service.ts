import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { parseAlbumSong, parseStringArray } from 'src/types/parses';
import { SongResponse } from 'src/types/songAttributes';
import safeQuery from 'src/utils/safeQuery';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { AlbumWithSongs } from 'src/types/albumAttributes';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(AlbumsModel) private albumModel: typeof AlbumsModel,
  ) {}

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
