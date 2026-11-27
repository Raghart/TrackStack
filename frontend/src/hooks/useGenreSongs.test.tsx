import { act } from "@testing-library/react";
import { vi } from "vitest";
import { getAllGenreSongs } from "@/queries/DetailQueries";
import {
    genreSongs,
    getLastQuery,
    getQueryOptions,
    invalidGenreSongs,
    mockFetchMore,
    mockQueryResult,
    renderGenreSongs,
    resetQueryMock,
} from "@/test/detailPaginationSetups";

describe("useGenreSongs", () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        resetQueryMock();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        vi.restoreAllMocks();
    });

    it("queries the genre songs with the expected document and initial variables", () => {
        mockQueryResult({ loading: true });

        renderGenreSongs("Art Rock");

        expect(getLastQuery()).toBe(getAllGenreSongs);
        expect(getQueryOptions().variables).toEqual({
            seed: expect.stringMatching(/^\d+$/),
            genre: "Art Rock",
            page: 1,
            limit: 20,
        });
        expect(getQueryOptions().notifyOnNetworkStatusChange).toBe(true);
    });

    it("derives the seed from Math.random without the decimal prefix", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.123456789);
        mockQueryResult({ loading: true });

        renderGenreSongs("Art Rock");

        expect(getQueryOptions().variables?.seed).toBe("123456789");
    });

    it("keeps the seed stable across re-renders", () => {
        mockQueryResult({ loading: true });
        const { rerender } = renderGenreSongs("Art Rock");
        const seed = getQueryOptions().variables?.seed;

        rerender({ genre: "Art Rock" });
        rerender({ genre: "Art Rock" });

        expect(getQueryOptions().variables?.seed).toBe(seed);
    });

    it("exposes the loading state and an empty list while the request is in flight", () => {
        mockQueryResult({ loading: true, data: undefined });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.loading).toBe(true);
        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("exposes the parsed songs when the response is valid", () => {
        mockQueryResult({ loading: false, data: { getAllGenreSongs: genreSongs } });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(genreSongs);
        expect(result.current.hasData).toBe(true);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("reports an empty result without logging for an empty array", () => {
        mockQueryResult({ loading: false, data: { getAllGenreSongs: [] } });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns an empty list without logging when the response has no data field", () => {
        mockQueryResult({ loading: false, data: {} });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns an empty list without logging when Apollo returns null data", () => {
        mockQueryResult({ loading: false, data: null });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("ignores a payload stored under another field", () => {
        mockQueryResult({ loading: false, data: { getAlbums: genreSongs } });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("rejects the whole list when a single song is invalid", () => {
        mockQueryResult({
            loading: false,
            data: { getAllGenreSongs: [genreSongs[0], { ...genreSongs[1], id: "broken" }] },
        });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it.each(invalidGenreSongs)("rejects a list containing $label", ({ payload }) => {
        mockQueryResult({ loading: false, data: { getAllGenreSongs: [payload] } });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it.each([
        { label: "a plain object", payload: { id: 1, name: "Nude" } },
        { label: "a string", payload: "not-an-array" },
        { label: "null", payload: null },
    ])("returns an empty list and logs when the payload is $label", ({ payload }) => {
        mockQueryResult({ loading: false, data: { getAllGenreSongs: payload } });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it("strips unknown fields from every song", () => {
        mockQueryResult({
            loading: false,
            data: {
                getAllGenreSongs: [
                    { ...genreSongs[0], album: "In Rainbows", injected: "<script>alert(1)</script>" },
                    { ...genreSongs[1], genres: ["Art Rock"] },
                ],
            },
        });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.data).toEqual(genreSongs);
        expect(result.current.data[0]).not.toHaveProperty("album");
        expect(result.current.data[0]).not.toHaveProperty("injected");
        expect(result.current.data[1]).not.toHaveProperty("genres");
    });

    it("coerces numeric string IDs to numbers", () => {
        mockQueryResult({
            loading: false,
            data: { getAllGenreSongs: [{ ...genreSongs[0], id: "42" }] },
        });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.data[0].id).toBe(42);
    });

    it("keeps every song when the page is full", () => {
        const manySongs = Array.from({ length: 20 }, (_, index) => ({
            ...genreSongs[0],
            id: index + 1,
            name: `Track ${index + 1}`,
        }));
        mockQueryResult({ loading: false, data: { getAllGenreSongs: manySongs } });

        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.data).toHaveLength(20);
        expect(result.current.data[19].id).toBe(20);
        expect(result.current.hasData).toBe(true);
    });

    it("fetches the next page for the same genre when loadMore is called", () => {
        mockQueryResult({ loading: false, data: { getAllGenreSongs: genreSongs } });
        const { result } = renderGenreSongs("Art Rock");

        act(() => result.current.loadMore());

        expect(mockFetchMore).toHaveBeenCalledTimes(1);
        expect(mockFetchMore).toHaveBeenCalledWith({
            variables: { genre: "Art Rock", page: 2, limit: 20 },
        });
    });

    it("advances the page on every loadMore call", () => {
        mockQueryResult({ loading: false, data: { getAllGenreSongs: genreSongs } });
        const { result } = renderGenreSongs("Art Rock");

        act(() => result.current.loadMore());
        act(() => result.current.loadMore());

        expect(mockFetchMore).toHaveBeenNthCalledWith(1, {
            variables: { genre: "Art Rock", page: 2, limit: 20 },
        });
        expect(mockFetchMore).toHaveBeenNthCalledWith(2, {
            variables: { genre: "Art Rock", page: 3, limit: 20 },
        });
    });

    it("keeps paginating with the latest genre after it changes", () => {
        mockQueryResult({ loading: false, data: { getAllGenreSongs: genreSongs } });
        const { rerender, result } = renderGenreSongs("Art Rock");

        rerender({ genre: "Shoegaze" });
        act(() => result.current.loadMore());

        expect(mockFetchMore).toHaveBeenCalledWith({
            variables: { genre: "Shoegaze", page: 2, limit: 20 },
        });
    });

    it("starts the new genre at page 2 when the genre changes after paginating", () => {
        mockQueryResult({ loading: false, data: { getAllGenreSongs: genreSongs } });
        const { result, rerender } = renderGenreSongs("Art Rock");

        act(() => result.current.loadMore());
        rerender({ genre: "Shoegaze" });
        act(() => result.current.loadMore());

        expect(mockFetchMore).toHaveBeenNthCalledWith(1, {
            variables: { genre: "Art Rock", page: 2, limit: 20 },
        });
        expect(mockFetchMore).toHaveBeenNthCalledWith(2, {
            variables: { genre: "Shoegaze", page: 2, limit: 20 },
        });
    });

    it("keeps showing parsed data after a loadMore call", () => {
        mockQueryResult({ loading: false, data: { getAllGenreSongs: genreSongs } });
        const { result } = renderGenreSongs("Art Rock");

        act(() => result.current.loadMore());

        expect(result.current.data).toEqual(genreSongs);
        expect(result.current.hasData).toBe(true);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("keeps paginating safely when the current payload is invalid", () => {
        mockQueryResult({ loading: false, data: { getAllGenreSongs: "broken" } });
        const { result } = renderGenreSongs("Art Rock");

        expect(result.current.data).toEqual([]);
        expect(result.current.hasData).toBe(false);

        act(() => result.current.loadMore());

        expect(mockFetchMore).toHaveBeenCalledWith({
            variables: { genre: "Art Rock", page: 2, limit: 20 },
        });
        expect(result.current.data).toEqual([]);
    });

    it("keeps the parsed list stable across re-renders and does not log again", () => {
        mockQueryResult({ loading: false, data: { getAllGenreSongs: genreSongs } });
        const { result, rerender } = renderGenreSongs("Art Rock");
        const firstData = result.current.data;

        rerender({ genre: "Art Rock" });
        rerender({ genre: "Art Rock" });

        expect(result.current.data).toBe(firstData);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
});
