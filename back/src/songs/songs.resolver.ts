import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';
import { SongsService } from './songs.service';
import { SongResponseDto } from '../../scripts/dto/SongResponse.dto';
import { FullSongResponseDto } from '../../scripts/dto/FullSongResponse.dto';
import { USER_VECTOR } from '../../test/constants/constants';

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
    @Args('SongID', { type: () => Int }) songID: number,
  ): Promise<FullSongResponseDto> {
    return this.songsService.getSongData(songID);
  }

  @Query(() => [SongResponseDto], { name: 'getIARecommendations' })
  async getIARecommendations(
    @Args('genres', { type: () => [String], defaultValue: ['Rock'] })
    genres: string[],
    @Args('userVector', { type: () => [Float], defaultValue: USER_VECTOR })
    userVector: number[],
  ): Promise<SongResponseDto[]> {
    return this.songsService.getIARecommendations(genres, userVector);
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
