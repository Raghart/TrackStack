import { advanceDebounce, createTestStore, DEBOUNCE_MS, deferred, mockGetResults, mockToasterCreate, renderSearchHook, successResponse, TestStore, validResults } from "@/test/searchConstants";
import { act } from "@testing-library/react";
import { vi } from "vitest";

describe("useSearchResults", () => {
    let store: TestStore;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.useFakeTimers();
        mockGetResults.mockReset();
        mockToasterCreate.mockReset();
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        store = createTestStore();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        vi.useRealTimers();
    });

    it("starts idle and exposes an empty local query", () => {
        const { result } = renderSearchHook(store);

        expect(result.current.localQuery).toBe("");
        expect(store.getState().search).toMatchObject({
            query: "",
            results: null,
            isLoading: false,
            status: "idle",
        });
    });

    it("debounces consecutive keystrokes and only searches the last query", async () => {
        mockGetResults.mockResolvedValue(successResponse(validResults));
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("r"));
        act(() => result.current.handleQueryChange("ra"));
        act(() => result.current.handleQueryChange("rad"));

        expect(result.current.localQuery).toBe("rad");

        await act(async () => {
            await vi.advanceTimersByTimeAsync(DEBOUNCE_MS - 1);
        });
        expect(mockGetResults).not.toHaveBeenCalled();

        await advanceDebounce();

        expect(mockGetResults).toHaveBeenCalledTimes(1);
        expect(mockGetResults).toHaveBeenCalledWith({ variables: { query: "rad" } });
    });

    it("runs a valid query, trims it and stores the parsed results", async () => {
        mockGetResults.mockResolvedValue(successResponse(validResults));
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("  Nude  "));
        expect(store.getState().search.status).toBe("idle");

        await advanceDebounce();

        expect(mockGetResults).toHaveBeenCalledWith({ variables: { query: "Nude" } });
        expect(store.getState().search).toMatchObject({
            query: "Nude",
            results: validResults,
            isLoading: false,
            status: "success",
        });
    });

    it("marks loading while the request is in flight", async () => {
        const request = deferred<unknown>();
        mockGetResults.mockReturnValue(request.promise);
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("Nude"));

        await advanceDebounce();

        expect(store.getState().search).toMatchObject({ isLoading: true, status: "loading" });

        await act(async () => {
            request.resolve(successResponse(validResults));
            await request.promise;
        });

        expect(store.getState().search).toMatchObject({ isLoading: false, status: "success" });
    });

    it("reports an empty status when the payload has no results", async () => {
        mockGetResults.mockResolvedValue(
            successResponse({ artistResults: [], albumResults: [], songResults: [] }),
        );
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("nothing"));
        await advanceDebounce();

        expect(store.getState().search).toMatchObject({
            query: "nothing",
            results: null,
            isLoading: false,
            status: "empty",
        });
    });

    it("flags an invalid payload and notifies once", async () => {
        mockGetResults.mockResolvedValue(
            successResponse({ artistResults: "not-an-array", albumResults: [], songResults: [] }),
        );
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("broken"));
        await advanceDebounce();

        expect(store.getState().search).toMatchObject({
            results: null,
            isLoading: false,
            status: "invalid-payload",
        });
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
        expect(mockToasterCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "error",
                title: "Search results unavailable",
            }),
        );
    });

    it("treats a missing multipleSearch field as an invalid payload", async () => {
        mockGetResults.mockResolvedValue({ data: {} });
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("missing"));
        await advanceDebounce();

        expect(store.getState().search.status).toBe("invalid-payload");
        expect(store.getState().search.isLoading).toBe(false);
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
    });

    it("reports a network error when the query resolves with an error", async () => {
        mockGetResults.mockResolvedValue({ error: new Error("offline") });
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("offline"));
        await advanceDebounce();

        expect(store.getState().search).toMatchObject({
            results: null,
            isLoading: false,
            status: "network-error",
        });
        expect(mockToasterCreate).toHaveBeenCalledWith(
            expect.objectContaining({ type: "error", title: "Search unavailable" }),
        );
        expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("reports a network error when the query rejects", async () => {
        mockGetResults.mockRejectedValue(new Error("boom"));
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("crash"));
        await advanceDebounce();

        expect(store.getState().search).toMatchObject({
            results: null,
            isLoading: false,
            status: "network-error",
        });
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
    });

    it("deduplicates repeated notifications for the same failing query", async () => {
        mockGetResults.mockResolvedValue({ error: new Error("offline") });
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("offline"));
        await advanceDebounce();
        act(() => result.current.handleQueryChange("offline"));
        await advanceDebounce();

        expect(mockGetResults).toHaveBeenCalledTimes(2);
        expect(mockToasterCreate).toHaveBeenCalledTimes(1);
    });

    it("notifies again after a successful request resets the deduplication", async () => {
        mockGetResults
            .mockResolvedValueOnce({ error: new Error("offline") })
            .mockResolvedValueOnce(successResponse(validResults))
            .mockResolvedValueOnce({ error: new Error("offline") });
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("nod"));
        await advanceDebounce();
        act(() => result.current.handleQueryChange("nude"));
        await advanceDebounce();
        act(() => result.current.handleQueryChange("nude"));
        await advanceDebounce();

        expect(mockToasterCreate).toHaveBeenCalledTimes(2);
    });

    it("ignores the response of a superseded request", async () => {
        const first = deferred<unknown>();
        const second = deferred<unknown>();
        mockGetResults.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("first"));
        await advanceDebounce();
        act(() => result.current.handleQueryChange("second"));
        await advanceDebounce();

        expect(mockGetResults).toHaveBeenCalledTimes(2);

        await act(async () => {
            second.resolve(
                successResponse({
                    ...validResults,
                    songResults: [{ ...validResults.songResults[0], name: "Second" }],
                }),
            );
            await second.promise;
        });

        expect(store.getState().search.status).toBe("success");
        expect(store.getState().search.results?.songResults[0].name).toBe("Second");

        await act(async () => {
            first.resolve(successResponse(validResults));
            await first.promise;
        });

        expect(store.getState().search.results?.songResults[0].name).toBe("Second");
        expect(store.getState().search.isLoading).toBe(false);
    });

    it("ignores an error from a superseded request without notifying", async () => {
        const first = deferred<unknown>();
        const second = deferred<unknown>();
        mockGetResults.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("first"));
        await advanceDebounce();
        act(() => result.current.handleQueryChange("second"));
        await advanceDebounce();

        await act(async () => {
            second.resolve(successResponse(validResults));
            await second.promise;
        });
        await act(async () => {
            first.reject(new Error("late failure"));
            await first.promise.catch(() => undefined);
        });

        expect(store.getState().search.status).toBe("success");
        expect(mockToasterCreate).not.toHaveBeenCalled();
    });

    it("clears state and ignores in-flight responses on clearSearch", async () => {
        const request = deferred<unknown>();
        mockGetResults.mockReturnValue(request.promise);
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("Nude"));
        await advanceDebounce();
        act(() => result.current.clearSearch());

        expect(result.current.localQuery).toBe("");
        expect(store.getState().search).toMatchObject({
            query: "",
            results: null,
            isLoading: false,
            status: "idle",
        });

        await act(async () => {
            request.resolve(successResponse(validResults));
            await request.promise;
        });

        expect(store.getState().search).toMatchObject({
            results: null,
            isLoading: false,
            status: "idle",
        });
    });

    it("cancels the pending debounced search on unmount", async () => {
        const { result, unmount } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("Nude"));
        unmount();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
        });

        expect(mockGetResults).not.toHaveBeenCalled();
    });

    it("lets an in-flight request settle in Redux after unmount", async () => {
        const request = deferred<unknown>();
        mockGetResults.mockReturnValue(request.promise);
        const { result, unmount } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("Nude"));
        await advanceDebounce();
        unmount();

        await act(async () => {
            request.resolve(successResponse(validResults));
            await request.promise;
        });

        expect(store.getState().search).toMatchObject({
            results: validResults,
            isLoading: false,
            status: "success",
        });
        expect(mockToasterCreate).not.toHaveBeenCalled();
    });

    it("invalidates an in-flight request when the schema rejects the next query", async () => {
        const request = deferred<unknown>();
        mockGetResults.mockReturnValue(request.promise);
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("Nude"));
        await advanceDebounce();

        act(() => result.current.handleQueryChange("a".repeat(61)));
        await advanceDebounce();

        expect(store.getState().search).toMatchObject({
            query: "",
            results: null,
            isLoading: false,
            status: "idle",
        });

        await act(async () => {
            request.resolve(successResponse(validResults));
            await request.promise;
        });

        expect(store.getState().search).toMatchObject({
            query: "",
            results: null,
            isLoading: false,
            status: "idle",
        });
    });

    it("ignores non-string input", async () => {
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange(42));
        await advanceDebounce();

        expect(result.current.localQuery).toBe("");
        expect(mockGetResults).not.toHaveBeenCalled();
    });

    it("clears the search when the query is only whitespace", async () => {
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("   "));
        await advanceDebounce();

        expect(mockGetResults).not.toHaveBeenCalled();
        expect(store.getState().search).toMatchObject({
            query: "",
            results: null,
            isLoading: false,
            status: "idle",
        });
    });

    it("does not query when the schema rejects the query length and clears the search state", async () => {
        const { result } = renderSearchHook(store);

        act(() => result.current.handleQueryChange("a".repeat(61)));
        await advanceDebounce();

        expect(mockGetResults).not.toHaveBeenCalled();
        expect(store.getState().search).toMatchObject({
            query: "",
            results: null,
            isLoading: false,
            status: "idle",
        });
        expect(result.current.localQuery).toBe("a".repeat(61));
    });
});
