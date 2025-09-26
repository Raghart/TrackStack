import { Args, Query, Resolver } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { multipleSearchResultsDto } from '../../scripts/dto/multipleSearchDto';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => String, { name: 'ping' })
  async ping() {
    await this.searchService.ping();
    return 'Elastic Search is working!';
  }

  @Query(() => multipleSearchResultsDto, { name: 'multipleSearch' })
  async multipleSearch(
    @Args('query', { type: () => String }) query: string,
  ): Promise<multipleSearchResultsDto> {
    return this.searchService.multipleSearch(query);
  }
}
