import { Args, Query, Resolver } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { multipleSearchResultsDto } from './dto/multipleSearchDto';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => multipleSearchResultsDto, { name: 'multipleSearch' })
  async multipleSearch(
    @Args('query', { type: () => String }) query: string,
  ): Promise<multipleSearchResultsDto> {
    return this.searchService.multipleSearch(query);
  }
}
