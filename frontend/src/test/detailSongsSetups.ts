import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import useGetDetailSongs from "@/hooks/useGetDetailSongs";
import type { ValidDetail } from "@/types/utilTypes";

const hoisted = vi.hoisted(() => ({
    mockUseQuery: vi.fn(),
}));

export const { mockUseQuery } = hoisted;

vi.mock("@apollo/client", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@apollo/client")>();
    return {
        ...actual,
        useQuery: (...args: unknown[]) => {
            const result = hoisted.mockUseQuery(...args);
            const options = args[1] as { skip?: boolean } | undefined;
            return options?.skip ? { ...result, data: undefined } : result;
        },
    };
});

export type DetailQueryOptions = {
    skip?: boolean;
    variables?: { album?: unknown; artist?: unknown };
};

export type DetailQueryResult = {
    loading: boolean;
    data?: Record<string, unknown> | null;
};

export const mockQueryResult = (result: DetailQueryResult) => {
    hoisted.mockUseQuery.mockReturnValue(result);
};

export const resetQueryMock = () => {
    hoisted.mockUseQuery.mockReset();
    hoisted.mockUseQuery.mockReturnValue({ loading: false, data: undefined });
};

export const getQueryOptions = (): DetailQueryOptions => {
    const options = hoisted.mockUseQuery.mock.calls.at(-1)?.[1];
    if (!options) throw new Error("useQuery was not called with options");
    return options;
};

export const getLastQuery = () => {
    const query = hoisted.mockUseQuery.mock.calls.at(-1)?.[0];
    if (!query) throw new Error("useQuery was not called with a document");
    return query;
};

export type DetailHookProps = {
    type: ValidDetail;
    filterValue: string;
};

export const renderDetailSongs = (props: DetailHookProps) =>
    renderHook(
        ({ type, filterValue }: DetailHookProps) => useGetDetailSongs(type, filterValue),
        { initialProps: props },
    );

export const albumSongs = [
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

export const artistSongs = [
    {
        id: 3,
        name: "Pyramid Song",
        artists: ["Radiohead"],
        album_cover: "https://example.com/amnesiac.jpg",
        url_preview: "https://example.com/pyramid-song.mp3",
    },
    {
        id: 4,
        name: "There There",
        artists: ["Radiohead"],
        album_cover: "https://example.com/hail-to-the-thief.jpg",
        url_preview: "https://example.com/there-there.mp3",
    },
];

export const validDetailSong = albumSongs[0];

export const invalidSongs = [
    {
        label: "a missing name",
        payload: { ...validDetailSong, name: undefined },
    },
    {
        label: "an empty name",
        payload: { ...validDetailSong, name: "   " },
    },
    {
        label: "an oversized name",
        payload: { ...validDetailSong, name: "a".repeat(2049) },
    },
    {
        label: "a non-numeric ID",
        payload: { ...validDetailSong, id: "not-a-number" },
    },
    {
        label: "a non-finite ID",
        payload: { ...validDetailSong, id: Number.POSITIVE_INFINITY },
    },
    {
        label: "artists as a string",
        payload: { ...validDetailSong, artists: "Radiohead" },
    },
    {
        label: "an empty artist entry",
        payload: { ...validDetailSong, artists: [""] },
    },
    {
        label: "a javascript: preview URL",
        payload: { ...validDetailSong, url_preview: "javascript:alert(1)" },
    },
    {
        label: "a relative cover URL",
        payload: { ...validDetailSong, album_cover: "/images/in-rainbows.jpg" },
    },
    {
        label: "a cover URL without a host",
        payload: { ...validDetailSong, album_cover: "https://" },
    },
    {
        label: "a null song",
        payload: null,
    },
];
