import { act, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { getSongData } from "@/queries/DetailQueries";
import { validFullSong } from "@/test/songFixtures";
import {
    getLazyQueryDocument,
    mockGetSongID,
    mockToasterCreate,
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
        expect(mockToasterCreate).not.toHaveBeenCalled();
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
            expect(mockToasterCreate).not.toHaveBeenCalled();
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

    it("notifies the user with a generic message when the query rejects", async () => {
        const failure = new Error("database credentials leaked");
        mockGetSongID.mockRejectedValue(failure);
        setSongId("42");

        const { result } = renderSongCover();

        await waitFor(() => expect(mockToasterCreate).toHaveBeenCalledTimes(1));

        expect(result.current).toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Unable to get the song cover",
            failure,
        );
        expect(mockToasterCreate).toHaveBeenCalledWith({
            type: "error",
            title: "Cover unavailable",
            description: "We couldn't load the song cover. Please try again.",
            meta: { closable: true },
        });
        expect(JSON.stringify(mockToasterCreate.mock.calls)).not.toContain(
            "database credentials leaked",
        );
    });

    it("notifies the user when Apollo returns an error without rejecting", async () => {
        const failure = new Error("internal stack trace");
        mockGetSongID.mockResolvedValue({ error: failure });
        setSongId("42");

        renderSongCover();

        await waitFor(() => expect(mockToasterCreate).toHaveBeenCalledTimes(1));

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Unable to get the song cover",
            failure,
        );
        expect(mockToasterCreate).toHaveBeenCalledWith(
            expect.objectContaining({ type: "error", title: "Cover unavailable" }),
        );
        expect(JSON.stringify(mockToasterCreate.mock.calls)).not.toContain(
            "internal stack trace",
        );
    });

    it("notifies only once for a single failed request", async () => {
        mockGetSongID.mockRejectedValue(new Error("offline"));
        setSongId("42");

        const { rerender } = renderSongCover();

        await waitFor(() => expect(mockToasterCreate).toHaveBeenCalledTimes(1));

        rerender();
        rerender();

        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
        expect(mockGetSongID).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("notifies again when a new route request also fails", async () => {
        mockGetSongID
            .mockRejectedValueOnce(new Error("offline"))
            .mockRejectedValueOnce(new Error("offline again"));
        setSongId("42");

        const { rerender } = renderSongCover();

        await waitFor(() => expect(mockToasterCreate).toHaveBeenCalledTimes(1));

        setSongId("43");
        rerender();

        await waitFor(() => expect(mockToasterCreate).toHaveBeenCalledTimes(2));
        expect(mockGetSongID).toHaveBeenLastCalledWith({ variables: { SongID: 43 } });
    });

    it("ignores a stale failure when the route changed before it resolved", async () => {
        const first = deferred<unknown>();
        const second = deferred<unknown>();
        mockGetSongID.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
        setSongId("42");

        const { rerender } = renderSongCover();

        setSongId("43");
        rerender();

        await act(async () => {
            second.resolve({ data: {} });
            await second.promise;
        });
        await act(async () => {
            first.reject(new Error("stale failure"));
            await first.promise.catch(() => undefined);
        });

        expect(mockGetSongID).toHaveBeenCalledTimes(2);
        expect(mockToasterCreate).not.toHaveBeenCalled();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
});

type Deferred<T> = {
    promise: Promise<T>;
    reject: (reason?: unknown) => void;
    resolve: (value: T) => void;
};

const deferred = <T,>(): Deferred<T> => {
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, reject, resolve };
};
