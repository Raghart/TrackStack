import { vi } from "vitest";
import { getSongData } from "@/queries/DetailQueries";
import {
    createTestStore,
    getLastQuery,
    getQueryOptions,
    mockQueryResult,
    renderSongDetails,
    resetQueryMock,
    TestStore,
    validFullSong,
} from "@/test/songDetailsSetups";

const invalidIds = [
    { label: "zero", value: 0 },
    { label: "negative", value: -1 },
    { label: "decimal", value: 1.5 },
    { label: "NaN", value: Number.NaN },
    { label: "Infinity", value: Number.POSITIVE_INFINITY },
    { label: "non-numeric string", value: "abc" as unknown as number },
    { label: "decimal string", value: "1.5" as unknown as number },
    { label: "empty string", value: "" as unknown as number },
];

describe("useSongDetails", () => {
    let store: TestStore;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        resetQueryMock();
        store = createTestStore();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("queries the song by its ID with the expected GraphQL document and variables", () => {
        mockQueryResult({ loading: false, data: { getSongData: validFullSong } });

        renderSongDetails(store, 42);

        expect(getLastQuery()).toBe(getSongData);
        expect(getQueryOptions()).toMatchObject({ variables: { SongID: 42 } });
    });

    it("exposes the parsed song and reports it as not loading", () => {
        mockQueryResult({ loading: false, data: { getSongData: validFullSong } });

        const { result } = renderSongDetails(store, 42);

        expect(result.current.loading).toBe(false);
        expect(result.current.songData).toEqual(validFullSong);
    });

    it("stores the parsed song without starting playback", () => {
        mockQueryResult({ loading: false, data: { getSongData: validFullSong } });

        renderSongDetails(store, 42);

        expect(store.getState().songs.songState).toEqual({
            activeSong: validFullSong,
            isPlaying: false,
        });
    });

    it("does not touch the store while the request is in flight", () => {
        mockQueryResult({ loading: true, data: undefined });

        const { result } = renderSongDetails(store, 42);

        expect(result.current.loading).toBe(true);
        expect(result.current.songData).toBeUndefined();
        expect(store.getState().songs.songState.activeSong).toBeNull();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns undefined without logging when the query has no data yet", () => {
        mockQueryResult({ loading: true });

        const { result } = renderSongDetails(store, 42);

        expect(result.current.songData).toBeUndefined();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("returns undefined without logging when getSongData is null or undefined", () => {
        mockQueryResult({ loading: false, data: { getSongData: undefined } });

        const { result } = renderSongDetails(store, 42);
        expect(result.current.songData).toBeUndefined();

        mockQueryResult({ loading: false, data: { getSongData: null } });
        const { result: nullResult } = renderSongDetails(store, 42);

        expect(nullResult.current.songData).toBeUndefined();
        expect(store.getState().songs.songState.activeSong).toBeNull();
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
            label: "an invalid ID in the payload",
            payload: { ...validFullSong, id: 0 },
        },
        {
            label: "a javascript: preview URL",
            payload: { ...validFullSong, url_preview: "javascript:alert(1)" },
        },
        {
            label: "an http URL without a host",
            payload: { ...validFullSong, album_cover: "https://" },
        },
        {
            label: "an oversized name",
            payload: { ...validFullSong, name: "a".repeat(2049) },
        },
        {
            label: "an out-of-range year",
            payload: { ...validFullSong, year: 1200 },
        },
        {
            label: "a non-positive duration",
            payload: { ...validFullSong, duration: -3 },
        },
        {
            label: "a malformed Spotify ID",
            payload: { ...validFullSong, spotify_id: "not-a-spotify-id" },
        },
    ])("rejects $label without mutating the store", ({ payload }) => {
        mockQueryResult({ loading: false, data: { getSongData: payload } });

        const { result } = renderSongDetails(store, 42);

        expect(result.current.loading).toBe(false);
        expect(result.current.songData).toBeUndefined();
        expect(store.getState().songs.songState.activeSong).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it("does not overwrite a previously loaded song with an invalid payload", () => {
        mockQueryResult({ loading: false, data: { getSongData: validFullSong } });
        const { rerender } = renderSongDetails(store, 42);

        expect(store.getState().songs.songState.activeSong).toEqual(validFullSong);

        mockQueryResult({
            loading: false,
            data: { getSongData: { ...validFullSong, url_preview: "not-a-url" } },
        });
        rerender({ id: 42 });

        expect(store.getState().songs.songState.activeSong).toEqual(validFullSong);
        expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("strips unknown fields from the response", () => {
        mockQueryResult({
            loading: false,
            data: { getSongData: { ...validFullSong, injected: "<script>alert(1)</script>" } },
        });

        const { result } = renderSongDetails(store, 42);

        expect(result.current.songData).toEqual(validFullSong);
        expect(result.current.songData).not.toHaveProperty("injected");
    });

    it("keeps the parsed song stable across re-renders when the data has not changed", () => {
        const response = { loading: false, data: { getSongData: validFullSong } };
        mockQueryResult(response);
        const { result, rerender } = renderSongDetails(store, 42);
        const firstSongData = result.current.songData;

        rerender({ id: 42 });

        expect(result.current.songData).toBe(firstSongData);
    });

    it("only dispatches the song once per response", () => {
        const dispatchSpy = vi.spyOn(store, "dispatch");
        mockQueryResult({ loading: false, data: { getSongData: validFullSong } });
        const { rerender } = renderSongDetails(store, 42);

        rerender({ id: 42 });

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });

    it("queries the new song and replaces the stored one when the ID changes", () => {
        const firstSong = { ...validFullSong, id: 1, name: "Nude" };
        const secondSong = { ...validFullSong, id: 2, name: "Weird Fishes" };
        mockQueryResult({ loading: false, data: { getSongData: firstSong } });
        const { result, rerender } = renderSongDetails(store, 1);

        expect(result.current.songData).toEqual(firstSong);

        mockQueryResult({ loading: false, data: { getSongData: secondSong } });
        rerender({ id: 2 });

        expect(getQueryOptions()).toMatchObject({ variables: { SongID: 2 } });
        expect(result.current.songData).toEqual(secondSong);
        expect(store.getState().songs.songState.activeSong).toEqual(secondSong);
    });

    it("does not query or mutate the store when the song ID is undefined", () => {
        mockQueryResult({ loading: false, data: undefined });

        const { result } = renderSongDetails(store, undefined as unknown as number);

        expect(getQueryOptions().skip).toBe(true);
        expect(result.current.loading).toBe(false);
        expect(result.current.songData).toBeUndefined();
        expect(store.getState().songs.songState.activeSong).toBeNull();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it.each(invalidIds)("does not query or mutate the store for $label IDs", ({ value }) => {
        mockQueryResult({ loading: false, data: undefined });

        const { result } = renderSongDetails(store, value);

        expect(getQueryOptions().skip).toBe(true);
        expect(result.current.loading).toBe(false);
        expect(result.current.songData).toBeUndefined();
        expect(store.getState().songs.songState.activeSong).toBeNull();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
});
