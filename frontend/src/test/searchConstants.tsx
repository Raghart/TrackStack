import { act, renderHook } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";
import searchReducer from "@/reducers/searchReducer";
import { Provider } from "react-redux";
import useSearchResults from "@/hooks/useSearchResults";

const hoisted = vi.hoisted(() => ({
    mockGetResults: vi.fn(),
    mockToasterCreate: vi.fn(),
}));

export const { mockGetResults, mockToasterCreate } = hoisted;

vi.mock("@apollo/client", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@apollo/client")>();
    return {
        ...actual,
        useLazyQuery: () => [hoisted.mockGetResults],
    };
});

vi.mock("@/components/ui/toasterInstance", () => ({
    toaster: { create: hoisted.mockToasterCreate },
}));

export const DEBOUNCE_MS = 400;

export const validResults = {
    artistResults: [
        { id: 1, name: "Radiohead", album_cover: "https://example.com/artist.jpg", type: "artist" },
    ],
    albumResults: [
        {
            id: 2,
            name: "In Rainbows",
            artists: ["Radiohead"],
            album_cover: "https://example.com/album.jpg",
            type: "album",
        },
    ],
    songResults: [
        {
            id: 3,
            name: "Nude",
            artists: ["Radiohead"],
            album: "In Rainbows",
            album_cover: "https://example.com/album.jpg",
            url_preview: "https://example.com/preview.mp3",
            type: "song",
        },
    ],
};

type Deferred<T> = {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason: unknown) => void;
};

export const deferred = <T,>(): Deferred<T> => {
    let resolve!: (value: T) => void;
    let reject!: (reason: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
};

export const successResponse = (multipleSearch: unknown) => ({ data: { multipleSearch } });

export const createTestStore = () =>
    configureStore({
        reducer: { search: searchReducer },
    });

export type TestStore = ReturnType<typeof createTestStore>;

export const renderSearchHook = (store: TestStore) =>
    renderHook(() => useSearchResults(), {
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

export const advanceDebounce = async () => {
    await act(async () => {
        await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    });
};