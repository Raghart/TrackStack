import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FullSongResponseDto {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field(() => [String])
  artists: string[];

  @Field(() => [String])
  genres: string[];

  @Field()
  album: string;

  @Field()
  album_cover: string;

  @Field()
  year: number;

  @Field()
  duration: number;

  @Field()
  spotify_id: string;

  @Field()
  url_preview: string;
}
