import { Args, Query, Resolver } from '@nestjs/graphql';
import { AlbumsService } from './albums.service';
import { GraphQLString } from 'graphql';
import { SongResponseDto } from '../../scripts/dto/SongResponse.dto';

@Resolver()
export class AlbumsResolver {
  constructor(private readonly albumsService: AlbumsService) {}

  @Query(() => [SongResponseDto], { name: 'getAllAlbumSongs' })
  async getAllAlbumSongs(
    @Args('album', { type: () => GraphQLString }) album: string,
  ): Promise<SongResponseDto[]> {
    const results = await this.albumsService.fetchDBAlbumSongs(album);
    return this.albumsService.getAllAlbumSongs(results);
  }
}
