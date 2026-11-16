import { configureStore } from "@reduxjs/toolkit";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import recommendReducer from "@/reducers/recommendReducer";
import useLoadRecommendations from "@/components/Utils/hooks/useLoadRecommendations";

export const { mockGetIASongs, mockToasterCreate, mockNavigate } = vi.hoisted(() => ({
    mockGetIASongs: vi.fn(),
    mockToasterCreate: vi.fn(),
    mockNavigate: vi.fn(),
}));

vi.mock("@apollo/client", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@apollo/client")>();
    return {
        ...actual,
        useLazyQuery: () => [mockGetIASongs],
    };
});

vi.mock("@/components/ui/toasterInstance", () => ({
    toaster: { create: mockToasterCreate },
}));

vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router-dom")>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

export const createTestStore = () =>
    configureStore({
        reducer: { songData: recommendReducer },
    });

export type TestStore = ReturnType<typeof createTestStore>;

export const defaultUserVector = [
    0.5070993914807302,
    0.75,
    1,
    0.13836477987421386,
    0.1054216876049926,
    0.04004003952402441,
    0.6042296072507553,
    0.6027752778417296,
];

export const customUserVector = [
    0.20283975659229211,
    1.2000000000000002,
    0,
    0.3773584905660377,
    1.355421697778476,
    1.1711711560777138,
    0.12084592145015105,
    1.0046254630695493,
];

export const validSongs = [
    {
        id: 1,
        name: "Nude",
        artists: ["Radiohead"],
        album_cover: "https://example.com/in-rainbows.jpg",
        url_preview: "https://example.com/nude.mp3",
    },
    {
        id: 2,
        name: "Weird Fishes",
        artists: ["Radiohead"],
        album_cover: "https://example.com/in-rainbows.jpg",
        url_preview: "https://example.com/weird-fishes.mp3",
    },
];

export const successResponse = (getSongRecommendations: unknown) => ({
    data: { getSongRecommendations },
});

export const renderLoadHook = (store: TestStore) => {
    const setOpen = vi.fn();
    const hook = renderHook(() => useLoadRecommendations(setOpen), {
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    return { ...hook, setOpen };
};