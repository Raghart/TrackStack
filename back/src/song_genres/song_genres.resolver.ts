import { Args, Resolver, Query, Int } from '@nestjs/graphql';
import { SongGenresService } from './song_genres.service';
import { SongResponseDto } from '../../scripts/dto/SongResponse.dto';

@Resolver()
export class SongGenresResolver {
  constructor(private readonly SongGenresService: SongGenresService) {}

  @Query(() => [SongResponseDto], { name: 'getAllGenreSongs' })
  async getAllGenreSongs(
    @Args('seed', { type: () => String }) seed: string,
    @Args('genre', { type: () => String }) genre: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
  ): Promise<SongResponseDto[]> {
    const results = await this.SongGenresService.fetchDBSongGenres(
      seed,
      genre,
      page,
      limit,
    );
    return this.SongGenresService.getAllGenreSongs(results);
  }
}
