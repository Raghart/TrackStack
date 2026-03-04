import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AlbumsService } from './albums.service';
import { GraphQLString } from 'graphql';
import { SongResponseDto } from 'src/songs/dto/SongResponse.dto';
import { AlbumsResultsDto } from './dto/AlbumResultsDto';
import { AlbumResponse } from 'src/types/albumAttributes';

@Resolver()
export class AlbumsResolver {
  constructor(private readonly albumsService: AlbumsService) {}

  @Query(() => [AlbumsResultsDto], { name: 'getAlbums' })
  async getAlbums(
    @Args('seed', { type: () => GraphQLString }) seed: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
  ) : Promise<AlbumsResultsDto[]> {
    return this.albumsService.getAlbums(seed, page, limit);
  }

  @Query(() => [SongResponseDto], { name: 'getAllAlbumSongs' })
  async getAllAlbumSongs(
    @Args('album', { type: () => GraphQLString }) album: string,
  ): Promise<SongResponseDto[]> {
    return this.albumsService.getAllAlbumSongs(album);
  }
}
