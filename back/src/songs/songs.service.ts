import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { getCosineSimilarity } from './utils/getCosineSimilarity';
import { buildSongVector } from './utils/buildSongVector';
import {
  parseFullSongResponse,
  parseIASongData,
  parseNumberArray,
  parseSongResponse,
  parseString,
  parseStringArray,
} from 'src/types/parses';
import {
  FullSongResponse,
  FullSongResponseAttributes,
  IASongResponse,
  IASongScores,
  SongResponse,
  SongResponseAttributes,
} from 'src/types/songAttributes';
import safeQuery from 'src/utils/safeQuery';
import { InvalidPaginationException } from 'src/utils/PaginationError';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { GenresModel } from '../../models/genres/genres.model';
import { SongDetailsModel } from '../../models/song_details/SongDetails.model';

@Injectable()
export class SongsService {
  constructor(@InjectModel(SongsModel) private songModel: typeof SongsModel) {}

  async getDBLength(): Promise<number> {
    return await safeQuery(() => this.songModel.count());
  }

  async fetchLandpageSongs(limit = 20): Promise<SongResponseAttributes[]> {
    if (limit < 1) throw new InvalidPaginationException('limit', limit);

    const rawData = await safeQuery(() =>
      this.songModel.findAll({
        order: Sequelize.literal('RANDOM()'),
        limit,
        attributes: ['id', 'name', 'url_preview'],
        include: [
          {
            model: ArtistsModel,
            attributes: ['name'],
            through: { attributes: [] },
          },
          { model: AlbumsModel, attributes: ['url_image'] },
        ],
      }),
    );
    return rawData.map((entry) =>
      parseSongResponse(entry.get({ plain: true })),
    );
  }

  parseSongList(songData: SongResponseAttributes[]): SongResponse[] {
    return songData.map((song) => ({
      id: song.id,
      name: song.name,
      artists: parseStringArray(song.artists.map((a) => a.name)),
      url_preview: song.url_preview,
      album_cover: parseString(song.album.url_image),
    }));
  }

  async fetchFullSongData(songID: number): Promise<FullSongResponseAttributes> {
    if (songID < 1)
      throw new BadRequestException(
        `The ID: '${songID}' is not valid, It must be >= 1!`,
      );

    const rawData = await safeQuery(() =>
      this.songModel.findByPk(songID, {
        attributes: [
          'id',
          'name',
          'duration',
          'year',
          'spotify_id',
          'url_preview',
        ],
        include: [
          {
            model: ArtistsModel,
            attributes: ['name'],
            through: { attributes: [] },
          },
          { model: AlbumsModel, attributes: ['name', 'url_image'] },
          {
            model: GenresModel,
            attributes: ['genre'],
            through: { attributes: [] },
          },
        ],
      }),
    );

    if (!rawData) throw new NotFoundException("Song doesn't exist in the DB!");

    return parseFullSongResponse(rawData.get({ plain: true }));
  }

  parseFullSong(songData: FullSongResponseAttributes): FullSongResponse {
    return {
      id: songData.id,
      name: songData.name,
      artists: parseStringArray(songData.artists.map((artist) => artist.name)),
      genres: parseStringArray(songData.genres.map((g) => g.genre)),
      album: parseString(songData.album.name),
      album_cover: parseString(songData.album.url_image),
      duration: songData.duration,
      year: songData.year,
      spotify_id: songData.spotify_id,
      url_preview: songData.url_preview,
    };
  }

  async fetchIARecommendations(genres: string[]): Promise<IASongResponse[]> {
    const rawSongData = await safeQuery(() =>
      this.songModel.findAll({
        attributes: ['id', 'name', 'url_preview', 'duration'],
        limit: 100,
        order: Sequelize.literal('RANDOM()'),
        include: [
          { model: AlbumsModel, attributes: ['url_image'] },
          {
            model: ArtistsModel,
            attributes: ['name'],
            through: { attributes: [] },
          },
          { model: SongDetailsModel },
          {
            model: GenresModel,
            through: { attributes: [] },
            duplicating: false,
            ...(genres.length > 0
              ? { where: { genre: { [Op.in]: genres } } }
              : {}),
          },
        ],
      }),
    );
    return rawSongData.map((entry) =>
      parseIASongData(entry.get({ plain: true })),
    );
  }

