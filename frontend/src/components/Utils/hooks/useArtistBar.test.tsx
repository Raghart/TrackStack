import { act } from "@testing-library/react";
import { vi } from "vitest";
import { getAllArtists } from "@/queries/DetailQueries";
import {
    artists,
    getLastQuery,
    getQueryOptions,
    getQueryOptionsHistory,
    invalidArtists,
    mockBreakpointLimit,
    mockQueryResult,
    renderArtistBar,
    resetArtistBarMocks,
} from "@/test/artistBarSetups";

describe("useArtistBar", () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        resetArtistBarMocks();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        vi.restoreAllMocks();
    });

    it("queries the artists with the expected document and initial variables", () => {
        mockQueryResult({ loading: true });

        renderArtistBar();

        expect(getLastQuery()).toBe(getAllArtists);
        expect(getQueryOptions().variables).toEqual({
            seed: expect.stringMatching(/^\d+$/),
            page: 1,
            limit: 10,
        });
        expect(getQueryOptions().skip).toBe(false);
    });

    it("uses the limit reported by the breakpoint value", () => {
        mockBreakpointLimit(7);
        mockQueryResult({ loading: true });

        const { result } = renderArtistBar();

        expect(result.current.limit).toBe(7);
        expect(getQueryOptions().variables?.limit).toBe(7);
    });

    it("skips the query while the breakpoint has no limit yet", () => {
        mockBreakpointLimit(undefined);
        mockQueryResult({ loading: true });

        const { result } = renderArtistBar();

        expect(result.current.limit).toBeUndefined();
        expect(getQueryOptions().skip).toBe(true);
    });

    it("starts on page 1", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });

        const { result } = renderArtistBar();

        expect(result.current.page).toBe(1);
    });

    it("derives a numeric-only seed from Math.random", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.987654321);
        mockQueryResult({ loading: true });

        renderArtistBar();

        expect(getQueryOptions().variables?.seed).toBe("987654321000000");
    });

    it("generates a numeric seed even for the edge values of Math.random", () => {
        const spy = vi.spyOn(Math, "random");
        mockQueryResult({ loading: true });

        spy.mockReturnValue(0);
        const { unmount } = renderArtistBar();
        expect(getQueryOptions().variables?.seed).toBe("0");
        unmount();

        spy.mockReturnValue(1e-8);
        renderArtistBar();
        expect(getQueryOptions().variables?.seed).toBe("10000000");
    });

    it("never generates an empty seed", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);
        mockQueryResult({ loading: true });

        renderArtistBar();

        expect(getQueryOptions().variables?.seed).not.toBe("");
    });

    it("keeps the seed stable across re-renders", () => {
        mockQueryResult({ loading: true });
        const { rerender } = renderArtistBar();
        const seed = getQueryOptions().variables?.seed;

        rerender();
        rerender();

        expect(getQueryOptions().variables?.seed).toBe(seed);
    });

    it("exposes the parsed artists when the response is valid", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });

        const { result } = renderArtistBar();

        expect(result.current.artists).toEqual(artists);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns an empty list without logging when the request is in flight", () => {
        mockQueryResult({ loading: true, data: undefined });

        const { result } = renderArtistBar();

        expect(result.current.artists).toEqual([]);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("reports an empty result without logging for an empty array", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: [] } });

        const { result } = renderArtistBar();

        expect(result.current.artists).toEqual([]);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns an empty list without logging when the response has no data field", () => {
        mockQueryResult({ loading: false, data: {} });

        const { result } = renderArtistBar();

        expect(result.current.artists).toEqual([]);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns an empty list without logging when Apollo returns null data", () => {
        mockQueryResult({ loading: false, data: null });

        const { result } = renderArtistBar();

        expect(result.current.artists).toEqual([]);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("ignores a payload stored under another field", () => {
        mockQueryResult({ loading: false, data: { getAlbums: artists } });

        const { result } = renderArtistBar();

        expect(result.current.artists).toEqual([]);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("rejects the whole list when a single artist is invalid", () => {
        mockQueryResult({
            loading: false,
            data: { getAllArtists: [artists[0], { ...artists[1], id: "broken" }] },
        });

        const { result } = renderArtistBar();

        expect(result.current.artists).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it.each(invalidArtists)("rejects a list containing $label", ({ payload }) => {
        mockQueryResult({ loading: false, data: { getAllArtists: [payload] } });

        const { result } = renderArtistBar();

        expect(result.current.artists).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it.each([
        { label: "a plain object", payload: { id: 1, name: "Radiohead" } },
        { label: "a string", payload: "not-an-array" },
        { label: "null", payload: null },
    ])("returns an empty list and logs when the payload is $label", ({ payload }) => {
        mockQueryResult({ loading: false, data: { getAllArtists: payload } });

        const { result } = renderArtistBar();

        expect(result.current.artists).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it("strips unknown fields from every artist", () => {
        mockQueryResult({
            loading: false,
            data: {
                getAllArtists: [
                    { ...artists[0], albums: ["In Rainbows"], injected: "<script>alert(1)</script>" },
                    { ...artists[1], genre: "Trip Hop" },
                ],
            },
        });

        const { result } = renderArtistBar();

        expect(result.current.artists).toEqual(artists);
        expect(result.current.artists[0]).not.toHaveProperty("albums");
        expect(result.current.artists[0]).not.toHaveProperty("injected");
        expect(result.current.artists[1]).not.toHaveProperty("genre");
    });

    it("coerces numeric string IDs to numbers", () => {
        mockQueryResult({
            loading: false,
            data: { getAllArtists: [{ ...artists[0], id: "42" }] },
        });

        const { result } = renderArtistBar();

        expect(result.current.artists[0].id).toBe(42);
    });

    it("trims surrounding whitespace from artist names", () => {
        mockQueryResult({
            loading: false,
            data: { getAllArtists: [{ ...artists[0], name: "  Radiohead  " }] },
        });

        const { result } = renderArtistBar();

        expect(result.current.artists[0].name).toBe("Radiohead");
    });

    it("keeps every artist when the page is full", () => {
        const manyArtists = Array.from({ length: 10 }, (_, index) => ({
            ...artists[0],
            id: index + 1,
            name: `Artist ${index + 1}`,
        }));
        mockQueryResult({ loading: false, data: { getAllArtists: manyArtists } });

        const { result } = renderArtistBar();

        expect(result.current.artists).toHaveLength(10);
        expect(result.current.artists[9].id).toBe(10);
    });

    it("keeps the parsed list referentially stable across re-renders", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });
        const { result, rerender } = renderArtistBar();
        const firstArtists = result.current.artists;

        rerender();
        rerender();

        expect(result.current.artists).toBe(firstArtists);
    });

    it("queries the next page when setPage is called", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });
        const { result } = renderArtistBar();
        const seed = getQueryOptions().variables?.seed;

        act(() => result.current.setPage(2));

        expect(result.current.page).toBe(2);
        expect(getQueryOptions().variables).toEqual({ seed, page: 2, limit: 10 });
    });

    it("queries pages sequentially across setPage calls", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });
        const { result } = renderArtistBar();
        const seed = getQueryOptions().variables?.seed;

        act(() => result.current.setPage(2));
        act(() => result.current.setPage(3));

        const history = getQueryOptionsHistory().map((options) => options.variables);
        expect(history).toEqual(
            expect.arrayContaining([
                { seed, page: 1, limit: 10 },
                { seed, page: 2, limit: 10 },
                { seed, page: 3, limit: 10 },
            ]),
        );
        expect(result.current.page).toBe(3);
    });

    it("supports a functional page updater", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });
        const { result } = renderArtistBar();

        act(() => result.current.setPage((currentPage) => currentPage + 1));

        expect(result.current.page).toBe(2);
        expect(getQueryOptions().variables?.page).toBe(2);
    });

    it.each([0, -3, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
        "ignores the invalid page %s",
        (invalidPage) => {
            mockQueryResult({ loading: false, data: { getAllArtists: artists } });
            const { result } = renderArtistBar();

            act(() => result.current.setPage(invalidPage));

            expect(result.current.page).toBe(1);
            expect(getQueryOptions().variables?.page).toBe(1);
        },
    );

    it("uses a stable seed while paginating", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });
        const { result } = renderArtistBar();
        const seed = getQueryOptions().variables?.seed;

        act(() => result.current.setPage(2));
        act(() => result.current.setPage(3));

        for (const variables of getQueryOptionsHistory().map((options) => options.variables)) {
            expect(variables?.seed).toBe(seed);
        }
    });

    it("keeps showing parsed artists after pagination", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });
        const { result } = renderArtistBar();

        act(() => result.current.setPage(2));

        expect(result.current.artists).toEqual(artists);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("keeps the query skipped on page changes while the breakpoint has no limit", () => {
        mockBreakpointLimit(undefined);
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });
        const { result } = renderArtistBar();

        act(() => result.current.setPage(2));

        expect(result.current.page).toBe(2);
        expect(getQueryOptions().skip).toBe(true);
        expect(getQueryOptions().variables?.page).toBe(2);
    });

    it("queries with the new limit when the breakpoint changes", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });
        const { result, rerender } = renderArtistBar();
        const seed = getQueryOptions().variables?.seed;

        mockBreakpointLimit(5);
        rerender();

        expect(result.current.limit).toBe(5);
        expect(getQueryOptions().variables).toEqual({ seed, page: 1, limit: 5 });
        expect(getQueryOptions().skip).toBe(false);
    });

    it("resumes querying when the breakpoint limit becomes available", () => {
        mockBreakpointLimit(undefined);
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });
        const { rerender } = renderArtistBar();
        const seed = getQueryOptions().variables?.seed;

        expect(getQueryOptions().skip).toBe(true);

        mockBreakpointLimit(10);
        rerender();

        expect(getQueryOptions().skip).toBe(false);
        expect(getQueryOptions().variables).toEqual({ seed, page: 1, limit: 10 });
    });

    it("keeps paginating safely when the current payload is invalid", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: "broken" } });
        const { result } = renderArtistBar();

        expect(result.current.artists).toEqual([]);

        act(() => result.current.setPage(2));

        expect(getQueryOptions().variables).toEqual({
            seed: expect.stringMatching(/^\d+$/),
            page: 2,
            limit: 10,
        });
        expect(result.current.artists).toEqual([]);
    });

    it("does not log a validation error again when re-rendering a valid payload", () => {
        mockQueryResult({ loading: false, data: { getAllArtists: artists } });
        const { rerender } = renderArtistBar();

        rerender();
        rerender();

        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
});
