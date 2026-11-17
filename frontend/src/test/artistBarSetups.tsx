import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import useArtistBar from "@/components/Utils/hooks/useArtistBar";

const hoisted = vi.hoisted(() => ({
    mockUseQuery: vi.fn(),
    mockUseBreakpointValue: vi.fn(),
}));

export const { mockUseQuery, mockUseBreakpointValue } = hoisted;

vi.mock("@apollo/client", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@apollo/client")>();
    return {
        ...actual,
        useQuery: (...args: unknown[]) => hoisted.mockUseQuery(...args),
    };
});

vi.mock("@chakra-ui/react", () => ({
    useBreakpointValue: (...args: unknown[]) => hoisted.mockUseBreakpointValue(...args),
}));

export type ArtistBarQueryResult = {
    loading?: boolean;
    data?: Record<string, unknown> | null;
    previousData?: Record<string, unknown> | null;
    error?: unknown;
};

export type ArtistBarQueryOptions = {
    variables?: { seed?: unknown; page?: unknown; limit?: unknown };
    skip?: boolean;
    fetchPolicy?: string;
};

export const mockBreakpointLimit = (limit: number | undefined) => {
    hoisted.mockUseBreakpointValue.mockReturnValue(limit);
};

export const mockQueryResult = (result: ArtistBarQueryResult) => {
    hoisted.mockUseQuery.mockReturnValue({
        loading: false,
        data: undefined,
        previousData: undefined,
        error: undefined,
        ...result,
    });
};

export const resetArtistBarMocks = () => {
    hoisted.mockUseQuery.mockReset();
    hoisted.mockUseBreakpointValue.mockReset();
    hoisted.mockUseBreakpointValue.mockReturnValue(10);
    hoisted.mockUseQuery.mockReturnValue({
        loading: false,
        data: undefined,
        previousData: undefined,
        error: undefined,
    });
};

export const getLastQuery = () => {
    const query = hoisted.mockUseQuery.mock.calls.at(-1)?.[0];
    if (!query) throw new Error("useQuery was not called with a document");
    return query;
};

export const getQueryOptions = (): ArtistBarQueryOptions => {
    const options = hoisted.mockUseQuery.mock.calls.at(-1)?.[1];
    if (!options) throw new Error("useQuery was not called with options");
    return options;
};

export const getQueryOptionsHistory = (): ArtistBarQueryOptions[] =>
    hoisted.mockUseQuery.mock.calls.map((call) => call[1] as ArtistBarQueryOptions);

export const renderArtistBar = () => renderHook(() => useArtistBar());

export const artists = [
    {
        id: 1,
        name: "Radiohead",
        album_cover: "https://example.com/radiohead.jpg",
    },
    {
        id: 2,
        name: "Massive Attack",
        album_cover: "https://example.com/massive-attack.jpg",
    },
];

export const validArtist = artists[0];

export const invalidArtists = [
    { label: "a missing name", payload: { ...validArtist, name: undefined } },
    { label: "an empty name", payload: { ...validArtist, name: "   " } },
    { label: "an oversized name", payload: { ...validArtist, name: "a".repeat(2049) } },
    { label: "a missing ID", payload: { ...validArtist, id: undefined } },
    { label: "a zero ID", payload: { ...validArtist, id: 0 } },
    { label: "a negative ID", payload: { ...validArtist, id: -1 } },
    { label: "a non-integer ID", payload: { ...validArtist, id: 1.5 } },
    { label: "a non-numeric ID", payload: { ...validArtist, id: "not-a-number" } },
    { label: "a non-finite ID", payload: { ...validArtist, id: Number.POSITIVE_INFINITY } },
    { label: "a javascript: cover URL", payload: { ...validArtist, album_cover: "javascript:alert(1)" } },
    { label: "a relative cover URL", payload: { ...validArtist, album_cover: "/images/radiohead.jpg" } },
    { label: "a cover URL without a host", payload: { ...validArtist, album_cover: "https://" } },
    { label: "a missing cover", payload: { ...validArtist, album_cover: undefined } },
    { label: "a null artist", payload: null },
];
