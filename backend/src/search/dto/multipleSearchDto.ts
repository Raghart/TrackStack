import { Field, ObjectType } from '@nestjs/graphql';
import { artistsSearchDto } from './artistsSearchDto';
import { albumsSearchDto } from './albumsSearchDto';
import { searchSongsDto } from './songsSearchDto';

@ObjectType()
export class multipleSearchResultsDto {
  @Field(() => [artistsSearchDto])
  artistResults: artistsSearchDto[];

  @Field(() => [albumsSearchDto])
  albumResults: albumsSearchDto[];

  @Field(() => [searchSongsDto])
  songResults: searchSongsDto[];
}
