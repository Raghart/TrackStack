import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import useGenreSongs from "@/hooks/useGenreSongs";
import useGetAlbumCards from "@/hooks/useGetAlbumCards";

const hoisted = vi.hoisted(() => ({
    mockUseQuery: vi.fn(),
    mockFetchMore: vi.fn(),
    mockToasterCreate: vi.fn(),
}));

export const { mockUseQuery, mockFetchMore, mockToasterCreate } = hoisted;

vi.mock("@apollo/client", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@apollo/client")>();
    return {
        ...actual,
        useQuery: (...args: unknown[]) => hoisted.mockUseQuery(...args),
    };
});

vi.mock("@/components/ui/toasterInstance", () => ({
    toaster: { create: hoisted.mockToasterCreate },
}));

export type PaginatedQueryResult = {
    loading?: boolean;
    data?: Record<string, unknown> | null;
    error?: unknown;
};

export type PaginatedQueryOptions = {
    variables?: { seed?: unknown; genre?: unknown; page?: unknown; limit?: unknown };
    notifyOnNetworkStatusChange?: boolean;
};

export const mockQueryResult = (result: PaginatedQueryResult) => {
    hoisted.mockUseQuery.mockReturnValue({
        loading: false,
        data: undefined,
        error: undefined,
        fetchMore: hoisted.mockFetchMore,
        ...result,
    });
};

export const resetQueryMock = () => {
    hoisted.mockUseQuery.mockReset();
    hoisted.mockFetchMore.mockReset();
    hoisted.mockToasterCreate.mockReset();
    hoisted.mockUseQuery.mockReturnValue({
        loading: false,
        data: undefined,
        error: undefined,
        fetchMore: hoisted.mockFetchMore,
    });
};

export const getLastQuery = () => {
    const query = hoisted.mockUseQuery.mock.calls.at(-1)?.[0];
    if (!query) throw new Error("useQuery was not called with a document");
    return query;
};

export const getQueryOptions = (): PaginatedQueryOptions => {
    const options = hoisted.mockUseQuery.mock.calls.at(-1)?.[1];
    if (!options) throw new Error("useQuery was not called with options");
    return options;
};

export const renderGenreSongs = (genre: string) =>
    renderHook(({ genre }: { genre: string }) => useGenreSongs(genre), {
        initialProps: { genre },
    });

export const renderAlbumCards = () => renderHook(() => useGetAlbumCards());

export const genreSongs = [
    {
        id: 1,
        name: "Nude",
        artists: ["Radiohead"],
        album_cover: "https://example.com/in-rainbows.jpg",
        url_preview: "https://example.com/nude.mp3",
    },
    {
        id: 2,
        name: "Weird Fishes",
        artists: ["Radiohead"],
        album_cover: "https://example.com/in-rainbows.jpg",
        url_preview: "https://example.com/weird-fishes.mp3",
    },
];

export const validGenreSong = genreSongs[0];

export const invalidGenreSongs = [
    { label: "a missing name", payload: { ...validGenreSong, name: undefined } },
    { label: "an empty name", payload: { ...validGenreSong, name: "   " } },
    { label: "an oversized name", payload: { ...validGenreSong, name: "a".repeat(2049) } },
    { label: "a non-numeric ID", payload: { ...validGenreSong, id: "not-a-number" } },
    { label: "a non-finite ID", payload: { ...validGenreSong, id: Number.POSITIVE_INFINITY } },
    { label: "artists as a string", payload: { ...validGenreSong, artists: "Radiohead" } },
    { label: "an empty artist entry", payload: { ...validGenreSong, artists: [""] } },
    { label: "a javascript: preview URL", payload: { ...validGenreSong, url_preview: "javascript:alert(1)" } },
    { label: "a relative cover URL", payload: { ...validGenreSong, album_cover: "/images/in-rainbows.jpg" } },
    { label: "a cover URL without a host", payload: { ...validGenreSong, album_cover: "https://" } },
    { label: "a null song", payload: null },
];

export const albums = [
    {
        id: 10,
        name: "In Rainbows",
        album_cover: "https://example.com/in-rainbows.jpg",
        artists: ["Radiohead"],
    },
    {
        id: 11,
        name: "Amnesiac",
        album_cover: "https://example.com/amnesiac.jpg",
        artists: ["Radiohead"],
    },
];

export const validAlbum = albums[0];

export const invalidAlbums = [
    { label: "a missing name", payload: { ...validAlbum, name: undefined } },
    { label: "an empty name", payload: { ...validAlbum, name: "   " } },
    { label: "an oversized name", payload: { ...validAlbum, name: "a".repeat(2049) } },
    { label: "a missing ID", payload: { ...validAlbum, id: undefined } },
    { label: "a zero ID", payload: { ...validAlbum, id: 0 } },
    { label: "a non-integer ID", payload: { ...validAlbum, id: 1.5 } },
    { label: "a non-numeric ID", payload: { ...validAlbum, id: "not-a-number" } },
    { label: "artists as a string", payload: { ...validAlbum, artists: "Radiohead" } },
    { label: "an empty artist entry", payload: { ...validAlbum, artists: [""] } },
    { label: "a javascript: cover URL", payload: { ...validAlbum, album_cover: "javascript:alert(1)" } },
    { label: "a relative cover URL", payload: { ...validAlbum, album_cover: "/images/in-rainbows.jpg" } },
    { label: "a null album", payload: null },
];
