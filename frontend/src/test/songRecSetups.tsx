import { act, renderHook } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import type { ApolloError } from "@apollo/client";
import type { SongResponse } from "@trackstack/schemas";
import recommendReducer from "@/reducers/recommendReducer";
import useAIStream from "@/components/Utils/hooks/useAIStream";
import useRecommendationsList from "@/components/Utils/hooks/useRecommendationsList";

const hoisted = vi.hoisted(() => ({
    mockUseSubscription: vi.fn(),
    mockToasterCreate: vi.fn(),
}));

export const { mockUseSubscription, mockToasterCreate } = hoisted;

vi.mock("@apollo/client", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@apollo/client")>();
    return {
        ...actual,
        useSubscription: hoisted.mockUseSubscription,
    };
});

vi.mock("@/components/ui/toasterInstance", () => ({
    toaster: { create: hoisted.mockToasterCreate },
}));

export type SubscriptionData = {
    data?: { data?: { aiResponse?: unknown } };
};

export type SubscriptionOptions = {
    variables?: { genres?: string[]; userVector?: number[] };
    shouldResubscribe?: boolean;
    onData?: (payload: SubscriptionData) => void;
    onError?: (error: ApolloError) => void;
};

let latestOptions: SubscriptionOptions | null = null;

hoisted.mockUseSubscription.mockImplementation(
    (_query: unknown, options: SubscriptionOptions) => {
        latestOptions = options;
        return { data: undefined, loading: false, error: undefined };
    },
);

export const resetSubscriptionMock = () => {
    latestOptions = null;
    hoisted.mockUseSubscription.mockClear();
};

export const getSubscriptionOptions = (): SubscriptionOptions => {
    if (!latestOptions) throw new Error("useSubscription was not called");
    return latestOptions;
};

const runOnData = (payload: SubscriptionData) => {
    const onData = latestOptions?.onData;
    if (!onData) throw new Error("onData was not provided to useSubscription");
    act(() => onData(payload));
};

export const emitSubscriptionData = (payload: SubscriptionData) =>
    runOnData(payload);

export const emitChunk = (chunk: unknown) =>
    runOnData({ data: { data: { aiResponse: chunk } } });

export const emitSubscriptionError = (error: ApolloError) => {
    const onError = latestOptions?.onError;
    if (!onError) throw new Error("onError was not provided to useSubscription");
    act(() => onError(error));
};

export const createTestStore = () =>
    configureStore({
        reducer: { songData: recommendReducer },
    });

export type TestStore = ReturnType<typeof createTestStore>;

export const createSong = (id: number, name = `Song ${id}`): SongResponse => ({
    id,
    name,
    artists: ["Radiohead"],
    album_cover: "https://example.com/cover.jpg",
    url_preview: "https://example.com/preview.mp3",
});

export const createSongs = (count: number): SongResponse[] =>
    Array.from({ length: count }, (_, index) => createSong(index + 1));

export const renderAIStream = (store: TestStore) =>
    renderHook(() => useAIStream(), {
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

export const renderRecommendationsList = (store: TestStore) =>
    renderHook(() => useRecommendationsList(), {
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
