import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class multipleSearchResultsDto {
    @Field(() => artistsSearchDto)
    exactArtist: artistsSearchDto;

    @Field(() => albumsSearchDto)
    exactAlbum: albumsSearchDto;

    @Field(() => searchSongsDto)
    exactSong: searchSongsDto;

    @Field(() => [artistsSearchDto])
    artistResults: artistsSearchDto[];

    @Field(() => [albumsSearchDto])
    albumResults: albumsSearchDto[];

    @Field(() => [searchSongsDto])
    songResults: searchSongsDto[];
};

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
    type: "album";
};

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