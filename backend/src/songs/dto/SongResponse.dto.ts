import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SongResponseDto {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field(() => [String])
  artists: string[];

  @Field()
  url_preview: string;

  @Field()
  album_cover: string;
}
