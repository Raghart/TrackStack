import { vi } from "vitest";
import { getSongData } from "@/queries/DetailQueries";
import { validFullSong } from "@/test/songFixtures";
import {
    getLazyQueryDocument,
    mockGetSongID,
    renderSongCover,
    resetSongCoverMocks,
    setLazyData,
    setSongId,
} from "@/test/songCoverSetups";

const invalidSongIds = [
    { label: "undefined", value: undefined },
    { label: "empty", value: "" },
    { label: "non-numeric", value: "abc" },
    { label: "zero", value: "0" },
    { label: "negative", value: "-1" },
    { label: "decimal", value: "1.5" },
    { label: "NaN", value: "NaN" },
    { label: "Infinity", value: "Infinity" },
    { label: "mixed", value: "42abc" },
];

describe("useGetSongCover", () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        resetSongCoverMocks();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("queries the song cover with the expected document and numeric variables", () => {
        setSongId("42");

        renderSongCover();

        expect(getLazyQueryDocument()).toBe(getSongData);
        expect(mockGetSongID).toHaveBeenCalledTimes(1);
        expect(mockGetSongID).toHaveBeenCalledWith({ variables: { SongID: 42 } });
    });

    it("parses numeric route params before querying", () => {
        setSongId(" 42 ");

        renderSongCover();

        expect(mockGetSongID).toHaveBeenCalledWith({ variables: { SongID: 42 } });
    });

    it("returns undefined while there is no data", () => {
        setSongId("42");

        const { result } = renderSongCover();

        expect(result.current).toBeUndefined();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns the parsed song when the response is valid", () => {
        setSongId("42");
        setLazyData({ getSongData: validFullSong });

        const { result } = renderSongCover();

        expect(result.current).toEqual(validFullSong);
    });

    it.each(invalidSongIds)(
        "does not fire the query for a $label route param",
        ({ value }) => {
            setSongId(value);

            const { result } = renderSongCover();

            expect(mockGetSongID).not.toHaveBeenCalled();
            expect(result.current).toBeUndefined();
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        },
    );

    it("fires a new query when the route param changes", () => {
        setSongId("42");
        const { rerender } = renderSongCover();

        expect(mockGetSongID).toHaveBeenCalledTimes(1);

        setSongId("43");
        rerender();

        expect(mockGetSongID).toHaveBeenCalledTimes(2);
        expect(mockGetSongID).toHaveBeenLastCalledWith({ variables: { SongID: 43 } });
    });

    it("does not refire the query when the route param is unchanged", () => {
        setSongId("42");
        const { rerender } = renderSongCover();

        rerender();
        rerender();

        expect(mockGetSongID).toHaveBeenCalledTimes(1);
    });

    it("stops querying when the route param becomes invalid", () => {
        setSongId("42");
        const { rerender } = renderSongCover();

        setSongId("not-a-song");
        rerender();

        expect(mockGetSongID).toHaveBeenCalledTimes(1);
    });

    it("returns undefined without logging when getSongData is undefined", () => {
        setSongId("42");
        setLazyData({ getSongData: undefined });

        const { result } = renderSongCover();

        expect(result.current).toBeUndefined();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns undefined when getSongData is null", () => {
        setSongId("42");
        setLazyData({ getSongData: null });

        const { result } = renderSongCover();

        expect(result.current).toBeUndefined();
    });

    it.each([
        {
            label: "a missing required field",
            payload: { ...validFullSong, genres: undefined },
        },
        {
            label: "an incorrectly typed field",
            payload: { ...validFullSong, artists: "Radiohead" },
        },
        {
            label: "an invalid ID",
            payload: { ...validFullSong, id: 0 },
        },
        {
            label: "a javascript: cover URL",
            payload: { ...validFullSong, album_cover: "javascript:alert(1)" },
        },
        {
            label: "an http cover URL without a host",
            payload: { ...validFullSong, album_cover: "https://" },
        },
        {
            label: "an oversized name",
            payload: { ...validFullSong, name: "a".repeat(2049) },
        },
        {
            label: "a malformed Spotify ID",
            payload: { ...validFullSong, spotify_id: "not-a-spotify-id" },
        },
    ])("rejects $label and returns undefined", ({ payload }) => {
        setSongId("42");
        setLazyData({ getSongData: payload });

        const { result } = renderSongCover();

        expect(result.current).toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it("strips unknown fields from the response", () => {
        setSongId("42");
        setLazyData({
            getSongData: { ...validFullSong, injected: "<script>alert(1)</script>" },
        });

        const { result } = renderSongCover();

        expect(result.current).toEqual(validFullSong);
        expect(result.current).not.toHaveProperty("injected");
    });
});
