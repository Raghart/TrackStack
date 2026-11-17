import { vi } from "vitest";
import { getAllAlbumSongs, getAllArtistSongs } from "@/queries/DetailQueries";
import {
    albumSongs,
    artistSongs,
    getLastQuery,
    getQueryOptions,
    invalidSongs,
    mockQueryResult,
    renderDetailSongs,
    resetQueryMock,
    type DetailHookProps,
} from "@/test/detailSongsSetups";

describe("useGetDetailSongs", () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        resetQueryMock();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("queries album songs with the album document and the album variable", () => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: albumSongs } });

        renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(getLastQuery()).toBe(getAllAlbumSongs);
        expect(getQueryOptions().variables).toEqual({ album: "In Rainbows" });
    });

    it("queries artist songs with the artist document and the artist variable", () => {
        mockQueryResult({ loading: false, data: { getAllArtistSongs: artistSongs } });

        renderDetailSongs({ type: "artist", filterValue: "Radiohead" });

        expect(getLastQuery()).toBe(getAllArtistSongs);
        expect(getQueryOptions().variables).toEqual({ artist: "Radiohead" });
    });

    it("does not send the variable that belongs to the other detail type", () => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: albumSongs } });

        renderDetailSongs({ type: "album", filterValue: "In Rainbows" });
        expect(getQueryOptions().variables).not.toHaveProperty("artist");

        renderDetailSongs({ type: "artist", filterValue: "Radiohead" });
        expect(getQueryOptions().variables).not.toHaveProperty("album");
    });

    it("exposes the parsed album songs and reports data when the response is valid", () => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: albumSongs } });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.loading).toBe(false);
        expect(result.current.detailSongs).toEqual(albumSongs);
        expect(result.current.hasData).toBe(true);
    });

    it("exposes the parsed artist songs when the response is valid", () => {
        mockQueryResult({ loading: false, data: { getAllArtistSongs: artistSongs } });

        const { result } = renderDetailSongs({ type: "artist", filterValue: "Radiohead" });

        expect(result.current.detailSongs).toEqual(artistSongs);
        expect(result.current.hasData).toBe(true);
    });

    it("returns an empty list while the request is in flight", () => {
        mockQueryResult({ loading: true, data: undefined });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.loading).toBe(true);
        expect(result.current.detailSongs).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns an empty list without logging when the query has no data yet", () => {
        mockQueryResult({ loading: true, data: {} });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.detailSongs).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns an empty list without logging when Apollo returns null data", () => {
        mockQueryResult({ loading: false, data: null });

        const { result } = renderDetailSongs({ type: "artist", filterValue: "Radiohead" });

        expect(result.current.loading).toBe(false);
        expect(result.current.detailSongs).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("reports an empty result without logging for an empty array", () => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: [] } });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.detailSongs).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("rejects the whole list when a single song is invalid", () => {
        mockQueryResult({
            loading: false,
            data: { getAllAlbumSongs: [albumSongs[0], { ...albumSongs[1], id: "broken" }] },
        });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.detailSongs).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it.each(invalidSongs)("rejects a list containing $label", ({ payload }) => {
        mockQueryResult({
            loading: false,
            data: { getAllAlbumSongs: [payload] },
        });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.loading).toBe(false);
        expect(result.current.detailSongs).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it("rejects a null payload instead of treating it as valid data", () => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: null } });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.detailSongs).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it.each([
        { label: "a plain object", payload: { id: 1, name: "Nude" } },
        { label: "a string", payload: "not-an-array" },
    ])("returns an empty list and logs when the response is $label", ({ payload }) => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: payload } });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.detailSongs).toEqual([]);
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
                getAllAlbumSongs: [
                    { ...albumSongs[0], injected: "<script>alert(1)</script>", album: "In Rainbows" },
                    { ...albumSongs[1], genres: ["Art Rock"] },
                ],
            },
        });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.detailSongs).toEqual(albumSongs);
        expect(result.current.detailSongs[0]).not.toHaveProperty("injected");
        expect(result.current.detailSongs[0]).not.toHaveProperty("album");
        expect(result.current.detailSongs[1]).not.toHaveProperty("genres");
    });

    it("coerces numeric string IDs to numbers", () => {
        mockQueryResult({
            loading: false,
            data: { getAllAlbumSongs: [{ ...albumSongs[0], id: "42" }] },
        });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.detailSongs[0].id).toBe(42);
    });

    it("keeps every song when the album has many tracks", () => {
        const manySongs = Array.from({ length: 60 }, (_, index) => ({
            ...albumSongs[0],
            id: index + 1,
            name: `Track ${index + 1}`,
        }));
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: manySongs } });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.detailSongs).toHaveLength(60);
        expect(result.current.hasData).toBe(true);
    });

    it("re-queries with the new filter value when it changes", () => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: albumSongs } });

        const { rerender } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(getQueryOptions().variables).toEqual({ album: "In Rainbows" });

        rerender({ type: "album", filterValue: "Kid A" });

        expect(getLastQuery()).toBe(getAllAlbumSongs);
        expect(getQueryOptions().variables).toEqual({ album: "Kid A" });
    });

    it("does not use artist songs to answer an album query", () => {
        mockQueryResult({ loading: false, data: { getAllArtistSongs: artistSongs } });

        const { result } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.detailSongs).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("does not use album songs to answer an artist query", () => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: albumSongs } });

        const { result } = renderDetailSongs({ type: "artist", filterValue: "Radiohead" });

        expect(result.current.detailSongs).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("picks the field that matches the detail type when both are present", () => {
        mockQueryResult({
            loading: false,
            data: { getAllAlbumSongs: albumSongs, getAllArtistSongs: artistSongs },
        });

        const { result: albumResult } = renderDetailSongs({
            type: "album",
            filterValue: "In Rainbows",
        });
        expect(albumResult.current.detailSongs).toEqual(albumSongs);

        mockQueryResult({
            loading: false,
            data: { getAllAlbumSongs: albumSongs, getAllArtistSongs: artistSongs },
        });

        const { result: artistResult } = renderDetailSongs({
            type: "artist",
            filterValue: "Radiohead",
        });
        expect(artistResult.current.detailSongs).toEqual(artistSongs);
    });

    it("keeps the parsed list stable across re-renders when the response has not changed", () => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: albumSongs } });

        const { result, rerender } = renderDetailSongs({
            type: "album",
            filterValue: "In Rainbows",
        });
        const firstSongs = result.current.detailSongs;

        rerender({ type: "album", filterValue: "In Rainbows" });

        expect(result.current.detailSongs).toBe(firstSongs);
    });

    it("logs an invalid payload only once even after re-rendering", () => {
        mockQueryResult({
            loading: false,
            data: {
                getAllAlbumSongs: [{ ...albumSongs[0], url_preview: "javascript:alert(1)" }],
            },
        });

        const { rerender } = renderDetailSongs({ type: "album", filterValue: "In Rainbows" });

        rerender({ type: "album", filterValue: "In Rainbows" });
        rerender({ type: "album", filterValue: "In Rainbows" });

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it.each([
        { label: "an empty", value: "" },
        { label: "a whitespace-only", value: "   " },
        { label: "an oversized", value: "a".repeat(2049) },
        { label: "a non-string", value: 42 as unknown as string },
    ])("skips the query for $label filter value", ({ value }) => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: albumSongs } });

        const { result } = renderDetailSongs({ type: "album", filterValue: value });

        expect(getQueryOptions().skip).toBe(true);
        expect(result.current.loading).toBe(false);
        expect(result.current.detailSongs).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("skips the query for an unknown detail type at runtime", () => {
        mockQueryResult({ loading: false, data: { getAllArtistSongs: artistSongs } });

        const { result } = renderDetailSongs({
            type: "song" as unknown as "album",
            filterValue: "Radiohead",
        });

        expect(getQueryOptions().skip).toBe(true);
        expect(result.current.loading).toBe(false);
        expect(result.current.detailSongs).toEqual([]);
        expect(result.current.hasData).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("trims the filter value and does not skip a valid filter", () => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: albumSongs } });

        renderDetailSongs({ type: "album", filterValue: "  In Rainbows  " });

        expect(getQueryOptions().skip).toBe(false);
        expect(getQueryOptions().variables).toEqual({ album: "In Rainbows" });
    });

    it("switches the document and variable when the detail type changes", () => {
        mockQueryResult({ loading: false, data: { getAllAlbumSongs: albumSongs } });

        const { rerender } = renderDetailSongs({ type: "album", filterValue: "Radiohead" });

        expect(getLastQuery()).toBe(getAllAlbumSongs);

        mockQueryResult({ loading: false, data: { getAllArtistSongs: artistSongs } });
        rerender({ type: "artist", filterValue: "Radiohead" } as DetailHookProps);

        expect(getLastQuery()).toBe(getAllArtistSongs);
        expect(getQueryOptions().variables).toEqual({ artist: "Radiohead" });
    });
});
