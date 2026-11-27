import { createCache } from "@/apolloClient";
import { getAllGenreSongs } from "@/queries/DetailQueries";
import { InMemoryCache } from "@apollo/client";
import type { SongResponse } from "@trackstack/schemas";

export const GENRE_SONGS_PAGE_LIMIT = 2;

export const DEFAULT_GENRE = "Alternative Rock";

export type GetAllGenreSongsData = {
    getAllGenreSongs: SongResponse[];
};

export const buildGenreSongs = (startId: number, count = GENRE_SONGS_PAGE_LIMIT): SongResponse[] =>
    Array.from({ length: count }, (_, index) => {
        const id = startId + index;
        return {
            id,
            name: `Song ${id}`,
            artists: [`Artist ${id}`],
            album_cover: `https://example.com/songs/${id}.jpg`,
            url_preview: `https://example.com/songs/${id}.mp3`,
        };
    });

export const buildGenreSongsPage = (page: number, count = GENRE_SONGS_PAGE_LIMIT): SongResponse[] =>
    buildGenreSongs((page - 1) * GENRE_SONGS_PAGE_LIMIT + 1, count);

export const genreSongIds = (songs: SongResponse[]): number[] => songs.map((song) => song.id);

vi.mock("@/config/env", () => ({
    getEnvHttpLink: () => "http://localhost:4000/graphql",
    getEnvWsLink: () => "ws://localhost:4000/graphql",
}));

type Cache = ReturnType<typeof createCache>;

type GenreSongsQueryVariables = {
    seed: string;
    genre: string;
    page: number;
    limit: number;
};

const DEFAULT_VARIABLES: GenreSongsQueryVariables = {
    seed: "seed",
    genre: DEFAULT_GENRE,
    page: 1,
    limit: GENRE_SONGS_PAGE_LIMIT,
};

export const writeGenreSongsPage = (
    cache: Cache,
    page: number,
    options: {
        seed?: string;
        genre?: string;
        limit?: number;
        count?: number;
        songs?: SongResponse[];
    } = {},
): SongResponse[] => {
    const limit = options.limit ?? GENRE_SONGS_PAGE_LIMIT;
    const pageSongs =
        options.songs ?? buildGenreSongs((page - 1) * limit + 1, options.count ?? limit);

    cache.writeQuery<GetAllGenreSongsData>({
        query: getAllGenreSongs,
        variables: {
            seed: options.seed ?? DEFAULT_VARIABLES.seed,
            genre: options.genre ?? DEFAULT_VARIABLES.genre,
            page,
            limit,
        },
        data: { getAllGenreSongs: pageSongs },
    });

    return pageSongs;
};

export const readGenreSongs = (
    cache: InMemoryCache,
    variables: Partial<GenreSongsQueryVariables> = {},
): SongResponse[] | undefined => {
    const result = cache.readQuery<GetAllGenreSongsData>({
        query: getAllGenreSongs,
        variables: { ...DEFAULT_VARIABLES, ...variables },
    });
    return result?.getAllGenreSongs;
};

export const readAllGenreSongs = (
    cache: InMemoryCache,
    genre: string = DEFAULT_GENRE,
): SongResponse[] => {
    const songs = readGenreSongs(cache, { genre });
    if (!songs) throw new Error("getAllGenreSongs has no cached data");
    return songs;
};
