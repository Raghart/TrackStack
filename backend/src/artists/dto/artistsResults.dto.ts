import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ArtistsResultsDto {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  album_cover: string;
}
