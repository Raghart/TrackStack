import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AlbumsResultsDto {
    @Field()
    id: number;

    @Field()
    name: string;

    @Field()
    url_image: string;

    @Field(() => [String])
    artists: string[];
}