  parseUserVector(
    energy: number = 0.5,
    speechLevel: number = 0.165,
    danceability: number = 0.5,
    duration: number = 2.5,
    sentiment: number = 0.5,
    voiceType: number = 0.05,
    mood: number = 1,
    acousticness: number = 0.15,
  ) {
    return parseNumberArray([
      energy,
      speechLevel,
      danceability,
      duration,
      sentiment,
      voiceType,
      mood,
      acousticness,
    ]);
  }

  getIARecommendations(
    songData: IASongResponse[],
    userVector: number[],
  ): IASongScores[] {
    return songData
      .map((song) => ({
        id: song.id,
        song,
        score: getCosineSimilarity(buildSongVector(song), userVector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);
  }

  async fetchRandomSong(): Promise<SongResponseAttributes> {
    const result = await safeQuery(() =>
      this.songModel.findOne({
        order: Sequelize.literal('RANDOM()'),
        include: [
          {
            model: ArtistsModel,
            attributes: ['name'],
            through: { attributes: [] },
          },
          { model: AlbumsModel, attributes: ['url_image'] },
        ],
      }),
    );
    return parseSongResponse(result?.get({ plain: true }));
  }

  parseSongResponse(randomSong: SongResponseAttributes): SongResponse {
    return {
      id: randomSong.id,
      name: randomSong.name,
      artists: parseStringArray(
        randomSong.artists.map((artist) => artist.name),
      ),
      album_cover: parseString(randomSong.album.url_image),
      url_preview: randomSong.url_preview,
    };
  }

  async fetchNextSong(songID: number): Promise<SongResponseAttributes> {
    if (songID < 1)
      throw new BadRequestException(
        `The ID: '${songID}' is not valid, It must be >= 1!`,
      );

    let rawData = await safeQuery(() =>
      this.songModel.findByPk(songID + 1, {
        include: [
          { model: AlbumsModel, attributes: ['url_image'] },
          {
            model: ArtistsModel,
            attributes: ['name'],
            through: { attributes: [] },
          },
        ],
      }),
    );

    if (!rawData) {
      rawData = await this.songModel.findOne({
        order: [['id', 'ASC']],
        include: [
          { model: AlbumsModel, attributes: ['url_image'] },
          {
            model: ArtistsModel,
            attributes: ['name'],
            through: { attributes: [] },
          },
        ],
      });
    }

    if (!rawData)
      throw new NotFoundException(
        `The song with this id doesn't exist: ${songID}`,
      );

    return parseSongResponse(rawData.get({ plain: true }));
  }

  async fetchPreviousSong(songID: number): Promise<SongResponseAttributes> {
    if (songID < 1)
      throw new BadRequestException(
        `The ID: '${songID}' is not valid, It must be >= 1!`,
      );

    let rawData = await safeQuery(() =>
      this.songModel.findByPk(songID - 1, {
        include: [
          { model: AlbumsModel, attributes: ['url_image'] },
          {
            model: ArtistsModel,
            attributes: ['name'],
            through: { attributes: [] },
          },
        ],
      }),
    );

    if (!rawData) {
      rawData = await this.songModel.findOne({
        order: [['id', 'ASC']],
        include: [
          { model: AlbumsModel, attributes: ['url_image'] },
          {
            model: ArtistsModel,
            attributes: ['name'],
            through: { attributes: [] },
          },
        ],
      });
    }

    if (!rawData)
      throw new NotFoundException(
        `The song with this id doesn't exist: ${songID}`,
      );

    return parseSongResponse(rawData.get({ plain: true }));
  }
}
