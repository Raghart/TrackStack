import { act } from "@testing-library/react";
import { vi } from "vitest";
import { getAlbums } from "@/queries/DetailQueries";
import {
    albums,
    getLastQuery,
    getQueryOptions,
    invalidAlbums,
    mockFetchMore,
    mockQueryResult,
    renderAlbumCards,
    resetQueryMock,
} from "@/test/detailPaginationSetups";

describe("useGetAlbumCards", () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        resetQueryMock();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        vi.restoreAllMocks();
    });

    it("queries the albums with the expected document and initial variables", () => {
        mockQueryResult({ loading: true });

        renderAlbumCards();

        expect(getLastQuery()).toBe(getAlbums);
        expect(getQueryOptions().variables).toEqual({
            seed: expect.stringMatching(/^\d+$/),
            page: 1,
            limit: 20,
        });
        expect(getQueryOptions().notifyOnNetworkStatusChange).toBe(true);
    });

    it("derives the seed from Math.random without the decimal prefix", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.987654321);
        mockQueryResult({ loading: true });

        renderAlbumCards();

        expect(getQueryOptions().variables?.seed).toBe("987654321");
    });

    it("keeps the seed stable across re-renders", () => {
        mockQueryResult({ loading: true });
        const { rerender } = renderAlbumCards();
        const seed = getQueryOptions().variables?.seed;

        rerender();
        rerender();

        expect(getQueryOptions().variables?.seed).toBe(seed);
    });

    it("exposes an empty list while the request is in flight", () => {
        mockQueryResult({ loading: true, data: undefined });

        const { result } = renderAlbumCards();

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("exposes the loading state while the request is in flight", () => {
        mockQueryResult({ loading: true, data: undefined });

        const { result } = renderAlbumCards();

        expect(result.current.loading).toBe(true);
        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
    });

    it("exposes the parsed albums when the response is valid", () => {
        mockQueryResult({ loading: false, data: { getAlbums: albums } });

        const { result } = renderAlbumCards();

        expect(result.current.data).toEqual(albums);
        expect(result.current.hasData).toBe(true);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("reports an empty result without logging for an empty array", () => {
        mockQueryResult({ loading: false, data: { getAlbums: [] } });

        const { result } = renderAlbumCards();

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns an empty list without logging when the response has no data field", () => {
        mockQueryResult({ loading: false, data: {} });

        const { result } = renderAlbumCards();

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns an empty list without logging when Apollo returns null data", () => {
        mockQueryResult({ loading: false, data: null });

        const { result } = renderAlbumCards();

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("does not use the artist payload to answer the album query", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: albums } });

        const { result } = renderAlbumCards();

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("rejects the whole list when a single album is invalid", () => {
        mockQueryResult({
            loading: false,
            data: { getAlbums: [albums[0], { ...albums[1], album_cover: "javascript:alert(1)" }] },
        });

        const { result } = renderAlbumCards();

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it.each(invalidAlbums)("rejects a list containing $label", ({ payload }) => {
        mockQueryResult({ loading: false, data: { getAlbums: [payload] } });

        const { result } = renderAlbumCards();

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it.each([
        { label: "a plain object", payload: { id: 10, name: "In Rainbows" } },
        { label: "a string", payload: "not-an-array" },
        { label: "null", payload: null },
    ])("returns an empty list and logs when the payload is $label", ({ payload }) => {
        mockQueryResult({ loading: false, data: { getAlbums: payload } });

        const { result } = renderAlbumCards();

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it("strips unknown fields from every album", () => {
        mockQueryResult({
            loading: false,
            data: {
                getAlbums: [
                    { ...albums[0], songs: ["Nude"], injected: "<script>alert(1)</script>" },
                    { ...albums[1], year: 2001 },
                ],
            },
        });

        const { result } = renderAlbumCards();

        expect(result.current.data).toEqual(albums);
        expect(result.current.data[0]).not.toHaveProperty("songs");
        expect(result.current.data[0]).not.toHaveProperty("injected");
        expect(result.current.data[1]).not.toHaveProperty("year");
    });

    it("coerces numeric string IDs to numbers", () => {
        mockQueryResult({ loading: false, data: { getAlbums: [{ ...albums[0], id: "42" }] } });

        const { result } = renderAlbumCards();

        expect(result.current.data[0].id).toBe(42);
    });

    it("keeps every album when the page is full", () => {
        const manyAlbums = Array.from({ length: 20 }, (_, index) => ({
            ...albums[0],
            id: index + 1,
            name: `Album ${index + 1}`,
        }));
        mockQueryResult({ loading: false, data: { getAlbums: manyAlbums } });

        const { result } = renderAlbumCards();

        expect(result.current.data).toHaveLength(20);
        expect(result.current.data[19].id).toBe(20);
        expect(result.current.hasData).toBe(true);
    });

    it("fetches the next page when onLoadMore is called", () => {
        mockQueryResult({ loading: false, data: { getAlbums: albums } });
        const { result } = renderAlbumCards();

        act(() => result.current.onLoadMore());

        expect(mockFetchMore).toHaveBeenCalledTimes(1);
        expect(mockFetchMore).toHaveBeenCalledWith({ variables: { page: 2, limit: 20 } });
    });

    it("advances the page on every onLoadMore call", () => {
        mockQueryResult({ loading: false, data: { getAlbums: albums } });
        const { result } = renderAlbumCards();

        act(() => result.current.onLoadMore());
        act(() => result.current.onLoadMore());

        expect(mockFetchMore).toHaveBeenNthCalledWith(1, { variables: { page: 2, limit: 20 } });
        expect(mockFetchMore).toHaveBeenNthCalledWith(2, { variables: { page: 3, limit: 20 } });
    });

    it("keeps showing parsed data after an onLoadMore call", () => {
        mockQueryResult({ loading: false, data: { getAlbums: albums } });
        const { result } = renderAlbumCards();

        act(() => result.current.onLoadMore());

        expect(result.current.data).toEqual(albums);
        expect(result.current.hasData).toBe(true);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("keeps paginating safely when the current payload is invalid", () => {
        mockQueryResult({ loading: false, data: { getAlbums: "broken" } });
        const { result } = renderAlbumCards();

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);

        act(() => result.current.onLoadMore());

        expect(mockFetchMore).toHaveBeenCalledWith({ variables: { page: 2, limit: 20 } });
        expect(result.current.data).toEqual([]);
    });

    it("keeps the parsed list stable across re-renders and does not log again", () => {
        mockQueryResult({ loading: false, data: { getAlbums: albums } });
        const { result, rerender } = renderAlbumCards();
        const firstData = result.current.data;

        rerender();
        rerender();

        expect(result.current.data).toBe(firstData);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
});
