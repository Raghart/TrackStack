import { Args, Query, Resolver } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { multipleSearchResultsDto } from './dto/multipleSearchDto';
import { artistsSearchDto } from './dto/artistsSearchDto';
import { albumsSearchDto } from './dto/albumsSearchDto';
import { searchSongsDto } from './dto/songsSearchDto';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => multipleSearchResultsDto, { name: 'multipleSearch' })
  async multipleSearch(
    @Args('query', { type: () => String }) query: string,
  ): Promise<multipleSearchResultsDto> {
    return this.searchService.multipleSearch(query);
  }

  @Query(() => [artistsSearchDto], { name: "artistSearch" })
  async artistSearch(
    @Args('query', { type: () => String }) query: string,
  ) : Promise<artistsSearchDto[]> {
    return this.searchService.searchArtists(query);
  };

  @Query(() => [albumsSearchDto], { name: "albumsSearch" })
  async albumSearch(
    @Args("query", { type: () => String }) query: string,
  ) : Promise<albumsSearchDto[]> {
    return this.searchService.searchAlbums(query);
  }

  @Query(() => [searchSongsDto], { name: "songsSearch" })
  async songSearch(
    @Args("query", { type: () => String }) query: string,
  ) : Promise<searchSongsDto[]> {
    return this.searchService.seachSongs(query);
  }
}
