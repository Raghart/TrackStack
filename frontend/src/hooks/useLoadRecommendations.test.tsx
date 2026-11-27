import { act } from "@testing-library/react";
import { vi } from "vitest";
import {
    setAcousticness,
    setDanceability,
    setEnergy,
    setMood,
    setRecommendedGenres,
    setSentiment,
    setSpeechLevel,
    setTempo,
    setVoiceType,
} from "@/reducers/recommendReducer";
import { createTestStore, customUserVector, defaultUserVector, mockGetIASongs, mockNavigate, mockToasterCreate, renderLoadHook, successResponse, TestStore, validSongs } from "@/test/loadRecSetups";

describe("useLoadRecommendations", () => {
    let store: TestStore;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        mockGetIASongs.mockReset();
        mockToasterCreate.mockReset();
        mockNavigate.mockReset();
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        store = createTestStore();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("starts idle, exposes loading state and reads the recommendation settings", () => {
        const { result } = renderLoadHook(store);

        expect(result.current.loading).toBe(false);
        expect(typeof result.current.loadRecommendations).toBe("function");
        expect(mockGetIASongs).not.toHaveBeenCalled();
    });

    it("loads valid recommendations with the expected variables, stores them and navigates", async () => {
        mockGetIASongs.mockResolvedValue(successResponse(validSongs));
        dispatchSettings(store, {
            genres: ["rock", "jazz"],
            tempo: 120,
        });
        const { result, setOpen } = renderLoadHook(store);

        await act(async () => {
            await result.current.loadRecommendations();
        });

        expect(mockGetIASongs).toHaveBeenCalledTimes(1);
        expect(mockGetIASongs).toHaveBeenCalledWith({
            variables: {
                genres: ["rock", "jazz"],
                userVector: defaultUserVector,
                limit: 40,
            },
        });
        expect(store.getState().songData.results).toEqual(validSongs);
        expect(mockNavigate).toHaveBeenCalledWith("/recommendations");
        expect(mockToasterCreate).not.toHaveBeenCalled();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
        expect(setOpen).toHaveBeenCalledWith(false);
        expect(result.current.loading).toBe(false);
    });

    it("builds the user vector from the current slider settings", async () => {
        mockGetIASongs.mockResolvedValue(successResponse(validSongs));
        dispatchSettings(store, {
            genres: ["electronic"],
            tempo: 200,
            danceability: 0.2,
            energy: 0.8,
            mood: 0,
            speechLevel: 0.3,
            acousticness: 0.9,
            voiceType: 0.9,
            sentiment: 0.1,
        });
        const { result } = renderLoadHook(store);

        await act(async () => {
            await result.current.loadRecommendations();
        });

        expect(mockGetIASongs).toHaveBeenCalledWith({
            variables: {
                genres: ["electronic"],
                userVector: customUserVector,
                limit: 40,
            },
        });
    });

    it("marks loading while the request is in flight", async () => {
        const request = deferred<unknown>();
        mockGetIASongs.mockReturnValue(request.promise);
        const { result, setOpen } = renderLoadHook(store);

        let loadPromise: Promise<void> | undefined;
        act(() => {
            loadPromise = result.current.loadRecommendations();
        });

        expect(result.current.loading).toBe(true);

        await act(async () => {
            request.resolve(successResponse(validSongs));
            await loadPromise;
        });

        expect(result.current.loading).toBe(false);
        expect(setOpen).toHaveBeenCalledWith(false);
    });

    it("does not store results, navigate or close on an empty recommendation list", async () => {
        mockGetIASongs.mockResolvedValue(successResponse([]));
        const { result, setOpen } = renderLoadHook(store);

        await act(async () => {
            await result.current.loadRecommendations();
        });

        expect(store.getState().songData.results).toEqual([]);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
        expect(mockToasterCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "error",
                title: "No recommendations found",
            }),
        );
        expect(setOpen).toHaveBeenCalledWith(false);
        expect(result.current.loading).toBe(false);
    });

    it("treats a missing recommendation list as an invalid payload", async () => {
        mockGetIASongs.mockResolvedValue(successResponse(undefined));
        const { result } = renderLoadHook(store);

        await act(async () => {
            await result.current.loadRecommendations();
        });

        expect(store.getState().songData.results).toEqual([]);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
        expect(mockToasterCreate).toHaveBeenCalledWith(
            expect.objectContaining({ type: "error", title: "Recommendations unavailable" }),
        );
    });

    it("rejects an invalid payload without storing it or navigating", async () => {
        mockGetIASongs.mockResolvedValue(
            successResponse([{ ...validSongs[0], url_preview: "not-a-url" }]),
        );
        const { result } = renderLoadHook(store);

        await act(async () => {
            await result.current.loadRecommendations();
        });

        expect(store.getState().songData.results).toEqual([]);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
        expect(mockToasterCreate).toHaveBeenCalledWith(
            expect.objectContaining({ type: "error", title: "Recommendations unavailable" }),
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
        expect(result.current.loading).toBe(false);
    });

    it("reports an Apollo error result as a failure instead of an empty list", async () => {
        mockGetIASongs.mockResolvedValue({ error: new Error("offline"), data: undefined });
        const { result, setOpen } = renderLoadHook(store);

        await act(async () => {
            await result.current.loadRecommendations();
        });

        expect(store.getState().songData.results).toEqual([]);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Unable to get the song recommendations",
            expect.any(Error),
        );
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
        expect(mockToasterCreate).toHaveBeenCalledWith(
            expect.objectContaining({ type: "error", title: "Something went wrong" }),
        );
        expect(setOpen).toHaveBeenCalledWith(false);
        expect(result.current.loading).toBe(false);
    });

    it("ignores a stale response that resolves after a newer request", async () => {
        const first = deferred<unknown>();
        const second = deferred<unknown>();
        mockGetIASongs.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
        const { result } = renderLoadHook(store);

        let firstLoad: Promise<void> | undefined;
        let secondLoad: Promise<void> | undefined;
        act(() => {
            firstLoad = result.current.loadRecommendations();
        });
        act(() => {
            secondLoad = result.current.loadRecommendations();
        });

        await act(async () => {
            second.resolve(successResponse([{ ...validSongs[1], name: "Newer" }]));
            await secondLoad;
        });
        await act(async () => {
            first.resolve(successResponse([{ ...validSongs[0], name: "Stale" }]));
            await firstLoad;
        });

        expect(store.getState().songData.results.map(song => song.name)).toEqual(["Newer"]);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockToasterCreate).not.toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
    });

    it("keeps loadRecommendations stable across re-renders", () => {
        const { result, rerender } = renderLoadHook(store);
        const firstLoadRecommendations = result.current.loadRecommendations;

        rerender();

        expect(result.current.loadRecommendations).toBe(firstLoadRecommendations);
    });

    it("notifies the user and keeps the app usable when the query rejects", async () => {
        const failure = new Error("offline");
        mockGetIASongs.mockRejectedValue(failure);
        const { result, setOpen } = renderLoadHook(store);

        await act(async () => {
            await result.current.loadRecommendations();
        });

        expect(store.getState().songData.results).toEqual([]);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Unable to get the song recommendations",
            failure,
        );
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
        expect(mockToasterCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "error",
                title: "Something went wrong",
            }),
        );
        expect(setOpen).toHaveBeenCalledWith(false);
        expect(result.current.loading).toBe(false);
    });
});

