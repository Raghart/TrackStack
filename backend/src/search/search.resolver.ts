import { Args, Query, Resolver } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { multipleSearchResultsDto } from './dto/multipleSearchDto';
import { artistsSearchDto } from './dto/artistsSearchDto';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => multipleSearchResultsDto, { name: 'multipleSearch' })
  async multipleSearch(
    @Args('query', { type: () => String }) query: string,
  ): Promise<multipleSearchResultsDto> {
    return this.searchService.multipleSearch(query);
  }

  @Query(() => artistsSearchDto, { name: "artistSearch" })
  async artistSearch(
    @Args('query', { type: () => String }) query: string,
  ) : Promise<artistsSearchDto[]> {
    return await this.searchService.searchArtists(query);
  };
}
