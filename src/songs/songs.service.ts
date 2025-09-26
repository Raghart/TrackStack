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
import { FullSongResponse, SongResponse } from 'src/types/songAttributes';
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

  async getLandpageSongs(limit = 20): Promise<SongResponse[]> {
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

    return rawData.map((entry) => {
      const song = parseSongResponse(entry.get({ plain: true }));
      return {
        id: song.id,
        name: song.name,
        artists: parseStringArray(song.artists.map((a) => a.name)),
        url_preview: song.url_preview,
        album_cover: parseString(song.album.url_image),
      };
    });
  }

  async getSongData(songID: number): Promise<FullSongResponse> {
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

    const data = parseFullSongResponse(rawData.get({ plain: true }));
    return {
      id: data.id,
      name: data.name,
      artists: parseStringArray(data.artists.map((artist) => artist.name)),
      genres: parseStringArray(data.genres.map((g) => g.genre)),
      album: parseString(data.album.name),
      album_cover: parseString(data.album.url_image),
      duration: data.duration,
      year: data.year,
      spotify_id: data.spotify_id,
      url_preview: data.url_preview,
    };
  }

  async getIARecommendations(
    genres: string[] = [],
    energy: number = 0.5,
    speechLevel: number = 0.165,
    danceability: number = 0.5,
    duration: number = 2.5,
    sentiment: number = 0.5,
    voiceType: number = 0.05,
    mood: number = 1,
    acousticness: number = 0.15,
  ): Promise<SongResponse[]> {
    const rawSongData = await safeQuery(() =>
      this.songModel.findAll({
        attributes: ['id', 'name', 'url_preview', 'duration'],
        limit: 100,
        order: Sequelize.literal('RANDOM()'),
        include: [
          {
            model: GenresModel,
            ...(genres.length > 0
              ? { where: { genre: { [Op.in]: genres } } }
              : {}),
            through: { attributes: [] },
          },
          { model: AlbumsModel, attributes: ['url_image'] },
          {
            model: ArtistsModel,
            attributes: ['name'],
            through: { attributes: [] },
          },
          { model: SongDetailsModel },
        ],
      }),
    );

    const songData = rawSongData.map((entry) =>
      parseIASongData(entry.get({ plain: true })),
    );
    const userVector: number[] = parseNumberArray([
      energy,
      speechLevel,
      danceability,
      duration,
      sentiment,
      voiceType,
      mood,
      acousticness,
    ]);

    const songScores = songData
      .map((song) => ({
        id: song.id,
        song,
        score: getCosineSimilarity(buildSongVector(song), userVector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);

    return songScores.map(({ song }) => ({
      id: song.id,
      name: song.name,
      artists: parseStringArray(song.artists.map((artist) => artist.name)),
      url_preview: song.url_preview,
      album_cover: parseString(song.album.url_image),
    }));
  }

  async getRandomSong(): Promise<SongResponse> {
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
    const randomSong = parseSongResponse(result?.get({ plain: true }));

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

  async getNextSong(songID: number): Promise<SongResponse> {
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

    const song = parseSongResponse(rawData.get({ plain: true }));
    return {
      id: song.id,
      name: song.name,
      artists: parseStringArray(song.artists.map((artist) => artist.name)),
      album_cover: parseString(song.album.url_image),
      url_preview: song.url_preview,
    };
  }

  async getPreviousSong(songID: number): Promise<SongResponse> {
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

    const song = parseSongResponse(rawData.get({ plain: true }));
    return {
      id: song.id,
      name: song.name,
      artists: parseStringArray(song.artists.map((artist) => artist.name)),
      album_cover: parseString(song.album.url_image),
      url_preview: song.url_preview,
    };
  }
}
