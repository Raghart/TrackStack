import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AlbumsResultsDto {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  album_cover: string;

  @Field(() => [String])
  artists: string[];
}
