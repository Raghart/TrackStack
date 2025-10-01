import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { ArtistsService } from './artists.service';
import { ArtistsResultsDto } from '../../scripts/dto/artistsResults.dto';
import { SongResponseDto } from '../../scripts/dto/SongResponse.dto';

@Resolver()
export class ArtistsResolver {
  constructor(private readonly ArtistService: ArtistsService) {}

  @Query(() => [ArtistsResultsDto], { name: 'getAllArtists' })
  async getAllArtists(
    @Args('seed', { type: () => String }) seed: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
  ): Promise<ArtistsResultsDto[]> {
    return this.ArtistService.getAllArtists(seed, page, limit);
  }

  @Query(() => [SongResponseDto], { name: 'getAllArtistSongs' })
  async getAllArtistSongs(
    @Args('artist', { type: () => String }) artist: string,
  ): Promise<SongResponseDto[]> {
    return this.ArtistService.getAllArtistSongs(artist);
  }
}