type Settings = {
    genres?: string[];
    tempo?: number;
    danceability?: number;
    energy?: number;
    mood?: number;
    speechLevel?: number;
    acousticness?: number;
    voiceType?: number;
    sentiment?: number;
};

const dispatchSettings = (store: TestStore, settings: Settings) => {
    if (settings.genres) store.dispatch(setRecommendedGenres(settings.genres));
    if (settings.tempo !== undefined) store.dispatch(setTempo(settings.tempo));
    if (settings.danceability !== undefined) store.dispatch(setDanceability(settings.danceability));
    if (settings.energy !== undefined) store.dispatch(setEnergy(settings.energy));
    if (settings.mood !== undefined) store.dispatch(setMood(settings.mood));
    if (settings.speechLevel !== undefined) store.dispatch(setSpeechLevel(settings.speechLevel));
    if (settings.acousticness !== undefined) store.dispatch(setAcousticness(settings.acousticness));
    if (settings.voiceType !== undefined) store.dispatch(setVoiceType(settings.voiceType));
    if (settings.sentiment !== undefined) store.dispatch(setSentiment(settings.sentiment));
};

type Deferred<T> = {
    promise: Promise<T>;
    resolve: (value: T) => void;
};

const deferred = <T,>(): Deferred<T> => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((res) => {
        resolve = res;
    });
    return { promise, resolve };
};
