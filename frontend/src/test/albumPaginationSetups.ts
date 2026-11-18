import { createCache } from "@/apolloClient";
import { getAlbums } from "@/queries/DetailQueries";
import { InMemoryCache } from "@apollo/client";
import type { AlbumResponse } from "@trackstack/schemas";

export const ALBUMS_PAGE_LIMIT = 20;

export type GetAlbumsData = {
    getAlbums: AlbumResponse[];
};

export const buildAlbums = (startId: number, count = ALBUMS_PAGE_LIMIT): AlbumResponse[] =>
    Array.from({ length: count }, (_, index) => {
        const id = startId + index;
        return {
            id,
            name: `Album ${id}`,
            album_cover: `https://example.com/albums/${id}.jpg`,
            artists: [`Artist ${id}`],
        };
    });

export const buildAlbumsPage = (page: number, count = ALBUMS_PAGE_LIMIT): AlbumResponse[] =>
    buildAlbums((page - 1) * ALBUMS_PAGE_LIMIT + 1, count);

export const albumIds = (albums: AlbumResponse[]): number[] => albums.map((album) => album.id);

vi.mock("@/config/env", () => ({
    getEnvHttpLink: () => "http://localhost:4000/graphql",
    getEnvWsLink: () => "ws://localhost:4000/graphql",
}));

type Cache = ReturnType<typeof createCache>;

type AlbumsQueryVariables = {
    seed: string;
    page: number;
    limit: number;
};

const DEFAULT_VARIABLES: AlbumsQueryVariables = {
    seed: "seed",
    page: 1,
    limit: ALBUMS_PAGE_LIMIT,
};

export const writeAlbumsPage = (
    cache: Cache,
    page: number,
    options: {
        seed?: string;
        limit?: number;
        count?: number;
        albums?: AlbumResponse[];
    } = {},
): AlbumResponse[] => {
    const limit = options.limit ?? ALBUMS_PAGE_LIMIT;
    const pageAlbums =
        options.albums ?? buildAlbums((page - 1) * limit + 1, options.count ?? limit);

    cache.writeQuery<GetAlbumsData>({
        query: getAlbums,
        variables: {
            seed: options.seed ?? DEFAULT_VARIABLES.seed,
            page,
            limit,
        },
        data: { getAlbums: pageAlbums },
    });

    return pageAlbums;
};

export const readAlbums = (
    cache: InMemoryCache,
    variables: AlbumsQueryVariables = DEFAULT_VARIABLES,
): AlbumResponse[] | undefined => {
    const result = cache.readQuery<GetAlbumsData>({ query: getAlbums, variables });
    return result?.getAlbums;
};

export const readAllAlbums = (cache: InMemoryCache): AlbumResponse[] => {
    const albums = readAlbums(cache);
    if (!albums) throw new Error("getAlbums has no cached data");
    return albums;
};
