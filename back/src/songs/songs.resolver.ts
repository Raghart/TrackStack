import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';
import { SongsService } from './songs.service';
import { SongResponseDto } from '../../scripts/dto/SongResponse.dto';
import { FullSongResponseDto } from '../../scripts/dto/FullSongResponse.dto';

@Resolver()
export class SongsResolver {
  constructor(private readonly songsService: SongsService) {}

  @Query(() => Int, { name: 'getDBLength' })
  async getDBLength(): Promise<number> {
    return this.songsService.getDBLength();
  }

  @Query(() => [SongResponseDto], { name: 'getLandpageSongs' })
  async getLandpageSongs(
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
  ): Promise<SongResponseDto[]> {
    const results = await this.songsService.fetchLandpageSongs(limit);
    return this.songsService.parseSongList(results);
  }

  @Query(() => FullSongResponseDto, { name: 'getSongData' })
  async getSongData(
    @Args('SongID', { type: () => Int }) songID: number,
  ): Promise<FullSongResponseDto> {
    const result = await this.songsService.fetchFullSongData(songID);
    return this.songsService.parseFullSong(result);
  }

  @Query(() => [SongResponseDto], { name: 'getIARecommendations' })
  async getIARecommendations(
    @Args('genres', { type: () => [String], defaultValue: ['Rock'] })
    genres: string[],
    @Args('energy', { type: () => Float, defaultValue: 0.5 }) energy: number,
    @Args('speechLevel', { type: () => Float, defaultValue: 0.165 })
    speechLevel: number,
    @Args('danceability', { type: () => Float, defaultValue: 0.5 })
    danceability: number,
    @Args('duration', { type: () => Float, defaultValue: 2.5 })
    duration: number,
    @Args('sentiment', { type: () => Float, defaultValue: 0.5 })
    sentiment: number,
    @Args('voiceType', { type: () => Float, defaultValue: 0.05 })
    voiceType: number,
    @Args('mood', { type: () => Int, defaultValue: 1 }) mood: number,
    @Args('acousticness', { type: () => Float, defaultValue: 0.15 })
    acousticness: number,
  ): Promise<SongResponseDto[]> {
    const songData = await this.songsService.fetchIARecommendations(genres);

    const userVector = this.songsService.parseUserVector(
      energy,
      speechLevel,
      danceability,
      duration,
      sentiment,
      voiceType,
      mood,
      acousticness,
    );

    const songScores = this.songsService.getIARecommendations(
      songData,
      userVector,
    );
    const songList = songScores.map((entry) => entry.song);

    return this.songsService.parseSongList(songList);
  }

  @Query(() => SongResponseDto, { name: 'getRandomSong' })
  async getRandomSong() {
    const result = await this.songsService.fetchRandomSong();
    return this.songsService.parseSongResponse(result);
  }

  @Query(() => SongResponseDto, { name: 'getNextSong' })
  async getNextSong(
    @Args('songID', { type: () => Int }) songID: number,
  ): Promise<SongResponseDto> {
    const result = await this.songsService.fetchNextSong(songID);
    return this.songsService.parseSongResponse(result);
  }

  @Query(() => SongResponseDto, { name: 'getPreviousSong' })
  async getPreviousSong(
    @Args('songID', { type: () => Int }) songID: number,
  ): Promise<SongResponseDto> {
    const result = await this.songsService.fetchPreviousSong(songID);
    return this.songsService.parseSongResponse(result);
  }
}
