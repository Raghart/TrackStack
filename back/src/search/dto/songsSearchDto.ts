import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class searchSongsDto {
    @Field()
    id: number;

    @Field()
    name: string;

    @Field(() => [String])
    artists: string[];

    @Field()
    album: string;

    @Field()
    album_cover: string;

    @Field()
    url_preview: string;

    @Field(() => String)
    type: "song";
};