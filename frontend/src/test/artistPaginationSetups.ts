import { createCache } from "@/apolloClient";
import { getAllArtists } from "@/queries/DetailQueries";
import { InMemoryCache } from "@apollo/client";
import type { ArtistResponse } from "@trackstack/schemas";

export const ARTISTS_PAGE_LIMIT = 20;

export type GetAllArtistsData = {
    getAllArtists: ArtistResponse[];
};

export const buildArtists = (startId: number, count = ARTISTS_PAGE_LIMIT): ArtistResponse[] =>
    Array.from({ length: count }, (_, index) => {
        const id = startId + index;
        return {
            id,
            name: `Artist ${id}`,
            album_cover: `https://example.com/artists/${id}.jpg`,
        };
    });

export const buildArtistsPage = (page: number, count = ARTISTS_PAGE_LIMIT): ArtistResponse[] =>
    buildArtists((page - 1) * ARTISTS_PAGE_LIMIT + 1, count);

export const artistIds = (artists: ArtistResponse[]): number[] =>
    artists.map((artist) => artist.id);

vi.mock("@/config/env", () => ({
    getEnvHttpLink: () => "http://localhost:4000/graphql",
    getEnvWsLink: () => "ws://localhost:4000/graphql",
}));

type Cache = ReturnType<typeof createCache>;

type ArtistsQueryVariables = {
    seed: string;
    page: number;
    limit: number;
};

const DEFAULT_VARIABLES: ArtistsQueryVariables = {
    seed: "seed",
    page: 1,
    limit: ARTISTS_PAGE_LIMIT,
};

export const writeArtistsPage = (
    cache: Cache,
    page: number,
    options: {
        seed?: string;
        limit?: number;
        count?: number;
        artists?: ArtistResponse[];
    } = {},
): ArtistResponse[] => {
    const limit = options.limit ?? ARTISTS_PAGE_LIMIT;
    const pageArtists =
        options.artists ?? buildArtists((page - 1) * limit + 1, options.count ?? limit);

    cache.writeQuery<GetAllArtistsData>({
        query: getAllArtists,
        variables: {
            seed: options.seed ?? DEFAULT_VARIABLES.seed,
            page,
            limit,
        },
        data: { getAllArtists: pageArtists },
    });

    return pageArtists;
};

export const readArtists = (
    cache: InMemoryCache,
    variables: ArtistsQueryVariables = DEFAULT_VARIABLES,
): ArtistResponse[] | undefined => {
    const result = cache.readQuery<GetAllArtistsData>({ query: getAllArtists, variables });
    return result?.getAllArtists;
};

export const readAllArtists = (cache: InMemoryCache): ArtistResponse[] => {
    const artists = readArtists(cache);
    if (!artists) throw new Error("getAllArtists has no cached data");
    return artists;
};