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
    return this.songsService.getLandpageSongs(limit);
  }

  @Query(() => FullSongResponseDto, { name: 'getSongData' })
  async getSongData(
    @Args('SongID', { type: () => Int }) SongID: number,
  ): Promise<FullSongResponseDto> {
    return this.songsService.getSongData(SongID);
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
    return this.songsService.getIARecommendations(
      genres,
      energy,
      speechLevel,
      danceability,
      duration,
      sentiment,
      voiceType,
      mood,
      acousticness,
    );
  }

  @Query(() => SongResponseDto, { name: 'getRandomSong' })
  async getRandomSong() {
    return this.songsService.getRandomSong();
  }

  @Query(() => SongResponseDto, { name: 'getNextSong' })
  async getNextSong(
    @Args('songID', { type: () => Int }) songID: number,
  ): Promise<SongResponseDto> {
    return this.songsService.getNextSong(songID);
  }

  @Query(() => SongResponseDto, { name: 'getPreviousSong' })
  async getPreviousSong(
    @Args('songID', { type: () => Int }) songID: number,
  ): Promise<SongResponseDto> {
    return this.songsService.getPreviousSong(songID);
  }
}
