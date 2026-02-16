import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class albumsSearchDto {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field(() => [String])
  artists: string[];

  @Field()
  album_cover: string;

  @Field(() => String)
  type: 'album';
}
