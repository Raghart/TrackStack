import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class artistsSearchDto {
    @Field()
    id: number;

    @Field()
    name: string;

    @Field()
    album_cover: string;

    @Field(() => String)
    type: "artist";
};