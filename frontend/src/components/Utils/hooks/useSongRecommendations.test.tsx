import { act } from "@testing-library/react";
import { ApolloError } from "@apollo/client";
import { vi } from "vitest";
import {
    recommendInitialState,
    setLaraRecommendations,
    setRecommendedGenres,
    setTempo,
} from "@/reducers/recommendReducer";
import { aiSubscription } from "@/queries/LaraRecQuerie";
import generateUserVector from "@/components/Utils/generateUserVector";
import { MAX_STRING_LENGTH } from "@trackstack/schemas/zod.parsers";
import {
    createSongs,
    createTestStore,
    emitChunk,
    emitSubscriptionData,
    emitSubscriptionError,
    getSubscriptionOptions,
    mockToasterCreate,
    mockUseSubscription,
    renderSongRecommendations,
    resetSubscriptionMock,
    TestStore,
} from "@/test/songRecSetups";

describe("useSongRecommendations", () => {
    let store: TestStore;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        resetSubscriptionMock();
        mockToasterCreate.mockReset();
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        store = createTestStore();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        consoleWarnSpy.mockRestore();
    });

    it("starts with an empty AI response, no error and only the first 20 songs visible", () => {
        const songs = createSongs(45);
        store.dispatch(setLaraRecommendations(songs));

        const { result } = renderSongRecommendations(store);

        expect(result.current.aiResponse).toBe("");
        expect(result.current.error).toBeNull();
        expect(result.current.recommendations).toHaveLength(45);
        expect(result.current.visibleSongs).toHaveLength(20);
        expect(result.current.visibleSongs).toEqual(songs.slice(0, 20));
        expect(typeof result.current.loadMoreSongs).toBe("function");
    });

    it("subscribes with the genres and the user vector built from the current settings", () => {
        store.dispatch(setRecommendedGenres(["rock", "jazz"]));
        store.dispatch(setTempo(200));

        renderSongRecommendations(store);

        expect(mockUseSubscription).toHaveBeenCalled();
        expect(mockUseSubscription.mock.calls[0][0]).toBe(aiSubscription);
        expect(getSubscriptionOptions()).toMatchObject({
            shouldResubscribe: true,
            variables: { genres: ["rock", "jazz"] },
        });
        expect(getSubscriptionOptions().variables?.userVector).toEqual(
            generateUserVector(200, 0.5, 0.5, 1, 0.165, 0.15, 0.05, 0.5),
        );
    });

    it("accumulates valid chunks in arrival order, preserving whitespace", () => {
        const { result } = renderSongRecommendations(store);

        emitChunk("Here are ");
        emitChunk("three songs");
        emitChunk(":\n1. Nude");
        emitChunk(" ");

        expect(result.current.aiResponse).toBe("Here are three songs:\n1. Nude ");
    });

    it("ignores empty, null and undefined chunks without notifying the user", () => {
        const { result } = renderSongRecommendations(store);

        emitChunk("Start");
        emitChunk("");
        emitChunk(null);
        emitChunk(undefined);
        emitChunk(" end");

        expect(result.current.aiResponse).toBe("Start end");
        expect(result.current.error).toBeNull();
        expect(mockToasterCreate).not.toHaveBeenCalled();
        expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("treats a missing or malformed payload as an empty chunk", () => {
        const { result } = renderSongRecommendations(store);

        emitChunk("Text");
        emitSubscriptionData({});
        emitSubscriptionData({ data: {} });
        emitSubscriptionData({ data: { data: {} } });

        expect(result.current.aiResponse).toBe("Text");
        expect(mockToasterCreate).not.toHaveBeenCalled();
        expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("warns and ignores chunks that are not strings, null or undefined", () => {
        const { result } = renderSongRecommendations(store);

        emitChunk("Safe");
        emitChunk(42);
        emitChunk({ text: "injected" });
        emitChunk(["array"]);

        expect(result.current.aiResponse).toBe("Safe");
        expect(result.current.error).toBeNull();
        expect(consoleWarnSpy).toHaveBeenCalledTimes(3);
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            "Unable to parse the AI response chunk",
            expect.anything(),
        );
        expect(mockToasterCreate).not.toHaveBeenCalled();
    });

    it("exposes a subscription error and notifies the user once", () => {
        const failure = new ApolloError({ errorMessage: "socket closed" });
        const { result } = renderSongRecommendations(store);

        emitSubscriptionError(failure);

        expect(result.current.error).toBe(failure);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Unable to get the AI recommendations",
            failure,
        );
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
        expect(mockToasterCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "error",
                title: "Something went wrong",
                description: "We couldn't get Lara's recommendations. Please try again later.",
            }),
        );
    });

    it("deduplicates repeated errors from the same failed subscription", () => {
        const { result } = renderSongRecommendations(store);

        emitSubscriptionError(new ApolloError({ errorMessage: "first" }));
        emitSubscriptionError(new ApolloError({ errorMessage: "second" }));
        emitSubscriptionError(new ApolloError({ errorMessage: "third" }));

        expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
        expect(result.current.error).not.toBeNull();
    });

    it("recovers from an error on a valid chunk and notifies again on a new failure", () => {
        const { result } = renderSongRecommendations(store);

        emitSubscriptionError(new ApolloError({ errorMessage: "first" }));
        emitChunk("Recovered");

        expect(result.current.error).toBeNull();
        expect(result.current.aiResponse).toBe("Recovered");
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);

        emitSubscriptionError(new ApolloError({ errorMessage: "second" }));

        expect(result.current.error).not.toBeNull();
        expect(mockToasterCreate).toHaveBeenCalledTimes(2);
    });

    it("keeps error notifications deduplicated when only invalid chunks arrive in between", () => {
        const { result } = renderSongRecommendations(store);

        emitSubscriptionError(new ApolloError({ errorMessage: "first" }));
        emitChunk(42);
        emitChunk("");
        emitSubscriptionError(new ApolloError({ errorMessage: "second" }));

        expect(result.current.error).not.toBeNull();
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
    });

    it("clears the AI response, the error and the deduplication when the genres change", () => {
        const { result, rerender } = renderSongRecommendations(store);

        emitChunk("Old response");
        emitSubscriptionError(new ApolloError({ errorMessage: "first" }));

        act(() => {
            store.dispatch(setRecommendedGenres(["electronic"]));
        });
        rerender();

        expect(result.current.aiResponse).toBe("");
        expect(result.current.error).toBeNull();
        expect(getSubscriptionOptions().variables).toMatchObject({
            genres: ["electronic"],
        });

        emitSubscriptionError(new ApolloError({ errorMessage: "second" }));

        expect(mockToasterCreate).toHaveBeenCalledTimes(2);
    });

    it("clears the AI response, the error and the deduplication when the user vector changes", () => {
        const { result, rerender } = renderSongRecommendations(store);

        emitChunk("Old response");
        emitSubscriptionError(new ApolloError({ errorMessage: "first" }));

        act(() => {
            store.dispatch(setTempo(220));
        });
        rerender();

        expect(result.current.aiResponse).toBe("");
        expect(result.current.error).toBeNull();

        emitSubscriptionError(new ApolloError({ errorMessage: "second" }));

        expect(mockToasterCreate).toHaveBeenCalledTimes(2);
    });

    it("keeps the AI response when only the recommendation list changes", () => {
        const { result, rerender } = renderSongRecommendations(store);
        emitChunk("Keep me");

        act(() => {
            store.dispatch(setLaraRecommendations(createSongs(3)));
        });
        rerender();

        expect(result.current.aiResponse).toBe("Keep me");
        expect(result.current.recommendations).toHaveLength(3);
        expect(result.current.visibleSongs).toHaveLength(3);
    });

    it("loads 20 more songs per call and stops at the end of the list", () => {
        const songs = createSongs(45);
        store.dispatch(setLaraRecommendations(songs));
        const { result } = renderSongRecommendations(store);

        act(() => result.current.loadMoreSongs());
        expect(result.current.visibleSongs).toHaveLength(40);

        act(() => result.current.loadMoreSongs());
        expect(result.current.visibleSongs).toHaveLength(45);

        act(() => result.current.loadMoreSongs());
        expect(result.current.visibleSongs).toHaveLength(45);
        expect(result.current.visibleSongs).toEqual(songs);
    });

    it("does nothing when every recommendation is already visible", () => {
        const songs = createSongs(20);
        store.dispatch(setLaraRecommendations(songs));
        const { result } = renderSongRecommendations(store);

        act(() => result.current.loadMoreSongs());

        expect(result.current.visibleSongs).toHaveLength(20);
        expect(result.current.visibleSongs).toEqual(songs);
    });

    it("keeps a slice of the current recommendations instead of caching the initial list", () => {
        store.dispatch(setLaraRecommendations(createSongs(3)));
        const { result, rerender } = renderSongRecommendations(store);

        act(() => {
            store.dispatch(setLaraRecommendations(createSongs(5)));
        });
        rerender();

        expect(result.current.recommendations).toHaveLength(5);
        expect(result.current.visibleSongs).toHaveLength(5);
    });

    it("ignores chunks and errors delivered by a superseded subscription", () => {
        const { result, rerender } = renderSongRecommendations(store);
        const supersededOptions = getSubscriptionOptions();
        emitChunk("Old");

        act(() => {
            store.dispatch(setRecommendedGenres(["jazz"]));
        });
        rerender();
        emitChunk("New");

        const staleOnData = supersededOptions.onData;
        const staleOnError = supersededOptions.onError;
        if (!staleOnData || !staleOnError) throw new Error("missing subscription callbacks");
        act(() => {
            staleOnData({ data: { data: { aiResponse: " stale" } } });
            staleOnError(new ApolloError({ errorMessage: "stale failure" }));
        });

        expect(result.current.aiResponse).toBe("New");
        expect(result.current.error).toBeNull();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
        expect(mockToasterCreate).not.toHaveBeenCalled();
    });

    it("falls back to a valid user vector when the stored settings are out of range", () => {
        act(() => {
            store.dispatch(setTempo(1_000_000_000));
        });

        const { result } = renderSongRecommendations(store);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Unable to build the user vector from the current settings",
            expect.anything(),
        );
        expect(result.current.aiResponse).toBe("");
        expect(getSubscriptionOptions().variables?.userVector).toEqual(
            generateUserVector(
                recommendInitialState.tempo,
                recommendInitialState.danceability,
                recommendInitialState.energy,
                recommendInitialState.mood,
                recommendInitialState.speechLevel,
                recommendInitialState.acousticness,
                recommendInitialState.voiceType,
                recommendInitialState.sentiment,
            ),
        );
    });

    it("ignores chunks larger than the supported string length", () => {
        const { result } = renderSongRecommendations(store);

        emitChunk("Safe");
        emitChunk("a".repeat(MAX_STRING_LENGTH + 1));

        expect(result.current.aiResponse).toBe("Safe");
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            "The AI response chunk is too large and was ignored",
        );
        expect(mockToasterCreate).not.toHaveBeenCalled();
    });

    it("bounds the accumulated AI response to avoid unbounded memory growth", () => {
        const { result } = renderSongRecommendations(store);
        const chunk = "a".repeat(MAX_STRING_LENGTH);

        for (let index = 0; index < 50; index += 1) {
            emitChunk(chunk);
        }

        expect(result.current.aiResponse).toHaveLength(100_000);
        expect(result.current.aiResponse).toBe("a".repeat(100_000));
    });
});
