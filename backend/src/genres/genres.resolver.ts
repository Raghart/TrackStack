import { Resolver, Query } from '@nestjs/graphql';
import { GenresService } from './genres.service';
import { GraphQLString } from 'graphql';

@Resolver()
export class GenresResolver {
  constructor(private readonly genreService: GenresService) {}

  @Query(() => [GraphQLString], { name: 'getAllGenres' })
  async getAllGenres(): Promise<string[]> {
    return this.genreService.getAllGenres();
  }
}
