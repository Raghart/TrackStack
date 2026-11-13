import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { GenresModel } from '../../models/genres/genres.model';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { existsSync } from 'node:fs';
import {
  FullRawSong,
  fullRawSongSchema,
  FullSongResponse,
  fullSongResponseSchema,
  SongRawData,
  songRawRecommendationSchema,
  songRawSchema,
  SongResponse,
  songResponseSchema,
  stringSchema,
} from '@trackstack/schemas';
import safeQuery from '@/utils/safeQuery';
import { InvalidPaginationException } from '@/utils/PaginationError';
import parseGenres from '@/utils/parseGenres';
if (existsSync('.env')) process.loadEnvFile();

@Injectable()
export class SongsService {
  constructor(
    @InjectModel(SongsModel) private songModel: typeof SongsModel,
    @Inject('AI') private readonly genai: GoogleGenAI,
  ) {}

  async getDBLength(): Promise<number> {
    return await safeQuery(() => this.songModel.count());
  }

  async fetchLandpageSongs(limit = 20): Promise<SongRawData[]> {
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
      songRawSchema.parse(entry.get({ plain: true })),
    );
  }

  async getLandpageSongs(limit: number): Promise<SongResponse[]> {
    const songData = await this.fetchLandpageSongs(limit);
    return this.parseSongList(songData);
  }

  parseSongList(songData: SongRawData[]): SongResponse[] {
    return songData.map((song) => songResponseSchema.parse({
      id: song.id,
      name: song.name,
      artists: song.artists.map((a) => a.name),
      url_preview: song.url_preview,
      album_cover: song.album.url_image,
    }));
  }

  async fetchFullSongData(songID: number): Promise<FullRawSong> {
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

    if (!rawData)
      throw new NotFoundException(
        `The song with the ID: '${songID}' doesn't exist in the database!`,
      );

    return fullRawSongSchema.parse(rawData.get({ plain: true }));
  }

  parseFullSong(songData: FullRawSong): FullSongResponse {
    return fullSongResponseSchema.parse({
      id: songData.id,
      name: songData.name,
      artists: songData.artists.map((artist) => artist.name),
      genres: songData.genres.map((g) => g.genre),
      album: songData.album.name,
      album_cover: songData.album.url_image,
      duration: songData.duration,
      year: songData.year,
      spotify_id: songData.spotify_id,
      url_preview: songData.url_preview,
    });
  }

  async getSongData(songID: number) {
    const songData = await this.fetchFullSongData(songID);
    return this.parseFullSong(songData);
  }

  buildUVString(userVector: number[]): string[] {
    const userDataTitle = new Map<number, string>([
      [0, 'Danceability'],
      [1, 'Energy'],
      [2, 'Mode'],
      [3, 'Speechiness'],
      [4, 'Acousticness'],
      [5, 'Instrumentalness'],
      [6, 'Valence'],
      [7, 'Tempo'],
    ]);

    return userVector.map(
      (value, idx) => `${userDataTitle.get(idx)}: ${value}`,
    );
  }

  async getAIStream(
    genres: string[],
    userVector: number[],
  ): Promise<AsyncGenerator<GenerateContentResponse>> {
    const formattedUV = this.buildUVString(userVector);

    try {
      return await this.genai.models.generateContentStream({
        model: stringSchema.parse(process.env.AI_MODEL),
        contents: [
          'Generate a message for an user who wants to listen to songs with the following metadata:',
          `Genres: ${genres.join(',')}`,
          `UserVector: ${formattedUV.join(', ')}`,
        ].join('\n'),
        config: {
          systemInstruction: [
            'You are a professional AI music expert',
            "I'm passing you the genres and song characteristics a user wants to listen",
            'Be enthusiastic, professional and brief.',
            'Your answers must be no more than 3 lines',
            "Don't use emojis and focus on the provided data",
            'Always answer using the Markdown format. Use bold to enhance important words',
            'Replace technical music terms with more friendly user terms',
            'Add just 1 technical music term to let the user know you selected these tracks because of this value',
            'Never include headers, lists, links or image',
            'The userVector data will be in a 0 to 1 scale',
            'With 0 being the lowest to 1 being the highest',
          ].join('\n'),
        },
      });
    } catch (error) {
      console.error(`error while trying to get the answer: ${error}`);
      throw new ServiceUnavailableException(
        'Unable to get an answer from the model',
      );
    }
  }

  async getSongRecommendations(
    genres: string[],
    userVector: number[],
    limit: number,
  ): Promise<SongResponse[]> {
    const parsedVector = `[${userVector.join(', ')}]`;
    const genresParsed = parseGenres(genres);
    const rawSongData = await this.songModel.sequelize?.query(
      `SELECT *
      FROM search_songs_cosine_similarity(ARRAY[:genres]::text[], :userVector::vector, :limit::int);`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          genres: genresParsed,
          userVector: [parsedVector],
          limit,
        },
      },
    );

    const parsedData = songRawRecommendationSchema.array().parse(rawSongData);

    return parsedData.map((songData) => songResponseSchema.parse({
      id: songData.id,
      name: songData.name,
      artists: songData.artists.split(','),
      url_preview: songData.url_preview,
      album_cover: songData.album_cover,
    }));
  }

  async fetchRandomSong(): Promise<SongRawData> {
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
    return songRawSchema.parse(result?.get({ plain: true }));
  }

  async getRandomSong() {
    const randomSong = await this.fetchRandomSong();
    return this.parseSongData(randomSong);
  }

  parseSongData(songData: SongRawData): SongResponse {
    return songResponseSchema.parse({
      id: songData.id,
      name: songData.name,
      artists: songData.artists.map((artist) => stringSchema.parse(artist.name)),
      album_cover: stringSchema.parse(songData.album.url_image),
      url_preview: songData.url_preview,
    });
  }

  async fetchNextSong(songID: number): Promise<SongRawData> {
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
      throw new ServiceUnavailableException(
        "It couldn't retrieve the song from the database",
      );

    return songRawSchema.parse(rawData.get({ plain: true }));
  }

  async getNextSong(songId: number): Promise<SongResponse> {
    const songData = await this.fetchNextSong(songId);
    return this.parseSongData(songData);
  }

  async fetchPreviousSong(songID: number): Promise<SongRawData> {
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
      throw new ServiceUnavailableException(
        "It couldn't retrieve the song from the database",
      );

    return songRawSchema.parse(rawData.get({ plain: true }));
  }

  async getPreviousSong(songID: number) {
    const songData = await this.fetchPreviousSong(songID);
    return this.parseSongData(songData);
  }
}
